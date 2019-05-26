import moment from 'moment'
import Vue from 'vue'
import EventBus from './event-bus'
import { ACTIVITY_DATA_EVENT } from './event-bus'
import { DIALOG_INPUT_EVENT } from './event-bus'
import { PAGE_FORM_INPUT_EVENT } from './event-bus'
import { PAGE_DATA_REFRESH_EVENT } from './event-bus'
import { removeEmptyProperties, prepareAssignmentPageDataForSave, formatTimeStr } from './ehr-utills'
import { getPageDefinition } from './ehr-defs'

const LEAVE_PROMPT = 'If you leave before saving, your changes will be lost.'

export default class EhrHelp {
  constructor (component, store, pageKey) {
    // console.log('Construct helper', pageKey)
    this.$store = store
    this.pageKey = pageKey
    this.cacheAsString = ''
    this.dialogMap = {}
    this.$store.commit('system/setCurrentPageKey', pageKey)
    this._loadTransposedColumns(pageKey)
    this._setupEventHandlers()
  }

  _setupEventHandlers () {
    const _this = this
    this.windowUnloadHandler = function (eData) {
      _this.beforeUnloadListener(eData)
    }
    this.dialogInputChangeEventHandler = function (eData) {
      _this._handleDialogInputChangeEvent(eData)
    }
    this.pageFormInputChangeEventHandler = function (eData) {
      _this._handlePageFormInputChangeEvent(eData)
    }
    this.activityDataChangeEventHandler = function (eData) {
      eData = eData || {}
      _this._handleActivityDataChangeEvent(eData)
    }
    this.refreshEventHandler = function (eData) {
      // console.log('ehrhelper respond to page refresh')
      _this._mergedProperty()
      _this._loadTransposedColumns()
    }

    window.addEventListener('beforeunload', this.windowUnloadHandler)
    EventBus.$on(DIALOG_INPUT_EVENT, this.dialogInputChangeEventHandler)
    EventBus.$on(PAGE_FORM_INPUT_EVENT, this.pageFormInputChangeEventHandler)
    EventBus.$on(ACTIVITY_DATA_EVENT, this.activityDataChangeEventHandler)
    EventBus.$on(PAGE_DATA_REFRESH_EVENT, this.refreshEventHandler)
  }

  _takeDownEventHandlers (pageKey) {
    window.removeEventListener('beforeunload', this.windowUnloadHandler)
    EventBus.$off(DIALOG_INPUT_EVENT, this.dialogInputChangeEventHandler)
    EventBus.$off(PAGE_FORM_INPUT_EVENT, this.pageFormInputChangeEventHandler)
    EventBus.$off(ACTIVITY_DATA_EVENT, this.activityDataChangeEventHandler)
    EventBus.$off(PAGE_DATA_REFRESH_EVENT, this.refreshEventHandler)
  }

  _loadTransposedColumns () {
    let pageKey = this.pageKey
    let pageDef = getPageDefinition(pageKey)
    if (pageDef && pageDef.tables) {
      pageDef.tables.forEach(table => {
        if (table.tableCells.length > 8) {
          // console.log('transpose table', table)
          this.setupColumnData(pageDef, table, pageKey)
          // console.log('transposed table', table.transposedColumns)
        }
      })
    }
  }

  beforeDestroy (pageKey) {
    // console.log('Before destroy', this.pageKey, pageKey)
    this._takeDownEventHandlers(pageKey)
  }
  /* ********************* DATA  */

  // getPageDefinition (pageKey) {
  //   let pageDef = pageDefs[pageKey]
  //   // console.log('getPageDefinition ' + pageKey, pageDef)
  //   return pageDef
  // }


  getAsLoadedPageData (pageKey) {
    return this.$store.getters['ehrData/asLoadedDataForPageKey'](pageKey)
  }

  /**
   * Get and return the merged (seed + student's work) for the current page
   *
   * @returns {any}
   */
  _mergedProperty () {
    return this.getAsLoadedPageData(this.pageKey)
  }

  getInputValue (def) {
    let inputs = this.currentDialog.inputs
    let val = inputs[def.elementKey]
    // console.log('helper provides val for key ', val, def.key)
    return val
  }

