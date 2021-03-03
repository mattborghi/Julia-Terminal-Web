import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import ColorPicker from "./ColorPicker.jsx"
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
    ListItemText,
    Divider,
    IconButton
} from '@material-ui/core';
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
        maxHeight: "50vh",
    },
}));

export default function DraggableDialog({ open, setOpen }) {
    const [background, setBackground] = useState("#242b38")
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
            <DialogContent>

                {/* write content  */}
                <List>
                    <ListItem button>
                        <ListItemText primary="Background Color" secondary={background} />
                        <ColorPicker color={background} setColor={setBackground} />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                {/* write actions */}
            </DialogActions>
        </Dialog>
    );
}
