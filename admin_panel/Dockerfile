FROM node:22.9.0-alpine

# Accept build arguments
ARG LOCAL_ACCESS_CMS
ARG NEXT_PUBLIC_USER_ACCESS_CMS
ARG LOCAL_ACCESS_AI
ARG NEXT_PUBLIC_USER_ACCESS_AI
# Set environment variables for the build
ENV LOCAL_ACCESS_CMS=${LOCAL_ACCESS_CMS}
ENV NEXT_PUBLIC_USER_ACCESS_CMS=${NEXT_PUBLIC_USER_ACCESS_CMS}
ENV LOCAL_ACCESS_AI=${LOCAL_ACCESS_AI}
ENV NEXT_PUBLIC_USER_ACCESS_AI=${NEXT_PUBLIC_USER_ACCESS_AI}

# Set initial workdir for main dependencies
WORKDIR /app

# Install main dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Move to admin panel directory, install deps and build
WORKDIR /app/admin_panel
RUN npm install
RUN npm run build

EXPOSE 3004

CMD ["npm", "start"]