from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.resource import Resource
from app.schemas.resource_schema import (
    ResourceCreate,
    ResourceResponse
)

router = APIRouter(
    tags=["Resources"]
)
@router.patch("/resources/{resource_id}/status")
def update_resource_status(
    resource_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    resource.status = status

    db.commit()
    db.refresh(resource)

    return {
        "message": "Resource status updated",
        "resource": resource
    }

@router.post(
    "/resources",
    response_model=ResourceResponse
)
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db)
):

    new_resource = Resource(
        name=resource.name,
        resource_type=resource.resource_type,
        latitude=resource.latitude,
        longitude=resource.longitude
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return new_resource

@router.get(
    "/resources",
    response_model=list[ResourceResponse]
)
def get_resources(
    db: Session = Depends(get_db)
):

    resources = db.query(Resource).all()
    return resources