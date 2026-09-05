const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../game-data.js');
const complete=id=>Object.fromEntries(G.projects[id].slots.map(s=>[s.id,G.projects[id].parts.find(p=>G.parts[p].kind===s.kind)]));
test('three projects can be completed using their own available parts',()=>{for(const id of ['car','water','bell'])assert.equal(G.evaluate(id,complete(id)).ok,true)});
test('missing parts name the actual bottleneck and cannot unlock by running',()=>{const a=complete('car');delete a.axle;const r=G.evaluate('car',a);assert.equal(r.ok,false);assert.deepEqual(r.missing,['轮轴组'])});
test('incorrect part kinds cannot satisfy an assembly slot',()=>{const a=complete('water');a.crank='bell';assert.equal(G.evaluate('water',a).ok,false)});
test('different wheel sizes produce a distinct playable outcome',()=>{const a=complete('car');a.right='bigwheel';assert.equal(G.evaluate('car',a).type,'wobble');a.left='bigwheel';assert.equal(G.evaluate('car',a).type,'success')});
test('repeating success does not duplicate collection or technologies',()=>{const s=G.fresh();assert.equal(G.unlock(s,'car').length,3);assert.equal(G.unlock(s,'car').length,0);assert.equal(s.completed.length,1);assert.equal(s.tech.length,3)});
test('finishing all projects unlocks all nine technologies',()=>{const s=G.fresh();['bell','car','water'].forEach(id=>G.unlock(s,id));assert.equal(s.tech.length,9);assert.equal(s.completed.length,3);s.project='free';assert.equal(G.sanitize(s).project,'free')});
test('save cannot enter free mode before completing the three projects',()=>{const s=G.fresh();s.project='free';assert.equal(G.sanitize(s).project,'car')});
test('malformed and incompatible storage recovers safely',()=>{assert.deepEqual(G.sanitize(null),G.fresh());assert.deepEqual(G.sanitize({version:44}),G.fresh());const s=G.sanitize({version:1,crafted:['wheel','wheel','unknown'],assemblies:{car:{left:'bell',right:'wheel'}},free:[null,{part:'wheel',x:'bad',y:5}],tech:['invalid']});assert.deepEqual(s.crafted,['wheel']);assert.deepEqual(s.assemblies.car,{right:'wheel'});assert.equal(s.free.length,0);assert.equal(s.tech.length,0)});
test('local save roundtrip preserves assembly, collection, sound preference',()=>{const s=G.fresh();s.assemblies.car=complete('car');s.crafted=['wheel','axle'];s.muted=true;G.unlock(s,'car');assert.deepEqual(G.sanitize(JSON.parse(JSON.stringify(s))),s)});
test('free assemblies have a bounded size and positions',()=>{const s=G.sanitize({version:1,free:Array.from({length:40},(_,i)=>({part:'wheel',x:-500,y:999,id:i}))});assert.equal(s.free.length,18);assert.equal(s.free[0].x,110);assert.equal(s.free[0].y,430);assert.equal(new Set(s.free.map(p=>p.id)).size,18)});
test('power travels through connected neighbors and stops at gaps',()=>{const a=[{id:1,part:'crank',x:0,y:0},{id:2,part:'gear',x:140,y:0},{id:3,part:'bell',x:280,y:0},{id:4,part:'wheel',x:700,y:0}];assert.deepEqual([...G.network(a)],[1,2,3]);a[2].x=500;assert.deepEqual([...G.network(a)],[1,2])});
test('free play uses a manual starting point if no crank is present',()=>{assert.equal(G.network([]).size,0);assert.deepEqual([...G.network([{id:3,part:'gear',x:10,y:10}])],[3])});
test('every referenced interface id exists in the document',()=>{const fs=require('node:fs'),html=fs.readFileSync('workshop.html','utf8'),js=fs.readFileSync('workshop.js','utf8');const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));const dynamic=['free-place','free-last','atlas-go'];for(const [,id]of js.matchAll(/\$\('([\w-]+)'\)/g))assert.ok(ids.has(id)||dynamic.includes(id),'Missing UI element: '+id)});

test('water bucket starts at its resting anchor and follows the same projected circular path',()=>{
 const g=G.geometry.water,start=G.projects.water.slots.find(s=>s.id==='bucket');assert.deepEqual(G.bucketPose(0),{x:start.x,y:start.y});
 for(let t=0;t<16;t+=.13){const p=G.bucketPose(t),x=p.x-g.hub.x,y=p.y-g.hub.y-g.plane[1]*x;assert.ok(Math.abs(Math.hypot(x,y)-g.radius)<1e-9)}
 const a=G.bucketPose(0),b=G.bucketPose(.00001);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001);
});
test('car wheel plane follows the chassis baseline and slots coincide with wheel centers',()=>{
 const g=G.geometry.car,dx=g.near[1].x-g.near[0].x,dy=g.near[1].y-g.near[0].y;
 assert.ok(Math.abs(dy/dx-g.plane[1]/g.plane[0])<.001);
 for(let i=0;i<2;i++){const s=G.projects.car.slots.find(s=>s.id===(i?'right':'left'));assert.equal(s.x,g.near[i].x);assert.equal(s.y,g.near[i].y)}
 assert.ok(g.depth.x>0&&g.depth.y<0,'axles recede into the board depth');
});
