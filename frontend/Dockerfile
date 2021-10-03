FROM node:13.12.0-alpine
RUN npm install -g serve

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./
RUN npm run build

# start app
CMD ["serve", "-s", "build", "-l", "3000"]