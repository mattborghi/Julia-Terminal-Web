import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import ColorPicker from "./ColorPicker.jsx"
import { hexToRgb } from "./utils.js";
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Paper,
    AppBar,
    Toolbar,
    Typography,
    ListItem,
    List,
    TextField,
    ListItemText,
    Select,
    Divider,
    IconButton
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Draggable from 'react-draggable';
import CloseIcon from '@material-ui/icons/Close';


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: ({ background }) => background,
        cursor: "move",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    dialog: {
        maxHeight: "60vh",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    content: {
        maxWidth: '100%',
        backgroundColor: ({ background }) => {
            const rgb = hexToRgb(background)
            return `rgba(${rgb},0.5)`
        },
    },
    details: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const JULIA_THEMES = ["JuliaDefault",
    "Monokai16",
    "Monokai256",
    "Monokai24bit",
    "BoxyMonokai256",
    "TomorrowNightBright",
    "TomorrowNightBright24bit",
    "OneDark",
    "Base16MaterialDarker"]

const FONT_FAMILY = ["Verdana", "Arial"]

export default function DraggableDialog({ open, setOpen }) {
    const [background, setBackground] = useState("#242b38")
    const [theme, setTheme] = useState(JULIA_THEMES[0])
    const [fontFamily, setFontFamily] = useState(FONT_FAMILY[0])
    const [fontSize, setFontSize] = useState(12)
    const classes = useStyles({ background });

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            className={classes.dialog}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <AppBar className={classes.appBar} id="draggable-dialog-title">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Settings
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                {/* background */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ColorPicker color={background} setColor={setBackground} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <ListItemText primary="Background Color" secondary={background} />
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails className={classes.details}>
                        <SketchPicker
                            color={background}
                            onChangeComplete={(color) => setBackground(color.hex)}
                        />
                    </AccordionDetails>
                </Accordion>
                {/* Julia theme */}
                <Accordion>
                    <AccordionSummary
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <ListItemText primary="Julia Theme" secondary={theme} />
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails className={classes.details}>
                        <Select
                            native
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                        >
                            {JULIA_THEMES.map(theme => {
                                return <option key={theme} value={theme}>{theme}</option>
                            })}
                        </Select>
                    </AccordionDetails>
                </Accordion>
                {/* Font family */}
                <Accordion>
                    <AccordionSummary
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <ListItemText primary="Font familiy" secondary={fontFamily} />
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails className={classes.details}>
                        <Select
                            native
                            value={fontFamily}
                            onChange={e => setFontFamily(e.target.value)}
                        >
                            {FONT_FAMILY.map(font => {
                                return <option key={font} value={font}>{font}</option>
                            })}
                        </Select>
                    </AccordionDetails>
                </Accordion>
                {/* Font size */}
                <Accordion>
                    <AccordionSummary
                        aria-controls="panel4a-content"
                        id="panel4a-header"
                    >
                        <ListItemText primary="Font Size" secondary={fontSize} />
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails className={classes.details}>
                        <TextField id="standard-basic" defaultValue={fontSize} autoComplete="off" inputProps={{ type: 'number' }} onChange={e => setFontSize(e.target.value)} />
                    </AccordionDetails>
                </Accordion>

            </DialogContent>
        </Dialog>
    );
}
