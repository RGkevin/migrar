const FilesUtil = require('../util/files')
const {Command} = require('@oclif/command')
const fs = require('fs')

class ControllerCommand extends Command {
  async run() {
    this.filesUtil = new FilesUtil({log: this.log})
    const {args: {to}} = this.parse(ControllerCommand)
    const fixStrings = [
      {
        oldString: 'applicationManager_Extn.',
        newString: 'applicationManager.',
      },
      {
        oldString: '_Extn(',
        newString: '(',
      },
      {
        oldString: 'require(\'ApplicationManager_Extn\')',
        newString: 'applicationManager',
      },
    ]

    if (!fs.existsSync(to)) throw new Error(`File does not exists: \n    ${to}`)
    fixStrings.forEach(element => {
      this.filesUtil.findAndReplace(to, element.oldString, element.newString)
    })
  }
}

ControllerCommand.description = `Describe the command here
...
Extra documentation goes here
`
ControllerCommand.args = [
  {name: 'to', description: 'Controller path to fix', required: true},
]

module.exports = ControllerCommand
