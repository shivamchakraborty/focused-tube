from datetime import datetime, timedelta
import logging
import random
from typing import Optional, List, Dict
from .quota_tracker import QuotaTracker
from .config import KeyManagerConfig
from .exceptions import NoValidKeyError, QuotaExceededError
from .validators import validate_api_key

class YouTubeKeyManager:
    def __init__(self, config: KeyManagerConfig):
        self.config = config
        self.quota_tracker = QuotaTracker()
        self.current_key: Optional[str] = None
        self.last_rotation: Optional[datetime] = None
        self.logger = self._setup_logger()
        self._validate_and_load_keys()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("youtube_key_manager")
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            handler = logging.FileHandler("youtube_api_keys.log")
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        return logger

    def _validate_and_load_keys(self) -> None:
        """Validate all API keys and initialize quota tracking."""
        valid_keys = []
        for key in self.config.api_keys:
            try:
                validate_api_key(key)
                valid_keys.append(key)
            except Exception as e:
                self.logger.warning(f"Invalid API key found: {str(e)}")
        
        if not valid_keys:
            raise NoValidKeyError("No valid API keys available")
        
        self.config.api_keys = valid_keys
        self._select_initial_key()

    def _select_initial_key(self) -> None:
        """Select the first API key to use."""
        if self.config.selection_strategy == "random":
            self.current_key = random.choice(self.config.api_keys)
        else:
            self.current_key = self.config.api_keys[0]
        
        self.last_rotation = datetime.now()
        self.logger.info(f"Initial API key selected: {self._mask_key(self.current_key)}")

    def _should_rotate(self) -> bool:
        """Check if key rotation is needed based on time or quota."""
        if not self.last_rotation:
            return True
            
        time_elapsed = datetime.now() - self.last_rotation
        quota_used = self.quota_tracker.get_quota_usage(self.current_key)
        
        return (
            time_elapsed >= timedelta(minutes=self.config.rotation_interval_minutes) or
            quota_used >= self.config.quota_threshold
        )

    def _mask_key(self, key: str) -> str:
        """Mask API key for logging purposes."""
        return f"{key[:4]}...{key[-4:]}"

    def get_current_key(self) -> str:
        """Get the current active API key."""
        if self._should_rotate():
            self.rotate_key()
        return self.current_key

    def rotate_key(self) -> None:
        """Rotate to the next available API key."""
        available_keys = [
            key for key in self.config.api_keys
            if self.quota_tracker.get_quota_usage(key) < self.config.quota_threshold
        ]
        
        if not available_keys:
            raise QuotaExceededError("All API keys have exceeded quota threshold")
        
        if self.config.selection_strategy == "random":
            new_key = random.choice(available_keys)
        else:
            current_index = self.config.api_keys.index(self.current_key)
            new_key = self.config.api_keys[(current_index + 1) % len(self.config.api_keys)]
            
            # Skip keys that have exceeded quota
            while new_key not in available_keys:
                current_index = self.config.api_keys.index(new_key)
                new_key = self.config.api_keys[(current_index + 1) % len(self.config.api_keys)]
        
        self.current_key = new_key
        self.last_rotation = datetime.now()
        self.logger.info(
            f"Rotated to new API key: {self._mask_key(new_key)}, "
            f"Previous key quota usage: {self.quota_tracker.get_quota_usage(new_key)}%"
        )

    def record_quota_usage(self, units_used: int) -> None:
        """Record quota usage for the current key."""
        self.quota_tracker.record_usage(self.current_key, units_used)
        usage = self.quota_tracker.get_quota_usage(self.current_key)
        self.logger.debug(
            f"Recorded {units_used} units for key {self._mask_key(self.current_key)}, "
            f"Total usage: {usage}%"
        )

    def get_quota_status(self) -> Dict[str, float]:
        """Get quota usage status for all keys."""
        return {
            self._mask_key(key): self.quota_tracker.get_quota_usage(key)
            for key in self.config.api_keys
        }