import React, { useEffect, useState } from "react"
import { makeStyles } from '@material-ui/core/styles';

import Terminal from './xterm/XTerm.jsx';
import Footer from "./Footer.jsx"


const useStyles = makeStyles((theme) => ({
    main: {
        backgroundColor: "rgb(36, 43, 56)",
    },
}))

export default function Main() {
    const classes = useStyles();
    // Opened terminals
    // const [terminal, setTerminal] = useState()
    // Control visibility 
    const [terminalConsoleVisibility, setTerminalConsoleVisibility] = useState(false)

    // useEffect(() => {
    //     console.log("visible: ", terminalConsoleVisibility)
    // }, [terminalConsoleVisibility])

    return (
        <div className={classes.main}>
            <Terminal terminalConsoleVisibility={terminalConsoleVisibility} />
            <Footer
                terminalConsoleVisibility={terminalConsoleVisibility}
                setTerminalConsoleVisibility={setTerminalConsoleVisibility}
            />
        </div>
    )
}