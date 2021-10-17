FROM node:10

WORKDIR /webpage

COPY ./webpage .

RUN npm install
RUN npx webpack



EXPOSE 8080

CMD [ "npm", "run", "start"]
