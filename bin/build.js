#!/usr/bin/env node
require('module-alias/register')

const absolute = require('@utils/path-make-absolute')
const chalk = require('chalk')
const configuration = require('@configuration')
const fs = require('fs')
const path = require('path')

if (configuration.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'build.USAGE'), 'utf-8'))
  process.exit(0)
}

if (configuration.version) {
  console.log(configuration.package.version)
  process.exit(0)
}

require('@lib/build-dataset')(absolute(process.argv[2]))
  .then(resp => {
    console.log(chalk.green('✔ success:'), resp)
    process.exit(0)
  })
  .catch(err => {
    console.error(chalk.red('✖ error:'), err.message)
    process.exit(1)
  })
