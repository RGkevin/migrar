const path = require('path')
const fs = require('fs')
const FilesUtil = require('../util/files')
const {Command, flags} = require('@oclif/command')
const ControllerCommand = require('./controller')

class FixCommand extends Command {
  async run() {
    const {flags: {type, apath, channel}, args: {to, name}} = this.parse(FixCommand)
    this.filesUtil = new FilesUtil({log: this.log})

    if (type === 'action') {
      const fileToFixPath = path.join(to, apath, channel, name + this.getFormatFromType())
      this.fixAction(fileToFixPath, name)
    } else if (type === 'form') {
      this.fixForm()
      await this.fixController()
    }
  }

  fixAction(fileToFixPath, actionObj) {
    const name = actionObj.value
    this.log(`\nWill fix action \n  with name: ${name}\n   in: ${fileToFixPath}`)

    // check if json file exists
    if (!fs.existsSync(fileToFixPath)) throw new Error(`File does not exists: \n    ${fileToFixPath} \n action found in : ${actionObj.where}`)

    // load json file object
    let fileJsonObj = this.filesUtil.getJsonFromFile(fileToFixPath)
    const actionsInFile = fileJsonObj[name] && fileJsonObj[name].actions ? fileJsonObj[name].actions : []
    // will try to fix actions
    this.log(`   total actions (${actionsInFile.length})`)

    // check if actions doesn't require to be changed
    if (actionsInFile.every(a => this.canBeIgnored(a))) {
      this.log('     All actions can be ignored')
      return
    }

    fileJsonObj[name].actions = actionsInFile.map(a => this.canChangeInvokeToSnippet(a) ? this.changeInvokeToSnippet(a) : a)

    this.filesUtil.rewriteFile(fileToFixPath, fileJsonObj)
  }

  canBeIgnored(action) {
    return !this.canChangeInvokeToSnippet(action)
  }

  async fixController() {
    // fix controller
    const {flags: {module, channel, cpath, ctrl, epath, suffix}, args: {to, name}} = this.parse(FixCommand)
    const controllerFileName = name + ctrl
    const extendedControllerFile = name + suffix + ctrl
    let controllerPathToFix = path.join(to, epath, extendedControllerFile + '.js')
    if (!fs.existsSync(controllerPathToFix)) {
      controllerPathToFix = path.join(to, cpath, channel, module, controllerFileName, controllerFileName + '.js')
    }

    this.log('will fix controller')
    this.log(controllerPathToFix)
    await ControllerCommand.run([controllerPathToFix])
  }

  fixForm() {
    const {flags: {apath, channel, fpath, module}, args: {to, name}} = this.parse(FixCommand)
    const formPath = path.join(to, fpath, channel, module, name + '.sm')
    const globalIDs = []
    this.log(`Will fix form ${name} in module: ${module}\n     in: ${formPath} `)

    if (!fs.existsSync(formPath)) {
      throw new Error(`file path does not exists ${formPath}`)
    }
    // obtener lista de archivos .json de un form basado en formPath
    const files = fs.readdirSync(formPath)

    files.forEach(element => {
      const jsonPath = path.join(formPath, element)
      const ids = this.getActionsIDsFromFile(jsonPath)

      globalIDs.push(...ids)
    })

    try {
      globalIDs.forEach(element => {
        const actionFilePath = path.join(to, apath, channel, element.value + '.json')
        // console.log("ACTION PATH :" + actionFilePath)
        this.fixAction(actionFilePath, element)
      })
    } catch (error) {
      this.log('Some actions could not be fixed :: ' + error)
    }
  }

  getActionsIDsFromFile(filePath) {
    let fileJsonObj = this.filesUtil.getJsonFromFile(filePath)
    let fileActionsIDs = []

    // eslint-disable-next-line no-unused-vars
    for (let [key, value] of Object.entries(fileJsonObj)) {
      if ((typeof value === 'string') && (value.substr(0, 3) === 'AS_'))
        fileActionsIDs.push({
          where: filePath,
          value,
        })
    }

    return fileActionsIDs
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

FixCommand.description = `Fix an app component. Use -t to specify the type of component
Type can be:
- action
- form
- controller
`

FixCommand.flags = {
  type: flags.string({
    char: 't',
    description: 'Component type to fix',
    options: ['controller', 'action', 'form'],
    default: 'form',
  }),
  apath: flags.string({char: 'o', description: 'Studio Actions path', default: 'studioactions', required: true}),
  fpath: flags.string({char: 'f', description: 'Forms path', default: 'forms', required: true}),
  cpath: flags.string({char: 'c', description: 'Controllers library path', default: 'controllers'}),
  channel: flags.string({char: 'h', description: 'Platform channel', default: 'mobile'}),
  module: flags.string({char: 'm', description: 'Module name', default: 'AuthModule'}),
  ctrl: flags.string({char: 'l', description: 'Controllers suffix', default: 'Controller'}),
  epath: flags.string({char: 'e', description: 'Controllers extension path', default: 'modules/require'}),
  suffix: flags.string({char: 's', description: 'Project suffix identifier', default: 'BB'}),

}

FixCommand.args = [
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = FixCommand
