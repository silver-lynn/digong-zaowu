import * as T from './vendor/three/three.module.js';

export const THEMES = [
 {stone:0x263e40,wood:0x704b2c,metal:0x9d8250,jade:0x507b69,light:0xffcf83},
 {stone:0x303d50,wood:0x765138,metal:0xbe9d63,jade:0x6d859b,light:0xffd99e},
 {stone:0x384346,wood:0x724633,metal:0x88918b,jade:0x648b7d,light:0xffbc76},
 {stone:0x2c4449,wood:0x664331,metal:0xc2aa72,jade:0x659d97,light:0xd9eddf}
];
let woodMap,bronzeMap;
function grainTexture(metal=false){const size=128,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,n=(Math.sin(x*127.1+y*311.7)*43758.5453)%1,w=Math.sin(y*.64+Math.sin(x*.067)*1.8)+Math.sin(y*2.7+x*.02)*.28;if(metal){const patina=Math.sin(x*.11)*Math.cos(y*.16)+Math.sin((x+y)*.05)>.8;data[i]=patina?116:224+Math.abs(n)*25;data[i+1]=patina?190:221+Math.abs(n)*25;data[i+2]=patina?183:197+Math.abs(n)*25}else{const v=capColor(194+w*16+n*16);data[i]=v;data[i+1]=v*.94;data[i+2]=v*.78}data[i+3]=255}const t=new T.DataTexture(data,size,size);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
const capColor=n=>Math.max(0,Math.min(255,n));
export function materials(theme=THEMES[0],texture){woodMap??=grainTexture();bronzeMap??=grainTexture(true);return {
 stone:new T.MeshStandardMaterial({color:theme.stone,roughness:.93}),
 wood:new T.MeshStandardMaterial({color:theme.wood,map:texture||woodMap,roughness:.74}),
 metal:new T.MeshStandardMaterial({color:theme.metal,map:bronzeMap,metalness:.58,roughness:.35}),
 dark:new T.MeshStandardMaterial({color:0x162d32,metalness:.45,roughness:.6}),
 jade:new T.MeshStandardMaterial({color:theme.jade,metalness:.18,roughness:.45}),
 paper:new T.MeshStandardMaterial({color:0xcfc7a1,roughness:.85,side:T.DoubleSide}),
 glow:new T.MeshBasicMaterial({color:0x9ee7df,transparent:true,opacity:.78}),
 amber:new T.MeshBasicMaterial({color:0xf2c675,transparent:true,opacity:.8})
};}
export function mesh(parent,geometry,material,x=0,y=0,z=0){const o=new T.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
export const box=(p,m,w,h,d,x=0,y=0,z=0)=>mesh(p,new T.BoxGeometry(w,h,d),m,x,y,z);
export const cylinder=(p,m,r,h,x=0,y=0,z=0,n=16)=>mesh(p,new T.CylinderGeometry(r,r,h,n),m,x,y,z);
export function ring(p,m,r,t=.06,x=0,y=0,z=0){const o=mesh(p,new T.TorusGeometry(r,t,6,56),m,x,y,z);o.rotation.x=Math.PI/2;return o}
export function beam(p,m,a,b,r=.05){const A=new T.Vector3(...a),B=new T.Vector3(...b),d=B.clone().sub(A);const o=mesh(p,new T.CylinderGeometry(r,r,d.length(),8),m);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
export function gear(p,m,r=.6,y=0){const g=new T.Group();g.position.y=y;p.add(g);cylinder(g,m,r*.82,.13);ring(g,m,r*.48,.06);for(let i=0;i<12;i++){const a=i*Math.PI/6;const t=box(g,m,.2,.18,.2,Math.sin(a)*r,0,Math.cos(a)*r);t.rotation.y=a}return g}
// Gears are built in the XZ plane. Spin around their local axle even after the
// complete assembly has been turned upright or placed at an angle in a bay.
export function spinWheel(wheel,angle){wheel.rotateY(angle)}

// Fictional exhibition apparatus: stylized, non-parametric shapes only.
export function createModule(index,m=materials()){
 const g=new T.Group();g.name='module-'+index;g.userData.module=index;
 if(index===0){
  cylinder(g,m.stone,2.9,.34,0,.17,0,32);ring(g,m.metal,2.65,.09,0,.39);ring(g,m.jade,2.1,.045,0,.41);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;box(g,m.metal,.15,.15,.4,Math.sin(a)*2.65,.4,Math.cos(a)*2.65).rotation.y=a}
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,x=Math.sin(a)*1.7,z=Math.cos(a)*1.7;box(g,m.wood,.28,1.1,.28,x,.87,z);beam(g,m.metal,[x,.7,z],[x*.6,1.7,z*.6],.08)}
 }else if(index===1){
  for(let y=1.7;y<=6.5;y+=1.2){ring(g,m.metal,1.24,.08,0,y);ring(g,m.wood,1.33,.035,0,y+.12)}
  for(let i=0;i<8;i++){const a=i*Math.PI/4;beam(g,m.wood,[Math.sin(a)*1.24,1.55,Math.cos(a)*1.24],[Math.sin(a)*1.12,6.7,Math.cos(a)*1.12],.075)}
 }else if(index===2){
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const panel=mesh(g,new T.CylinderGeometry(1.24,1.36,3.65,5,1,true,a+.035,.7),i%2?m.jade:m.wood,0,4.1);panel.userData.panel=true}
  for(const y of [2.25,4.1,5.9])ring(g,m.metal,1.37,.045,0,y);
  for(let i=0;i<16;i++){const a=i*Math.PI/8;mesh(g,new T.SphereGeometry(.05,6,4),m.metal,Math.sin(a)*1.4,4.1,Math.cos(a)*1.4)}
 }else if(index===3){
  cylinder(g,m.dark,.79,1.45,0,2.35);for(let i=0;i<6;i++){const a=i*Math.PI/3;box(g,m.jade,.15,1.24,.17,Math.sin(a)*.86,2.35,Math.cos(a)*.86)}
  ring(g,m.amber,.88,.09,0,2.85);ring(g,m.metal,.92,.12,0,1.65);
  mesh(g,new T.IcosahedronGeometry(.48,1),m.amber,0,2.45);
 }else if(index===4){
  mesh(g,new T.CylinderGeometry(.75,1.13,.7,20,1,true),m.metal,0,1.3);ring(g,m.jade,1.12,.09,0,.98);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;box(g,m.dark,.12,.62,.16,Math.sin(a)*.96,1.3,Math.cos(a)*.96).rotation.y=a}
  ring(g,m.amber,.57,.025,0,1.13);
 }else if(index===5){
  for(let i=0;i<4;i++){const a=i*Math.PI/2;const wing=new T.Group();wing.rotation.y=a;g.add(wing);const sh=new T.Shape();sh.moveTo(1.1,1.8);sh.lineTo(3.5,2.5);sh.lineTo(2.5,4.4);sh.lineTo(1.1,3.7);sh.closePath();mesh(wing,new T.ExtrudeGeometry(sh,{depth:.085,bevelEnabled:false}),m.jade);beam(wing,m.metal,[1.1,1.8,0],[3.5,2.5,0],.035);beam(wing,m.metal,[3.5,2.5,0],[2.5,4.4,0],.035);beam(wing,m.wood,[1.1,2.9,0],[2.5,4.4,0],.035);}
 }else if(index===6){
  const gyro=new T.Group();gyro.position.y=6.8;g.add(gyro);gyro.userData.spin=true;ring(gyro,m.metal,1.06,.065);ring(gyro,m.jade,.88,.075).rotation.x=.4;ring(gyro,m.metal,.7,.045).rotation.z=1.3;mesh(gyro,new T.IcosahedronGeometry(.31,0),m.glow);for(let i=0;i<4;i++){const a=i*Math.PI/2;beam(g,m.metal,[Math.sin(a)*1.1,5.9,Math.cos(a)*1.1],[Math.sin(a)*.6,7.5,Math.cos(a)*.6],.04)}
 }else if(index===7){
  mesh(g,new T.CylinderGeometry(.32,.93,.95,8),m.jade,0,7.83);ring(g,m.metal,.92,.075,0,7.38);ring(g,m.metal,.34,.04,0,8.32);
  mesh(g,new T.OctahedronGeometry(.38,0),m.glow,0,8.7);for(let i=0;i<4;i++){const a=i*Math.PI/2;beam(g,m.metal,[Math.sin(a)*.64,7.9,Math.cos(a)*.64],[0,8.8,0],.028)}
 }
 g.traverse(o=>{if(o.isMesh)o.userData.module=index});return g;
}

