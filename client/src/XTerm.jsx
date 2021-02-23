import React, { useEffect, useRef, useState } from 'react';
const socket = require('socket.io-client')('http://localhost:3000');

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

const DISALLOWED_KEYS = ['Escape']

function TerminalIDE() {
    const termRef = useRef(null)
    var curr_line = "";
    // const [line, setLine] = useState('')

    const cleanTerminal = (terminalContainer) => {
        // 清除容器的子节点
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

        // const searchAddon = new SearchAddon();
        // term.loadAddon(searchAddon);
        // searchAddon.findNext()

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
            // console.log('receiving data: ', output)
            term.write(output);
            // setLine('')
            curr_line = fromTab ? output : ""
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

        emitInitRepl()
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
        // console.log('pressed: ', tEvent.key)
        if (domEvent.key == 'Enter') {
            socket.emit('evaluate', { code: curr_line })
            curr_line = ""
        } else if (domEvent.key == 'Backspace') {
            console.log('length: ', curr_line.length)
            if (curr_line.length > 0) {
                //         console.log('erasing')
                term.write('\b \b')
                curr_line = curr_line.slice(0, -1)
            }
            //     setLine(prevState => prevState.slice(0, -1))
        } else if (domEvent.key == 'ArrowUp' || domEvent.key == 'ArrowDown') {
            // get the latest history element
            // if (domEvent.key == 'ArrowUp') socket.emit('history', { previous: true })
            // if (domEvent.key == 'ArrowDown') socket.emit('history', { previous: false })
        } else if (domEvent.key == 'ArrowLeft' || domEvent.key == 'ArrowRight') {

        } else if (domEvent.key == 'Tab') {
            // TODO: I can autocomplete when I write the whole word
            socket.emit('tab', { code: curr_line })
            //} else if ((domEvent.key == ']' || domEvent.key == '?') && line == '') {
            //     setLine('')
            //     socket.emit('evaluate', { code: domEvent.key })
            // } else if (domEvent.key == 'Ctrl + c') { // TODO: Implement for killing a running process
        } else if (DISALLOWED_KEYS.includes(domEvent.key)) { // do nothing 
        } else {
            curr_line += domEvent.key;
            term.write(domEvent.key);
        }
        console.log('Line: ', curr_line)
    });

    return (
        <div id="terminal" ref={termRef} style={{ position: "fixed", width: "100%", marginTop: '20px' }} />
    )
}

export default TerminalIDE;