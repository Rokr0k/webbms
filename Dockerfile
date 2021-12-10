FROM node:16.13.0

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# 전체 소스 코드를 다 들고오자. 단, dockerignore는 없어야 함. 
COPY ./ ./

CMD ["node", "webbms.js"]