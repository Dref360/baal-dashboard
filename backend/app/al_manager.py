from typing import Tuple, List, Dict

import numpy as np
from PIL import Image
from baal.active import ActiveLearningDataset
from app.config import ALConfig
from pydantic import BaseModel
from torchvision.transforms.functional import to_pil_image

from app.types.active_learning import DatasetSplit, ItemInfo

Uncertainty = np.ndarray
Indices = List[int]


class Metric(BaseModel):
    x: List[int]
    y: List[float]

    def update(self, x, y):
        self.x.append(x)
        self.y.append(y)


class ActiveLearningManager:
    def __init__(self, al_dataset: ActiveLearningDataset, config: ALConfig):
        self.config = config
        self.uncertainty_progress: List[Tuple[Uncertainty, Indices]] = []
        self.predictions: Dict[int, np.ndarray] = {}
        self.metrics: Dict[str, Metric] = {}
        self.dataset = al_dataset
        self.class_distribution: List[int] = []
        self._find_stats()

    def load_state_dict(self, ckpt):
        self.dataset.load_state_dict(ckpt["dataset"])
        self.metrics = ckpt["metrics"]
        self.uncertainty_progress = ckpt["uncertainty_progress"]
        self.predictions = ckpt["predictions"]
        self._find_stats()

    def state_dict(self):
        return {
            "dataset": self.dataset.state_dict(),
            "metrics": self.metrics,
            "uncertainty_progress": self.uncertainty_progress,
            "predictions": self.predictions,
        }

    def _find_stats(self):
        self.class_distribution = np.unique(
            [y for _, y in self.dataset], return_counts=True
        )[1].tolist()

    def get_metrics(self) -> Dict[str, Metric]:
        return self.metrics

    def get_most_uncertains(self, top=5) -> List[int]:
        if self.uncertainty_progress:
            return np.argsort(self.uncertainty_progress[-1][0])[-top:].tolist()
        return []

    def get_labelling_stats(self):
        if self.uncertainty_progress:
            up = {
                "mean": self.uncertainty_progress[-1][0].mean(),
                "std": self.uncertainty_progress[-1][0].std(),
            }
            uncertainty = self.uncertainty_progress[-1][0].tolist()
            uncertainty = sorted(uncertainty, reverse=True)[::4][:100]
        else:
            up = {"mean": 0.0, "std": 0.0}
            uncertainty = []
        return {
            "num_labelled": len(self.dataset),
            "total": len(self.dataset._dataset),
            "uncertainty_stats": up,
            "uncertainty": uncertainty,
        }

    def get_dataset_info(self) -> List[Tuple[str, int]]:
        return list(
            zip(
                [
                    self.class_index_to_name(idx)
                    for idx in range(len(self.class_distribution))
                ],
                self.class_distribution,
            )
        )

    def class_index_to_name(self, class_idx: int) -> str:
        if self.config.class_names:
            return self.config.class_names[class_idx]
        else:
            return f"Class {class_idx}"

    def get_input_image(self, index: int, dataset: DatasetSplit) -> Image:
        if dataset == DatasetSplit.labelled:
            img = self.dataset[index][0]
        else:
            img = self.dataset.pool[index][0]
        return to_pil_image(img)

    def get_info(self, index: int, dataset: DatasetSplit) -> ItemInfo:
        if dataset == DatasetSplit.labelled:
            raise ValueError("Can't get prediction on labelled item.")
        if index not in self.predictions:
            raise ValueError(f"Unknown index {index}")
        info = self.predictions[index].mean(-1)
        return ItemInfo(
            prediction=self.class_index_to_name(np.argmax(info).item()),
            confidence=np.max(info),
        )
