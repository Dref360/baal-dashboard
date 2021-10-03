import numpy as np

uncertainty = np.random.randn(100).tolist()

class ActiveLearningManager:
    def __init__(self):
        pass

    def get_metrics(self):
        return {"accuracy": {"x": [1000, 2000],
                              "y": [.1, .3]},
                "f1": {"x": [1000, 2000],
                              "y": [.1, .3]},}

    def get_most_uncertains(self):
        return [3, 4, 5]

    def get_labelling_stats(self):
        return {
            "num_labelled": 100,
            "total": 1000,
            "uncertainty_stats": {"mean": .1, "std":.03},
            "uncertainty": uncertainty,
            "class_distribution": [10,10,20]
        }
