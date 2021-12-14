const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

class FilesUtil {
  constructor({log}) {
    // set logger
    this.log = log
  }

  async findAndReplace(filePath, oldString, newString) {
    this.log(`    findAndReplace ${oldString} to ${newString} in:\n       ${filePath}`)
    let raw = fs.readFileSync(filePath, 'utf8')
    let result = raw.replace(oldString, newString)
    this.writeToFile(filePath, result)
  }

  async moveFiles(from, to, replaceAll = false) {
    const toPath = replaceAll ? path.join(to, '../') : to
    this.log(`  moveFiles::\n    from: ${from}\n    to: ${toPath} :: replaceAll ${replaceAll}`)
    fsExtra.copySync(from, toPath)
    this.log('  files moved successfully.')
  }

  async moveFilesTo(from, to) {
    // check if dir exists if not then create it
    // const toPath = path.join(to, dir)
    if (!fs.existsSync(to)) {
      this.log(`    moveFileTo:: dir ${to} does not exist then create it`)
      fs.mkdirSync(to)
    }
    // then move the files to that specific folder
    return this.moveFiles(from, to)
  }

  async makeDir(filePath, folderName) {
    this.log(`  makeDir::\n    folderName: ${folderName}\n    in: ${filePath}`)
    fs.mkdirSync(path.join(filePath, folderName))
  }

  getJsonFromFile(filePath) {
    try {
      let raw = fs.readFileSync(filePath)
      return JSON.parse(raw)
    } catch (error) {
      this.log(`hubo un error al leer el archivo ${filePath}`)
      throw error
    }
  }

  rewriteFile(filePath, newContent) {
    let raw = JSON.stringify(newContent, null, 4)
    fs.writeFileSync(filePath, raw)
    this.log('  file rewrite successfully')
  }

  writeToFile(filePath, newContentString) {
    fs.writeFileSync(filePath, newContentString)
    this.log('   writ new content successfully')
  }
}

module.exports = FilesUtil
