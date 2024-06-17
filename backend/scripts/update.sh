#!/bin/bash

SERVICE="api"

docker-compose build $SERVICE
docker-compose stop $SERVICE
docker-compose up -d --no-deps $SERVICE