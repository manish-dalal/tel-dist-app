(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[4],{217:function(e,a,t){"use strict";t.r(a);var n=t(2),r=t.n(n),c=t(6),l=t(1),s=t(0),i=t.n(s),o=t(214),d=t(9);var m=function(e){var a=e.torrent,t=Object(s.useState)(!1),n=Object(l.a)(t,2),r=n[0],c=n[1];return i.a.createElement("div",{className:"card",style:{opacity:r?.75:1}},i.a.createElement("div",{className:"card-header compact d-flex space-between"},i.a.createElement("h3",{style:{lineBreak:"anywhere",marginRight:"8px"}},a.name),i.a.createElement("div",{className:"text-400 text-primary"},a.done?"Done":"".concat(a.redableTimeRemaining," (").concat(a.progress,"%)"))),100!==a.progress&&i.a.createElement("div",{style:{height:"4px",width:"".concat(a.progress,"%"),backgroundColor:"var(--primary)"}}),i.a.createElement("div",{className:"card-body compact"},i.a.createElement("div",{className:"d-flex space-between"},i.a.createElement("div",{className:"text-400"},"Status: "),i.a.createElement("div",null,a.status)),i.a.createElement("div",{className:"d-flex space-between"},i.a.createElement("div",{className:"text-400"},"Size: "),i.a.createElement("div",null,a.total)),i.a.createElement("div",{className:"d-flex space-between"},i.a.createElement("div",{className:"text-400"},"Downloaded: "),i.a.createElement("div",null,a.downloaded)),i.a.createElement("div",{className:"d-flex space-between"},i.a.createElement("div",{className:"text-400"},"Speed: "),i.a.createElement("div",null,a.speed)),!a.done&&i.a.createElement("button",{disabled:r,className:"btn danger",onClick:function(){c(!0);try{fetch("/api/v1/torrent/remove?link=".concat(a.magnetURI))}catch(e){console.log(e)}}},"Stop"),a.done&&i.a.createElement("a",{href:a.downloadLink,className:"btn success"},"Open")))};a.default=function(){var e=Object(o.a)("/api/v1/torrent/list",(function(){return fetch.apply(void 0,arguments).then((function(e){return e.json()}))}),{refreshInterval:3500}),a=e.data,t=e.error,n=Object(s.useState)(""),u=Object(l.a)(n,2),p=u[0],b=u[1],v=Object(s.useState)(!1),f=Object(l.a)(v,2),E=f[0],h=f[1],x=Object(s.useState)(""),g=Object(l.a)(x,2),k=g[0],w=g[1],N=function(){var e=Object(c.a)(r.a.mark((function e(a){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a&&a.preventDefault(),h(!0),0===p.indexOf("magnet:")){e.next=6;break}w("Link is not a magnet link"),e.next=11;break;case 6:return w(""),e.next=9,fetch("/api/v1/torrent/download?link=".concat(p));case 9:200===e.sent.status?b(""):w("An error occured");case 11:h(!1);case 12:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return i.a.createElement(i.a.Fragment,null,i.a.createElement("h1",null,"Downloads"),i.a.createElement("form",{onSubmit:N},i.a.createElement(d.a,{id:"link",name:"link",label:"Magnet Link",placeholder:"magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10",value:p,onChange:b,required:!0}),""!==k&&i.a.createElement("div",{className:"text-danger"},k),i.a.createElement("button",{disabled:E,className:"btn primary".concat(E?" loading":""),type:"submit"},"Add")),t&&i.a.createElement("div",{className:"text-danger mt-1"},"An error occured. Check your internet."),a&&i.a.createElement("div",{className:"d-flex-column mt-1"},a.torrents.map((function(e){return i.a.createElement(m,{torrent:e,key:e.magnetURI})}))))}}}]);
//# sourceMappingURL=4.46b3e5cd.chunk.js.map