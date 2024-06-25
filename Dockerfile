# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.1.0
FROM node:${NODE_VERSION}-slim AS base

# Node.js app lives here
WORKDIR /app

# Set production environment
#ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json .env* ./
RUN npm install

# Copy application code
COPY --link . .

RUN npm run build-only

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

RUN npm install -g serve

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]
