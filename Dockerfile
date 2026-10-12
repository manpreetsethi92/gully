FROM node:22-alpine AS build
WORKDIR /app
# Never default to the retired Railway host: a build without the arg would ship
# a site that cannot reach any backend. fly.toml sets the real value.
ARG VITE_BACKEND_URL=https://api.trygully.com
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
