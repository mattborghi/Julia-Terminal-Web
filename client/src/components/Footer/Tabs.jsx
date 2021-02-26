import React, { useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Tab, Tabs } from "@material-ui/core";

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: '#635ee7',
        },
    },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: '#fff',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
    },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 0.4,
    },
    padding: {
        padding: theme.spacing(1),
    },
}));

export default function TabsMenu({ terminalConsoleVisibility }) {
    const classes = useStyles();
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                <StyledTab label="Console 1" />
                <StyledTab label="Console 2" />
                <StyledTab label="Console 3" />
            </StyledTabs>
            <Typography className={classes.padding} />
        </div>
    )
}