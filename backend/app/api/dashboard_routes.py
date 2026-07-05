# app/api/dashboard_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.dependencies import get_db
from app.models.request import EmergencyRequest

router = APIRouter(
    tags=["Dashboard"]
)

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    total_requests = db.query(EmergencyRequest).count()
    critical_requests = (
        db.query(EmergencyRequest)
        .filter(EmergencyRequest.priority == "critical")
        .count()
    )

    medical_requests = (
        db.query(EmergencyRequest)
        .filter(EmergencyRequest.category == "medical")
        .count()
    )

    food_requests = (
        db.query(EmergencyRequest)
        .filter(EmergencyRequest.category == "food")
        .count()
    )

    water_requests = (
        db.query(EmergencyRequest)
        .filter(EmergencyRequest.category == "water")
        .count()
    )

    return {
        "total_requests": total_requests,
        "critical_requests": critical_requests,
        "medical_requests": medical_requests,
        "food_requests": food_requests,
        "water_requests": water_requests
    }