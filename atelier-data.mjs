export const PARTS=[
 {id:'deck',name:'木台',kind:'frame',half:.16,ports:[[1.5,0,0],[-1.5,0,0],[0,0,1],[0,0,-1]]},
 {id:'post',name:'立柱',kind:'frame',half:1,ports:[[0,1,0],[0,-1,0]]},
 {id:'beam',name:'横梁',kind:'frame',half:.15,ports:[[-1.5,0,0],[1.5,0,0]]},
 {id:'axle',name:'轮轴',kind:'rotor',half:.13,ports:[[0,0,-1.3],[0,0,1.3]]},
 {id:'wheel',name:'木轮',kind:'rotor',half:.75,radius:.75,ports:[[0,0,-.14],[0,0,.14]]},
 {id:'waterwheel',name:'水轮',kind:'source',half:1.15,radius:1.15,ports:[[0,0,-.2],[0,0,.2]]},
 {id:'crank',name:'手摇柄',kind:'source',half:.55,radius:.5,ports:[[0,0,0]]},
 {id:'gear',name:'铜齿轮',kind:'rotor',half:.55,radius:.55,ports:[[0,0,0]]},
 {id:'pulley',name:'绳轮',kind:'rotor',half:.55,radius:.55,ports:[[0,0,-.1],[0,0,.1]]},
 {id:'basket',name:'提篮',kind:'lift',half:.45,ports:[[0,.5,0]]},
 {id:'bell',name:'铜钟',kind:'bell',half:.65,ports:[[0,.7,0]]},
 {id:'striker',name:'钟槌',kind:'striker',half:.12,ports:[[0,0,0]]},
 {id:'lantern',name:'走马灯',kind:'rotor',half:1,ports:[[0,-1,0],[0,1,0]]},
 {id:'head',name:'木兽首',kind:'frame',half:.5,ports:[[-.6,0,0]]},
 {id:'leg',name:'连杆足',kind:'leg',half:.75,ports:[[0,.65,0]]}
];
export const partInfo=id=>PARTS.find(p=>p.id===id);
export const uid=()=>globalThis.crypto?.randomUUID?.()||`p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const node=(type,x,y,z=0,ry=0)=>({id:uid(),type,x,y,z,ry,color:'#4f8877'});
export const RECIPES=[{name:'木轮小车',text:'沿着同一根轮轴，车轮和木台自然对齐。'}, {name:'水轮提篮',text:'水轮带动绳轮，绳子牵起提篮。'}, {name:'一声小钟',text:'摇柄把动作传给钟槌。'}, {name:'手摇升台',text:'让高处的提篮升起，再缓缓落下。'}, {name:'走马灯',text:'给灯添上颜色，让光影慢慢转动。'}, {name:'木作小兽',text:'连杆足随同一节奏摆动。'}, {name:'水上乐台',text:'水轮、提篮与钟声，合成一段小小演出。'}];
export function recipe(i){let a=[];const add=(...args)=>{a.push(node(...args));return a.length-1};let edges=[];const link=(x,y)=>edges.push([x,y]);
 if(i===0||i===5){add('deck',0,1.6);for(const x of [-1.4,1.4]){const ax=add('axle',x,.75);for(const z of [-1.35,1.35])link(ax,add('wheel',x,.75,z))}const c=add('crank',-1.4,.75,1.6);link(c,1);link(1,4);if(i===5){add('head',2.65,1.9);for(const x of [-1.4,1.4])for(const z of [-1,1])link(1,add('leg',x,1.15,z))}}
 else if(i===1||i===3||i===6){add('deck',0,.2);add('post',-1.5,1.35);add('post',1.5,1.35);add('beam',0,2.5);const src=add(i===3?'crank':'waterwheel',-1.5,1.35,1.25),p=add('pulley',1.5,2.5,1.25),b=add('basket',1.5,.8,1.25);link(src,p);link(p,b);if(i===6){const bell=add('bell',0,1.8,-.5),str=add('striker',-.8,1.55,-.5);link(src,str);link(str,bell)}}
 else if(i===2){add('deck',0,.2);for(const x of [-1.5,1.5])add('post',x,1.35);add('beam',0,2.5);const b=add('bell',0,1.7),c=add('crank',-1.45,1.4,.7),s=add('striker',-.8,1.4);link(c,s);link(s,b)}
 else{add('deck',0,.2);add('post',0,1.35);const l=add('lantern',0,3),c=add('crank',0,1.4,1);link(c,l)}
 return {version:3,name:RECIPES[i]?.name||'无名造物',author:'无名匠人',era:0,recipe:i,featured:false,nodes:a,links:edges.map(([x,y])=>[a[x].id,a[y].id]),updated:Date.now()};
}
const finite=(v,min,max,def=0)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):def;
export function sanitizeWork(raw){if(!raw||raw.version!==3||!Array.isArray(raw.nodes)||raw.nodes.length>64)return null;const ids=new Set(),nodes=[];for(const p of raw.nodes){if(!p||!partInfo(p.type)||typeof p.id!=='string'||p.id.length>90||!/^[-a-zA-Z0-9]+$/.test(p.id)||ids.has(p.id))return null;ids.add(p.id);nodes.push({id:p.id,type:p.type,x:finite(p.x,-7,7),y:finite(p.y,.1,7,1),z:finite(p.z,-7,7),ry:finite(p.ry,-Math.PI*4,Math.PI*4),color:/^#[0-9a-f]{6}$/i.test(p.color)?p.color:'#4f8877'})}return {version:3,name:String(raw.name||'无名造物').slice(0,24),author:String(raw.author||'无名匠人').slice(0,20),era:Math.floor(finite(raw.era,0,3)),recipe:Math.floor(finite(raw.recipe,-1,6,-1)),featured:raw.featured===true,nodes,links:(Array.isArray(raw.links)?raw.links:[]).slice(0,96).filter(a=>Array.isArray(a)&&a.length===2&&ids.has(a[0])&&ids.has(a[1])&&a[0]!==a[1]).map(a=>[...a]),updated:finite(raw.updated,0,Date.now()+86400000,Date.now())}}
export function powered(work){const active=new Set(work.nodes.filter(n=>partInfo(n.type)?.kind==='source').map(n=>n.id));let changed=true;while(changed){changed=false;for(const [a,b]of work.links)if(active.has(a)&&!active.has(b)){active.add(b);changed=true}else if(active.has(b)&&!active.has(a)){active.add(a);changed=true}}return active}
export function worldPorts(n){const c=Math.cos(n.ry),s=Math.sin(n.ry);return partInfo(n.type).ports.map(([x,y,z])=>[n.x+x*c+z*s,n.y+y,n.z-x*s+z*c])}
export function snapPart(work,id){const n=work.nodes.find(n=>n.id===id);if(!n)return false;let nearest=null,dist=.4;for(const other of work.nodes){if(other===n)continue;for(const a of worldPorts(n))for(const b of worldPorts(other)){const d=Math.hypot(...a.map((v,i)=>v-b[i]));if(d<dist){dist=d;nearest=a.map((v,i)=>b[i]-v)}}}if(nearest){n.x+=nearest[0];n.y+=nearest[1];n.z+=nearest[2];return true}return false}
export function connect(work,a,b){if(a===b||!work.nodes.some(n=>n.id===a)||!work.nodes.some(n=>n.id===b)||work.links.some(l=>l.includes(a)&&l.includes(b)))return false;work.links.push([a,b]);return true}
export function duplicateWork(w){const result=structuredClone(w),ids=new Map(result.nodes.map(n=>[n.id,uid()]));result.nodes.forEach(n=>n.id=ids.get(n.id));result.links=result.links.map(l=>l.map(id=>ids.get(id)));result.name=(result.name.slice(0,20)+' · 副本');result.featured=false;result.updated=Date.now();return result}
