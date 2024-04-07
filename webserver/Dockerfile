FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Define build-time variables
ARG CMS_ROUTE
ARG AI_API
ARG REVALIDATE_TIME_SECS

# Use build-time variable to create an environment variable
ENV CMS_ROUTE=$CMS_ROUTE
ARG AI_API=$AI_API
ARG REVALIDATE_TIME_SECS=$REVALIDATE_TIME_SECS

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]