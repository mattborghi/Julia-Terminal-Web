import React, { useEffect, useRef, useState } from 'react';

let URL = 'http://' + process.env.HOST + ':' + process.env.PORT;
console.log('Connecting to ' + URL)
const socket = require('socket.io-client')(URL);

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
// import { SearchAddon } from 'xterm-addon-search';

import './xterm.css'
import './main.css'

const term = new Terminal({
    // windowsMode: ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0,
    // convertEol: true,
    cols: 80,
    rows: 100,
    fontFamily: `'Fira Mono', monospace`,
    fontSize: 14,
    fontWeight: 400,
    // rendererType: "canvas" // canvas 或者 dom
});

// const DISALLOWED_KEYS = ['Escape']
var searchAddon = ''

function TerminalIDE() {
    const termRef = useRef(null)
    var curr_line = "";
    // const [line, setLine] = useState('')

    const cleanTerminal = (terminalContainer) => {
        while (terminalContainer.children.length) {
            terminalContainer.removeChild(terminalContainer.children[0]);
        }
        term.clear();
    };

    const openInitTerminal = () => {
        // console.log("loading terminal...");
        const terminalContainer = document.getElementById('terminal');

        cleanTerminal(terminalContainer);
        // style
        term.setOption("theme", {
            background: "black",
            foreground: "white"
        });

        // plugins
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        const linkAddon = new WebLinksAddon();
        term.loadAddon(linkAddon);

        // searchAddon = new SearchAddon();
        // term.loadAddon(searchAddon);

        term.open(terminalContainer);

        term.element.style.padding = '10px';
        // fit windows
        fitAddon.fit();
        // focus
        term.focus();

    }

    // useEffect(() => {
    //     socket.on('clear', () => {
    //         console.log('cleaning')
    //         term.clear();
    //     })
    // }, []);

    useEffect(() => {
        // when get the data from backend
        socket.on('output', ({ output, fromTab }) => {
            term.write(output);
            // setLine('')
            // if (fromTab) {
            // console.log('receiving data: ', output)
            // console.log('index: ', output.indexOf(JULIA_HEADER))
            // console.log("length: ", JULIA_HEADER.length)
            // var index = output.indexOf(JULIA_HEADER) + JULIA_HEADER.length
            // curr_line = output.substring(index)
            // } else {
            curr_line = ""
            // }
        });
        return () => {
            socket.disconnect();
        }
    }, []);
   
    const emitInitRepl = () => {
        socket.emit('initRepl', { language: 'julia' })
    }

    useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        // console.log(xtermRef.current.terminal)
        openInitTerminal()
        // term.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r')
        // TODO: This is non necessary
        // emitInitRepl()
    }, [])

    useEffect(() => {
        // console.log(term)
    })

    // useEffect(() => {
    //     // TODO: Maybe we can restrict moving if curr_line is not empty
    //     socket.on('history', ({ output }) => {
    //         curr_line = output
    //     })
    // }, [])

    term.onKey(function ({ key, domEvent }) {
        console.log("ON KEY: ", key, domEvent)
        if (domEvent.key == 'Enter') {
            socket.emit('enter', { code: "" })
        } else if (domEvent.key == 'Tab') {
            socket.emit('tab2', { code: "" })
        } else if (domEvent.key == 'Backspace') {
            socket.emit('delete', { code: "" })
        } else if (domEvent.key == 'ArrowUp') {
            // || domEvent.key == 'ArrowDown'
        } else if (domEvent.key == 'ArrowLeft' || domEvent.key == 'ArrowRight') {
        } else {
            socket.emit('test', { code: domEvent.key })
        }
    })

    // term.onKey(function ({ key, domEvent }) {
    //     // console.log("ON KEY: ", key, domEvent)
    //     if (domEvent.key == 'Enter') {
    //         socket.emit('evaluate', { code: curr_line })
    //         curr_line = ""
    //     } else if (domEvent.key == 'Backspace') {
    //         if (curr_line.length > 0) {
    //             term.write('\b \b')
    //             curr_line = curr_line.slice(0, -1)
    //             // TODO: It would be better to use useState but it's not working
    //             // setLine(prevState => prevState.slice(0, -1))
    //         }
    //     } else if (domEvent.key == 'ArrowUp' || domEvent.key == 'ArrowDown') {
    //         console.log("ARROWS")
    //         // get the latest history element
    //         // if (domEvent.key == 'ArrowUp') socket.emit('history', { previous: true })
    //         // if (domEvent.key == 'ArrowDown') socket.emit('history', { previous: false })
    //     } else if (domEvent.key == 'ArrowLeft' || domEvent.key == 'ArrowRight') {
    //         console.log("ARROWS")
    //     } else if (domEvent.key == 'Tab') {
    //         console.log("TAB")
    //         // TODO: I can autocomplete when I write the whole word
    //         // term.write(curr_line + '\t')
    //         socket.emit('tab', { code: curr_line })
    //         // curr_line = ''
    //         //} else if ((domEvent.key == ']' || domEvent.key == '?') && line == '') {
    //         //     setLine('')
    //         //     socket.emit('evaluate', { code: domEvent.key })
    //         // } else if (domEvent.key == 'Ctrl + c') { // TODO: Implement for killing a running process
    //     } else if (DISALLOWED_KEYS.includes(domEvent.key)) {
    //         console.log("DISALLOWED KEY: ", domEvent.key)
    //         // do nothing
    //     } else if (domEvent.ctrlKey || domEvent.altKey || domEvent.shiftKey) {
    //         console.log("COMPOSED KEY")
    //         term.write(domEvent.key);
    //         curr_line += domEvent.key;
    //     } else {
    //         // It's not a special key write it in the terminal
    //         term.write(domEvent.key);
    //         curr_line += domEvent.key;
    //     }
    //     // console.log('Line: ', curr_line)
    // });

    return (
        <div id="terminal" ref={termRef} style={{ position: "fixed", width: "100%", marginTop: '20px' }} />
    )
}

export default TerminalIDE;