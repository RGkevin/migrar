const {Command, flags} = require('@oclif/command')
const ModulePathsUtil = require('../util/module-paths')

class ModuleCommand extends Command {
  async run() {
    const {flags, args} = this.parse(ModuleCommand)
    const pathsUtil = new ModulePathsUtil({flags, args})

    this.log('foo')
  }
}

ModuleCommand.description = `Describe the command here
...
Extra documentation goes here
`

ModuleCommand.flags = {
  legacy: flags.string({char: 'l', description: 'Module legacy name. Use if module is not in a parent directory'}),
}

ModuleCommand.args = [
  {name: 'from', description: 'Old project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'name', description: 'Form Name', required: true},
]

module.exports = ModuleCommand
