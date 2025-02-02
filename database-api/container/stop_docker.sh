IMAGE_NAME="database-api"

# Stop and remove any old container if running
echo "Stopping and removing old container (if exists)..."
docker stop $IMAGE_NAME 2>/dev/null