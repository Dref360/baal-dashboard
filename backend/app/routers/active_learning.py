import os
from typing import Dict, List, Tuple

from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse

from app.active_learning import Metric
from app.api import get_al_manager
from app.types.active_learning import LabellingStat, DatasetSplit

pjoin = os.path.join
router = APIRouter(tags=["Active Learning"])


@router.get("/metrics")
async def get_metrics(al_manager=Depends(get_al_manager)) -> Dict[str, Metric]:
    return al_manager.get_metrics()


@router.get("/stats")
async def get_stats(al_manager=Depends(get_al_manager)) -> LabellingStat:
    return LabellingStat(**al_manager.get_labelling_stats())


@router.get("/most_uncertains")
async def get_most_uncertains(al_manager=Depends(get_al_manager)) -> List[int]:
    return al_manager.get_most_uncertains()


@router.post("/train", tags=["train"])
async def start_train() -> dict:
    return {"training": True}


@router.get("/dataset_info")
async def get_dataset_info(al_manager=Depends(get_al_manager)) -> List[Tuple[str, int]]:
    return al_manager.get_dataset_info()


@router.get("/{dataset}/item/{index}/image", response_class=FileResponse)
async def get_item_image(
    dataset: DatasetSplit = Query(..., title="Dataset"),
    index: int = Query(..., title="Dataset Index"),
    al_manager=Depends(get_al_manager),
):
    pil_image = al_manager.get_input_image(index=index, dataset=dataset)
    folder = pjoin("/tmp", dataset)
    os.makedirs(folder, exist_ok=True)
    full_path = pjoin(folder, f"{index}.png")
    pil_image.save(full_path)
    return full_path
