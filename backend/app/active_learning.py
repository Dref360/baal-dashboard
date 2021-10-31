from typing import Tuple, List, Dict

import numpy as np
from PIL import Image
from baal.active import ActiveLearningDataset
from pydantic import BaseModel
from torchvision.transforms.functional import to_pil_image

from app.types.active_learning import DatasetSplit

Uncertainty = np.ndarray
Indices = List[int]


class Metric(BaseModel):
    x: List[int]
    y: List[float]

    def update(self, x, y):
        self.x.append(x)
        self.y.append(y)


class ActiveLearningManager:
    def __init__(self, al_dataset: ActiveLearningDataset):
        self.uncertainty_progress: List[Tuple[Uncertainty, Indices]] = []
        self.metrics: Dict[str, Metric] = {}
        self.dataset = al_dataset
        self.class_distribution: List[int] = []
        self._find_stats()

    def load_state_dict(self, ckpt):
        self.dataset.load_state_dict(ckpt["dataset"])
        self.metrics = ckpt["metrics"]
        self.uncertainty_progress = ckpt["uncertainty_progress"]
        self._find_stats()

    def state_dict(self):
        return {
            "dataset": self.dataset.state_dict(),
            "metrics": self.metrics,
            "uncertainty_progress": self.uncertainty_progress,
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
                [f"Class {idx}" for idx in range(len(self.class_distribution))],
                self.class_distribution,
            )
        )

    def get_input_image(self, index: int, dataset: DatasetSplit) -> Image:
        if dataset == DatasetSplit.labelled:
            img = self.dataset[index][0]
        else:
            img = self.dataset.pool[index][0]
        return to_pil_image(img)
