export function trialGuide(s){
 if(s.passed)return {text:'完成了。点击“点亮本批零件”，把发现带回拆解图。',action:'done'};
 if(s.id==='measure'){const i=s.marks.findIndex(v=>v!==0);return i<0?{text:'三把尺已经对齐。点击“比较三份尺寸”。',action:'test'}:{text:`拖动尺 ${i+1} 的滑块，让零刻度与铜色线重合。`,mark:i}}
 if(s.id==='material'){const id=['a','b','c'].find(id=>!s.seen.includes(id));return id?{text:'把尚未观察的样品放上同一个砝码，比较本次结果。',action:'test',value:id}:{text:'选承载记录至少为 6 的样品：可以选轻一些，也可以留更多余量。',action:'choose'}}
 if(s.id==='join'){if(s.rotation)return {text:'铜色长边还没对齐。先旋转预览件，直到回到 0°。',action:'rotate'};const next=['base','left','right','top'].find(id=>!s.pieces.includes(id));return {text:'将高亮的构件放入有支撑的榫口。两根立柱可交换次序。',action:'insert',value:next}}
 if(s.id==='mix'){if(!s.ingredients.includes('water'))return {text:'先加入清水，让这份试样能够润湿颜料。',action:'add',value:'water'};if(!s.ingredients.includes('pigment'))return {text:'加入已研细的颜料。',action:'add',value:'pigment'};if(!s.stir)return {text:'沿碗缘画圈，或点慢拌，让团聚的颗粒分散。',action:'stir'};if(!s.ingredients.includes('binder'))return {text:'颗粒已分散，加入预制胶液。',action:'add',value:'binder'};if(s.stir<2)return {text:'胶液加入后再轻拌一圈，使这份试样均匀。',action:'stir'};return {text:'现在试涂并观察干燥后的示意样片。',action:'test'}}
 if(s.id==='drive'){const id=['input','middle','output'].find(id=>!s.connections.includes(id));return id?{text:'可先选择用途，再依次补齐传动线上的三个轮。',action:'connect',value:id}:{text:'摇动输入柄，观察你选择的速度与省力取舍。',action:'test'}}
 if(s.id==='sequence'){const desired=['gate','lift','bell'];if(s.sequence.join()===desired.join())return {text:'开门、升台、响铃已经排好，演示一次。',action:'test'};const index=s.sequence[0]!=='gate'?s.sequence.indexOf('gate')-1:1;return {text:'点高亮的交换键：先让门打开，再升台，最后响铃。',action:'swap',value:String(index)}}
 if(s.id==='diagnose'){if(s.control!=='humidity')return {text:'选择同种木料，只改变环境湿度。',action:'control',value:'humidity'};if(!s.observed)return {text:'等待并测量两份样片，观察差异。',action:'observe'};return {text:'根据对照结果，选择证据支持的结论。',action:'conclude',value:'movement'}}
 const id=['shell','ring','mark'].find(id=>!s.checked.includes(id));if(id)return {text:'点选尚未检查的部位，观察标记是否完整。',action:'inspect',value:id};if(!s.aligned)return {text:'接合标记留着缺口，点击“对齐接合标记”。',action:'align'};return {text:'三处已检查，完成总装展示。',action:'test'};
}
