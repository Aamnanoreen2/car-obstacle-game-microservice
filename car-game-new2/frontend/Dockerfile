# Use Nginx to serve the static content
FROM nginx:alpine

# Copy the static files into the Nginx container
COPY ./index.html /usr/share/nginx/html/
COPY ./style.css /usr/share/nginx/html/
COPY ./game.js /usr/share/nginx/html/

# Expose port 80 to access the game
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
