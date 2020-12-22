const express = require('express')
const http = require('http')
const Repl = require('./repl.js')

const port = process.env.PORT || 3000
const index = require('./index')
const app = express()
app.use(index)

const server = http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server, {
    // transports: ["websocket"],
    cors: {
        origin: '*',//'http://localhost:8080/',
        methods: ["GET", "POST"]
    }
}) // our websocket server

// let histOutputs = ''
let currOutputLength = 0
let lastOutput = ''
let currentPrompt = null
let myterm = null
// let sessionURL = 'localhost:' + port
// let isConfirmDelete = false

const WELCOME_MSG = 'WELCOME TO SPACECRAFT!\r\n'
const TOO_MUCH_OUTPUT = '\r\n------TOO MUCH OUTPUT! REPL RESTARTED-------\r\n'
const MAX_OUTPUT_LENGTH = 10000
const DEFAULT_LANG = 'julia'

let outputHistory = ''

// let interval;
io.on('connection', (socket) => {
    console.log("New client connected");
    // const handleTooMuchOutput = () => {
    //     Repl.write('\x03')
    //     initRepl(Repl.language, TOO_MUCH_OUTPUT)
    // }

    const emitOutput = (output) => {
        console.log("history: ", outputHistory)
        console.log("output: ", output)
        outputHistory += output
        if (outputHistory.length > MAX_OUTPUT_LENGTH) return handleTooMuchOutput()
        io.emit('output', { output })
    }

    const initRepl = (language, initial_msg = '') => {
        Repl.kill()
        Repl.init(language)
        outputHistory = ''
        io.emit('langChange', { language: Repl.language, data: initial_msg })
    }

    const getCurrentPrompt = () => {
        return lastOutput.split('\n').pop()
    }

    socket.on('initRepl', ({ language }) => {
        if (language === Repl.language) return
        initRepl(language)
    })

    socket.on('lineChanged', ({ line, syncSelf }) => {
        currentPrompt = currentPrompt || getCurrentPrompt()

        const data = { line, prompt: currentPrompt }
        // console.log("sending  data: ", data)
        if (syncSelf) return io.emit('syncLine', data)
        socket.broadcast.emit('syncLine', data)
    })

    socket.on('clear', () => {
        io.emit('clear')
        outputHistory = ''
    })

    socket.on('evaluate', ({ code }) => {
        currentPrompt = null
        lastOutput = ''
        currOutputLength = 0
        Repl.write(code)
        Repl.process.on('data', (data) => {
            emitOutput(data)
        })
    })

    socket.on('disconnect', () => {
        console.log('disconnected from server')
        Repl.kill()
    })

    socket.emit('output', { output: outputHistory })

})

server.listen(port, () => {
    console.log(`Listening on port: ${port}...`)
})