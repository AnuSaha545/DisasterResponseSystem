from datetime import datetime

from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.models.request import EmergencyRequest
from app.models.assignment import Assignment

from app.services.queue_service import add_to_waiting_queue
from app.utils.location import haversine_distance

def auto_assign_resource(
    db: Session,
    request: EmergencyRequest
):
    """
    Automatically assigns the nearest available
    resource matching the emergency category.
    Records assignment time for analytics.
    """

    resources = (
        db.query(Resource)
        .filter(
            Resource.resource_type == request.category,
            Resource.status == "available"
        )
        .all()
    )

    if not resources:
        add_to_waiting_queue(db, request)
        return {
            "assignment_id": None,
            "resource_name": None,
            "status": "waiting_for_resource"
        }

    nearest_resource = None
    nearest_distance = float("inf")

    for resource in resources:
        if (
            resource.latitude is None
            or resource.longitude is None
        ):
            continue

        distance = haversine_distance(
            request.latitude,
            request.longitude,
            resource.latitude,
            resource.longitude
        )

        if distance < nearest_distance:
            nearest_distance = distance
            nearest_resource = resource

    if nearest_resource is None:
        add_to_waiting_queue(db, request)
        return {
            "assignment_id": None,
            "resource_name": None,
            "status": "waiting_for_resource"
        }
    assignment = Assignment(
        request_id=request.id,
        resource_id=nearest_resource.id
    )

    db.add(assignment)

    # Update resource

    nearest_resource.status = "assigned"

    # Update request

    request.status = "assigned"
    request.assigned_at = datetime.utcnow()

    db.commit()
    db.refresh(assignment)

    return {
        "assignment_id": assignment.id,

        "resource_name": nearest_resource.name,

        "status": "assigned",

        "distance_km": round(
            nearest_distance,2)
    }