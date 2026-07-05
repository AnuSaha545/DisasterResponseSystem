def suggest_resource(category):

    if not category:
        return "Emergency Response Team"

    mapping = {
        "medical": "Ambulance Team",
        "fire": "Fire Brigade",
        "flood": "Rescue Boat Team",
        "water": "Water Delivery Team",
        "food": "Food Supply Unit",
        "rescue": "Search and Rescue Team",
        "general": "Emergency Response Team"
    }
    return mapping.get(
        category.lower(),
        "Emergency Response Team"
    )