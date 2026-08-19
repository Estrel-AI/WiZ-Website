module.exports=[71476,(a,b,c)=>{a.e,b.exports=function(){var a=[function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{default:a}}var e=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},f=(d(c(1)),c(6)),g=d(f),h=d(c(7)),i=d(c(8)),j=d(c(9)),k=d(c(10)),l=d(c(11)),m=d(c(14)),n=[],o=!1,p={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},q=function(){var a=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(a&&(o=!0),o)return n=(0,l.default)(n,p),(0,k.default)(n,p.once),n},r=function(){n=(0,m.default)(),q()},s=function(){n.forEach(function(a,b){a.node.removeAttribute("data-aos"),a.node.removeAttribute("data-aos-easing"),a.node.removeAttribute("data-aos-duration"),a.node.removeAttribute("data-aos-delay")})};a.exports={init:function(a){p=e(p,a),n=(0,m.default)();var b,c=document.all&&!window.atob;return!0===(b=p.disable)||"mobile"===b&&j.default.mobile()||"phone"===b&&j.default.phone()||"tablet"===b&&j.default.tablet()||"function"==typeof b&&!0===b()||c?s():(p.disableMutationObserver||i.default.isSupported()||(console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '),p.disableMutationObserver=!0),document.querySelector("body").setAttribute("data-aos-easing",p.easing),document.querySelector("body").setAttribute("data-aos-duration",p.duration),document.querySelector("body").setAttribute("data-aos-delay",p.delay),"DOMContentLoaded"===p.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?q(!0):"load"===p.startEvent?window.addEventListener(p.startEvent,function(){q(!0)}):document.addEventListener(p.startEvent,function(){q(!0)}),window.addEventListener("resize",(0,h.default)(q,p.debounceDelay,!0)),window.addEventListener("orientationchange",(0,h.default)(q,p.debounceDelay,!0)),window.addEventListener("scroll",(0,g.default)(function(){(0,k.default)(n,p.once)},p.throttleDelay)),p.disableMutationObserver||i.default.ready("[data-aos]",r),n)},refresh:q,refreshHard:r}},function(a,b){},,,,,function(a,b){(function(b){"use strict";function c(a){var b=void 0===a?"undefined":e(a);return!!a&&("object"==b||"function"==b)}function d(a){if("number"==typeof a)return a;if("symbol"==(void 0===(b=a)?"undefined":e(b))||b&&"object"==(void 0===b?"undefined":e(b))&&q.call(b)==h)return g;if(c(a)){var b,d="function"==typeof a.valueOf?a.valueOf():a;a=c(d)?d+"":d}if("string"!=typeof a)return 0===a?a:+a;var f=k.test(a=a.replace(i,""));return f||l.test(a)?m(a.slice(2),f?2:8):j.test(a)?g:+a}var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},f="Expected a function",g=NaN,h="[object Symbol]",i=/^\s+|\s+$/g,j=/^[-+]0x[0-9a-f]+$/i,k=/^0b[01]+$/i,l=/^0o[0-7]+$/i,m=parseInt,n="object"==(void 0===b?"undefined":e(b))&&b&&b.Object===Object&&b,o="object"==("u"<typeof self?"undefined":e(self))&&self&&self.Object===Object&&self,p=n||o||Function("return this")(),q=Object.prototype.toString,r=Math.max,s=Math.min,t=function(){return p.Date.now()};a.exports=function(a,b,e){var g=!0,h=!0;if("function"!=typeof a)throw TypeError(f);return c(e)&&(g="leading"in e?!!e.leading:g,h="trailing"in e?!!e.trailing:h),function(a,b,e){function g(b){var c=l,d=m;return l=m=void 0,u=b,o=a.apply(d,c)}function h(a){var c=a-q,d=a-u;return void 0===q||c>=b||c<0||w&&d>=n}function i(){var a,c,d,e=t();return h(e)?j(e):void(p=setTimeout(i,(a=e-q,c=e-u,d=b-a,w?s(d,n-c):d)))}function j(a){return p=void 0,x&&l?g(a):(l=m=void 0,o)}function k(){var a,c=t(),d=h(c);if(l=arguments,m=this,q=c,d){if(void 0===p)return u=a=q,p=setTimeout(i,b),v?g(a):o;if(w)return p=setTimeout(i,b),g(q)}return void 0===p&&(p=setTimeout(i,b)),o}var l,m,n,o,p,q,u=0,v=!1,w=!1,x=!0;if("function"!=typeof a)throw TypeError(f);return b=d(b)||0,c(e)&&(v=!!e.leading,n=(w="maxWait"in e)?r(d(e.maxWait)||0,b):n,x="trailing"in e?!!e.trailing:x),k.cancel=function(){void 0!==p&&clearTimeout(p),u=0,l=q=m=p=void 0},k.flush=function(){return void 0===p?o:j(t())},k}(a,b,{leading:g,maxWait:b,trailing:h})}}).call(b,function(){return this}())},function(a,b){(function(b){"use strict";function c(a){var b=void 0===a?"undefined":e(a);return!!a&&("object"==b||"function"==b)}function d(a){if("number"==typeof a)return a;if("symbol"==(void 0===(b=a)?"undefined":e(b))||b&&"object"==(void 0===b?"undefined":e(b))&&p.call(b)==g)return f;if(c(a)){var b,d="function"==typeof a.valueOf?a.valueOf():a;a=c(d)?d+"":d}if("string"!=typeof a)return 0===a?a:+a;var m=j.test(a=a.replace(h,""));return m||k.test(a)?l(a.slice(2),m?2:8):i.test(a)?f:+a}var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},f=NaN,g="[object Symbol]",h=/^\s+|\s+$/g,i=/^[-+]0x[0-9a-f]+$/i,j=/^0b[01]+$/i,k=/^0o[0-7]+$/i,l=parseInt,m="object"==(void 0===b?"undefined":e(b))&&b&&b.Object===Object&&b,n="object"==("u"<typeof self?"undefined":e(self))&&self&&self.Object===Object&&self,o=m||n||Function("return this")(),p=Object.prototype.toString,q=Math.max,r=Math.min,s=function(){return o.Date.now()};a.exports=function(a,b,e){function f(b){var c=k,d=l;return k=l=void 0,t=b,n=a.apply(d,c)}function g(a){var c=a-p,d=a-t;return void 0===p||c>=b||c<0||v&&d>=m}function h(){var a,c,d,e=s();return g(e)?i(e):void(o=setTimeout(h,(a=e-p,c=e-t,d=b-a,v?r(d,m-c):d)))}function i(a){return o=void 0,w&&k?f(a):(k=l=void 0,n)}function j(){var a,c=s(),d=g(c);if(k=arguments,l=this,p=c,d){if(void 0===o)return t=a=p,o=setTimeout(h,b),u?f(a):n;if(v)return o=setTimeout(h,b),f(p)}return void 0===o&&(o=setTimeout(h,b)),n}var k,l,m,n,o,p,t=0,u=!1,v=!1,w=!0;if("function"!=typeof a)throw TypeError("Expected a function");return b=d(b)||0,c(e)&&(u=!!e.leading,m=(v="maxWait"in e)?q(d(e.maxWait)||0,b):m,w="trailing"in e?!!e.trailing:w),j.cancel=function(){void 0!==o&&clearTimeout(o),t=0,k=p=l=o=void 0},j.flush=function(){return void 0===o?n:i(s())},j}}).call(b,function(){return this}())},function(a,b){"use strict";function c(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function d(a){a&&a.forEach(function(a){var b=Array.prototype.slice.call(a.addedNodes),c=Array.prototype.slice.call(a.removedNodes);if(function a(b){var c=void 0,d=void 0;for(c=0;c<b.length;c+=1)if((d=b[c]).dataset&&d.dataset.aos||d.children&&a(d.children))return!0;return!1}(b.concat(c)))return e()})}Object.defineProperty(b,"__esModule",{value:!0});var e=function(){};b.default={isSupported:function(){return!!c()},ready:function(a,b){var f=window.document,g=new(c())(d);e=b,g.observe(f.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}}},function(a,b){"use strict";function c(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(b,"__esModule",{value:!0});var d=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),e=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,f=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,g=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,h=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;b.default=new(function(){function a(){if(!(this instanceof a))throw TypeError("Cannot call a class as a function")}return d(a,[{key:"phone",value:function(){var a=c();return!(!e.test(a)&&!f.test(a.substr(0,4)))}},{key:"mobile",value:function(){var a=c();return!(!g.test(a)&&!h.test(a.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),a}())},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var c=function(a,b,c){var d=a.node.getAttribute("data-aos-once");b>a.position?a.node.classList.add("aos-animate"):void 0===d||"false"!==d&&(c||"true"===d)||a.node.classList.remove("aos-animate")};b.default=function(a,b){var d=window.pageYOffset,e=window.innerHeight;a.forEach(function(a,f){c(a,e+d,b)})}},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d,e=(d=c(12))&&d.__esModule?d:{default:d};b.default=function(a,b){return a.forEach(function(a,c){a.node.classList.add("aos-init"),a.position=(0,e.default)(a.node,b.offset)}),a}},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d,e=(d=c(13))&&d.__esModule?d:{default:d};b.default=function(a,b){var c=0,d=0,f=window.innerHeight,g={offset:a.getAttribute("data-aos-offset"),anchor:a.getAttribute("data-aos-anchor"),anchorPlacement:a.getAttribute("data-aos-anchor-placement")};switch(g.offset&&!isNaN(g.offset)&&(d=parseInt(g.offset)),g.anchor&&document.querySelectorAll(g.anchor)&&(a=document.querySelectorAll(g.anchor)[0]),c=(0,e.default)(a).top,g.anchorPlacement){case"top-bottom":break;case"center-bottom":c+=a.offsetHeight/2;break;case"bottom-bottom":c+=a.offsetHeight;break;case"top-center":c+=f/2;break;case"bottom-center":c+=f/2+a.offsetHeight;break;case"center-center":c+=f/2+a.offsetHeight/2;break;case"top-top":c+=f;break;case"bottom-top":c+=a.offsetHeight+f;break;case"center-top":c+=a.offsetHeight/2+f}return g.anchorPlacement||g.offset||isNaN(b)||(d=b),c+d}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b.default=function(a){for(var b=0,c=0;a&&!isNaN(a.offsetLeft)&&!isNaN(a.offsetTop);)b+=a.offsetLeft-("BODY"!=a.tagName?a.scrollLeft:0),c+=a.offsetTop-("BODY"!=a.tagName?a.scrollTop:0),a=a.offsetParent;return{top:c,left:b}}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b.default=function(a){return a=a||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(a,function(a){return{node:a}})}}];function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="dist/",b(0)}()},43584,a=>{"use strict";var b=a.i(87924),c=a.i(31626),d=a.i(71987),e=a.i(38246);let f=String.raw`<!doctype html>
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
</html>`;function g(){return(0,b.jsx)("div",{className:"flex-1 overflow-hidden rounded-[1.25rem] border border-[#ff8fc2]/20 bg-[#4b1230] shadow-[0_24px_70px_rgba(45,5,25,0.45)] min-h-[560px] sm:min-h-[620px] lg:min-h-0",children:(0,b.jsx)("iframe",{title:"Consumer protection compliance chatbot preview",srcDoc:f,sandbox:"allow-scripts",scrolling:"no",loading:"lazy",referrerPolicy:"no-referrer",tabIndex:-1,className:"pointer-events-none block h-full min-h-[560px] w-full border-0 sm:min-h-[620px] lg:min-h-0"})})}var h=a.i(48230),i=a.i(68114);function j(a,b){let c=a?.trim();return c&&"#"!==c?c:b}function k({href:a,fallbackHref:c,className:d,children:f}){return(0,b.jsx)(e.default,{href:j(a,c),className:(0,i.cn)("inline-flex items-center justify-center",d),children:f})}var l=a.i(50154),m=a.i(70106);let n=(0,m.default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);var o=a.i(32860),p=a.i(33441),q=a.i(5784);let r=(0,m.default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]),s=(0,m.default)("chart-no-axes-column-increasing",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]),t=(0,m.default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);var u=a.i(76537),u=u;let v=(0,m.default)("plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]);var w=a.i(4416),x=a.i(71476),y=a.i(72131);function z(a){if(!a)return!1;let b=a.toLowerCase();return b.endsWith(".mp4")||b.endsWith(".webm")||b.endsWith(".mov")||b.endsWith(".ogv")}function A(a){if(!a.hostname.toLowerCase().includes("drive.google.com"))return null;let b=a.pathname.match(/\/file\/d\/([^/]+)/);if(b?.[1])return b[1];let c=a.searchParams.get("id");return c?.trim()||null}function B(a){if(a.pathname.includes("/preview"))return a.toString();let b=A(a);return b?`https://drive.google.com/file/d/${b}/preview`:null}function C(a){return a?a.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim():""}let D=[{id:"tab-mcp",mobile:"Workflow Builder",desktop:"Workflow Builder",title:"No-Code Workflow Builder & Intent Studio",body:"Build agent workflows visually with clear intent definition and execution logic.",points:["Drag-and-drop workflow design","Intent configuration and flow logic","Faster prototyping and deployment"],icon:p.Check,video:"/images/videos-home/workflow-builder.mp4"},{id:"tab-governance-ai",mobile:"Orchestration",desktop:"Orchestration",title:"Agent Orchestration Engine",body:"Coordinate multiple AI agents across enterprise workflows.",points:["Multi-agent collaboration","Task sequencing and orchestration","Reliable workflow execution"],icon:w.ShieldCheck,video:"/images/videos-home/multi-agent.mp4"},{id:"tab-multimodal",mobile:"EvalOps",desktop:"EvalOps",title:"Built-in EvalOps & Monitoring",body:"Track, evaluate, and improve agent performance continuously.",points:["Execution visibility","Performance monitoring","Built-in evaluation framework"],icon:u.default},{id:"tab-observability",mobile:"Guardrails",desktop:"Guardrails",title:"AI Governance Guardrails & Policy Enforcement",body:"Apply enterprise control across AI workflows and agent actions.",points:["Policy enforcement","Role-based access control","Audit trails and compliance visibility"],icon:n,video:"/images/videos-home/guardrail.mp4"},{id:"tab-integrations",mobile:"MCP Integrations",desktop:"MCP Integration",title:"MCP Administration & Integrations",body:"Securely connect agents with enterprise systems through Model Context Protocol (MCP).",points:["Centralized MCP management","Secure access to tools, APIs, and databases","Controlled enterprise data connectivity"],icon:v,video:"/images/videos-home/mcp.mp4"},{id:"tab-handling",mobile:"Multimodal",desktop:"Multimodal",title:"Multimodal Data Handling",body:"Enable agents to work across multiple data formats and enterprise content types.",points:["Text and documents","PDFs, images, and video","Emails, databases, and APIs"],icon:n},{id:"tab-infra",mobile:"Deployment",desktop:"Deployment",title:"Flexible Deployment Infrastructure",body:"Deploy WiiZ based on enterprise infrastructure needs.",points:["SaaS or self-hosted","Private cloud or on-premise","Air-gapped environments"],icon:n}],E=[{id:"card-1",name:"Sai Shruthi",role:"Agentic AI Developer",image:"https://ui-avatars.com/api/?name=Sai+Shruthi&background=912059&color=ffffff&bold=true",quote:"WiiZ has been instrumental in bridging the gap between AI capabilities and business applications. It supports practical implementation, making it easier to deliver scalable and impactful solutions."},{id:"card-2",name:"Paarth",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Paarth&background=D87AAA&color=ffffff&bold=true",quote:"Using WiiZ has significantly improved the way I build and manage AI workflows. The platform is intuitive yet powerful, reducing manual effort and accelerating workflow development."},{id:"card-3",name:"Gowtham Sai",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Gowtham+Sai&background=7a314f&color=ffffff&bold=true",quote:"WiiZ redefines the integration of automation and AI through a highly intuitive and scalable platform. It transformed complex concepts into efficient real-world workflows with speed and flexibility."},{id:"card-4",name:"Aravind",role:"Software Engineer",image:"https://ui-avatars.com/api/?name=Aravind&background=4f2238&color=ffffff&bold=true",quote:"WiiZ transforms the complexity of AI orchestration into an intuitive, streamlined process. It has been a significant catalyst in advancing my technical expertise and understanding of enterprise AI efficiency."},{id:"card-5",name:"Ankur",role:"AI Engineer",image:"https://ui-avatars.com/api/?name=Ankur&background=aa5b7f&color=ffffff&bold=true",quote:"WiiZ is a strong platform for building AI workflows in a clear and structured way. It simplifies complex automation while still allowing full control over how systems are designed."}],F=[{question:"What is WiiZ?",answer:"WiiZ is an Enterprise Agentic AI Operating System that enables organizations to design, orchestrate, govern, monitor, and scale AI agents from one unified platform."},{question:"How is WiiZ different from traditional AI automation platforms?",answer:"WiiZ goes beyond workflow automation by providing enterprise-grade AI orchestration, governance, observability, EvalOps, multi-agent coordination, and centralized AI operations in a single platform."},{question:"Can WiiZ orchestrate multiple AI agents and models together?",answer:"Yes. WiiZ supports multi-agent orchestration and centralized provisioning across multiple LLMs, VLMs, enterprise systems, APIs, and workflows."},{question:"Does WiiZ provide AI governance and compliance controls?",answer:"Yes. WiiZ includes enterprise governance capabilities such as policy enforcement, audit visibility, monitoring, guardrails, access control, and AI execution oversight."},{question:"Can WiiZ work with existing enterprise systems?",answer:"Yes. WiiZ integrates with enterprise applications, APIs, databases, cloud platforms, and existing AI infrastructure through its orchestration and integration framework."},{question:"Does WiiZ support on-premise or air-gapped deployments?",answer:"Yes. WiiZ supports SaaS, private cloud, on-premise, and air-gapped enterprise deployments for organizations with strict security and compliance requirements."},{question:"What is EvalOps in WiiZ?",answer:"EvalOps continuously monitors AI workflows, agent performance, hallucinations, execution quality, and operational reliability to ensure trustworthy enterprise AI operations."},{question:"Who is WiiZ designed for?",answer:"WiiZ is designed for enterprise business teams, AI engineering teams, IT governance teams, system integrators, and organizations scaling enterprise AI adoption."},{question:"Does WiiZ require coding expertise?",answer:"No. WiiZ includes a no-code orchestration environment that allows teams to design and manage AI workflows visually while still supporting advanced extensibility for technical teams."},{question:"Can WiiZ monitor AI usage and operational costs?",answer:"Yes. WiiZ provides centralized visibility into AI usage, token consumption, workflow execution, performance metrics, and operational insights across the enterprise."},{question:"How does WiiZ help enterprises scale AI adoption?",answer:"WiiZ centralizes AI orchestration, governance, visibility, and operations, helping organizations move from fragmented AI experiments to scalable enterprise AI operations."},{question:"Is WiiZ only for AI chatbots?",answer:"No. WiiZ supports enterprise AI workflows, autonomous agents, orchestration pipelines, multimodal AI operations, business process automation, and cross-system AI collaboration."},{question:"What deployment models does WiiZ support?",answer:"WiiZ supports cloud, private tenant, hybrid, self-hosted, and enterprise on-premise deployments."},{question:"Can WiiZ support enterprise security requirements?",answer:"Yes. WiiZ supports enterprise-grade security including RBAC, JWT authentication, audit logging, credential vaulting, governance controls, and policy enforcement."},{question:"Why do enterprises need an AI Operating System?",answer:"As AI adoption grows, enterprises need centralized orchestration, governance, visibility, and operational control to manage AI agents securely and at scale. WiiZ provides that unified control layer."}],G=[{title:"Enterprise Business Teams",image:"/images/Product_builder.jpg",desc:"Adopt AI confidently across your everyday business operations with visibility, governance, and measurable performance.",bullets:["Difficulty moving AI from pilots to daily operations","Limited visibility into AI performance and business impact","Low confidence in scaling AI across teams and workflows"],cta:"Book an Appointment",positive:!1},{title:"Enterprise IT & AI Governance",image:"/images/Enterprice_it.jpg",desc:"Design, Deploy, Maintain centralized control, governance, security, and compliance across enterprise AI operations.",bullets:["Shadow AI and unmanaged agents","Lack of AI governance and observability","Compliance, security, and audit risks"],cta:"Book an Appointment",positive:!0},{title:"System Integrators & Partners",image:"/images/system_integrator.jpg",desc:"Deliver enterprise AI transformation faster with a unified orchestration and governance platform.",bullets:["Complex enterprise integrations","Managing multi-client AI deployments","Long implementation timelines"],cta:"Partner with Us",positive:!1},{title:"Legacy Product Enhancement",image:"/images/Ai_Team.jpg",desc:"Enhance your existing platforms with ease using the Embedded WiiZ Platform",bullets:["Multi-agent orchestration complexity","Integrating models, APIs, and enterprise systems","Scaling AI workflows into production"],cta:"Partner with Us",positive:!0}],H={"Start Free":"/register","Book an Appointment":"/contact","Partner with Us":"/partner"};function I({label:a,className:c=""}){return(0,b.jsxs)("div",{className:`relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] ${c}`,children:[(0,b.jsx)("div",{className:"absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20"}),(0,b.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"}),(0,b.jsx)("div",{className:"relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center",children:(0,b.jsx)("div",{children:(0,b.jsx)("div",{className:"text-2xl font-bold text-white",children:a})})})]})}function J({managedContent:a,heroSection:f,homeFeatures:i=[],homeUseCases:m=[]}){let n=a.hero,u=i.length?i.map(a=>({id:`feature-${a.id}`,mobile:a.label,desktop:a.label,title:a.title,body:a.description??"",points:a.features,icon:p.Check,mediaType:a.mediaType,mediaUrl:a.mediaUrl})):D.map(a=>({...a,mediaType:a.video?"video":null,mediaUrl:a.video??null})),v=n.buttons.find(a=>"primary"===a.variant)??n.buttons[0],w=n.buttons.find(a=>"secondary"===a.variant)??n.buttons[1],J=function(a){if(!a)return null;let[b,c]=a.split("/");return b&&c?`/api/media/${b}/${c}`:null}(f?.filepath??null),K=f?.heroHeading?.trim()||n.heading,L=f?.highlightedHeading?.trim()||n.highlightedText,M=f?.shortDescription?.trim()||n.subheading,N=f?.buttonText?.trim()||w?.label||"Get Started",O=f?.buttonText2?.trim()||v?.label||"Book Enterprise Demo",P=j(w?.href,"/register"),Q=j(v?.href,"/contact"),R=m[0]??null,S=m.slice(1,3),[T,U]=(0,y.useState)(u[0]?.id??""),V=u.some(a=>a.id===T)?T:u[0]?.id??"",W=2*E.length,X=[...E,...E,...E,...E,...E],[Y,Z]=(0,y.useState)(W),[$,_]=(0,y.useState)(W),[aa,ab]=(0,y.useState)(null),[ac,ad]=(0,y.useState)(!1),ae=(0,y.useRef)(null),af=(0,y.useRef)([]),ag=(0,y.useRef)(null),ah=(0,y.useRef)(null),ai=(0,y.useRef)(!1),aj=(0,y.useRef)(!1),ak=E[Y%E.length],al=E[$%E.length];(0,y.useEffect)(()=>{x.default.init({duration:800,once:!1,offset:100,mirror:!0})},[]),(0,y.useEffect)(()=>{let a=window.setInterval(()=>{Z(a=>a+1)},2500);return()=>window.clearInterval(a)},[]),(0,y.useEffect)(()=>{let a=window.setInterval(()=>{_(a=>a+1)},2500);return()=>window.clearInterval(a)},[]),(0,y.useEffect)(()=>{let a=ae.current,b=af.current[Y];a&&b&&a.scrollTo({left:b.offsetLeft-a.offsetWidth/2+b.offsetWidth/2,behavior:"smooth"})},[Y]),(0,y.useEffect)(()=>{let a=ae.current;if(!a)return;let b=E.length,c=Y;if(Y>=4*b?c=Y-b:Y<b&&(c=Y+b),c===Y)return;let d=af.current[c];d&&window.requestAnimationFrame(()=>{a.scrollTo({left:d.offsetLeft-a.offsetWidth/2+d.offsetWidth/2,behavior:"auto"}),Z(c)})},[Y]),(0,y.useEffect)(()=>{let a=ag.current;if(!a||ai.current)return;let b=a.children[W];b&&(aj.current=!0,a.scrollTo({left:b.offsetLeft,behavior:"auto"}),window.requestAnimationFrame(()=>{ai.current=!0,aj.current=!1}))},[W]),(0,y.useEffect)(()=>{let a=ag.current;if(!a||!ai.current)return;let b=a.children[$];b&&(aj.current=!0,a.scrollTo({left:b.offsetLeft,behavior:"smooth"}),window.setTimeout(()=>{aj.current=!1},350))},[$]),(0,y.useEffect)(()=>{let a=ag.current;if(!a||!ai.current)return;let b=E.length,c=$;if($>=4*b?c=$-b:$<b&&(c=$+b),c===$)return;let d=a.children[c];d&&window.requestAnimationFrame(()=>{aj.current=!0,a.scrollTo({left:d.offsetLeft,behavior:"auto"}),_(c),window.requestAnimationFrame(()=>{aj.current=!1})})},[$]),(0,y.useEffect)(()=>()=>{null!==ah.current&&window.clearTimeout(ah.current)},[]);let am=F.slice(0,3);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("main",{className:"jsx-447db2994406fc3a bg-[#1D0612] min-h-[70vh] lg:min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden px-4 py-8 md:py-20 font-sans",children:[J?(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a absolute inset-0",children:[z(J)?(0,b.jsx)("video",{autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"jsx-447db2994406fc3a h-full w-full object-cover opacity-55",children:(0,b.jsx)("source",{src:J,className:"jsx-447db2994406fc3a"})}):(0,b.jsx)(d.default,{src:J,alt:K,fill:!0,className:"object-cover opacity-55",sizes:"100vw"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-[#1D0612]/50"})]}):null,(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-hero blur-[160px] rounded-full pointer-events-none"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a max-w-6xl mx-auto text-center relative z-10",children:[(0,b.jsxs)("h1",{"data-aos":"fade-up","data-aos-duration":"1000",className:"jsx-447db2994406fc3a text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight md:leading-[1.1] font-bold text-white mb-3 md:mb-6 tracking-tight",children:[K,(0,b.jsx)("br",{className:"jsx-447db2994406fc3a"}),(0,b.jsx)("span",{className:"jsx-447db2994406fc3a bg-gradient-to-r from-secondary to-[#E68F17] bg-clip-text text-transparent",children:L})]}),(0,b.jsx)("p",{"data-aos":"fade-up","data-aos-duration":"1000","data-aos-delay":"200",className:"jsx-447db2994406fc3a text-base md:text-xl text-[#FDFDFD] max-w-2xl text-center  mx-auto mb-5 md:mb-10",children:M}),(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-duration":"1000","data-aos-delay":"400",className:"jsx-447db2994406fc3a flex gap-4 flex-col sm:flex-row justify-center items-center",children:[(0,b.jsx)(k,{href:P,fallbackHref:"/register",className:"hero-cta inline-flex w-fit items-center justify-center bg-transparent border border-white/50 text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300",children:N}),(0,b.jsxs)(k,{href:Q,fallbackHref:"/contact",className:"hero-cta inline-flex w-fit items-center justify-center bg-gradient-to-r from-quaternary to-[#AD2D45] text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300 group",children:[O,(0,b.jsx)(o.ArrowRight,{className:"w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"})]})]})]})]}),(0,b.jsx)("section",{className:"jsx-447db2994406fc3a border-y border-gray-200 bg-white flex items-stretch font-sans",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto flex items-center justify-start w-full overflow-hidden relative py-6 md:py-8 lg:py-10",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a flex-shrink-0 hidden md:flex items-center justify-center w-40 xl:w-64 border-r border-gray-200 bg-white z-10",children:(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-sm md:text-base font-medium text-gray-800 tracking-[0.15em] uppercase",children:"Trusted By"})}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a flex-1 flex items-center overflow-hidden relative",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a flex animate-scroll whitespace-nowrap items-center w-max",children:[0,1].map(a=>(0,b.jsx)("div",{className:"jsx-447db2994406fc3a flex items-center space-x-12 md:space-x-10 px-6 md:px-8",children:l.partnerLogos.map((c,e)=>(0,b.jsx)("span",{className:"jsx-447db2994406fc3a relative flex h-10 w-36 items-center justify-center md:h-12 md:w-44",children:(0,b.jsx)(d.default,{src:c.logoPath,alt:`${c.name} logo`,fill:!0,sizes:"176px",className:`object-contain transition-transform ${c.homepageLogoClassName??""}`})},`${a}-${c.name}-${c.logoPath}-${e}`))},a))})]})]})}),(0,b.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 left-0 w-full max-w-[500px] h-full bg-[url('/images/side-left.png')] bg-no-repeat bg-left-top pointer-events-none"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 right-0 w-full max-w-[500px] h-full bg-[url('/images/side-right.png')] bg-no-repeat bg-right-top pointer-events-none"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-section",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a text-center max-w-3xl mx-auto mb-8 md:mb-16",children:[(0,b.jsx)("h2",{"data-aos":"fade-up","data-aos-duration":"700",className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight",children:"Everything you need to move from prototype to production"}),(0,b.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a text-base md:text-lg font-light text-[#EBEBEB] md:px-20",children:"WiiZ brings together the core capabilities required to Orchestrate enterprise AI agents at scale."})]}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a flex md:hidden flex-wrap justify-center gap-2 items-center w-max mx-auto mb-8 overflow-x-auto max-w-full hide-scrollbar",children:u.map(a=>(0,b.jsx)("button",{type:"button",onClick:()=>U(a.id),className:`jsx-447db2994406fc3a px-4 py-2 rounded-full text-sm border border-white/10 transition-all duration-300 ${V===a.id?"text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg bg-black/30":"text-[#DFDFDF] bg-black/30 hover:text-white"}`,children:a.mobile},a.id))}),(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"300",className:"jsx-447db2994406fc3a bg-gradient-to-t from-[#FFFFFF0D] to-[#0D0A1947] backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-2xl md:rounded-3xl p-4 md:p-4 lg:p-10 shadow-2xl relative",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:flex flex-wrap justify-center items-center bg-black/30 rounded-full p-2 xl:p-2 lg:w-max lg:mx-auto mb-6 lg:mb-12 border border-white/5 overflow-x-auto max-w-full",children:u.map(a=>(0,b.jsx)("button",{type:"button",onClick:()=>U(a.id),className:`jsx-447db2994406fc3a px-2 lg:px-5 xl:px-6 py-2 lg:py-2.5 rounded-full text-base md:text-[13px] lg:text-sm transition-all duration-300 ${V===a.id?"text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg":"text-[#DFDFDF] hover:text-white"}`,children:a.desktop},a.id))}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a relative grid grid-cols-1 grid-rows-1 w-full items-start",children:u.map(a=>{let c=a.icon,d=V===a.id,f=function(a,b){let c=function(a){if(!a)return null;if(a.startsWith("/"))return a;try{let b=new URL(a);return["http:","https:"].includes(b.protocol)?b.toString():null}catch{let[b,c]=a.split("/");if(!b||!c)return null;return`/api/media/${b}/${c}`}}(b);if(!c)return null;if("video"!==a)try{let a,b=new URL(c),d=B(b);if(d)return{kind:"embed",src:d};return{kind:"image",src:((a=A(b))?`https://drive.google.com/thumbnail?id=${a}&sz=w2000`:null)??c}}catch{return{kind:"image",src:c}}if(z(c))return{kind:"video",src:c};try{let a=new URL(c),b=function(a){let b=a.hostname.toLowerCase();if(b.includes("youtu.be")){let b=a.pathname.split("/").filter(Boolean)[0];return b?`https://www.youtube.com/embed/${b}`:null}if(b.includes("youtube.com")){if(a.pathname.startsWith("/shorts/")){let b=a.pathname.split("/")[2];return b?`https://www.youtube.com/embed/${b}`:null}if(a.pathname.startsWith("/embed/"))return a.toString();let b=a.searchParams.get("v");return b?`https://www.youtube.com/embed/${b}`:null}return null}(a)??function(a){if(!a.hostname.toLowerCase().includes("vimeo.com"))return null;if(a.pathname.startsWith("/video/"))return`https://player.vimeo.com${a.pathname}`;let b=a.pathname.split("/").filter(Boolean).find(a=>/^\d+$/.test(a));return b?`https://player.vimeo.com/video/${b}`:null}(a)??B(a)??function(a){if(!a.hostname.toLowerCase().includes("loom.com"))return null;if(a.pathname.startsWith("/embed/"))return a.toString();let b=a.pathname.split("/").filter(Boolean).pop();return b?`https://www.loom.com/embed/${b}`:null}(a)??c;return{kind:"embed",src:b}}catch{return{kind:"video",src:c}}}(a.mediaType,a.mediaUrl);return(0,b.jsxs)("div",{className:`jsx-447db2994406fc3a row-start-1 col-start-1 grid md:grid-cols-2 gap-0 md:gap-12 items-center md:items-stretch transition-all duration-500 ${d?"opacity-100 z-10 pointer-events-auto":"opacity-0 z-0 pointer-events-none"}`,children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a order-1 md:order-0 flex flex-col justify-center py-4 md:py-0",children:[(0,b.jsx)("h3",{className:"jsx-447db2994406fc3a text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4",children:a.title}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-gray-300 mb-4 lg:mb-8 leading-relaxed",children:a.body}),(0,b.jsx)("ul",{className:"jsx-447db2994406fc3a space-y-2 lg:space-y-4",children:a.points.map(a=>(0,b.jsxs)("li",{className:"jsx-447db2994406fc3a flex items-start",children:[(0,b.jsx)(c,{className:"w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-secondary"}),(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-gray-300",children:a})]},a))})]}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a order-0 md:order-1 h-full min-h-[260px] overflow-hidden",children:f?(0,b.jsx)("div",{className:"jsx-447db2994406fc3a relative h-[260px] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl md:h-full md:min-h-[320px] md:max-h-[460px]",children:"video"===f.kind?(0,b.jsxs)("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"jsx-447db2994406fc3a block h-full w-full max-w-full object-cover",children:[(0,b.jsx)("source",{src:f.src,type:"video/mp4",className:"jsx-447db2994406fc3a"}),"Your browser does not support the video tag."]}):"embed"===f.kind?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("iframe",{src:f.src,title:a.title,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,className:"jsx-447db2994406fc3a block h-full min-h-[260px] w-full max-w-full"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute bottom-3 right-3",children:(0,b.jsx)(e.default,{href:a.mediaUrl??f.src,target:"_blank",rel:"noreferrer",className:"inline-flex items-center rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur",children:"Open media"})})]}):(0,b.jsx)("img",{src:f.src,alt:a.title,className:"jsx-447db2994406fc3a block h-full w-full max-w-full object-cover object-center"})}):(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] rounded-xl",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center",children:(0,b.jsx)("div",{className:"jsx-447db2994406fc3a text-2xl font-bold text-white",children:a.desktop})})]})})]},a.id)})})]})]})]}),(0,b.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,b.jsxs)("div",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a flex flex-col md:flex-row md:items-end gap-6 justify-between mb-8 md:mb-12",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a flex flex-col md:items-start items-center",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a inline-block px-3 py-1 rounded-full border border-white/40 bg-[#211A2533] mb-2 md:mb-4",children:(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-[12px] font-bold text-secondary tracking-widest uppercase",children:"Use Cases"})}),(0,b.jsx)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-white tracking-tight",children:"Leaderboard of WiiZ Built AI Agents"}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-base lg:text-lg mt-3 text-center md:text-left font-light text-[#EBEBEB]",children:"Examples of AI agents built on WiiZ for real enterprise workflows."})]}),(0,b.jsxs)(e.default,{href:"/ai-agents",className:"flex-shrink-0 hidden md:inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group",children:["View All Agents",(0,b.jsx)(o.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a lg:col-span-2 flex min-h-0 flex-col gap-6",children:R?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{"data-aos":"fade-right",className:"jsx-447db2994406fc3a bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:p-9 shadow-xl",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a grid gap-7 md:grid-cols-[1.1fr_1fr] md:items-center",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a mb-5 flex items-center gap-4",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center",children:(0,b.jsx)(r,{className:"w-6 h-6"})}),R.industryTitle?(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]",children:R.industryTitle}):null]}),(0,b.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl font-semibold text-gray-950 mb-5 tracking-tight",children:R.useCaseTitle}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-base md:text-lg text-gray-500 leading-relaxed",children:R.useCaseDescription||C(R.impactDescription)||R.challenges[0]||"Use case details are not available yet."})]}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a bg-[#fafaff] rounded-lg border border-[#edeefa] p-5 md:p-7 shadow-sm",children:[(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-[#922358] text-xs font-bold uppercase tracking-[0.35em] mb-7",children:"Impact"}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-base text-gray-500 leading-relaxed",children:C(R.impactDescription)||R.useCaseDescription||"Impact details are not available for this use case yet."}),(0,b.jsxs)(e.default,{href:{pathname:"/ai-agents/usecasedetail",query:{useCaseId:R.useCaseId,industryTitle:R.industryTitle??"",functionTitle:R.functionTitle??""}},className:"mt-6 inline-flex items-center text-[#922358] font-semibold group",children:["Explore Use Case",(0,b.jsx)(o.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]})]})}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-2 gap-6",children:S.map((a,c)=>(0,b.jsxs)("div",{"data-aos":"fade-right","data-aos-duration":"1000",className:"jsx-447db2994406fc3a bg-white rounded-2xl md:rounded-3xl p-6 lg:p-9 shadow-xl min-h-[260px] flex flex-col",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a mb-5 flex items-center gap-4",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center",children:(0,b.jsx)(0===c?s:t,{className:"jsx-447db2994406fc3a w-6 h-6"})}),a.industryTitle?(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]",children:a.industryTitle}):null]}),(0,b.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl font-semibold text-gray-950 mb-4 tracking-tight",children:a.useCaseTitle}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-base text-gray-500 leading-relaxed max-w-sm",children:a.useCaseDescription||C(a.impactDescription)||a.challenges[0]||"Use case details are not available yet."})]}),(0,b.jsxs)(e.default,{href:{pathname:"/ai-agents/usecasedetail",query:{useCaseId:a.useCaseId,industryTitle:a.industryTitle??"",functionTitle:a.functionTitle??""}},className:"mt-auto inline-flex w-fit items-center text-[#922358] font-semibold pt-8 group",children:["Explore Use Case",(0,b.jsx)(o.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})]},a.id))})]}):null}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a md:col-span-1 lg:col-span-1 min-h-0",children:(0,b.jsx)("div",{"data-aos":"fade-left",className:"jsx-447db2994406fc3a bg-gradient-to-b from-[#91205996] to-[#6b1b4396] rounded-2xl md:rounded-2xl md:rounded-3xl shadow-2xl h-full min-h-0 flex flex-col border border-white/10",children:(0,b.jsx)(g,{})})})]}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a md:hidden flex w-full items-center justify-center",children:(0,b.jsxs)(e.default,{href:"/ai-agents",className:"inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 mt-6 group",children:["View All Agents",(0,b.jsx)(o.ArrowRight,{className:"w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"})]})})]})}),(0,b.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,b.jsx)("div",{"data-aos":"fade-down",className:"jsx-447db2994406fc3a text-center max-w-3xl mx-auto mb-8 md:mb-16",children:(0,b.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight",children:["Accelerating Enterprise AI Adoption"," ",(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-secondary"})]})}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 xl:gap-8",children:G.map(a=>(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a rounded-2xl md:rounded-3xl overflow-hidden flex flex-col bg-[#2b1c27] border border-white/5 shadow-2xl",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a h-[260px] sm:h-[200px] xl:h-[220px] lg:h-[150px] relative",children:a.image?(0,b.jsx)(d.default,{src:a.image,alt:a.title,fill:!0,className:"object-cover",sizes:"(max-width: 768px) 100vw, 50vw"}):(0,b.jsx)(I,{label:a.title})}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a p-4 sm:p-6 lg:p-4 xl:p-5 flex-1 flex flex-col justify-start",children:[(0,b.jsx)("h3",{className:"jsx-447db2994406fc3a text-xl sm:text-xl font-bold text-secondary mb-2 sm:mb-3 text-center",children:a.title}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a mb-2 md:mb-4 text-base text-gray-300 text-center",children:a.desc}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a mt-auto pt-6 text-center",children:(0,b.jsx)(k,{href:H[a.cta]??"/register",fallbackHref:"/register",className:"inline-flex w-fit items-center justify-center bg-gradient-to-r from-tertiary to-quaternary text-white hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300",children:a.cta})})]})]},a.title))})]})]}),(0,b.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-4 md:py-10 lg:py-20 relative overflow-hidden font-sans",children:(0,b.jsx)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-20 relative z-10",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a relative bg-gradient-to-t to-[#4639418F] from-[#4921421A] border border-white/5 rounded-[1rem] md:rounded-[2rem] py-12 px-6 sm:px-10 md:py-12 lg:py-20 shadow-[inset_0_12px_12px_-12px_#FF8E5D4D] flex flex-col items-center text-center overflow-hidden",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block",children:(0,b.jsxs)("svg",{width:"134",height:"215",viewBox:"0 0 134 215",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("g",{opacity:"0.25",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("path",{d:"M-12.9999 2H22.7404C35.4428 2.00007 45.7403 12.2976 45.7404 25V41.0986H45.7423V43.2051C45.7423 57.0122 56.9352 68.205 70.7423 68.2051H133.828V66.2051H70.7423C58.0398 66.205 47.7423 55.9076 47.7423 43.2051V26.6445H47.7404V25C47.7402 11.193 36.5473 6.8033e-05 22.7404 0H-12.9999V2Z",fill:"url(#paint0_linear_157_1104)",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M-12.9999 212.609H22.7404C35.4428 212.609 45.7403 202.312 45.7404 189.609V173.511H45.7423V171.404C45.7423 157.597 56.9352 146.404 70.7423 146.404H133.828V148.404H70.7423C58.0398 148.404 47.7423 158.702 47.7423 171.404V187.965H47.7404V189.609C47.7402 203.416 36.5473 214.609 22.7404 214.609H-12.9999V212.609Z",fill:"url(#paint1_linear_157_1104)",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M133.832 107.305H10.8231",stroke:"white",strokeOpacity:"0.2",strokeWidth:"2",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M133.832 107.305H52.4292",stroke:"url(#paint2_linear_157_1104)",strokeWidth:"2",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("defs",{className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("linearGradient",{id:"paint0_linear_157_1104",x1:"127.053",y1:"67.7351",x2:"-25.7935",y2:"26.8045",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("linearGradient",{id:"paint1_linear_157_1104",x1:"127.053",y1:"146.874",x2:"-25.7935",y2:"187.805",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("linearGradient",{id:"paint2_linear_157_1104",x1:"130.076",y1:"108.298",x2:"129.199",y2:"99.4158",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"white",className:"jsx-447db2994406fc3a"})]})]})]})}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block",children:(0,b.jsxs)("svg",{width:"135",height:"215",viewBox:"0 0 135 215",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("g",{opacity:"0.25",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("path",{d:"M146.83 2H111.09C98.3873 2.00007 88.0898 12.2976 88.0897 25V41.0986H88.0878V43.2051C88.0878 57.0122 76.8948 68.205 63.0878 68.2051H0.00183105V66.2051H63.0878C75.7903 66.205 86.0878 55.9076 86.0878 43.2051V26.6445H86.0897V25C86.0898 11.193 97.2827 6.8033e-05 111.09 0H146.83V2Z",fill:"url(#paint0_linear_157_1116)",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M146.83 212.41H111.09C98.3873 212.41 88.0898 202.113 88.0897 189.41V173.312H88.0878V171.205C88.0878 157.398 76.8948 146.205 63.0878 146.205H0.00183105V148.205H63.0878C75.7903 148.205 86.0878 158.503 86.0878 171.205V187.766H86.0897V189.41C86.0898 203.217 97.2827 214.41 111.09 214.41H146.83V212.41Z",fill:"url(#paint1_linear_157_1116)",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M0.000244141 107.205H123.009",stroke:"white",strokeOpacity:"0.2",strokeWidth:"2",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("path",{d:"M0.000244141 107.205H81.4034",stroke:"url(#paint2_linear_157_1116)",strokeWidth:"2",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("defs",{className:"jsx-447db2994406fc3a",children:[(0,b.jsxs)("linearGradient",{id:"paint0_linear_157_1116",x1:"6.7768",y1:"67.7351",x2:"159.624",y2:"26.8045",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("linearGradient",{id:"paint1_linear_157_1116",x1:"6.7768",y1:"146.675",x2:"159.624",y2:"187.606",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"0.5",stopColor:"white",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"#353535",className:"jsx-447db2994406fc3a"})]}),(0,b.jsxs)("linearGradient",{id:"paint2_linear_157_1116",x1:"3.75635",y1:"108.198",x2:"4.6335",y2:"99.3162",gradientUnits:"userSpaceOnUse",className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("stop",{stopColor:"#353535",className:"jsx-447db2994406fc3a"}),(0,b.jsx)("stop",{offset:"1",stopColor:"white",className:"jsx-447db2994406fc3a"})]})]})]})}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a relative z-20 max-w-3xl mx-auto w-full",children:[(0,b.jsxs)("h2",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight",children:["Operationalize Enterprise AI",(0,b.jsx)("br",{className:"jsx-447db2994406fc3a hidden md:block"}),"with Confidence"]}),(0,b.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a max-w-xl mx-auto text-base md:text-lg text-gray-300 mb-8 sm:mb-10 px-2 sm:px-0",children:"Defragment your AI Chaos with WiiZ, Centralize AI agents, governance, and observability across your Organization."}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a max-w-md mx-auto mb-8 mt-4",children:(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a grid grid-cols-4 gap-3 mt-5 justify-items-center",children:[(0,b.jsx)("img",{src:"/images/certificates/iso27001.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,b.jsx)("img",{src:"/images/certificates/hippa.jpg",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,b.jsx)("img",{src:"/images/certificates/gdpr.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"}),(0,b.jsx)("img",{src:"/images/certificates/aicpa.png",alt:"",className:"jsx-447db2994406fc3a rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"})]})}),(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0",children:[(0,b.jsx)(k,{href:"/register",fallbackHref:"/register",className:"relative z-10 w-full sm:w-auto inline-flex items-center justify-center border-white/50 text-white px-8 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300 shadow-xl border border-white/5",children:"Get Started"}),(0,b.jsx)(k,{href:"/contact",fallbackHref:"/contact",className:"relative z-10 w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-quaternary to-[#D87AAA] text-white px-8 sm:px-10 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300",children:"Book Enterprise Demo"})]})]})]})})}),(0,b.jsxs)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans bg-gray-900",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-24 mb-8 md:mb-16 relative md:min-h-[300px]",children:[(0,b.jsxs)("div",{"data-aos":"fade-right",className:"jsx-447db2994406fc3a flex flex-col justify-center items-center md:items-start ",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a inline-flex max-w-[120px] px-3 py-1 rounded-full border border-white/30 bg-[#211A2533] mb-4",children:(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-[12px] font-bold text-secondary tracking-widest uppercase",children:"TESTIMONIAL"})}),(0,b.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 leading-tight font-sans text-center md:text-left",children:["What our",(0,b.jsx)("br",{className:"jsx-447db2994406fc3a"}),"builders say"]}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-base md:text-lg text-gray-300 max-w-lg lg:max-w-md font-sans text-center md:text-left",children:"Real feedback from engineers and developers building practical AI workflows with WiiZ."})]}),(0,b.jsx)("div",{"data-aos":"fade-left","data-aos-delay":"100",className:"jsx-447db2994406fc3a relative w-full h-full hidden md:flex items-center mt-16 lg:mt-0",children:E.map(a=>(0,b.jsx)("div",{className:`jsx-447db2994406fc3a absolute w-full transition-all duration-500 ${a.id===ak.id?"opacity-100 translate-y-0 z-10":"opacity-0 translate-y-4 pointer-events-none z-0"}`,children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-xl md:rounded-2xl p-6 lg:p-10 shadow-2xl lg:h-[320px] h-[240px] overflow-hidden",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a flex items-center gap-4 mb-6",children:[(0,b.jsx)("img",{src:a.image,alt:a.name,className:"jsx-447db2994406fc3a w-12 h-12 rounded-full border border-white/10 object-cover"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a",children:[(0,b.jsx)("h4",{className:"jsx-447db2994406fc3a text-white font-semibold text-lg",children:a.name}),(0,b.jsx)("span",{className:"jsx-447db2994406fc3a text-gray-300 text-sm",children:a.role})]})]}),(0,b.jsxs)("p",{className:"jsx-447db2994406fc3a text-gray-300 text-lg leading-relaxed custom-line-clamp-4",children:['"',a.quote,'"']})]})},a.id))}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a md:hidden relative",children:[(0,b.jsx)("div",{ref:ag,onScroll:()=>{aj.current||(null!==ah.current&&window.clearTimeout(ah.current),ah.current=window.setTimeout(()=>{let a=ag.current;if(!a)return;let b=Array.from(a.children);if(!b.length)return;let c=a.scrollLeft+a.clientWidth/2,d=0,e=1/0;b.forEach((a,b)=>{let f=Math.abs(a.offsetLeft+a.offsetWidth/2-c);f<e&&(e=f,d=b)}),_(d)},120))},className:"jsx-447db2994406fc3a flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar scroll-smooth",children:X.map((a,c)=>(0,b.jsx)("div",{className:"jsx-447db2994406fc3a w-full shrink-0 snap-center",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a min-h-[200px] bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-[1rem] md:rounded-[1.5rem] p-6 shadow-xl",children:[(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a flex items-center gap-4 mb-4",children:[(0,b.jsx)("img",{src:a.image,alt:a.name,className:"jsx-447db2994406fc3a w-10 h-10 rounded-full object-cover"}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a flex flex-col",children:[(0,b.jsx)("h3",{className:"jsx-447db2994406fc3a text-[16px] font-semibold text-white leading-tight",children:a.name}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-[14px] font-normal text-[#a1949b] mt-1",children:a.role})]})]}),(0,b.jsx)("p",{className:"jsx-447db2994406fc3a text-sm md:text-[16px] font-normal text-[#e8e2e5] leading-relaxed tracking-wide custom-line-clamp-4",children:a.quote})]})},`${a.id}-mobile-${c}`))}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a mt-5 flex justify-center gap-2",children:E.map(a=>{let c=a.id===al.id;return(0,b.jsx)("button",{type:"button","aria-label":`Show testimonial from ${a.name}`,onClick:()=>_(W+E.findIndex(b=>b.id===a.id)),className:`jsx-447db2994406fc3a h-2 rounded-full transition-all duration-300 ${c?"w-4 bg-gradient-to-r from-quaternary to-[#D87AAA]":"w-2 bg-white/20"}`},`${a.id}-mobile-dot`)})})]})]}),(0,b.jsx)("div",{"data-aos":"fade-up","data-aos-delay":"200",className:"jsx-447db2994406fc3a lg:pt-0 md:pt-28 hidden md:block relative w-full border-b border-white/10",children:(0,b.jsx)("div",{ref:ae,className:"jsx-447db2994406fc3a flex overflow-x-auto snap-x snap-mandatory cursor-grab select-none no-scrollbar transition-all",children:X.map((a,c)=>{let d=c%E.length,e=c===Y;return(0,b.jsxs)("button",{ref:a=>{af.current[c]=a},type:"button",onClick:()=>Z(W+d),className:`jsx-447db2994406fc3a group flex-shrink-0 w-full md:w-1/3 xl:w-1/5 flex items-center gap-4 px-8 py-4 border-b-2 snap-start transition-all ${e?"bg-gradient-to-t from-white/15 to-transparent border-secondary":"hover:bg-white/5 border-transparent"}`,children:[(0,b.jsx)("img",{src:a.image,alt:a.name,className:`jsx-447db2994406fc3a w-12 h-12 rounded-full border-2 object-cover transition-colors ${e?"border-secondary/50":"border-transparent"}`}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a text-left overflow-hidden",children:[(0,b.jsx)("span",{className:"jsx-447db2994406fc3a block text-white font-medium truncate",children:a.name}),(0,b.jsx)("span",{className:"jsx-447db2994406fc3a block text-gray-400 text-sm truncate",children:a.role})]})]},`${a.id}-${c}`)})})})]})]}),(0,b.jsx)("section",{className:"jsx-447db2994406fc3a bg-primary py-8 md:py-12 lg:py-24 font-sans bg-gray-900 font-sans",children:(0,b.jsx)("div",{className:"jsx-447db2994406fc3a container mx-auto px-4 sm:px-6 lg:px-8",children:(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a col-span-1 md:col-span-5 pr-0 md:pr-12",children:(0,b.jsxs)("h2",{className:"jsx-447db2994406fc3a text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 tracking-tight leading-[1.1] text-center md:text-left",children:["Frequently Asked",(0,b.jsx)("br",{className:"jsx-447db2994406fc3a"}),"Questions"]})}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a col-span-1 md:col-span-7 gap-3 md:gap-0 flex flex-col md:border-t border-white/10",children:[am.map((a,c)=>{let d=F.findIndex(b=>b.question===a.question),e=aa===d;return(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":100*c,className:"jsx-447db2994406fc3a border md:border-0 rounded-xl md:rounded-none md:border-b border-white/10 faq-item px-4 md:px-0 bg-gradient-to-r from-[#B15081b8] to-[#632243b8] md:bg-none",children:[(0,b.jsxs)("button",{type:"button",onClick:()=>ab(e?null:d),className:"jsx-447db2994406fc3a w-full flex justify-between items-center py-3 md:py-6 text-left group focus:outline-none",children:[(0,b.jsx)("span",{className:"jsx-447db2994406fc3a font-sans text-base md:text-lg text-gray-200 group-hover:text-white transition-colors duration-200",children:a.question}),(0,b.jsx)(q.ChevronDown,{className:`w-5 h-5 text-[#D1CECE] transition-transform duration-300 ${e?"rotate-180":""}`})]}),(0,b.jsx)("div",{style:{maxHeight:160*!!e},className:"jsx-447db2994406fc3a overflow-hidden transition-all duration-300 ease-in-out",children:(0,b.jsx)("p",{className:"jsx-447db2994406fc3a font-sans pb-6 text-gray-300 text-base leading-relaxed",children:a.answer})})]},a.question)}),(0,b.jsx)("div",{"data-aos":"fade-up","data-aos-delay":"500",className:"jsx-447db2994406fc3a mt-4 md:mt-8 flex justify-center md:justify-end",children:(0,b.jsxs)("button",{type:"button",onClick:()=>window.dispatchEvent(new Event(h.WEBSITE_CHATBOT_OPEN_EVENT)),className:"jsx-447db2994406fc3a flex items-center gap-2 text-sm md:text-base px-6 py-2 md:py-2.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 focus:outline-none",children:[(0,b.jsx)("span",{className:"jsx-447db2994406fc3a",children:"View More"}),(0,b.jsx)(q.ChevronDown,{className:"w-4 h-4"})]})})]})]})})}),(0,b.jsxs)("section",{className:"jsx-447db2994406fc3a relative min-h-[380px] overflow-hidden bg-primary px-4 py-12 font-sans flex items-center justify-center sm:min-h-[420px] sm:py-14 md:min-h-[450px] md:py-12 lg:py-24",children:[(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 left-0 h-[120px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 right-0 h-[120px] w-[260px] translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 left-0 h-full w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute top-1/2 right-0 h-full w-[220%] translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]"}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute left-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-[350px] xl:h-[300px]",children:(0,b.jsx)("img",{src:"/images/cta-svg-left.png",alt:"",className:"jsx-447db2994406fc3a h-full"})}),(0,b.jsx)("div",{className:"jsx-447db2994406fc3a absolute right-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-auto xl:h-[300px]",children:(0,b.jsx)("img",{src:"/images/cta-svg-right.png",alt:"",className:"jsx-447db2994406fc3a h-full"})}),(0,b.jsxs)("div",{className:"jsx-447db2994406fc3a relative z-10 w-full max-w-2xl text-center sm:px-6",children:[(0,b.jsxs)("h2",{"data-aos":"fade-up",className:"jsx-447db2994406fc3a mx-auto mb-4 max-w-[18rem] text-[28px] font-bold leading-[1.15] tracking-tight text-white sm:max-w-xl sm:text-4xl md:mb-6 md:text-4xl lg:text-5xl",children:["Start Building Enterprise",(0,b.jsx)("br",{className:"jsx-447db2994406fc3a"}),"AI Agents Today"]}),(0,b.jsx)("p",{"data-aos":"fade-up","data-aos-delay":"100",className:"jsx-447db2994406fc3a mx-auto mb-7 max-w-[21rem] text-sm font-normal leading-relaxed text-gray-300/80 sm:mb-9 sm:max-w-xl sm:text-base md:text-[18px] lg:mb-10",children:"Join teams using WiiZ to design, deploy, and scale enterprise AI systems with confidence."}),(0,b.jsxs)("div",{"data-aos":"fade-up","data-aos-delay":"150",className:"jsx-447db2994406fc3a relative mx-auto flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4",children:[(0,b.jsx)(k,{href:"/register",fallbackHref:"/register",className:"relative z-10 inline-flex w-full items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base",children:"Get Started"}),(0,b.jsx)(k,{href:"/contact",fallbackHref:"/contact",className:"relative z-10 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-quaternary to-[#D87AAA] px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base",children:"Book Enterprise Demo"})]})]})]}),(0,b.jsx)(c.default,{id:"447db2994406fc3a",children:".hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.custom-line-clamp-4{-webkit-line-clamp:4;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}@keyframes fade-in-up{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.animate-section{animation:1s ease-out forwards fade-in-up}"})]})}a.s(["default",()=>J],43584)}];

//# sourceMappingURL=_79a46da2._.js.map