# Pull the Node.js Docker image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /backend

# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./

# Install packages only if 'package.json' or 'yarn.lock' changes
RUN yarn install --immutable --immutable-cache

# Copy source files
COPY . ./
# Copy the sample environmental variables file
COPY .env.example ./.env
# Conditional copy to update the environmental variables file if it exist
COPY .env* ./

# Compile to javascript
RUN yarn build

# expose port for documentation purposes
EXPOSE 4000

# Run app
CMD yarn production