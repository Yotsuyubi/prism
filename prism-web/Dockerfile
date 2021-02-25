FROM node:10-alpine

WORKDIR /app
ENV NUXT_HOST 0.0.0.0

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
