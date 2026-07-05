from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.request_routes import router as request_router
from app.api.resource_routes import router as resource_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.assignment_routes import router as assignment_router

app = FastAPI(
    title="RescueSphere"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(request_router)
app.include_router(resource_router)
app.include_router(dashboard_router)
app.include_router(assignment_router)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "RescueSphere API Running"
    }