import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from "@material-ui/core";

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

// Custom components
import TabsMenu from "./Tabs.jsx"

const useStyles = makeStyles((theme) => ({
    footer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "rgb(36, 43, 56)",
        height: footerHeight => footerHeight,
        // Uncommenting this produces an interesting bug
        // borderTop: "3px solid grey",
    },
    icon: {
        color: 'white',
    },
    text: {
        color: 'white',
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right',
    },
    circle: {
        color: 'white',
        position: "absolute",
        left: "50%",
    },
}))


export default function Footer({ footerHeight, terminalConsoleVisibility, setTerminalConsoleVisibility }) {
    const classes = useStyles(footerHeight);
    return (
        <div className={classes.footer}>
            {/* Console name */}
            <TabsMenu terminalConsoleVisibility={terminalConsoleVisibility} />
            {/* Create new console */}
            <IconButton size="small" className={classes.circle} >
                <AddIcon className={classes.icon} />
            </IconButton>
            {/* Console visibility button */}
            <IconButton onClick={() => setTerminalConsoleVisibility(prevState => !prevState)}>
                <Typography className={classes.text}>{terminalConsoleVisibility ? "Hide Terminals" : "Show Terminals"}</Typography>
                {terminalConsoleVisibility ? <ExpandMoreIcon className={classes.icon} /> : <ExpandLessIcon className={classes.icon} />}
            </IconButton>
        </div>
    )
}