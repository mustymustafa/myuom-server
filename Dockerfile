FROM node:14.17.0

FROM yarn:1.22.10

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD ["yarn", "start-dev"]