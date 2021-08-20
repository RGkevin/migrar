const FilesUtil = require('../util/files')
const {Command} = require('@oclif/command')
const fs = require('fs')
const {replace} = require('grasp')
const beautify = require('js-beautify').js

class ControllerCommand extends Command {
  async run() {
    const {args: {to}} = this.parse(ControllerCommand)
    if (this.isStructureAlreadyFixed()) {
      this.log(`   controller is already fixed for file: \n       ${to}`)
      return
    }

    this.filesUtil = new FilesUtil({log: this.log})

    // fix strings
    await this.fixStrings()
    // fix structure
    await this.fixStructure()
    // fix indent
    await this.fixIndent()
  }

  async fixIndent() {
    const {args: {to}} = this.parse(ControllerCommand)
    this.log(`will fix indent for controller: \n     ${to}`)
    if (!fs.existsSync(to)) throw new Error(`File does not exists: \n    ${to}`)
    const codeToProcess = fs.readFileSync(to, 'utf-8')
    // eslint-disable-next-line camelcase
    const processedCode = beautify(codeToProcess, {indent_size: 2, space_in_empty_paren: true})
    this.filesUtil.writeToFile(to, processedCode)
  }

  async fixStructure() {
    const {args: {to}} = this.parse(ControllerCommand)
    this.log(`Will fix code Structure in controller: \n    ${to}`)
    if (!fs.existsSync(to)) throw new Error(`File does not exists: \n    ${to}`)
    const codeToProcess = fs.readFileSync(to, 'utf-8')
    const processedCode = replace('equery',
      'define($a)',
      'define(function() {\nvar PresentationUtility = applicationManager.getPresentationUtility();\nvar MenuHandler = applicationManager.getMenuHandler();\n\nreturn {{a}};\n})',
      codeToProcess)
    this.filesUtil.writeToFile(to, processedCode)
  }

  isStructureAlreadyFixed() {
    const {args: {to}} = this.parse(ControllerCommand)
    const textToFind = 'var PresentationUtility'
    const fileText = fs.readFileSync(to, 'utf8')

    return fileText.indexOf(textToFind) !== -1
  }

  async fixStrings() {
    const {args: {to}} = this.parse(ControllerCommand)
    this.log(`Will fix Strings in controller: \n   ${to}`)
    const fixStrings = [
      {
        oldString: 'applicationManager_Extn.',
        newString: 'applicationManager.',
      },
      {
        oldString: '_Extn(',
        newString: '(',
      },
      {
        oldString: 'require(\'ApplicationManager_Extn\')',
        newString: 'applicationManager',
      },
    ]

    if (!fs.existsSync(to)) throw new Error(`File does not exists: \n    ${to}`)
    for (let i = 0, len = fixStrings.length; i < len; i++) {
      const element = fixStrings[i]
      // eslint-disable-next-line no-await-in-loop
      await this.filesUtil.findAndReplace(to, element.oldString, element.newString)
    }
  }
}

ControllerCommand.description = `Fix javascript file
use the absolute path to the file
`
ControllerCommand.args = [
  {name: 'to', description: 'Controller path to fix', required: true},
]

module.exports = ControllerCommand
