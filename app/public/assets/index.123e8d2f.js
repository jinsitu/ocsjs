import{d as x,u as z,r as O,o as p,c as D,a as _,t as L,b as E,F as H,e as K,f as G,g as u,w as r,M,m as y,_ as W,h as Q,i as X,j as Y,k as Z,l as J,n as $,p as A,q as P,s as ee,v as te,x as ne,y as oe,z as se,A as ue,B as ce,C as re,D as ie,E as k,T as ae,K as le,G as pe,L as _e,H as de,I as me,J as fe,N as ve,O as ge,P as Fe,Q as he}from"./vendor.530941a1.js";const Ee=function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}};Ee();const ye="online-course-script",Ae="1.0.0",Ce="./app/lib/electron/index.js",Be={dev:'cd ./app && tsc && cd .. &&   concurrently vite "ehmr -i app/**/*.js " ',build:"vue-tsc --noEmit && vite build",pack:"  cd app  && tsc && npm run pack",dist:"  cd app  && tsc && npm run dist",bp:"npm run build && npm run pack",bd:"npm run build && npm run dist",serve:"vite preview","pup:test":"cd ./app && tsc && node lib/test.js"},De={"@ant-design/icons-vue":"^6.0.1","@rollup/plugin-commonjs":"^21.0.0","@rollup/plugin-node-resolve":"^13.0.5","@types/axios":"^0.14.0","ant-design-vue":"^2.2.8",axios:"^0.22.0","electron-store":"^8.0.1","mark-ui":"^1.1.6","puppeteer-core":"^10.4.0",uuid:"^8.3.2",vue:"^3.2.6","vue-router":"^4.0.11"},ke={"@types/electron":"^1.6.10","@types/node":"^16.9.1","@vitejs/plugin-vue":"^1.9.3","@vue/cli-plugin-router":"~4.5.0","@vue/compiler-sfc":"^3.2.6",chalk:"^4.1.2",concurrently:"^6.2.1",electron:"^15.0.0","electron-builder":"^22.11.7","electron-hmr":"^1.1.7",less:"^4.1.1","less-loader":"^10.0.1",typescript:"^4.3.2",vite:"^2.6.3","vite-plugin-components":"^0.13.3","vue-tsc":"^0.3.0"},be="ocs - \u5728\u7EBF\u7F51\u7EDC\u8BFE\u7A0B\u8F85\u52A9\u5DE5\u5177",we={type:"git",url:"git+https://github.com/enncy/online-course-script.git"},Re=["ocs","script","puppeteer","electron","vue3","antdv"],xe="enncy",Oe="Apache-2.0",Le={url:"https://github.com/enncy/online-course-script/issues"},Pe="https://github.com/enncy/online-course-script#readme";var j={name:ye,version:Ae,main:Ce,scripts:Be,dependencies:De,devDependencies:ke,description:be,repository:we,keywords:Re,author:xe,license:Oe,bugs:Le,homepage:Pe};const Ne={class:"font-v4 flex nowrap height-24"},Ie={class:"flex nowrap space-10 jc-flex-start ai-center"},$e={class:"space-4"},je={class:"space-4"},Se={key:0},Ue={class:"flex nowrap space-10 jc-flex-end ai-center ac-center"},Te={style:{cursor:"pointer",display:"flex"}},Ve={style:{cursor:"pointer",display:"flex"}},qe=_("pre",null,`  \r
                     - \u672C\u8F6F\u4EF6\u5B8C\u5168\u5F00\u6E90\u514D\u8D39\uFF0C**\u8C28\u9632\u4E0A\u5F53\u53D7\u9A97** \uFF0C\u7981\u6B62\u7528\u4E8E\u5546\u4E1A\u7528\u9014\uFF0C\u4EC5\u4F9B\u5B66\u4E60\u4EA4\u6D41\u4F7F\u7528\r
                     - \u6B64\u8F6F\u4EF6\u4E0D\u4F1A\u6536\u96C6\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\uFF0C\u6240\u6709\u4FE1\u606F\u5747\u4FDD\u5B58\u5230\u672C\u5730\r
                     - \u6B64\u8F6F\u4EF6\u6D89\u53CA\u5230\u7684\u811A\u672C\u5982\u6709\u4EFB\u4F55\u4FB5\u6743\u884C\u4E3A\uFF0C\u8BF7\u8054\u7CFB\u4F5C\u8005\u8FDB\u884C\u5220\u9664\r
                     - \u5982\u6709\u4EFB\u4F55\u7591\u95EE\uFF0C\u8BF7\u5230BUG\u53CD\u9988\u5904\u53CD\u9988\uFF0C\u6216\u8005\u76F4\u63A5\u8054\u7CFB\u4F5C\u8005\u90AE\u7BB1 **enncyemail@qq.com**\r
                    `,-1),ze=x({setup(o){const c=z(),s=O([]);c.beforeEach((a,l)=>{s.value=a.matched.map(m=>m.meta.desc)});function e(){y.success("\u590D\u5236\u6210\u529F!")}const t=O(!1),n=()=>{t.value=!0},i=a=>{console.log(a),t.value=!1};return(a,l)=>{const m=W,F=Q,B=X;return p(),D("div",Ne,[_("div",Ie,[_("li",null,L(E(j).name)+" - v"+L(E(j).version),1),_("li",$e,[(p(!0),D(H,null,K(s.value,(f,R)=>(p(),D("span",je,[R!==0?(p(),D("span",Se," / ")):G("",!0),_("span",null,L(f),1)]))),256))])]),_("div",Ue,[_("span",Te,[u(m,{title:"\u9996\u9875",class:"font-v2",onClick:l[0]||(l[0]=f=>a.$router.push("/"))})]),_("span",Ve,[u(F,{title:"\u5173\u4E8E",class:"font-v2",onClick:n})])]),u(B,{visible:t.value,"onUpdate:visible":l[1]||(l[1]=f=>t.value=f),title:"\u4F7F\u7528\u987B\u77E5",onOk:i,footer:!1},{default:r(()=>[_("p",null,[u(E(M),{codeStyle:"github-dark",renderKey:"1",style:{"text-align":"left","letter-spacing":"1px"},raw:"",onCopy:e},{default:r(()=>[qe]),_:1})])]),_:1},8,["visible"])])}}}),He=require("electron-store"),S=new He,C=Y(S.store);Z(C,()=>{console.log("config change",C),C.setting,S.store=J(C)});const Ke=C.setting;var v;(function(o){o.CX="cx",o.CX_LOGIN="cx-login",o.ZHS="zhs",o.ZHS_LOGIN="zhs-login",o.DEBUG="debug",o.INFO="info",o.WARN="warn",o.SUCCESS="success",o.ERROR="error",o.NOTIFY="notify"})(v||(v={}));var b;(function(o){o.APP_UPDATE="app-update",o.CANCEL_APP_UPDATE="cancel-app-update",o.IS_NEED_UPDATE="is-need-update",o.SCRIPT_LOGIN="script-login"})(b||(b={}));function Ge(o){return{get:o+"-get",set:o+"-set",call:o+"-call",on:o+"-on",once:o+"-once"}}const{ipcRenderer:g}=require("electron"),U=require("uuid");function w(o){const c=Ge(o);return{get(s){return g.sendSync(c.get,[s])},set(s,e){return g.sendSync(c.set,[s,e])},call(s,...e){return g.sendSync(c.call,[s,...e])},on(s,e){const t=s+"-"+U.v4().replace(/-/g,"");g.send(c.on,t),g.on(t,e)},once(s,e){const t=s+"-"+U.v4().replace(/-/g,"");g.send(c.once,t),g.once(t,e)}}}const N={win:w("win"),app:w("app"),dialog:w("dialog"),script:w("script")};const Me=P(" \u8D26\u53F7\u7BA1\u7406 "),We=P(" \u4EFB\u52A1\u5217\u8868 "),Qe=P(" \u8BBE\u7F6E "),Xe=x({setup(o){const c=O(["1"]),{system:s}=Ke;function e(){s.win.isAlwaysOnTop=!s.win.isAlwaysOnTop,N.win.call("setAlwaysOnTop",s.win.isAlwaysOnTop)}return(t,n)=>{const i=ee,a=te,l=ne,m=oe,F=se,B=ue,f=$("IconFont"),R=ce,V=re,q=ie;return p(),A(q,null,{default:r(()=>[u(B,{span:20,class:"font-v3"},{default:r(()=>[u(F,{theme:"light",mode:"horizontal",selectedKeys:c.value,"onUpdate:selectedKeys":n[3]||(n[3]=h=>c.value=h)},{default:r(()=>[u(a,{key:"1",onClick:n[0]||(n[0]=h=>t.$router.push("/users"))},{default:r(()=>[u(i,{class:"icon"}),Me]),_:1}),u(a,{key:"2",onClick:n[1]||(n[1]=h=>t.$router.push("/task"))},{default:r(()=>[u(l,{class:"icon"}),We]),_:1}),u(a,{key:"3",onClick:n[2]||(n[2]=h=>t.$router.push("/setting/common"))},{default:r(()=>[u(m,{class:"icon"}),Qe]),_:1})]),_:1},8,["selectedKeys"])]),_:1}),u(B,{span:4},{default:r(()=>[u(F,{theme:"light",mode:"horizontal",id:"operations",class:"flex jc-flex-end",selectable:!1},{default:r(()=>[u(a,{onClick:e},{default:r(()=>[E(s).win.isAlwaysOnTop?(p(),A(f,{key:0,title:"\u7F6E\u9876",type:"icon-relieve-full"})):(p(),A(f,{key:1,title:"\u53D6\u6D88\u7F6E\u9876",type:"icon-relieve"}))]),_:1}),u(a,{onClick:n[4]||(n[4]=h=>E(N).win.call("minimize")),title:"\u6700\u5C0F\u5316"},{default:r(()=>[u(R)]),_:1}),u(a,{onClick:n[5]||(n[5]=h=>E(N).win.call("close")),title:"\u6700\u5927\u5316"},{default:r(()=>[u(V)]),_:1})]),_:1})]),_:1})]),_:1})}}});const Ye=x({setup(o){const{ipcRenderer:c}=require("electron");return c.on(v.INFO,(s,e)=>{y.info(e)}),c.on(v.WARN,(s,e)=>{y.warn(e)}),c.on(v.SUCCESS,(s,e)=>{y.success(e)}),c.on(v.ERROR,(s,e)=>{y.error(e)}),c.on(v.NOTIFY,(s,e)=>{console.log(e);const t=e.name===b.APP_UPDATE,n={duration:t&&e.type==="info"?0:5,placement:"bottomRight",key:e.name,message:e.title,description:e.message,style:{padding:"12px"},class:"notification-message",onClose:()=>{t&&c.send(b.CANCEL_APP_UPDATE),k.close(e.name)}};t&&e.type==="success"?(k[e.type](n),setTimeout(()=>{k.close(e.name)},5e3)):k[e.type](n)}),(s,e)=>{const t=_e,n=$("router-view"),i=de,a=ze,l=me,m=fe;return p(),A(m,{class:"layout",style:{height:"100%"}},{default:r(()=>[u(t,{id:"layout-header"},{default:r(()=>[u(Xe)]),_:1}),u(i,{id:"layout-content"},{default:r(()=>[u(ae,{name:"fade"},{default:r(()=>[u(n,null,{default:r(({Component:F})=>[(p(),A(le,null,[(p(),A(pe(F)))],1024))]),_:1})]),_:1})]),_:1}),u(l,{id:"layout-footer"},{default:r(()=>[u(a)]),_:1})]),_:1})}}}),Ze="modulepreload",T={},Je="/",d=function(c,s){return!s||s.length===0?c():Promise.all(s.map(e=>{if(e=`${Je}${e}`,e in T)return;T[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const i=document.createElement("link");if(i.rel=t?"stylesheet":Ze,t||(i.as="script",i.crossOrigin=""),i.href=e,document.head.appendChild(i),t)return new Promise((a,l)=>{i.addEventListener("load",a),i.addEventListener("error",l)})})).then(()=>c())},I=ve({history:ge(),routes:[{path:"/",name:"index",component:()=>d(()=>import("./index.8b934b14.js"),["assets/index.8b934b14.js","assets/index.14b7ba40.css","assets/index.3b784651.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css"]),meta:{desc:"\u5173\u4E8E"}},{path:"/task",name:"task",component:()=>d(()=>import("./index.519b9d3e.js"),["assets/index.519b9d3e.js","assets/index.c5d3e8d1.css","assets/index.28f6fdd0.css","assets/index.11a12e90.css","assets/index.3b784651.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css","assets/Card.6a87bafe.js","assets/Card.480ecee3.css"]),meta:{desc:"\u4EFB\u52A1\u5217\u8868"}},{path:"/setting",name:"setting",component:()=>d(()=>import("./index.188c7161.js"),["assets/index.188c7161.js","assets/index.e1c83149.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css"]),children:[{path:"common",name:"setting-common",component:()=>d(()=>import("./CommonSetting.50cba645.js"),["assets/CommonSetting.50cba645.js","assets/index.a0e6257f.css","assets/index.11a12e90.css","assets/index.3b784651.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css","assets/Card.6a87bafe.js","assets/Card.480ecee3.css"]),meta:{desc:"\u901A\u7528\u8BBE\u7F6E"}},{path:"script",name:"setting-script",component:()=>d(()=>import("./ScriptSetting.2072071a.js"),["assets/ScriptSetting.2072071a.js","assets/ScriptSetting.9559232e.css","assets/index.11a12e90.css","assets/index.3b784651.css","assets/index.21f94949.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css","assets/Card.6a87bafe.js","assets/Card.480ecee3.css"]),meta:{desc:"\u811A\u672C\u8BBE\u7F6E"}},{path:"system",name:"setting-system",component:()=>d(()=>import("./SystemSetting.0224ec6c.js"),["assets/SystemSetting.0224ec6c.js","assets/SystemSetting.e2fd3f98.css","assets/index.0d501aef.css","assets/index.3b784651.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css","assets/Card.6a87bafe.js","assets/Card.480ecee3.css"]),meta:{desc:"\u7CFB\u7EDF\u8BBE\u7F6E"}},{path:"version",name:"setting-version-update",component:()=>d(()=>import("./VersionUpdate.7f00f35a.js"),["assets/VersionUpdate.7f00f35a.js","assets/VersionUpdate.0f274453.css","assets/index.3b784651.css","assets/index.0d501aef.css","assets/index.a0e6257f.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css","assets/Card.6a87bafe.js","assets/Card.480ecee3.css"]),meta:{desc:"\u7248\u672C\u66F4\u65B0"}}],meta:{desc:"\u8BBE\u7F6E"}},{path:"/users",name:"users",component:()=>d(()=>import("./index.34940b1c.js"),["assets/index.34940b1c.js","assets/index.82bd7524.css","assets/index.28f6fdd0.css","assets/index.21f94949.css","assets/index.11a12e90.css","assets/vendor.530941a1.js","assets/vendor.56b6d3f7.css"]),meta:{desc:"\u8D26\u53F7\u7BA1\u7406"}},{path:"/:catchAll(.*)",name:"404",redirect:"/"}]});I.beforeEach((o,c)=>!!o.name&&I.hasRoute(o.name));const et=Fe({scriptUrl:"https://at.alicdn.com/t/font_2849771_3az41crtc9.js"});y.config({top:"74px",duration:2,maxCount:3});he(Ye).use(I).component("IconFont",et).mount("#app");export{b as I,N as R,C as c,j,Ke as s};
