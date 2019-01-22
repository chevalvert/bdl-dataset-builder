const fs = require('fs')
const path = require('path')
const pckg = require('package')(module)

const appname = pckg.name
process.title = appname
process.env.SUPPRESS_NO_CONFIG_WARNING = true

/**
 * APP CONFIGURATION
 * Construct from package.json and .apprc
 * Overridden in order by :
 * - cli args `--parent.child=value`
 * - environment variables `bdl-dataset-builder_parent__child=value`
 * SEE: https://github.com/dominictarr/rc#standards
 */
const defaultConfigPath = path.join(__dirname, '..', '.apprc')
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'))

const configuration = require('rc')(appname, defaultConfig)
configuration.appname = appname
configuration.package = pckg
configuration.help = configuration.help || configuration.h
configuration.version = configuration.version || configuration.v

module.exports = configuration
