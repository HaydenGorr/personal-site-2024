FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


FROM node:22.9.0-alpine

# Set initial workdir for main dependencies
WORKDIR /app

# Install main dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]