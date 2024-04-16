# Use Node.js as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . ./

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Command to serve the application
CMD ["npm", "run", "preview", "--", "--port", "4173", "--host"]