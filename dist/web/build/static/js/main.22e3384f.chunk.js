(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[1],{210:function(e,t,a){},211:function(e,t,a){},212:function(e,t,a){},213:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(84),l=a.n(c),o=a(85);var s=function(){return r.a.createElement("div",{className:"nav"},r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"nav-logo"},r.a.createElement("h1",{className:"h2 m-0"},"Torrent AIO bot")),r.a.createElement("div",{className:"nav-links"},r.a.createElement(o.a,null))))},i=a(14),u=a(3);function m(e){var t=e.nav;return r.a.createElement("div",{className:"nav nav-horiz"},r.a.createElement("div",{className:"content"},r.a.createElement("ul",{className:"d-flex align-items-center space-around width-100 m-0"},r.a.createElement("li",{className:"cursor-pointer p-0 ph-1 height-100 d-flex align-items-center".concat("search"===t?" border-bottom-1":"")},r.a.createElement(i.b,{to:"/search",className:"height-100 d-flex align-items-center"},r.a.createElement("i",{className:"h2 m-0 d-flex align-items-center"},r.a.createElement("ion-icon",{name:"search-outline"})),r.a.createElement("span",{className:"tablet-desktop-only ml-05"},"Search"))),r.a.createElement("li",{className:"cursor-pointer p-0 ph-1 height-100 d-flex align-items-center".concat("downloads"===t?" border-bottom-1":"")},r.a.createElement(i.b,{to:"/download",className:"height-100 d-flex align-items-center"},r.a.createElement("i",{className:"h2 m-0 d-flex align-items-center"},r.a.createElement("ion-icon",{name:"download-outline"})),r.a.createElement("span",{className:"tablet-desktop-only ml-05"},"Downloads"))),r.a.createElement("li",{className:"cursor-pointer p-0 ph-1 height-100 d-flex align-items-center".concat("drive"===t?" border-bottom-1":"")},r.a.createElement(i.b,{to:"/drive",className:"height-100 d-flex align-items-center"},r.a.createElement("i",{className:"h2 m-0 d-flex align-items-center"},r.a.createElement("ion-icon",{name:"push-outline"})),r.a.createElement("span",{className:"tablet-desktop-only ml-05"},"Drive"))))))}var d=Object(n.lazy)((function(){return a.e(6).then(a.bind(null,216))})),p=Object(n.lazy)((function(){return Promise.all([a.e(0),a.e(4)]).then(a.bind(null,217))})),b=Object(n.lazy)((function(){return Promise.all([a.e(0),a.e(5)]).then(a.bind(null,218))}));function h(e){var t=e.tab||"search";return r.a.createElement(r.a.Fragment,null,r.a.createElement(m,{nav:t}),r.a.createElement("main",null,r.a.createElement("div",{className:"content"},r.a.createElement(n.Suspense,{fallback:r.a.createElement("div",{className:"div-loading"})},"search"===t&&r.a.createElement(d,null),"downloads"===t&&r.a.createElement(p,null),"drive"===t&&r.a.createElement(b,null)))))}var g=a(2),v=a.n(g),f=a(6),E=a(1),k=a(9);function O(){var e=Object(n.useState)(""),t=Object(E.a)(e,2),a=t[0],c=t[1],l=Object(n.useState)(""),o=Object(E.a)(l,2),s=o[0],i=o[1],u=Object(n.useState)(""),m=Object(E.a)(u,2),d=m[0],p=m[1],b=Object(n.useState)(!1),h=Object(E.a)(b,2),g=h[0],O=h[1],j=Object(n.useState)(""),x=Object(E.a)(j,2),y=x[0],C=x[1],N=Object(n.useState)(!1),S=Object(E.a)(N,2),w=S[0],I=S[1],T=Object(n.useState)(""),L=Object(E.a)(T,2),A=L[0],_=L[1],D=function(){var e=Object(f.a)(v.a.mark((function e(t){var n,r;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&t.preventDefault(),I(!0),!a||!s||d){e.next=9;break}return e.next=5,fetch("/api/v1/drive/getAuthURL?clientId=".concat(a,"&clientSecret=").concat(s)).then((function(e){return e.json()}));case 5:!(n=e.sent)||n.error?_(n.error||"An error occured"):(window.open(n.authURL),O(!0)),e.next=14;break;case 9:if(!(a&&s&&d)){e.next=14;break}return e.next=12,fetch("/api/v1/drive/getAuthToken?clientId=".concat(a,"&clientSecret=").concat(s,"&authCode=").concat(d)).then((function(e){return e.json()}));case 12:!(r=e.sent)||r.error?_(r.error||"An error occured"):C(JSON.stringify(r.token));case 14:I(!1);case 15:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("main",null,r.a.createElement("div",{className:"content"},r.a.createElement("h1",null,"Gdrive token generator"),r.a.createElement("form",{onSubmit:D},r.a.createElement(k.a,{id:"clientId",name:"clientId",label:"Client Id",value:a,onChange:c,required:!0}),r.a.createElement(k.a,{id:"clientSecret",name:"clientSecret",label:"Client Secret",value:s,onChange:i,required:!0}),g&&r.a.createElement(k.a,{id:"authCode",name:"authCode",label:"Auth code",value:d,onChange:p,required:!0}),A&&r.a.createElement("div",{style:{color:"red"}},A),r.a.createElement("button",{disabled:w,className:"btn primary".concat(w?" loading":""),type:"submit"},d?"Get auth code":"Generate token")),y&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"mt-1"},y),r.a.createElement("button",{className:"btn primary",onClick:function(){var e=y,t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}},"Copy token"))))}var j=a(40),x=a(37),y=a(38),C=a(52),N=a(7),S=a.n(N),w=a(39),I=a.n(w),T=a(15),L=a.n(T),A=a(36),_=["label","labelProps","wrapperClass","onChange","id","options"];function D(e){var t=e.label,a=(e.labelProps,e.wrapperClass),n=e.onChange,c=e.id,l=e.options,o=void 0===l?[]:l,s=Object(A.a)(e,_);return r.a.createElement("div",{className:"form-group ".concat(a||"")},r.a.createElement("label",{htmlFor:c},t),r.a.createElement("select",Object.assign({className:"form-control"},s,{id:c,onChange:function(e){return n(e.target.value)}}),o.map((function(e){return r.a.createElement("option",{key:"option-".concat(e.value),value:e.value},e.label||e.value)}))))}D.defaultProps={type:"text",onChange:function(e){return console.log("Value: ",e)}};var q=D,F=a(54),M=[{value:"mdisk"},{value:"dood"}],z=[{label:"1Webseries",value:"1"},{label:"2English",value:"2"},{label:"3English Premium",value:"3"},{label:"4Desi",value:"4"},{label:"5English Bulk",value:"5"},{label:"6Tango&onlyfans",value:"6"}];function P(){var e,t=Object(u.f)(),a=Object(u.g)(),c=(null===a||void 0===a?void 0:a.state)||{},l=Object(n.useState)((null===(e=c.groupInfo)||void 0===e?void 0:e.id)||""),o=Object(E.a)(l,2),s=o[0],i=o[1],m=Object(n.useState)(c.groupInfo||{}),d=Object(E.a)(m,2),p=d[0],b=d[1],h=Object(n.useState)(c.category||z[0].value),g=Object(E.a)(h,2),O=g[0],j=g[1],x=Object(n.useState)(c.size||"50"),y=Object(E.a)(x,2),C=y[0],N=y[1],w=Object(n.useState)(c.page||"1"),I=Object(E.a)(w,2),T=I[0],L=I[1],A=Object(n.useState)(c.pageIncrementor||"1"),_=Object(E.a)(A,2),D=_[0],P=_[1],U=Object(n.useState)(c.channelName||"primexmov"),R=Object(E.a)(U,2),Y=R[0],G=R[1],B=Object(n.useState)(c.linkType||M[0].value),J=Object(E.a)(B,2),K=J[0],Q=J[1],V=Object(n.useState)(!!c.thumbUrl||!1),H=Object(E.a)(V,2),W=H[0],Z=H[1],X=Object(n.useState)(c.thumbUrl||"https://drive.google.com/uc?export=view&id=1GK6SH3Kwgu-Nwr4ilQPyiKuk26tbZmxb"),$=Object(E.a)(X,2),ee=$[0],te=$[1],ae=Object(n.useState)(!!c.cname&&"v1"!==c.cname),ne=Object(E.a)(ae,2),re=ne[0],ce=ne[1],le=Object(n.useState)(c.cname||"v1"),oe=Object(E.a)(le,2),se=oe[0],ie=oe[1],ue=Object(n.useState)(!c.groupInfo||c.isEuOrgLink),me=Object(E.a)(ue,2),de=me[0],pe=me[1],be=Object(n.useState)(!!c.groupInfo&&c.isNewMdisk),he=Object(E.a)(be,2),ge=he[0],ve=he[1],fe=Object(n.useState)(!1),Ee=Object(E.a)(fe,2),ke=Ee[0],Oe=Ee[1],je=Object(n.useState)(""),xe=Object(E.a)(je,2),ye=xe[0],Ce=xe[1],Ne=function(){var e=Object(f.a)(v.a.mark((function e(a){var n,r,l,o,s;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a&&a.preventDefault(),!Object(F.isEmpty)(p)){e.next=4;break}return Ce("Click on get info after passing groupId"),e.abrupt("return",!1);case 4:if(Oe(!0),(n={groupInfo:p,category:O,size:C,page:T,channelName:Y,linkType:K,pageIncrementor:D,isNewMdisk:ge,isEuOrgLink:de}).thumbUrl=W?ee:"",n.cname=re?se:"",console.log("sfsfsf",n),e.prev=9,!c._id){e.next=35;break}if(n.groupInfo===c.groupInfo&&n.groupInfo&&delete n.groupInfo,n.category===c.category&&n.category&&delete n.category,n.size===c.size&&n.size&&delete n.size,n.page===c.page&&n.page&&delete n.page,n.channelName===c.channelName&&n.channelName&&delete n.channelName,n.linkType===c.linkType&&n.linkType&&delete n.linkType,n.pageIncrementor===c.pageIncrementor&&n.pageIncrementor&&delete n.pageIncrementor,W&&n.thumbUrl===c.thumbUrl&&delete n.thumbUrl,n.cname===c.cname&&delete n.cname,n.isNewMdisk===c.isNewMdisk&&delete n.isNewMdisk,n.isEuOrgLink===c.isEuOrgLink&&delete n.isEuOrgLink,!Object(F.isEmpty)(n)){e.next=25;break}return Oe(!1),e.abrupt("return");case 25:return n._id=c._id,e.next=28,S.a.post("/api/v1/task/update",n);case 28:r=e.sent,l=r.data,console.log("update response==",l),l&&t.push("/task"),Oe(!1),e.next=42;break;case 35:return e.next=37,S.a.post("/api/v1/task/add",n);case 37:o=e.sent,s=o.data,console.log("api response===",s),s&&t.push("/task"),Oe(!1);case 42:e.next=48;break;case 44:e.prev=44,e.t0=e.catch(9),console.log("api error",e.t0),Oe(!1);case 48:case"end":return e.stop()}}),e,null,[[9,44]])})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("main",null,r.a.createElement("div",{className:"content"},r.a.createElement("h1",null,"Gdrive token generator"),r.a.createElement("form",{onSubmit:Ne},r.a.createElement(q,{id:"linkType",name:"linkType",label:"Link Type",options:M,value:K,onChange:Q,required:!0}),r.a.createElement(q,{id:"category",name:"category",label:"Category",options:z,value:O,onChange:j,required:!0}),r.a.createElement(k.a,{id:"groupId",name:"groupId",label:"Group Id",value:s,onChange:i,required:!0}),r.a.createElement("div",{className:"d-flex",style:{alignItems:"center"}},r.a.createElement("button",{disabled:ke,onClick:Object(f.a)(v.a.mark((function e(){var t,a,n;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,Oe(!0),e.next=4,S.a.get("/api/v1/task/telegramget?url=https://api.telegram.org/bot_bot_token_/getChat?chat_id=".concat(s));case 4:t=e.sent,a=t.data,n=void 0===a?{}:a,console.log("api response===",n),b(n.data.result),Oe(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(0),Oe(!1),b({});case 16:case"end":return e.stop()}}),e,null,[[0,12]])})))},ke?"Loading...":"Get Chat Info"),r.a.createElement("div",{style:{flex:1}},r.a.createElement(k.a,{id:"groupName",name:"groupName",value:p.title,disabled:!0}))),r.a.createElement(k.a,{id:"size",max:"100",name:"size",label:"Size(Number of messages)",value:C,onChange:N,required:!0,type:"number"}),r.a.createElement(k.a,{id:"page",name:"page",label:"Send Page",value:T,onChange:L,required:!0,type:"number"}),r.a.createElement(k.a,{id:"pageIncrementor",name:"pageIncrementor",label:"Page Increment Factor",value:D,onChange:P,required:!0,type:"number"}),r.a.createElement(k.a,{id:"channelName",name:"channelName",label:"Channel Name(without @)",value:Y,onChange:G,required:!0}),r.a.createElement("div",{style:{paddingBottom:20}},r.a.createElement("input",{type:"checkbox",id:"isNewMdisk",name:"isNewMdisk",checked:ge,onChange:function(){return ve(!ge)}}),r.a.createElement("label",{htmlFor:"isNewMdisk"},"Convert New mdisk links by bot")),r.a.createElement("div",{style:{paddingBottom:20}},r.a.createElement("input",{type:"checkbox",id:"isEuOrgLink",name:"isEuOrgLink",checked:de,onChange:function(){return pe(!de)}}),r.a.createElement("label",{htmlFor:"isEuOrgLink"},"Get mdisk.eu.org links")),r.a.createElement("div",{style:{paddingBottom:W?5:20}},r.a.createElement("input",{type:"checkbox",id:"thumbActive",name:"thumbActive",checked:W,onChange:function(){return Z(!W)}}),r.a.createElement("label",{htmlFor:"thumbActive"},"Add Thumb image to message")),W&&r.a.createElement(k.a,{id:"thumbUrl",name:"thumbUrl",label:"",value:ee,onChange:te}),r.a.createElement("div",{style:{paddingBottom:re?5:20}},r.a.createElement("input",{type:"checkbox",id:"isCustomCname",name:"isCustomCname",checked:re,onChange:function(){return ce(!re)}}),r.a.createElement("label",{htmlFor:"isCustomCname"},"Use Custom cname")),re&&r.a.createElement(k.a,{id:"cname",name:"cname",label:"",value:se,onChange:ie}),ye&&r.a.createElement("div",{style:{color:"red"}},ye),r.a.createElement("div",{className:"d-flex",style:{justifyContent:"space-between"}},r.a.createElement("button",{disabled:ke,className:"btn primary".concat(ke?" loading":""),type:"submit"},c._id?"Update Task":"Insert Task"),c._id&&r.a.createElement("button",{disabled:ke,className:"btn danger",onClick:Object(f.a)(v.a.mark((function e(){var a,n,r;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Oe(!0),e.prev=1,(a={isDeleted:!0})._id=c._id,e.next=6,S.a.post("/api/v1/task/update",a);case 6:n=e.sent,r=n.data,console.log("Delete response==",r),r&&t.push("/task"),Oe(!1),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(1),Oe(!1);case 16:case"end":return e.stop()}}),e,null,[[1,13]])})))},"Delete")))))}var U=a(88),R=a.n(U),Y=a(89),G=a.n(Y),B=function(e){var t=e.bgcolor,a=e.progress,n=e.height,c=e.progressText,l={height:n,borderRadius:n/2},o={width:"".concat(a,"%"),backgroundColor:t,borderRadius:n/2};return r.a.createElement("div",{className:"progress-bar",style:l},r.a.createElement("div",{className:"progress-bar-child",style:o},r.a.createElement("span",{className:"progress-bar-text"},c||"".concat(a,"%"))))},J=function(e){var t=e.botState,a=void 0===t?{}:t,n=a.total,c=void 0===n?0:n,l=a.current,o=void 0===l?0:l,s=a.nextData,i=void 0===s?0:s;return r.a.createElement("div",{className:"bot-state"},R()(a)?r.a.createElement("div",null,"No Active task"):r.a.createElement(r.a.Fragment,null,c?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,"Current Queue"),r.a.createElement(B,{bgcolor:"#ff00ff",progress:G()(Math.trunc(100*o/c),0,100),progressText:"".concat(o,"/").concat(c),height:20})):null,i?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,"Next Queue"),r.a.createElement(B,{bgcolor:"orange",progress:"0",progressText:"".concat(0,"/",i),height:20})," "):null))},K=function(e){for(var t=Math.floor(e.length/10),a=[],n=0;n<=t;n++)a.push(e.slice(10*n,10*(n+1)));return[a,10]},Q=z.reduce((function(e,t){return Object(C.a)(Object(C.a)({},e),{},Object(y.a)({},t.value,t.label))}),{});function V(){var e=Object(n.useState)({}),t=Object(E.a)(e,2),a=t[0],c=t[1],l=Object(u.f)(),o=Object(n.useState)(!1),s=Object(E.a)(o,2),i=s[0],m=s[1],d=Object(n.useState)("Loading..."),p=Object(E.a)(d,2),b=p[0],h=p[1],g=Object(n.useState)({}),k=Object(E.a)(g,2),O=k[0],y=k[1],C=Object(n.useState)([]),N=Object(E.a)(C,2),w=N[0],T=N[1],A=Object(n.useState)({}),_=Object(E.a)(A,2),D=_[0],q=_[1],F=Object(n.useState)({by:"",order:"asc"}),M=Object(E.a)(F,2),z=M[0],P=M[1],U=a.tasks,R=void 0===U?[]:U,Y=Object.keys(D),G=Y.length?R.filter((function(e){return e[Y[0]].includes(D[Y[0]])})):R,B=I()(G,z.by,z.order),V=function(e){var t=z.by===e&&"asc"===z.order?"desc":"asc";P({by:e,order:t})},H=function(){var e=Object(f.a)(v.a.mark((function e(){var t,a,n;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return m(!0),e.next=3,S.a.get("/api/v1/task/list");case 3:t=e.sent,a=t.data,n=void 0===a?{}:a,W(),c(n),m(!1);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),W=function(){var e=Object(f.a)(v.a.mark((function e(){var t,a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S.a.get("/api/v1/task/processStats");case 2:t=e.sent,a=t.data,y(void 0===a?{}:a);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){H(),W()}),[]),r.a.createElement("main",null,r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{className:"d-flex flex-1"},r.a.createElement("h1",null,"Tasks List"),r.a.createElement("button",{style:{marginLeft:20},className:"danger",onClick:H},"Refresh")),!!w.length&&r.a.createElement("button",{disabled:i,onClick:Object(f.a)(v.a.mark((function e(){var t,a,n,r,c,l,o,s,i,u,d;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.prev=0,m(!0),t=B.filter((function(e){return w.includes(e._id)})),a=K(t),n=Object(E.a)(a,2),r=n[0],c=n[1],l=Object(x.a)(r),e.prev=5,l.s();case 7:if((o=l.n()).done){e.next=23;break}return s=o.value,e.prev=9,i=r.indexOf(s),h("Starting bot on ".concat(i*c,"/").concat(t.length)),e.next=14,S.a.post("/api/v1/task/start",s);case 14:u=e.sent,d=u.data,console.log("tasks response===",d),e.next=21;break;case 19:e.prev=19,e.t0=e.catch(9);case 21:e.next=7;break;case 23:e.next=28;break;case 25:e.prev=25,e.t1=e.catch(5),l.e(e.t1);case 28:return e.prev=28,l.f(),e.finish(28);case 31:m(!1),h("Loading..."),H(),e.next=40;break;case 36:e.prev=36,e.t2=e.catch(0),m(!1),H();case 40:case"end":return e.stop()}}),e,null,[[0,36],[5,25,28,31],[9,19]])})))},"Send ".concat(w.length," chats")),r.a.createElement("button",{onClick:function(){return l.push("/task/upsert")}},"Add")),r.a.createElement(J,{botState:O}),r.a.createElement("div",{className:"d-flex align-center",style:{padding:"15px 0px"}},r.a.createElement("div",null,"Filters: "),r.a.createElement("button",{className:L()(D,"linkType","").includes("mdisk")?"":"outline",onClick:function(){T([]),q(L()(D,"linkType","").includes("mdisk")?{}:{linkType:"mdisk"})}},"Mdisk"),r.a.createElement("button",{className:L()(D,"linkType","").includes("dood")?"":"outline",onClick:function(){T([]),q(L()(D,"linkType","").includes("dood")?{}:{linkType:"dood"})}},"Dood"),r.a.createElement("button",{className:L()(D,"status","").includes("processing")?"":"outline",onClick:function(){T([]),q(L()(D,"status","").includes("processing")?{}:{status:"processing"})}},"processing")),r.a.createElement("table",{className:"task"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,r.a.createElement("input",{type:"checkbox",checked:w.length===B.length,onChange:function(e){T(e.target.checked?B.map((function(e){return e._id})):[])}})),r.a.createElement("th",null,"S.No"),r.a.createElement("th",{onClick:function(){return V("groupInfo.title")}},"Group Name"),r.a.createElement("th",{onClick:function(){return V("category")}},"Category"),r.a.createElement("th",{onClick:function(){return V("size")}},"Size"),r.a.createElement("th",{onClick:function(){return V("page")}},"Send Page"),r.a.createElement("th",{onClick:function(){return V("pageIncrementor")}},"Page Incrementor"),r.a.createElement("th",{onClick:function(){return V("channelName")}},"Channel Name"),r.a.createElement("th",{onClick:function(){return V("linkType")}},"link Type"),r.a.createElement("th",{onClick:function(){return V("cname")}},"Cname"),r.a.createElement("th",{onClick:function(){return V("lastExecuted")}},"Last Executed"),r.a.createElement("th",{onClick:function(){return V("status")}},"Status"))),r.a.createElement("tbody",null,B&&B.map((function(e,t){return r.a.createElement("tr",{key:"tassk-".concat(t)},r.a.createElement("td",null,r.a.createElement("input",{type:"checkbox",checked:w.includes(e._id),onChange:function(t){T(t.target.checked?[].concat(Object(j.a)(w),[e._id]):w.filter((function(t){return t!==e._id})))}})),r.a.createElement("td",null,t+1),r.a.createElement("td",null,e.groupInfo.title),r.a.createElement("td",null,Q[e.category]),r.a.createElement("td",null,e.size),r.a.createElement("td",null,e.page),r.a.createElement("td",null,e.pageIncrementor),r.a.createElement("td",null,e.channelName),r.a.createElement("td",null,e.linkType),r.a.createElement("td",null,e.cname),r.a.createElement("td",null,e.lastExecuted&&function(e){var t=new Date(e);return"".concat(t.toLocaleTimeString()," ").concat(t.toLocaleDateString())}(e.lastExecuted)),r.a.createElement("td",null,r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"btn icon-only",onClick:function(){return l.push({pathname:"/task/upsert",state:e})}},"Edit"),r.a.createElement("div",null,"active"===e.status?"":e.status))))})))),i&&r.a.createElement("div",{className:"d-flex loading-box"},r.a.createElement("div",{className:"loading-div"}),r.a.createElement("div",null,b))))}var H=a(90),W=a.n(H);function Z(){var e=Object(n.useState)({}),t=Object(E.a)(e,2),a=t[0],c=t[1],l=Object(n.useState)(!1),o=Object(E.a)(l,2),s=o[0],i=o[1],u=Object(n.useState)([]),m=Object(E.a)(u,2),d=m[0],p=m[1],b=Object(n.useState)(""),h=Object(E.a)(b,2),g=h[0],k=h[1],O=Object(n.useState)("Loading..."),y=Object(E.a)(O,2),C=y[0],N=y[1],w=Object(n.useState)({by:"",order:"asc"}),T=Object(E.a)(w,2),L=T[0],A=T[1],_=a.joinRequests,D=void 0===_?[]:_,q=I()(D,L.by,L.order),F=function(e){var t=L.by===e&&"asc"===L.order?"desc":"asc";A({by:e,order:t})},M=function(){var e=Object(f.a)(v.a.mark((function e(){var t,a,n,r,l;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i(!0),t=parseInt(g),a=W()().add("days",-t),n=g?{created:a.format("YYYY-MM-DD")}:{},e.next=6,S.a.post("/api/v1/chatjoin/all",{action:"list",data:n});case 6:r=e.sent,l=r.data,c((void 0===l?{}:l).data),i(!1);case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),z=function(e){k(e)};Object(n.useEffect)((function(){M()}),[g]);var P=function(){var e=Object(f.a)(v.a.mark((function e(){var t,a,n,r,c,l,o,s,u,m,p,b,h,g=arguments;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=g.length>0&&void 0!==g[0]?g[0]:"/approve",e.prev=1,i(!0),a=q.filter((function(e){return d.includes(e._id)})),n=K(a),r=Object(E.a)(n,2),c=r[0],l=r[1],o=Object(x.a)(c),e.prev=6,o.s();case 8:if((s=o.n()).done){e.next=25;break}return u=s.value,e.prev=10,m=c.indexOf(u),N("Accepting request ".concat(m*l,"/").concat(a.length)),e.next=15,S.a.post("/api/v1/chatjoin".concat(t),{requests:u});case 15:p=e.sent,b=p.data,h=void 0===b?{}:b,console.log("Approve response===",h),e.next=23;break;case 21:e.prev=21,e.t0=e.catch(10);case 23:e.next=8;break;case 25:e.next=30;break;case 27:e.prev=27,e.t1=e.catch(6),o.e(e.t1);case 30:return e.prev=30,o.f(),e.finish(30);case 33:i(!1),N("Loading..."),M(),e.next=42;break;case 38:e.prev=38,e.t2=e.catch(1),i(!1),M();case 42:case"end":return e.stop()}}),e,null,[[1,38],[6,27,30,33],[10,21]])})));return function(){return e.apply(this,arguments)}}();return r.a.createElement("main",null,r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"d-flex"},r.a.createElement("div",{className:"d-flex flex-1"},r.a.createElement("h1",null,"Requests List"),r.a.createElement("button",{style:{marginLeft:20},className:"danger",onClick:M},"Refresh")),!!d.length&&r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{disabled:s,style:{marginRight:5},onClick:function(){return P()}},"Approve ".concat(d.length," requests")),r.a.createElement("button",{disabled:s,onClick:function(){return P("/approveandclear")}},"ApproveClear ".concat(d.length," requests")))),r.a.createElement("div",{className:"d-flex align-center",style:{padding:"15px 0px"}},r.a.createElement("div",null,"Filters: "),r.a.createElement("button",{className:"1DAY"===g?"":"outline",onClick:function(){p([]),z("1DAY"===g?"":"1DAY")}},"1 day ago"),r.a.createElement("button",{className:"2DAY"===g?"":"outline",onClick:function(){p([]),z("2DAY"===g?"":"2DAY")}},"2 day ago")),r.a.createElement("table",{className:"task"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,r.a.createElement("input",{type:"checkbox",checked:d.length===q.length,onChange:function(e){p(e.target.checked?q.map((function(e){return e._id})):[])}})),r.a.createElement("th",null,"S.No"),r.a.createElement("th",{onClick:function(){return F("from.id")}},"User Id"),r.a.createElement("th",{onClick:function(){return F("from.first_name")}},"First Name"),r.a.createElement("th",{onClick:function(){return F("chat.title")}},"Chat"),r.a.createElement("th",{onClick:function(){return F("created")}},"Created"),r.a.createElement("th",{onClick:function(){return F("status")}},"Status"))),r.a.createElement("tbody",null,q&&q.map((function(e,t){return r.a.createElement("tr",{key:"tassk-".concat(t)},r.a.createElement("td",null,r.a.createElement("input",{type:"checkbox",checked:d.includes(e._id),onChange:function(t){p(t.target.checked?[].concat(Object(j.a)(d),[e._id]):d.filter((function(t){return t!==e._id})))}})),r.a.createElement("td",null,t+1),r.a.createElement("td",null,e.from.id),r.a.createElement("td",null,e.from.first_name),r.a.createElement("td",null,e.chat.title),r.a.createElement("td",null,e.created&&function(e){var t=new Date(e);return"".concat(t.toLocaleTimeString()," ").concat(t.toLocaleDateString())}(e.created)),r.a.createElement("td",null,r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{disabled:s,onClick:Object(f.a)(v.a.mark((function t(){var a,n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,i(!0),t.next=4,S.a.post("/api/v1/chatjoin/reject",{requests:[e]});case 4:a=t.sent,n=a.data,r=void 0===n?{}:n,console.log("reject response===",r),i(!1),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),i(!1);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})))},"Reject"),r.a.createElement("button",{className:"btn",disabled:s,onClick:Object(f.a)(v.a.mark((function t(){var a,n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,i(!0),t.next=4,S.a.post("/api/v1/chatjoin/approve",{requests:[e]});case 4:a=t.sent,n=a.data,r=void 0===n?{}:n,console.log("Approve response===",r),i(!1),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),i(!1);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})))},"Approve"))))})))),s&&r.a.createElement("div",{className:"d-flex loading-box"},r.a.createElement("div",{className:"loading-div"}),r.a.createElement("div",null,C))))}var X=function(){return r.a.createElement(i.a,null,r.a.createElement(u.c,null,r.a.createElement(u.a,{exact:!0,path:"/",component:h}),r.a.createElement(u.a,{exact:!0,path:"/search"},r.a.createElement(h,{tab:"search"})),r.a.createElement(u.a,{path:"/drive/:folderId?"},r.a.createElement(h,{tab:"drive"})),r.a.createElement(u.a,{exact:!0,path:"/download"},r.a.createElement(h,{tab:"downloads"})),r.a.createElement(u.a,{exact:!0,path:"/drivehelp",component:O}),r.a.createElement(u.a,{exact:!0,path:"/task",component:V}),r.a.createElement(u.a,{exact:!0,path:"/task/upsert",component:P}),r.a.createElement(u.a,{exact:!0,path:"/requests",component:Z})))};a(210),a(211),a(212);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(s,null),r.a.createElement(X,null)),document.getElementById("root"))},85:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return l}));var n=a(1),r=a(0),c=a.n(r);function l(){var t=!1;e.browser&&(t="true"===localStorage.getItem("nightMode"));var a=Object(r.useState)(t),l=Object(n.a)(a,2),o=l[0],s=l[1];return e.browser&&(o?(document.body.classList.add("dark"),localStorage.setItem("nightMode",!0)):(document.body.classList.remove("dark"),localStorage.setItem("nightMode",!1))),c.a.createElement("button",{className:"btn mv-auto sm neutral",onClick:function(){return s(!o)}},c.a.createElement("span",{className:"bnt-icon"},c.a.createElement("ion-icon",{name:"moon"})))}}).call(this,a(56))},9:function(e,t,a){"use strict";var n=a(36),r=a(0),c=a.n(r),l=["label","labelProps","wrapperClass","onChange","id"];function o(e){var t=e.label,a=(e.labelProps,e.wrapperClass),r=e.onChange,o=e.id,s=Object(n.a)(e,l);return c.a.createElement("div",{className:"form-group ".concat(a||"")},c.a.createElement("label",{htmlFor:o},t),c.a.createElement("input",Object.assign({className:"form-control",id:o,onChange:function(e){return r(e.target.value)}},s)))}o.defaultProps={type:"text",onChange:function(e){return console.log("Value: ",e)}},t.a=o},91:function(e,t,a){e.exports=a(213)}},[[91,2,3]]]);
//# sourceMappingURL=main.22e3384f.chunk.js.map