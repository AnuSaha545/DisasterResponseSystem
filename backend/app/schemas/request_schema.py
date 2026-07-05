from pydantic import BaseModel

class RequestCreate(BaseModel):
    message: str
    latitude: float
    longitude: float