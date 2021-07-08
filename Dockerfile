# install base image
FROM node:14.17.0

# create root application folder
WORKDIR /usr/app

# copy config files
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN yarn build
COPY .env ./dist/


EXPOSE 8080

CMD ["yarn", "start"]