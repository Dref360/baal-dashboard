import argparse

import torch
from baal.active import ActiveLearningDataset
from app.utils import make_fake_data
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from torchvision.transforms import ToTensor

from app.active_learning import ActiveLearningManager


def load_dataset():
    from torchvision.datasets import CIFAR10

    ds = CIFAR10("/tmp", train=True, transform=ToTensor(), download=True)
    al_dataset = ActiveLearningDataset(ds)
    return al_dataset


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", default=None)
    return parser.parse_args()


args = parse_args()
dataset = load_dataset()


if args.checkpoint is not None:
    print("Loading", args.checkpoint)
    al_manager = ActiveLearningManager(dataset)
    al_manager.load_state_dict(torch.load(args.checkpoint))
else:
    print("Making fake checkpoint!")
    al_manager = make_fake_data(dataset, num_labelled=1826, num_step=20)

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/most_uncertains", tags=["most_uncertains"])
async def get_most_uncertains() -> dict:
    return {"data": al_manager.get_most_uncertains()}


@app.post("/train", tags=["train"])
async def start_train() -> dict:
    return {"training": True}
