import React, { useContext, useEffect, useRef, useState } from 'react';

const server_host = process.env.SERVER_HOST || "127.0.0.1"
const server_port = process.env.SERVER_PORT || 3000

let URL = 'http://' + server_host + ':' + server_port;
console.log('Connecting to terminal at: ' + URL)

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import './xterm.css';

import { makeStyles } from '@material-ui/core/styles';

import { ThemeContext, JuliaThemeContext, FontContext } from "../Theme.jsx"
import { hexToRgb } from "../Footer/utils.js";

const useStyles = makeStyles((theme) => ({
    terminal: {
        height: '100%',
    },
}))


function TerminalIDE({ id, footerHeight, terminalHeight,
}) {
    const termRef = useRef(null);
    const [socket, setSocket] = useState(null)
    const [term, setTerm] = useState(null)
    const [fitAddon, setFitAddon] = useState(null)
    const [hidden, setHidden] = useState(false)

    const { background } = useContext(ThemeContext)
    const { theme } = useContext(JuliaThemeContext)
    const { fontFamily, fontSize } = useContext(FontContext)

    const classes = useStyles();

    const openInitTerminal = (key) => {
        const socket = require('socket.io-client')(URL);
        setSocket(socket)
        const term = new Terminal({
            allowTransparency: true,
            theme: {
                background,
            },
        });
        setTerm(term)
        const fitAddon = new FitAddon()
        setFitAddon(fitAddon)
        const linkAddon = new WebLinksAddon();

        const terminalContainer = document.getElementById(`terminal-${key}`);

        // plugins
        term.loadAddon(fitAddon);

        term.loadAddon(linkAddon);

        term.open(terminalContainer);

        term.element.style.padding = '10px';

        // fit windows
        fitAddon.fit();
        // focus
        term.focus();

        term.onKey(function ({ key, domEvent }) {
            socket.emit('write', { code: key })
        })

        term.attachCustomKeyEventHandler((e) => handleKeybinding(e, socket))

        socket.on('disconnect', () => {
            term.clear();
        })

        socket.on('output', ({ output }) => {
            term.write(output);
        })
    }

    useEffect(() => {
        if (term) {
            term.setOption('fontFamily', fontFamily)
            fitAddon.fit()
        }
    }, [fontFamily])

    useEffect(() => {
        if (term) {
            term.setOption('fontSize', fontSize)
            fitAddon.fit()
        }
    }, [fontSize])

    useEffect(() => {
        if (socket) socket.emit('write', { code: `@info "Changed color scheme"; colorscheme!("${theme}")\n` })
    }, [theme])

    useEffect(() => {
        if (term) term.setOption('theme', {
            background: `rgba(${hexToRgb(background)}, 0.3)`,
        })
    }, [background])

    useEffect(() => {
        setHidden(termRef.current.parentElement.hidden)
    })

    // When height changes fit again the terminal
    useEffect(() => {
        if (fitAddon && !hidden && term) {
            termRef.current.style.height = `calc(99% - ${footerHeight}px)`
            fitAddon.fit();
        }
    }, [terminalHeight])

    useEffect(() => {
        // check if element is visible, because `terminal.open(this)` will fail otherwise
        // https://github.com/JunoLab/atom-ink/blob/87378d40a74cd83790d47971548b8d161095d805/lib/console/view.js#L13
        openInitTerminal(id)
        // term.write('\x1b[1m\x1b[32mPress Enter to start Julia. \x1b[0m\n\r')
    }, [])


    const iscopy = e => { return e.key === 'c' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }
    const ispaste = e => { return e.key === 'v' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }

    const handleKeybinding = (e, socket) => {
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

    return <div id={`terminal-${id}`} className={classes.terminal} ref={termRef} />
}

export default TerminalIDE;
