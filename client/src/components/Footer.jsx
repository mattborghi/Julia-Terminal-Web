import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Box } from "@material-ui/core";

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    footer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "rgb(36, 43, 56)",
        height: footerHeight => footerHeight,
        borderTop: "3px solid grey",
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
    console: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    und: {
        color: 'white',
        textDecoration: 'bold',
    },
    name: {
        color: 'white',
        minWidth: '100px',
        maxWidth: '100px',
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    circle: {
        color: 'white',
    },
}))


export default function Footer({ footerHeight, terminalConsoleVisibility, setTerminalConsoleVisibility }) {
    const classes = useStyles(footerHeight);
    return (
        <div className={classes.footer}>
            {/* Console name */}

            <div className={classes.console}>
                <Typography component="div" className={classes.und}>
                    <Box fontWeight="fontWeightBold" p={1}>Name:</Box>
                </Typography>
                <Typography className={classes.name}>{terminalConsoleVisibility ? "Console 1" : "-"}</Typography>
            </div>
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