const path = require('path')
const fs = require('fs')
const FilesUtil = require('../util/files')
const {Command, flags} = require('@oclif/command')

class FixCommand extends Command {
  async run() {
    this.filesUtil = new FilesUtil({log: this.log})
    const {flags: {type, apath, channel}, args: {to, name}} = this.parse(FixCommand)

    if (type === 'action') {
      this.fixAction()
    } else if (type === 'controller') {
      this.fixController()
    } else if (type === 'form') {
      this.fixForm()
    }
  }

  fixAction() {
    const {flags: {type, apath, channel}, args: {to, name}} = this.parse(FixCommand)
    const fileToFixPath = path.join(to, apath, channel, name + this.getFormatFromType())
    this.log(`Will fix ${type} \n  with name: ${fileToFixPath}\n   in: ${to}`)

    // check if json file exists
    if (!fs.existsSync(fileToFixPath)) throw new Error(`File does not exists: \n    ${fileToFixPath}`)

    // load json file object
    let fileJsonObj = this.filesUtil.getJsonFromFile(fileToFixPath)
    const actionsInFile = fileJsonObj[name] && fileJsonObj[name].actions ? fileJsonObj[name].actions : []
    // will try to fix actions
    this.log(`Will try to fix (${actionsInFile.length}) actions`)
    fileJsonObj[name].actions = actionsInFile.map(a => this.canChangeInvokeToSnippet(a) ? this.changeInvokeToSnippet(a) : a)

    this.filesUtil.rewriteFile(fileToFixPath, fileJsonObj)
  }

  fixController() {
    // TODO add controller fix logic
  }

  fixForm() {
    const {flags: {type, apath, channel, fpath, module}, args: {to, name}} = this.parse(FixCommand)
    const formPath = path.join(to, fpath, channel, module, name + '.sm')
    const globalIDs = []
    this.log(`Will fix form ${name} in module: ${module}\n     in: ${formPath} `)

    if (!fs.existsSync(formPath)) {
      throw new Error(`file path does not exists ${formPath}`)
    }
    // TODO add fix form actions
    // obtener lista de archivos .json de un form basado en formPath
    const files = fs.readdirSync(formPath);

    files.forEach( (element) => {
      const jsonPath = path.join(formPath, element)
      const ids = this.getActionsIDsFromFile(jsonPath)

      globalIDs.push(...ids)
    });

    globalIDs.forEach( (element) => {
      const actionFilePath = path.join(to, apath, 'mobile/'+element+'.json')
      //console.log("ACTION PATH :" + actionFilePath)
      this.fixGlobalActions(actionFilePath, element)
    });
  }

  getActionsIDsFromFile(filePath){
    let fileJsonObj = this.filesUtil.getJsonFromFile(filePath)
    let fileActionsIDs = []
  
    for (let [key, value] of Object.entries(fileJsonObj)) {
      if((typeof value == "string") && (value.substr(0, 3) == "AS_"))
        fileActionsIDs.push(value)
    }
    
    return fileActionsIDs
  }

  fixGlobalActions(path, name) {

    this.log(`Will fix action \n  with name: ${name}\n   in: ${path}`)

    // check if json file exists
    if (!fs.existsSync(path)) throw new Error(`File does not exists: \n    ${path}`)

    // load json file object
    let fileJsonObj = this.filesUtil.getJsonFromFile(path)
    const actionsInFile = fileJsonObj[name] && fileJsonObj[name].actions ? fileJsonObj[name].actions : []
    // will try to fix actions
    this.log(`Will try to fix (${actionsInFile.length}) actions`)
    fileJsonObj[name].actions = actionsInFile.map(a => this.canChangeInvokeToSnippet(a) ? this.changeInvokeToSnippet(a) : a)

    this.filesUtil.rewriteFile(path, fileJsonObj)
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
    options: ['controller', 'action', 'form'],
    required: true,
  }),
  apath: flags.string({char: 'o', description: 'Studio Actions path', default: 'studioactions', required: true}),
  fpath: flags.string({char: 'f', description: 'Forms path', default: 'forms', required: true}),
  channel: flags.string({char: 'h', description: 'Platform channel', default: 'mobile'}),
  module: flags.string({char: 'm', description: 'Module name', default: 'AuthModule'}),
}

FixCommand.args = [
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = FixCommand
