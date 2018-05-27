FROM node:alpine

RUN adduser -D app app

WORKDIR /home/app

COPY package.json .

ENV NODE_ENV=production

RUN npm install

COPY . .

ENV HOST=localhost
ENV DOMAIN=localhost
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

USER app
