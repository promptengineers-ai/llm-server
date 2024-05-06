FROM python:3.10-slim

# set work directory
WORKDIR /app

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

# install system dependencies required by spaCy
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install -v --no-cache-dir -r requirements.txt