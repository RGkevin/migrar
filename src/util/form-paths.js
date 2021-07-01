const path = require('path')

class FormPathsUtil {
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
    const {from, to, name} = this.args
    const {
      mname,
      channel,
      ctrl,
      format,
      mconfig,
      mpath,
      fpath,
      cpath,
      epath,
      opath,
      suffix,
    } = this.flags
    // parse paths
    return {
      oldFormPath: path.join(opath, fpath, channel, name + format),
      oldCtrlPath: path.join(opath, cpath, channel, name + ctrl),
      oldCtrlFilePath: path.join(opath, cpath, channel, name + ctrl, name + ctrl + '.js'),
      fromFormPath: path.join(from, fpath, channel, mname, name + format),
      fromCtrlPath: path.join(from, cpath, channel, mname, name + ctrl),
      toMConfigPath: path.join(to, mpath, mname, mconfig),
      toModuleFormPath: path.join(to, fpath, channel, mname),
      toFormPath: path.join(to, fpath, channel, mname, name + format),
      toCtrlPath: path.join(to, cpath, channel, mname, name + ctrl),
      toModuleCtrlPath: path.join(to, cpath, channel, mname),
      toExtensionCtrlPath: path.join(to, epath),
      toExtCtrlMPath: path.join(to, epath, mname),
      toExtCtrlFilePath: path.join(to, epath, name + suffix + ctrl + '.js'),
    }
  }
}

module.exports = FormPathsUtil
