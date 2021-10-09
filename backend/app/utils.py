from baal.active.dataset import ActiveLearningDataset
import numpy as np
from torch.utils.data.dataset import Dataset
from app.active_learning import ActiveLearningManager, Metric


def make_fake_data(
    al_dataset: ActiveLearningDataset, num_labelled, num_step
) -> ActiveLearningManager:
    al_dataset.label_randomly(num_labelled)
    al_manager = ActiveLearningManager(al_dataset)

    # Create fake uncertainty following a beta distribution
    al_manager.uncertainty_progress.append(
        (
            np.random.beta(2, 5, al_dataset.n_unlabelled),
            np.arange(len(al_dataset._dataset))[al_dataset.labelled],
        )
    )

    # Create fake metrics following an asymptotic function
    f1, accuracy = Metric(x=[], y=[]), Metric(x=[], y=[])
    for step in np.linspace(0, 1.0, num_step + 1)[1:]:
        n_lab = int(step * num_labelled)
        f1_v = np.log(step + 1) + np.random.randn() * 0.1
        acc_v = np.log(step + 1) + np.random.randn() * 0.1
        f1.update(n_lab, f1_v)
        accuracy.update(n_lab, acc_v)

    al_manager.load_state_dict(
        {
            "dataset": al_dataset.state_dict(),
            "metrics": {"f1": f1, "accuracy": accuracy},
            "uncertainty_progress": al_manager.uncertainty_progress,
        }
    )
    return al_manager
