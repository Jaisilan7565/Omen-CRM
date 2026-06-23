FROM node:20-alpine

# Install build dependencies for native modules (e.g. bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5000

# Run migrations, seed admin, and start the application
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm run seed:admin && npm start"]
