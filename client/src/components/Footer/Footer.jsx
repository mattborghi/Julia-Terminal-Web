import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from "@material-ui/core";

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SettingsIcon from '@material-ui/icons/Settings';

// Custom components
import TabsMenu from "./Tabs.jsx"

const useStyles = makeStyles((theme) => ({
    footer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        justifyContent: 'flex-end',
        backgroundColor: "rgb(36, 43, 56)",
        height: footerHeight => footerHeight,
        // Uncommenting this produces an interesting bug
        // borderTop: "3px solid grey",
    },
    text: {
        color: 'white',
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        textTransform: "none",
        fontFamily: theme.typography.fontFamily,
    },
    button: {
        "&:disabled": {
            opacity: 0.5,
        }
    }
}))

// We dont need an efficient method, the number of terminals will be small
function findElement(A) {
    // only positive values, sorted
    A = A.sort((a, b) => a - b)

    let x = 1

    for (let i = 0; i < A.length; i++) {
        // if we find a smaller number no need to continue, cause the array is sorted
        if (x < A[i]) {
            return x
        }
        x = A[i] + 1
    }

    return x
}

export default function Footer({ footerHeight, terminalConsoleVisibility, setTerminalConsoleVisibility }) {
    const classes = useStyles(footerHeight);
    // Handle selected console in tab
    const [value, setValue] = useState(1)
    const [consoles, setConsoles] = useState([1]) // array of values

    const AddConsole = () => {
        const newconsole = findElement(consoles)
        setConsoles(prevConsole => prevConsole.concat(newconsole))
        setValue(newconsole)
    }

    const DeleteConsole = () => {
        setConsoles(prevConsoles =>
            prevConsoles.filter(console => console !== value))

        const index = consoles.findIndex(
            console => console === value
        );
        const idx = index - 1 < 0 ? index + 1 : index - 1
        setValue(consoles[idx])
    }

    return (
        <div className={classes.footer}>
            {/* Console name */}
            <TabsMenu consoles={consoles} value={value} setValue={setValue} />
            {/* Create new console */}
            <Tooltip title="Add">
                <IconButton size="medium" onClick={AddConsole} >
                    <AddIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            {/* Delete Console */}
            <Tooltip title="Delete">
                {/* We need the span for disabled buttons */}
                <span>
                    <IconButton
                        size="medium"
                        className={classes.button}
                        disabled={consoles.length == 1}
                        onClick={DeleteConsole}
                    >
                        <DeleteOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </span>
            </Tooltip>
            {/* Settings */}
            <Tooltip title="Settings">
                <IconButton size="medium">
                    <SettingsIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            {/* Console visibility button */}
            <Tooltip title="Shrink/Expand Panel">
                <IconButton onClick={() => setTerminalConsoleVisibility(prevState => !prevState)} size="medium">
                    {terminalConsoleVisibility ?
                        <ExpandMoreIcon fontSize="inherit" /> :
                        <ExpandLessIcon fontSize="inherit" />}
                </IconButton>
            </Tooltip>
        </div>
    )
}