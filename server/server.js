const express = require('express')
const http = require('http')
const pty = require('node-pty')
const port = process.env.PORT || 3000
const index = require('./index')
const app = express()
app.use(index)

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

    var term = pty.spawn(`julia`, [`--project=env`], {
    });

    // Listen on the terminal for output and send it to the client
    term.onData(function (data) {
        emitOutput({ output: data })
    });

    const emitOutput = ({ output }) => {
        io.emit('output', { output })
    }

    socket.on('write', ({ code }) => {
        term.write(code)
    })


    socket.on('disconnect', () => {
        console.log('disconnected from server')
        term.removeAllListeners('write')
        term.kill()
    })

})

server.listen(port, () => {
    console.log(`Listening on port: ${port}...`)
})