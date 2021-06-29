const path = require('path')

class ExtensionPathsUtil {
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
    const {epath} = this.flags
    // parse paths
    return {
      fromExtPath: path.join(from, epath),
      toExtPath: path.join(to, epath),
    }
  }
}

module.exports = ExtensionPathsUtil
