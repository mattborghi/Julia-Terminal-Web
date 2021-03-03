import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color'

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
    popover: {
        position: 'absolute',
        zIndex: 2,
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
}));


export default function SketchExample({ color, setColor }) {
    const classes = useStyles({ color })
    const [displayColorPicker, setDisplayColorPicker] = useState(false)

    const handleClick = () => {
        setDisplayColorPicker(prevState => !prevState)
    };

    const handleClose = () => {
        setDisplayColorPicker(false)
    };

    const handleChange = (color) => {
        setColor(color.hex)
    };

    return (
        <div>
            <div className={classes.swatch} onClick={handleClick}>
                <div className={classes.color} />
            </div>
            { displayColorPicker ? <div className={classes.popover}>
                <div className={classes.cover} onClick={handleClose} />
                <SketchPicker color={color} onChange={handleChange} />
            </div> : null}

        </div>
    )
}
