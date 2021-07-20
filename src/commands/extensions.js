const FilesUtil = require('../util/files')
const ExtensionPathsUtil = require('../util/extension-paths')
const {Command, flags} = require('@oclif/command')

class ExtensionsCommand extends Command {
  async run() {
    const filesUtil = new FilesUtil({log: this.log})
    const {flags, args} = this.parse(ExtensionsCommand)
    const pathsUtil = new ExtensionPathsUtil({flags, args})
    const {fromExtPath, toExtPath} = pathsUtil.paths

    // copy and replace .json files
    this.log('- Will move extensions files')
    await filesUtil.moveFiles(fromExtPath, toExtPath, true)
  }
}

ExtensionsCommand.description = `Move whole extensions folder from one project to another
`

ExtensionsCommand.flags = {
  epath: flags.string({char: 'p', description: 'MVC Extensions relative path', default: 'mvcextensions'}),
}
ExtensionsCommand.args = [
  {name: 'from', description: 'Base project path', required: true},
  {name: 'to', description: 'Destination project path', required: true},
]

module.exports = ExtensionsCommand
