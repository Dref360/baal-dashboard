import argparse
from typing import Optional

import torch
from baal.active import ActiveLearningDataset
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from torchvision.transforms import ToTensor

from app.active_learning import ActiveLearningManager
from app.utils import make_fake_data

_al_manager: Optional[ActiveLearningManager] = None


def get_al_manager() -> Optional[ActiveLearningManager]:
    return _al_manager


def load_dataset():
    from torchvision.datasets import CIFAR10

    ds = CIFAR10("/tmp", train=True, transform=ToTensor(), download=True)
    al_dataset = ActiveLearningDataset(ds)
    return al_dataset


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", default=None)
    return parser.parse_args()


def create_app():
    global _al_manager
    args = parse_args()
    dataset = load_dataset()

    if args.checkpoint is not None:
        print("Loading", args.checkpoint)
        _al_manager = ActiveLearningManager(dataset)
        _al_manager.load_state_dict(torch.load(args.checkpoint))
    else:
        print("Making fake checkpoint!")
        _al_manager = make_fake_data(dataset, num_labelled=1826, num_step=20)

    app = FastAPI()

    # Import routers
    from app.routers.active_learning import router as active_router

    # Include routers
    app.include_router(active_router)

    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def read_root() -> dict:
        return {"message": "Welcome to BaaL API."}

    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app
