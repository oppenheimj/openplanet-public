FROM node:10

WORKDIR /skins

COPY ./skins .

RUN npm install

COPY . .

EXPOSE 8093

CMD [ "npm", "run", "start" ]
