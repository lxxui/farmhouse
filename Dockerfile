# 1. Base image Node.js
FROM node:18-alpine

# 2. ตั้ง working directory ใน container
WORKDIR /app

# 3. copy package.json และ package-lock.json เพื่อติดตั้ง dependencies
COPY package.json package-lock.json ./

# 4. ติดตั้ง dependencies
RUN npm install

# 5. copy source code ทั้งหมด
COPY . ./

# 6. build React app
RUN npm run build

# 7. expose port ของ frontend
EXPOSE 3000

# 8. start backend server (Node.js)
CMD ["node", "server.js"]
