import {FLOWS,flowStep} from './craft-flow.mjs?v=9a3955b709d6';
export function trialGuide(s){
 if(s.passed)return {text:'完成了。点击“点亮本批零件”，把发现带回拆解图。',action:'done'};
 if(FLOWS[s.id]){const next=flowStep(s);return {text:next[1],label:next[0],action:'step',value:String(s.step||0)}}
 if(s.id==='measure'){const i=s.marks.findIndex(v=>v!==0);return i<0?{text:'三把尺已经对齐。点击“比较三份尺寸”。',action:'test'}:{text:`拖动尺 ${i+1} 的滑块，让零刻度与铜色线重合。`,mark:i}}
 if(s.id==='material'){const id=['a','b','c'].find(id=>!s.seen.includes(id));return id?{text:'把尚未观察的样品放上同一个砝码，比较本次结果。',action:'test',value:id}:{text:'选承载记录至少为 6 的样品：可以选轻一些，也可以留更多余量。',action:'choose'}}
}
