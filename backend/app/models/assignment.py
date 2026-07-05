from sqlalchemy import Column, Integer, ForeignKey

from app.database.base import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(
        Integer,
        ForeignKey("emergency_requests.id")
    )

    resource_id = Column(
        Integer,
        ForeignKey("resources.id")
    )