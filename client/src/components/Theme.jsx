import React, { createContext, useState, useEffect } from "react"

export const JULIA_THEMES = ["JuliaDefault",
    "Monokai16",
    "Monokai256",
    "Monokai24bit",
    "BoxyMonokai256",
    "TomorrowNightBright",
    "TomorrowNightBright24bit",
    "OneDark",
    "Base16MaterialDarker"]

export const FONT_FAMILY = [
    "Courier New",
    "DejaVu Sans Mono",
    "Ubuntu Mono",
]

export const ThemeContext = createContext({ background: "#fff", setBackground: () => null });
export const JuliaThemeContext = createContext({ theme: "" })
export const FontContext = createContext({
    fontFamily: "", setFontFamily: () => null,
    fontSize: 0, setFontSize: () => null,
})

export default function Theme({ children }) {
    const [background, setBackground] = useState("#242b38");
    const [theme, setTheme] = useState(JULIA_THEMES[0]);
    const [fontFamily, setFontFamily] = useState(FONT_FAMILY[0])
    const [fontSize, setFontSize] = useState(12)

    // useEffect(() => {
    //     console.log(fontFamily, fontSize)
    // }, [fontSize, fontFamily])

    return (
        <ThemeContext.Provider value={{ background, setBackground }}>
            <JuliaThemeContext.Provider value={{ theme, setTheme }}>
                <FontContext.Provider value={{ fontFamily, setFontFamily, fontSize, setFontSize }}>
                    {children}
                </FontContext.Provider>
            </JuliaThemeContext.Provider>
        </ThemeContext.Provider>
    )
}