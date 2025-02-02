#!/bin/bash

IMAGE_NAME="database-api"

# Move to the directory containing this script
cd "$(dirname "$0")"

# Build the Docker image (using `..` as the build context)
echo "Building Docker image..."
docker build -t $IMAGE_NAME -f Dockerfile ..
