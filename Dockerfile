# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3200

# Start the app
CMD ["node", "dist/main.js"] 