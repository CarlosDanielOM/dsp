# Stage 1: Build the Angular application
FROM node:24-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Create the directory for the files
RUN mkdir -p /var/www/dsp-code

# Copy the build output from the build-stage to the preferred directory
COPY --from=build-stage /app/dist/dsp/browser /var/www/dsp-code

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
