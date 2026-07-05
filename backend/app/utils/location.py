from math import radians, sin, cos, sqrt, atan2

def haversine_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate the distance (km)
    between two GPS coordinates.
    """

    R = 6371.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)

    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )
    return R * c