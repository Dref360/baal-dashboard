from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.active_learning import ActiveLearningManager


app = FastAPI()
al_manager = ActiveLearningManager()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}


@app.get("/metrics", tags=["metrics"])
async def get_metrics() -> dict:
    return {"data": al_manager.get_metrics()}

@app.get("/stats", tags=["stats"])
async def get_stats() -> dict:
    return {"data": al_manager.get_labelling_stats()}


@app.post("/train", tags=["train"])
async def start_train() -> dict:
    return {"training": True}
