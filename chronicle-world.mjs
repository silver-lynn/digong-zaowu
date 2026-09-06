import * as T from './vendor/three/three.module.js?v=8e433e6a8218';
import {PalaceWorld} from './palace-world.mjs?v=8e433e6a8218';
import {box,materials} from './palace-models.mjs?v=8e433e6a8218';
import {makeWork,disposeGroup} from './atelier-models.mjs?v=8e433e6a8218';
export class ChronicleWorld extends PalaceWorld{
 constructor(canvas,onPick){super(canvas,onPick);this.showThrone();this.exhibits=new T.Group();this.scene.add(this.exhibits)}
 showThrone(era=0){this.state=null;if(this.era!==era)this.rebuild(era);this.opening=true;this.cameraMove=null;this.controls.enabled=false;this.camera.position.set(0,20,8);this.controls.target.set(0,4,-2)}
 descend(onStep,onDone,reduced=false,onProgress=()=>{}){this.opening=false;this.descent={elapsed:0,duration:reduced?1200:12500,onStep,onDone,onProgress,last:-1};this.path=new T.CatmullRomCurve3([new T.Vector3(0,22,6),new T.Vector3(0,15,15),new T.Vector3(0,10,23),new T.Vector3(0,9.5,28)]);this.cameraMove=null;this.beginCeremony()}
 skipDescent(){if(this.descent)this.descent.elapsed=this.descent.duration}
 setMode(mode){this.opening=false;super.setMode(mode)}
 configureNetwork(nodes){super.configureNetwork(nodes);const stars=this.hall.userData.stars,coords=new Map();nodes.forEach(n=>{const a=n.branch/4*Math.PI*2,r=1.2+n.rank*.65,p=n.id==='final'?new T.Vector3(0,4,0):new T.Vector3(Math.sin(a)*r,3.5,Math.cos(a)*r);this.techStars.get(n.id).position.copy(p);coords.set(n.id,p)});for(const e of this.techEdges){e.geometry.dispose();e.geometry=new T.BufferGeometry().setFromPoints([coords.get(e.userData.from),coords.get(e.userData.to)])}stars.rotation.y=0}
 frame(now){const dt=Math.min(80,Math.max(0,now-(this.last||now)));if(!document.hidden&&!this.suspended){if(this.descent){const d=this.descent;d.elapsed+=dt;const p=Math.min(1,d.elapsed/d.duration);this.camera.position.copy(this.path.getPointAt(Math.max(0,(p-.24)/.76)));this.controls.target.set(0,4,-2);d.onProgress(p);const step=Math.min(4,Math.floor(p*5));if(step!==d.last){d.last=step;this.ceremonyStep(step);d.onStep(step)}if(p===1){this.descent=null;d.onDone()}}
  if(this.flight){this.flight.elapsed+=dt;const p=Math.min(1,this.flight.elapsed/6500);this.assembly.position.y=p*p*20;this.keyLight.intensity=3.7+Math.sin(p*Math.PI)*3;this.controls.target.y=4+p*p*10;if(p===1){this.assembly.position.y=0;this.flight=null;this.setMode('overview');this.onFlightDone?.()}}}super.frame(now)
 }
 finale(onDone=()=>{}){this.onFlightDone=onDone;this.flight={elapsed:0};this.opening=false;this.controls.enabled=false;this.cameraMove=null;this.camera.position.set(10,8,23);this.controls.target.set(0,4,0)}
 exhibitWorks(works){for(const c of [...this.exhibits.children])disposeGroup(c);works.slice(0,6).forEach((w,i)=>{const g=new T.Group(),m=materials();box(g,m.stone,3.1,.5,3.1,0,.25);const model=makeWork(w,m);const b=new T.Box3().setFromObject(model),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3()),scale=2.7/Math.max(size.x,size.y,size.z);model.scale.setScalar(scale);model.position.set(-center.x*scale,.55-b.min.y*scale,-center.z*scale);g.add(model);g.position.set(i%2?7:-7,0,-9+Math.floor(i/2)*6);this.exhibits.add(g)})}
}
