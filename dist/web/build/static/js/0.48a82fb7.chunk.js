(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[0],{206:function(e,t,r){"use strict";var n=r(0),i=r(207),o=r.n(i);function a(){return"undefined"===typeof document||"undefined"===typeof document.visibilityState||"hidden"!==document.visibilityState}function u(){return"undefined"===typeof navigator.onLine||navigator.onLine}var c=new WeakMap,s=0;var f=new(function(){function e(e){void 0===e&&(e={}),this.__cache=new Map(Object.entries(e)),this.__listeners=[]}return e.prototype.get=function(e){var t=this.serializeKey(e)[0];return this.__cache.get(t)},e.prototype.set=function(e,t,r){void 0===r&&(r=!0);var n=this.serializeKey(e)[0];this.__cache.set(n,t),r&&I(e,t,!1),this.notify()},e.prototype.keys=function(){return Array.from(this.__cache.keys())},e.prototype.has=function(e){var t=this.serializeKey(e)[0];return this.__cache.has(t)},e.prototype.clear=function(e){void 0===e&&(e=!0),e&&this.__cache.forEach((function(e){return I(e,null,!1)})),this.__cache.clear(),this.notify()},e.prototype.delete=function(e,t){void 0===t&&(t=!0);var r=this.serializeKey(e)[0];t&&I(e,null,!1),this.__cache.delete(r),this.notify()},e.prototype.serializeKey=function(e){var t=null;if("function"===typeof e)try{e=e()}catch(r){e=""}return Array.isArray(e)?(t=e,e=function(e){if(!e.length)return"";for(var t="arg",r=0;r<e.length;++r){var n=void 0;null===e[r]||"object"!==typeof e[r]?n="string"===typeof e[r]?'"'+e[r]+'"':String(e[r]):c.has(e[r])?n=c.get(e[r]):(n=s,c.set(e[r],s++)),t+="@"+n}return t}(e)):e=String(e||""),[e,t,e?"err@"+e:""]},e.prototype.subscribe=function(e){var t=this;if("function"!==typeof e)throw new Error("Expected the listener to be a function.");var r=!0;return this.__listeners.push(e),function(){if(r){r=!1;var n=t.__listeners.indexOf(e);n>-1&&(t.__listeners[n]=t.__listeners[t.__listeners.length-1],t.__listeners.length--)}}},e.prototype.notify=function(){for(var e=0,t=this.__listeners;e<t.length;e++){(0,t[e])()}},e}()),l={},d={},v={},h={},p={};var y="undefined"!==typeof window&&navigator.connection&&-1!==["slow-2g","2g"].indexOf(navigator.connection.effectiveType),g={onLoadingSlow:function(){},onSuccess:function(){},onError:function(){},onErrorRetry:function(e,t,r,n,i){if(a()&&!(r.errorRetryCount&&i.retryCount>r.errorRetryCount)){var o=Math.min(i.retryCount||0,8),u=~~((Math.random()+.5)*(1<<o))*r.errorRetryInterval;setTimeout(n,u,i)}},errorRetryInterval:1e3*(y?10:5),focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:1e3*(y?5:3),refreshInterval:0,revalidateOnFocus:!0,revalidateOnReconnect:!0,refreshWhenHidden:!1,refreshWhenOffline:!1,shouldRetryOnError:!0,suspense:!1,compare:o.a},b=!1;if("undefined"!==typeof window&&window.addEventListener&&!b){var w=function(){if(a()&&u())for(var e in v)v[e][0]&&v[e][0]()};window.addEventListener("visibilitychange",w,!1),window.addEventListener("focus",w,!1),b=!0}var m=g;function O(e,t){var r=!1;return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];r||(r=!0,e.apply(void 0,n),setTimeout((function(){return r=!1}),t))}}var _=Object(n.createContext)({});_.displayName="SWRConfigContext";var j=_,E=function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function a(e){try{c(n.next(e))}catch(t){o(t)}}function u(e){try{c(n.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,u)}c((n=n.apply(e,t||[])).next())}))},R=function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"===typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(u){o=[6,u],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},x="undefined"===typeof window,T=x?n.useEffect:n.useLayoutEffect,k=function(e,t){void 0===t&&(t=!0);var r=f.serializeKey(e),n=r[0],i=r[2];if(!n)return Promise.resolve();var o=h[n];if(n&&o){for(var a=f.get(n),u=f.get(i),c=[],s=0;s<o.length;++s)c.push(o[s](t,a,u,s>0));return Promise.all(c).then((function(){return f.get(n)}))}return Promise.resolve(f.get(n))},C=function(e,t,r){var n=h[e];if(e&&n)for(var i=0;i<n.length;++i)n[i](!1,t,r)},I=function(e,t,r){return void 0===r&&(r=!0),E(void 0,void 0,void 0,(function(){var n,i,o,a,u,c,s,l,v,y;return R(this,(function(g){switch(g.label){case 0:if(!(n=f.serializeKey(e)[0]))return[2];if("undefined"===typeof t)return[2,k(e,r)];if(p[n]=Date.now()-1,a=p[n],u=d[n],!t||"function"!==typeof t)return[3,5];g.label=1;case 1:return g.trys.push([1,3,,4]),[4,t(f.get(n))];case 2:return i=g.sent(),[3,4];case 3:return c=g.sent(),o=c,[3,4];case 4:return[3,11];case 5:if(!t||"function"!==typeof t.then)return[3,10];g.label=6;case 6:return g.trys.push([6,8,,9]),[4,t];case 7:return i=g.sent(),[3,9];case 8:return s=g.sent(),o=s,[3,9];case 9:return[3,11];case 10:i=t,g.label=11;case 11:if(a!==p[n]||u!==d[n]){if(o)throw o;return[2,i]}if("undefined"!==typeof i&&f.set(n,i,!1),l=h[n]){for(v=[],y=0;y<l.length;++y)v.push(l[y](!!r,i,o,y>0));return[2,Promise.all(v).then((function(){return f.get(n)}))]}if(o)throw o;return[2,i]}}))}))};j.Provider;var S=function(){for(var e=this,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];var i,o,c={};t.length>=1&&(i=t[0]),t.length>2?(o=t[1],c=t[2]):"function"===typeof t[1]?o=t[1]:"object"===typeof t[1]&&(c=t[1]);var s=f.serializeKey(i),y=s[0],g=s[1],b=s[2];c=Object.assign({},m,Object(n.useContext)(j),c),"undefined"===typeof o&&(o=c.fetcher);var w=f.get(y)||c.initialData,_=f.get(b),k=Object(n.useRef)({data:!1,error:!1,isValidating:!1}),S=Object(n.useRef)({data:w,error:_,isValidating:!1}),L=Object(n.useState)(null)[1],V=Object(n.useCallback)((function(e){var t=!1;for(var r in e)S.current[r]=e[r],k.current[r]&&(t=!0);(t||c.suspense)&&L({})}),[]),z=Object(n.useRef)(!1),D=Object(n.useRef)(y),K=Object(n.useRef)({emit:function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];z.current||c[e].apply(c,t)}}),M=Object(n.useCallback)((function(e,t){return I(y,e,t)}),[y]),P=Object(n.useCallback)((function(t){return void 0===t&&(t={}),E(e,void 0,void 0,(function(){var e,r,n,i,a,u,s;return R(this,(function(v){switch(v.label){case 0:if(!y||!o)return[2,!1];if(z.current)return[2,!1];t=Object.assign({dedupe:!1},t),e=!0,r="undefined"!==typeof l[y]&&t.dedupe,v.label=1;case 1:return v.trys.push([1,6,,7]),V({isValidating:!0}),n=void 0,i=void 0,r?(i=d[y],[4,l[y]]):[3,3];case 2:return n=v.sent(),[3,5];case 3:return l[y]&&(p[y]=Date.now()-1),c.loadingTimeout&&!f.get(y)&&setTimeout((function(){e&&K.current.emit("onLoadingSlow",y,c)}),c.loadingTimeout),l[y]=null!==g?o.apply(void 0,g):o(y),d[y]=i=Date.now(),[4,l[y]];case 4:n=v.sent(),setTimeout((function(){delete l[y],delete d[y]}),c.dedupingInterval),K.current.emit("onSuccess",n,y,c),v.label=5;case 5:return p[y]&&i<=p[y]?(V({isValidating:!1}),[2,!1]):(f.set(y,n,!1),f.set(b,void 0,!1),a={isValidating:!1},"undefined"!==typeof S.current.error&&(a.error=void 0),c.compare(S.current.data,n)||(a.data=n),V(a),r||C(y,n,void 0),[3,7]);case 6:return u=v.sent(),delete l[y],delete d[y],f.set(b,u,!1),S.current.error!==u&&(V({isValidating:!1,error:u}),r||C(y,void 0,u)),K.current.emit("onError",u,y,c),c.shouldRetryOnError&&(s=(t.retryCount||0)+1,K.current.emit("onErrorRetry",u,y,c,P,Object.assign({dedupe:!0},t,{retryCount:s}))),[3,7];case 7:return e=!1,[2,!0]}}))}))}),[y]);if(T((function(){if(y){z.current=!1;var e=S.current.data,t=f.get(y)||c.initialData;D.current===y&&c.compare(e,t)||(V({data:t}),D.current=y);var r,n=function(){return P({dedupe:!0})};(c.revalidateOnMount||!c.initialData&&void 0===c.revalidateOnMount)&&("undefined"!==typeof t&&!x&&window.requestIdleCallback?window.requestIdleCallback(n):n()),c.revalidateOnFocus&&(r=O(n,c.focusThrottleInterval),v[y]?v[y].push(r):v[y]=[r]);var i=function(e,t,r,i){void 0===e&&(e=!0),void 0===i&&(i=!0);var o={},a=!1;return"undefined"===typeof t||c.compare(S.current.data,t)||(o.data=t,a=!0),S.current.error!==r&&(o.error=r,a=!0),a&&V(o),!!e&&(i?n():P())};h[y]?h[y].push(i):h[y]=[i];var o=null;return!x&&window.addEventListener&&c.revalidateOnReconnect&&window.addEventListener("online",o=n),function(){var e,t;(V=function(){return null},z.current=!0,r&&v[y])&&((t=(e=v[y]).indexOf(r))>=0&&(e[t]=e[e.length-1],e.pop()));h[y]&&((t=(e=h[y]).indexOf(i))>=0&&(e[t]=e[e.length-1],e.pop()));!x&&window.removeEventListener&&null!==o&&window.removeEventListener("online",o)}}}),[y,P]),T((function(){var t=null;return c.refreshInterval&&(t=setTimeout((function r(){return E(e,void 0,void 0,(function(){return R(this,(function(e){switch(e.label){case 0:return S.current.error||!c.refreshWhenHidden&&!a()||!c.refreshWhenOffline&&!u()?[3,2]:[4,P({dedupe:!0})];case 1:e.sent(),e.label=2;case 2:return c.refreshInterval&&(t=setTimeout(r,c.refreshInterval)),[2]}}))}))}),c.refreshInterval)),function(){t&&clearTimeout(t)}}),[c.refreshInterval,c.refreshWhenHidden,c.refreshWhenOffline,P]),c.suspense){var W=f.get(y)||w,A=f.get(b)||_;if("undefined"===typeof W&&"undefined"===typeof A){if(l[y]||P(),l[y]&&"function"===typeof l[y].then)throw l[y];W=l[y]}if("undefined"===typeof W&&A)throw A;return{error:A,data:W,revalidate:P,mutate:M,isValidating:S.current.isValidating}}return Object(n.useMemo)((function(){var e={revalidate:P,mutate:M};return Object.defineProperties(e,{error:{get:function(){return k.current.error=!0,D.current===y?S.current.error:_},enumerable:!0},data:{get:function(){return k.current.data=!0,D.current===y?S.current.data:w},enumerable:!0},isValidating:{get:function(){return k.current.isValidating=!0,S.current.isValidating},enumerable:!0}}),e}),[P])};new Map;t.a=S},207:function(e,t,r){"use strict";var n=Array.isArray,i=Object.keys,o=Object.prototype.hasOwnProperty;e.exports=function e(t,r){if(t===r)return!0;if(t&&r&&"object"==typeof t&&"object"==typeof r){var a,u,c,s=n(t),f=n(r);if(s&&f){if((u=t.length)!=r.length)return!1;for(a=u;0!==a--;)if(!e(t[a],r[a]))return!1;return!0}if(s!=f)return!1;var l=t instanceof Date,d=r instanceof Date;if(l!=d)return!1;if(l&&d)return t.getTime()==r.getTime();var v=t instanceof RegExp,h=r instanceof RegExp;if(v!=h)return!1;if(v&&h)return t.toString()==r.toString();var p=i(t);if((u=p.length)!==i(r).length)return!1;for(a=u;0!==a--;)if(!o.call(r,p[a]))return!1;for(a=u;0!==a--;)if(!e(t[c=p[a]],r[c]))return!1;return!0}return t!==t&&r!==r}}}]);
//# sourceMappingURL=0.48a82fb7.chunk.js.map