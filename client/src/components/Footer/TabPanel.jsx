import React from "react";

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            style={{ width: '100%', height: '100%' }}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}
