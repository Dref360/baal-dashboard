from enum import Enum
from typing import List

from pydantic import BaseModel


class DatasetSplit(str, Enum):
    labelled = "labelled"
    pool = "pool"


class NormalDistribution(BaseModel):
    mean: float
    std: float


class LabellingStat(BaseModel):
    num_labelled: int
    total: int
    uncertainty_stats: NormalDistribution
    uncertainty: List[float]

class ItemInfo(BaseModel):
    prediction: str
    confidence: float
