<template lang="pug">
  div 
    div(class="lookahead")
      input(class="input searchValue-input lookahead-input", type="text", v-model="searchValue", v-on:change="doSearch", :placeholder="[[placeholder]]")
      ui-close(class="clear" v-if="searchValue.length > 0", v-on:close="clearInput")
    div(v-if="showSuggestions")
      ul(class="suggestion-list")
        li(class="suggestion-list-item", v-if="suggestions.length > 0", v-for="suggestion in suggestions", v-on:click="selectSuggestion(suggestion)") {{suggestion}}
        li(class="suggestion-list-item", v-else) No matches for {{searchValue}}
</template>

<script>
import axios from 'axios'
import UiClose from '../../app/ui/UiClose'

export default {
  name: 'LookaheadInput',
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  components: {
    UiClose,
  },
  data () {
    return {
      suggestions: null,
      searchValue: '',
      showSuggestions: false,
    }
  },
  methods: {
    getRequest (url) {
      axios
        .get(url)
        .then(results => {
          this.suggestions = results.data
          this.showSuggestions = true
        })
        .catch(error => {
          // let msg = `Failed GET to ${url} with error: ${error.message}`
        })
    },
    doSearch (e) {
      this.showSuggestions = false
      if(!this.disableSearch && this.searchValue.length >= 3) {
        this.getRequest('http://localhost:27000/lookahead/'+ this.searchValue)
      }
    },
    selectSuggestion (s) {
      this.searchValue = s
      this.showSuggestions = false
      this.$emit('selected-text', this.searchValue)
    },
    clearInput () {
      this.searchValue = ''
      this.showSuggestions = false
      this.$emit('selected-text', this.searchValue)
    }
  },
  mounted: function () { }
}
</script>

<style lang="scss" scoped>
  .lookahead {
    position: relative;
  }

  .lookahead-input {
    padding-right: 25px;
  }

  .clear {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 15px;
    height: 15px;
  }

  .suggestion-list {
    border: 1px solid #CBCED1;
  }

  .suggestion-list-item {
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: #CBCED1;
    }
  }
</style>