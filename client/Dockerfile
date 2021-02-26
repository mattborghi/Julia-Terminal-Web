# pull official base image
FROM node:latest

# set working directory
WORKDIR /client

# add `/client/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
# there is an issue so we need to do this
RUN npm rebuild node-sass

# add app
COPY . ./

# start app
CMD ["npm", "run" , "start"]