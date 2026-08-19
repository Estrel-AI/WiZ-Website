(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5329,(e,t,a)=>{e.e,t.exports=function(){var e=[function(e,t,a){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e},r=(s(a(1)),a(6)),n=s(r),o=s(a(7)),l=s(a(8)),d=s(a(9)),c=s(a(10)),m=s(a(11)),f=s(a(14)),p=[],x=!1,u={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},b=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e&&(x=!0),x)return p=(0,m.default)(p,u),(0,c.default)(p,u.once),p},h=function(){p=(0,f.default)(),b()},g=function(){p.forEach(function(e,t){e.node.removeAttribute("data-aos"),e.node.removeAttribute("data-aos-easing"),e.node.removeAttribute("data-aos-duration"),e.node.removeAttribute("data-aos-delay")})};e.exports={init:function(e){u=i(u,e),p=(0,f.default)();var t,a=document.all&&!window.atob;return!0===(t=u.disable)||"mobile"===t&&d.default.mobile()||"phone"===t&&d.default.phone()||"tablet"===t&&d.default.tablet()||"function"==typeof t&&!0===t()||a?g():(u.disableMutationObserver||l.default.isSupported()||(console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '),u.disableMutationObserver=!0),document.querySelector("body").setAttribute("data-aos-easing",u.easing),document.querySelector("body").setAttribute("data-aos-duration",u.duration),document.querySelector("body").setAttribute("data-aos-delay",u.delay),"DOMContentLoaded"===u.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?b(!0):"load"===u.startEvent?window.addEventListener(u.startEvent,function(){b(!0)}):document.addEventListener(u.startEvent,function(){b(!0)}),window.addEventListener("resize",(0,o.default)(b,u.debounceDelay,!0)),window.addEventListener("orientationchange",(0,o.default)(b,u.debounceDelay,!0)),window.addEventListener("scroll",(0,n.default)(function(){(0,c.default)(p,u.once)},u.throttleDelay)),u.disableMutationObserver||l.default.ready("[data-aos]",h),p)},refresh:b,refreshHard:h}},function(e,t){},,,,,function(e,t){(function(t){"use strict";function a(e){var t=void 0===e?"undefined":i(e);return!!e&&("object"==t||"function"==t)}function s(e){if("number"==typeof e)return e;if("symbol"==(void 0===(t=e)?"undefined":i(t))||t&&"object"==(void 0===t?"undefined":i(t))&&b.call(t)==o)return n;if(a(e)){var t,s="function"==typeof e.valueOf?e.valueOf():e;e=a(s)?s+"":s}if("string"!=typeof e)return 0===e?e:+e;var r=c.test(e=e.replace(l,""));return r||m.test(e)?f(e.slice(2),r?2:8):d.test(e)?n:+e}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r="Expected a function",n=NaN,o="[object Symbol]",l=/^\s+|\s+$/g,d=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,m=/^0o[0-7]+$/i,f=parseInt,p="object"==(void 0===t?"undefined":i(t))&&t&&t.Object===Object&&t,x="object"==("u"<typeof self?"undefined":i(self))&&self&&self.Object===Object&&self,u=p||x||Function("return this")(),b=Object.prototype.toString,h=Math.max,g=Math.min,v=function(){return u.Date.now()};e.exports=function(e,t,i){var n=!0,o=!0;if("function"!=typeof e)throw TypeError(r);return a(i)&&(n="leading"in i?!!i.leading:n,o="trailing"in i?!!i.trailing:o),function(e,t,i){function n(t){var a=m,s=f;return m=f=void 0,w=t,x=e.apply(s,a)}function o(e){var a=e-b,s=e-w;return void 0===b||a>=t||a<0||j&&s>=p}function l(){var e,a,s,i=v();return o(i)?d(i):void(u=setTimeout(l,(e=i-b,a=i-w,s=t-e,j?g(s,p-a):s)))}function d(e){return u=void 0,k&&m?n(e):(m=f=void 0,x)}function c(){var e,a=v(),s=o(a);if(m=arguments,f=this,b=a,s){if(void 0===u)return w=e=b,u=setTimeout(l,t),y?n(e):x;if(j)return u=setTimeout(l,t),n(b)}return void 0===u&&(u=setTimeout(l,t)),x}var m,f,p,x,u,b,w=0,y=!1,j=!1,k=!0;if("function"!=typeof e)throw TypeError(r);return t=s(t)||0,a(i)&&(y=!!i.leading,p=(j="maxWait"in i)?h(s(i.maxWait)||0,t):p,k="trailing"in i?!!i.trailing:k),c.cancel=function(){void 0!==u&&clearTimeout(u),w=0,m=b=f=u=void 0},c.flush=function(){return void 0===u?x:d(v())},c}(e,t,{leading:n,maxWait:t,trailing:o})}}).call(t,function(){return this}())},function(e,t){(function(t){"use strict";function a(e){var t=void 0===e?"undefined":i(e);return!!e&&("object"==t||"function"==t)}function s(e){if("number"==typeof e)return e;if("symbol"==(void 0===(t=e)?"undefined":i(t))||t&&"object"==(void 0===t?"undefined":i(t))&&u.call(t)==n)return r;if(a(e)){var t,s="function"==typeof e.valueOf?e.valueOf():e;e=a(s)?s+"":s}if("string"!=typeof e)return 0===e?e:+e;var f=d.test(e=e.replace(o,""));return f||c.test(e)?m(e.slice(2),f?2:8):l.test(e)?r:+e}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=NaN,n="[object Symbol]",o=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,d=/^0b[01]+$/i,c=/^0o[0-7]+$/i,m=parseInt,f="object"==(void 0===t?"undefined":i(t))&&t&&t.Object===Object&&t,p="object"==("u"<typeof self?"undefined":i(self))&&self&&self.Object===Object&&self,x=f||p||Function("return this")(),u=Object.prototype.toString,b=Math.max,h=Math.min,g=function(){return x.Date.now()};e.exports=function(e,t,i){function r(t){var a=c,s=m;return c=m=void 0,v=t,p=e.apply(s,a)}function n(e){var a=e-u,s=e-v;return void 0===u||a>=t||a<0||y&&s>=f}function o(){var e,a,s,i=g();return n(i)?l(i):void(x=setTimeout(o,(e=i-u,a=i-v,s=t-e,y?h(s,f-a):s)))}function l(e){return x=void 0,j&&c?r(e):(c=m=void 0,p)}function d(){var e,a=g(),s=n(a);if(c=arguments,m=this,u=a,s){if(void 0===x)return v=e=u,x=setTimeout(o,t),w?r(e):p;if(y)return x=setTimeout(o,t),r(u)}return void 0===x&&(x=setTimeout(o,t)),p}var c,m,f,p,x,u,v=0,w=!1,y=!1,j=!0;if("function"!=typeof e)throw TypeError("Expected a function");return t=s(t)||0,a(i)&&(w=!!i.leading,f=(y="maxWait"in i)?b(s(i.maxWait)||0,t):f,j="trailing"in i?!!i.trailing:j),d.cancel=function(){void 0!==x&&clearTimeout(x),v=0,c=u=m=x=void 0},d.flush=function(){return void 0===x?p:l(g())},d}}).call(t,function(){return this}())},function(e,t){"use strict";function a(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function s(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),a=Array.prototype.slice.call(e.removedNodes);if(function e(t){var a=void 0,s=void 0;for(a=0;a<t.length;a+=1)if((s=t[a]).dataset&&s.dataset.aos||s.children&&e(s.children))return!0;return!1}(t.concat(a)))return i()})}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){};t.default={isSupported:function(){return!!a()},ready:function(e,t){var r=window.document,n=new(a())(s);i=t,n.observe(r.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}}},function(e,t){"use strict";function a(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var a=0;a<t.length;a++){var s=t[a];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,a,s){return a&&e(t.prototype,a),s&&e(t,s),t}}(),i=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,r=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,n=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,o=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;t.default=new(function(){function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function")}return s(e,[{key:"phone",value:function(){var e=a();return!(!i.test(e)&&!r.test(e.substr(0,4)))}},{key:"mobile",value:function(){var e=a();return!(!n.test(e)&&!o.test(e.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}())},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(e,t,a){var s=e.node.getAttribute("data-aos-once");t>e.position?e.node.classList.add("aos-animate"):void 0===s||"false"!==s&&(a||"true"===s)||e.node.classList.remove("aos-animate")};t.default=function(e,t){var s=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,r){a(e,i+s,t)})}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,i=(s=a(12))&&s.__esModule?s:{default:s};t.default=function(e,t){return e.forEach(function(e,a){e.node.classList.add("aos-init"),e.position=(0,i.default)(e.node,t.offset)}),e}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,i=(s=a(13))&&s.__esModule?s:{default:s};t.default=function(e,t){var a=0,s=0,r=window.innerHeight,n={offset:e.getAttribute("data-aos-offset"),anchor:e.getAttribute("data-aos-anchor"),anchorPlacement:e.getAttribute("data-aos-anchor-placement")};switch(n.offset&&!isNaN(n.offset)&&(s=parseInt(n.offset)),n.anchor&&document.querySelectorAll(n.anchor)&&(e=document.querySelectorAll(n.anchor)[0]),a=(0,i.default)(e).top,n.anchorPlacement){case"top-bottom":break;case"center-bottom":a+=e.offsetHeight/2;break;case"bottom-bottom":a+=e.offsetHeight;break;case"top-center":a+=r/2;break;case"bottom-center":a+=r/2+e.offsetHeight;break;case"center-center":a+=r/2+e.offsetHeight/2;break;case"top-top":a+=r;break;case"bottom-top":a+=e.offsetHeight+r;break;case"center-top":a+=e.offsetHeight/2+r}return n.anchorPlacement||n.offset||isNaN(t)||(s=t),a+s}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){for(var t=0,a=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),a+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:a,left:t}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e=e||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(e,function(e){return{node:e}})}}];function t(s){if(a[s])return a[s].exports;var i=a[s]={exports:{},id:s,loaded:!1};return e[s].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var a={};return t.m=e,t.c=a,t.p="dist/",t(0)}()},6412,e=>{"use strict";var t=e.i(43476),a=e.i(37902),s=e.i(57688),i=e.i(22016);let r=String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>IT Ops Correlation Assistant</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <style>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      html,
      body {
        width: 100%;
        height: 100%;
        background: #5b1436;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        font-family: "Inter", sans-serif;
      }
      .shell {
        width: min(420px, 100%);
        height: min(680px, 100%);
        min-height: 0;
        background: #14070e;
        border-radius: 16px;
        border: 1px solid rgba(255, 143, 194, 0.24);
        box-shadow:
          0 0 60px rgba(255, 143, 194, 0.12),
          0 40px 100px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .topbar {
        background: #2a1722;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
      }
      .top-inner {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .top-icon {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: linear-gradient(135deg, #912059, #d87aaa);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .top-labels {
        flex: 1;
      }
      .top-title {
        font-size: 13.5px;
        font-weight: 600;
        color: #fff5d6;
      }
      .top-sub {
        font-size: 10px;
        color: #b9a7b0;
        margin-top: 2px;
      }
      .top-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
      }
      .live-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #25101b;
        border: 0.5px solid rgba(255, 143, 194, 0.25);
        border-radius: 20px;
        padding: 3px 8px;
      }
      .ldot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ff8fc2;
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.3;
        }
      }
      .ltext {
        font-size: 9px;
        font-weight: 600;
        color: #ffb7d8;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
      .icnt {
        font-size: 9px;
        color: #8b7a84;
        font-family: "JetBrains Mono", monospace;
      }
      .chat {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
      }
      .chat::-webkit-scrollbar {
        display: none;
      }
      .ci {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 16px 8px;
        width: 100%;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .row.bot {
        align-items: flex-start;
      }
      .row.usr {
        align-items: flex-end;
      }
      .lp {
        font-size: 9.5px;
        font-weight: 600;
        letter-spacing: 0.5px;
        padding: 2px 7px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .lp.bl {
        background: #271920;
        color: #ffb7d8;
        border: 0.5px solid rgba(255, 255, 255, 0.1);
      }
      .lp.ul {
        background: #271920;
        color: #b9a7b0;
        border: 0.5px solid rgba(255, 255, 255, 0.1);
      }
      .bub {
        border-radius: 4px 13px 13px 13px;
        padding: 11px 13px;
        font-size: 12.5px;
        line-height: 1.65;
        max-width: 92%;
        overflow-wrap: anywhere;
      }
      .bb {
        background: #fffefe;
        border: 0.5px solid rgba(255, 255, 255, 0.8);
        color: #32242c;
        opacity: 0;
        transform: translateY(5px);
        transition:
          opacity 0.35s,
          transform 0.35s;
      }
      .bb.vis {
        opacity: 1;
        transform: translateY(0);
      }
      .ub {
        background: #271920;
        border: 0.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 13px 4px 13px 13px;
        color: #eee1e7;
        opacity: 0;
        transform: translateY(5px) scale(0.98);
        transition:
          opacity 0.3s,
          transform 0.3s;
      }
      .ub.vis {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .hb {
        color: #ff8fc2;
        font-weight: 500;
      }
      .hr {
        color: #ff7aa8;
        font-weight: 500;
      }
      .ha {
        color: #fff5d6;
        font-weight: 500;
      }
      .hg {
        color: #d87aaa;
        font-weight: 500;
      }
      .hm {
        font-family: "JetBrains Mono", monospace;
        font-size: 10.5px;
        color: #ffb7d8;
        background: #25101b;
        padding: 1px 5px;
        border-radius: 3px;
      }
      .thk {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 0 4px;
      }
      .thk span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ff8fc2;
        animation: td 1.2s ease-in-out infinite;
      }
      .thk span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .thk span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes td {
        0%,
        80%,
        100% {
          transform: scale(0.5);
          opacity: 0.3;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .chips {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 6px;
        opacity: 0;
        transform: translateY(3px);
        transition:
          opacity 0.4s,
          transform 0.4s;
      }
      .chips.show {
        opacity: 1;
        transform: translateY(0);
      }
      .chip {
        background: #25101b;
        border: 0.5px solid rgba(255, 143, 194, 0.24);
        border-radius: 7px;
        padding: 7px 10px;
        font-size: 10.5px;
        color: #ffb7d8;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .chip::before {
        content: "";
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #ff8fc2;
        flex-shrink: 0;
      }
      .mrow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
        margin-top: 9px;
        opacity: 0;
        transform: translateY(4px);
        transition:
          opacity 0.4s,
          transform 0.4s;
      }
      .mrow.show {
        opacity: 1;
        transform: translateY(0);
      }
      .mc {
        background: #1d0c14;
        border: 0.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 9px;
      }
      .mcl {
        font-size: 8.5px;
        color: #8b7a84;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        font-weight: 600;
      }
      .mcv {
        font-size: 14px;
        font-weight: 600;
        margin-top: 2px;
        font-family: "JetBrains Mono", monospace;
      }
      .mcv.r {
        color: #ff7aa8;
      }
      .mcv.a {
        color: #fff5d6;
      }
      .mcv.g {
        color: #d87aaa;
      }
      .dv {
        text-align: center;
        font-size: 9px;
        color: #8b7a84;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      .ibar {
        padding: 10px 14px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: #14070e;
        flex-shrink: 0;
      }
      @media (max-width: 480px) {
        body {
          padding: 8px;
        }
        .shell {
          width: 100%;
          border-radius: 14px;
        }
        .topbar {
          padding: 12px 14px;
        }
        .top-title {
          font-size: 12.5px;
        }
        .top-sub,
        .icnt {
          font-size: 9px;
        }
        .ci {
          padding: 12px 12px 8px;
        }
        .bub {
          max-width: 96%;
          font-size: 12px;
        }
        .ibar {
          padding: 9px 12px 12px;
        }
      }
      .iw {
        background: #25101b;
        border: 1px solid rgba(255, 143, 194, 0.2);
        border-radius: 24px;
        padding: 9px 9px 9px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: border-color 0.2s;
      }
      .iw.act {
        border-color: #ff8fc2;
      }
      .ifield {
        flex: 1;
        font-size: 12.5px;
        color: #b9a7b0;
        font-family: "Inter", sans-serif;
        line-height: 1.5;
        word-break: break-word;
        min-height: 16px;
      }
      .ifield.typ {
        color: #fff0f7;
      }
      .cur {
        display: inline-block;
        width: 1.5px;
        height: 13px;
        background: #ff8fc2;
        border-radius: 1px;
        vertical-align: middle;
        margin-left: 1px;
        animation: blink 0.9s step-end infinite;
      }
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
      .sbtn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #912059;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: none;
        cursor: pointer;
        transition:
          transform 0.15s,
          opacity 0.15s;
      }
      .sbtn.dim {
        opacity: 0.35;
        transform: scale(0.88);
      }
    </style>
  </head>
  <body>
    <div class="shell" id="sh">
    
      <div class="topbar">
        <div class="top-inner">
          <div class="top-icon">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect
                x="2"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <rect
                x="11"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <rect
                x="2"
                y="11"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <circle cx="14.5" cy="14.5" r="2.5" fill="#FF8FC2" />
            </svg>
          </div>
          <div class="top-labels">
            <div class="top-title"> IT NOC / SOC Agent </div>
            <div class="top-sub">
             Ask me about your infrastructure
            </div>
          </div>
          <div class="top-right">
            <div class="live-badge">
              <div class="ldot"></div>
              <div class="ltext">Live</div>
            </div>
            <div class="icnt">161 incidents</div>
          </div>
        </div>
      </div>
      <div class="chat" id="chat"><div class="ci" id="ci"></div></div>
      <div class="ibar">
        <div class="iw" id="iw">
          <div class="ifield" id="ifield">
            <span class="cur" id="cur"></span>
          </div>
          <button class="sbtn" id="sbtn">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M8 3L13 8L8 13"
                stroke="#fff"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <script>
      const sl = (ms) => new Promise((r) => setTimeout(r, ms));
      function mk(t, c) {
        const e = document.createElement(t);
        if (c) e.className = c;
        return e;
      }
      function pill(type) {
        const p = mk("div", "lp " + (type === "bot" ? "bl" : "ul"));
        if (type === "bot") {
          p.innerHTML = '<svg width="8" height="8" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/><rect x="5.5" y="1" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/><rect x="1" y="5.5" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/></svg> Bot';
        } else p.textContent = "You";
        return p;
      }
      function scrollUp() {
        const chat = document.getElementById("chat");
        chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
      }
      const syncScroll = () => requestAnimationFrame(scrollUp);
      const INTRO = [
        'Hello! I am your <span class="hb">L1 IT Ops Correlation Assistant</span>.',
        'I can answer questions about <span class="hb">161 incidents</span> across your infrastructure from <span class="hb">October 2025 to February 2026</span>. I correlate across <span class="hb">Assets, Alerts, KPIs</span> and <span class="hb">Hourly data</span> automatically.',
        'The right panel updates with full correlated details when I find relevant incidents. Select a suggestion or type your own.',
      ].join("<br><br>");
      const Q = "What happened on web-01 on Oct 1, 2025?";
      const PARTS = [
        { t: "n", v: "Found " },
        { t: "m", v: "INC-202510-web-01-001" },
        { t: "n", v: " on " },
        { t: "b", v: "web-01" },
        { t: "n", v: " — a " },
        { t: "r", v: "P1 Network incident" },
        { t: "n", v: " on the " },
        { t: "b", v: "public-site" },
        { t: "n", v: " service.\n\n" },
        { t: "n", v: "Runtime: " },
        { t: "b", v: "16:00 to 16:30" },
        { t: "n", v: " (30 min). Platform: " },
        { t: "b", v: "VM" },
        { t: "n", v: ", Role: " },
        { t: "b", v: "Web Server" },
        { t: "n", v: ".\n\n" },
        { t: "n", v: "Root cause: " },
        { t: "a", v: "NIC driver failure" },
        { t: "n", v: " on " },
        { t: "m", v: "eth0" },
        { t: "n", v: ". Linked alerts: " },
        { t: "b", v: "3 correlated" },
        { t: "n", v: ". Latency spiked " },
        { t: "r", v: "840ms" },
        { t: "n", v: ". Recovery at " },
        { t: "g", v: "16:34" },
        { t: "n", v: "." },
      ];
      const SUGGS = [
        "Show all P1 incidents in November 2025",
        "Which hosts had the most alerts?",
        "Correlate KPI drops with network alerts",
      ];
      const METRICS = [
        { l: "Incidents", v: "1", c: "r" },
        { l: "Alerts", v: "3", c: "a" },
        { l: "Downtime", v: "34m", c: "r" },
        { l: "MTTR", v: "16m", c: "g" },
      ];
      async function stream(container, parts) {
        for (const p of parts) {
          const sp =
            p.t === "m"
              ? mk("span", "hm")
              : p.t === "b"
                ? mk("span", "hb")
                : p.t === "r"
                  ? mk("span", "hr")
                  : p.t === "a"
                    ? mk("span", "ha")
                    : p.t === "g"
                      ? mk("span", "hg")
                      : mk("span");
          container.appendChild(sp);
          for (let i = 0; i < p.v.length; i++) {
            if (p.v[i] === "\n") {
              sp.appendChild(document.createElement("br"));
              if (p.v[i + 1] === "\n") {
                sp.appendChild(document.createElement("br"));
                i++;
              }
            } else sp.appendChild(document.createTextNode(p.v[i]));
            await sl(22);
            scrollUp();
          }
        }
      }
      async function run() {
        const ci = document.getElementById("ci"),
          ifield = document.getElementById("ifield"),
          cur = document.getElementById("cur"),
          iw = document.getElementById("iw"),
          sbtn = document.getElementById("sbtn"),
          sh = document.getElementById("sh");
        document.getElementById("chat").scrollTop = 0;
        await sl(600);
        const r1 = mk("div", "row bot");
        r1.appendChild(pill("bot"));
        const b1 = mk("div", "bub bb");
        b1.innerHTML = INTRO;
        r1.appendChild(b1);
        ci.appendChild(r1);
        await sl(20);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            b1.classList.add("vis");
            scrollUp();
          }),
        );
        await sl(500);
        const ch = mk("div", "chips");
        SUGGS.forEach((s) => {
          const c = mk("div", "chip");
          c.textContent = s;
          ch.appendChild(c);
        });
        b1.appendChild(ch);
        await sl(80);
        ch.classList.add("show");
        scrollUp();
        await sl(2000);
        iw.classList.add("act");
        ifield.classList.add("typ");
        for (let i = 0; i < Q.length; i++) {
          ifield.insertBefore(document.createTextNode(Q[i]), cur);
          await sl(40);
        }
        await sl(480);
        sbtn.classList.add("dim");
        iw.classList.remove("act");
        await sl(180);
        const dv = mk("div", "dv");
        dv.textContent = "Oct 1, 2025 · 09:41 AM";
        ci.appendChild(dv);
        scrollUp();
        const ru = mk("div", "row usr");
        ru.appendChild(pill("user"));
        const ub = mk("div", "bub ub");
        ub.textContent = Q;
        ru.appendChild(ub);
        ci.appendChild(ru);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ub.classList.add("vis");
            scrollUp();
          }),
        );
        while (ifield.firstChild !== cur) ifield.removeChild(ifield.firstChild);
        ifield.classList.remove("typ");
        sbtn.classList.remove("dim");
        await sl(420);
        const r2 = mk("div", "row bot");
        r2.appendChild(pill("bot"));
        const b2 = mk("div", "bub bb");
        const thk = mk("div", "thk");
        thk.innerHTML = "<span></span><span></span><span></span>";
        b2.appendChild(thk);
        const td = mk("div");
        td.style.display = "none";
        b2.appendChild(td);
        const mr = mk("div", "mrow");
        METRICS.forEach((m) => {
          const c = mk("div", "mc");
          const l = mk("div", "mcl");
          l.textContent = m.l;
          const v = mk("div", "mcv " + m.c);
          v.textContent = m.v;
          c.append(l, v);
          mr.appendChild(c);
        });
        b2.appendChild(mr);
        r2.appendChild(b2);
        ci.appendChild(r2);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            b2.classList.add("vis");
            scrollUp();
          }),
        );
        await sl(1400);
        thk.style.display = "none";
        td.style.display = "";
        await stream(td, PARTS);
        await sl(280);
        mr.classList.add("show");
        scrollUp();
        await sl(4000);
        sh.style.transition = "opacity 0.7s";
        sh.style.opacity = "0";
        await sl(800);
        ci.innerHTML = "";
        while (ifield.firstChild !== cur) ifield.removeChild(ifield.firstChild);
        ifield.classList.remove("typ");
        iw.classList.remove("act");
        sbtn.classList.remove("dim");
        sh.style.opacity = "1";
        await sl(350);
        run();
      }
      window.addEventListener("resize", syncScroll);
      window.addEventListener("orientationchange", syncScroll);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", syncScroll);
      }
      run();
    </script>
  </body>
