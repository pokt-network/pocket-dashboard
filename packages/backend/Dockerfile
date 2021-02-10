FROM node:10

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME
COPY yarn.lock $APP_HOME
COPY webpack.config.js $APP_HOME

COPY . $APP_HOME

RUN yarn install && yarn build:prod

ENV HOST=0.0.0.0 PORT=4200

EXPOSE ${PORT}
CMD [ "yarn", "start" ]
