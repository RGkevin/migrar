const path = require('path')
const fs = require('fs')
const FilesUtil = require("../util/files");
const {Command, flags} = require('@oclif/command')

class FixCommand extends Command {
  async run() {
    const filesUtil = new FilesUtil({log: this.log})
    const {flags: {type, apath, channel}, args: {to, name}} = this.parse(FixCommand)
    const fileToFixPath = path.join(to, apath, channel, name + this.getFormatFromType())
    this.log(`Will fix ${type} \n  with name: ${fileToFixPath}\n   in: ${to}`)

    // check if json file exists
    if (!fs.existsSync(fileToFixPath)) throw new Error(`File does not exists: \n    ${fileToFixPath}`)

    // load json file object
    let fileJsonObj = filesUtil.getJsonFromFile(fileToFixPath)
    const actionsInFile = fileJsonObj[name] && fileJsonObj[name].actions ? fileJsonObj[name].actions : []
    // will try to fix actions
    this.log(`Will try to fix (${actionsInFile.length}) actions`)
    const newActions = actionsInFile.map(a => this.canChangeInvokeToSnippet(a) ? this.changeInvokeToSnippet(a) : a)
    this.log('old')
    this.log(actionsInFile)
    this.log('new')
    this.log(newActions)
    fileJsonObj[name].actions = newActions
    this.log('new file config')
    this.log(fileJsonObj)

    filesUtil.rewriteFile(fileToFixPath, fileJsonObj)
  }

  getFormatFromType() {
    const {flags: {type}} = this.parse(FixCommand)
    return type === 'action' ? '.json' : type === 'controller' ? '.js' : '.json'
  }

  changeInvokeToSnippet(action) {
    const {id, display} = action
    return {
      id,
      type: 'ADD_SNIPPET',
      codeSnippet: `this.${display}();`,
      parentId: null,
      callbackType: null,
    }
  }

  canChangeInvokeToSnippet(action) {
    return action.type && action.inputparams && action.type === 'INVOKE_FUNCTION' && action.inputparams.length === 0
  }
}

FixCommand.description = `Describe the command here
...
Extra documentation goes here
`

FixCommand.flags = {
  type: flags.string({
    char: 't',
    description: 'Fix type',
    options: ['controller', 'action'],
    required: true,
  }),
  apath: flags.string({char: 'o', description: 'Studio Actions path', default: 'studioactions', required: true}),
  channel: flags.string({char: 'h', description: 'Platform channel', default: 'mobile'}),
}

FixCommand.args = [
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = FixCommand
