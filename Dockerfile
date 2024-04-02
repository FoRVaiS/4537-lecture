from node:latest


workdir /app
copy . .
run npm install
CMD ["node", "server.js"]
