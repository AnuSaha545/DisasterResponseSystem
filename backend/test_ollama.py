from app.services.ollama_service import classify_with_ollama

result = classify_with_ollama(
    "Need medical help urgently. My father is bleeding badly."
)

print(result)