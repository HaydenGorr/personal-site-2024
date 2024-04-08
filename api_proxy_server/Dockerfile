FROM node:18

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
ENV CMS_ROUTE=$CMS_ROUTE
ENV ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]