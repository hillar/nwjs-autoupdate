module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application name'
    },
    label: {
      type: 'string',
      required: false,
      message: 'Application conventional name',
      default (data) {
        return data.name.replace(/((?:^|-|_)+[a-z])/g, ($1) => $1.toUpperCase().replace('-', ''))
      }
    },
    description: {
      type: 'string',
      required: false,
      message: 'Application description',
      default: 'A nwjs autoupdate buefy application'
    },
    nwversion: {
      type: 'string',
      required: false,
      message: 'nwjs version',
      default: '0.35.3'
    },
    nwplatform: {
      type: 'string',
      required: false,
      message: 'nwjs platform',
      default () { return process.platform }
    },
    devport: {
      type: 'number',
      required: false,
      message: 'dev port',
      default: 8001
    },
    releasesdir: {
      type: 'string',
      required: false,
      message: 'releases directory',
      default: 'releases'
    },
    appsdir: {
      type: 'string',
      required: false,
      message: 'zipped applications directory',
      default: 'applications'
    },
    plugins: {
      type: 'checkbox',
      message: 'Select which Vue plugins to install',
      choices: ['axios'],
      default: ['axios']
    }
  },
  helpers: {
    isEnabled (list, check, opts) {
      if (list[check]) return opts.fn(this)
      else return opts.inverse(this)
    }
  },
  filters: {
    'app/main/router/**/*': 'plugins[\'vue-router\']',
    'app/main/store/**/*': 'plugins[\'vuex\']'
  },
  complete (data) {
    console.log()
    console.log('   Welcome to your new nwjs-au-buefy project!')
    console.log()
    console.log('   Next steps:')
    if (!data.inPlace) console.log(`      \x1b[33m$\x1b[0m cd ${data.destDirName}`)
    console.log('      \x1b[33m$\x1b[0m npm install')
    console.log('      \x1b[33m$\x1b[0m npm run dev')
    console.log('      \x1b[33m$\x1b[0m npm run build')
  }
}
