FROM node:20-alpine AS build

# Install pnpm
RUN npm install -g pnpm
