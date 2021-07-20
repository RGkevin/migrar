const {Command, flags} = require('@oclif/command')
const FilesUtil = require('../util/files')
const path = require('path')
const PropertyPathsUtil = require('../util/property-paths')

class PropertyCommand extends Command {
  async run() {
    // files utility instance
    const filesUtil = new FilesUtil({log: this.log})
    const {flags, args} = this.parse(PropertyCommand)
    const pathsUtil = new PropertyPathsUtil({flags, args})
    // const {from, to} = args
    const {
      property,
      channel,
      format,
    } = flags
    const {
      fromAppPropertiesFilePath,
      fromActionsPath,
      toActionsPath,
      toAppPropertiesFilePath,
    } = pathsUtil.paths

    // read application properties file
    this.log(`\n\n- Will migrate application property ${property}`)
    let moduleConfigObj = filesUtil.getJsonFromFile(fromAppPropertiesFilePath)

    // get action files to move
    let propertyValue = moduleConfigObj[property] ? moduleConfigObj[property][channel] : null
    if (propertyValue === null) {
      throw new Error(`Invalid property name ${property}`)
    }

    // move actions files
    let _fileToMovePath
    Object.keys(propertyValue).forEach(k => {
      _fileToMovePath = path.join(fromActionsPath, propertyValue[k] + format)
      filesUtil.moveFiles(_fileToMovePath, toActionsPath)
    })

    // update application properties file
    this.log(`\n\n- Will rewrite file \n ${toAppPropertiesFilePath}`)
    let toAppPropertiesConfig = filesUtil.getJsonFromFile(toAppPropertiesFilePath)
    const newProjectPropConfig = {}
    newProjectPropConfig[channel] = propertyValue
    toAppPropertiesConfig[property] = newProjectPropConfig
    filesUtil.rewriteFile(toAppPropertiesFilePath, toAppPropertiesConfig)
  }
}

PropertyCommand.description = `Move actions defined in project properties file
`

PropertyCommand.flags = {
  channel: flags.string({char: 'h', description: 'Platform channel', default: 'mobile'}),
  property: flags.string({char: 'n', description: 'Application Property name to migrate', default: 'ide_appEvents'}),
  fileName: flags.string({char: 'f', description: 'Application Property file name', default: 'projectProperties.json'}),
  apath: flags.string({char: 'p', description: 'Studio Actions path', default: 'studioactions'}),
  format: flags.string({char: 'r', description: 'Files format suffix', default: '.json'}),
}

PropertyCommand.args = [
  {name: 'from', description: 'Old project workspace path', required: true},
  {name: 'to', description: 'Destination project workspace path', required: true},
]

module.exports = PropertyCommand
