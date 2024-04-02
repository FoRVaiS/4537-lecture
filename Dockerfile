from node:latest


workdir /app
copy . .
CMD ["node", "server.js"]
