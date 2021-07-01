const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const {Command, flags} = require('@oclif/command')
const FilesUtil = require('../util/files')

class FormCommand extends Command {
  async run() {
    // files utility instance
    const filesUtil = new FilesUtil({log: this.log})
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
      },
      args: {from, to, name},
    } = this.parse(FormCommand)

    // define local flags
    let willReplaceForm = false
    // const formsLibPath = 'forms'
    // const ctrlLibPath = 'controllers'

    // define absolute paths FROM
    const fromFormPath = path.join(from, fpath, channel, name + format)
    const fromCtrlPath = path.join(from, cpath, channel, name + ctrl)

    // check if old paths exists
    if (!fs.existsSync(fromFormPath)) throw new Error('Invalid Old project workspace path')

    // define absolute paths TO
    const toMConfigPath = path.join(to, mpath, mname, mconfig)
    const toModuleFormPath = path.join(to, fpath, channel, mname)
    const toFormPath = path.join(to, fpath, channel, mname, name + format)
    const toCtrlPath = path.join(to, cpath, channel, mname, name + ctrl)
    const toModuleCtrlPath = path.join(to, cpath, channel, mname)
    const toExtensionCtrlPath = path.join(to, epath)

    // check if will replace form
    willReplaceForm = fs.existsSync(toFormPath)

    // copy and replace .json files
    this.log('- Will move JSON files')
    await filesUtil.moveFiles(fromFormPath, toModuleFormPath)

    // copy controllers and actions
    this.log('\n\n- Will move Controllers files')
    let _toCtrlPath = toModuleCtrlPath
    if (willReplaceForm) {
      // move to UI controllers extension path
      this.log('- controllers already exists. Moving and adding extension')
      // create and get new path
      _toCtrlPath = await filesUtil.getPath(toExtensionCtrlPath, mname)

      this.log(toCtrlPath)
    }
    await filesUtil.moveFiles(fromCtrlPath, _toCtrlPath)

    // rewrite module config
    // so it can recognize the new form and controllers
    this.log('\n\n- Will rewrite module config file')
    let moduleConfigObj = filesUtil.getJsonFromFile(toMConfigPath)
    moduleConfigObj = this.setNewModuleConfig(moduleConfigObj)
    filesUtil.rewriteFile(toMConfigPath, moduleConfigObj)
    this.log(toMConfigPath)
    if (willReplaceForm) {
      // add config as a brand new form
    } else {
      // add form controller extension
    }
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
}

FormCommand.args = [
  {name: 'from', description: 'Old project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = FormCommand
