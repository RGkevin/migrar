const fs = require('fs')
const {Command, flags} = require('@oclif/command')
const FilesUtil = require('../util/files')
const FormPathsUtil = require('../util/form-paths')

class FormCommand extends Command {
  async run() {
    // files utility instance
    const filesUtil = new FilesUtil({log: this.log})
    const {flags, args} = this.parse(FormCommand)
    this.pathsUtil = new FormPathsUtil({flags, args})
    // get flags and args
    const {
      flags: {
        mname,
      },
      args: {from},
    } = this.parse(FormCommand)
    const {
      fromFormPath,
      fromCtrlPath,
      toMConfigPath,
      toModuleFormPath,
      toModuleCtrlPath,
      toExtensionCtrlPath,
      oldFormPath,
      oldCtrlPath,
      toExtCtrlMPath,
    } = this.pathsUtil.paths

    // check if old paths exists
    if (!fs.existsSync(oldFormPath)) throw new Error(`Invalid OLD project workspace path ${oldFormPath}`)
    if (!fs.existsSync(oldCtrlPath)) throw new Error(`Invalid OLD controller project workspace path ${oldCtrlPath}`)

    // check if old paths exists
    if (!fs.existsSync(from)) throw new Error(`Invalid BASE project workspace path ${from}`)

    // get module config json as object
    let moduleConfig = filesUtil.getJsonFromFile(toMConfigPath)

    // check if will replace form
    const willReplaceForm = fs.existsSync(fromFormPath)
    if (willReplaceForm) {
      // copy and replace .json files
      this.log(`- Will move BASE files from \n    ${fromFormPath} \n    and then move OLD form as EXTENSION`)
      // move files and then replace with the old one
      if (!fs.existsSync(toModuleFormPath)) throw new Error(`Invalid toModuleFormPath ${toModuleFormPath}`)
      if (!fs.existsSync(toModuleCtrlPath)) throw new Error(`Invalid toModuleCtrlPath ${toModuleCtrlPath}`)
      await filesUtil.moveFiles(fromFormPath, toModuleFormPath)
      await filesUtil.moveFiles(fromCtrlPath, toModuleCtrlPath)

      // create module folder if not exists
      this.log(`check if toExtCtrlMPath exist. \n    ${toExtCtrlMPath}`)
      if (!fs.existsSync(toExtCtrlMPath)) {
        this.log('extension form module folder does not exists. Will create a new folder')
        await filesUtil.makeDir(toExtensionCtrlPath, mname)
      }

      // move old controllers to new path
      await filesUtil.moveFiles(oldFormPath, toModuleFormPath)
      await filesUtil.moveFiles(oldCtrlPath, toExtCtrlMPath)
      // rename files
      // rewrite module config as ext
      moduleConfig = this.getMConfigAsExtensionForm(moduleConfig)
      filesUtil.rewriteFile(toMConfigPath, moduleConfig)
    } else {
      // only move old form as brand new form
      // copy and replace .json files
      this.log(`- Will move OLD files as BRAND NEW \n  from: ${oldFormPath} \n     and: ${oldCtrlPath} \n to: ${toExtensionCtrlPath}`)
      await filesUtil.moveFiles(oldFormPath, toModuleFormPath)
      await filesUtil.moveFiles(oldCtrlPath, toModuleCtrlPath)

      // rewrite module config
      moduleConfig = this.getMConfigAsNewForm(moduleConfig)
      filesUtil.rewriteFile(toMConfigPath, moduleConfig)
    }
  }

  getMConfigAsNewForm(moduleConfig) {
    this.log('getMConfigAsNewForm:: ')
    const formKey = 'Forms'
    // const {
    // } = this.pathsUtil.paths
    const {
      flags: {
        mname,
        channel,
        ctrl,
      },
      args: {name},
    } = this.parse(FormCommand)

    moduleConfig[formKey][channel][name] = {
      Controller: `${mname}/${name}${ctrl}`,
      ControllerExtensions: [],
      FormController: 'kony.mvc.MDAFormController',
      FormName: name,
      friendlyName: name,
    }

    return moduleConfig
  }

  getMConfigAsExtensionForm(moduleConfig) {
    this.log('getMConfigAsExtensionForm:: ')
    const formKey = 'Forms'
    const extKey = 'ControllerExtensions'
    // const {
    // } = this.pathsUtil.paths
    const {
      flags: {
        mname,
        channel,
        ctrl,
      },
      args: {name},
    } = this.parse(FormCommand)

    let baseConfig = moduleConfig[formKey][channel][name]

    baseConfig[extKey].push(`${mname}/${name}${ctrl}/${name}${ctrl}`)

    return moduleConfig
  }
}

FormCommand.description = `Move a form from old source and paste it in the new workspace as extension
...
Please make sure the destination workspace is in a clean git state
`

FormCommand.flags = {
  mname: flags.string({char: 'm', description: 'Module name', required: true}),
  channel: flags.string({char: 'h', description: 'Platform channel', default: 'mobile'}),
  ctrl: flags.string({char: 's', description: 'Controllers suffix', default: 'Controller'}),
  actions: flags.string({char: 'a', description: 'Actions suffix', default: 'Actions'}),
  format: flags.string({char: 'r', description: 'Folder format suffix', default: '.sm'}),
  mconfig: flags.string({char: 'g', description: 'Module config relative path', default: 'Config/ModuleConfig.json'}),
  mpath: flags.string({char: 'p', description: 'MVC Extensions path', default: 'mvcextensions'}),
  fpath: flags.string({char: 'f', description: 'Forms library path', default: 'forms'}),
  cpath: flags.string({char: 'c', description: 'Forms library path', default: 'controllers'}),
  epath: flags.string({char: 'e', description: 'Controllers extension path', default: 'modules/require'}),
  opath: flags.string({char: 'o', description: 'Old project workspace path', default: '~/Visualizer/', required: true}),
}

FormCommand.args = [
  {name: 'from', description: 'Base project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = FormCommand
