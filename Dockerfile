# Latest node
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 3000 (Auth)
EXPOSE 3000

# Expose port 8080 (doWeb Server)
EXPOSE 8080


# Start the application
CMD ["npm", "start"]
