from dataclasses import dataclass
from typing import List, Literal

@dataclass
class KeyManagerConfig:
    api_keys: List[str]
    rotation_interval_minutes: int = 60
    quota_threshold: float = 90.0
    selection_strategy: Literal["sequential", "random"] = "sequential"

    def __post_init__(self):
        if not 100 <= len(self.api_keys) <= 10000:
            raise ValueError("Number of API keys must be between 100 and 10000")
        if not 1 <= self.rotation_interval_minutes <= 1440:
            raise ValueError("Rotation interval must be between 1 and 1440 minutes")
        if not 0 < self.quota_threshold <= 100:
            raise ValueError("Quota threshold must be between 0 and 100")