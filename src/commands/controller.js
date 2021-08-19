const FilesUtil = require('../util/files')
const {Command} = require('@oclif/command')
const fs = require('fs')

class ControllerCommand extends Command {
  async run() {
    this.filesUtil = new FilesUtil({log: this.log})
    // fix strings
    await this.fixStrings()
    // fix structure
    await this.fixStructure()
  }

  async fixStructure() {
    const {args: {to}} = this.parse(ControllerCommand)
    this.log(`Will fix code Structure in controller: \n    ${to}`)
    if (!fs.existsSync(to)) throw new Error(`File does not exists: \n    ${to}`)
  }

  async fixStrings() {
    const {args: {to}} = this.parse(ControllerCommand)
    this.log(`Will fix Strings in controller: \n   ${to}`)
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
    for (let i = 0, len = fixStrings.length; i < len; i++) {
      const element = fixStrings[i]
      // eslint-disable-next-line no-await-in-loop
      await this.filesUtil.findAndReplace(to, element.oldString, element.newString)
    }
  }
}

ControllerCommand.description = `Fix javascript file
use the absolute path to the file
`
ControllerCommand.args = [
  {name: 'to', description: 'Controller path to fix', required: true},
]

module.exports = ControllerCommand
