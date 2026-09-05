(function(root){'use strict';
const eras=[
 {id:'qin',name:'秦始皇',seal:'秦',portrait:'assets/rulers/qinshihuang.webp',year:-221,date:'公元前 221 年',tag:'从基础造起',summary:'标准与组织已经铺开。以青铜、漆木和工匠的双手，让未来获得第一副骨架。',start:[3,1,1,1,3,0,3]},
 {id:'zhou',name:'武则天',seal:'周',portrait:'assets/rulers/wuzetian.webp',year:690,date:'公元 690 年',tag:'工艺与人才',summary:'成熟的工艺与文书让造物更从容，精密测量和连续动力仍等待你亲手攻克。',start:[4,2,2,2,4,1,4]},
 {id:'ming',name:'朱元璋',seal:'明',portrait:'assets/rulers/zhuyuanzhang.webp',year:1368,date:'公元 1368 年',tag:'结构与制造',summary:'炉火、金属和组织让大部件更容易成形。最后的难题藏在精度、控制与协同之中。',start:[5,3,4,3,5,2,5]},
 {id:'qing',name:'慈禧',seal:'清',portrait:'assets/rulers/cixi.webp',year:1861,date:'公元 1861 年',tag:'轻松起步',summary:'仪器与外来机器已经进入视野。把零散的能力连成体系，让最后的控制舱闭合。',start:[6,5,5,4,6,3,6]}
];
const sources={
 bronze:{title:'大都会艺术博物馆 · 商周青铜工艺',url:'https://www.metmuseum.org/essays/shang-and-zhou-dynasties-the-bronze-age-of-china',note:'商周青铜器体现了早期金属加工与分范铸造的成熟传统。'},
 standard:{title:'中国国家博物馆 · 秦统一度量衡铜量',url:'https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247417.shtml',note:'秦始皇统一度量衡的诏书见于标准铜量。统一标准与现代精密互换并不是同一回事。'},
 ceramic:{title:'故宫博物院 · 陶瓷馆藏与生产',url:'https://www.dpm.org.cn/collection/ceramics.html',note:'唐宋以来的窑业、贡瓷与官办瓷窑，说明工艺与组织能够共同发展。'},
 print:{title:'哥伦比亚大学 · 宋代印刷与活字',url:'https://afe.easia.columbia.edu/songdynasty-module/tech-printing.html',note:'雕版印刷与活字体现不同的复制路径，某种方法存在不代表它成为主流。'},
 clock:{title:'英国科学博物馆 · 苏颂水运仪象台擒纵模型',url:'https://collection.sciencemuseumgroup.org.uk/objects/co894/scale-model-of-su-songs-water-balance-escapement',note:'苏颂的水运仪象台展示了复杂水力计时机构。孤立的精巧装置不等于普遍工业能力。'},
 instrument:{title:'英国科学博物馆 · 故宫机械钟表',url:'https://blog.sciencemuseum.org.uk/zimingzhong-clockwork-treasures-from-chinas-forbidden-city-now-open/',note:'来自故宫的机械钟表体现了宫廷仪器与跨文化工艺交流；拥有仪器不等于能够批量制造。'},
 survey:{title:'哥伦比亚大学 · 宋代科技与社会资料索引',url:'https://afe.easia.columbia.edu/songdynasty-module/site-map.html',note:'资料分列冶金、运输、印刷与科学实验，用于理解技术和社会体系的联系。'}
};
const branches=[
 {id:'material',name:'材料与冶金',hall:'冶金炉室',symbol:'金',craft:'polish',source:'bronze',benefit:'木石与铜铁，成为可靠的构件。'},
 {id:'making',name:'制造与精度',hall:'百工造物间',symbol:'工',craft:'join',source:'ceramic',benefit:'把一次巧作，变成可以重复的手艺。'},
 {id:'motion',name:'机械与动力',hall:'机关传动室',symbol:'机',craft:'turn',source:'clock',benefit:'让轮、轴和机关彼此接力。'},
 {id:'energy',name:'化学与能量',hall:'火工炼制室',symbol:'火',craft:'balance',source:'survey',benefit:'观察能量的稳定表现，不涉及现实配方。'},
 {id:'measure',name:'数学与测量',hall:'度量观测台',symbol:'度',craft:'align',source:'standard',benefit:'让误差可见，让结果可以比较。'},
 {id:'control',name:'仪器与控制',hall:'仪器控制室',symbol:'仪',craft:'align',source:'instrument',benefit:'把观察变成回应，把回应连成协同。'},
 {id:'industry',name:'组织与工业',hall:'档案调度厅',symbol:'序',craft:'join',source:'print',benefit:'让工匠、文书和工坊成为一个整体。'}
];
// Each branch is a path through a shared, cross-linked DAG. Era scores are game
// abstractions, not claims that a dated artifact proves industrial maturity.
const rows=[
 [['wood','木材加工',[]],['ceramic','陶瓷与耐热',['wood']],['bronze','青铜体系',['ceramic']],['iron','铁冶炼',['bronze']],['steel','钢材',['iron','classify']],['temper','热处理',['steel','record']],['furnace','高温炉',['temper','division']],['consistent','材料一致性',['furnace','quality','calibrate']]],
 [['forming','手工成形',['wood']],['cut','钻削切削',['forming','bronze']],['polish','研磨抛光',['cut','geometry']],['mould','模具复制',['polish','ceramic']],['dimension','尺寸制造',['mould','standards']],['fixture','工装夹具',['dimension','division']],['machine','机械化机床',['fixture','rotation','steel']],['interchange','精密互换零件',['machine','consistent','calibrate']]],
 [['axle','杠杆轮轴',['wood']],['gear','齿轮传动',['axle','forming']],['rotation','连续旋转机械',['gear','cut']],['friction','摩擦控制',['rotation','polish']],['spring','弹性元件',['friction','steel']],['clock','机械计时',['spring','time']],['automatic','自动动作',['clock','trigger']],['power','近代动力',['automatic','furnace','controlburn']]],
 [['fire','燃烧认识',[]],['classify','物质分类',['fire']],['separate','分离纯化',['classify','ceramic']],['quantify','定量配制',['separate','standards']],['reaction','反应一致性',['quantify','record']],['controlburn','燃烧控制',['reaction','temper']],['storage','储能介质',['controlburn','consistent']],['propulsion','稳定推进能力',['storage','interchange','quality']]],
 [['arithmetic','算术',[]],['geometry','几何',['arithmetic']],['standards','度量衡',['geometry']],['angle','角度测量',['standards','forming']],['time','时间测量',['angle']],['record','数据记录',['time','document']],['calibrate','误差校准',['record','dimension']],['optics','光学仪器',['calibrate','polish']],['prediction','运动预测',['optics','clock']]],
 [['trigger','机械触发',['axle']],['timing','定时动作',['trigger','time']],['reference','姿态参考',['timing','angle']],['sense','状态感知',['reference','clock']],['signal','信号转换',['sense','dimension']],['feedback','反馈思想',['signal','record']],['control','基础自动控制',['feedback','interchange']],['correction','飞行修正',['control','prediction']]],
 [['artisan','专业工匠',[]],['division','工坊分工',['artisan']],['document','技术文档',['division','arithmetic']],['quality','质量检查',['document','standards']],['state','国家标准',['quality']],['mobilize','大工程动员',['state']],['batch','批量生产',['mobilize','fixture']],['education','工程教育',['batch','record']],['factory','机器工厂',['education','machine','power']]]
];
const nodes=rows.flatMap((list,branch)=>list.map(([id,name,deps],rank)=>({id,name,deps,branch,rank,craft:branches[branch].craft,cost:7+rank*2,source:branches[branch].source,eraLevels:eras.map(e=>rank<e.start[branch]?2:rank===e.start[branch]?1:0),history:'此节点表示一组工程能力，其四时代起点评级为游戏化推演。相关史料说明工艺、器物或制度的存在，不直接证明本节点已形成稳定工业体系。'})));
const nodeById=Object.fromEntries(nodes.map(n=>[n.id,n]));
const modules=[
 {id:0,name:'基座与校准环',short:'校准环',deps:['standards','forming','artisan'],before:[],craft:'join',text:'在空旷的中轴上，亲手拼合第一圈刻度。',system:1},
 {id:1,name:'主体骨架',short:'主体骨架',deps:['bronze','cut','axle','division'],before:[0],craft:'join',text:'肋架逐根立起，构想开始拥有体积。',system:1},
 {id:2,name:'外壳与前端结构',short:'外壳',deps:['consistent','dimension','mould'],before:[1],craft:'polish',text:'规整的板件围住骨架，保留铜饰与手作纹理。',system:1},
 {id:3,name:'动力舱',short:'动力舱',deps:['reaction','controlburn','quality'],before:[1],craft:'balance',text:'让虚构的能量核心保持平稳；这里只表现状态协调。',system:0},
 {id:4,name:'尾部推进组件',short:'尾部组件',deps:['propulsion','furnace','interchange'],before:[3],craft:'join',text:'把通过验证的尾部构件锁定到总装轴上。',system:0},
 {id:5,name:'稳定翼与执行件',short:'稳定翼',deps:['friction','automatic','fixture'],before:[1],craft:'turn',text:'展开翼面，看连续转动变成协调的响应。',system:2},
 {id:6,name:'姿态控制舱',short:'姿态舱',deps:['control','reference','clock'],before:[1],craft:'align',text:'让内部环架回到同一方向，点亮姿态参考。',system:2},
 {id:7,name:'导引校准舱',short:'校准舱',deps:['correction','prediction','factory'],before:[2,4,5,6],craft:'align',text:'所有观察与响应在这里闭合，等待整体试验。',system:3}
];
const systems=[
 {id:'drive',name:'推进系统',modules:[3,4],deps:['propulsion'],craft:'balance'},
 {id:'structure',name:'结构系统',modules:[0,1,2],deps:['consistent'],craft:'join'},
 {id:'controlsys',name:'制导与控制',modules:[5,6],deps:['control'],craft:'align'},
 {id:'calibration',name:'瞄准与校准',modules:[0,7],deps:['prediction','correction'],craft:'align'}
];
const plans={steady:{name:'稳妥制作',note:'可靠 · 常规花费',coins:1,months:2,crew:2,reliability:92},thrifty:{name:'省料巧作',note:'省料 · 多花时间',coins:.65,months:3,crew:2,reliability:84},rush:{name:'加班赶工',note:'更快 · 需返工准备',coins:1.3,months:1,crew:4,reliability:75}};
const events=[
 {title:'一位老匠人带来了徒弟',copy:'他愿意把多年的手感教给年轻人，也愿意先帮你把眼前的活做好。',choices:[{name:'留时间带徒弟',note:'工匠 +2 · 耗时 2 月',effect:{crew:2,months:2}},{name:'先交付眼前的工件',note:'国库 +22 · 支持 +3',effect:{coins:22,support:3}}]},
 {title:'驿站送来两批材料',copy:'一批已经分拣好，另一批价格低，但要花些工夫整理。',choices:[{name:'选规整的材料',note:'国库 −10 · 下次可靠度 +8',effect:{coins:-10,bonus:8}},{name:'自己慢慢分拣',note:'国库 +15 · 耗时 1 月',effect:{coins:15,months:1}}]},
 {title:'朝廷想看一眼进展',copy:'把已经完成的东西展示出来，或把这些时间留给工匠。没有唯一正确的答案。',choices:[{name:'展示现有成果',note:'支持 +15 · 耗时 1 月',effect:{support:15,months:1}},{name:'继续安静地造物',note:'国库 +12 · 工匠 +1',effect:{coins:12,crew:1}}]},
 {title:'侧殿的师傅们想交换笔记',copy:'不同工坊遇到了相似的误差。把经验记下来，下一次会更从容。',choices:[{name:'整理共同的工艺记录',note:'下次可靠度 +12 · 耗时 1 月',effect:{bonus:12,months:1}},{name:'请大家一起检修设备',note:'支持 +8 · 国库 +16',effect:{support:8,coins:16}}]}
];
const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
function fresh(era=0,legacy=[]){era=cap(Number.isInteger(era)?era:0,0,3);return {version:2,era,phase:'founding',months:0,limit:240,coins:150+era*30,crew:4+era*2,support:90,known:[],breakthroughs:[],reliability:{},modules:{},systems:{},upgrades:{},records:[],legacy:legacy.slice(-30),failures:0,attempts:0,spent:0,bonus:0,eventIndex:0,pendingEvent:null,finalReliability:0,ending:null,workshopClaims:[],seed:12031+era*971}}
function record(s,type,title,text,target=null){s.records.push({month:s.months,type,title,text,target});if(s.records.length>250)s.records.shift()}
function establish(s){if(s.phase!=='founding')return false;s.phase='playing';s.known=nodes.filter(n=>n.eraLevels[s.era]===2).map(n=>n.id);for(const id of s.known)s.reliability[id]=90;record(s,'founding','造物肇始','地宫造物已经启封。工程纪年，自今日始。');return true}
function available(s){return s.phase==='playing'||s.phase==='victory'}
function status(s,id){if(s.known.includes(id))return s.breakthroughs.includes(id)?'breakthrough':'known';const n=nodeById[id];return n&&n.deps.every(d=>s.known.includes(d))?'ready':'blocked'}
function missing(s,id){return (nodeById[id]?.deps||[]).filter(d=>!s.known.includes(d))}
function dependencyChain(id,seen=new Set()){if(seen.has(id)||!nodeById[id])return seen;seen.add(id);for(const d of nodeById[id].deps)dependencyChain(d,seen);return seen}
function moduleMissing(s,id){const m=modules[id];if(!m)return [];return m.deps.filter(d=>!s.known.includes(d))}
function moduleReady(s,id){const m=modules[id];return !!m&&!s.modules[id]&&m.before.every(x=>s.modules[x])&&!moduleMissing(s,id).length}
function systemReady(s,id){const t=systems.find(x=>x.id===id);return !!t&&t.modules.every(x=>s.modules[x])&&t.deps.every(x=>s.known.includes(x))}
function quote(s,id,plan='steady',force=false){const n=nodeById[id],p=plans[plan]||plans.steady;if(!n)return null;return {coins:Math.max(3,Math.ceil(n.cost*p.coins*(force?1.7:1)*(1-.12*(s.upgrades[n.branch]||0)))),months:p.months,crew:p.crew,reliability:Math.min(100,p.reliability+(s.upgrades[n.branch]||0)*4+s.bonus),blocked:missing(s,id)}}
function canSpend(s,q){return available(s)&&s.pendingEvent===null&&q&&s.coins>=q.coins&&s.crew>=q.crew&&s.months+q.months<=s.limit&&s.support>0}
function spend(s,q){s.coins-=q.coins;s.spent+=q.coins;s.months+=q.months}
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296}
function expiry(s){if(s.phase==='victory')return false;if(s.months>=s.limit||s.support<=0){s.phase='ended';s.ending='时代的边界';record(s,'ending',s.ending,'本轮工程暂停，诊断记录会留给下一次启封。')}return s.phase==='ended'}
function maybeEvent(s){if(s.attempts>0&&s.attempts%5===0&&s.phase==='playing'&&s.pendingEvent===null){s.pendingEvent=s.eventIndex%events.length;s.eventIndex++}}
function trial(s,id,plan='steady',quality=1,force=false,roll){if(!nodeById[id]||s.known.includes(id))return {ok:false,error:'这项能力已经具备。'};const q=quote(s,id,plan,force);if(q.blocked.length&&!force)return {ok:false,error:'先完成亮起的前置能力。'};if(!canSpend(s,q))return {ok:false,error:s.pendingEvent!==null?'先处理工坊来信。':'资源不足，先到侧殿整备，或换成省料方案。'};spend(s,q);s.attempts++;const n=nodeById[id],previous=s.reliability[id]||0;quality=cap(Number(quality)||0,0,1);let success=!q.blocked.length&&(plan!=='rush'||previous>=55||(quality>=.82&&(roll??random(s))>=.18));if(q.blocked.length)success=(roll??random(s))<.045/(q.blocked.length+1);let result;
 if(success){s.known.push(id);s.breakthroughs.push(id);s.reliability[id]=cap(q.reliability+Math.round((quality-.7)*12),65,100);s.coins+=4;s.support=cap(s.support+2,0,100);record(s,'success','实现了「'+n.name+'」','手作完成，新的制造能力可以用于后续部件。',id);result={ok:true,type:'success',id,reliability:s.reliability[id]}}
 else{const bottleneck=q.blocked[0];s.reliability[id]=Math.max(previous,55);s.failures++;s.support=cap(s.support-(force?4:2),0,100);const text=bottleneck?'真正的瓶颈是「'+nodeById[bottleneck].name+'」。本次试制留下了经验，先补齐这项能力。':'工件可以动起来，但还不能稳定复制。换成稳妥制作，或继续完善这件工件。';record(s,'failure',q.blocked.length?'时代条件尚未接上':'部分成功 · 再磨合一次',text,id);s.legacy.push({era:s.era,target:id,text});s.legacy=s.legacy.slice(-30);result={ok:true,type:q.blocked.length?'failure':'partial',id,bottleneck,text}}
 s.bonus=0;expiry(s);if(s.phase==='playing')maybeEvent(s);return result}
function buildModule(s,id,quality=1){if(!available(s)||s.pendingEvent!==null||!moduleReady(s,id))return {ok:false,error:'先补齐部件的前置能力与总装位置。'};const q={coins:12,months:2,crew:2};if(!canSpend(s,q))return {ok:false,error:'整备一下侧殿，就能继续总装。'};spend(s,q);s.modules[id]={quality:cap(Math.round(80+quality*16),80,96),built:s.months};s.support=cap(s.support+5,0,100);record(s,'module',modules[id].name+' · 已成','纸上之形，今日有了重量。',id);expiry(s);return {ok:true,id}}
function validateSystem(s,id,quality=1){if(!available(s)||s.pendingEvent!==null||!systemReady(s,id))return {ok:false,error:'对应模块尚未完成。'};const q={coins:5,months:1,crew:2};if(!canSpend(s,q))return {ok:false,error:'先整备资源，再开始验证。'};spend(s,q);s.systems[id]={quality:cap(Math.round(82+quality*16),82,98),repeats:(s.systems[id]?.repeats||0)+1};record(s,'system',systems.find(t=>t.id===id).name+' · 通过','独立验证完成，可以参与系统集成。',id);expiry(s);return {ok:true,id}}
function finalReady(s){return modules.every(m=>s.modules[m.id])&&systems.every(t=>s.systems[t.id])}
function finish(s,quality=1){if(!available(s)||!finalReady(s))return {ok:false,error:'先完成八个部件和四项独立验证。'};const q={coins:10,months:2,crew:2};if(!canSpend(s,q))return {ok:false,error:'最终试验还需要少量资源与时间。'};spend(s,q);const reliability=Math.round(systems.reduce((a,t)=>a+s.systems[t.id].quality,0)/4*.8+quality*20);s.finalReliability=reliability;s.phase='victory';const sustainable=Object.values(s.upgrades).filter(v=>v>=2).length>=5&&s.known.includes('factory');const copied=systems.every(t=>(s.systems[t.id]?.repeats||0)>=2);s.ending=s.support<25||s.coins<15?'代价过高':sustainable?'时代跃迁':copied?'工程可复制':'原型成立';record(s,'ending',s.ending,'整体试验通过。'+reliability+'% 为游戏内协同评分，不代表现实性能。');return {ok:true,ending:s.ending,reliability}}
function rest(s){const q={coins:0,months:3,crew:0};if(!canSpend(s,q))return {ok:false,error:s.pendingEvent!==null?'先处理工坊来信。':'本轮已无足够时间。'};spend(s,q);s.coins+=28;s.crew=cap(s.crew+1,2,18);s.support=cap(s.support+8,0,100);record(s,'supply','侧殿整备','工匠休整、材料入库。国库 +28，支持 +8。');expiry(s);return {ok:true}}
function upgrade(s,branch){const level=s.upgrades[branch]||0,q={coins:24+level*12,months:2,crew:2};if(!branches[branch]||level>=2||!canSpend(s,q))return {ok:false,error:'侧殿已达上限，或资源暂时不足。'};spend(s,q);s.upgrades[branch]=level+1;record(s,'upgrade',branches[branch].hall+' · 扩建','这一分支试制更省材料，也更可靠。');expiry(s);return {ok:true}}
function chooseEvent(s,index){if(s.pendingEvent===null)return {ok:false,error:'没有待处理事件。'};const e=events[s.pendingEvent],choice=e.choices[index];if(!choice)return {ok:false};const d=choice.effect;if(s.coins+(d.coins||0)<0||s.months+(d.months||0)>s.limit)return {ok:false,error:'这项选择需要更多资源或时间。'};s.coins+=d.coins||0;s.months+=d.months||0;s.crew=cap(s.crew+(d.crew||0),2,18);s.support=cap(s.support+(d.support||0),0,100);s.bonus=cap(s.bonus+(d.bonus||0),0,20);s.pendingEvent=null;record(s,'event',e.title,choice.name+'：'+choice.note);expiry(s);return {ok:true}}
function nextStep(s){for(const m of modules){if(s.modules[m.id])continue;if(moduleReady(s,m.id))return {type:'module',id:m.id};const chain=new Set();m.deps.forEach(id=>dependencyChain(id,chain));const n=nodes.find(n=>chain.has(n.id)&&status(s,n.id)==='ready');if(n)return {type:'tech',id:n.id}}for(const t of systems)if(!s.systems[t.id]&&systemReady(s,t.id))return {type:'system',id:t.id};if(finalReady(s))return {type:'final'};return null}
function claimWorkshop(s,done=[]){if(!available(s))return 0;let count=0;for(const id of done)if(['car','water','bell'].includes(id)&&!s.workshopClaims.includes(id)){s.workshopClaims.push(id);s.coins+=12;s.support=cap(s.support+3,0,100);count++}if(count)record(s,'workshop','百工造物间的手作成果','收录 '+count+' 件亲手完成的作品，材料与支持得到补充。');return count}
function sanitize(raw){if(!raw||raw.version!==2||!Number.isInteger(raw.era)||raw.era<0||raw.era>3)return null;const s=fresh(raw.era);const num=(v,f,min,max)=>Number.isFinite(v)?cap(v,min,max):f;s.phase=['founding','playing','victory','ended'].includes(raw.phase)?raw.phase:'founding';for(const [k,min,max]of [['months',0,240],['coins',0,10000],['crew',2,18],['support',0,100],['failures',0,10000],['attempts',0,10000],['spent',0,100000],['bonus',0,20],['eventIndex',0,1000],['seed',0,4294967295],['finalReliability',0,100]])s[k]=num(raw[k],s[k],min,max);s.known=[...new Set((Array.isArray(raw.known)?raw.known:[]).filter(id=>nodeById[id]))];s.breakthroughs=[...new Set((raw.breakthroughs||[]).filter?.(id=>s.known.includes(id))||[])];for(const n of nodes)if(raw.reliability?.[n.id])s.reliability[n.id]=num(raw.reliability[n.id],0,0,100);for(const m of modules)if(raw.modules?.[m.id]&&typeof raw.modules[m.id]==='object')s.modules[m.id]={quality:num(raw.modules[m.id].quality,80,0,100),built:num(raw.modules[m.id].built,0,0,240)};for(const t of systems)if(raw.systems?.[t.id]&&t.modules.every(id=>s.modules[id]))s.systems[t.id]={quality:num(raw.systems[t.id].quality,85,0,100),repeats:num(raw.systems[t.id].repeats,1,1,100)};for(let i=0;i<7;i++)s.upgrades[i]=Math.floor(num(raw.upgrades?.[i],0,0,2));s.records=(Array.isArray(raw.records)?raw.records:[]).filter(x=>x&&typeof x.title==='string'&&typeof x.text==='string').slice(-250).map(x=>({month:num(x.month,0,0,240),type:String(x.type||'record').slice(0,20),title:x.title.slice(0,100),text:x.text.slice(0,600),target:x.target}));s.legacy=(Array.isArray(raw.legacy)?raw.legacy:[]).filter(x=>x&&typeof x.text==='string').slice(-30).map(x=>({era:num(x.era,0,0,3),target:nodeById[x.target]?x.target:null,text:x.text.slice(0,600)}));s.pendingEvent=Number.isInteger(raw.pendingEvent)&&events[raw.pendingEvent]?raw.pendingEvent:null;s.ending=typeof raw.ending==='string'?raw.ending.slice(0,40):null;s.workshopClaims=(Array.isArray(raw.workshopClaims)?raw.workshopClaims:[]).filter(x=>['car','water','bell'].includes(x));if(s.phase==='founding'){s.known=[];s.modules={};s.systems={};s.months=0}if(s.phase==='victory'&&!finalReady(s))s.phase='playing';return s}
const api={eras,branches,sources,nodes,nodeById,modules,systems,plans,events,fresh,establish,status,missing,dependencyChain,moduleMissing,moduleReady,systemReady,quote,canSpend,trial,buildModule,validateSystem,finalReady,finish,rest,upgrade,chooseEvent,nextStep,claimWorkshop,sanitize};root.PalaceGame=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
