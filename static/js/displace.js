/*!
 * displacejs.js 1.3.2 - Tiny javascript library to create moveable DOM elements.
 * Copyright (c) 2019 Catalin Covic - https://github.com/catc/displace
 * License: MIT
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.displacejs=t():e.displacejs=t()}(this,function(){return function(e){function t(n){if(o[n])return o[n].exports;var s=o[n]={exports:{},id:n,loaded:!1};return e[n].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=o(1),i=n(s);e.exports=i.default},function(e,t,o){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(){var e=this,t=this.el,o=this.opts||c,n={};if(t.style.position="absolute",this.handle=o.handle||t,o.constrain){for(var s=o.relativeTo||t.parentNode,a=t,h=0,v=0;a!==s;)a=a.parentNode,(0,i.isRelative)(a)&&(h-=a.offsetLeft,v-=a.offsetTop),a===s&&(h+=a.offsetLeft,v+=a.offsetTop);var l=h+s.offsetWidth-t.offsetWidth,f=v+s.offsetHeight-t.offsetHeight;n.xClamp=(0,i.generateClamp)(h,l),n.yClamp=(0,i.generateClamp)(v,f)}this.opts=o,this.data=n,this.events={mousedown:u.mousedown.bind(this),mouseup:u.mouseup.bind(this),touchstart:u.touchstart.bind(this),touchstop:u.touchstop.bind(this),scrollFix:function(t){e.isDragging&&t.preventDefault()}},this.handleMove=r(this.opts.customMove),this.handle.addEventListener("mousedown",this.events.mousedown,!1),this.handle.addEventListener("touchstart",this.events.touchstart,!1),document.addEventListener("touchmove",this.events.scrollFix,{passive:!1})}Object.defineProperty(t,"__esModule",{value:!0});var i=o(2),u=o(3),r=(0,i.generateMoveFn)(),c={constrain:!1,relativeTo:null,handle:null,ignoreFn:null,highlightInputs:!1,onMouseDown:null,onMouseMove:null,onMouseUp:null,onTouchStart:null,onTouchMove:null,onTouchStop:null,customMove:null},a=function(){function e(t,o){if(n(this,e),!t)throw Error("Must include moveable element");this.el=t,this.opts=o,s.call(this)}return e.prototype.reinit=function(){this.destroy(),s.call(this)},e.prototype.destroy=function(){var e=this.events;this.handle.removeEventListener("mousedown",e.mousedown,!1),document.removeEventListener("mousemove",e.mousemove,!1),document.removeEventListener("mouseup",e.mouseup,!1),this.handle.removeEventListener("touchstart",e.touchstart,!1),document.removeEventListener("touchmove",e.touchmove,!1),document.removeEventListener("touchstop",e.touchstop,!1),document.removeEventListener("touchmove",this.events.scrollFix,{passive:!1})},e}();t.default=function(e,t){return new a(e,t)}},function(e,t){"use strict";function o(e,t){return function(o){return Math.min(Math.max(o,e),t)}}function n(e){return"relative"===window.getComputedStyle(e).position}function s(){return window.requestAnimationFrame?function(e){var t=e||i;return function(e,o,n){window.requestAnimationFrame(function(){t(e,o,n)})}}:function(e){return function(t,o,n){var s=e||i;s(t,o,n)}}}function i(e,t,o){e.style.left=t+"px",e.style.top=o+"px"}Object.defineProperty(t,"__esModule",{value:!0}),t.generateClamp=o,t.isRelative=n,t.generateMoveFn=s},function(e,t){"use strict";function o(e){var t=this.opts;if(t.highlightInputs){var o=e.target.tagName.toLowerCase();if("input"===o||"textarea"===o)return}if(!t.ignoreFn||!t.ignoreFn(e)){if(0===e.button){var s=this.el,i=this.events;"function"==typeof t.onMouseDown&&t.onMouseDown(s,e);var u=e.clientX-s.offsetLeft,r=e.clientY-s.offsetTop;i.mousemove=n.bind(this,u,r),document.addEventListener("mousemove",i.mousemove,!1),document.addEventListener("mouseup",i.mouseup,!1)}e.preventDefault()}}function n(e,t,o){var n=this.el,s=this.opts,i=this.data;"function"==typeof s.onMouseMove&&s.onMouseMove(n,o);var u=o.clientX-e,r=o.clientY-t;return s.constrain&&(u=i.xClamp(u),r=i.yClamp(r)),this.handleMove(n,u,r),o.preventDefault(),!1}function s(e){var t=this.el,o=this.opts,n=this.events;"function"==typeof o.onMouseUp&&o.onMouseUp(t,e),document.removeEventListener("mouseup",n.mouseup,!1),document.removeEventListener("mousemove",n.mousemove,!1)}function i(e){var t=this.opts;if(t.highlightInputs){var o=e.target.tagName.toLowerCase();if("input"===o||"textarea"===o)return}if(!t.ignoreFn||!t.ignoreFn(e)){var n=this.el,s=this.events;"function"==typeof t.onTouchStart&&t.onTouchStart(n,e);var i=e.targetTouches[0],r=i.clientX-n.offsetLeft,c=i.clientY-n.offsetTop;s.touchmove=u.bind(this,r,c),this.isDragging=!0,document.addEventListener("touchmove",s.touchmove,!1),document.addEventListener("touchend",s.touchstop,!1),document.addEventListener("touchcancel",s.touchstop,!1)}}function u(e,t,o){var n=this.el,s=this.opts,i=this.data;"function"==typeof s.onTouchMove&&s.onTouchMove(n,o);var u=o.targetTouches[0],r=u.clientX-e,c=u.clientY-t;return s.constrain&&(r=i.xClamp(r),c=i.yClamp(c)),this.handleMove(n,r,c),o.preventDefault(),!1}function r(e){this.isDragging=!1;var t=this.el,o=this.opts,n=this.events;"function"==typeof o.onTouchStop&&o.onTouchStop(t,e),document.removeEventListener("touchmove",n.touchmove,!1),document.removeEventListener("touchend",n.touchstop,!1),document.removeEventListener("touchcancel",n.touchstop,!1)}Object.defineProperty(t,"__esModule",{value:!0}),t.mousedown=o,t.mousemove=n,t.mouseup=s,t.touchstart=i,t.touchmove=u,t.touchstop=r}])});