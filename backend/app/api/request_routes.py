from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.schemas.request_schema import RequestCreate
from app.schemas.status_schema import StatusUpdate

from app.models.request import EmergencyRequest

from app.services.dispatch_service import dispatch_request
from app.services.resource_allocator import suggest_resource

router = APIRouter(
    tags=["Requests"]
)

def build_request_response(request_obj: EmergencyRequest):
    return {

        "id": request_obj.id,
        "message": request_obj.message,
        "latitude": request_obj.latitude,
        "longitude": request_obj.longitude,
        "category": request_obj.category,
        "priority": request_obj.priority,
        "status": request_obj.status,
        "created_at": request_obj.created_at,
        "assigned_at": request_obj.assigned_at,
        "resolved_at": request_obj.resolved_at,
        "recommended_resource":
            suggest_resource(
                request_obj.category
            )

    }

@router.post("/requests")
def create_request(
    request: RequestCreate,
    db: Session = Depends(get_db)
):

    new_request = EmergencyRequest(
        message=request.message,
        latitude=request.latitude,
        longitude=request.longitude
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    dispatch_result = dispatch_request(
        db,
        new_request
    )

    assignment = dispatch_result["assignment"]

    return {

        **build_request_response(
            new_request
        ),

        "recommended_resource":
            dispatch_result[
                "recommended_resource"
            ],

        "assigned_resource":
            assignment["resource_name"]
            if assignment and assignment["resource_name"]
            else None,

        "assignment_status":
            assignment["status"]
            if assignment
            else "waiting_for_resource",

        "reason":
            dispatch_result["reason"]

    }

@router.post("/requests/batch")
def create_requests_batch(
    requests: List[RequestCreate],
    db: Session = Depends(get_db)
):

    if not requests:

        raise HTTPException(
            status_code=400,
            detail="No requests provided"
        )

    created_requests = []
    for request in requests:

        new_request = EmergencyRequest(
            message=request.message,
            latitude=request.latitude,
            longitude=request.longitude
        )

        db.add(new_request)
        db.commit()
        db.refresh(new_request)

        dispatch_result = dispatch_request(
            db,
            new_request
        )

        assignment = dispatch_result["assignment"]
        created_requests.append({

            **build_request_response(
                new_request
            ),

            "recommended_resource":
                dispatch_result[
                    "recommended_resource"
                ],

            "assigned_resource":
                assignment["resource_name"]
                if assignment and assignment["resource_name"]
                else None,

            "assignment_status":
                assignment["status"]
                if assignment
                else "waiting_for_resource",

            "reason":
                dispatch_result["reason"]

        })

    return {

        "created": len(created_requests),
        "requests": created_requests

    }


@router.get("/requests")
def get_requests(
    db: Session = Depends(get_db)
):

    requests = db.query(
        EmergencyRequest
    ).all()

    return [
        build_request_response(req)
        for req in requests

    ]

@router.patch("/requests/{request_id}/status")
def update_status(
    request_id: int,
    status_update: StatusUpdate,
    db: Session = Depends(get_db)
):

    request = (
        db.query(EmergencyRequest)
        .filter(
            EmergencyRequest.id == request_id
        )
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    request.status = status_update.status

    if status_update.status == "resolved":
        request.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(request)

    return build_request_response(
        request
    )