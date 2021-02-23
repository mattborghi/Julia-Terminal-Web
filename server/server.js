const express = require('express')
const http = require('http')
// const Repl = require('./repl.js')
const pty = require('node-pty')
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

const MAX_HISTORY_LENGTH = 5
let histOutputs = []
let CURRENT_HIST_ITEM = histOutputs.length
// let currOutputLength = 0
// let lastOutput = ''
// let currentPrompt = null
// let myterm = null
// let sessionURL = 'localhost:' + port
// let isConfirmDelete = false

// const WELCOME_MSG = 'WELCOME TO SPACECRAFT!\r\n'
// const TOO_MUCH_OUTPUT = '\r\n------TOO MUCH OUTPUT! REPL RESTARTED-------\r\n'
// const MAX_OUTPUT_LENGTH = 10000
const DEFAULT_LANG = 'julia'

// let outputHistory = ''

// let interval;
io.on('connection', (socket) => {
    // console.log("New client connected");
    var fromTab = false
    var term = pty.spawn(DEFAULT_LANG, [], {
        // name: 'xterm-color',
        // cols: 80,
        // rows: 30,
        // cwd: process.env.HOME,
        // env: process.env
    });

    // Listen on the terminal for output and send it to the client
    term.onData(function (data) {
        console.log('data: ', data)
        // console.log('fromTab: ', fromTab)
        emitOutput({ output: data, fromTab })
    });

    // This repeats output
    // term.on('data', (data) => {
    //     console.log('data: ', data)
    // })


    // const handleTooMuchOutput = () => {
    //     // Repl.write('\x03')
    //     term.write('\x03')
    //     initRepl(Repl.language, TOO_MUCH_OUTPUT)
    // }

    const emitOutput = ({ output, fromTab }) => {
        // outputHistory += output
        // if (outputHistory.length > MAX_OUTPUT_LENGTH) return handleTooMuchOutput()
        io.emit('output', { output, fromTab })
    }

    const writeShowRepl = ({ code }) => {
        term.write(code + '\r')
        // Repl.write(code)
        // Repl.process.onData((data) => {
        //     console.log('got data: ', data)
        //     // process.stdout.write(data)
        //     emitOutput(data)
        // })
    }

    // const initRepl = (language, initial_msg = '') => {
    //     // Repl.kill()
    //     // TODO: Clean up the term when reconnecting
    //     console.log('cleaning')
    //     io.emit('clear', {})
    //     term.removeAllListeners('data')
    //     term.kill()
    //     // Repl.init(language)
    //     // outputHistory = ''
    //     // io.emit('langChange', { language: Repl.language, data: initial_msg })
    //     io.emit('langChange', { language: DEFAULT_LANG, data: initial_msg })
    //     // Show Julia init screen
    //     writeShowRepl({ code: '' })
    //     console.log('finishesd')
    // }

    // const getCurrentPrompt = () => {
    //     return lastOutput.split('\n').pop()
    // }

    // socket.on('initRepl', ({ language }) => {
        // if (language === DEFAULT_LANG) return
        // initRepl(language)
    // })

    // socket.on('lineChanged', ({ line, syncSelf }) => {
    //     currentPrompt = currentPrompt || getCurrentPrompt()

    //     const data = { line, prompt: currentPrompt }
    //     if (syncSelf) return io.emit('syncLine', data)
    //     socket.broadcast.emit('syncLine', data)
    // })

    // socket.on('clear', () => {
    //     io.emit('clear')
    //     // outputHistory = ''
    // })

    socket.on('tab', ({ code }) => {
        console.log('received: ', code)
        term.write(code + '\t')
        fromTab = true
        // get back term.read()?
        // io.emit('', { output: })
    })

    socket.on('evaluate', ({ code }) => {
        // currentPrompt = null
        // lastOutput = ''
        // currOutputLength = 0
        writeShowRepl({ code })
        // after evaluation add element to history
        // appendHistory(code)
    })

    // const appendHistory = code => {
    //     // first check if the history is full
    //     console.log('history: ', histOutputs, ' of length: ', histOutputs.length)
    //     if (histOutputs.length == MAX_HISTORY_LENGTH) histOutputs.shift()
    //     console.log('adding: ', code)
    //     histOutputs.push(code)
    // }

    // socket.on('history', ({ previous }) => {
        // current element: CURRENT_HIST_ITEM
        // we can search over: histOutputs.length
        // if we want to search previous (previous = true) 
        // we have to decrease the index if it is > 0. Can't be less than zero.
        // if (previous) { // previous = true

        // } else { // previous = false

        // }
        // we have to return historyOutput[CURRENT_HIST_ITEM]
        // term.write('holaaa')
        // io.emit('history', { output: 'hollaa' })
        // term.write(histOutputs[CURRENT_HIST_ITEM])
    // })

    socket.on('disconnect', () => {
        console.log('disconnected from server')
        // Repl.kill()
        term.removeAllListeners('data')
        term.kill()
        cleanVariables()
    })

    const cleanVariables = () => {
        histOutputs = []
    }

    // socket.emit('output', { output: outputHistory })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}...`)
})