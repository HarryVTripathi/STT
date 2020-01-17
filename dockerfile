#specifying base image
FROM node:10-alpine

#copying files from local (source) to image (destination)
COPY package.json ./
COPY src ./src/

#specifying commands to be executed while building the image
RUN npm install

EXPOSE 3003
CMD  node src/index.js