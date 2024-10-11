#!/bin/bash

SHORT_SHA=$(git rev-parse --short HEAD)

########################################################################
## Google Artifact Registry
########################################################################
# Define your GCP parameters
LOCATION="us-central1"  # Update this if your repository is in a different location
PROJECT_ID="pe-open-source-chat"  # Replace with your GCP project ID
REPOSITORY="promptengineers"  # Name of your Artifact Registry repository

# Build the Docker image and tag it for Artifact Registry
docker build --squash -t $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/llm-server:$SHORT_SHA .

echo ""
## Prompt to push the image to Artifact Registry
echo "Do you want to push the image to Google Artifact Registry? (y/n)"
read -r response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
then
  # Authenticate Docker to push to Artifact Registry
  gcloud auth configure-docker $LOCATION-docker.pkg.dev

  # Push the image to Artifact Registry
  docker push $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/llm-server:$SHORT_SHA
fi

########################################################################
## Docker Hub
########################################################################
# docker build --squash -t promptengineers/llm-server:$SHORT_SHA .

# echo ""
# ## Prompt to push the image to Docker Hub
# echo "Do you want to push the image to Docker Hub? (y/n)"
# read -r response
# if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
# then
#   docker push promptengineers/llm-server:$SHORT_SHA
# fi