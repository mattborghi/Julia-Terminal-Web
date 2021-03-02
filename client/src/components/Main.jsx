import React, { useEffect, useState } from "react"
import { makeStyles } from '@material-ui/core/styles';

import Split from 'react-split-it';

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer/Footer.jsx";
import TabPanel from "./Footer/TabPanel.jsx"


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
    const footerHeight = 50;
    const termInitialSize = 45;

    const classes = useStyles();
    const [terminalHeight, setTerminalHeight] = useState(termInitialSize) // in %

    // Control visibility 
    const [terminalConsoleVisibility, setTerminalConsoleVisibility] = useState(true)

    const newTerminal = (key, footerHeight, terminalHeight, terminalConsoleVisibility) => {
        return (
            <Terminal
                id={key}
                footerHeight={footerHeight}
                terminalHeight={terminalHeight}
                terminalConsoleVisibility={terminalConsoleVisibility}
            />
        )
    }

    // Handle selected console in tab
    const [value, setValue] = useState(1)
    const [consoles, setConsoles] = useState([1])


    // Better show/hide terminal height
    // useEffect(() => {
    //     if (terminalConsoleVisibility) {
    //         setTerminalHeight(45)
    //     } else {
    //         setTerminalHeight(termInitialSize)
    //     }
    // }, [terminalConsoleVisibility])

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
                        value={value}
                        setValue={setValue}
                        consoles={consoles}
                        setConsoles={setConsoles}
                        footerHeight={footerHeight}
                        terminalConsoleVisibility={terminalConsoleVisibility}
                        setTerminalConsoleVisibility={setTerminalConsoleVisibility}
                    />
                    {consoles.map((key) => {
                        return (
                            <TabPanel value={value} key={key} index={key}>
                                {newTerminal(key, footerHeight, terminalHeight, terminalConsoleVisibility)}
                            </TabPanel>
                        )
                    })}
                </div>
            </Split>
        </div>
    )
}