# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for TensorFlow and image processing
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Download model from external storage (option for large models)
# Uncomment and replace FILE_ID if using Google Drive
# RUN apt-get update && apt-get install -y wget && \
#     wget --no-check-certificate 'https://drive.google.com/uc?export=download&id=FILE_ID' -O model.keras && \
#     apt-get remove -y wget && apt-get autoremove -y

# Copy model from local (default - requires Git LFS for 400MB file)
COPY model.keras .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the application
# Use PORT environment variable for Render compatibility, fallback to 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
