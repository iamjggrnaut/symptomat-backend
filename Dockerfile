FROM node:12.19-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build


FROM node:12.19-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN apk add bash
ENTRYPOINT ["sh", "-c"]
EXPOSE 5000
CMD ["node -r ./tsconfig-paths-bootstrap.js dist/src/main.js"]