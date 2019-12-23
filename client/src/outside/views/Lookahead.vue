<template lang="pug">
  
  div 
    lookahead-input(v-on:selected-text="text=$event", :placeholder="'Search for a value'")
    span Selected value: {{text}}
</template>

<script>

import LookaheadInput from '../components/LookaheadInput'

export default {
  name: 'Lookahead',
  components: {
    LookaheadInput,
  },
  data () {
    return {
      text: '',
    }
  },
  mounted: function () {
    
  }
}
</script>

<style lang="scss" scoped>
</style>