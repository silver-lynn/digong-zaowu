import * as T from './vendor/three/three.module.js?v=8e433e6a8218';
export const PART_GROUPS=['定位环','支撑骨架','外壳片','表面饰片','连接构件','序号标记','检查盖片','总装构件'];
export const PARTS_PER_GROUP=24,TOTAL_PARTS=192;
export function buildAtlasParts(){
 const parts=[];
 for(let group=0;group<8;group++)for(let i=0;i<PARTS_PER_GROUP;i++){
  const angle=i%8*Math.PI/4,row=Math.floor(i/8),radial=(r,y)=>[Math.cos(angle)*r,y,Math.sin(angle)*r];
  let geometry,position,rotation=[0,0,0];
  if(group===0){geometry=new T.TorusGeometry(.82,.035,6,32);position=[0,-4.65+i*.4,0];rotation=[Math.PI/2,0,0]}
  if(group===1){geometry=new T.BoxGeometry(.07,2.9,.09);position=radial(.78,-3+row*3);rotation=[0,-angle,0]}
  if(group===2){geometry=new T.CylinderGeometry(.93,.93,2.75,8,1,true,angle,.70);position=[0,-3+row*3,0]}
  if(group===3){geometry=new T.BoxGeometry(.04,2.3,.13);position=radial(.98,-3+row*3);rotation=[0,-angle,0]}
  if(group===4){geometry=new T.TorusGeometry(.10,.025,6,12);position=radial(.99,-4+row*4);rotation=[Math.PI/2,0,0]}
  if(group===5){geometry=new T.BoxGeometry(.07,.22,.16);position=radial(1.01,-3.7+row*3.7);rotation=[0,-angle,0]}
  if(group===6){geometry=new T.BoxGeometry(.045,.45,.38);position=radial(1.02,-2.8+row*2.8);rotation=[0,-angle,0]}
  if(group===7){if(i<8){geometry=new T.ConeGeometry(.95,2.0,8,1,true,angle,.76);position=[0,5.4,0]}else if(i<16){geometry=new T.BoxGeometry(.04,1.5,.9);position=radial(1.3,-4);rotation=[0,-angle,0]}else{geometry=new T.TorusGeometry(.84,.045,6,32);position=[0,-5+(i-16)*.05,0];rotation=[Math.PI/2,0,0]}}
  const index=parts.length;geometry.computeBoundingBox();const size=geometry.boundingBox.getSize(new T.Vector3());
  parts.push({id:`part-${index}`,index,group,name:PART_GROUPS[group]+' '+String(i+1).padStart(2,'0'),geometry,position,rotation,grid:[(index%16-7.5)*1.45,(5.5-Math.floor(index/16))*1.35,0],gridCenter:geometry.boundingBox.getCenter(new T.Vector3()).toArray(),gridScale:1/Math.max(size.x,size.y,size.z,.7)});
 }
 return parts;
}
