
// const debug = require('debug')('Repl')

// @todo: Check if we should add some or all of the boilerplate in the node-pty readme.
const pty = require('node-pty')
// const COMMANDS = require('./LangCommands.js')
const COMMANDS = {
  julia: 'julia',
  python: 'python3',
  bash: 'bash'
}

const Repl = {
  // @todo: Check if it's necessary to set these two props to `null`.
  language: null,
  process: null,


  init (language) {
    // debug(`[Repl.init(language = "${language}")]`)
    const command = COMMANDS[language]
    
    if (command) {
      this.process = pty.spawn(command, [], {
        cols: 80,
        rows: 100,
      })
      this.language = language
    //   debug(`  INITIALIZED command: ${command}`)
    //   debug('  this.process: %O, this.language: "%s"', this.process, this.language)

      // @todo: Is it necessary to return `this` here? -- it doesn't appear to be used anywhere.
      return this
    }
  },

  write (string) {
    // debug(`[Repl.write(string = ${string})]`)
    // @todo: Check if we also need a carriage return here, like in the node-pty readme.
    if (process) {
      this.process.write(string + '\r')
      // this.process.resize(100, 30)
    }
  },

  kill () {
    // debug('[kill()] this.process: %o', this.process)

    // @todo: Check if `kill` is the best method to use here.
    if (this.process) {
      this.process.removeAllListeners('data')
      this.process.kill()
      this.process = null
    //   debug('Repl process killed.')
    }
    this.language = null
  }
}

module.exports = Repl