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

const term = new Terminal({});

function TerminalIDE({ terminalConsoleVisibility }) {
    const classes = useStyles(terminalConsoleVisibility);
    const termRef = useRef(null);

    const openInitTerminal = () => {

        const terminalContainer = document.getElementById('terminal');

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
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        // console.log(xtermRef.current.terminal)
        openInitTerminal()
        // term.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r')
    }, [])

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
        term.onKey(function ({ key, domEvent }) {
            socket.emit('write', { code: key })
        })
    }, [])
    return <div id="terminal" className={classes.terminal} ref={termRef} />
}

export default TerminalIDE;
