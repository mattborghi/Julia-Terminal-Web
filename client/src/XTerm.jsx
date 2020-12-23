import React, { useEffect, useState } from 'react';
const socket = require('socket.io-client')('http://localhost:3000');

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

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


function TerminalIDE() {
    const [line, setLine] = useState('')

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
            // console.log('receiving data: ', output)
            term.write(output);
            setLine('')
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


    useEffect(() => {
        // console.log('Line: ', line)
    }, [line])

    const PressedKeyUp = (e) => {
        if (e.key == 'Enter') {
            socket.emit('evaluate', { code: line })
            setLine('')
        } else if (e.key == 'Alt') {
        }
        else if (e.key == 'Backspace') {
            // console.log('erased: ', line)
            setLine(prevState => prevState.slice(0, -1))
            if (line.length > 0) term.write('\b \b')
        }
        else if ((e.key == ']' || e.key == '?') && line == '') {
            setLine('')
            socket.emit('evaluate', { code: e.key })
        }
        else if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') {

        }
        else if (e.key == 'Tab') {
            socket.emit('tab', { code: line })
        }
        else {
            setLine(prevState => prevState + e.key)
            term.write(e.key)
        }
    }

    const PressedKeyDown = e => {
        // special characters mainly
        console.log('pressed down: ', e.key)
    }

    return (
        <div id="terminal" onKeyUp={PressedKeyUp} onKeyDown={PressedKeyDown} style={{ position: "fixed", width: "100%", marginTop: '20px' }} />
    )
}

export default TerminalIDE;