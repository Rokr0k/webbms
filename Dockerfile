FROM node:16.13.0

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY ./ ./

CMD ["node", "webbms.js"]
