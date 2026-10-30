# Multi-stage Dockerfile for ColorAI Studio (Frontend + Backend in one container)
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.10-slim
WORKDIR /app

# Install minimal OS utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Copy compiled frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure runtime directories exist
RUN mkdir -p uploads outputs samples checkpoints

EXPOSE 8000
ENV PORT=8000
ENV TF_ENABLE_ONEDNN_OPTS=0

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
