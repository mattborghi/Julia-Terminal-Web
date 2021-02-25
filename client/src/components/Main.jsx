import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Split from 'react-split-it';

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer.jsx"


const useStyles = makeStyles((theme) => ({
    main: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "rgb(36, 43, 56)",
    },
}))

export default function Main() {
    // Opened terminals
    // const [terminal, setTerminal] = useState()
    const footerHeight = 40;
    const termInitialSize = 35;

    const classes = useStyles(footerHeight);
    const [terminalHeight, setTerminalHeight] = useState(termInitialSize) // in %

    // Control visibility 
    const [terminalConsoleVisibility, setTerminalConsoleVisibility] = useState(false)

    return (
        <div className={classes.main}>
            <Split
                className="split-vertical"
                direction="vertical"
                gutterSize={3}
                sizes={[1.0 - (terminalHeight / 100), terminalHeight / 100]}
                onSetSizes={(sizes) => {
                    setTerminalHeight(sizes[1] * 100)
                }}
            >
                <div style={{ 'backgroundColor': 'blue', 'visibility': 'hidden', 'height': '100%' }}></div>
                {/* <div style={{ 'backgroundColor': 'blue', 'visibility': 'visible', 'height': '100%' }}></div> */}
                <Terminal
                    terminalHeight={terminalHeight}
                    terminalConsoleVisibility={terminalConsoleVisibility}
                />
            </Split>
            <Footer
                footerHeight={footerHeight}
                terminalConsoleVisibility={terminalConsoleVisibility}
                setTerminalConsoleVisibility={setTerminalConsoleVisibility}
            />
        </div>
    )
}