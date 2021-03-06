
<script>
import EhrPageFormLabel from './EhrPageFormLabel.vue'
import EhrDefs from '../../../helpers/ehr-defs-grid'
import StoreHelper from '../../../helpers/store-helper'
import UiInfo from '../../../app/ui/UiInfo'
import EventBus from '../../../helpers/event-bus'
import { PAGE_DATA_READY_EVENT, FORM_INPUT_EVENT } from '../../../helpers/event-bus'

const dbInputs = false
const dbDialog = false
const dbPage = false
const dbDetail = false

export default {
  components: {
    EhrPageFormLabel,
    UiInfo
  },
  inject: [ 'pageDataKey', 'isPageElement', 'isTableElement','tableKey', 'formKey' ],
  data: function () {
    return {
      dialogIsOpen: false,
      dependantOnKey: '',
      dependantOnValue: '',
      inputVal: '',
      suffix: '',
      options: ''
    }
  },
  props: {
    elementKey: {type: String },
    ehrHelp: { type: Object }
  },
  computed: {
    element () { return EhrDefs.getPageChildElement(this.pageDataKey, this.elementKey) },
    inputId () { return this.elementKey + this.element.inputType},
    inputType () { return this.element.inputType },
    label () { return this.element.label},
    key () { return this.element.elementKey },
    isEditing () { return this.ehrHelp.isEditing() },
    disabled () {
      let disable = false
      if (this.isPageElement ) {
        disable = ! this.ehrHelp.isEditingForm(this.formKey)
      }
      if (!disable && this.dependantOnKey) {
        disable = !(this.dependantOnValue === true)
      }
      return disable
    }
  },
  methods: {
    isType (type) { return this.inputType === type },
    assetUrl () {
      let e = this.element
      let url = '/assets/' + e.assetBase + '/' + e.assetName
      return url
    },
    assetName () {
      let e = this.element
      let name = e.label
      if (e.assetBase && e.assetName) {
        name = e.label
      }
      return name
    },
    setInitialValue (value) {
      this.inputVal = value
    },
    sendInputEvent (val) {
      if (dbDetail) console.log('EhrCommon broadcast PAGE_FORM_INPUT_EVENT ', val, this.elementKey)
      EventBus.$emit(FORM_INPUT_EVENT, {value: val, element: this.element})
    },
    refreshPage () {
      let pageData = this.ehrHelp.getAsLoadedPageData()
      let value = pageData[this.elementKey]
      let isDev = StoreHelper.isDevelopingContent()
      if (isDev) {
        let caseVal = EhrDefs.getDataCaseStudy(this.pageDataKey, this.elementKey)
        value = value || caseVal
        // trick:  send the "hey a value changed" event so that the value is stored at the page level.
        // this way it is ready in case the user clicks the edit form button and then saves the page.
        // These data case study values will then be saved along with any further edits the content edit
        // might make
        this.sendInputEvent(value)
      } else {
        let defVal = EhrDefs.getDefaultValue(this.pageDataKey, this.elementKey)
        value = value || defVal
      }
      if (dbPage || dbInputs) console.log('EhrCommon page data is ready', this.elementKey, value)
      this.setInitialValue(value)
    },
    dialogEvent (open) {
      if (dbDialog) console.log('EhrCommon dialog opened or closed', this.elementKey, open)
      this.dialogIsOpen = open
      if (open) {
        let inputs = this.ehrHelp.getDialogInputs(this.tableKey)
        let initialValue = inputs[this.elementKey]
        if (dbDialog || dbInputs) console.log('EhrCommon key has value', this.key, initialValue)
        this.setInitialValue(initialValue)
      }
    },
    /*
    About dependant elements ... we need to enable input elements based on the state of a checkbox.  We can't depend
    on reactive properties because the data structures for the pages only get created as needed. Vue's reactivity system
    needs properties to exist on load to work best. The vue $set method was tried but it had inconsistent results.
    I chose the direct listen-for-click-event approach. This approach also allows me to do more when the click
    happens and to setup default values.
     */
    dependantClickEvent () {
      const eData = { key: this.elementKey, value: this.inputVal }
      const channel = this.eventChannelBroadcast
      this.$nextTick(function () {
        // console.log('Send an event on our transmission channel with a payload containing this component\'s value', eData, channel)
        EventBus.$emit(channel, eData)
      })
    },
    dependentPropertyReceiveEvent (eData) {
      // we're receiving an event transmitted by another instance of this component
      // it has sent a message on the channel this component listens on.
      // console.log(`On channel ${this.dependentPropertyChangeChannel} from key ${eData.key} got hit? ${eData.value}`)
      this.dependantOnValue = eData.value
      /*
      A change to false means disable this element. So let's also empty it too.
       */
      if (eData.value === false) {
        this.setInitialValue('')
      }
    },
    dependantPropertySetUp () {
      const _this = this
      this.eventChannelBroadcast = 'radio:' + this.elementKey
      const dKey = this.dependantOnKey = this.element.dependantOn
      if (dKey) {
        // get default value of the other element and coerce to be boolean
        const dependantDefault = EhrDefs.getDefaultValue(this.pageDataKey, dKey)
        this.dependantOnValue = !!dependantDefault
        this.dependentPropertyChangeChannel = 'radio:' + dKey
        this.dependentEventHandler = function (eData) {
          _this.dependentPropertyReceiveEvent(eData)
        }
        EventBus.$on(this.dependentPropertyChangeChannel, this.dependentEventHandler)
      }
    },

    setupCommon () {
      const element = this.element
      this.suffix = element.suffix
      this.options = element.options
    },

    setupEventHandlers () {
      const _this = this
      if (this.isPageElement) {
        this.pageRefreshEventHandler = function () { _this.refreshPage() }
        EventBus.$on(PAGE_DATA_READY_EVENT, this.pageRefreshEventHandler)
      }
      if (this.isTableElement) {
        this.dialogEventHandler = function (eData) { _this.dialogEvent(eData.value) }
        this.dialogEventKey = this.ehrHelp.getDialogEventChannel(this.tableKey)
        EventBus.$on(this.dialogEventKey, this.dialogEventHandler)
      }
    }
  },
  mounted: function () {
    // console.log('mounted this.tableKey', this.tableKey)
    this.setupCommon()
    this.setupEventHandlers()
    this.dependantPropertySetUp()
    if (this.setup) {
      this.setup()
    }
  },
  beforeDestroy: function () {
    if (this.pageRefreshEventHandler) {
      EventBus.$off(PAGE_DATA_READY_EVENT, this.pageRefreshEventHandler)
    }
    if (this.dialogEventHandler) {
      EventBus.$off(this.dialogEventKey, this.dialogEventHandler)
    }
    if (this.dependentEventHandler) {
      EventBus.$off(this.dependentPropertyChangeChannel, this.dependentEventHandler)
    }
  },
  watch: {
    inputVal (val) {
      if (dbInputs) console.log('EhrElement input val changed', this.elementKey, val)
      if (this.isPageElement &&  this.isEditing) {
        // only broadcast if user is editing the form
        this.sendInputEvent(val)
      }
      if (this.isTableElement && this.dialogIsOpen) {
        this.sendInputEvent(val)
      }
    }
  }
}
</script>
<style lang="scss">
  @import '../../../scss/definitions';
  .check-label {
    display: inline;
  }
  .assetLink a{
    color: $grey60;
    display: block;
    margin-bottom: 10px;

    &:hover {
      color: $black;
      text-decoration: underline;
    }

    .linkIcon {
      color: $grey40;
      margin-right: 5px;
    }
  }
  .suffix, .text-input {
    display: inline-block;
  }
  .suffix {
    position:absolute;
    margin-left: 5px;
    bottom:5px;
    right:10px;
  }

</style>