  formatDate (d) {
    return formatTimeStr(d)
  }
  /**
   Take the component's definition data and the component's data and combine it into one table.
   Then rotates the table to place the header labels into the first column and
   each following row in a column.
   Place the result into table.transposedColumns
   * @param pageDef
   * @param table
   * @param pageKey
   */
  setupColumnData (pageDef, table, pageKey) {
    let theData = this.getAsLoadedPageData(pageKey)
    let dbData = Array.isArray(theData.table) ? theData.table : []
    let columns = []
    let row = []
    table.tableCells.forEach(cell => {
      // console.log('the cell ', cell)
      let hdrCss = 'column_label' + (cell.tableCss ? ' ' + cell.tableCss : '')
      let entry = {
        inputType: cell.inputType,
        title: cell.elementKey,
        tableCss: hdrCss,
        value: cell.label
      }
      row.push(entry)
    })
    columns.push(row)
    dbData.forEach(item => {
      row = []
      table.tableCells.forEach(cell => {
        let valCss = 'column_value' + (cell.tableCss ? ' ' + cell.tableCss : '')
        let v = item[cell.elementKey]
        let entry = {
          tableCss: valCss,
          title: v,
          value: v
        }
        row.push(entry)
      })
      columns.push(row)
    })
    let transpose = columns[0].map((col, i) => columns.map(row => row[i]))
    table.isTransposed = true
    table.transposedColumns = transpose
  }

  /* ********************* DIALOG  */
  showDialog (tableDef, dialogInputs) {
    this._setEditing (true)
    let dialog = { tableDef: tableDef, inputs: dialogInputs }
    let key = tableDef.tableKey
    this.dialogMap[key] = dialog
    // add this dialog to the map
    // console.log('set helper into each form element', tableDef.tableForm)
    this.attachHelperToElements(tableDef.tableForm.rows)
    this._clearDialogInputs(key)
    let eData = { key: key, value: true }
    let channel = this.getDialogEventChannel(key)
    // console.log('showDialog emit message to channel ' + channel + ' for key' + key + ' tableDef', tableDef)
    EventBus.$emit(channel, eData)
  }

  attachHelperToElements (rows) {
    const _this = this
    rows.forEach(row => {
      row.elements.forEach(def => {
        def.helper = _this
        if(def.formFieldSet) {
          let cRows = def.formFieldSet.rows
          _this.attachHelperToElements(cRows)
        }
      })
    })
  }

  cancelDialog (tableKey) {
    // console.log('cancel dialog (indexed by tableKey)', tableKey)
    this._clearDialogInputs(tableKey)
    this._emitCloseEvent(tableKey)
  }

  saveDialog (pageKey, tableKey) {
    const _this = this
    if (this._validateInputs(tableKey)) {
      // console.log('saveDialog for page/table', pageKey, tableKey)
      let dialog = this.dialogMap[tableKey]
      // console.log('saveDialog', dialog, 'data', data)
      let inputs = dialog.inputs
      inputs.createdDate = moment().format()
      // console.log('save dialog data into ', tableKey)
      let asLoadedPageData = this.getAsLoadedPageData(pageKey)
      let table = asLoadedPageData[tableKey] || []
      // let modifiedValue = data[tableKey] || []
      // modifiedValue = modifiedValue ? JSON.parse(JSON.stringify(modifiedValue)) : []
      // modifiedValue.push(inputs)
      table.push(inputs)
      // console.log('storing this: ', asLoadedPageData, tableKey, dialog.tableKey)
      // Prepare a payload to tell the API which property inside the assignment data to change
      let payload = {
        propertyName: pageKey,
        value: asLoadedPageData
      }
      this._saveData(payload).then(() => {
        _this._emitCloseEvent(tableKey)
      })
    }
  }

  _setLoading (flag) {
    this.$store.commit('system/setLoading', flag)
  }

  _setEditing (flag) {
    this.$store.commit('system/setEditing', flag)
  }

  _isStudent () {
    return this.$store.getters['visit/isStudent']
  }

  _isDevelopingContent () {
    return this.$store.state.visit.isDevelopingContent
  }

  _isSubmitted () {
    return this.$store.getters['ehrData/submitted']
  }

  /**
   * Return true if a page form is open for edit.
   * @return {(function())|default.computed.isEditing|boolean|*}
   */
  isEditing () {
    return this.$store.state.system.isEditing
  }


