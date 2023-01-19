FROM node:16-alpine as base

WORKDIR /src
COPY ./ /src/
RUN npm install

FROM base as production
ENV NODE_ENV=production
RUN npm install -g pm2
RUN npm run build

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon