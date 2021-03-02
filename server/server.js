const express = require('express')
const http = require('http')
const pty = require('node-pty')
const index = require('./index')
const app = express()
app.use(index)

const ENV_PATH = '../.env'

const dotenv =
    require('dotenv').config({ path: __dirname + '/' + ENV_PATH })

const port = typeof dotenv === undefined ?
    dotenv.parsed.SERVER_PORT : process.env.SERVER_PORT || 3000
const host = typeof dotenv === undefined ?
    dotenv.parsed.SERVER_HOST : process.env.SERVER_HOST || "0.0.0.0"

const server = http.createServer(app)
const socketIo = require('socket.io')

// our websocket server
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

// let interval;
io.on('connection', (socket) => {
    socket.join(socket.id)
    // The startup file is read from a custom file located in env/startup.jl
    // There we have for example our custom configuration with OhMyRepl (we dont have Revise)
    // The interactive mode is necessary to leave the console open
    var term = pty.spawn(`julia`, [`-i`, `--startup-file=no`, `--project=env`, `env/startup.jl`], {
    });
    // Listen on the terminal for output and send it to the client
    term.onData(function (data) {
        emitOutput({ output: data })
    });

    const emitOutput = ({ output }) => {
        io.to(socket.id).emit('output', { output })
    }

    socket.on('write', ({ code }) => {
        term.write(code)
    })

    socket.on('disconnecting', () => {
        console.log("disconnecting: ", socket.id)
        console.log(socket.rooms); // the Set contains at least the socket ID
    });

    socket.on('disconnect', () => {
        console.log('disconnected from server: ', socket.id)
        // term.removeAllListeners('write')
        // term.kill()
    })
})

server.listen(port, host, () => {
    console.log(`Listening on -> http://${host}:${port}`)
})