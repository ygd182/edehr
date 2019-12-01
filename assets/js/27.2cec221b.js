(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{267:function(e,t,a){"use strict";a.r(t);var i=a(0),r=Object(i.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"medication-administration-records-mar"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#medication-administration-records-mar","aria-hidden":"true"}},[e._v("#")]),e._v(" Medication Administration Records - MAR")]),e._v(" "),a("blockquote",[a("p",[e._v("The MAR page is highly customized and complex page that tracks the administration of medications that were entered on the medication orders page. Medication and scheduling details are brought in and compared to the actual medications and time that they were administered.")])]),e._v(" "),a("h2",{attrs:{id:"schedule-periods-perioddefs"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#schedule-periods-perioddefs","aria-hidden":"true"}},[e._v("#")]),e._v(" Schedule Periods -- PeriodDefs")]),e._v(" "),a("p",[e._v("In this prototype EdEHR we had the challenge to define when a medication is scheduled. For the\nsake of a simple first attempt we chose to create arbitrary schedule times:")]),e._v(" "),a("ul",[a("li",[e._v("breakfast")]),e._v(" "),a("li",[e._v("breakfast")]),e._v(" "),a("li",[e._v("midmorning")]),e._v(" "),a("li",[e._v("lunch")]),e._v(" "),a("li",[e._v("midafternoon")]),e._v(" "),a("li",[e._v("dinner")])]),e._v(" "),a("p",[e._v("These values are dynamically based on the Medication Order page definitions as defined by the\nInputs spreadsheet. See the "),a("code",[e._v("PeriodDefs")]),e._v(" class for the algorithm used to construct these\nperiods based on the definitions.")]),e._v(" "),a("p",[e._v("Much of the logic is based on this set of time periods. Each singular time period is called a "),a("code",[e._v("PeriodDef")]),e._v("\nThe set is plural and called "),a("code",[e._v("PeriodDefs")])]),e._v(" "),a("h2",{attrs:{id:"medication-orders"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#medication-orders","aria-hidden":"true"}},[e._v("#")]),e._v(" Medication Orders")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("let sampleMedicationOrder = {\n  name: 'Joe',\n  profession: 'N',\n  day: '0',\n  time: '0:00',\n  notes: 'ipsum',\n  medication: 'ASA',\n  route: 'oral',\n  reason: 'sick',\n  scheduleType: 'scheduled',\n  breakfast: true,\n  midafternoon: undefined,\n  midmorning: undefined,\n  dinner: true,\n  lunch: true,\n  createdDate: '2019-03-14T15:03:36-07:00',\n}\n")])])]),a("p",[e._v("(NB. The structure may change and the periods may be nested under a group.)")]),e._v(" "),a("h3",{attrs:{id:"medication-order-active-status"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#medication-order-active-status","aria-hidden":"true"}},[e._v("#")]),e._v(" Medication Order - Active Status")]),e._v(" "),a("p",[e._v("In a professional EHR the medication order has the concept of being active or not. Sometimes this is managed by setting a start\ndate and end date. This prototype makes no attempt to manage this status, yet the algorithm below shows how\nthis might play.")]),e._v(" "),a("h2",{attrs:{id:"mar"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mar","aria-hidden":"true"}},[e._v("#")]),e._v(" MAR")]),e._v(" "),a("p",[e._v("A MAR is a record of the administration of a set of medications. Each record contains")]),e._v(" "),a("ul",[a("li",[e._v("who administered the medication")]),e._v(" "),a("li",[e._v("the scheduled time for the medication to be administered (one key from from the set of "),a("code",[e._v("PeriodDefs")]),e._v(")")]),e._v(" "),a("li",[e._v("the actual time administered (24hr clock)")]),e._v(" "),a("li",[e._v("a list of the medication orders that have been administered in the past")]),e._v(" "),a("li",[e._v("an optional comment")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("let sample = {\n  medAdminRec: {\n    lastUpdate: '2019-03-24T15:33:20-07:00',\n    table: [\n      {\n        whoAdministered: 'N',\n        day: 0,\n        actualTime: '9:00',\n        comment: 'no comment',\n        scheduledTime: 'breakfast',\n        medications: [\n          {\n            name: 'Joe',\n            profession: 'N',\n            day: '0',\n            time: '0:00',\n            medication: 'ASA',\n            route: 'oral',\n            reason: 'sick',\n            scheduleType: 'scheduled',\n            breakfast: true,\n            midmorning: false,\n            lunch: true,\n            midafternoon: false,\n            dinner: true,\n            createdDate: '2019-03-14T15:03:36-07:00'\n          }\n        ]\n      }\n    ]\n  }\n}\n")])])]),a("h2",{attrs:{id:"mar-page"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mar-page","aria-hidden":"true"}},[e._v("#")]),e._v(" MAR page")]),e._v(" "),a("p",[e._v("MAR is an acronym for Medication Administration Record. The MAR page has two tabs: Today and Summary.")]),e._v(" "),a("h2",{attrs:{id:"mar-today"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mar-today","aria-hidden":"true"}},[e._v("#")]),e._v(" MAR Today")]),e._v(" "),a("p",[e._v("The Today tab contains a list of medications that are due to be administered to the patient today. It is organized by general time periods of a day. This list currently ranges from breakfast to bedtime, but in the future should be from 00:00 to 24:00. A time period will only be displayed if there is a medication scheduled for that time.")]),e._v(" "),a("p",[e._v('Each time period is displayed with (and only displayed if there is available) the associated medication list and administration status. If a medication order is scheduled, but has not yet been given, an "Add administation record" button will be available for the user to enter the needed data. The button will only be shown for the first period of the day that lacks an administration record.')]),e._v(" "),a("h2",{attrs:{id:"mar-summary"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mar-summary","aria-hidden":"true"}},[e._v("#")]),e._v(" MAR Summary")]),e._v(" "),a("p",[e._v("The summary tab holds every given and missed medication administration. It matches and pulls from the entered data on the Medications Orders page, and is combined with each medication administration record (stored as data for this MAR page).")]),e._v(" "),a("p",[e._v("Each medication will have a status of given or not given for each MAR.")]),e._v(" "),a("p",[e._v("We can see a challenge as the number of active days in the assignment grows beyond a few days. For this prototype we\nignore this problem yet it needs to be addressed for a larger system. One option is to place an afordance like a filter on the page\nto select MARs for a particular day.")]),e._v(" "),a("h2",{attrs:{id:"algorithm-to-collate-medication-orders-and-mars-into-periods"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#algorithm-to-collate-medication-orders-and-mars-into-periods","aria-hidden":"true"}},[e._v("#")]),e._v(" Algorithm to collate Medication Orders and MARs into Periods")]),e._v(" "),a("ol",[a("li",[a("p",[e._v("Initialize")]),e._v(" "),a("ol",[a("li",[e._v("Let "),a("code",[e._v("cDay")]),e._v(" (current day) = 0")]),e._v(" "),a("li",[e._v("Initial list of "),a("code",[e._v("PeriodDefs")])])])]),e._v(" "),a("li",[a("p",[e._v("If there are no medication orders then")]),e._v(" "),a("ol",[a("li",[e._v("Done (There are no periods needing a MAR. The Today page is empty)")])])]),e._v(" "),a("li",[a("p",[e._v("Let "),a("code",[e._v("mOrders")]),e._v(" = the list of medication orders (filtered to only include active orders)")]),e._v(" "),a("ol",[a("li",[e._v("For each period let period.mOrders = mOrders filtered to the those scheduled for the period. (e.g. For the\n'breakfast' period select all medications that have 'breakfast === true'")]),e._v(" "),a("li",[e._v("Filter the PeriodDefs list to only contain periods that have medications scheduled.")])])]),e._v(" "),a("li",[a("p",[e._v("If there are no MAR records then")]),e._v(" "),a("ol",[a("li",[e._v("Done (No MAR records so all the periods with scheduled medications need a MAR)")])])]),e._v(" "),a("li",[a("p",[e._v("Set up today")]),e._v(" "),a("ol",[a("li",[e._v("Let "),a("code",[e._v("cDay")]),e._v(" = the max day in all MAR records.")]),e._v(" "),a("li",[e._v("Let "),a("code",[e._v("marRecs")]),e._v(" = MAR Records filtered to the cDay")])])]),e._v(" "),a("li",[a("p",[e._v("If there are no "),a("code",[e._v("marRecs")]),e._v(" for the current day then")]),e._v(" "),a("ol",[a("li",[e._v("Done (No MAR records for current day so all the periods with scheduled medications need a MAR)")])])]),e._v(" "),a("li",[a("p",[e._v("For each "),a("code",[e._v("mRec")]),e._v(" in "),a("code",[e._v("marRecs")]),e._v(" find the "),a("code",[e._v("period")]),e._v(" in "),a("code",[e._v("PeriodDefs")]),e._v(". Let "),a("code",[e._v("period.marRec = mRec")])]),e._v(" "),a("blockquote",[a("p",[e._v("At this point, each period has "),a("code",[e._v("mOrders")]),e._v(". If this list is not empty then the period may also have a "),a("code",[e._v("marRec")])])])]),e._v(" "),a("li",[a("p",[e._v("If all periods have a marRec then")]),e._v(" "),a("ol",[a("li",[e._v("Let cDay = cDay + 1")]),e._v(" "),a("li",[e._v("Clear marRecs from all periods")]),e._v(" "),a("li",[e._v("Done")])]),e._v(" "),a("blockquote",[a("p",[e._v("This situation happens when the last day is full")])])])]),e._v(" "),a("blockquote",[a("p",[e._v("If we reach this point then the current day has at least one scheduled period that has some medications prescribed and no\nMAR record. Display as per described above (MAR Current Day)")])])])}),[],!1,null,null,null);t.default=r.exports}}]);