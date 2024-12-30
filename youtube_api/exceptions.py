class YouTubeKeyManagerError(Exception):
    """Base exception for YouTube Key Manager."""
    pass

class NoValidKeyError(YouTubeKeyManagerError):
    """Raised when no valid API keys are available."""
    pass

class QuotaExceededError(YouTubeKeyManagerError):
    """Raised when all API keys have exceeded their quota."""
    pass

class ValidationError(YouTubeKeyManagerError):
    """Raised when API key validation fails."""
    pass