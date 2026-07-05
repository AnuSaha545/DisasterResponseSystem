from sqlalchemy.orm import Session

from app.models.request import EmergencyRequest

from app.services.ollama_service import classify_with_ollama
from app.services.classifier import classify_request
from app.services.resource_allocator import suggest_resource
from app.services.assignment_service import auto_assign_resource

def classify_message(message: str):
    """
    Uses Ollama first.
    Falls back to rule-based classification if needed.
    """

    classification = classify_with_ollama(message)
    print("OLLAMA:", classification)

    if not (
        classification.get("category") == "general"
        and classification.get("priority") == "low"
    ):
        return classification
    print("Using fallback classifier")

    fallback = classify_request(message)
    return {
        "category": fallback["category"],
        "priority": fallback["priority"],
        "reason": "Fallback rule-based classification"
    }


def dispatch_request(
    db: Session,
    request: EmergencyRequest
):
    """
    Complete emergency dispatch workflow.

    1. Classify request
    2. Recommend resource
    3. Auto assign resource
    4. Return dispatch result
    """

    classification = classify_message(
        request.message
    )

    request.category = classification["category"]
    request.priority = classification["priority"]

    db.commit()
    db.refresh(request)

    assignment = auto_assign_resource(
        db,
        request
    )

    return {
        "category": request.category,
        "priority": request.priority,
        "recommended_resource":
            suggest_resource(
                request.category
            ),
        "assignment": assignment,
        "reason":
            classification.get(
                "reason",
                "Classification completed"
            )
    }