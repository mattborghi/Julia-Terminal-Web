# pull official base image
FROM node:latest

# set working directory
WORKDIR /server

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN npm rebuild node-pty --rebuild-binary

# add app
COPY . ./

# start app
CMD ["npm", "run" , "start"]