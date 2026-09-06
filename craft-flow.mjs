// Display-only fantasy crafting: deliberately contains no real fuel recipe.
export const FLOWS={
 join:[['定位展示环','让铜色定位环落在展示支架上。'],['贴合第一片弧壳','沿环的轮廓贴合第一片弧形外壳。'],['合拢另一片弧壳','让两片弧壳的边缘相接。'],['扣合外饰环','扣上外饰环，完成外观拼合。']],
 mix:[['放入星砂','倒入架空的发光星砂，观察颗粒。'],['加入凝光','加入架空的凝光，让光点开始聚集。'],['缓慢拌合','让光点沿圆周聚合，形成均匀的光晕。'],['凝成燃料芯','将光晕凝成故事中的燃料芯。'],['收入展示匣','封存这枚架空燃料芯。此过程不对应现实配方。']],
 drive:[['接上输入轮','把输入轮放入展示机关。'],['接上中间轮','连接中间轮，让动作传递下去。'],['接上输出轮','接上较大的输出轮。'],['摇动手柄','观察大轮较慢的转动。理想情况下，减速可换取更大转矩。']],
 sequence:[['移出开门签','先把开门签移到升台签前。'],['把开门排到第一位','开门后，升台才有通过的空间。'],['把响铃留到最后','升台到位，再响铃示意。'],['演示完整机关','观察开门、升台、响铃依次发生。']],
 diagnose:[['建立湿度对照','使用同种木料，只改变环境湿度。'],['等待并测量','观察较湿环境下的横向尺寸变化，时间经过压缩。'],['记录胀缩现象','根据对照记录湿度相关的胀缩。']],
 assembly:[['检查外壳标记','查看外壳展示标记是否完整。'],['检查接合标记','找到接合标记中的缺口。'],['检查序号标记','确认序号展示标记完整。'],['对齐接合标记','合拢刚才发现的标记缺口。'],['完成图录检查','三处标记已确认，收拢艺术图录。']]
};
export function flowStep(s){return FLOWS[s.id]?.[s.step||0]}
export function advanceFlow(s,value){const steps=FLOWS[s.id],i=s.step||0;if(!steps||String(value)!==String(i)||!steps[i])return {ok:false,text:'请完成当前提示的这一步。'};s.step=i+1;
 if(s.id==='join')s.pieces=['ring','shell-a','shell-b','trim'].slice(0,s.step);
 if(s.id==='mix'){s.ingredients=['star','glow'].slice(0,s.step);s.stir=s.step>=3?1:0;}
 if(s.id==='drive')s.connections=['input','middle','output'].slice(0,s.step);
 if(s.id==='sequence')s.sequence=[['bell','gate','lift'],['gate','bell','lift'],['gate','lift','bell'],['gate','lift','bell']][i];
 if(s.id==='diagnose'){s.control='humidity';s.observed=s.step>=2;}
 if(s.id==='assembly'){s.checked=['shell','ring','mark'].slice(0,s.step);s.aligned=s.step>=4;}
 s.passed=s.step===steps.length;const text=s.passed?steps[i][1]+' 本批发现已完成。':steps[i][1];if(s.passed)s.note=text;return {ok:true,text};}
