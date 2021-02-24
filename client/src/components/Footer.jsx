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
        height: '40px',
        borderTop: "1px solid grey",
    },
    icon: {
        color: 'white',
    },
    text: {
        color: 'white',
    },
    console: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        // justifyContent: 'space-between'
        // minWidth: '180px',
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


export default function Footer({ terminalConsoleVisibility, setTerminalConsoleVisibility }) {
    const classes = useStyles();
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
            <IconButton size="small" className={classes.circle}>
                <AddIcon className={classes.icon} />
            </IconButton>
            {/* Console visibility button */}
            <IconButton onClick={() => setTerminalConsoleVisibility(prevState => !prevState)}>
                <Typography className={classes.text}>Open Terminal</Typography>
                {terminalConsoleVisibility ? <ExpandMoreIcon className={classes.icon} /> : <ExpandLessIcon className={classes.icon} />}
            </IconButton>
        </div>
    )
}