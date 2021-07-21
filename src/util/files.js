const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')

class FilesUtil {
  constructor({log}) {
    // set logger
    this.log = log
  }

  findAndReplace(filePath, oldString, newString) {
    this.log(`    findAndReplace ${oldString} to ${newString} in:\n    ${filePath}`)

    return new Promise((resolve, reject) => {
      const backUpSuffix = '.backup'
      exec(`sed -i '${backUpSuffix}' 's/${oldString}/${newString}/g' ${filePath}`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(new Error('Could not find and replace'))
          }

          exec(`rm -rf ${filePath + backUpSuffix}`, (e, st, std) => {
            if (e || std) {
              return reject(new Error('Could not remove backup files'))
            }

            this.log('    findAndReplace successfully')
            return resolve()
          })
        })
    })
  }

  moveFiles(from, to, replaceAll = false) {
    const toPath = replaceAll ? path.join(to, '../') : to
    this.log(`  moveFiles::\n    from: ${from}\n    to: ${toPath}`)
    return new Promise((resolve, reject) => {
      exec(`cp -r ${from} ${toPath}`, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(new Error(error || stderr))
        }
        this.log('  files moved successfully.')
        return resolve()
      })
    })
  }

  // check if path exists if not
  // then create it and return the absolute value
  async getPath(filePath, folderName) {
    this.log(`  getPath::\n    folderName: ${folderName}\n    in: ${filePath}`)
    const absolutePath = path.join(filePath, folderName)
    if (!fs.existsSync(absolutePath)) {
      this.log('  folderName does not exists, will create an empty folder')
      await this.makeDir(filePath, folderName)
    }
    return absolutePath
  }

  makeDir(filePath, folderName) {
    this.log(`  makeDir::\n    folderName: ${folderName}\n    in: ${filePath}`)

    return new Promise((resolve, reject) => {
      exec(`mkdir ${path.join(filePath, folderName)}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(new Error(error || stderr))
        }
        this.log('  folder created successfully')
        return resolve()
      })
    })
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

  renameFile(filePath, oldName, newName) {
    this.log(`    renameFile ${oldName} to ${newName} in:\n    ${filePath}`)
    const _old = `${filePath}/${oldName}`
    const _new = `${filePath}/${newName}`

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(_old)) return reject(new Error(`oldName file does not exist: \n    ${_old}`))
      exec(`mv ${_old} ${_new}`, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(new Error(error || stderr))
        }
        this.log('  renamed file')
        return resolve()
      })
    })
  }
}

module.exports = FilesUtil
