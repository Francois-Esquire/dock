FROM node:alpine

ENV NODE_ENV production

EXPOSE 3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./dist ./

RUN npm install

USER node

CMD ["npm", "start"]
