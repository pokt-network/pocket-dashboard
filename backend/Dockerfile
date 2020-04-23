FROM node:10

ARG PORT

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME
COPY yarn.lock $APP_HOME

RUN yarn install

COPY . $APP_HOME
