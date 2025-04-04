import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from PIL import Image
import io
from typing import Optional

from fastapi.middleware.cors import CORSMiddleware



# Load the model
model = tf.keras.models.load_model("model.keras")

# Constants (match your predict_drowsiness() function)
INPUT_SHAPE = (224, 224)
CLASS_NAMES = ['Non-Drowsy', 'Drowsy']
DEFAULT_THRESHOLD = 0.5

app = FastAPI(
    title="Drowsiness Detection API",
    description="API for detecting drowsiness from images using the same preprocessing as your predict_drowsiness() function"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(
    file: UploadFile = File(..., description="Image file (JPEG/PNG)"),
    threshold: Optional[float] = None,
    show_image: Optional[bool] = False
):
    """
    Analyze an image for drowsiness using identical preprocessing to your 
    predict_drowsiness() function.
    
    Parameters:
    - file: Image file
    - threshold: Optional confidence threshold (default: 0.5)
    - show_image: Debug flag to return base64 image (not recommended for production)
    
    Returns:
    - JSON response matching your function's output format
    """
    try:
        # 1. Validate input (same as your function's expected input)
        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(400, "Only JPEG/PNG images supported")

        # 2. Identical preprocessing to predict_drowsiness()
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        
        # Match your function's preprocessing exactly:
        img = img.convert('RGB').resize(INPUT_SHAPE)
        img_array = np.array(img) / 255.0  # Normalization
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dim

        # 3. Same prediction logic
        confidence = float(model.predict(img_array)[0][0])
        current_threshold = threshold if threshold is not None else DEFAULT_THRESHOLD
        predicted_class = CLASS_NAMES[int(confidence > current_threshold)]

        # 4. Enhanced API response (includes all data from your function + API extras)
        response = {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "threshold_used": current_threshold,
            "class_names": CLASS_NAMES,
            "preprocessing": "Normalized to [0,1], resized to 224x224"
        }

        # Optional debug image (not recommended for production APIs)
        if show_image:
            import base64
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG")
            response["image_base64"] = base64.b64encode(buffered.getvalue()).decode()

        return response

    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    
    
# pip install fastapi uvicorn tensorflow pillow python-multipart
# python app.py