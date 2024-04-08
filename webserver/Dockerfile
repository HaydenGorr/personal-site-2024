FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Define build-time variables
ARG CMS_ROUTE
ARG AI_API
ARG REVALIDATE_TIME_SECS
ARG VERSION

# Use build-time variable to create an environment variable
ENV CMS_ROUTE=$CMS_ROUTE
ENV AI_API=$AI_API
ENV REVALIDATE_TIME_SECS=$REVALIDATE_TIME_SECS
ENV VERSION=$VERSION

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]