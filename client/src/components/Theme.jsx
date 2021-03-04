import React, { createContext, useState, useEffect } from "react"


export const ThemeContext = createContext({ background: "#fff", setBackground: () => null });

export default function Theme({ children }) {
    const [background, setBackground] = useState("#242b38")

    // useEffect(() => {
    //     console.log(background)
    // }, [background])

    return (
        <ThemeContext.Provider value={{ background, setBackground }}>
            {children}
        </ThemeContext.Provider>
    )
}