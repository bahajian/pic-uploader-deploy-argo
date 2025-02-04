FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy built React app
COPY build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Set non-root user
RUN chown -R 1001:0 /usr/share/nginx/html /var/log/nginx /tmp && chmod -R g+w /usr/share/nginx/html /var/log/nginx /tmp

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
