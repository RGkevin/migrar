const path = require('path')

const {Command, flags} = require('@oclif/command')
const FilesUtil = require('../util/files')
const FormCommand = require('./form')

class ManyCommand extends Command {
  async run() {
    const filesUtil = new FilesUtil({log: this.log})
    const {flags, args} = this.parse(ManyCommand)

    const {forms, from, to} = args
    const {opath} = flags

    this.from = from
    this.to = to
    this.opath = opath

    const formsData = filesUtil.getJsonFromFile(path.join(forms))

    if (!Array.isArray(formsData)) {
      this.log(`Invalid Json array in :: \n    ${forms}`)
    }

    for (let i = 0; i < formsData.length; i++) {
      const {name, module} = formsData[i]

      // eslint-disable-next-line no-await-in-loop
      await this.migrarForm(name, module)
    }
  }

  async migrarForm(name, module) {
    this.log(`migrarForm name:: ${name} module::: ${module} OLD:: ${this.opath} FROM:: ${this.from}  TO:: ${this.to}`)
    await FormCommand.run(['-m', module, '-o', this.opath, this.from, this.to, name])
  }
}

ManyCommand.description = `Describe the command here
...
Extra documentation goes here
`

ManyCommand.flags = {
  opath: flags.string({char: 'o', description: 'Old project workspace path', required: true}),
}

ManyCommand.args = [
  {name: 'from', description: 'Base project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
  {name: 'forms', description: 'file with forms data [{"name": "formName", "module": "ModuleName"}, ...]', required: true},
]

module.exports = ManyCommand
