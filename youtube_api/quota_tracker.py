from datetime import datetime, timedelta
from typing import Dict, Optional
import threading

class QuotaTracker:
    def __init__(self):
        self._quota_usage: Dict[str, Dict[str, int]] = {}
        self._lock = threading.Lock()
        self.DAILY_QUOTA = 10000  # Default YouTube API daily quota

    def _get_date_key(self) -> str:
        """Get current date as string key."""
        return datetime.now().strftime("%Y-%m-%d")

    def record_usage(self, api_key: str, units: int) -> None:
        """Record quota usage for an API key."""
        with self._lock:
            date_key = self._get_date_key()
            if api_key not in self._quota_usage:
                self._quota_usage[api_key] = {}
            if date_key not in self._quota_usage[api_key]:
                self._quota_usage[api_key][date_key] = 0
            self._quota_usage[api_key][date_key] += units

    def get_quota_usage(self, api_key: str) -> float:
        """Get quota usage percentage for an API key."""
        with self._lock:
            date_key = self._get_date_key()
            if api_key not in self._quota_usage or date_key not in self._quota_usage[api_key]:
                return 0.0
            return (self._quota_usage[api_key][date_key] / self.DAILY_QUOTA) * 100

    def reset_daily_quota(self) -> None:
        """Reset quota usage for expired dates."""
        with self._lock:
            current_date = self._get_date_key()
            for api_key in self._quota_usage:
                self._quota_usage[api_key] = {
                    date: usage
                    for date, usage in self._quota_usage[api_key].items()
                    if date == current_date
                }