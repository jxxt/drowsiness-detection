"""
Upload model to Hugging Face Hub (free, unlimited storage for ML models)

Instructions:
1. Create account at https://huggingface.co
2. Get your token from https://huggingface.co/settings/tokens
3. Run: pip install huggingface_hub
4. Run this script: python upload_model_to_hf.py
"""

from huggingface_hub import HfApi, create_repo
import os

# Configuration
HF_USERNAME = "jxxt"  # Replace with your HuggingFace username
REPO_NAME = "drowsiness-detection-model"
MODEL_FILE = "model.keras"
# Get from https://huggingface.co/settings/tokens
HF_TOKEN = "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"


def upload_model():
    """Upload model to Hugging Face Hub"""

    if HF_USERNAME == "YOUR_USERNAME" or HF_TOKEN == "YOUR_TOKEN_HERE":
        print("❌ Please update HF_USERNAME and HF_TOKEN in this script first!")
        print("1. Sign up at https://huggingface.co")
        print("2. Get token from https://huggingface.co/settings/tokens")
        return

    api = HfApi()
    repo_id = f"{HF_USERNAME}/{REPO_NAME}"

    try:
        # Create repository
        print(f"📦 Creating repository: {repo_id}")
        create_repo(repo_id, token=HF_TOKEN, exist_ok=True, repo_type="model")

        # Upload model file
        print(f"⬆️  Uploading {MODEL_FILE} (this may take a few minutes)...")
        api.upload_file(
            path_or_fileobj=MODEL_FILE,
            path_in_repo=MODEL_FILE,
            repo_id=repo_id,
            token=HF_TOKEN,
        )

        print(f"✅ Model uploaded successfully!")
        print(f"📍 Model URL: https://huggingface.co/{repo_id}")
        print(f"\n🔗 To download in your app:")
        print(f"   from huggingface_hub import hf_hub_download")
        print(
            f"   hf_hub_download(repo_id='{repo_id}', filename='{MODEL_FILE}')")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    if not os.path.exists(MODEL_FILE):
        print(f"❌ {MODEL_FILE} not found in current directory!")
    else:
        upload_model()
