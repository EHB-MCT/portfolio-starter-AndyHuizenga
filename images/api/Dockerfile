# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install


# Bundle your app source code into the container
COPY ./src ./src

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start"]
