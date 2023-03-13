# Temporary image to build the React app
FROM node:18.14 AS react-builder

# Copy source code
COPY ./frontend /frontend
WORKDIR /frontend

# Install JavaScript dependencies
RUN npm install

# Build React app
RUN npm run build


# Final runtime image
FROM nginx:1.22 AS runtime

# Copy server configuration
COPY ./backend/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY --from=react-builder /frontend/build /usr/share/nginx/html
