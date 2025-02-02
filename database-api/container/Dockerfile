# Use the official Rust image as a builder
FROM rust:1.84.1 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Cargo files from the project root
COPY ../Cargo.toml ../Cargo.lock ./
COPY ../src ./src 

# Update package lists and install system dependencies for SQLx
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Build the application in release mode
RUN cargo build --release

# Create a smaller image for running the application
FROM debian:bookworm-slim

# Install system dependencies required for running the Rust binary
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/database-api .

# Expose the application port
EXPOSE 3000

# Set environment variables (modify as needed)
ENV DATABASE_URL=postgres://user:password@db:5432/mydatabase

# Run the application
CMD ["./database-api"]