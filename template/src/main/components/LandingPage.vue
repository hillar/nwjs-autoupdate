<template>
  <div id="landing-page">
    <h1>\{{ msg }}</h1>
    <!-- sample buefy component -->
      <b-field label="Select a date">
          <b-datepicker v-model="date"
              icon="calendar-today"
              :first-day-of-week="1"
              placeholder="Click to select...">

              <button class="button is-primary"
                  @click="date = new Date()">
                  <b-icon icon="calendar-today"></b-icon>
                  <span>Today</span>
              </button>

              <button class="button is-danger"
                  @click="date = null">
                  <b-icon icon="close"></b-icon>
                  <span>Clear</span>
              </button>
          </b-datepicker>
      </b-field>



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
