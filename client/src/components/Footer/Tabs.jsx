import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from "@material-ui/core";

// const StyledTabs = withStyles({
//     indicator: {
//         display: 'flex',
//         justifyContent: 'center',
//         backgroundColor: 'transparent',
//         '& > span': {
//             maxWidth: 40,
//             width: '100%',
//             backgroundColor: '#635ee7',
//         },
//     },
// })((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

//   <div className={classes.demo2}>
//                 <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
//                 <StyledTab label="Workflows" />
//                 <StyledTab label="Datasets" />
//                 <StyledTab label="Connections" />
//                 </StyledTabs>
//                 <Typography className={classes.padding} />
//             </div>

const useStyles = makeStyles((theme) => ({
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
}))

export default function Tabs({ terminalConsoleVisibility }) {
    const classes = useStyles();
    return (
        <div className={classes.console}>
            <Typography component="div" className={classes.und}>
                <Box fontWeight="fontWeightBold" p={1}>Name:</Box>
            </Typography>
            <Typography className={classes.name}>{terminalConsoleVisibility ? "Console 1" : "-"}</Typography>
        </div>
    )
}