<template>
    <md-snackbar md-theme="material-snackbar" :md-position="position"
                 :md-duration="isInfinity ? Infinity : duration"
                 :md-active.sync="$store.state.showSnackbar"
                 md-persistent>
        <div style="text-align: center; width: 100%;">{{$store.state.snackbarMessage}}</div>
        <!--<md-button  @click="$store.commit('hideSnackbar')">Okay</md-button>-->
    </md-snackbar>
</template>

<script>
  export default {
    data: () => ({
      position: 'center',
      duration: 4000,
      isInfinity: false
    })
  }
</script>
