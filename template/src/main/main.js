import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'
import AutoUpdater from 'nw-autoupdater'
{{#isEnabled plugins 'axios'}}
import axios from 'axios'
{{/isEnabled}}

(async () => {

    const output =  document.querySelector( "#app" )

    try {

      const updater = new AutoUpdater( require( "../../package.json" ) )
      if ( updater.isSwapRequest() ) {
        output.innerHTML += `\nSwapping...`
        await updater.swap()
        output.innerHTML += `\nDone...`
        await updater.restart()
        return
      }

      const remoteManifest = await updater.readRemoteManifest()
      const needsUpdate = await updater.checkNewVersion( remoteManifest )

      if ( !needsUpdate ) {
        output.innerHTML += `\nApp is up to date...`
        //Vue.use(Buefy)
        Vue.config.productionTip = false
        {{#isEnabled plugins 'axios'}}
        Vue.http = Vue.prototype.$http = axios
        {{/isEnabled}}
        new Vue({
          el: '#app',
          router,
          store,
          render: h => h(App)
        })
      } else if ( confirm( "New release is available. Do you want to upgrade?" ) ) {
        updater.on( "download", ( downloadSize, totalSize ) => {
          output.innerHTML = `Downloading...`
          console.log( "download progress", Math.floor( downloadSize / totalSize * 100 ), "%" )
        })
        updater.on( "install", ( installFiles, totalFiles ) => {
          output.innerHTML = `Installing...\n`
          console.log( "install progress", Math.floor( installFiles / totalFiles * 100 ), "%" )
        })
        const updateFile = await updater.download( remoteManifest )
        await updater.unpack( updateFile )
        alert( `The application will automatically restart to finish installing the update` )
        await updater.restartToSwap()
      } else {
        output.innerHTML = `<font color=red>Can not run, need upgrade </font>\n`
      }

    } catch (e) {
        output.innerHTML = `<font color=red>${e}</font>\n`
        // TODO restart button if for example no network
    }
})()
