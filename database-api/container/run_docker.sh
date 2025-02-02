IMAGE_NAME="database-api"

# Run the container with proper environment variables
echo "Starting new container..."
docker run -d -p 3000:3000 --name $IMAGE_NAME --env-file ../.env $IMAGE_NAME

echo "Container is running. Access API at http://localhost:3000"