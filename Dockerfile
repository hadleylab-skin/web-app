FROM node:8-alpine
ADD package.json /package.json
ADD yarn.lock /yarn.lock
RUN yarn
RUN mkdir -p /app
ADD . /app
WORKDIR /app
