const configuration = require('@configuration')
const fs = require('fs-extra')
const path = require('path')

module.exports = class Dataset {
  constructor (datasetPath) {
    this.path = datasetPath
    if (!this.path) throw new Error('No dataset path given.')

    return this.build()
  }

  async build () {
    if (!this.fileExists('package.json')) throw new Error(`Dataset should contain a package.json.`)
    this.package = await fs.readJson(this.file('package.json'))

    if (!this.package.files) throw new Error('package.json should contains a files object.')

    return this
  }

  validate () {
    configuration['expectedPackageFilesKeys'].forEach(key => {
      if (!this.package.files.hasOwnProperty(key)) {
        throw new Error(`package.json files object should have a '${key}' key.`)
      }
    })

    Object.entries(this.package.files).forEach(([key, value]) => {
      if (!this.fileExists(value)) {
        throw new Error(`package.json files object describes a non-existent file '${value}'.`)
      }
    })
  }

  file (filename) {
    return path.join(this.path, filename)
  }

  fileExists (filename) {
    const file = this.file(filename)
    return fs.pathExistsSync(file)
  }

  toObject () {
    const o = {}
    Object.entries(this).forEach(([key, value]) => {
      if (!~(typeof value).indexOf('function')) o[key] = value
    })
    return o
  }
}
