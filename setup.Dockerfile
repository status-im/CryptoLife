FROM node:8.11.1-alpine

RUN apk --update add git && rm -rf /var/cache/apk/*
# required behind some ISP:
RUN git config --global url.https://github.com.insteadof git://github.com

RUN apk --no-cache add git openssh python make gcc g++ && rm -rf /var/cache/apk/*

WORKDIR /setup
COPY ./setup /setup
COPY ./contracts /setup/contracts
RUN yarn

CMD ["yarn", "setup", "http://ganache:8545"]
