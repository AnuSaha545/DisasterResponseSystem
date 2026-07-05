from pydantic import BaseModel
class ResourceBase(BaseModel):
    name: str
    resource_type: str
    latitude: float
    longitude: float

class ResourceCreate(ResourceBase):
    pass

class ResourceResponse(ResourceBase):
    id: int
    status: str
    class Config:
        from_attributes = True