  _saveData (payload) {
    const _this = this
    _this._setLoading(true)
    let isStudent = this._isStudent()
    let isDevelopingContent = this._isDevelopingContent()
    if (isStudent) {
      // console.log('saving assignment data', payload)
      payload.value = prepareAssignmentPageDataForSave(payload.value)
      return _this.$store.dispatch('ehrData/sendAssignmentDataUpdate', payload).then(() => {
        _this._setLoading(false)
      })
    } else if (isDevelopingContent) {
      payload.id = _this.$store.state.seedStore.sSeedId
      payload.value = removeEmptyProperties(payload.value)
      // console.log('saving seed ehr data', payload.id, JSON.stringify(payload.value))
      return _this.$store.dispatch('seedStore/updateSeedEhrProperty', payload).then(() => {
        _this._setLoading(false)
      })
    } else {
      return Promise.reject('Coding error using _saveData out of context')
    }
  }

  getDialogEventChannel (dialogKey) {
    const DIALOG_SHOW_HIDE_EVENT_KEY = 'modal:'
    let channel = DIALOG_SHOW_HIDE_EVENT_KEY + dialogKey
    return channel
  }

  getErrorList (dialogKey) {
    // console.log('get error list for key', dialogKey)
    let d = this.dialogMap[dialogKey]
    return d ? d.errorList : []
  }

  _emitCloseEvent (dialogKey) {
    const _this = this
    let eData = { key: dialogKey, value: false }
    let channel = this.getDialogEventChannel(dialogKey)
    Vue.nextTick(function () {
      // Send an event on our transmission channel
      // with a payload containing this false
      // console.log('emit event', eData, 'on', channel)
      EventBus.$emit(channel, eData)
      _this._setEditing (false)
    })
  }

  _clearDialogInputs (key) {
    // console.log('clear dialog for key ', key)
    let d = this.dialogMap[key]
    let cells = d.tableDef.tableCells
    let inputs = d.inputs
    // console.log('clear dialog inputs', inputs)
    // console.log('clear dialog cells', cells)
    // TODO check that default values are working
    cells.forEach(cell => {
      inputs[cell.elementKey] = cell.defaultValue ? cell.defaultValue : '' //cell.defaultValue(this.$store) : ''
    })
    // empty the error list array
    d.errorList = []
  }

  // TODO validation will need rework as part of the DDD refactor
  _validateInputs (key) {
    // console.log('validate dialog for key' + key)
    let d = this.dialogMap[key]
    let cells = d.tableDef.tableCells
    let inputs = d.inputs
    // console.log('what is in the inputs? ', inputs)
    d.errorList = []
    cells.forEach(cell => {
      if (cell.type === 'text') {
        inputs[cell.elementKey] = inputs[cell.elementKey].trim()
      }
      if (cell.validationRules) {
        cell.validationRules.forEach(rule => {
          let value = inputs[cell.elementKey]
          if (rule.required && value.length === 0) {
            let msg = cell.label + ' is required'
            console.log('validateInput', msg)
            d.errorList.push(msg)
          }
        })
      }
    })
    d.errorList.push('TODO remove force success once ready')
    // TODO remove force success once ready
    return true // d.errorList.length === 0
  }

  /* ********************* FORM  */

  /**
   * Show or don't show page edit controls or table open dialog buttons.
   * Currently the rule is simply "is the user a student" but this will need to
   * be changed if there is a need to let instructors "do the assignment" or
   * if we want to let the application be the place to edit seed data.
   * @return {*}
   */
  showTableAddButton () {
    return this._showControl('hasTable')
  }

  showPageFormControls () {
    return this._showControl('hasForm')
  }

  _showControl (prop) {
    let show = false
    let isStudent = this._isStudent()
    let submitted = this._isSubmitted()
    let studentCanEdit = isStudent && !submitted
    let isDevelopingContent = this._isDevelopingContent()
    if (studentCanEdit || isDevelopingContent) {
      let pd = getPageDefinition(this.pageKey)
      // console.log('decide to show or not this page def', prop, pd[prop], pd)
      show = pd[prop]
    }
    return show
  }

  /**
   * Begin editing a page form
   */
  beginEdit (pageKey) {
    this._setEditing (true)
    // console.log('beginEdit', this.pageKey, pageKey)
    let asLoadedData = this.getAsLoadedPageData(pageKey)
    let cacheData = JSON.stringify(asLoadedData)
    this.pageFormData = {
      propertyName: pageKey,
      cacheData: cacheData,
      value: asLoadedData
    }
  }