export function createHall(m=materials()){
 const root=new T.Group(),bays=[];box(root,m.stone,34,.5,38,0,-.35,-2);
 const tilePositions=[];for(let x=-16;x<17;x+=2)for(let z=-18;z<17;z+=2)if((x+z)%4===0)tilePositions.push([x,-.075,z]);const tiles=new T.InstancedMesh(new T.BoxGeometry(1.97,.014,1.97),m.dark,tilePositions.length);const tileMatrix=new T.Matrix4();tilePositions.forEach((p,i)=>tiles.setMatrixAt(i,tileMatrix.makeTranslation(...p)));tiles.receiveShadow=true;root.add(tiles);
 box(root,m.stone,33,17,.9,0,8.25,-17);box(root,m.dark,11,11,.15,0,6.2,-16.48);
 for(let i=0;i<5;i++){box(root,m.wood,30,.48,.6,0,13.6+i*.7,-15.7+i*.12)}
 for(const side of [-1,1])for(let j=0;j<4;j++){
  const x=side*11.8,z=-12+j*7.5;box(root,m.stone,1.6,.6,1.6,x,.3,z);box(root,m.wood,.82,11.5,.82,x,6.2,z);box(root,m.metal,1.04,.15,1.04,x,2,z);box(root,m.metal,1.04,.15,1.04,x,9.5,z);
  for(let k=0;k<3;k++)box(root,m.wood,1.5+k*.45,.3,1.4+k*.5,x,11.4+k*.37,z);
  const rib=mesh(root,new T.TorusGeometry(11.8,.19,6,48,Math.PI),m.metal,0,11.8,z);rib.rotation.z=0;
  const lantern=new T.Group();lantern.position.set(x-side*.8,6.4,z);root.add(lantern);beam(lantern,m.metal,[0,1.3,0],[0,0,0],.024);cylinder(lantern,m.wood,.43,.15,0,.4,0,8);cylinder(lantern,m.amber,.32,.8,0,-.05,0,8);cylinder(lantern,m.wood,.43,.12,0,-.5,0,8);
  if(j<3||side===-1){const bay=new T.Group();bay.position.set(side*14,0,z);bay.userData.branch=bays.length;root.add(bay);box(bay,m.dark,4.3,6,.7,side*.7,3,-1.4);box(bay,m.wood,3.4,.3,1.6,0,1.6,0);for(const dx of [-1.4,1.4])box(bay,m.wood,.2,1.6,.3,dx,.8,0);const wheel=gear(bay,m.metal,.65,2.7);wheel.rotation.x=Math.PI/2;wheel.position.z=-.35;bay.userData.wheel=wheel;const door=box(bay,m.stone,.18,5.6,3.9,-side*1.6,2.8,.15);bay.userData.door=door;bays.push(bay)}
 }
 for(const r of [3.4,5.5,7.5])ring(root,m.metal,r,.025,0,-.03);
 for(let i=0;i<64;i++){const a=i*Math.PI/32,r=7.5;const tick=box(root,i%8===0?m.jade:m.metal,.025,.016,i%8===0?.6:.2,Math.sin(a)*r,0,Math.cos(a)*r);tick.rotation.y=a}
 for(let i=0;i<24;i++){const a=i*2.399,r=8.8+(i%3)*.6;const mountain=mesh(root,new T.ConeGeometry(.3+(i%3)*.18,.3+(i%5)*.15,4),m.jade,Math.sin(a)*r,.08,Math.cos(a)*r);mountain.scale.y=.45}
 const stars=new T.Group();stars.position.set(0,13,-2);root.add(stars);for(let i=0;i<58;i++){const a=i*2.399,r=3+(i%8)*.75;mesh(stars,new T.IcosahedronGeometry(.04,0),i%3?m.glow:m.amber,Math.sin(a)*r,Math.sqrt(Math.max(0,125-r*r))*.33,Math.cos(a)*r)}
 bays.forEach((bay,i)=>{
  const details=new T.Group();bay.add(details);bay.userData.details=details;
  if(i===0){cylinder(details,m.stone,.9,2.5,0,1.8,0,12);mesh(details,new T.ConeGeometry(.94,.6,12),m.metal,0,3.3);cylinder(details,m.dark,.32,2.8,0,4.3,0,8);box(details,m.amber,.65,.55,.05,0,1.55,.88)}
  else if(i===1){for(let j=0;j<3;j++){box(details,m.wood,1.8,.15,.18,-.5,1.9+j*.17,.25);box(details,m.metal,.15,.6,.18,.8,2.1,j*.2)}ring(details,m.metal,.48,.06,-.7,2.5,0).rotation.x=0}
  else if(i===2){const wheel=gear(details,m.wood,1.15,2.9);wheel.rotation.x=Math.PI/2;bay.userData.wheel=wheel;for(let j=0;j<2;j++)box(details,m.metal,.13,2.8,.2,j?1.1:-1.1,1.9,-.1)}
  else if(i===3){for(let j=0;j<3;j++){const x=(j-1)*.8;cylinder(details,j%2?m.metal:m.jade,.26,.65,x,2.12,.4,8);mesh(details,new T.IcosahedronGeometry(.18,0),m.amber,x,2.5,.4)}}
  else if(i===4){for(let j=0;j<3;j++){const r=ring(details,j%2?m.jade:m.metal,.9-j*.15,.045,0,2.95,0);r.rotation.set(j*.7,.3+j*.5,j*.4)}cylinder(details,m.metal,.07,1.4,0,2.4)}
  else if(i===5){box(details,m.wood,2.8,1.7,.3,0,2.7,-.2);for(let j=0;j<3;j++){const r=ring(details,m.metal,.31,.035,(j-1)*.8,2.8,.03);r.rotation.x=0;beam(details,m.glow,[(j-1)*.8,2.8,.06],[(j-1)*.8+.18,3,.06],.025)}}
  else{for(let y=1.9;y<4.5;y+=.75){box(details,m.wood,3,.1,.6,0,y,-.3);for(let j=0;j<8;j++){box(details,j%3?m.paper:m.jade,.24,.5,.37,(j-3.5)*.34,y+.3,-.28)}}}
  const levelOne=new T.Group(),levelTwo=new T.Group();bay.add(levelOne,levelTwo);bay.userData.upgradeOne=levelOne;bay.userData.upgradeTwo=levelTwo;levelOne.visible=levelTwo.visible=false;
  for(let k=0;k<3;k++)box(levelOne,k%2?m.wood:m.jade,.5,.35,.45,-1.35+k*.55,.22,.9);cylinder(levelOne,m.dark,.15,1,-.9,.7,1.7,6);mesh(levelOne,new T.SphereGeometry(.13,6,5),m.dark,-.9,1.34,1.7);beam(levelOne,m.dark,[-.9,1.05,1.7],[-.4,1.45,.8],.06);
  box(levelTwo,m.metal,3.5,.13,.2,0,4.8,.5);for(const x of [-1.5,1.5])box(levelTwo,m.metal,.12,3.6,.2,x,3,.5);ring(levelTwo,m.glow,.24,.025,0,4.5,.55).rotation.x=0;box(levelTwo,m.wood,3.2,.12,.8,0,1.1,1.1);
 });
 root.userData={bays,stars};return root;
}
