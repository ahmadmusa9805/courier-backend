# Build Stage (No changes needed here)
FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ----------------------------------------------------------------------

# Production Stage (Fix the COPY steps)
FROM node:22

# Ensure Node Modules are installed for production (if you need dev tools, use the builder stage)
# The WORKDIR must be defined first
WORKDIR /app

# 1. Copy over the package files (to ensure node_modules from builder can be validated)
COPY --from=builder /app/package.json /app/package-lock.json /app/

# 2. Copy the *compiled* application files (dist)
COPY --from=builder /app/dist /app/dist/

# 3. Copy the node_modules
# NOTE: The build process should have put all necessary production dependencies in /app/node_modules
COPY --from=builder /app/node_modules /app/node_modules/


# Expose the port
EXPOSE 5001

# Start the app in production mode
CMD ["npm", "run", "start:prod"]


# # Build Stage
# FROM node:22 AS builder

# WORKDIR /app

# # Install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the entire app source code and build the app
# COPY . .
# RUN npm run build

# # Production Stage
# FROM node:22

# WORKDIR /app

# # Copy necessary files from the builder stage to the final image
# COPY --from=builder /app/package.json /app/package-lock.json /app/dist /app/node_modules /app/

# # Expose the port
# EXPOSE 5001

# # Start the app in production mode
# CMD ["npm", "run", "start:prod"]
# /////////////////////////////////////////