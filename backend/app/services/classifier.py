def classify_request(message: str):

    message = message.lower()

    # MEDICAL
    if any(word in message for word in [
        "medical",
        "ambulance",
        "injured",
        "injury",
        "bleeding",
        "blood",
        "accident",
        "unconscious",
        "heart attack",
        "patient"
    ]):
        return {
            "category": "medical",
            "priority": "critical"
        }

    # FIRE
    elif any(word in message for word in [
        "fire",
        "burning",
        "smoke",
        "explosion",
        "warehouse fire",
        "building fire",
        "flames"
    ]):
        return {
            "category": "fire",
            "priority": "critical"
        }

    # FLOOD
    elif any(word in message for word in [
        "flood",
        "flooding",
        "water entering",
        "heavy rain",
        "submerged"
    ]):
        return {
            "category": "flood",
            "priority": "high"
        }

    # FOOD
    elif any(word in message for word in [
        "food",
        "hungry",
        "starving",
        "ration",
        "no food"
    ]):
        return {
            "category": "food",
            "priority": "high"
        }

    # WATER
    elif any(word in message for word in [
        "water",
        "drinking water",
        "no water",
        "water shortage"
    ]):
        return {
            "category": "water",
            "priority": "medium"
        }

    # RESCUE
    elif any(word in message for word in [
        "trapped",
        "rescue",
        "stuck",
        "collapsed",
        "stranded"
    ]):
        return {
            "category": "rescue",
            "priority": "critical"
        }

    else:
        return {
            "category": "general",
            "priority": "low"
        }