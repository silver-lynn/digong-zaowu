const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
// Runs the actual UI controller against a small DOM/canvas double. It verifies
// action wiring and saved outcomes without claiming browser or visual coverage.
function boot(saved){
 const registry=[],ids=new Map(),listeners={},storage=new Map(),frames=[],timers=new Map();let timerId=0;
 const drawCalls=[];
 const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),drawImage:(...args)=>drawCalls.push(args)}, {get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>(t[k]=v,true)});
 class Element{
  constructor(tag='div',attrs={}){this.tag=tag;this.attrs=attrs;this.dataset={};for(const k in attrs)if(k.startsWith('data-'))this.dataset[k.slice(5)]=attrs[k];this.classes=new Set((attrs.class||'').split(' '));this.classList={add:(...x)=>x.forEach(v=>this.classes.add(v)),remove:(...x)=>x.forEach(v=>this.classes.delete(v)),toggle:(x,f)=>f===true?this.classes.add(x):f===false?this.classes.delete(x):this.classes.has(x)?this.classes.delete(x):this.classes.add(x)};this.events={};this.style={};this.children=[];this.open=false;this.textContent='';this.width=1000;this.height=560;if(attrs.id)ids.set(attrs.id,this);registry.push(this)}
  set innerHTML(s){for(const c of this.children){const i=registry.indexOf(c);if(i>=0)registry.splice(i,1)}this.children=parse(s);this.html=s}
  get innerHTML(){return this.html||''}
  addEventListener(k,f){(this.events[k]??=[]).push(f)}
  emit(k,e={}){e={preventDefault(){},stopImmediatePropagation(){},target:this,button:0,...e};for(const f of this.events[k]||[])f(e);if(k==='click'&&this.onclick)this.onclick(e)}
  click(){if(!this.disabled)this.emit('click')}
  querySelector(s){if(s==='canvas')return this.localCanvas??=new Element('canvas');if(s==='i')return this.localI??=new Element('i');return null}
  get complete(){return this.tag==='img'}get naturalWidth(){return 1440}get naturalHeight(){return 1080}
  setAttribute(k,v){this.attrs[k]=v}getContext(){return context}getBoundingClientRect(){return {left:0,top:0,width:this.attrs.id==='craft-canvas'?700:1000,height:this.attrs.id==='craft-canvas'?360:560,right:1000,bottom:560}}
  showModal(){this.open=true}close(){this.open=false}setPointerCapture(){}append(){}remove(){}
 }
 function parse(s){return [...s.matchAll(/<([\w-]+)\b([^>]*)>/g)].map(m=>{const attrs=Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]]));return new Element(m[1],attrs)})}
 function matches(e,s){if(s==='dialog[open]')return e.tag==='dialog'&&e.open;if(s.startsWith('.'))return e.classes.has(s.slice(1));const a=s.match(/^\[([^\]]+)\]$/);return a?Object.hasOwn(e.attrs,a[1]):false}
 parse(fs.readFileSync('workshop.html','utf8'));if(saved)storage.set('tiangong-workshop-v1',JSON.stringify(saved));
 const win={addEventListener:(k,f)=>(listeners[k]??=[]).push(f)};
 const doc={getElementById:id=>ids.get(id),querySelectorAll:s=>registry.filter(e=>matches(e,s)),querySelector:s=>registry.find(e=>matches(e,s)),createElement:t=>new Element(t),body:new Element('body'),addEventListener:win.addEventListener,hidden:false};
 const sandbox={window:win,document:doc,console,Math,Set,JSON,performance:{now:()=>1000},devicePixelRatio:1,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:false}),requestAnimationFrame:f=>frames.push(f),setTimeout:(f,ms)=>{timers.set(++timerId,{f,ms});return timerId},clearTimeout:id=>timers.delete(id)};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('game-data.js','utf8'),sandbox);sandbox.Tiangong=win.Tiangong;vm.runInContext(fs.readFileSync('workshop.js','utf8'),sandbox);
 const getState=()=>JSON.parse(storage.get('tiangong-workshop-v1'));
 function part(id){const e=registry.find(e=>e.dataset.part===id);assert.ok(e,'part '+id);e.click()}
 function slot(id){const e=registry.find(e=>e.dataset.slot===id);assert.ok(e,'slot '+id);e.click()}
 function craftDone(){assert.ok(ids.get('craft-dialog').open);for(let i=0;i<32&&ids.get('craft-done').disabled;i++)ids.get('craft-assist').click();assert.equal(ids.get('craft-done').disabled,false);ids.get('craft-done').click()}
 function tick(){const f=frames.shift();if(f)f(1100)}
 function project(id){registry.find(e=>e.dataset.project===id).click()}
 return {ids,registry,getState,part,slot,craftDone,tick,project,timers,context,drawCalls};
}
test('actual controller boots and renders its first canvas frame',()=>{const b=boot();b.tick();assert.equal(b.ids.get('project-title').textContent,'会跑的小木车')});
test('craft, assembly, run, collection, and reload form a complete car loop',()=>{const b=boot();b.part('wheel');b.craftDone();b.slot('left');b.part('wheel');assert.equal(b.ids.get('craft-dialog').open,false);b.slot('right');b.part('body');b.slot('body');b.part('axle');b.craftDone();b.slot('axle');b.tick();b.ids.get('run-button').click();b.tick();const saved=b.getState();assert.deepEqual(saved.completed,['car']);assert.equal(saved.tech.length,3);const timer=[...b.timers.values()].find(t=>t.ms===4300);timer.f();assert.equal(b.ids.get('result-dialog').open,true);const again=boot(saved);again.tick();assert.equal(again.ids.get('assembly-count').textContent,'已装 4 / 4 件')});
test('all four craft types finish and all three projects open free play',()=>{const b=boot();for(const [id,items]of Object.entries({car:[['body','body'],['axle','axle'],['wheel','left'],['wheel','right']],water:[['support','support'],['waterwheel','waterwheel'],['crank','crank'],['bucket','bucket']],bell:[['support','support'],['gear','gear'],['cam','cam'],['striker','striker'],['bell','bell']]})){b.project(id);for(const [part,slot]of items){b.part(part);if(b.ids.get('craft-dialog').open){b.tick();b.craftDone()}b.slot(slot)}b.ids.get('run-button').click();b.tick();b.ids.get('run-button').click()}
 assert.equal(b.getState().tech.length,9);b.project('free');assert.equal(b.getState().project,'free');b.part('gear');b.ids.get('free-place').click();assert.equal(b.getState().free.length,1);b.ids.get('run-button').click();b.tick();
});
test('clear and undo preserve learned crafting and restore the assembly',()=>{const b=boot();b.part('wheel');b.craftDone();b.slot('left');b.ids.get('clear-button').click();assert.deepEqual(b.getState().assemblies.car,{});assert.ok(b.getState().crafted.includes('wheel'));b.ids.get('undo-button').click();assert.equal(b.getState().assemblies.car.left,'wheel')});
test('missing parts show a useful message and do not give rewards',()=>{const b=boot();b.ids.get('run-button').click();assert.match(b.ids.get('toast').textContent,/轮轴/);assert.equal(b.getState().completed.length,0)});
test('car board alone creates no phantom wheels; installed wheel groups render as pairs',()=>{
 const b=boot();b.part('body');b.slot('body');b.drawCalls.length=0;b.tick();
 const wheels=()=>b.drawCalls.filter(c=>[766,1113].includes(c[1]));assert.equal(wheels().length,0);
 b.part('wheel');b.craftDone();b.slot('left');b.drawCalls.length=0;b.tick();assert.equal(wheels().length,2);
 b.part('bigwheel');b.craftDone();b.slot('right');b.drawCalls.length=0;b.tick();assert.equal(wheels().length,4);assert.equal(wheels().filter(c=>c[1]===1113).length,2);
 const bodyIndex=b.drawCalls.findIndex(c=>c[1]===12);assert.ok(b.drawCalls.slice(0,bodyIndex).some(c=>c[1]===766));assert.ok(b.drawCalls.slice(bodyIndex+1).some(c=>c[1]===766));
});
test('clicking the back-side car wheel removes its installed pair',()=>{
 const G=require('../game-data.js'),saved=G.fresh();saved.assemblies.car={body:'body',axle:'axle',left:'wheel',right:'wheel'};
 const b=boot(saved),g=G.geometry.car,p={x:g.near[1].x+g.depth.x,y:g.near[1].y+g.depth.y},scale=1000/1150;
 b.ids.get('scene').emit('pointerdown',{clientX:(1000-1000*scale)/2+p.x*scale,clientY:(560-560*scale)/2+p.y*scale});
 assert.equal(b.getState().assemblies.car.right,undefined);assert.equal(b.getState().assemblies.car.left,'wheel');
});