</html>`;function n(){return(0,t.jsx)("div",{className:"flex-1 overflow-hidden rounded-[1.25rem] border border-[#ff8fc2]/20 bg-[#4b1230] shadow-[0_24px_70px_rgba(45,5,25,0.45)] min-h-[560px] sm:min-h-[620px] lg:min-h-0",children:(0,t.jsx)("iframe",{title:"Consumer protection compliance chatbot preview",srcDoc:r,sandbox:"allow-scripts",scrolling:"no",loading:"lazy",referrerPolicy:"no-referrer",tabIndex:-1,className:"pointer-events-none block h-full min-h-[560px] w-full border-0 sm:min-h-[620px] lg:min-h-0"})})}var o=e.i(84898),l=e.i(31924);function d(e,t){let a=e?.trim();return a&&"#"!==a?a:t}function c({href:e,fallbackHref:a,className:s,children:r}){return(0,t.jsx)(i.default,{href:d(e,a),className:(0,l.cn)("inline-flex items-center justify-center",s),children:r})}var m=e.i(85544),f=e.i(75254);let p=(0,f.default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);var x=e.i(72520),u=e.i(43531),b=e.i(64659);let h=(0,f.default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]),g=(0,f.default)("chart-no-axes-column-increasing",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]),v=(0,f.default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);var w=e.i(13625),w=w;let y=(0,f.default)("plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]);var j=e.i(81418),k=e.i(5329),N=e.i(71645);function A(e){if(!e)return!1;let t=e.toLowerCase();return t.endsWith(".mp4")||t.endsWith(".webm")||t.endsWith(".mov")||t.endsWith(".ogv")}function C(e){if(!e.hostname.toLowerCase().includes("drive.google.com"))return null;let t=e.pathname.match(/\/file\/d\/([^/]+)/);if(t?.[1])return t[1];let a=e.searchParams.get("id");return a?.trim()||null}function _(e){if(e.pathname.includes("/preview"))return e.toString();let t=C(e);return t?`https://drive.google.com/file/d/${t}/preview`:null}function I(e){return e?e.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim():""}let E=[{id:"tab-mcp",mobile:"Workflow Builder",desktop:"Workflow Builder",title:"No-Code Workflow Builder & Intent Studio",body:"Build agent workflows visually with clear intent definition and execution logic.",points:["Drag-and-drop workflow design","Intent configuration and flow logic","Faster prototyping and deployment"],icon:u.Check,video:"/images/videos-home/workflow-builder.mp4"},{id:"tab-governance-ai",mobile:"Orchestration",desktop:"Orchestration",title:"Agent Orchestration Engine",body:"Coordinate multiple AI agents across enterprise workflows.",points:["Multi-agent collaboration","Task sequencing and orchestration","Reliable workflow execution"],icon:j.ShieldCheck,video:"/images/videos-home/multi-agent.mp4"},{id:"tab-multimodal",mobile:"EvalOps",desktop:"EvalOps",title:"Built-in EvalOps & Monitoring",body:"Track, evaluate, and improve agent performance continuously.",points:["Execution visibility","Performance monitoring","Built-in evaluation framework"],icon:w.default},{id:"tab-observability",mobile:"Guardrails",desktop:"Guardrails",title:"AI Governance Guardrails & Policy Enforcement",body:"Apply enterprise control across AI workflows and agent actions.",points:["Policy enforcement","Role-based access control","Audit trails and compliance visibility"],icon:p,video:"/images/videos-home/guardrail.mp4"},{id:"tab-integrations",mobile:"MCP Integrations",desktop:"MCP Integration",title:"MCP Administration & Integrations",body:"Securely connect agents with enterprise systems through Model Context Protocol (MCP).",points:["Centralized MCP management","Secure access to tools, APIs, and databases","Controlled enterprise data connectivity"],icon:y,video:"/images/videos-home/mcp.mp4"},{id:"tab-handling",mobile:"Multimodal",desktop:"Multimodal",title:"Multimodal Data Handling",body:"Enable agents to work across multiple data formats and enterprise content types.",points:["Text and documents","PDFs, images, and video","Emails, databases, and APIs"],icon:p},{id:"tab-infra",mobile:"Deployment",desktop:"Deployment",title:"Flexible Deployment Infrastructure",body:"Deploy WiiZ based on enterprise infrastructure needs.",points:["SaaS or self-hosted","Private cloud or on-premise","Air-gapped environments"],icon:p}],z=[{id:"card-1",name:"Sai Shruthi",role:"Agentic AI Developer",image:"https://ui-avatars.com/api/?name=Sai+Shruthi&background=912059&color=ffffff&bold=true",quote:"WiiZ has been instrumental in bridging the gap between AI capabilities and business applications. It supports practical implementation, making it easier to deliver scalable and impactful solutions."},{id:"card-2",name:"Paarth",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Paarth&background=D87AAA&color=ffffff&bold=true",quote:"Using WiiZ has significantly improved the way I build and manage AI workflows. The platform is intuitive yet powerful, reducing manual effort and accelerating workflow development."},{id:"card-3",name:"Gowtham Sai",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Gowtham+Sai&background=7a314f&color=ffffff&bold=true",quote:"WiiZ redefines the integration of automation and AI through a highly intuitive and scalable platform. It transformed complex concepts into efficient real-world workflows with speed and flexibility."},{id:"card-4",name:"Aravind",role:"Software Engineer",image:"https://ui-avatars.com/api/?name=Aravind&background=4f2238&color=ffffff&bold=true",quote:"WiiZ transforms the complexity of AI orchestration into an intuitive, streamlined process. It has been a significant catalyst in advancing my technical expertise and understanding of enterprise AI efficiency."},{id:"card-5",name:"Ankur",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Ankur&background=aa5b7f&color=ffffff&bold=true",quote:"WiiZ is a strong platform for building AI workflows in a clear and structured way. It simplifies complex automation while still allowing full control over how systems are designed."}],T=[{question:"What is WiiZ?",answer:"WiiZ is an Enterprise Agentic AI Operating System that enables organizations to design, orchestrate, govern, monitor, and scale AI agents from one unified platform."},{question:"How is WiiZ different from traditional AI automation platforms?",answer:"WiiZ goes beyond workflow automation by providing enterprise-grade AI orchestration, governance, observability, EvalOps, multi-agent coordination, and centralized AI operations in a single platform."},{question:"Can WiiZ orchestrate multiple AI agents and models together?",answer:"Yes. WiiZ supports multi-agent orchestration and centralized provisioning across multiple LLMs, VLMs, enterprise systems, APIs, and workflows."},{question:"Does WiiZ provide AI governance and compliance controls?",answer:"Yes. WiiZ includes enterprise governance capabilities such as policy enforcement, audit visibility, monitoring, guardrails, access control, and AI execution oversight."},{question:"Can WiiZ work with existing enterprise systems?",answer:"Yes. WiiZ integrates with enterprise applications, APIs, databases, cloud platforms, and existing AI infrastructure through its orchestration and integration framework."},{question:"Does WiiZ support on-premise or air-gapped deployments?",answer:"Yes. WiiZ supports SaaS, private cloud, on-premise, and air-gapped enterprise deployments for organizations with strict security and compliance requirements."},{question:"What is EvalOps in WiiZ?",answer:"EvalOps continuously monitors AI workflows, agent performance, hallucinations, execution quality, and operational reliability to ensure trustworthy enterprise AI operations."},{question:"Who is WiiZ designed for?",answer:"WiiZ is designed for enterprise business teams, AI engineering teams, IT governance teams, system integrators, and organizations scaling enterprise AI adoption."},{question:"Does WiiZ require coding expertise?",answer:"No. WiiZ includes a no-code orchestration environment that allows teams to design and manage AI workflows visually while still supporting advanced extensibility for technical teams."},{question:"Can WiiZ monitor AI usage and operational costs?",answer:"Yes. WiiZ provides centralized visibility into AI usage, token consumption, workflow execution, performance metrics, and operational insights across the enterprise."},{question:"How does WiiZ help enterprises scale AI adoption?",answer:"WiiZ centralizes AI orchestration, governance, visibility, and operations, helping organizations move from fragmented AI experiments to scalable enterprise AI operations."},{question:"Is WiiZ only for AI chatbots?",answer:"No. WiiZ supports enterprise AI workflows, autonomous agents, orchestration pipelines, multimodal AI operations, business process automation, and cross-system AI collaboration."},{question:"What deployment models does WiiZ support?",answer:"WiiZ supports cloud, private tenant, hybrid, self-hosted, and enterprise on-premise deployments."},{question:"Can WiiZ support enterprise security requirements?",answer:"Yes. WiiZ supports enterprise-grade security including RBAC, JWT authentication, audit logging, credential vaulting, governance controls, and policy enforcement."},{question:"Why do enterprises need an AI Operating System?",answer:"As AI adoption grows, enterprises need centralized orchestration, governance, visibility, and operational control to manage AI agents securely and at scale. WiiZ provides that unified control layer."}],S=[{title:"Enterprise Business Teams",image:"/images/Product_builder.jpg",desc:"Adopt AI confidently across your everyday business operations with visibility, governance, and measurable performance.",bullets:["Difficulty moving AI from pilots to daily operations","Limited visibility into AI performance and business impact","Low confidence in scaling AI across teams and workflows"],cta:"Book an Appointment",positive:!1},{title:"Enterprise IT & AI Governance",image:"/images/Enterprice_it.jpg",desc:"Design, Deploy, Maintain centralized control, governance, security, and compliance across enterprise AI operations.",bullets:["Shadow AI and unmanaged agents","Lack of AI governance and observability","Compliance, security, and audit risks"],cta:"Book an Appointment",positive:!0},{title:"System Integrators & Partners",image:"/images/system_integrator.jpg",desc:"Deliver enterprise AI transformation faster with a unified orchestration and governance platform.",bullets:["Complex enterprise integrations","Managing multi-client AI deployments","Long implementation timelines"],cta:"Partner with Us",positive:!1},{title:"Legacy Product Enhancement",image:"/images/Ai_Team.jpg",desc:"Enhance your existing platforms with ease using the Embedded WiiZ Platform",bullets:["Multi-agent orchestration complexity","Integrating models, APIs, and enterprise systems","Scaling AI workflows into production"],cta:"Partner with Us",positive:!0}],q={"Start Free":"/register","Book an Appointment":"/contact","Partner with Us":"/partner"};function W({label:e,className:a=""}){return(0,t.jsxs)("div",{className:`relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] ${a}`,children:[(0,t.jsx)("div",{className:"absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"}),(0,t.jsx)("div",{className:"relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center",children:(0,t.jsx)("div",{children:(0,t.jsx)("div",{className:"text-2xl font-bold text-white",children:e})})})]})}function M({managedContent:e,heroSection:r,homeFeatures:l=[],homeUseCases:f=[]}){let p=e.hero,w=l.length?l.map(e=>({id:`feature-${e.id}`,mobile:e.label,desktop:e.label,title:e.title,body:e.description??"",points:e.features,icon:u.Check,mediaType:e.mediaType,mediaUrl:e.mediaUrl})):E.map(e=>({...e,mediaType:e.video?"video":null,mediaUrl:e.video??null})),y=p.buttons.find(e=>"primary"===e.variant)??p.buttons[0],j=p.buttons.find(e=>"secondary"===e.variant)??p.buttons[1],M=function(e){if(!e)return null;let[t,a]=e.split("/");return t&&a?`/api/media/${t}/${a}`:null}(r?.filepath??null),O=r?.heroHeading?.trim()||p.heading,L=r?.highlightedHeading?.trim()||p.highlightedText,D=r?.shortDescription?.trim()||p.subheading,F=r?.buttonText?.trim()||j?.label||"Get Started",H=r?.buttonText2?.trim()||y?.label||"Book Enterprise Demo",P=d(j?.href,"/register"),B=d(y?.href,"/contact"),Z=f[0]??null,U=f.slice(1,3),[$,V]=(0,N.useState)(w[0]?.id??""),R=w.some(e=>e.id===$)?$:w[0]?.id??"",Y=2*z.length,G=[...z,...z,...z,...z,...z],[J,K]=(0,N.useState)(Y),[Q,X]=(0,N.useState)(Y),[ee,et]=(0,N.useState)(null),[ea,es]=(0,N.useState)(!1),ei=(0,N.useRef)(null),er=(0,N.useRef)([]),en=(0,N.useRef)(null),eo=(0,N.useRef)(null),el=(0,N.useRef)(!1),ed=(0,N.useRef)(!1),ec=z[J%z.length],em=z[Q%z.length];(0,N.useEffect)(()=>{k.default.init({duration:800,once:!1,offset:100,mirror:!0})},[]),(0,N.useEffect)(()=>{let e=window.setInterval(()=>{K(e=>e+1)},2500);return()=>window.clearInterval(e)},[]),(0,N.useEffect)(()=>{let e=window.setInterval(()=>{X(e=>e+1)},2500);return()=>window.clearInterval(e)},[]),(0,N.useEffect)(()=>{let e=ei.current,t=er.current[J];e&&t&&e.scrollTo({left:t.offsetLeft-e.offsetWidth/2+t.offsetWidth/2,behavior:"smooth"})},[J]),(0,N.useEffect)(()=>{let e=ei.current;if(!e)return;let t=z.length,a=J;if(J>=4*t?a=J-t:J<t&&(a=J+t),a===J)return;let s=er.current[a];s&&window.requestAnimationFrame(()=>{e.scrollTo({left:s.offsetLeft-e.offsetWidth/2+s.offsetWidth/2,behavior:"auto"}),K(a)})},[J]),(0,N.useEffect)(()=>{let e=en.current;if(!e||el.current)return;let t=e.children[Y];t&&(ed.current=!0,e.scrollTo({left:t.offsetLeft,behavior:"auto"}),window.requestAnimationFrame(()=>{el.current=!0,ed.current=!1}))},[Y]),(0,N.useEffect)(()=>{let e=en.current;if(!e||!el.current)return;let t=e.children[Q];t&&(ed.current=!0,e.scrollTo({left:t.offsetLeft,behavior:"smooth"}),window.setTimeout(()=>{ed.current=!1},350))},[Q]),(0,N.useEffect)(()=>{let e=en.current;if(!e||!el.current)return;let t=z.length,a=Q;if(Q>=4*t?a=Q-t:Q<t&&(a=Q+t),a===Q)return;let s=e.children[a];s&&window.requestAnimationFrame(()=>{ed.current=!0,e.scrollTo({left:s.offsetLeft,behavior:"auto"}),X(a),window.requestAnimationFrame(()=>{ed.current=!1})})},[Q]),(0,N.useEffect)(()=>()=>{null!==eo.current&&window.clearTimeout(eo.current)},[]);let ef=T.slice(0,3);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("main",{className:"jsx-447db2994406fc3a bg-[#1D0612] min-h-[70vh] lg:min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden px-4 py-8 md:py-20 font-sans",children:[M?(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a absolute inset-0",children:[A(M)?(0,t.jsx)("video",{autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"jsx-447db2994406fc3a h-full w-full object-cover opacity-55",children:(0,t.jsx)("source",{src:M,className:"jsx-447db2994406fc3a"})}):(0,t.jsx)(s.default,{src:M,alt:O,fill:!0,className:"object-cover opacity-55",sizes:"100vw"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-[#1D0612]/50"})]}):null,(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-hero blur-[160px] rounded-full pointer-events-none"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a max-w-6xl mx-auto text-center relative z-10",children:[(0,t.jsxs)("h1",{"data-aos":"fade-up","data-aos-duration":"1000",className:"jsx-447db2994406fc3a text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight md:leading-[1.1] font-bold text-white mb-3 md:mb-6 tracking-tight",children:[O,(0,t.jsx)("br",{className:"jsx-447db2994406fc3a"}),(0,t.jsx)("span",{className:"jsx-447db2994406fc3a bg-gradient-to-r from-secondary to-[#E68F17] bg-clip-text text-transparent",children:L})]}),(0,t.jsx)("p",{"data-aos":"fade-up","data-aos-duration":"1000","data-aos-delay":"200",className:"jsx-447db2994406fc3a text-base md:text-xl text-[#FDFDFD] max-w-2xl text-center  mx-auto mb-5 md:mb-10",children:D}),(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-duration":"1000","data-aos-delay":"400",className:"jsx-447db2994406fc3a flex gap-4 flex-col sm:flex-row justify-center items-center",children:[(0,t.jsx)(c,{href:P,fallbackHref:"/register",className:"hero-cta inline-flex w-fit items-center justify-center bg-transparent border border-white/50 text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300",children:F}),(0,t.jsxs)(c,{href:B,fallbackHref:"/contact",className:"hero-cta inline-flex w-fit items-center justify-center bg-gradient-to-r from-quaternary to-[#AD2D45] text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300 group",children:[H,(0,t.jsx)(x.ArrowRight,{className:"w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"})]})]})]})]}),(0,t.jsx)("section",{className:"jsx-447db2994406fc3a border-y border-gray-200 bg-white flex items-stretch font-sans",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto flex items-center justify-start w-full overflow-hidden relative py-6 md:py-8 lg:py-10",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a flex-shrink-0 hidden md:flex items-center justify-center w-40 xl:w-64 border-r border-gray-200 bg-white z-10",children:(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-sm md:text-base font-medium text-gray-800 tracking-[0.15em] uppercase",children:"Trusted By"})}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a flex-1 flex items-center overflow-hidden relative",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a flex animate-scroll whitespace-nowrap items-center w-max",children:[0,1].map(e=>(0,t.jsx)("div",{className:"jsx-447db2994406fc3a flex items-center space-x-12 md:space-x-10 px-6 md:px-8",children:m.partnerLogos.map((a,i)=>(0,t.jsx)("span",{className:"jsx-447db2994406fc3a relative flex h-10 w-36 items-center justify-center md:h-12 md:w-44",children:(0,t.jsx)(s.default,{src:a.logoPath,alt:`${a.name} logo`,fill:!0,sizes:"176px",className:`object-contain transition-transform ${a.homepageLogoClassName??""}`})},`${e}-${a.name}-${a.logoPath}-${i}`))},e))})]})]})}),(0,t.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 left-0 w-full max-w-[500px] h-full bg-[url('/images/side-left.png')] bg-no-repeat bg-left-top pointer-events-none"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 right-0 w-full max-w-[500px] h-full bg-[url('/images/side-right.png')] bg-no-repeat bg-right-top pointer-events-none"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-section",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a text-center max-w-3xl mx-auto mb-8 md:mb-16",children:[(0,t.jsx)("h2",{"data-aos":"fade-up","data-aos-duration":"700",className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight",children:"Everything you need to move from prototype to production"}),(0,t.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a text-base md:text-lg font-light text-[#EBEBEB] md:px-20",children:"WiiZ brings together the core capabilities required to Orchestrate enterprise AI agents at scale."})]}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a flex md:hidden flex-wrap justify-center gap-2 items-center w-max mx-auto mb-8 overflow-x-auto max-w-full hide-scrollbar",children:w.map(e=>(0,t.jsx)("button",{type:"button",onClick:()=>V(e.id),className:`jsx-447db2994406fc3a px-4 py-2 rounded-full text-sm border border-white/10 transition-all duration-300 ${R===e.id?"text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg bg-black/30":"text-[#DFDFDF] bg-black/30 hover:text-white"}`,children:e.mobile},e.id))}),(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"300",className:"jsx-447db2994406fc3a bg-gradient-to-t from-[#FFFFFF0D] to-[#0D0A1947] backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-2xl md:rounded-3xl p-4 md:p-4 lg:p-10 shadow-2xl relative",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:flex flex-wrap justify-center items-center bg-black/30 rounded-full p-2 xl:p-2 lg:w-max lg:mx-auto mb-6 lg:mb-12 border border-white/5 overflow-x-auto max-w-full",children:w.map(e=>(0,t.jsx)("button",{type:"button",onClick:()=>V(e.id),className:`jsx-447db2994406fc3a px-2 lg:px-5 xl:px-6 py-2 lg:py-2.5 rounded-full text-base md:text-[13px] lg:text-sm transition-all duration-300 ${R===e.id?"text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg":"text-[#DFDFDF] hover:text-white"}`,children:e.desktop},e.id))}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a relative grid grid-cols-1 grid-rows-1 w-full items-start",children:w.map(e=>{let a=e.icon,s=R===e.id,r=function(e,t){let a=function(e){if(!e)return null;if(e.startsWith("/"))return e;try{let t=new URL(e);return["http:","https:"].includes(t.protocol)?t.toString():null}catch{let[t,a]=e.split("/");if(!t||!a)return null;return`/api/media/${t}/${a}`}}(t);if(!a)return null;if("video"!==e)try{let e,t=new URL(a),s=_(t);if(s)return{kind:"embed",src:s};return{kind:"image",src:((e=C(t))?`https://drive.google.com/thumbnail?id=${e}&sz=w2000`:null)??a}}catch{return{kind:"image",src:a}}if(A(a))return{kind:"video",src:a};try{let e=new URL(a),t=function(e){let t=e.hostname.toLowerCase();if(t.includes("youtu.be")){let t=e.pathname.split("/").filter(Boolean)[0];return t?`https://www.youtube.com/embed/${t}`:null}if(t.includes("youtube.com")){if(e.pathname.startsWith("/shorts/")){let t=e.pathname.split("/")[2];return t?`https://www.youtube.com/embed/${t}`:null}if(e.pathname.startsWith("/embed/"))return e.toString();let t=e.searchParams.get("v");return t?`https://www.youtube.com/embed/${t}`:null}return null}(e)??function(e){if(!e.hostname.toLowerCase().includes("vimeo.com"))return null;if(e.pathname.startsWith("/video/"))return`https://player.vimeo.com${e.pathname}`;let t=e.pathname.split("/").filter(Boolean).find(e=>/^\d+$/.test(e));return t?`https://player.vimeo.com/video/${t}`:null}(e)??_(e)??function(e){if(!e.hostname.toLowerCase().includes("loom.com"))return null;if(e.pathname.startsWith("/embed/"))return e.toString();let t=e.pathname.split("/").filter(Boolean).pop();return t?`https://www.loom.com/embed/${t}`:null}(e)??a;return{kind:"embed",src:t}}catch{return{kind:"video",src:a}}}(e.mediaType,e.mediaUrl);return(0,t.jsxs)("div",{className:`jsx-447db2994406fc3a row-start-1 col-start-1 grid md:grid-cols-2 gap-0 md:gap-12 items-center md:items-stretch transition-all duration-500 ${s?"opacity-100 z-10 pointer-events-auto":"opacity-0 z-0 pointer-events-none"}`,children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a order-1 md:order-0 flex flex-col justify-center py-4 md:py-0",children:[(0,t.jsx)("h3",{className:"jsx-447db2994406fc3a text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4",children:e.title}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-gray-300 mb-4 lg:mb-8 leading-relaxed",children:e.body}),(0,t.jsx)("ul",{className:"jsx-447db2994406fc3a space-y-2 lg:space-y-4",children:e.points.map(e=>(0,t.jsxs)("li",{className:"jsx-447db2994406fc3a flex items-start",children:[(0,t.jsx)(a,{className:"w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-secondary"}),(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-gray-300",children:e})]},e))})]}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a order-0 md:order-1 h-full min-h-[260px] overflow-hidden",children:r?(0,t.jsx)("div",{className:"jsx-447db2994406fc3a relative h-[260px] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl md:h-full md:min-h-[320px] md:max-h-[460px]",children:"video"===r.kind?(0,t.jsxs)("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"jsx-447db2994406fc3a block h-full w-full max-w-full object-cover",children:[(0,t.jsx)("source",{src:r.src,type:"video/mp4",className:"jsx-447db2994406fc3a"}),"Your browser does not support the video tag."]}):"embed"===r.kind?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("iframe",{src:r.src,title:e.title,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,className:"jsx-447db2994406fc3a block h-full min-h-[260px] w-full max-w-full"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute bottom-3 right-3",children:(0,t.jsx)(i.default,{href:e.mediaUrl??r.src,target:"_blank",rel:"noreferrer",className:"inline-flex items-center rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur",children:"Open media"})})]}):(0,t.jsx)("img",{src:r.src,alt:e.title,className:"jsx-447db2994406fc3a block h-full w-full max-w-full object-cover object-center"})}):(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] rounded-xl",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center",children:(0,t.jsx)("div",{className:"jsx-447db2994406fc3a text-2xl font-bold text-white",children:e.desktop})})]})})]},e.id)})})]})]})]}),(0,t.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,t.jsxs)("div",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a flex flex-col md:flex-row md:items-end gap-6 justify-between mb-8 md:mb-12",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a flex flex-col md:items-start items-center",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a inline-block px-3 py-1 rounded-full border border-white/40 bg-[#211A2533] mb-2 md:mb-4",children:(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-[12px] font-bold text-secondary tracking-widest uppercase",children:"Use Cases"})}),(0,t.jsx)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-white tracking-tight",children:"Leaderboard of WiiZ Built AI Agents"}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-base lg:text-lg mt-3 text-center md:text-left font-light text-[#EBEBEB]",children:"Examples of AI agents built on WiiZ for real enterprise workflows."})]}),(0,t.jsxs)(i.default,{href:"/ai-agents",className:"flex-shrink-0 hidden md:inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group",children:["View All Agents",(0,t.jsx)(x.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a lg:col-span-2 flex min-h-0 flex-col gap-6",children:Z?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{"data-aos":"fade-right",className:"jsx-447db2994406fc3a bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:p-9 shadow-xl",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a grid gap-7 md:grid-cols-[1.1fr_1fr] md:items-center",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a mb-5 flex items-center gap-4",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center",children:(0,t.jsx)(h,{className:"w-6 h-6"})}),Z.industryTitle?(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]",children:Z.industryTitle}):null]}),(0,t.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl font-semibold text-gray-950 mb-5 tracking-tight",children:Z.useCaseTitle}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-base md:text-lg text-gray-500 leading-relaxed",children:Z.useCaseDescription||I(Z.impactDescription)||Z.challenges[0]||"Use case details are not available yet."})]}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a bg-[#fafaff] rounded-lg border border-[#edeefa] p-5 md:p-7 shadow-sm",children:[(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-[#922358] text-xs font-bold uppercase tracking-[0.35em] mb-7",children:"Impact"}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-base text-gray-500 leading-relaxed",children:I(Z.impactDescription)||Z.useCaseDescription||"Impact details are not available for this use case yet."}),(0,t.jsxs)(i.default,{href:{pathname:"/ai-agents/usecasedetail",query:{useCaseId:Z.useCaseId,industryTitle:Z.industryTitle??"",functionTitle:Z.functionTitle??""}},className:"mt-6 inline-flex items-center text-[#922358] font-semibold group",children:["Explore Use Case",(0,t.jsx)(x.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]})]})}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-2 gap-6",children:U.map((e,a)=>(0,t.jsxs)("div",{"data-aos":"fade-right","data-aos-duration":"1000",className:"jsx-447db2994406fc3a bg-white rounded-2xl md:rounded-3xl p-6 lg:p-9 shadow-xl min-h-[260px] flex flex-col",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a mb-5 flex items-center gap-4",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center",children:(0,t.jsx)(0===a?g:v,{className:"jsx-447db2994406fc3a w-6 h-6"})}),e.industryTitle?(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]",children:e.industryTitle}):null]}),(0,t.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl font-semibold text-gray-950 mb-4 tracking-tight",children:e.useCaseTitle}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-base text-gray-500 leading-relaxed max-w-sm",children:e.useCaseDescription||I(e.impactDescription)||e.challenges[0]||"Use case details are not available yet."})]}),(0,t.jsxs)(i.default,{href:{pathname:"/ai-agents/usecasedetail",query:{useCaseId:e.useCaseId,industryTitle:e.industryTitle??"",functionTitle:e.functionTitle??""}},className:"mt-auto inline-flex w-fit items-center text-[#922358] font-semibold pt-8 group",children:["Explore Use Case",(0,t.jsx)(x.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]},e.id))})]}):null}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a md:col-span-1 lg:col-span-1 min-h-0",children:(0,t.jsx)("div",{"data-aos":"fade-left",className:"jsx-447db2994406fc3a bg-gradient-to-b from-[#91205996] to-[#6b1b4396] rounded-2xl md:rounded-2xl md:rounded-3xl shadow-2xl h-full min-h-0 flex flex-col border border-white/10",children:(0,t.jsx)(n,{})})})]}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a md:hidden flex w-full items-center justify-center",children:(0,t.jsxs)(i.default,{href:"/ai-agents",className:"inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 mt-6 group",children:["View All Agents",(0,t.jsx)(x.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})})]})}),(0,t.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,t.jsx)("div",{"data-aos":"fade-down",className:"jsx-447db2994406fc3a text-center max-w-3xl mx-auto mb-8 md:mb-16",children:(0,t.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight",children:["Accelerating Enterprise AI Adoption"," ",(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-secondary"})]})}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 xl:gap-8",children:S.map(e=>(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a rounded-2xl md:rounded-3xl overflow-hidden flex flex-col bg-[#2b1c27] border border-white/5 shadow-2xl",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a h-[260px] sm:h-[200px] xl:h-[220px] lg:h-[150px] relative",children:e.image?(0,t.jsx)(s.default,{src:e.image,alt:e.title,fill:!0,className:"object-cover",sizes:"(max-width: 768px) 100vw, 50vw"}):(0,t.jsx)(W,{label:e.title})}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a p-4 sm:p-6 lg:p-4 xl:p-5 flex-1 flex flex-col justify-start",children:[(0,t.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl sm:text-xl font-bold text-secondary mb-2 sm:mb-3 text-center",children:e.title}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a mb-2 md:mb-4 text-base text-gray-300 text-center",children:e.desc}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a mt-auto pt-6 text-center",children:(0,t.jsx)(c,{href:q[e.cta]??"/register",fallbackHref:"/register",className:"inline-flex w-fit items-center justify-center bg-gradient-to-r from-tertiary to-quaternary text-white hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300",children:e.cta})})]})]},e.title))})]})]}),(0,t.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-4 md:py-10 lg:py-20 relative overflow-hidden font-sans",children:(0,t.jsx)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-20 relative z-10",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a relative bg-gradient-to-t to-[#4639418F] from-[#4921421A] border border-white/5 rounded-[1rem] md:rounded-[2rem] py-12 px-6 sm:px-10 md:py-12 lg:py-20 shadow-[inset_0_12px_12px_-12px_#FF8E5D4D] flex flex-col items-center text-center overflow-hidden",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block",children:(0,t.jsxs)("svg",{width:"134",height:"215",viewBox:"0 0 134 215",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("g",{opacity:"0.25",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("path",{d:"M-12.9999 2H22.7404C35.4428 2.00007 45.7403 12.2976 45.7404 25V41.0986H45.7423V43.2051C45.7423 57.0122 56.9352 68.205 70.7423 68.2051H133.828V66.2051H70.7423C58.0398 66.205 47.7423 55.9076 47.7423 43.2051V26.6445H47.7404V25C47.7402 11.193 36.5473 6.8033e-05 22.7404 0H-12.9999V2Z",fill:"url(#paint0_linear_157_1104)",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M-12.9999 212.609H22.7404C35.4428 212.609 45.7403 202.312 45.7404 189.609V173.511H45.7423V171.404C45.7423 157.597 56.9352 146.404 70.7423 146.404H133.828V148.404H70.7423C58.0398 148.404 47.7423 158.702 47.7423 171.404V187.965H47.7404V189.609C47.7402 203.416 36.5473 214.609 22.7404 214.609H-12.9999V212.609Z",fill:"url(#paint1_linear_157_1104)",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M133.832 107.305H10.8231",stroke:"white",strokeOpacity:"0.2",strokeWidth:"2",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M133.832 107.305H52.4292",stroke:"url(#paint2_linear_157_1104)",strokeWidth:"2",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("defs",{className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("linearGradient",{id:"paint0_linear_157_1104",x1:"127.053",y1:"67.7351",x2:"-25.7935",y2:"26.8045",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("linearGradient",{id:"paint1_linear_157_1104",x1:"127.053",y1:"146.874",x2:"-25.7935",y2:"187.805",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("linearGradient",{id:"paint2_linear_157_1104",x1:"130.076",y1:"108.298",x2:"129.199",y2:"99.4158",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"white",className:"jsx-447db2994406fc3a"})]})]})]})}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block",children:(0,t.jsxs)("svg",{width:"135",height:"215",viewBox:"0 0 135 215",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("g",{opacity:"0.25",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("path",{d:"M146.83 2H111.09C98.3873 2.00007 88.0898 12.2976 88.0897 25V41.0986H88.0878V43.2051C88.0878 57.0122 76.8948 68.205 63.0878 68.2051H0.00183105V66.2051H63.0878C75.7903 66.205 86.0878 55.9076 86.0878 43.2051V26.6445H86.0897V25C86.0898 11.193 97.2827 6.8033e-05 111.09 0H146.83V2Z",fill:"url(#paint0_linear_157_1116)",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M146.83 212.41H111.09C98.3873 212.41 88.0898 202.113 88.0897 189.41V173.312H88.0878V171.205C88.0878 157.398 76.8948 146.205 63.0878 146.205H0.00183105V148.205H63.0878C75.7903 148.205 86.0878 158.503 86.0878 171.205V187.766H86.0897V189.41C86.0898 203.217 97.2827 214.41 111.09 214.41H146.83V212.41Z",fill:"url(#paint1_linear_157_1116)",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M0.000244141 107.205H123.009",stroke:"white",strokeOpacity:"0.2",strokeWidth:"2",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("path",{d:"M0.000244141 107.205H81.4034",stroke:"url(#paint2_linear_157_1116)",strokeWidth:"2",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("defs",{className:"jsx-447db2994406fc3a",children:[(0,t.jsxs)("linearGradient",{id:"paint0_linear_157_1116",x1:"6.7768",y1:"67.7351",x2:"159.624",y2:"26.8045",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("linearGradient",{id:"paint1_linear_157_1116",x1:"6.7768",y1:"146.675",x2:"159.624",y2:"187.606",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,t.jsxs)("linearGradient",{id:"paint2_linear_157_1116",x1:"3.75635",y1:"108.198",x2:"4.6335",y2:"99.3162",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,t.jsx)("stop",{offset:"1",stopColor:"white",className:"jsx-447db2994406fc3a"})]})]})]})}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a relative z-20 max-w-3xl mx-auto w-full",children:[(0,t.jsxs)("h2",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight",children:["Operationalize Enterprise AI",(0,t.jsx)("br",{className:"jsx-447db2994406fc3a hidden md:block"}),"with Confidence"]}),(0,t.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a max-w-xl mx-auto text-base md:text-lg text-gray-300 mb-8 sm:mb-10 px-2 sm:px-0",children:"Defragment your AI Chaos with WiiZ, Centralize AI agents, governance, and observability across your Organization."}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a max-w-md mx-auto mb-8 mt-4",children:(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a grid grid-cols-4 gap-3 mt-5 justify-items-center",children:[(0,t.jsx)("img",{src:"/images/certificates/iso27001.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,t.jsx)("img",{src:"/images/certificates/hippa.jpg",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,t.jsx)("img",{src:"/images/certificates/gdpr.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,t.jsx)("img",{src:"/images/certificates/aicpa.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"})]})}),(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0",children:[(0,t.jsx)(c,{href:"/register",fallbackHref:"/register",className:"relative z-10 w-full sm:w-auto inline-flex items-center justify-center border-white/50 text-white px-8 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300 shadow-xl border border-white/5",children:"Get Started"}),(0,t.jsx)(c,{href:"/contact",fallbackHref:"/contact",className:"relative z-10 w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-quaternary to-[#D87AAA] text-white px-8 sm:px-10 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300",children:"Book Enterprise Demo"})]})]})]})})}),(0,t.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans bg-gray-900",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-24 mb-8 md:mb-16 relative md:min-h-[300px]",children:[(0,t.jsxs)("div",{"data-aos":"fade-right",className:"jsx-447db2994406fc3a flex flex-col justify-center items-center md:items-start ",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a inline-flex max-w-[120px] px-3 py-1 rounded-full border border-white/30 bg-[#211A2533] mb-4",children:(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-[12px] font-bold text-secondary tracking-widest uppercase",children:"TESTIMONIAL"})}),(0,t.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 leading-tight font-sans text-center md:text-left",children:["What our",(0,t.jsx)("br",{className:"jsx-447db2994406fc3a"}),"builders say"]}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-base md:text-lg text-gray-300 max-w-lg lg:max-w-md font-sans text-center md:text-left",children:"Real feedback from engineers and developers building practical AI workflows with WiiZ."})]}),(0,t.jsx)("div",{"data-aos":"fade-left","data-aos-delay":"100",className:"jsx-447db2994406fc3a relative w-full h-full hidden md:flex items-center mt-16 lg:mt-0",children:z.map(e=>(0,t.jsx)("div",{className:`jsx-447db2994406fc3a absolute w-full transition-all duration-500 ${e.id===ec.id?"opacity-100 translate-y-0 z-10":"opacity-0 translate-y-4 pointer-events-none z-0"}`,children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-xl md:rounded-2xl p-6 lg:p-10 shadow-2xl lg:h-[320px] h-[240px] overflow-hidden",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a flex items-center gap-4 mb-6",children:[(0,t.jsx)("img",{src:e.image,alt:e.name,className:"jsx-447db2994406fc3a w-12 h-12 rounded-full border border-white/10 object-cover"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,t.jsx)("h4",{className:"jsx-447db2994406fc3a text-white font-semibold text-lg",children:e.name}),(0,t.jsx)("span",{className:"jsx-447db2994406fc3a text-gray-300 text-sm",children:e.role})]})]}),(0,t.jsxs)("p",{className:"jsx-447db2994406fc3a text-gray-300 text-lg leading-relaxed custom-line-clamp-4",children:['"',e.quote,'"']})]})},e.id))}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a md:hidden relative",children:[(0,t.jsx)("div",{ref:en,onScroll:()=>{ed.current||(null!==eo.current&&window.clearTimeout(eo.current),eo.current=window.setTimeout(()=>{let e=en.current;if(!e)return;let t=Array.from(e.children);if(!t.length)return;let a=e.scrollLeft+e.clientWidth/2,s=0,i=1/0;t.forEach((e,t)=>{let r=Math.abs(e.offsetLeft+e.offsetWidth/2-a);r<i&&(i=r,s=t)}),X(s)},120))},className:"jsx-447db2994406fc3a flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar scroll-smooth",children:G.map((e,a)=>(0,t.jsx)("div",{className:"jsx-447db2994406fc3a w-full shrink-0 snap-center",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a min-h-[200px] bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-[1rem] md:rounded-[1.5rem] p-6 shadow-xl",children:[(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a flex items-center gap-4 mb-4",children:[(0,t.jsx)("img",{src:e.image,alt:e.name,className:"jsx-447db2994406fc3a w-10 h-10 rounded-full object-cover"}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a flex flex-col",children:[(0,t.jsx)("h3",{className:"jsx-447db2994406fc3a text-[16px] font-semibold text-white leading-tight",children:e.name}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-[14px] font-normal text-[#a1949b] mt-1",children:e.role})]})]}),(0,t.jsx)("p",{className:"jsx-447db2994406fc3a text-sm md:text-[16px] font-normal text-[#e8e2e5] leading-relaxed tracking-wide custom-line-clamp-4",children:e.quote})]})},`${e.id}-mobile-${a}`))}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a mt-5 flex justify-center gap-2",children:z.map(e=>{let a=e.id===em.id;return(0,t.jsx)("button",{type:"button","aria-label":`Show testimonial from ${e.name}`,onClick:()=>X(Y+z.findIndex(t=>t.id===e.id)),className:`jsx-447db2994406fc3a h-2 rounded-full transition-all duration-300 ${a?"w-4 bg-gradient-to-r from-quaternary to-[#D87AAA]":"w-2 bg-white/20"}`},`${e.id}-mobile-dot`)})})]})]}),(0,t.jsx)("div",{"data-aos":"fade-up","data-aos-delay":"200",className:"jsx-447db2994406fc3a lg:pt-0 md:pt-28 hidden md:block relative w-full border-b border-white/10",children:(0,t.jsx)("div",{ref:ei,className:"jsx-447db2994406fc3a flex overflow-x-auto snap-x snap-mandatory cursor-grab select-none no-scrollbar transition-all",children:G.map((e,a)=>{let s=a%z.length,i=a===J;return(0,t.jsxs)("button",{ref:e=>{er.current[a]=e},type:"button",onClick:()=>K(Y+s),className:`jsx-447db2994406fc3a group flex-shrink-0 w-full md:w-1/3 xl:w-1/5 flex items-center gap-4 px-8 py-4 border-b-2 snap-start transition-all ${i?"bg-gradient-to-t from-white/15 to-transparent border-secondary":"hover:bg-white/5 border-transparent"}`,children:[(0,t.jsx)("img",{src:e.image,alt:e.name,className:`jsx-447db2994406fc3a w-12 h-12 rounded-full border-2 object-cover transition-colors ${i?"border-secondary/50":"border-transparent"}`}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a text-left overflow-hidden",children:[(0,t.jsx)("span",{className:"jsx-447db2994406fc3a block text-white font-medium truncate",children:e.name}),(0,t.jsx)("span",{className:"jsx-447db2994406fc3a block text-gray-400 text-sm truncate",children:e.role})]})]},`${e.id}-${a}`)})})})]})]}),(0,t.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 lg:py-24 font-sans bg-gray-900 font-sans",children:(0,t.jsx)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8",children:(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a col-span-1 md:col-span-5 pr-0 md:pr-12",children:(0,t.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 tracking-tight leading-[1.1] text-center md:text-left",children:["Frequently Asked",(0,t.jsx)("br",{className:"jsx-447db2994406fc3a"}),"Questions"]})}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a col-span-1 md:col-span-7 gap-3 md:gap-0 flex flex-col md:border-t border-white/10",children:[ef.map((e,a)=>{let s=T.findIndex(t=>t.question===e.question),i=ee===s;return(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":100*a,className:"jsx-447db2994406fc3a border md:border-0 rounded-xl md:rounded-none md:border-b border-white/10 faq-item px-4 md:px-0 bg-gradient-to-r from-[#B15081b8] to-[#632243b8] md:bg-none",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>et(i?null:s),className:"jsx-447db2994406fc3a w-full flex justify-between items-center py-3 md:py-6 text-left group focus:outline-none",children:[(0,t.jsx)("span",{className:"jsx-447db2994406fc3a font-sans text-base md:text-lg text-gray-200 group-hover:text-white transition-colors duration-200",children:e.question}),(0,t.jsx)(b.ChevronDown,{className:`w-5 h-5 text-[#D1CECE] transition-transform duration-300 ${i?"rotate-180":""}`})]}),(0,t.jsx)("div",{style:{maxHeight:160*!!i},className:"jsx-447db2994406fc3a overflow-hidden transition-all duration-300 ease-in-out",children:(0,t.jsx)("p",{className:"jsx-447db2994406fc3a font-sans pb-6 text-gray-300 text-base leading-relaxed",children:e.answer})})]},e.question)}),(0,t.jsx)("div",{"data-aos":"fade-up","data-aos-delay":"500",className:"jsx-447db2994406fc3a mt-4 md:mt-8 flex justify-center md:justify-end",children:(0,t.jsxs)("button",{type:"button",onClick:()=>window.dispatchEvent(new Event(o.WEBSITE_CHATBOT_OPEN_EVENT)),className:"jsx-447db2994406fc3a flex items-center gap-2 text-sm md:text-base px-6 py-2 md:py-2.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 focus:outline-none",children:[(0,t.jsx)("span",{className:"jsx-447db2994406fc3a",children:"View More"}),(0,t.jsx)(b.ChevronDown,{className:"w-4 h-4"})]})})]})]})})}),(0,t.jsxs)("section",{className:"jsx-447db2994406fc3a relative min-h-[380px] overflow-hidden bg-primary px-4 py-12 font-sans flex items-center justify-center sm:min-h-[420px] sm:py-14 md:min-h-[450px] md:py-12 lg:py-24",children:[(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 left-0 h-[120px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 right-0 h-[120px] w-[260px] translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 left-0 h-full w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 right-0 h-full w-[220%] translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]"}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-[350px] xl:h-[300px]",children:(0,t.jsx)("img",{src:"/images/cta-svg-left.png",alt:"",className:"jsx-447db2994406fc3a h-full"})}),(0,t.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-auto xl:h-[300px]",children:(0,t.jsx)("img",{src:"/images/cta-svg-right.png",alt:"",className:"jsx-447db2994406fc3a h-full"})}),(0,t.jsxs)("div",{className:"jsx-447db2994406fc3a relative z-10 w-full max-w-2xl text-center sm:px-6",children:[(0,t.jsxs)("h2",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a mx-auto mb-4 max-w-[18rem] text-[28px] font-bold leading-[1.15] tracking-tight text-white sm:max-w-xl sm:text-4xl md:mb-6 md:text-4xl lg:text-5xl",children:["Start Building Enterprise",(0,t.jsx)("br",{className:"jsx-447db2994406fc3a"}),"AI Agents Today"]}),(0,t.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a mx-auto mb-7 max-w-[21rem] text-sm font-normal leading-relaxed text-gray-300/80 sm:mb-9 sm:max-w-xl sm:text-base md:text-[18px] lg:mb-10",children:"Join teams using WiiZ to design, deploy, and scale enterprise AI systems with confidence."}),(0,t.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a relative mx-auto flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4",children:[(0,t.jsx)(c,{href:"/register",fallbackHref:"/register",className:"relative z-10 inline-flex w-full items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base",children:"Get Started"}),(0,t.jsx)(c,{href:"/contact",fallbackHref:"/contact",className:"relative z-10 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-quaternary to-[#D87AAA] px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base",children:"Book Enterprise Demo"})]})]})]}),(0,t.jsx)(a.default,{id:"447db2994406fc3a",children:".hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.custom-line-clamp-4{-webkit-line-clamp:4;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}@keyframes fade-in-up{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.animate-section{animation:1s ease-out forwards fade-in-up}"})]})}e.s(["default",()=>M],6412)}]);