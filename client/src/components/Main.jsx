import React, { useEffect, useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Split from 'react-split'

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer.jsx"


const useStyles = makeStyles((theme) => ({
    main: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
        justifyContent: "space-between",
        backgroundColor: "rgb(36, 43, 56)",
    },
    split: {
        height: footerHeight => `calc(100% - ${footerHeight}px)`,
    },
}))

export default function Main() {
    // Opened terminals
    // const [terminal, setTerminal] = useState()
    const footerHeight = 40;
    const termInitialSize = 75;

    const classes = useStyles(footerHeight);
    const [terminalHeight, setTerminalHeight] = useState(termInitialSize) // in %

    // Control visibility 
    const [terminalConsoleVisibility, setTerminalConsoleVisibility] = useState(false)

    return (
        <div className={classes.main}>
            <Split
                className={classes.split}
                sizes={[25, termInitialSize]}
                // minSize={100}
                // expandToMin={false}
                gutterSize={20}
                gutterAlign="center"
                // snapOffset={30}
                // dragInterval={1}
                direction="vertical"
                cursor="row-resize"
                onDrag={(sizes) => {
                    setTerminalHeight(sizes[1])
                }}
            >
                <div style={{ 'backgroundColor': 'blue', 'visibility': 'hidden', 'height': '100%' }}></div>
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