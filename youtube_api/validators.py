import re
from typing import Optional
import requests
from .exceptions import ValidationError

def validate_api_key(api_key: str) -> None:
    """Validate YouTube API key format and functionality."""
    # Check key format
    if not re.match(r'^[A-Za-z0-9_-]{39}$', api_key):
        raise ValidationError(f"Invalid API key format: {api_key}")

    # Test API key with a minimal request
    test_url = (
        "https://www.googleapis.com/youtube/v3/videos"
        "?part=id&id=dQw4w9WgXcQ&key={key}"
    ).format(key=api_key)
    
    try:
        response = requests.get(test_url)
        if response.status_code == 403:
            raise ValidationError(f"Invalid API key: {api_key}")
        elif response.status_code != 200:
            raise ValidationError(f"API key validation failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        raise ValidationError(f"API key validation request failed: {str(e)}")