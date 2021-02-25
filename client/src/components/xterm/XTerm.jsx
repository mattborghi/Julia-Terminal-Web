import React, { useEffect, useRef } from 'react';

let URL = 'http://' + process.env.HOST + ':' + process.env.PORT;
console.log('Connecting to ' + URL)
const socket = require('socket.io-client')(URL);

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import './xterm.css';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    terminal: {
        visibility: terminalConsoleVisibility => terminalConsoleVisibility ? "visible" : "hidden",
    },
}))

const term = new Terminal({
    allowTransparency: true,
    theme: {
        background: "rgba(0, 0, 0, 0.3)",
        // background: "rgba(36, 43, 56, 0.3)"
    },
});
const fitAddon = new FitAddon();
const linkAddon = new WebLinksAddon();

function TerminalIDE({ terminalHeight, terminalConsoleVisibility }) {
    const classes = useStyles(terminalConsoleVisibility);
    const termRef = useRef(null);

    const openInitTerminal = () => {

        const terminalContainer = document.getElementById('terminal');

        // plugins
        term.loadAddon(fitAddon);

        term.loadAddon(linkAddon);

        term.open(terminalContainer);

        term.element.style.padding = '10px';
        // fit windows
        fitAddon.fit();
        // focus
        term.focus();

    }

    // When height changes fit again the terminal
    useEffect(() => {
        if (termRef.current.style) {
            termRef.current.style.height = "99.99%"
        }
        fitAddon.fit();
    }, [terminalHeight])

    useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        // console.log(xtermRef.current.terminal)
        openInitTerminal()
        // term.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r')
    }, [])

    useEffect(() => {
        socket.on('disconnect', () => {
            console.log('disconnected terminal connection');
            term.clear();
        })
    }, [])

    useEffect(() => {
        // when get the data from backend
        socket.on('output', ({ output }) => {
            term.write(output);
        })
    }, []);

    useEffect(() => {
        term.onKey(function ({ key, domEvent }) {
            socket.emit('write', { code: key })
        })
    }, [])
    return <div id="terminal" className={classes.terminal} ref={termRef} />
}

export default TerminalIDE;
