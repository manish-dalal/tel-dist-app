(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[6],{209:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),c=a(6),s=a(1),l=a(0),o=a.n(l),i=a(8),m=a(32),u=["label","labelProps","wrapperClass","onChange","id","options"];function d(e){var t=e.label,a=e.labelProps,n=e.wrapperClass,r=e.onChange,c=e.id,s=e.options,l=Object(m.a)(e,u);return o.a.createElement("div",{className:"form-group".concat(n?" ".concat(n):"")},o.a.createElement("label",Object.assign({htmlFor:c},a),t),o.a.createElement("select",Object.assign({className:"form-control",id:c,onChange:function(e){return r(e.target.value)}},l),o.a.createElement("option",null,"Select one"),s&&s.map((function(e){return o.a.createElement("option",{value:e.value,key:e.value},e.name)}))))}d.defaultProps={onChange:function(e){return console.log("Value: ",e)}};var p=d,b=a(47);var v=function(e){var t=e.result,a=e.site,n=e.api,i=Object(l.useState)(!1),m=Object(s.a)(i,2),u=m[0],d=m[1],p=Object(l.useState)({}),v=Object(s.a)(p,2),f=v[0],h=v[1],E=function(){var e=Object(c.a)(r.a.mark((function e(){var c,s;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return d(!0),e.next=3,fetch(n+"api/v1/details/"+a+"?query="+t.link);case 3:if(200===(c=e.sent).status){e.next=8;break}h({error:!0,errorMessage:"Cannot connect to site"}),e.next=12;break;case 8:return e.next=10,c.json();case 10:s=e.sent,h(Object(b.a)({},s));case 12:d(!1);case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("h2",null,t.name),o.a.createElement("div",{className:"text-primary text-400"},"Seeds: ",t.seeds),o.a.createElement("div",{className:"text-400"},t.details),!f.torrent&&o.a.createElement("button",{onClick:E,disabled:u,className:"btn primary".concat(u?" loading":"")},"Load details"),f.error&&o.a.createElement("div",{className:"text-danger"},f.errorMessage),f.torrent&&o.a.createElement("div",{className:"mt-1"},f.torrent.details.map((function(e,t){var a=e.infoText,n=e.infoTitle;return o.a.createElement("div",{className:"d-flex space-between",key:t},o.a.createElement("div",{className:"text-400"},n),o.a.createElement("div",{className:"text-300"},a))})),o.a.createElement("a",{href:f.torrent.downloadLink,className:"btn warning m-0 mt-1"},"Download"),o.a.createElement("button",{onClick:function(){var e=f.torrent.downloadLink,t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)},className:"btn primary m-0 ml-1 mt-1"},"Copy link"))))};function f(e){var t=e.api,a=Object(l.useState)(""),n=Object(s.a)(a,2),m=n[0],u=n[1],d=Object(l.useState)(""),b=Object(s.a)(d,2),f=b[0],h=b[1],E=Object(l.useState)(!1),x=Object(s.a)(E,2),g=x[0],y=x[1],j=Object(l.useState)({}),k=Object(s.a)(j,2),O=k[0],N=k[1],C=function(){var e=Object(c.a)(r.a.mark((function e(a){var n,c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a&&a.preventDefault(),y(!0),""===m){e.next=14;break}return e.next=5,fetch(t+"api/v1/search/"+f+"?query="+m);case 5:if(200===(n=e.sent).status){e.next=10;break}N({error:!0,errorMessage:"Cannot connect to site"}),e.next=14;break;case 10:return e.next=12,n.json();case 12:c=e.sent,N(c);case 14:y(!1);case 15:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,"Search"),o.a.createElement("form",{onSubmit:C},o.a.createElement(p,{id:"site",name:"site",label:"Select site",value:f,onChange:h,options:[{name:"1337x",value:"1337x"},{name:"Limetorrents",value:"limetorrent"},{name:"Piratebay",value:"piratebay"}],required:!0}),o.a.createElement(i.a,{id:"term",name:"term",label:"Search Term",placeholder:"The forgotten army, Flames...",value:m,onChange:u,required:!0}),o.a.createElement("button",{disabled:g||!f,className:"btn primary".concat(g?" loading":""),type:"submit"},"Search")),o.a.createElement("div",{className:"d-flex-column mv-1"},O.error&&o.a.createElement("div",{className:"text-danger"},O.errorMessage),O.results&&O.results.length>0&&O.results.map((function(e){return o.a.createElement(v,{api:t,site:f,result:e,key:e.link})}))))}f.defaultProps={api:"https://torrent-aio-bot.herokuapp.com/"};t.default=f}}]);
//# sourceMappingURL=6.8b89bd25.chunk.js.map