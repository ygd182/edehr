<template lang="pug">
  div
    h3(v-if="group.label") {{ group.label }}
    div(class="ehr-group-wrapper", :class="groupClass")
      div(v-for="child in group.gChildren", :key="forIndex(child)", class="ehr-group-for", :class="childClass(child)")
        ehr-sub-group(v-if="isSubgroup(child)", :subgroup="child", :ehrHelp="ehrHelp")
        ehr-element-form(v-else-if="child", :elementKey="child", :ehrHelp="ehrHelp")
        div(v-else) This group has an undefined element
</template>

<script>
import EhrSubGroup from './EhrSubGroup'
import EhrElementForm from './EhrElementForm'
import EhrDefs from '../../../helpers/ehr-defs-grid'

export default {
  name: 'EhrPageForm',
  components: {
    EhrSubGroup,
    EhrElementForm
  },
  inject: [ 'pageDataKey'],
  props: {
    group: {type: Object },
    ehrHelp: { type: Object }
  },
  computed: {
    groupClass () {
      let css = this.group.formCss
      const theDefault = 'grid-left-to-right-3'
      if (css && !css.includes('grid')) {
        css += ' ' + theDefault
      } else if (!css) {
        css = theDefault
      }
      return css
    },
  },
  methods: {
    childClass (elementKey) {
      if (typeof elementKey === 'string') {
        let element = EhrDefs.getPageChildElement(this.pageDataKey, elementKey)
        if (!element) console.error('Why no element for key ', elementKey)
        return element.formCss
      }
      return ''
    },
    forIndex (child) {
      return (typeof element === 'string') ? child : child.elementKey
    },
    isSubgroup (element) {
      return element !== null && (typeof element === 'object')
    },
  },
}
</script>

<style lang="scss">

</style>
