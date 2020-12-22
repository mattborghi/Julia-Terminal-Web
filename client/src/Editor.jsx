import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client'
import { XTerm } from 'xterm-for-react'
import './main.css'

const url = 'http://localhost:3000/'

let socket;

function TerminalIDE() {
  const xtermRef = useRef(null)
  const [language, setLanguage] = useState('julia')
  const [line, setLine] = useState("")
  const [lastLineLength, setLastLineLength] = useState(0)
  const [currentPrompt, setCurrentPrompt] = useState("")
  // const [locked, setLocked] = useState(false)

  const clearTermLine = () => xtermRef.current.terminal.writeln('\u001b[2K\r')
  const setTermPrompt = () => xtermRef.current.terminal.writeln(currentPrompt)
  const resetTermLine = () => {
    clearTermLine()
    setTermPrompt()
  }
  const clearTermScreen = () => xtermRef.current.terminal.reset()
  const resetTermScreen = () => {
    clearTermScreen()
    setTermPrompt()
  }
  const writeBackspaces = (length) => {
    for (let i = 0; i < length; i++) xtermRef.current.terminal.write('\b \b')
  }

  const ClientRepl = {
    emitEvaluate(code) {
      socket.emit('evaluate', { code })
    },

    emitClear() {
      socket.emit('clear')
    },

    // Emit 'lineChanged` event to server --> server broadcasts 'syncLine' to clients.
    emitLineChanged({ syncSelf = undefined } = {}) {
      socket.emit('lineChanged', { line: line, syncSelf })
    },

    emitInitRepl() {
      socket.emit('initRepl', { language })
    },

    clearLine() {
      setLastLineLength(line.length)
      setLine("")
      ClientRepl.emitLineChanged()
    },

    handleEnter() {
      // if (locked) return
      // setLocked(true)
      let lineOfCode = line
      ClientRepl.clearLine()
      ClientRepl.emitEvaluate(lineOfCode)
    },

    handleBackspace() {
      if (line === '') return
      setLine(line.slice(0, -1))
      ClientRepl.emitLineChanged()
      xtermRef.current.terminal.write('\b \b')
    },

    // Handle character keys.
    handleKeypress(key) {
      // console.log('pressed key -> locked: ', locked)
      // if (locked) return
      setLine(prevState => prevState += key)
      ClientRepl.emitLineChanged()
      xtermRef.current.terminal.write(key)
    },

    handleCtrlC() {
      ClientRepl.clearLine()
      ClientRepl.emitEvaluate('\x03')
    },

    // Handle special keys (Enter, Backspace).
    // @param: KeyboardEvent
    handleKeydown({ key, ctrlKey }) {
      if (key === 'Enter') ClientRepl.handleEnter()
      else if (key === 'Backspace') ClientRepl.handleBackspace()
      else if (key === 'c' && ctrlKey) ClientRepl.handleCtrlC()
      // Special Julia characters
      else if (key == ';' || key == ']') ClientRepl.handleEnter()
    },

    //   // handleRunButtonClick() {
    //   //   let editorCode = editor.getValue().trim()
    //   //   if (editorCode === '') return
    //   //   this.emitLineChanged({ syncSelf: true })
    //   //   this.emitClear()
    //   //   this.emitEvaluate(editorCode)
    //   // },

  }

  useEffect(() => {
    socket = socketIOClient(url)

    ClientRepl.emitInitRepl()
    // CLEAN UP THE EFFECT
    return () => {
      console.log("disconnected");
      socket.disconnect();
    }
  }, [])

  // #~~~~~~~~~~~~~~~~~ Socket ~~~~~~~~~~~~~~~~~#
  useEffect(() => {
    socket.on('output', ({ output }) => {
      // if (locked) {
        // setLocked(false)
        writeBackspaces(lastLineLength)
      // }
      xtermRef.current.terminal.write(output)
    })

    socket.on('langChange', ({ language, data }) => {
      // editor.setOption('mode', language)
      setLanguage(language)
      // languageSelectElem.value = language
      xtermRef.current.terminal.reset()
      xtermRef.current.terminal.write(data)
    })

    // Sync line of client so that it's the same as the line from server.
    socket.on('syncLine', ({ line, prompt }) => {
      setCurrentPrompt(prompt)
      setLine(line)
      resetTermLine()
      xtermRef.current.terminal.write(line)
    })

    socket.on('clear', () => {
      setLine('')
      resetTermScreen()
    })

  }, [])

  useEffect(() => {
    // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
    // console.log(xtermRef.current.terminal)
  }, [])

  useEffect(() => {
    // console.log(currentPrompt, "prompt")
    // console.log("line: ", line)
    // console.log('locked: ', locked)
  })

  return (
    <XTerm ref={xtermRef} options={{ cursorBlink: true, fontFamily: 'monospace' }}
      onKey={({ key, domEvent }) => {
        // console.log("key: ", key)
        // console.log("dom: ", domEvent)
        ClientRepl.handleKeypress(key)
        ClientRepl.handleKeydown({ key: domEvent.code, ctrlKey: domEvent.ctrlKey })
      }}
      onData={(data) => {
        // console.log("data: ", data)
        //   const code = data.charCodeAt(0);
        //   // If the user hits empty and there is something typed echo it.
        //   if (code === 13 && input.length > 0) {
        //     xtermRef.current.terminal.write(
        //       "\r\nYou typed: '" + input + "'\r\n"
        //     );
        //     xtermRef.current.terminal.write("echo> ");
        //     setInput("")
        //   } else if (code < 32 || code === 127) { // Disable control Keys such as arrow keys
        //     return;
        //   } else { // Add general key press characters to the terminal
        //     xtermRef.current.terminal.write(data);
        //     setInput(input + data)
        //   }
      }}
    />
  )
}

export default TerminalIDE;