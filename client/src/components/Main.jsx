import React, { useEffect, useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Split from 'react-split-it';

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer/Footer.jsx"


const useStyles = makeStyles((theme) => ({
    main: {
        //Fixes minimal overflow on the terminal bottom
        height: "103vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "rgb(36, 43, 56)",
    },
}))

export default function Main() {
    // Opened terminals
    // const [terminal, setTerminal] = useState()
    const footerHeight = 50;
    const termInitialSize = 10;

    const classes = useStyles();
    const [terminalHeight, setTerminalHeight] = useState(termInitialSize) // in %

    // Control visibility 
    const [terminalConsoleVisibility, setTerminalConsoleVisibility] = useState(false)

    // Better show/hide terminal height
    useEffect(() => {
        if (terminalConsoleVisibility) {
            setTerminalHeight(45)
        } else {
            setTerminalHeight(termInitialSize)
        }
    }, [terminalConsoleVisibility])

    return (
        <div className={classes.main}>
            <Split
                className="split-vertical"
                direction="vertical"
                gutterSize={3}
                minSize={footerHeight}
                sizes={[1.0 - (terminalHeight / 100), terminalHeight / 100]}
                onSetSizes={(sizes) => {
                    setTerminalHeight(sizes[1] * 100)
                }}
            >
                <div style={{ 'backgroundColor': 'blue', 'visibility': 'hidden', 'height': '100%' }}></div>
                <div style={{ 'height': '100%' }}>
                    <Footer
                        footerHeight={footerHeight}
                        terminalConsoleVisibility={terminalConsoleVisibility}
                        setTerminalConsoleVisibility={setTerminalConsoleVisibility}
                    />
                    <Terminal
                        footerHeight={footerHeight}
                        terminalHeight={terminalHeight}
                        terminalConsoleVisibility={terminalConsoleVisibility}
                    />
                </div>
            </Split>
        </div>
    )
}