from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def test_ai():
    return {"msg": "ai route working"}