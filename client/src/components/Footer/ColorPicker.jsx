import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: ({ color }) => color,
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
}));


export default function SketchExample({ color }) {
    const classes = useStyles({ color })

    return (
        <div className={classes.swatch}>
            <div className={classes.color} />
        </div>
    )
}
