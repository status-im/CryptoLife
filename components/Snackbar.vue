<template>
    <div v-if="$store.state.showSnackbar">
        {{$store.state.snackbarMessage}}
    </div>
</template>

<script>
  export default {
    data: () => ({
    })
  }
</script>
