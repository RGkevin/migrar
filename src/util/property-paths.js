const path = require('path')

class PropertyPathsUtil {
  constructor({args, flags}) {
    this.args = args
    this.flags = flags
    this._paths = {}
  }

  get paths() {
    if (Object.keys(this._paths).length === 0) {
      this._paths = this.parsePaths()
    }
    return this._paths
  }

  parsePaths() {
    const {from, to} = this.args
    const {
      fileName,
      channel,
      apath,
    } = this.flags
    // parse paths
    return {
      fromAppPropertiesFilePath: path.join(from, fileName),
      fromActionsPath: path.join(from, apath, channel),
      toActionsPath: path.join(to, apath, channel),
      toAppPropertiesFilePath: path.join(to, fileName),
    }
  }
}

module.exports = PropertyPathsUtil
