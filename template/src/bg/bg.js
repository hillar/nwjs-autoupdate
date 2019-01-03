const isProduction = process.env.NODE_ENV === 'production'

// TODO move to 'cetral' config
const __DEVPORT__ = 8001

const winURL = isProduction ? 'dist/main/index.html' : `http://localhost:${__DEVPORT__}`
const winOpts = nw.App.manifest.window

winOpts.new_instance = true

nw.Window.open(winURL, winOpts)
