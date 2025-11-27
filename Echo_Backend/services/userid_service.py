# app/services/userid_service.py
from pymongo import ReturnDocument
from database.mongo import counters_collection

async def generate_userid(prefix: str = "USR01", width: int = 5) -> str:
    """
    Atomically increments a counter and builds a userId string.
    Example: prefix='USR01', seq=1 => 'USR0100001' when width=5
    """
    doc = await counters_collection.find_one_and_update(
        {"_id": "userId"}, 
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    seq = doc.get("seq", 1)
    return f"{prefix}{str(seq).zfill(width)}"
