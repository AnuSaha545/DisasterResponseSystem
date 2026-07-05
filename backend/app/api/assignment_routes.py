from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.models.assignment import Assignment
from app.models.request import EmergencyRequest
from app.models.resource import Resource

from app.schemas.assignment_schema import AssignmentCreate

from app.services.distance_service import calculate_distance

router = APIRouter(
    tags=["Assignments"]
)

@router.post("/assignments")
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db)
):

    request = (
        db.query(EmergencyRequest)
        .filter(
            EmergencyRequest.id == assignment.request_id
        )
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    resource = (
        db.query(Resource)
        .filter(
            Resource.id == assignment.resource_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    new_assignment = Assignment(
        request_id=assignment.request_id,
        resource_id=assignment.resource_id
    )

    resource.status = "assigned"
    request.status = "assigned"

    db.add(new_assignment)

    db.commit()

    db.refresh(new_assignment)

    return {
        "id": new_assignment.id,
        "request_id": new_assignment.request_id,
        "resource_id": new_assignment.resource_id,
        "resource_name": resource.name,
        "request_message": request.message,
        "status": "assigned"
    }


@router.get("/assignments")
def get_assignments(
    db: Session = Depends(get_db)
):

    assignments = db.query(
        Assignment
    ).all()

    result = []

    for assignment in assignments:

        request = (
            db.query(EmergencyRequest)
            .filter(
                EmergencyRequest.id == assignment.request_id
            )
            .first()
        )

        resource = (
            db.query(Resource)
            .filter(
                Resource.id == assignment.resource_id
            )
            .first()
        )

        distance = None
        eta = None

        if (
            request and
            resource and
            request.latitude is not None and
            request.longitude is not None and
            resource.latitude is not None and
            resource.longitude is not None
        ):

            distance = calculate_distance(
                resource.latitude,
                resource.longitude,
                request.latitude,
                request.longitude
            )

            eta = round(distance / 0.6)

        result.append({

            "id": assignment.id,

            "request_id": assignment.request_id,

            "resource_id": assignment.resource_id,

            "request_message":
                request.message
                if request else None,

            "resource_name":
                resource.name
                if resource else None,

            "request_latitude":
                request.latitude
                if request else None,

            "request_longitude":
                request.longitude
                if request else None,

            "resource_latitude":
                resource.latitude
                if resource else None,

            "resource_longitude":
                resource.longitude
                if resource else None,

            "distance_km": distance,

            "estimated_time_minutes": eta

        })
        return result