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
  const [locked, setLocked] = useState(false)

  const clearTermLine = () => xtermRef.current.terminal.writeln('\u001b[2K\r')
  const setTermPrompt = () => xtermRef.current.terminal.writeln(currentPrompt)
  const resetTermLine = () => {
    clearTermLine()
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
      // console.log('client -> init repl')
      socket.emit('initRepl', { language })
    },

    clearLine() {
      setLastLineLength(line.length)
      setLine("")
      ClientRepl.emitLineChanged()
    },

    handleEnter() {
      // console.log("Pressed ENTER")
      if (locked) return
      setLocked(true)
      let lineOfCode = line
      ClientRepl.clearLine()
      // console.log("sending: ", lineOfCode)
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
      if (locked) return
      setLine(prevState => prevState += key)
      ClientRepl.emitLineChanged()
      xtermRef.current.terminal.write(key)
    },

    handleCtrlC() {
      clearLine()
      ClientRepl.emitEvaluate('\x03')
    },

    // Handle special keys (Enter, Backspace).
    // @param: KeyboardEvent
    handleKeydown({ key, ctrlKey }) {
      // console.log("KEY: ", key)
      if (key === 'Enter') ClientRepl.handleEnter()
      else if (key === 'Backspace') ClientRepl.handleBackspace()
      else if (key === 'c' && ctrlKey) ClientRepl.handleCtrlC()
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
      if (locked) {
        setLocked(false)
        writeBackspaces(lastLineLength)
      }
      console.log("output: ", output)
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

    // socket.on('clear', () => {
    //   state.line = ''
    //   resetTermScreen()
    // })

  }, [])

  // const cleanTerminal = (terminalContainer) => {
  //   // 清除容器的子节点
  //   while (terminalContainer.children.length) {
  //     terminalContainer.removeChild(terminalContainer.children[0]);
  //   }
  //   term.clear();
  // };

  // const openInitTerminal = () => {
  //   // console.log("loading terminal...");
  //   const terminalContainer = document.getElementById('terminal');
  //   cleanTerminal(terminalContainer);
  //   // style
  //   term.setOption("theme", {
  //     background: "black",
  //     foreground: "white"
  //   });

  //   // plugins
  //   const fitAddon = new FitAddon();
  //   term.loadAddon(fitAddon);

  //   term.open(terminalContainer);

  //   term.element.style.padding = '10px';
  //   // fit windows
  //   fitAddon.fit();
  //   // focus
  //   term.focus();

  // };

  // const handleOk = () => {
  //   openInitTerminal();
  //   term.writeln('Welcome to xterm.js');
  //   term.writeln('This is a local terminal with a real data stream in the back-end.');
  //   term.writeln('');
  // };

  useEffect(() => {
    // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
    // xtermRef.current.terminal.writeln("Hello, World!")
    // xtermRef.current.terminal.writeln(
    //   "Please enter any string then press enter:"
    // );
    // xtermRef.current.terminal.write("echo> ");
    // term.on('keypress', ClientRepl.handleKeypress.bind(ClientRepl))
    // term.on('keydown', ClientRepl.handleKeydown.bind(ClientRepl))
    // runButton.addEventListener('click', ClientRepl.handleRunButtonClick.bind(ClientRepl))
    // languageSelectElem.addEventListener('change', ClientRepl.handleLanguageChange.bind(ClientRepl))

  }, [])

  useEffect(() => {
    console.log(currentPrompt, "prompt")
    console.log("line: ", line)
  })


  return (
    <>
      <XTerm ref={xtermRef} options={{ cursorBlink: true, fontFamily: 'monospace' }}
        onKey={({ key, domEvent }) => {
          // console.log("key: ", key)
          // console.log("dom: ", domEvent)
          ClientRepl.handleKeypress(key)
          ClientRepl.handleKeydown({key: domEvent.code, ctrlKey: domEvent.ctrlKey})
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
      {/* addons={[attachAddon]} */}
      {/* <div id="terminal" style={{ height: "100%", width: "100%", marginTop: '20px' }} /> */}
    </>
  )
}

export default TerminalIDE;