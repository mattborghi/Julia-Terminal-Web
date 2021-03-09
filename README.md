# Julia Terminal on the web

Implementation of Julia console on the web.

## Instructions

First install all the necessary dependencies `npm install` on `server` and `client` folders.

Then, simply run 

```sh
npm run start
``` 

on both `server` and `client` folders.

There is also a simple script called `RUN.dev.sh` where you can run both servers with one command.

> For watching changes in the `server` you can instead run `npm run watch` to run a `nodemon` instance.

## Docker 

In the root folder

### Client

```sh
docker build -t client client/
docker run -it -p 8080:8080 client
```

### Server

```sh
docker build -t server server/
docker run -it -p 3000:3000 server
```

### Compose

Instead, we can run both docker with one command using `docker compose` as follows.

```sh
docker-compose up --build
```

Open the project at `http://localhost:8080/`.

## Preview video

[![Video Preview](./assets/imag/terminal.png)](https://youtu.be/6E5Deijb9vk)

## Resources

- [EasyDockerWeb](https://github.com/qfdk/EasyDockerWeb)

- [Evala](https://github.com/krasimir/evala)

- [Spacecraft](https://hackernoon.com/building-spacecraft-a-real-time-collaborative-repl-deebcf084ed9)
