#!/bin/bash

echo "Is this a release? (yes/no)"
read answer
if [ "$answer" == "yes" ]; then
    echo "Release confirmed."
    echo ""
    ## prompt user for semantic tag
    echo "Please enter the semantic version: "
    read version
    echo ""
    TAG=$version
    echo "You entered $TAG"
    if git tag | grep -q $TAG; then
        echo "Tag $TAG already exists!"
        exit 0
    fi
    git tag $TAG
    git push origin $TAG
elif [ "$answer" == "no" ]; then
    TAG=$(git rev-parse HEAD | cut -c1-8)
    echo "Creating development build.."
else
    echo "Invalid input. Please enter 'yes' or 'no'."
fi

## Go to root of project
cd $(dirname $0)
cd ../
DIR=$(pwd)

IMAGE_URL="promptengineersai/chat-stream-full-stack:$TAG"

docker build -t $IMAGE_URL .
docker push $IMAGE_URL

## Print details
echo ""
echo ""
echo "----------------------------------------------------"
echo ">> Version: $TAG"
echo ">> Image: $IMAGE_URL"
echo "----------------------------------------------------"
