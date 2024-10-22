FROM node:latest
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .

# Build TypeScript code (assuming tsconfig.json is in the root)
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
