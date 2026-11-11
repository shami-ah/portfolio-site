FROM node:20-alpine
WORKDIR /app
COPY server.mjs .
COPY chat-context.mjs .
COPY knowledge ./knowledge
EXPOSE 3001
CMD ["node", "server.mjs"]
