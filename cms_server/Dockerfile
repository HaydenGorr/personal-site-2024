FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use build-time variable to create an environment variable
ENV PORT=$PORT
# DATA_DIR is not used when running locally. This ENV VAR makes the code use the storage volume
ENV DATA_DIR=$DATA_DIR

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]