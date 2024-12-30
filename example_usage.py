from youtube_api.key_manager import YouTubeKeyManager
from youtube_api.config import KeyManagerConfig

def main():
    # Load API keys from configuration
    config = KeyManagerConfig(
        api_keys=["your_api_key_1", "your_api_key_2", ...],  # Add your API keys
        rotation_interval_minutes=60,
        quota_threshold=90.0,
        selection_strategy="sequential"
    )

    # Initialize key manager
    key_manager = YouTubeKeyManager(config)

    # Example usage
    try:
        # Get current API key
        api_key = key_manager.get_current_key()
        
        # Record quota usage after API call
        key_manager.record_quota_usage(10)  # Example: 10 quota units used
        
        # Get quota status for all keys
        quota_status = key_manager.get_quota_status()
        print("Quota Status:", quota_status)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()