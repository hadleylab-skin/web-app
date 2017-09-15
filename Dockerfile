FROM node:8-alpine
ARG API_SERVER="http://localhost:8000"
RUN apk add --no-cache git
ADD package.json /package.json
ADD yarn.lock /yarn.lock
RUN yarn
RUN mkdir -p /app
ADD . /app
WORKDIR /app
RUN yarn build-web
