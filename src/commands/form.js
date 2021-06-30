const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
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
        channel,
        ctrl,
        actions,
        format,
        mconfig,
        mpath,
        fpath,
        cpath,
        epath,
        opath,
      },
      args: {from, to, name},
    } = this.parse(FormCommand)
    const {
      fromFormPath,
      fromCtrlPath,
      toMConfigPath,
      toModuleFormPath,
      toFormPath,
      toCtrlPath,
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
      await filesUtil.moveFiles(fromFormPath, toModuleFormPath)
      await filesUtil.moveFiles(fromCtrlPath, toModuleCtrlPath)
      // move old controllers to new path
      await filesUtil.moveFiles(oldFormPath, toModuleFormPath)
      await filesUtil.moveFiles(oldCtrlPath, toModuleCtrlPath)
      // rewrite module config as ext
      moduleConfig = this.getMConfigAsExtensionForm(moduleConfig)
      filesUtil.rewriteFile(toMConfigPath, moduleConfig)
    } else {
      // only move old form as brand new form
      // copy and replace .json files
      this.log(`- Will move OLD files as BRAND NEW \n  from: ${oldFormPath} \n     and: ${oldCtrlPath}`)
      await filesUtil.moveFiles(oldFormPath, toModuleFormPath)
      await filesUtil.moveFiles(oldCtrlPath, toExtensionCtrlPath)

      // rewrite module config
      moduleConfig = this.getMConfigAsNewForm(moduleConfig)
      filesUtil.rewriteFile(toMConfigPath, moduleConfig)
    }

    // create and get new path
    // await filesUtil.moveFiles(oldCtr)
    // define local flags
    // const formsLibPath = 'forms'
    // const ctrlLibPath = 'controllers'

    // define absolute paths FROM
    // const fromFormPath = path.join(from, fpath, channel, name + format)
    // const fromCtrlPath = path.join(from, cpath, channel, name + ctrl)

    // if (!fs.existsSync(fromFormPath)) throw new Error(`Invalid BASE project workspace path \n ${fromFormPath}`)

    // define absolute paths TO
    // const toMConfigPath = path.join(to, mpath, mname, mconfig)
    // const toModuleFormPath = path.join(to, fpath, channel, mname)
    // const toFormPath = path.join(to, fpath, channel, mname, name + format)
    // const toCtrlPath = path.join(to, cpath, channel, mname, name + ctrl)
    // const toModuleCtrlPath = path.join(to, cpath, channel, mname)
    // const toExtensionCtrlPath = path.join(to, epath)

    // await filesUtil.moveFiles(fromFormPath, toModuleFormPath)
    //
    // // copy controllers and actions
    // this.log('\n\n- Will move Controllers files')
    // let _toCtrlPath = toModuleCtrlPath
    // if (willReplaceForm) {
    //   // move to UI controllers extension path
    //   this.log('- controllers already exists. Moving and adding extension')
    //   // create and get new path
    //   _toCtrlPath = await filesUtil.getPath(toExtensionCtrlPath, mname)
    //
    //   this.log(toCtrlPath)
    // }
    // await filesUtil.moveFiles(fromCtrlPath, _toCtrlPath)
    //
    // // rewrite module config
    // // so it can recognize the new form and controllers
    // this.log('\n\n- Will rewrite module config file')
    // let moduleConfigObj = filesUtil.getJsonFromFile(toMConfigPath)
    // moduleConfigObj = this.setNewModuleConfig(moduleConfigObj)
    // filesUtil.rewriteFile(toMConfigPath, moduleConfigObj)
    // this.log(toMConfigPath)
    // if (willReplaceForm) {
    //   // add config as a brand new form
    // } else {
    //   // add form controller extension
    // }
  }

  getMConfigAsNewForm(moduleConfig) {
    this.log('getMConfigAsNewForm:: ')
    const formKey = 'Forms'
    const {
      fromFormPath,
      fromCtrlPath,
      toMConfigPath,
      toModuleFormPath,
      toFormPath,
      toCtrlPath,
      toModuleCtrlPath,
      toExtensionCtrlPath,
      oldFormPath,
      oldCtrlPath,
    } = this.pathsUtil.paths
    const {
      flags: {
        mname,
        channel,
        ctrl,
        actions,
        format,
        mconfig,
        mpath,
        fpath,
        cpath,
        epath,
        opath,
      },
      args: {from, to, name},
    } = this.parse(FormCommand)

    moduleConfig[formKey][channel][name] = {
      Controller: `${mname}/${name}${ctrl}`,
      ControllerExtensions: [],
      FormController: 'kony.mvc.MDAFormController',
      FormName: name,
      friendlyName: name,
    }

    this.log(moduleConfig[formKey][channel][name])
    return moduleConfig
  }

  getMConfigAsExtensionForm(moduleConfig) {
    this.log('getMConfigAsExtensionForm:: ')
    const formKey = 'Forms'
    const extKey = 'ControllerExtensions'
    const {
      fromFormPath,
      fromCtrlPath,
      toMConfigPath,
      toModuleFormPath,
      toFormPath,
      toCtrlPath,
      toModuleCtrlPath,
      toExtensionCtrlPath,
      oldFormPath,
      oldCtrlPath,
    } = this.pathsUtil.paths
    const {
      flags: {
        mname,
        channel,
        ctrl,
        actions,
        format,
        mconfig,
        mpath,
        fpath,
        cpath,
        epath,
        opath,
      },
      args: {from, to, name},
    } = this.parse(FormCommand)

    let baseConfig = moduleConfig[formKey][channel][name]

    // moduleConfig[formKey][channel][name] = {
    //   Controller: `${mname}/${name}${ctrl}`,
    //   ControllerExtensions: [],
    //   FormController: 'kony.mvc.MDAFormController',
    //   FormName: name,
    //   friendlyName: name,
    // }
    baseConfig[extKey].push(`${mname}/${name}_Extn`)

    this.log(baseConfig)

    return moduleConfig
  }

  setNewModuleConfig(currentConfig) {
    this.log('\n\n- Will rewrite module config file')
    // get flags and args
    const {
      flags: {
        mname,
        channel,
        ctrl,
      },
      args: {name},
    } = this.parse(FormCommand)
    console.log(mname)
    return currentConfig
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
