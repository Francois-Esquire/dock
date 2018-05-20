FROM node:alpine

EXPOSE 3000

ENV PORT=3000

ENV NODE_ENV=production

RUN mkdir -p /mnt/docker/app

WORKDIR /mnt/docker/app

COPY . ./

RUN npm install

CMD ["npm", "start"]
