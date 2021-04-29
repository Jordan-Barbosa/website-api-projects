FROM node:15-alpine

WORKDIR /src
COPY package.json package-lock.json /src/

RUN npm ci

COPY . /src

CMD ["npm", "start"]
