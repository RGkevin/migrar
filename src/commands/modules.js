const FilesUtil = require('../util/files')
const ModulePathsUtil = require('../util/module-paths')
const {Command, flags} = require('@oclif/command')

class ModulesCommand extends Command {
  async run() {
    const filesUtil = new FilesUtil({log: this.log})
    const {flags, args} = this.parse(ModulesCommand)
    const pathsUtil = new ModulePathsUtil({flags, args})
    const {fromModulePath, toModulePath} = pathsUtil.paths

    // copy and replace .json files
    this.log('- Will move modules files')
    await filesUtil.moveFiles(fromModulePath, toModulePath, true)
  }
}

ModulesCommand.description = `Move whole modules folder from one project to another
`

ModulesCommand.flags = {
  mpath: flags.string({char: 'p', description: 'Modules relative path', default: 'modules'}),
}
ModulesCommand.args = [
  {name: 'from', description: 'Base project path', required: true},
  {name: 'to', description: 'Destination project path', required: true},
]

module.exports = ModulesCommand
