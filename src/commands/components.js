const {Command, flags} = require('@oclif/command')

class ComponentsCommand extends Command {
  async run() {
    // cp -r ../../oldworkspace2/oldbb/userwidgets ./
    const {flags} = this.parse(ComponentsCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/kevinlopez/Documents/RGProgra/projects/mvtem/src/commands/components.js`)
  }
}

ComponentsCommand.description = `Describe the command here
...
Extra documentation goes here
`

ComponentsCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ComponentsCommand
