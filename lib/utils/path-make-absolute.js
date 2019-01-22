const path = require('path')

module.exports = function (file) {
  if (!file) return null
  return path.isAbsolute(file)
    ? file
    : path.resolve(process.cwd(), file)
}
