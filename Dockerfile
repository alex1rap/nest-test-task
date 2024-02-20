# Використовуємо офіційний образ Node.js
FROM node:21.6-alpine

# Встановлюємо робочу директорію /app в контейнері
WORKDIR /app

# Копіюємо файли package.json та package-lock.json у /app
COPY package*.json ./

# Встановлюємо залежності проекту
RUN npm install -g npm@10.4.0
RUN yarn install

# Копіюємо решту файлів у /app
COPY . .

# Виконуємо команду для запуску додатку
CMD ["yarn", "start:dev"]
