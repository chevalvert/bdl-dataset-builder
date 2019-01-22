#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const Dataset = require('@abstractions/dataset')
const exec = require('util').promisify(require('child_process').exec)
const fs = require('fs-extra')
const kml = require('gtran-kml')
const path = require('path')

module.exports = async datasetPath => {
  const dataset = await new Dataset(datasetPath)
  if (!dataset.path) throw new Error('No dataset path given.')

  dataset.validate()

  if (dataset.package.files['features'].includes('.kml')) {
    const kmlFile = dataset.file(dataset.package.files['features'])
    const geoJson = await kml.toGeoJson(kmlFile)
    dataset.features = geoJson.features.map(f => {
      if (configuration['flipCoordinates']) {
        f.geometry.coordinates = f.geometry.coordinates.reverse()
      }
      return f
    })
    dataset.package.files['features'] = dataset.package.files['features'].replace('.kml', '.json')
    await fs.writeJson(dataset.file(dataset.package.files['features']), dataset.features, { spaces: 2 })
  }

  if (dataset.package.files['features'].includes('.json')) {
    dataset.features = await fs.readJson(dataset.file('features.json'))
  }

  if (configuration['extractStreetview']) {
    const bin = path.join(__dirname, '..', '/node_modules/.bin/extract-streetview')
    for (let i = 0; i < dataset.features.length; i++) {
      const f = dataset.features[i]
      await fs.ensureDir(dataset.file('panoramas'))
      const output = dataset.file('panoramas/' + f.properties.gid + '.png')
      const cmd = `${bin} ${f.geometry.coordinates} --zoom ${configuration['extractStreetviewZoom']} --output=${output}`
      console.log(cmd)
      const { stdout, stderr } = await exec(cmd, { cwd: process.cwd() })
      console.log(stdout)
      console.error(stderr)
    }
  }

  dataset.features.forEach(f => {
    const id = f.properties.gid
    if (dataset.fileExists(`panoramas/${id}.png`)) {
      f.properties.panorama = `panoramas/${id}.png`
    } else if (f.properties.hasOwnProperty('panorama')) {
      delete f.properties.panorama
    }
  })

  await fs.writeJson(dataset.file('features.json'), dataset.features, { spaces: 2 })

  return dataset.package.name + ' build done'
}
