FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Define build-time variables
ARG ANTHROPIC_API_KEY
ARG CMS_ROUTE
ARG PORT

# Use build-time variable to create an environment variable
ENV PORT=$PORT
ARG CMS_ROUTE=$CMS_ROUTE
ARG ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY

EXPOSE 3001

CMD ["npm", "run", "start:dev"]