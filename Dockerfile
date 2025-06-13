# Use the official Bun image
FROM oven/bun:1 as builder

# Set working directory to root
WORKDIR /app

# Copy the entire monorepo structure
COPY . .

# Install dependencies for the entire workspace
RUN bun install --frozen-lockfile

# Build only the server application
RUN cd apps/server && bun run build

# Start a new stage for production
FROM oven/bun:1-slim

WORKDIR /app

# Copy the root workspace structure
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/bun.lock .
COPY --from=builder /app/package.json .

# Copy server files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

# Expose the port your app runs on
EXPOSE 3000

# Start the server application
CMD ["bun", "run", "dist/apps/server/src/index.js"] 