import{_ as m}from"../chunks/preload-helper-cd5f4ade.js";import{S as j,i as x,s as I,l as y,f as d,E as O,d as u,e as f,t as w,k as g,c as k,a as v,g as P,n as E,b,D as p,M as i,F as R,A as D,P as L,L as V,Q as C,R as S}from"../chunks/vendor-c81f9e33.js";function A(o,t,e){const n=o.slice();return n[1]=t[e],n}function H(o){return{c:i,l:i,m:i,p:i,d:i}}function N(o){let t,e,n,l,h,c=o[4].html+"",s;return{c(){t=f("section"),e=f("a"),n=w("edit documentation"),l=g(),h=new C,s=g(),this.h()},l(r){t=k(r,"SECTION",{class:!0});var a=v(t);e=k(a,"A",{href:!0,class:!0});var _=v(e);n=P(_,"edit documentation"),_.forEach(u),l=E(a),h=S(a),a.forEach(u),s=E(r),this.h()},h(){b(e,"href","https://github.com/chainlist/svelte-forms/edit/master/src/docs/"+o[4].attributes.filename),b(e,"class","absolute top-1 right-1 sm:top-5 sm:right-5 text-gray-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"),h.a=null,b(t,"class","space-y-7 relative group")},m(r,a){d(r,t,a),p(t,e),p(e,n),p(t,l),h.m(c,t),d(r,s,a)},p:i,d(r){r&&u(t),r&&u(s)}}}function M(o){return{c:i,l:i,m:i,p:i,d:i}}function T(o){let t,e={ctx:o,current:null,token:null,hasCatch:!1,pending:M,then:N,catch:H,value:4};return V(o[1],e),{c(){t=y(),e.block.c()},l(n){t=y(),e.block.l(n)},m(n,l){d(n,t,l),e.block.m(n,e.anchor=l),e.mount=()=>t.parentNode,e.anchor=t},p(n,l){o=n,O(e,o,l)},d(n){n&&u(t),e.block.d(n),e.token=null,e=null}}}function $(o){let t,e,n,l,h=o[0],c=[];for(let s=0;s<h.length;s+=1)c[s]=T(A(o,h,s));return{c(){t=f("section"),e=f("h1"),n=w("svelte-forms documentation"),l=g();for(let s=0;s<c.length;s+=1)c[s].c();this.h()},l(s){t=k(s,"SECTION",{class:!0});var r=v(t);e=k(r,"H1",{});var a=v(e);n=P(a,"svelte-forms documentation"),a.forEach(u),l=E(r);for(let _=0;_<c.length;_+=1)c[_].l(r);r.forEach(u),this.h()},h(){b(t,"class","px-10 smpx-20 space-y-32")},m(s,r){d(s,t,r),p(t,e),p(e,n),p(t,l);for(let a=0;a<c.length;a+=1)c[a].m(t,null)},p(s,[r]){if(r&1){h=s[0];let a;for(a=0;a<h.length;a+=1){const _=A(s,h,a);c[a]?c[a].p(_,r):(c[a]=T(_),c[a].c(),c[a].m(t,null))}for(;a<c.length;a+=1)c[a].d(1);c.length=h.length}},i,o:i,d(s){s&&u(t),R(c,s)}}}async function q(){const o=await m(()=>import("../chunks/prism-5a893632.js").then(function(t){return t.p}),["chunks/prism-5a893632.js","chunks/vendor-c81f9e33.js"]);return await m(()=>import("../chunks/prism-bash-36f08276.js"),[]),await m(()=>import("../chunks/prism-typescript-3f1d703b.js"),[]),await m(()=>import("../chunks/prism-toolbar-1980a695.js"),[]),await m(()=>import("../chunks/prism-normalize-whitespace-9cce0920.js").then(function(t){return t.p}),[]),await m(()=>import("../chunks/index-2bcea5bc.js"),[]),o}function z(o){return D(async()=>{(await q()).highlightAll()}),[L("docs")]}class B extends j{constructor(t){super();x(this,t,z,$,I,{})}}export{B as default};
