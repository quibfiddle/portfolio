# Use the official Nginx image from Docker Hub
FROM nginx:latest

# Install Certbot and Nginx SSL module
RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean

# Copy your HTML, CSS, JS, and image files into the Nginx web directory
COPY ./public/ /usr/share/nginx/html/

# Copy a basic Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for HTTP and port 443 for HTTPS
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
