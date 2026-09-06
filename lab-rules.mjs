import {FLOWS,advanceFlow} from './craft-flow.mjs?v=9a3955b709d6';
export const SAMPLE_DATA=[{id:'a',name:'薄木片',weight:2,bend:7,load:2},{id:'b',name:'层叠木片',weight:4,bend:3,load:7},{id:'c',name:'厚木块',weight:8,bend:1,load:9}];
export function newTrial(id,level=2){return {id,passed:false,note:'',value:'',step:0,marks:[2,-3,1],seen:[],pieces:[],rotation:0,ingredients:[],stir:0,colors:'#4f8877',purpose:'strong',connections:[],sequence:['bell','lift','gate'],observed:false,control:'',checked:[],aligned:false}}
export function trialAction(s,action,value){if(s.passed)return {ok:false,text:'本次发现已经记录。'};let ok=true,text='';if(FLOWS[s.id])return action==='step'?advanceFlow(s,value):{ok:false,text:'请使用当前高亮的操作。'};
 if(s.id==='measure'){if(action==='mark')s.marks[value[0]]=Math.max(-4,Math.min(4,Number(value[1])||0));if(action==='test'){s.passed=s.marks.every(v=>v===0);text=s.passed?'三份零点都与基准线重合，现在可以比较长度。':'还没有对齐。先把每把尺的零刻度移到同一条基准线上。'}}
 if(s.id==='material'){if(action==='test'){if(!s.seen.includes(value))s.seen.push(value);const d=SAMPLE_DATA.find(d=>d.id===value);text=d?`${d.name}：相对重量 ${d.weight}，同载弯曲 ${d.bend}，本次承载记录 ${d.load}。`:''}if(action==='choose'){const d=SAMPLE_DATA.find(d=>d.id===value);s.passed=s.seen.length===3&&['b','c'].includes(value);s.value=value==='b'?'light':'strong';text=s.passed?`${d.name}满足本次承载要求。${value==='b'?'带走更轻的方案。':'接受重量，换取更高的承载余量。'}`:s.seen.length<3?'先把三份样品放到同一条件下比较。':'薄片的本次承载结果不足，换一份再试。'}}
 if(s.passed)s.note=text;return {ok,text};
}
