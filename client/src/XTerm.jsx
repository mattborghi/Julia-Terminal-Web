import React, { useEffect, useRef } from 'react';

let URL = 'http://' + process.env.HOST + ':' + process.env.PORT;
console.log('Connecting to ' + URL)
const socket = require('socket.io-client')(URL);

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import './xterm.css'
import './main.css'

const term = new Terminal({
    // convertEol: true,
    cols: 80,
    rows: 100,
    fontFamily: `'Fira Mono', monospace`,
    fontSize: 14,
    fontWeight: 400,
});

function TerminalIDE() {
    const termRef = useRef(null);

    const openInitTerminal = () => {
        const terminalContainer = document.getElementById('terminal');

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

        term.open(terminalContainer);

        term.element.style.padding = '10px';
        // fit windows
        fitAddon.fit();
        // focus
        term.focus();

    }

    useEffect(() => {
        // when get the data from backend
        socket.on('output', ({ output }) => {
            term.write(output);
        });
        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        // console.log(xtermRef.current.terminal)
        openInitTerminal()
        // term.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r')
    }, [])

    term.onKey(function ({ key, domEvent }) {
        socket.emit('write', { code: key })
    })

    return (
        <div style={{ width: '100vh', height: '100vh', padding: 0 }}>
            <div id="terminal" ref={termRef} />
        </div>
    )
}

export default TerminalIDE;