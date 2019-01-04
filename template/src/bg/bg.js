const isProduction = process.env.NODE_ENV === 'production'

// TODO move to 'central' config
const __DEVPORT__ = {{ devport }}

const winURL = isProduction ? '{{ distdir }}/main/index.html' : `http://localhost:${__DEVPORT__}`
const winOpts = nw.App.manifest.window

winOpts.new_instance = true

nw.Window.open(winURL, winOpts)
