const {Command, flags} = require('@oclif/command')

class DependenciesCommand extends Command {
  async run() {
    // const {args} = this.parse(DependenciesCommand)
    // move base dependencies

    // move modules
    // move mvc extensions

    // setup extensions
    // setup init actions
    this.log('Will setup initial actions...')
    // setup build scripts
  }
}

DependenciesCommand.description = `Describe the command here
...
Extra documentation goes here
`

DependenciesCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
}
DependenciesCommand.args = [
  {name: 'from', description: 'Old project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
]

module.exports = DependenciesCommand
