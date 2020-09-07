FROM node:12.0-slim as builder
WORKDIR /app-client
#ENV PATH ./node_modules/.bin:$PATH
COPY ./package*.json /app-client/
RUN yarn install
RUN yarn global add react-scripts
COPY . .
RUN yarn run build

#CMD [ "node", "index.js" ]
#CMD ["yarn", "run", "start"]
FROM node:12.0-slim
RUN yarn global add serve
WORKDIR /app-client
COPY --from=builder /app-client/build .
CMD ["serve", "-p", "3000", "-s", "."]