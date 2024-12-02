FROM node:22.9.0-alpine

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