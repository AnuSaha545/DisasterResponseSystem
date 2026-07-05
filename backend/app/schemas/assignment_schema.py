from pydantic import BaseModel

class AssignmentCreate(BaseModel):
    request_id: int
    resource_id: int