FROM node:12.16.1

WORKDIR /usr/src/

COPY . ./
RUN npm install
RUN npm run build
CMD npm start
