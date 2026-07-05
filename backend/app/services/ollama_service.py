import requests
import json
import re

def classify_with_ollama(message: str):

    prompt = f"""
You are an emergency disaster response classifier.

Classify the emergency request.

Valid categories:

medical
fire
flood
food
water
rescue
general

Valid priorities:

critical
high
medium
low

Return ONLY valid JSON.

Request:
{message}

Example:

{{
  "category": "fire",
  "priority": "critical",
  "reason": "People trapped in a burning building"
}}
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        response.raise_for_status()
        result = response.json()
        text = result.get(
            "response",
            ""
        )

        match = re.search(
            r"\{.*\}",
            text,
            re.DOTALL
        )

        if match:
            return json.loads(
                match.group()
            )

        return {
            "category": "general",
            "priority": "low",
            "reason": "No valid JSON returned"
        }

    except Exception as e:
        return {
            "category": "general",
            "priority": "low",
            "reason": str(e)
        }