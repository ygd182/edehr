<template lang="pug">
  div(class="checkset_wrapper")
    ehr-page-form-label(:element="element", css="checkset_label")
    div(v-for="option in checkOptions")
      label
        input(class="checkbox", type="checkbox",  v-bind:disabled="disabled", :value="option.prop", v-model="checkValues")
        span {{ option.text}}
    //div(style="display:none") computedInitialValue {{computedInitialValue}}
</template>

<script>
import EhrElementCommon from './EhrElementCommon'
import { setApiError } from '../../../helpers/ehr-utils'
import camelcase from 'camelcase'

const debug = false

export default {
  name: 'EhrElementCheckset',
  extends: EhrElementCommon,
  // for props, etc see EhrCommonElement
  data () {
    return {
      checkValues: [],
      checkOptions: []
    }
  },
  watch: {
    checkValues (val) {
      let newVal = val.join(',')
      if (debug) console.log('EhrCheckset input val changed', this.elementKey, newVal)
      if (this.isPageElement &&  this.isEditing) {
        // only broadcast if user is editing the form
        if (debug) console.log('EhrCheckset send input event')
        this.sendInputEvent(newVal)
      }
      if (this.isTableElement && this.dialogIsOpen) {
        if (debug) console.log('EhrCheckset send input event')
        this.sendInputEvent(newVal)
      }
    }
  },
  methods: {
    validate () {
      // used by this.setup
      let result = true
      let opts = this.options
      if(!opts || opts.length === 0) {
        setApiError('The checkset '+ this.key + ' definition is missing the options property')
        result = false
      }
      return result
    },
    setInitialValue (value) {
      // console.log('checkset override setInitialValue')
      this.checkValues = []
      if (value) {
        let props = value.split(',')
        props.forEach( p => {
          this.checkValues.push(p)
        })
      }
    },
    setup () {
      // called from EhrCommon.mount
      // console.log('setup checkset', this.elementKey, this.element, this.options)
      if (this.validate()) {
        this.checkOptions = []
        let prop,text
        this.options.forEach(opt => {
          [prop, text] = opt.text.split('=')
          if (!text) {
            text = prop
            prop = camelcase(prop)
          }
          this.checkOptions.push({
            prop: prop,
            text: text
          })
        })
      }
    }
  }
}
</script>

