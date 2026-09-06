import * as T from './vendor/three/three.module.js?v=433f66e85192';
import {OrbitControls} from './vendor/three/OrbitControls.js?v=433f66e85192';
import {buildAtlasParts} from './rocket-atlas-model.mjs?v=433f66e85192';
export {PART_GROUPS,TOTAL_PARTS} from './rocket-atlas-model.mjs?v=433f66e85192';
export class RocketAtlas{
 constructor(canvas,onSelect){
  this.canvas=canvas;this.onSelect=onSelect;this.scene=new T.Scene();this.scene.background=new T.Color('#0b2029');
  this.camera=new T.PerspectiveCamera(38,1,.1,150);this.camera.position.set(0,1,24);
  this.renderer=new T.WebGLRenderer({canvas,antialias:true});this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.7));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.scene.add(new T.HemisphereLight('#ccece5','#13252d',2.8));const light=new T.DirectionalLight('#ffe2a0',4);light.position.set(-4,8,10);this.scene.add(light);const rim=new T.DirectionalLight('#58b9b2',2.4);rim.position.set(7,2,-4);this.scene.add(rim);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=true;this.controls.minDistance=4;this.controls.maxDistance=80;this.controls.target.set(0,0,0);
  this.parts=buildAtlasParts();this.meshes=this.parts.map(p=>{const mat=new T.MeshStandardMaterial({color:'#29434c',metalness:.7,roughness:.36,transparent:true,opacity:.21,side:T.DoubleSide});const mesh=new T.Mesh(p.geometry,mat);mesh.userData.part=p;mesh.position.fromArray(p.position);mesh.rotation.fromArray(p.rotation);this.scene.add(mesh);const edge=new T.LineSegments(new T.EdgesGeometry(p.geometry,25),new T.LineBasicMaterial({color:'#769a9d',transparent:true,opacity:.27}));mesh.add(edge);return mesh});
  this.amount=0;this.target=0;this.chapter=0;this.filter=-1;this.isolated=null;this.selected=null;this.paused=true;this.disposed=false;this.abort=new AbortController();
  this.ray=new T.Raycaster();canvas.addEventListener('pointerdown',e=>this.down=[e.clientX,e.clientY],{signal:this.abort.signal});canvas.addEventListener('pointerup',e=>{if(!this.down||Math.hypot(e.clientX-this.down[0],e.clientY-this.down[1])>7)return;const r=canvas.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);const hit=this.ray.intersectObjects(this.meshes.filter(m=>m.visible),false)[0];if(hit)this.select(hit.object.userData.part.index)},{signal:this.abort.signal});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();this.frame=this.frame.bind(this);this.raf=requestAnimationFrame(this.frame);
 }
 resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}
 setProgress(chapter){this.chapter=chapter;this.meshes.forEach((m,i)=>{const unlocked=this.parts[i].group<chapter;m.userData.unlocked=unlocked;m.material.color.set(unlocked?['#c7af77','#94b7a2','#d8c393','#548f85','#b58b58','#a4543b','#b5cec3','#d9bd76'][this.parts[i].group]:'#29434c');m.children[0].material.color.set(unlocked?'#e1cd90':'#739393')});this.applyFilter()}
 explode(value){this.target=Math.max(0,Math.min(1,value));this.fit()}
 fit(){this.controls.reset();this.controls.target.set(0,0,0);const spread=this.target>.5;const h=spread?18:14,w=spread?26:6;const dist=Math.max(h,w/Math.max(.4,this.camera.aspect))/2/Math.tan(T.MathUtils.degToRad(19));this.camera.position.set(spread?0:3,spread?0:1,dist+2);this.controls.update()}
 setFilter(group){this.filter=group;this.isolated=null;this.selected=null;this.meshes.forEach(m=>m.material.emissive.set(0));this.applyFilter();this.fit()}
 applyFilter(){this.meshes.forEach((m,i)=>m.visible=(this.filter<0||this.parts[i].group===this.filter)&&(this.isolated===null||this.isolated===i))}
 select(index){this.selected=index;this.onSelect(this.parts[index]);this.meshes.forEach((m,i)=>m.material.emissive.set(i===index?'#685122':'#000000'))}
 isolate(){if(this.selected===null)return;this.isolated=this.isolated===null?this.selected:null;this.applyFilter();if(this.isolated!==null){const p=this.meshes[this.selected].position;this.controls.target.copy(p);this.camera.position.copy(p).add(new T.Vector3(0,1,5))}else this.fit()}
 frame(now){if(this.disposed)return;if(!this.paused&&!document.hidden){this.amount+=(this.target-this.amount)*.075;this.meshes.forEach((m,i)=>{const p=this.parts[i],q=this.amount;m.position.set(...p.position).lerp(new T.Vector3(...p.grid.map((v,k)=>v-p.gridCenter[k]*p.gridScale)),q);m.rotation.set(...p.rotation.map(v=>v*(1-q)));m.scale.setScalar(1+(p.gridScale-1)*q);const goal=m.userData.unlocked?1:.19;m.material.opacity+=(goal-m.material.opacity)*.06;m.children[0].material.opacity=m.userData.unlocked?.32:.38});this.controls.update();this.renderer.render(this.scene,this.camera)}this.raf=requestAnimationFrame(this.frame)}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.abort.abort();this.observer.disconnect();this.controls.dispose();this.meshes.forEach(m=>{m.geometry.dispose();m.material.dispose();m.children.forEach(e=>{e.geometry.dispose();e.material.dispose()})});this.renderer.dispose()}
}
