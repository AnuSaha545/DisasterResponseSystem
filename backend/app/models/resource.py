from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    status = Column(String, default="available")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)