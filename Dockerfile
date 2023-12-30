# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 4000 (or the port your app is running on)
EXPOSE 4000

# Define the command to run your app using CMD which runs when the container starts
CMD ["node", "src/app.js"]
