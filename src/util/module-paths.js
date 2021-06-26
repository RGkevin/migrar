const path = require('path')

class ModulePathsUtil {
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
    const {mpath} = this.flags
    // parse paths
    return {
      fromModulePath: path.join(from, mpath),
      toModulePath: path.join(to, mpath),
    }
  }
}

module.exports = ModulePathsUtil
