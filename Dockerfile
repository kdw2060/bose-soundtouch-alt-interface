FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app
COPY . .
COPY client .

# Expose client ports
EXPOSE 3001
EXPOSE 3002

# Run the app
CMD [ "node", "server.js" ]