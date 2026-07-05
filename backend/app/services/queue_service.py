from sqlalchemy.orm import Session

from app.models.request import EmergencyRequest

def add_to_waiting_queue(
    db: Session,
    request: EmergencyRequest
):
    """
    Marks a request as waiting because
    no suitable resource is currently available.
    """

    request.status = "waiting_for_resource"

    db.commit()
    db.refresh(request)

    return request