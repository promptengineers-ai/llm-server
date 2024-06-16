#!/bin/bash

SHORT_SHA=$(git rev-parse --short HEAD)

docker build -t promptengineers/llm-server:$SHORT_SHA .

echo ""
## Prompt to push the image to Docker Hub
echo "Do you want to push the image to Docker Hub? (y/n)"
read -r response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
then
  docker push promptengineers/llm-server:$SHORT_SHA
fi