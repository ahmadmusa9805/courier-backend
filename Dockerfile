FROM node:22  AS builder
# RUN apk add --no-cache python3 make g++ 
WORKDIR /app

COPY package.json  ./
COPY package-lock.json ./

# RUN yarn cache clean
# RUN npm cache clean --force

# RUN yarn install --frozen-lockfile
# RUN npm install --production
RUN npm install

COPY . .

# RUN yarn build
RUN npm run build

FROM node:22 

WORKDIR /app

# Copy package.json is required for npm to run
COPY --from=builder /app/package.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm","run", "start:prod"]