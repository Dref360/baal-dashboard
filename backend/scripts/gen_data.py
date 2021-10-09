import numpy as np
import torch
from baal.active import ActiveLearningDataset
from torchvision import transforms, datasets

from app.active_learning import ActiveLearningManager, Metric
from app.utils import make_fake_data

NUM_STEP = 20
NUM_LABELLED = 1826

dataset = datasets.CIFAR10(
    ".", train=True, transform=transforms.ToTensor(), download=True
)
al_manager = make_fake_data(ActiveLearningDataset(dataset), NUM_LABELLED, NUM_STEP)
torch.save(al_manager.state_dict(), "./active_checkpoint.pth")
