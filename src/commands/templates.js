const {Command, flags} = require('@oclif/command')

class TemplatesCommand extends Command {
  async run() {
    // cp -r ../../oldworkspace2/oldbb/templates/mobile/segments ./templates/mobile/
    // cp -r ../../oldworkspace2/oldbb/controllers/mobile/**flx**Controller ./controllers/mobile/
    const {flags} = this.parse(TemplatesCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/kevinlopez/Documents/RGProgra/projects/mvtem/src/commands/templates.js`)
  }
}

TemplatesCommand.description = `Describe the command here
...
Extra documentation goes here
`

TemplatesCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = TemplatesCommand
