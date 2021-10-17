FROM nginx:alpine

COPY ./nginx/nginx.dev.conf /etc/nginx/conf.d/default.conf
