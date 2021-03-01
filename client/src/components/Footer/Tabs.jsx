import React, { useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from "@material-ui/core";

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            // maxWidth: 40,
            width: '100%',
            backgroundColor: '#635ee7',
        },
    },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: 'white',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
        fontFamily: theme.typography.fontFamily
    },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        left: 0,
        maxWidth: "80%"
    },
    padding: {
        padding: theme.spacing(1),
    },
}));

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

export default function TabsMenu({ consoles, value, setValue }) {
    const classes = useStyles();
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <StyledTabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                {consoles.map(id => {
                    return <StyledTab label={`Console ${id}`} value={id} key={id} {...a11yProps(id)} />
                })}
            </StyledTabs>
        </div>
    )
}