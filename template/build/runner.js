process.env.NODE_ENV = 'production'

const { readdirSync, statSync, createWriteStream, writeFileSync } = require('fs')
const { join } = require('path')
const archiver = require('archiver')
const fs = require('fs-extra')
const path = require('path')
const { spawnSync } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')

const webpackMainConfig = require('./webpack.main.config')
const webpackBgConfig = require('./webpack.bg.config')

const manifest = require('../package')

const buildPath = npmWhich.sync('build')

// TODO move to 'central' config
const __DEVPORT__ = {{ devport }}


// "manifestUrl": "http://localhost:{{ devport }}/{{ appsdir }}/{{ name }}/{{name}}-manifest.json",
const RELEASES = '{{ releasesdir }}'
const HOST = `http://localhost:${__DEVPORT__}/`
const PREFIX = '{{ appsdir }}'
const PLATFORMS = [
  [ `linux-x64`, `linux64` ],
  [ `linux-x32`, `linux32` ],
  [ `osx-x64`, `mac64` ],
  [ `osx-x32`, `mac32` ],
  [ `mac-x64`, `mac64`],
  [ `win-ia3.`, `win32` ],
  [ `win-x64`, `win64` ]
];

function getPlatform( file ) {
  const match = PLATFORMS.find( pair => file.indexOf( pair[ 0 ] ) !== -1 );
  return match ? match[ 1 ] : null;
}

function getName( filename ) {
  const re = /[^-]*/;
  const match = filename.match( re );
  return match ? match[ 0 ] : null;
}

function getVersion( filename ) {
  const re = /-(\d+\.\d+\.\d+)-/;
  const match = filename.match( re );
  return match ? match[ 1 ] : null;
}

function zipDir(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = createWriteStream(out)
  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)
    stream.on('close', () => resolve())
    archive.finalize()
  })
}


function cleanApps () {
  return fs.emptydir(path.resolve(__dirname, '../', '{{ appsdir }}'))
}

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../', '{{ distdir }}'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../', manifest.build.output))
}

function pack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err)
      else if (stats.hasErrors()) reject(stats.toString({ chunks: false, colors: true }))
      else resolve()
    })
  })
}

function packMain () {
  return new Promise(async (resolve, reject) => {
    try { await pack(webpackMainConfig) }
    catch (e) { reject(e) }
    resolve()
  })
}

function packBg () {
  return pack(webpackBgConfig)
}

function build () {
  return new Promise( resolve => {
    manifest.build.nwPlatforms.forEach((os) => {
      manifest.build.nwArchs.forEach((arch) => {
        spawnSync(buildPath, [`--${os}`, `--${arch}`, '.'], { stdio: 'inherit' })
      })
    })
    resolve()
  })
}

function zip () {
  return new Promise( async (resolve) => {
    const remoteManifest = {}
    remoteManifest.packages = {}
    remoteManifest.version = null
    remoteManifest.name = null
    const files = readdirSync(RELEASES)
    for (const f of files) {
      const fn = join(RELEASES,f)
      const stats = statSync(fn)
      if (stats.isDirectory()) {
        const version = getVersion(f)
        if (remoteManifest.version === null && version) remoteManifest.version = version
        const name = getName(f)
        if (remoteManifest.version && remoteManifest.name === null && name) remoteManifest.name = name
        const platform = getPlatform(f)
        if (platform && version && name && version === remoteManifest.version && name === remoteManifest.name){
          // make a zip
          // //{{ appsdir }}/{{ name }}/{{name}}-manifest.json",

          const zipfile = join(PREFIX,remoteManifest.name,`${f}.zip`)
          console.log('zipping',fn,zipfile)
          fs.ensureDirSync(join(PREFIX,remoteManifest.name))
          await zipDir(fn,zipfile)
            remoteManifest.packages[ platform ] = {
              url: `${HOST}/${PREFIX}/${name}/${f}.zip`,
              size: statSync(zipfile).size
            }
        }
      }
    }
    //{{ appsdir }}/{{ name }}/{{name}}-manifest.json",
    const rmf = join(PREFIX,remoteManifest.name,`${remoteManifest.name}-manifest.json`)
    console.log('remote manifest',rmf)
    writeFileSync(rmf,JSON.stringify(remoteManifest,null,4))
    resolve()
  })
}

async function main () {
  await Promise.all([cleanDist(), cleanBuild(), cleanApps()])
  console.log('cleaned')
  await Promise.all([packMain(), packBg()])
  console.log('packed')
  await build()
  console.log('built')
  await zip()
  console.log('zipped')
}

main()
