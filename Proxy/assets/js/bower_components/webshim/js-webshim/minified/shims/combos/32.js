!function(){function a(){}function b(a){return a=+a,a!==a?a=0:0!==a&&a!==1/0&&a!==-(1/0)&&(a=(a>0||-1)*Math.floor(Math.abs(a))),a}function c(a){var b=typeof a;return null===a||"undefined"===b||"boolean"===b||"number"===b||"string"===b}function d(a){var b,d,e;if(c(a))return a;if(d=a.valueOf,"function"==typeof d&&(b=d.call(a),c(b)))return b;if(e=a.toString,"function"==typeof e&&(b=e.call(a),c(b)))return b;throw new TypeError}setTimeout(function(){webshims.isReady("es5",!0)}),Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if("function"!=typeof c)throw new TypeError("Function.prototype.bind called on incompatible "+c);var d=m.call(arguments,1),e=function(){if(this instanceof e){var a=c.apply(this,d.concat(m.call(arguments)));return Object(a)===a?a:this}return c.apply(b,d.concat(m.call(arguments)))};return c.prototype&&(a.prototype=c.prototype,e.prototype=new a,a.prototype=null),e});var e,f,g,h,i,j=Function.prototype.call,k=Array.prototype,l=Object.prototype,m=k.slice,n=j.bind(l.toString),o=j.bind(l.hasOwnProperty);if((i=o(l,"__defineGetter__"))&&(e=j.bind(l.__defineGetter__),f=j.bind(l.__defineSetter__),g=j.bind(l.__lookupGetter__),h=j.bind(l.__lookupSetter__)),2!=[1,2].splice(0).length){var p=Array.prototype.splice;Array.prototype.splice=function(){function a(a){for(var b=[];a--;)b.unshift(a);return b}var b,c=[];return c.splice.bind(c,0,0).apply(null,a(20)),c.splice.bind(c,0,0).apply(null,a(26)),b=c.length,c.splice(5,0,"XXX"),b+1==c.length?!0:void 0}()?function(a,b){return arguments.length?p.apply(this,[void 0===a?0:a,void 0===b?this.length-a:b].concat(m.call(arguments,2))):[]}:function(a,b){var c,d=m.call(arguments,2),e=d.length;if(!arguments.length)return[];if(void 0===a&&(a=0),void 0===b&&(b=this.length-a),e>0){if(0>=b){if(a==this.length)return this.push.apply(this,d),[];if(0==a)return this.unshift.apply(this,d),[]}return c=m.call(this,a,a+b),d.push.apply(d,m.call(this,a+b,this.length)),d.unshift.apply(d,m.call(this,0,a)),d.unshift(0,this.length),p.apply(this,d),c}return p.call(this,a,b)}}if(1!=[].unshift(0)){var q=Array.prototype.unshift;Array.prototype.unshift=function(){return q.apply(this,arguments),this.length}}Array.isArray||(Array.isArray=function(a){return"[object Array]"==n(a)});var r=Object("a"),s="a"!=r[0]||!(0 in r);if(Array.prototype.forEach||(Array.prototype.forEach=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=arguments[1],e=-1,f=c.length>>>0;if("[object Function]"!=n(a))throw new TypeError;for(;++e<f;)e in c&&a.call(d,c[e],e,b)}),Array.prototype.map||(Array.prototype.map=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=c.length>>>0,e=Array(d),f=arguments[1];if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");for(var g=0;d>g;g++)g in c&&(e[g]=a.call(f,c[g],g,b));return e}),Array.prototype.filter||(Array.prototype.filter=function(a){var b,c=G(this),d=s&&"[object String]"==n(this)?this.split(""):c,e=d.length>>>0,f=[],g=arguments[1];if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");for(var h=0;e>h;h++)h in d&&(b=d[h],a.call(g,b,h,c)&&f.push(b));return f}),Array.prototype.every||(Array.prototype.every=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=c.length>>>0,e=arguments[1];if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");for(var f=0;d>f;f++)if(f in c&&!a.call(e,c[f],f,b))return!1;return!0}),Array.prototype.some||(Array.prototype.some=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=c.length>>>0,e=arguments[1];if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");for(var f=0;d>f;f++)if(f in c&&a.call(e,c[f],f,b))return!0;return!1}),Array.prototype.reduce||(Array.prototype.reduce=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=c.length>>>0;if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");if(!d&&1==arguments.length)throw new TypeError("reduce of empty array with no initial value");var e,f=0;if(arguments.length>=2)e=arguments[1];else for(;;){if(f in c){e=c[f++];break}if(++f>=d)throw new TypeError("reduce of empty array with no initial value")}for(;d>f;f++)f in c&&(e=a.call(void 0,e,c[f],f,b));return e}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(a){var b=G(this),c=s&&"[object String]"==n(this)?this.split(""):b,d=c.length>>>0;if("[object Function]"!=n(a))throw new TypeError(a+" is not a function");if(!d&&1==arguments.length)throw new TypeError("reduceRight of empty array with no initial value");var e,f=d-1;if(arguments.length>=2)e=arguments[1];else for(;;){if(f in c){e=c[f--];break}if(--f<0)throw new TypeError("reduceRight of empty array with no initial value")}if(0>f)return e;do f in this&&(e=a.call(void 0,e,c[f],f,b));while(f--);return e}),Array.prototype.indexOf&&-1==[0,1].indexOf(1,2)||(Array.prototype.indexOf=function(a){var c=s&&"[object String]"==n(this)?this.split(""):G(this),d=c.length>>>0;if(!d)return-1;var e=0;for(arguments.length>1&&(e=b(arguments[1])),e=e>=0?e:Math.max(0,d+e);d>e;e++)if(e in c&&c[e]===a)return e;return-1}),Array.prototype.lastIndexOf&&-1==[0,1].lastIndexOf(0,-3)||(Array.prototype.lastIndexOf=function(a){var c=s&&"[object String]"==n(this)?this.split(""):G(this),d=c.length>>>0;if(!d)return-1;var e=d-1;for(arguments.length>1&&(e=Math.min(e,b(arguments[1]))),e=e>=0?e:d-Math.abs(e);e>=0;e--)if(e in c&&a===c[e])return e;return-1}),!Object.keys){var t=!0,u=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],v=u.length;for(var w in{toString:null})t=!1;Object.keys=function H(a){if("object"!=typeof a&&"function"!=typeof a||null===a)throw new TypeError("Object.keys called on a non-object");var H=[];for(var b in a)o(a,b)&&H.push(b);if(t)for(var c=0,d=v;d>c;c++){var e=u[c];o(a,e)&&H.push(e)}return H}}var x=-621987552e5,y="-000001";Date.prototype.toISOString&&-1!==new Date(x).toISOString().indexOf(y)||(Date.prototype.toISOString=function(){var a,b,c,d,e;if(!isFinite(this))throw new RangeError("Date.prototype.toISOString called on non-finite value.");for(d=this.getUTCFullYear(),e=this.getUTCMonth(),d+=Math.floor(e/12),e=(e%12+12)%12,a=[e+1,this.getUTCDate(),this.getUTCHours(),this.getUTCMinutes(),this.getUTCSeconds()],d=(0>d?"-":d>9999?"+":"")+("00000"+Math.abs(d)).slice(d>=0&&9999>=d?-4:-6),b=a.length;b--;)c=a[b],10>c&&(a[b]="0"+c);return d+"-"+a.slice(0,2).join("-")+"T"+a.slice(2).join(":")+"."+("000"+this.getUTCMilliseconds()).slice(-3)+"Z"});var z=!1;try{z=Date.prototype.toJSON&&null===new Date(0/0).toJSON()&&-1!==new Date(x).toJSON().indexOf(y)&&Date.prototype.toJSON.call({toISOString:function(){return!0}})}catch(A){}z||(Date.prototype.toJSON=function(){var a,b=Object(this),c=d(b);if("number"==typeof c&&!isFinite(c))return null;if(a=b.toISOString,"function"!=typeof a)throw new TypeError("toISOString property is not callable");return a.call(b)}),Date=function(a){function b(c,d,e,f,g,h,i){var j=arguments.length;if(this instanceof a){var k=1==j&&String(c)===c?new a(b.parse(c)):j>=7?new a(c,d,e,f,g,h,i):j>=6?new a(c,d,e,f,g,h):j>=5?new a(c,d,e,f,g):j>=4?new a(c,d,e,f):j>=3?new a(c,d,e):j>=2?new a(c,d):j>=1?new a(c):new a;return k.constructor=b,k}return a.apply(this,arguments)}function c(a,b){var c=b>1?1:0;return e[b]+Math.floor((a-1969+c)/4)-Math.floor((a-1901+c)/100)+Math.floor((a-1601+c)/400)+365*(a-1970)}var d=new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),e=[0,31,59,90,120,151,181,212,243,273,304,334,365];for(var f in a)b[f]=a[f];return b.now=a.now,b.UTC=a.UTC,b.prototype=a.prototype,b.prototype.constructor=b,b.parse=function(b){var e=d.exec(b);if(e){var f,g=Number(e[1]),h=Number(e[2]||1)-1,i=Number(e[3]||1)-1,j=Number(e[4]||0),k=Number(e[5]||0),l=Number(e[6]||0),m=Math.floor(1e3*Number(e[7]||0)),n=!e[4]||e[8]?0:Number(new a(1970,0)),o="-"===e[9]?1:-1,p=Number(e[10]||0),q=Number(e[11]||0);return(k>0||l>0||m>0?24:25)>j&&60>k&&60>l&&1e3>m&&h>-1&&12>h&&24>p&&60>q&&i>-1&&i<c(g,h+1)-c(g,h)&&(f=60*(24*(c(g,h)+i)+j+p*o),f=1e3*(60*(f+k+q*o)+l)+m+n,f>=-864e13&&864e13>=f)?f:0/0}return a.parse.apply(this,arguments)},b}(Date),Date.now||(Date.now=function(){return(new Date).getTime()}),Number.prototype.toFixed&&"0.000"===8e-5.toFixed(3)&&"0"!==.9.toFixed(0)&&"1.25"===1.255.toFixed(2)&&"1000000000000000128"===0xde0b6b3a7640080.toFixed(0)||!function(){function a(a,b){for(var c=-1;++c<g;)b+=a*h[c],h[c]=b%f,b=Math.floor(b/f)}function b(a){for(var b=g,c=0;--b>=0;)c+=h[b],h[b]=Math.floor(c/a),c=c%a*f}function c(){for(var a=g,b="";--a>=0;)if(""!==b||0===a||0!==h[a]){var c=String(h[a]);""===b?b=c:b+="0000000".slice(0,7-c.length)+c}return b}function d(a,b,c){return 0===b?c:b%2===1?d(a,b-1,c*a):d(a*a,b/2,c)}function e(a){for(var b=0;a>=4096;)b+=12,a/=4096;for(;a>=2;)b+=1,a/=2;return b}var f,g,h;f=1e7,g=6,h=[0,0,0,0,0,0],Number.prototype.toFixed=function(f){var g,h,i,j,k,l,m,n;if(g=Number(f),g=g!==g?0:Math.floor(g),0>g||g>20)throw new RangeError("Number.toFixed called with invalid number of decimals");if(h=Number(this),h!==h)return"NaN";if(-1e21>=h||h>=1e21)return String(h);if(i="",0>h&&(i="-",h=-h),j="0",h>1e-21)if(k=e(h*d(2,69,1))-69,l=0>k?h*d(2,-k,1):h/d(2,k,1),l*=4503599627370496,k=52-k,k>0){for(a(0,l),m=g;m>=7;)a(1e7,0),m-=7;for(a(d(10,m,1),0),m=k-1;m>=23;)b(1<<23),m-=23;b(1<<m),a(1,1),b(2),j=c()}else a(0,l),a(1<<-k,0),j=c()+"0.00000000000000000000".slice(2,2+g);return g>0?(n=j.length,j=g>=n?i+"0.0000000000000000000".slice(0,g-n+2)+j:i+j.slice(0,n-g)+"."+j.slice(n-g)):j=i+j,j}}();var B=String.prototype.split;if(2!=="ab".split(/(?:ab)*/).length||4!==".".split(/(.?)(.?)/).length||"t"==="tesst".split(/(s)*/)[1]||0==="".split(/.?/).length||".".split(/()()/).length>1?!function(){var a=void 0===/()??/.exec("")[1];String.prototype.split=function(b,c){var d=this;if(void 0===b&&0===c)return[];if("[object RegExp]"!==Object.prototype.toString.call(b))return B.apply(this,arguments);var e,f,g,h,i=[],j=(b.ignoreCase?"i":"")+(b.multiline?"m":"")+(b.extended?"x":"")+(b.sticky?"y":""),k=0,b=new RegExp(b.source,j+"g");for(d+="",a||(e=new RegExp("^"+b.source+"$(?!\\s)",j)),c=void 0===c?-1>>>0:c>>>0;(f=b.exec(d))&&(g=f.index+f[0].length,!(g>k&&(i.push(d.slice(k,f.index)),!a&&f.length>1&&f[0].replace(e,function(){for(var a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(f[a]=void 0)}),f.length>1&&f.index<d.length&&Array.prototype.push.apply(i,f.slice(1)),h=f[0].length,k=g,i.length>=c)));)b.lastIndex===f.index&&b.lastIndex++;return k===d.length?(h||!b.test(""))&&i.push(""):i.push(d.slice(k)),i.length>c?i.slice(0,c):i}}():"0".split(void 0,0).length&&(String.prototype.split=function(a,b){return void 0===a&&0===b?[]:B.apply(this,arguments)}),"".substr&&"b"!=="0b".substr(-1)){var C=String.prototype.substr;String.prototype.substr=function(a,b){return C.call(this,0>a&&(a=this.length+a)<0?0:a,b)}}var D="	\n\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";if(!String.prototype.trim||D.trim()){D="["+D+"]";var E=new RegExp("^"+D+D+"*"),F=new RegExp(D+D+"*$");String.prototype.trim=function(){if(void 0===this||null===this)throw new TypeError("can't convert "+this+" to object");return String(this).replace(E,"").replace(F,"")}}var G=function(a){if(null==a)throw new TypeError("can't convert "+a+" to object");return Object(a)}}(),function(a,b){var c="defineProperty",d=!!(Object.create&&Object.defineProperties&&Object.getOwnPropertyDescriptor);if(d&&Object[c]&&Object.prototype.__defineGetter__&&!function(){try{var a=document.createElement("foo");Object[c](a,"bar",{get:function(){return!0}}),d=!!a.bar}catch(b){d=!1}a=null}(),Modernizr.objectAccessor=!!(d||Object.prototype.__defineGetter__&&Object.prototype.__lookupSetter__),Modernizr.advancedObjectProperties=d,!(d&&Object.create&&Object.defineProperties&&Object.getOwnPropertyDescriptor&&Object.defineProperty)){var e=Function.prototype.call,f=Object.prototype,g=e.bind(f.hasOwnProperty);b.objectCreate=function(c,d,e,f){var g,h=function(){};return h.prototype=c,g=new h,f||"__proto__"in g||Modernizr.objectAccessor||(g.__proto__=c),d&&b.defineProperties(g,d),e&&(g.options=a.extend(!0,{},g.options||{},e),e=g.options),g._create&&a.isFunction(g._create)&&g._create(e),g},b.defineProperties=function(a,c){for(var d in c)g(c,d)&&b.defineProperty(a,d,c[d]);return a};b.defineProperty=function(a,b,c){return"object"!=typeof c||null===c?a:g(c,"value")?(a[b]=c.value,a):(a.__defineGetter__&&("function"==typeof c.get&&a.__defineGetter__(b,c.get),"function"==typeof c.set&&a.__defineSetter__(b,c.set)),a)},b.getPrototypeOf=function(a){return Object.getPrototypeOf&&Object.getPrototypeOf(a)||a.__proto__||a.constructor&&a.constructor.prototype},b.getOwnPropertyDescriptor=function(a,b){if("object"!=typeof a&&"function"!=typeof a||null===a)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");var c;if(Object.defineProperty&&Object.getOwnPropertyDescriptor)try{return c=Object.getOwnPropertyDescriptor(a,b)}catch(d){}c={configurable:!0,enumerable:!0,writable:!0,value:void 0};var e=a.__lookupGetter__&&a.__lookupGetter__(b),f=a.__lookupSetter__&&a.__lookupSetter__(b);if(!e&&!f){if(!g(a,b))return;return c.value=a[b],c}return delete c.writable,delete c.value,c.get=c.set=void 0,e&&(c.get=e),f&&(c.set=f),c}}webshims.isReady("es5",!0)}(webshims.$,webshims),webshims.register("form-number-date-api",function(a,b,c,d){"use strict";b.addInputType||b.error("you can not call forms-ext feature after calling forms feature. call both at once instead: $.webshims.polyfill('forms forms-ext')"),b.getStep||(b.getStep=function(b,c){var d=a.attr(b,"step");return"any"===d?d:(c=c||i(b),f[c]&&f[c].step?(d=q.number.asNumber(d),(!isNaN(d)&&d>0?d:f[c].step)*(f[c].stepScaleFactor||1)):d)}),b.addMinMaxNumberToCache||(b.addMinMaxNumberToCache=function(a,b,c){a+"AsNumber"in c||(c[a+"AsNumber"]=f[c.type].asNumber(b.attr(a)),isNaN(c[a+"AsNumber"])&&a+"Default"in f[c.type]&&(c[a+"AsNumber"]=f[c.type][a+"Default"]))});var e=parseInt("NaN",10),f=b.inputTypes,g=function(a){return"number"==typeof a||a&&a==1*a},h=function(b){return a('<input type="'+b+'" />').prop("type")===b},i=function(a){return(a.getAttribute("type")||"").toLowerCase()},j=function(a){return a&&!isNaN(1*a)},k=b.addMinMaxNumberToCache,l=function(a,b){a=""+a,b-=a.length;for(var c=0;b>c;c++)a="0"+a;return a},m=1e-7,n=b.bugs.bustedValidity;b.addValidityRule("stepMismatch",function(a,c,d,e){if(""===c)return!1;if("type"in d||(d.type=i(a[0])),"week"==d.type)return!1;var g,h,j=(e||{}).stepMismatch||!1;if(f[d.type]&&f[d.type].step){if("step"in d||(d.step=b.getStep(a[0],d.type)),"any"==d.step)return!1;if("valueAsNumber"in d||(d.valueAsNumber=f[d.type].asNumber(c)),isNaN(d.valueAsNumber))return!1;k("min",a,d),g=d.minAsNumber,isNaN(g)&&(h=a.prop("defaultValue"))&&(g=f[d.type].asNumber(h)),isNaN(g)&&(g=f[d.type].stepBase||0),j=Math.abs((d.valueAsNumber-g)%d.step),j=!(m>=j||Math.abs(j-d.step)<=m)}return j}),[{name:"rangeOverflow",attr:"max",factor:1},{name:"rangeUnderflow",attr:"min",factor:-1}].forEach(function(a){b.addValidityRule(a.name,function(b,c,d,e){var g=(e||{})[a.name]||!1;if(""===c)return g;if("type"in d||(d.type=i(b[0])),f[d.type]&&f[d.type].asNumber){if("valueAsNumber"in d||(d.valueAsNumber=f[d.type].asNumber(c)),isNaN(d.valueAsNumber))return!1;if(k(a.attr,b,d),isNaN(d[a.attr+"AsNumber"]))return g;g=d[a.attr+"AsNumber"]*a.factor<d.valueAsNumber*a.factor-m}return g})}),b.reflectProperties(["input"],["max","min","step"]);var o=b.defineNodeNameProperty("input","valueAsNumber",{prop:{get:function(){var b=this,c=i(b),d=f[c]&&f[c].asNumber?f[c].asNumber(a.prop(b,"value")):o.prop._supget&&o.prop._supget.apply(b,arguments);return null==d&&(d=e),d},set:function(c){var d=this,e=i(d);if(f[e]&&f[e].numberToString){if(isNaN(c))return void a.prop(d,"value","");var g=f[e].numberToString(c);g!==!1?a.prop(d,"value",g):b.error("INVALID_STATE_ERR: DOM Exception 11")}else o.prop._supset&&o.prop._supset.apply(d,arguments)}}}),p=b.defineNodeNameProperty("input","valueAsDate",{prop:{get:function(){var b=this,c=i(b);return f[c]&&f[c].asDate&&!f[c].noAsDate?f[c].asDate(a.prop(b,"value")):p.prop._supget&&p.prop._supget.call(b)||null},set:function(c){var d=this,e=i(d);if(!f[e]||!f[e].dateToString||f[e].noAsDate)return p.prop._supset&&p.prop._supset.apply(d,arguments)||null;if(null===c)return a.prop(d,"value",""),"";var g=f[e].dateToString(c);return g!==!1?(a.prop(d,"value",g),g):void b.error("INVALID_STATE_ERR: DOM Exception 11")}}});a.each({stepUp:1,stepDown:-1},function(c,d){var e=b.defineNodeNameProperty("input",c,{prop:{value:function(c){var g,h,j,k,l,n,o,p=i(this);if(!f[p]||!f[p].asNumber){if(e.prop&&e.prop._supvalue)return e.prop._supvalue.apply(this,arguments);throw b.info("no step method for type: "+p),"invalid state error"}if(l={type:p},c||(c=1,b.warn("you should always use a factor for stepUp/stepDown")),c*=d,h=a.prop(this,"valueAsNumber"),isNaN(h))throw b.info("valueAsNumber is NaN can't apply stepUp/stepDown "),"invalid state error";if(g=b.getStep(this,p),"any"==g)throw b.info("step is 'any' can't apply stepUp/stepDown"),"invalid state error";if(b.addMinMaxNumberToCache("min",a(this),l),b.addMinMaxNumberToCache("max",a(this),l),n=l.minAsNumber,isNaN(n)&&(o=a.prop(this,"defaultValue"))&&(n=f[p].asNumber(o)),n||(n=0),g*=c,h=1*(h+g).toFixed(5),j=(h-n)%g,j&&Math.abs(j)>m&&(k=h-j,k+=j>0?g:-g,h=1*k.toFixed(5)),!isNaN(l.maxAsNumber)&&h>l.maxAsNumber||!isNaN(l.minAsNumber)&&h<l.minAsNumber)throw b.info("max/min overflow can't apply stepUp/stepDown"),"invalid state error";a.prop(this,"valueAsNumber",h)}}})});var q={number:{bad:function(a){return!g(a)},step:1,stepScaleFactor:1,asNumber:function(a){return g(a)?1*a:e},numberToString:function(a){return g(a)?a:!1}},range:{minDefault:0,maxDefault:100},color:{bad:function(){var a=/^\u0023[a-f0-9]{6}$/;return function(b){return!b||7!=b.length||!a.test(b)}}()},date:{bad:function(a){if(!a||!a.split||!/\d$/.test(a))return!0;var b,c=a.split(/\u002D/);if(3!==c.length)return!0;var d=!1;if(c[0].length<4||2!=c[1].length||c[1]>12||2!=c[2].length||c[2]>33)d=!0;else for(b=0;3>b;b++)if(!j(c[b])){d=!0;break}return d||a!==this.dateToString(this.asDate(a,!0))},step:1,stepScaleFactor:864e5,asDate:function(a,b){return!b&&this.bad(a)?null:new Date(this.asNumber(a,!0))},asNumber:function(a,b){var c=e;return(b||!this.bad(a))&&(a=a.split(/\u002D/),c=Date.UTC(a[0],a[1]-1,a[2])),c},numberToString:function(a){return g(a)?this.dateToString(new Date(1*a)):!1},dateToString:function(a){return a&&a.getFullYear?l(a.getUTCFullYear(),4)+"-"+l(a.getUTCMonth()+1,2)+"-"+l(a.getUTCDate(),2):!1}},time:{bad:function(b,c){if(!b||!b.split||!/\d$/.test(b))return!0;if(b=b.split(/\u003A/),b.length<2||b.length>3)return!0;var d,e=!1;return b[2]&&(b[2]=b[2].split(/\u002E/),d=parseInt(b[2][1],10),b[2]=b[2][0]),a.each(b,function(a,b){return j(b)&&2===b.length?void 0:(e=!0,!1)}),e?!0:b[0]>23||b[0]<0||b[1]>59||b[1]<0?!0:b[2]&&(b[2]>59||b[2]<0)?!0:d&&isNaN(d)?!0:(d&&(100>d?d*=100:10>d&&(d*=10)),c===!0?[b,d]:!1)},step:60,stepBase:0,stepScaleFactor:1e3,asDate:function(a){return a=new Date(this.asNumber(a)),isNaN(a)?null:a},asNumber:function(a){var b=e;return a=this.bad(a,!0),a!==!0&&(b=Date.UTC("1970",0,1,a[0][0],a[0][1],a[0][2]||0),a[1]&&(b+=a[1])),b},dateToString:function(a){if(a&&a.getUTCHours){var b=l(a.getUTCHours(),2)+":"+l(a.getUTCMinutes(),2),c=a.getSeconds();return"0"!=c&&(b+=":"+l(c,2)),c=a.getUTCMilliseconds(),"0"!=c&&(b+="."+l(c,3)),b}return!1}},month:{bad:function(a){return q.date.bad(a+"-01")},step:1,stepScaleFactor:!1,asDate:function(a){return new Date(q.date.asNumber(a+"-01"))},asNumber:function(a){var b=e;return a&&!this.bad(a)&&(a=a.split(/\u002D/),a[0]=1*a[0]-1970,a[1]=1*a[1]-1,b=12*a[0]+a[1]),b},numberToString:function(a){var b,c=!1;return g(a)&&(b=a%12,a=(a-b)/12+1970,b+=1,1>b&&(a-=1,b+=12),c=l(a,4)+"-"+l(b,2)),c},dateToString:function(a){if(a&&a.getUTCHours){var b=q.date.dateToString(a);return b.split&&(b=b.split(/\u002D/))?b[0]+"-"+b[1]:!1}return!1}},"datetime-local":{bad:function(a,b){return a&&a.split&&2===(a+"special").split(/\u0054/).length?(a=a.split(/\u0054/),q.date.bad(a[0])||q.time.bad(a[1],b)):!0},noAsDate:!0,asDate:function(a){return a=new Date(this.asNumber(a)),isNaN(a)?null:a},asNumber:function(a){var b=e,c=this.bad(a,!0);return c!==!0&&(a=a.split(/\u0054/)[0].split(/\u002D/),b=Date.UTC(a[0],a[1]-1,a[2],c[0][0],c[0][1],c[0][2]||0),c[1]&&(b+=c[1])),b},dateToString:function(a,b){return q.date.dateToString(a)+"T"+q.time.dateToString(a,b)}}};!n&&h("range")&&h("time")&&h("month")&&h("datetime-local")||(q.range=a.extend({},q.number,q.range),q.time=a.extend({},q.date,q.time),q.month=a.extend({},q.date,q.month),q["datetime-local"]=a.extend({},q.date,q.time,q["datetime-local"])),["number","month","range","date","time","color","datetime-local"].forEach(function(a){(n||!h(a))&&b.addInputType(a,q[a])}),null==a("<input />").prop("labels")&&b.defineNodeNamesProperty("button, input, keygen, meter, output, progress, select, textarea","labels",{prop:{get:function(){if("hidden"==this.type)return null;var b=this.id,c=a(this).closest("label").filter(function(){var a=this.attributes["for"]||{};return!a.specified||a.value==b});return b&&(c=c.add('label[for="'+b+'"]')),c.get()},writeable:!1}})}),webshims.register("form-datalist",function(a,b,c,d,e,f){"use strict";var g=function(a){a&&"string"==typeof a||(a="DOM"),g[a+"Loaded"]||(g[a+"Loaded"]=!0,b.ready(a,function(){b.loader.loadList(["form-datalist-lazy"])}))},h={submit:1,button:1,reset:1,hidden:1,range:1,date:1,month:1};b.modules["form-number-date-ui"].loaded&&a.extend(h,{number:1,time:1}),b.propTypes.element=function(c,e){b.createPropDefault(c,"attr"),c.prop||(c.prop={get:function(){var b=a.attr(this,e);return b&&(b=d.getElementById(b),b&&c.propNodeName&&!a.nodeName(b,c.propNodeName)&&(b=null)),b||null},writeable:!1})},function(){var i=a.webshims.cfg.forms,j=Modernizr.input.list;if(!j||i.customDatalist){var k=function(){var c=function(){var b;!a.data(this,"datalistWidgetData")&&(b=a.prop(this,"id"))?a('input[list="'+b+'"], input[data-wslist="'+b+'"]').eq(0).attr("list",b):a(this).triggerHandler("updateDatalist")},d={autocomplete:{attr:{get:function(){var b=this,c=a.data(b,"datalistWidget");return c?c._autocomplete:"autocomplete"in b?b.autocomplete:b.getAttribute("autocomplete")},set:function(b){var c=this,d=a.data(c,"datalistWidget");d?(d._autocomplete=b,"off"==b&&d.hideList()):"autocomplete"in c?c.autocomplete=b:c.setAttribute("autocomplete",b)}}}};j?((a("<datalist><select><option></option></select></datalist>").prop("options")||[]).length||b.defineNodeNameProperty("datalist","options",{prop:{writeable:!1,get:function(){var b=this.options||[];if(!b.length){var c=this,d=a("select",c);d[0]&&d[0].options&&d[0].options.length&&(b=d[0].options)}return b}}}),d.list={attr:{get:function(){var c=b.contentAttr(this,"list");return null!=c?(a.data(this,"datalistListAttr",c),h[a.prop(this,"type")]||h[a.attr(this,"type")]||this.removeAttribute("list")):c=a.data(this,"datalistListAttr"),null==c?e:c},set:function(c){var d=this;a.data(d,"datalistListAttr",c),h[a.prop(this,"type")]||h[a.attr(this,"type")]?d.setAttribute("list",c):(b.objectCreate(l,e,{input:d,id:c,datalist:a.prop(d,"list")}),d.setAttribute("data-wslist",c)),a(d).triggerHandler("listdatalistchange")}},initAttr:!0,reflect:!0,propType:"element",propNodeName:"datalist"}):b.defineNodeNameProperties("input",{list:{attr:{get:function(){var a=b.contentAttr(this,"list");return null==a?e:a},set:function(c){var d=this;b.contentAttr(d,"list",c),b.objectCreate(f.shadowListProto,e,{input:d,id:c,datalist:a.prop(d,"list")}),a(d).triggerHandler("listdatalistchange")}},initAttr:!0,reflect:!0,propType:"element",propNodeName:"datalist"}}),b.defineNodeNameProperties("input",d),b.addReady(function(a,b){b.filter("datalist > select, datalist, datalist > option, datalist > select > option").closest("datalist").each(c)})},l={_create:function(d){if(!h[a.prop(d.input,"type")]&&!h[a.attr(d.input,"type")]){var e=d.datalist,f=a.data(d.input,"datalistWidget"),i=this;return e&&f&&f.datalist!==e?(f.datalist=e,f.id=d.id,a(f.datalist).off("updateDatalist.datalistWidget").on("updateDatalist.datalistWidget",a.proxy(f,"_resetListCached")),void f._resetListCached()):e?void(f&&f.datalist===e||(this.datalist=e,this.id=d.id,this.hasViewableData=!0,this._autocomplete=a.attr(d.input,"autocomplete"),a.data(d.input,"datalistWidget",this),a.data(e,"datalistWidgetData",this),g("WINDOWLOAD"),b.isReady("form-datalist-lazy")?c.QUnit?i._lazyCreate(d):setTimeout(function(){i._lazyCreate(d)},9):(a(d.input).one("focus",g),b.ready("form-datalist-lazy",function(){i._destroyed||i._lazyCreate(d)})))):void(f&&f.destroy())}},destroy:function(b){var f,g=a.attr(this.input,"autocomplete");a(this.input).off(".datalistWidget").removeData("datalistWidget"),this.shadowList.remove(),a(d).off(".datalist"+this.id),a(c).off(".datalist"+this.id),this.input.form&&this.input.id&&a(this.input.form).off("submit.datalistWidget"+this.input.id),this.input.removeAttribute("aria-haspopup"),g===e?this.input.removeAttribute("autocomplete"):a(this.input).attr("autocomplete",g),b&&"beforeunload"==b.type&&(f=this.input,setTimeout(function(){a.attr(f,"list",a.attr(f,"list"))},9)),this._destroyed=!0}};b.loader.addModule("form-datalist-lazy",{noAutoCallback:!0,options:a.extend(f,{shadowListProto:l})}),f.list||(f.list={}),k()}}()});