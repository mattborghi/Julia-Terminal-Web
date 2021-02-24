import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from "@material-ui/core";

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    footer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: "rgb(36, 43, 56)",
        height: '40px',
        borderTop: "1px solid grey",
    },
    icon: {
        color: 'white',
    },
    text: {
        color: 'white',
    },
}))


export default function Footer({ terminalConsoleVisibility, setTerminalConsoleVisibility }) {
    const classes = useStyles();
    return (
        <div className={classes.footer}>
            <IconButton onClick={() => setTerminalConsoleVisibility(prevState => !prevState)}>
                <Typography className={classes.text}>Open Terminal</Typography>
                {terminalConsoleVisibility ? <ExpandMoreIcon className={classes.icon} /> : <ExpandLessIcon className={classes.icon} />}
            </IconButton>
        </div>
    )
}