  /*
TODO the cancel edit page form is not restoring the as loaded data correctly, consistently
 */
  /**
   * Cancel the edit on a page form. Restore values from the database.
   */
  cancelEdit () {
    const _this = this
    this._setLoading(true)
    this.$store.dispatch('ehrData/restoreActivityData').then(() => {
      _this._setEditing (false)
      _this._setLoading(false)
      _this._mergedProperty()
      EventBus.$emit(PAGE_DATA_REFRESH_EVENT)
    })
    this.pageFormData = undefined
  }

  /**
   * Save changes made on a page form
   */
  saveEdit () {
    let payload = this.pageFormData
    this._saveData(payload).then(() => {
      this._setEditing (false)
    })
  }

  /**
   * Report if there is a page form open for edit and the data on the form has been modified
   * @return {boolean}
   */
  unsavedData () {
    let isEditing = this.isEditing()
    let result = false
    if (isEditing) {
      if (this.pageFormData) {
        let currentData = JSON.stringify(this.pageFormData.value)
        let cacheData = this.pageFormData.cacheData
        // console.log('current data', currentData)
        // console.log('cacheAsString', cacheData)
        result = cacheData !== currentData
      } else {
        // a page dialog is open.
        result = true
      }
    }
    // console.log('unsaved data?', isEditing, result)
    return result
  }

  /* ********************* EVENTS  */

  /**
   * If a page form is in edit mode and there are changes then warn the user before they navigate to
   * another part of this app.
   * @param to
   * @param from
   * @param next
   * @return {*}
   */
  beforeRouteLeave (to, from, next) {
    // console.log('beforeRouteLeave ...', to)
    let isEditing = this.isEditing()
    if (isEditing) {
      let unsaved = this.unsavedData()
      // console.log('beforeRouteLeave ...', unsaved)
      if (unsaved) {
        if (!window.confirm(LEAVE_PROMPT)) {
          // unsaved data and the user wants to stay
          return next(false)
        }
      }
      this._setEditing (false)
    }
    next()
  }

  /**
   * If the page form is in edit mode and there are changes then warn the user before they navigate
   * to another site
   * @param event
   */
  beforeUnloadListener (event) {
    let e = event || window.event
    // console.log('beforeunload ...', e)
    let unsaved = this.unsavedData()
    // console.log('beforeunload ...', unsaved)
    if (unsaved) {
      // according to specs use preventDefault too.
      e.preventDefault()
      // many browsers ignore the prompt and provide their own
      e.returnValue = LEAVE_PROMPT
      // } else {
      // if you set any value into e.returnValue it will be converted to a string and that makes the prompt appear
      // So avoid this ...
      // e.returnValue = null
    }
    // e.returnValue = LEAVE_PROMPT
  }

  /**
   * When a dialog form input changes we get an update message here.
   * DIALOG_INPUT_EVENT
   * This message is from a child component and it's passing the new value up to the parent's helper (here).
   * Take the value and stash it into the appropriate input so we have access to the inputs when it's time to save.
   * @param eData
   * @private
   */
  _handleDialogInputChangeEvent (eData) {
    let def = eData.element
    let tableKey = def.tableKey
    let elementKey = def.elementKey
    let value = eData.value
    let d = this.dialogMap[tableKey]
    // console.log(`handle dialog input change for key ${tableKey}`)
    // console.log(`On event from ${tableKey} ${elementKey} with dialog: ${d}`)
    let inputs = d.inputs
    inputs[elementKey] = value
  }

  _handlePageFormInputChangeEvent (eData) {
    let element = eData.element
    let elementKey = element.elementKey
    let value = eData.value
    // console.log('_handlePageFormInputChangeEvent', this.pageKey, element.pageDataKey)
    // console.log(`Input change event from ${elementKey} value: ${value}`)
    let pageData = this.pageFormData.value
    // let oldVal = pageData[elementKey]
    pageData[elementKey] = value
  }

  _handleActivityDataChangeEvent (eData) {
    console.log('Activity data changed. Trigger a load and refresh', this.pageKey)
    EventBus.$emit(PAGE_DATA_REFRESH_EVENT)
  }
}