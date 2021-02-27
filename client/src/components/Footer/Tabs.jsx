import React, { useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from "@material-ui/core";

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
        color: 'white',
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

const Consoles = [
    { "name": "Console 1" },
    { "name": "Console 2" },
    { "name": "Console 3" },
    { "name": "Console 4" },
    { "name": "Console 5" },
    { "name": "Console 6" },
    { "name": "Console 7" },
    { "name": "Console 8" },
    { "name": "Console 9" },
    { "name": "Console 10" },
    { "name": "Console 11" },
    { "name": "Console 12" },
]

export default function TabsMenu({ terminalConsoleVisibility }) {
    const classes = useStyles();
    const [value, setValue] = useState(0)

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
                {Consoles.map(({ name }, index) => {
                    return <StyledTab label={name} key={index} {...a11yProps(index)} />
                })}
            </StyledTabs>
        </div>
    )
}