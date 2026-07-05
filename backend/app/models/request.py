from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime
)

from app.database.base import Base

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    message = Column(
        String,
        nullable=False
    )
    latitude = Column(
        Float,
        nullable=False
    )
    longitude = Column(
        Float,
        nullable=False
    )
    category = Column(
        String,
        nullable=True
    )
    priority = Column(
        String,
        nullable=True
    )
    status = Column(
        String,
        default="pending"
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    assigned_at = Column(
        DateTime,
        nullable=True
    )
    resolved_at = Column(
        DateTime,
        nullable=True
    )