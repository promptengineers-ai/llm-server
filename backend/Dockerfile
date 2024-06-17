FROM python:3.10-slim

# set work directory
WORKDIR /app

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

# install system dependencies required by spaCy
RUN useradd -m user && chown -R user . \
    && apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install uv \
    && uv pip install -v --system --no-cache-dir -r requirements.txt

# Copy entrypoint script and ensure correct permissions
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh