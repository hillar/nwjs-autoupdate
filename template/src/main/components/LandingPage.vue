<template>
  <div id="landing-page">
    <h1>\{{ msg }}</h1>

  </div>
</template>

<script>
const os = require('os')
export default {
  name: 'landing-page',
  data () {
    return {
      msg: 'Hello '+ os.userInfo().username,
      date: new Date()
    }
  }
}
</script>
