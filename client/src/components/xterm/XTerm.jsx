import React, { useEffect, useRef } from 'react';

const server_host = process.env.SERVER_HOST || "127.0.0.1"
const server_port = process.env.SERVER_PORT || 3000

let URL = 'http://' + server_host + ':' + server_port;
console.log('Connecting to terminal at: ' + URL)

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

function TerminalIDE({ footerHeight, terminalHeight, terminalConsoleVisibility }) {
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
            if (terminalConsoleVisibility) {
                termRef.current.style.height = `calc(99% - ${footerHeight}px)`
            }
            else {
                termRef.current.style.height = 0
            }
        }
        fitAddon.fit();
    }, [terminalHeight])
    // Fixes bug when clicking on show/hide pane
    useEffect(() => {
        if (termRef.current.style) {
            if (terminalConsoleVisibility) {
                termRef.current.style.height = `calc(99% - ${footerHeight}px)`
            }
        }
        fitAddon.fit();
    }, [terminalConsoleVisibility])

    useEffect(() => {
        // check if element is visible, because `terminal.open(this)` will fail otherwise
        // https://github.com/JunoLab/atom-ink/blob/87378d40a74cd83790d47971548b8d161095d805/lib/console/view.js#L13
        if (!terminalConsoleVisibility) openInitTerminal()
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

    // const iscopy = e => { return e.key === 'c' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }
    const ispaste = e => { return e.key === 'v' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }

    const handleKeybinding = e => {
        if (ispaste(e) && e.type == 'keyup') {
            navigator.clipboard.readText().then(
                clipText => socket.emit('write', { code: clipText }))
            return false
        }
        // else if (iscopy(e) && e.type == 'keyup') {
        //     console.log("handle copy")
        //     return false
        // }
        return e
    }

    useEffect(() => {
        term.attachCustomKeyEventHandler((e) => handleKeybinding(e))
    }, [])

    return <div id="terminal" className={classes.terminal} ref={termRef} />
}

export default TerminalIDE;
