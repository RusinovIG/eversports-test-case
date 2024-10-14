# Use the official Node.js image as the base image
FROM node:18 as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
COPY . .
RUN npm ci --include=dev
CMD npm run dev

FROM base as prod
COPY . .
RUN npm ci && npm run build
CMD npm serve