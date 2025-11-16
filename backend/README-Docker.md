# Docker Deployment Guide

## Prerequisites

-   Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
-   Ensure Docker is running

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# Stop the container
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t drowsiness-api .

# Run the container
docker run -p 8000:8000 drowsiness-api

# Run in detached mode
docker run -d -p 8000:8000 --name drowsiness-container drowsiness-api

# Stop the container
docker stop drowsiness-container
docker rm drowsiness-container
```

## Accessing the API

-   API endpoint: http://localhost:8000
-   API docs: http://localhost:8000/docs
-   Test endpoint: http://localhost:8000/predict

## Useful Docker Commands

### View running containers

```bash
docker ps
```

### View logs

```bash
# Using docker-compose
docker-compose logs -f

# Using docker CLI
docker logs -f drowsiness-container
```

### Stop and remove everything

```bash
docker-compose down
```

### Rebuild after code changes

```bash
docker-compose up --build
```

### Access container shell (for debugging)

```bash
docker exec -it drowsiness-container bash
```

## Free Deployment Options

### 1. **Render** (Recommended for beginners)

-   Free tier available with 750 hours/month
-   Supports Docker deployment
-   Steps: https://render.com/docs/deploy-docker

### 2. **Railway**

-   Free $5 credit monthly
-   Easy Docker deployment
-   Steps: https://railway.app/

### 3. **Fly.io**

-   Free tier with 3 shared VMs
-   Good Docker support
-   Steps: https://fly.io/docs/

### 4. **Google Cloud Run**

-   Free tier: 2 million requests/month
-   Serverless container deployment
-   Requires Google Cloud account

## Image Size Optimization (Optional)

The current image is ~1.5GB due to TensorFlow. To reduce size:

-   Use `tensorflow-cpu` instead of `tensorflow` in requirements.txt
-   Use multi-stage builds (advanced)

## Troubleshooting

### Port already in use

```bash
# Change port in docker-compose.yml from "8000:8000" to "8001:8000"
# Or find and stop the process using port 8000
```

### Out of memory

```bash
# Increase Docker Desktop memory allocation in Settings > Resources
```

### Model file not found

```bash
# Ensure model.keras is in the backend/ directory before building
```
