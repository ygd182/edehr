(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{248:function(e,t,a){"use strict";a.r(t);var s=a(0),r=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"ehr-definitions-keys-and-identifiers"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ehr-definitions-keys-and-identifiers","aria-hidden":"true"}},[e._v("#")]),e._v(" EHR Definitions - Keys and Identifiers")]),e._v(" "),a("blockquote",[a("p",[e._v("How elements are identified is critical to the code generation and the resulting EHR application")])]),e._v(" "),a("p",[e._v("Make the effort to keep related elements together on the spreadsheet. Page elements are followed by the page_form\nelement or table_row element which are then followed by input elements that follow the "),a("em",[e._v("grouping")]),e._v(" element. The order of these inputs\ndoesn't need to follow the desired UI layout, but it does help to visualize how it will render in the page. If you have a sub-group called a "),a("code",[e._v("fieldset")]),e._v(" organize the inputs that are in\nthis sub-group below the fieldset element.")]),e._v(" "),a("h2",{attrs:{id:"elementkey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#elementkey","aria-hidden":"true"}},[e._v("#")]),e._v(" elementKey")]),e._v(" "),a("p",[e._v("Every element that forms part of the data that is stored in the DB must have an element key. This key must be unique within\nits "),a("em",[e._v("group")]),e._v('. For example, a page may have two tables and each table may start with the typical "Name, profession, day, time"\nset of fields. These fields can have element keys name, profession, day and time even though another table on the same\npage has the same fields. This is because they are grouped in the table element. See level2Key.')]),e._v(" "),a("h2",{attrs:{id:"pagedatakey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pagedatakey","aria-hidden":"true"}},[e._v("#")]),e._v(" pageDataKey")]),e._v(" "),a("p",[e._v("Every element must have the pageDataKey so that it can be located on the correct page. This key is also critical for\nstoring values in the DB because pages are the root elements in the data structure that is stored.\nBe sure a page's elementKey matches the key specified on the "),a("code",[e._v("pages")]),e._v(" tab. It may be helpful to use a formula to\nget the same value. The spreadsheet uses a formula to set up all elements' pageDataKey.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('=if($G3="page",$F3,$C2)\n')])])]),a("p",[e._v("This says: if this element is a page then use the elementKey else use the value computed on the row\nabove which will be the page's key.")]),e._v(" "),a("h2",{attrs:{id:"level2key"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#level2key","aria-hidden":"true"}},[e._v("#")]),e._v(" level2Key")]),e._v(" "),a("p",[e._v("These two properties establish grouping within a page. The main use for level2Key is to group elements into a table, on\na page. Use a formula to set the "),a("code",[e._v("level2Key")]),e._v(" property of the first child of the page_form or table to be equal to the group's\n"),a("code",[e._v("elementKey")]),e._v(" property. Use a formula to set all remaining child elements to use the same "),a("code",[e._v("level2Key")])]),e._v(" "),a("h2",{attrs:{id:"level3key"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#level3key","aria-hidden":"true"}},[e._v("#")]),e._v(" level3Key")]),e._v(" "),a("p",[e._v("Level3 keys are just a refinement on level2 keys. They are typically used to group input elements into a fieldset. Set up these\nproperties similar to "),a("code",[e._v("level2Key")])]),e._v(" "),a("h2",{attrs:{id:"dataparent-and-fqn"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dataparent-and-fqn","aria-hidden":"true"}},[e._v("#")]),e._v(" dataParent and fqn")]),e._v(" "),a("p",[e._v("Off to the far side are two critical properties: "),a("code",[e._v("dataParent")]),e._v(" and "),a("code",[e._v("fqn")]),e._v(" (which stands for Fully Qualified Name).\nBoth of these are computed values. Be sure the formulas in these cells match the others whenever rows are added or deleted.\n"),a("code",[e._v("dataParent")]),e._v(" is the FQN of the element's parent in the data structure stored in the DB.\n"),a("code",[e._v("FQN")]),e._v(" is the element's unique within the whole system identifier.")])])}),[],!1,null,null,null);t.default=r.exports}}]);