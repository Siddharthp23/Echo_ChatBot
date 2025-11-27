# services/auth_utils.py
import re
from datetime import datetime

async def generate_userid(users_collection) -> str:
    """
    Finds the latest userId (e.g., 'USR01'), increments and returns new id string.
    If no users exist, returns 'USR01'.
    """
    # find the latest by created_at or by userId descending
    last = await users_collection.find_one(
        {}, 
        sort=[("created_at", -1)], 
        projection={"userId": 1}
    )
    if not last or "userId" not in last:
        return "USR01"

    last_id = last["userId"]
    # expected format 'USR' + number, robust parse:
    m = re.match(r"^USR0*([0-9]+)$", last_id)
    if not m:
        # fallback: return next numeric using digits at end
        digits = re.findall(r"(\d+)$", last_id)
        if not digits:
            return "USR01"
        num = int(digits[-1]) + 1
    else:
        num = int(m.group(1)) + 1

    return f"USR{num:02d}"  # USR01, USR02, ... USR10, USR11, etc.
