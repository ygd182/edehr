<template lang="pug">
  div(:id="activityId")
    div(class="activity-list-header columns", v-on:click="toggleShow")
      div(class="header-column is-10 column")
        h3(:title="activityId") {{ activityName }}
        accordion-element(theme="grayTheme", :show="show")
          table
            tr
              td LMS description:
              td
                div(v-text-to-html="activity.resource_link_description")
            tr
              td Assignment name:
              td
                ui-link(:name="'assignments'", :params="{assignmentId: assignment._id}")
                  span(v-on:click="switchAssignment")  {{ assignment.name }}
            tr
              td Assignment description:
              td
                div(v-text-to-html="assignment.description")
            tr
              td LMS configuration:
              td assignment={{ assignment.externalId }}
      div(class="header-column is-2 column")
        div(class="header-item header-icon")
          div(class="icon-group")
            fas-icon(icon="plus", v-show="!show")
            fas-icon(icon="minus", v-show="show")

    div(class="activity-list-body")
      accordion-element(:show="show")
        div(class="activity-details-header")
          div(class="activity-details-header-item")
            ui-button(v-on:buttonClicked="downloadEvaluations") Download all assignment evaluation notes
              fas-icon(class="icon-right", icon="download")
        class-list(:classList="classList")
    ui-save-as-prompt(ref="promptDialog", title="Save evaluation", :message="promptMessage", :filename="activityName", v-on:confirm="proceed")
</template>

<script>
import ClassList from './ClassList'
import AccordionElement from '../../app/components/AccordionElement'
import StoreHelper from '../../helpers/store-helper'
import UiLink from '../../app/ui/UiLink.vue'
import UiButton from '../../app/ui/UiButton'
import UiSaveAsPrompt from '../../app/ui/UiSaveAsPrompt.vue'
import { downArrayToCsvFile } from '../../helpers/ehr-utils'

export default {
  components: {
    AccordionElement,
    ClassList,
    UiLink, UiSaveAsPrompt, UiButton
  },
  props: {
    activityId: { type: String },
    index: { type: Number}
  },
  data () {
    return {
      show: false,
      indicator: '+',
      classList: [],
      activity: {},
      assignment: {}
    }
  },
  computed: {
    activityName () {
      return this.activity.resource_link_title
    },
    promptMessage () {
      return 'Save evaluations for ' + this.activityName
    }
  },
  methods: {
    switchAssignment: function () {
      console.log('switchAssignment', this.assignment)
      StoreHelper.switchAssignment(this.assignment)
    },
    setShow: function (value) {
      this.show = value
      this.indicator = value ? '-' : '+'
    },
    toggleShow () {
      if(this.show === false) {
        this.loadClassList()
      } else {
        this.setShow(false)
      }
    },
    downloadEvaluations () {
      this.$refs.promptDialog.showDialog(this.promptTitle, this.promptMessage, this.promptLabel)
    },
    proceed (filename) {
      let data = []
      data.push(['email','feedback: ' + this.activityName])
      this.classList.forEach ( sv => {
        data.push([sv.user.emailPrimary,sv.activityData.evaluationData])
      })
      downArrayToCsvFile(filename, data)
    },

    loadActivity () {
      const _this = this
      const activityId = this.activityId
      return StoreHelper.dispatchLoadActivity(this, activityId)
        .then((theActivity) => {
          _this.activity = theActivity
          return StoreHelper.getAssignment(this, theActivity.assignment)
        })
        .then((theAssignment) => {
          _this.assignment = theAssignment
          let id = this.assignment._id
          let assignment = StoreHelper.getLoadedAssignment()
          // console.log('Activity loadActivity id', id)
          // console.log('Activity loadActivity assignment', assignment)
          let selected = id === assignment._id
          if (selected) {
            this.loadClassList()
            this.$nextTick(() => {
              // this.$refs[this.activityId].scrollTop = 0
              let element = document.getElementById(activityId)
              // console.log('Activity scroll to ', activityId, element)
              let top = element.offsetTop
              window.scrollTo(0, top)
            })
          }
        })
    },
    loadClassList () {
      const _this = this
      return StoreHelper.dispatchLoadClassList(this, this.activityId)
        .then((classList) => {
          _this.classList = classList
          _this.$nextTick(() => _this.setShow(true))
        })
    }
  },
  mounted: function () {
    this.loadActivity()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/definitions';
  .activity-list {
    padding: 0;
  }
  .activity-list-header {
    background-color: $grey03;
    border: 1px solid rgba(255, 255, 255, 0);
    margin-bottom: 0;
    cursor: pointer;

    .header-column {
      padding: 1rem 1.5rem .5rem;
      position: relative;

      p {
        margin-bottom: .5rem;
      }

      .icon-group {
        right: 20px;
      }
    }
    .header-item {
      display: block;
    }
    .header-icon {
      font-size: 2rem;
      font-weight: bold;
      text-align: right;
      line-height: 0.5;
    }
  }

  .activity-list-body {
    background-color: $grey10;
    overflow: hidden;
    margin-bottom: 0;

    .activity-details-header {
      padding: 0.5rem 1.5rem;
      background-color: $grey10;
      border: 1px solid $grey20;
      box-sizing: border-box;
    }
    .activity-details-header-item {
      display: inline-block;
      margin-right: 2rem;
    }
    button.button {
      margin-bottom: 0;
    }
  }
  .activity-list:hover .activity-list-header {
    background-color: $brand-primary-light;
    box-sizing: border-box;
    border: 1px solid $brand-primary;
  }
</style>
