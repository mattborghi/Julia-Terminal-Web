import React, { useEffect, useState } from "react"
import { makeStyles } from '@material-ui/core/styles';

import Split from 'react-split-it';

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer/Footer.jsx";
import TabPanel from "./Footer/TabPanel.jsx"
import GitHub from "./GitHub/Github.jsx";


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
    split: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
}))

export default function Main() {
    const footerHeight = 50;
    const termInitialSize = 35;

    const classes = useStyles();
    const [terminalHeight, setTerminalHeight] = useState(termInitialSize) // in %

    const newTerminal = (key, footerHeight, terminalHeight) => {
        return (
            <Terminal
                id={key}
                footerHeight={footerHeight}
                terminalHeight={terminalHeight}
            />
        )
    }

    // Handle selected console in tab
    const [value, setValue] = useState(1)
    const [consoles, setConsoles] = useState([1])

    return (
        <div className={classes.main}>
            <Split
                className={classes.split}
                direction="vertical"
                gutterSize={1}
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
                    />
                    {consoles.map((key) => {
                        return (
                            <TabPanel value={value} key={key} index={key}>
                                {newTerminal(key, footerHeight, terminalHeight)}
                            </TabPanel>
                        )
                    })}
                </div>
            </Split>

            <GitHub />
        </div>
    )
}