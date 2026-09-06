export const SOURCES={
 wood:{name:'Wood Handbook · Moisture relations',owner:'美国林务局林产品实验室',url:'https://research.fs.usda.gov/treesearch/62243',note:'木材会与环境交换水分，并发生与方向相关的尺寸变化。关卡放大变化、压缩时间，不提供加工尺寸。'},
 qin:{name:'秦始皇、秦二世双诏版',owner:'中国国家博物馆',url:'https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247416.shtml',note:'前221年颁行统一度量衡。游戏只使用始皇诏书背景，不把二世补刻提前。'},
 zhou:{name:'武周则天皇后纪年',owner:'中国哲学书电子化计划',url:'https://ctext.org/datawiki.pl?if=gb&res=636060',note:'690年改国号为周。地下试艺与工匠人物为创作。'},
 gold:{name:'武则天金简',owner:'河南博物院',url:'https://www.chnmus.net/ch/collection/treasure/details.html?id=508161850642982087',note:'金简落款为700年七月七日；祈愿属于历史信仰，不具有科学效果。'},
 ming:{name:'太祖治国',owner:'故宫博物院',url:'https://www.dpm.org.cn/court/event/166625.html',note:'1380年撤中书省、废丞相。游戏中的工坊交接事件为据此创作。'},
 qing:{name:'同治皇帝纪年',owner:'故宫博物院',url:'https://www.dpm.org.cn/court/lineage/226248.html',note:'1861年垂帘听政；1862年京师同文馆开办；1865年江南制造总局设立。'},
 binder:{name:'Binder · 结合料',owner:'英国国家美术馆',url:'https://www.nationalgallery.org.uk/paintings/glossary/binder',note:'结合料将颜料颗粒结合为涂层。拌合不是凭空产生新的物质。'},
 paint:{name:'Painted Wood: History and Conservation',owner:'盖蒂保护研究所',url:'https://www.getty.edu/conservation/publications_resources/pdf_publications/pdf/paintedwood1.pdf',note:'动物胶曾广泛作为东亚绘画结合料。关卡是示意交互，不给出历史复原配方。'}
};
export const ERAS=[
 {id:'qin',name:'秦始皇',seal:'秦',image:'qinshihuang',place:'咸阳 · 秦宫艺术复原',years:[-221,-220,-219,-217,-215,-213,-212,-210],theme:'让天下工坊使用同一把尺',line:'六国量器俱至，诸工尺寸不一。此事，交给地宫。',events:[
  {at:0,title:'二十六年 · 度量归一',text:'统一度量衡的诏令抵达。来自不同地域的工匠带来各自的尺与量器。',source:'qin'},
  {at:3,title:'一套标记，许多双手',text:'架空工坊记录：三位工匠终于能照同一份样板交接，管事把旧量器陈列起来。',source:'qin',fiction:true},
  {at:7,title:'留给后来的人',text:'架空结局：工程样板与试验记录一同封存。留下的还有一套可以传授的做事办法。',source:'qin',fiction:true}]},
 {id:'zhou',name:'武则天',seal:'周',image:'wuzetian',place:'神都洛阳 · 武周宫室艺术复原',years:[690,691,692,694,696,697,699,700],theme:'让作品证明一个人的本领',line:'神都百工毕集。入此殿者，以手艺与实证立身。',events:[
  {at:0,title:'天授元年 · 神都新章',text:'690年，武则天改国号为周。故事从神都的一场架空百工试艺开始。',source:'zhou'},
  {at:3,title:'不署名的样件',text:'架空工坊事件：试艺样件先隐去姓名，待比较结果之后，再听每一位制作者解释方法。',source:'zhou',fiction:true},
  {at:7,title:'久视元年 · 金简之愿',text:'700年投金简的史事成为案上的小小拓影。祈愿留在铭文里，工艺成败仍由实验说明。',source:'gold'}]},
 {id:'ming',name:'朱元璋',seal:'明',image:'zhuyuanzhang',place:'应天 · 明初宫室艺术复原',years:[1368,1369,1371,1373,1375,1376,1378,1380],theme:'把造物变成可靠的制度',line:'百业待兴。旧料亦可成器，所用所成，须有实据。',events:[
  {at:0,title:'洪武初年 · 百业待兴',text:'明初恢复生产的背景下，地宫先从旧料分类和修复工具开始。地下工程为架空故事。',source:'ming'},
  {at:3,title:'旧料有来处',text:'架空工坊事件：管事把余料和成品放在同一张账册里，损耗终于有迹可查。',source:'ming',fiction:true},
  {at:7,title:'洪武十三年 · 文书改道',text:'1380年废丞相、撤中书省。工坊故事借此安排一次文书交接调整，具体任务为创作。',source:'ming'}]},
 {id:'qing',name:'慈禧',seal:'清',image:'cixi',place:'北京 · 养心殿垂帘意象',years:[1861,1862,1863,1865,1867,1868,1870,1872],theme:'让不同知识体系共同工作',line:'帘外呈来新图与旧样。先让能做的人，听懂彼此的话。',events:[
  {at:0,title:'咸丰十一年 · 帘后',text:'1861年，两宫皇太后开始垂帘听政。慈禧以皇太后身份进入故事，不称皇帝。',source:'qing'},
  {at:1,title:'同治元年 · 新的词语',text:'1862年京师同文馆开办。架空译员来到工坊，先与匠人核对图上的术语。',source:'qing'},
  {at:3,title:'同治四年 · 机器与手艺',text:'1865年江南制造总局设立。故事以一封来信呈现新式制造带来的讨论，不把后世事件提前。',source:'qing'}]}
];
ERAS.forEach((era,i)=>{era.events=[[{"at":0,"year":-221,"title":"秦王政称皇帝","text":"秦完成统一，秦王政采用“皇帝”称号。此后，统一度量衡等举措推行于各地。","source":"qin","mood":6},{"at":3,"year":-218,"title":"博浪沙遇刺","text":"秦始皇东巡经过博浪沙，遭到行刺。袭击未能杀死秦始皇，他随后下令搜捕。","source":"qinAnnals","mood":1},{"at":7,"year":-210,"title":"沙丘之终","text":"秦始皇在最后一次巡行途中病逝于沙丘。他的统治结束，秦朝随后发生继承危机。","source":"qinAnnals","mood":4}],[{"at":0,"year":690,"title":"改唐为周","text":"武则天称帝，改国号为周，以洛阳为神都，武周建立。","source":"zhouLife","mood":6},{"at":6,"year":700,"title":"嵩山投金简","text":"武则天命人在嵩山投下金简，寄托祈福除罪的愿望。金简留下了她的名字与纪年。","source":"gold","mood":3},{"at":7,"year":705,"title":"神龙政变","text":"张柬之等人发动政变，武则天退位，唐中宗李显复位，国号恢复为唐。","source":"zhouLife","mood":7}],[{"at":0,"year":1368,"title":"大明开国","text":"朱元璋在应天称帝，建国号大明，年号洪武。","source":"mingLife","mood":2},{"at":6,"year":1378,"title":"定都应天","text":"朱元璋确定以应天为京师。应天即今南京，是明朝初期的政治中心。","source":"mingLife","mood":3},{"at":7,"year":1380,"title":"废除丞相","text":"胡惟庸案发生后，朱元璋撤销中书省，废除丞相制度，六部直接对皇帝负责。","source":"ming","mood":0}],[{"at":0,"year":1861,"title":"两宫垂帘","text":"辛酉政变后，慈安与慈禧两宫皇太后垂帘听政。慈禧以皇太后的身份掌握权力。","source":"qingLife","mood":0},{"at":4,"year":1894,"title":"甲午战争爆发","text":"1894年，中日甲午战争爆发。清朝在战争中失败，随后签订《马关条约》。","source":"qingLife","mood":7},{"at":7,"year":1900,"title":"庚子西行","text":"八国联军攻入北京，慈禧携光绪帝等人离京，逃往西安。","source":"qingLife","mood":4}]][i]});
ERAS[0].years=[-221,-220,-219,-218,-215,-213,-212,-210];
ERAS[1].years=[690,691,692,694,696,699,700,705];
ERAS[3].years=[1861,1862,1865,1875,1894,1895,1898,1900];
Object.assign(SOURCES,{
 qinAnnals:{name:'太平御览·始皇帝（引史记）',owner:'中国哲学书电子化计划',url:'https://ctext.org/text.pl?if=gb&node=368409',note:'博浪沙行刺与沙丘病逝为历史背景，导弹改写命运为架空结局。'},
 zhouLife:{name:'武则天',owner:'吕梁市人民政府',url:'https://www.lvliang.gov.cn/zjll/mlll/lsmr/200702/t20070201_231958.html',note:'690年称帝，705年神龙政变后退位；架空结局另行标明。'},
 mingLife:{name:'洪武皇帝',owner:'故宫博物院',url:'https://www.dpm.org.cn/court/lineage/226244.html',note:'1363年鄱阳湖之战在称帝之前。结局明确作为回到开国前的架空回望。'},
 qingLife:{name:'慈禧太后',owner:'故宫博物院',url:'https://www.dpm.org.cn/court/figure/102753.html',note:'记录垂帘听政、甲午战争及1900年西逃的历史背景。'}
});
export const PEOPLE=[
 {id:'mu',name:'陆衡',job:'木作匠',skill:'看懂受力与榫口',text:'话不多，做完会把接缝摸一遍。',color:'#b9915c'},
 {id:'liao',name:'阿绢',job:'料作匠',skill:'观察材料的细微变化',text:'每次试样都留下半片，写清缘由。',color:'#86b6a3'},
 {id:'ji',name:'周鸣',job:'机巧匠',skill:'把想法变成连续动作',text:'喜欢先做一个小样，让装置自己回答。',color:'#baa26c'},
 {id:'ce',name:'沈微',job:'度量匠',skill:'复核尺寸与试验记录',text:'同样的结果，要能再做出一次。',color:'#8baec6'},
 {id:'guan',name:'方叔',job:'管事',skill:'清楚地交接人与物',text:'先说清楚谁接手，再把东西搬过去。',color:'#b7a18a'},
 {id:'xue',name:'小禾',job:'学徒',skill:'敏锐地发现异常',text:'正在学，也在认真看。',color:'#ccd9ad'}
];
const lanes=[['木作',['识材','弧壳','扣合','外形完成']],['材料',['观察','聚光','凝芯','架空燃料芯']],['动力',['轮轴','传动','省力','机巧成果']],['验证',['共同尺度','动作次序','复核','总装检查']]];
export const NODES=lanes.flatMap(([branch,names],b)=>names.map((name,r)=>({id:`n${b}${r}`,name,branch:b,rank:r,deps:r?[`n${b}${r-1}`]:[],lane:branch}))).concat([{id:'final',name:'巡天总成',branch:4,rank:4,deps:['n03','n13','n23','n33'],lane:'总装'}]);
export const CHAPTERS=[
 {id:'measure',title:'一把不准的尺',verb:'比对',person:'ce',summary:'三份样件都写着“合式”，却拼不到一起。找出可以共同使用的标准。',lesson:'尺寸比较必须使用同一基准；观察方法改变结论。',unlocks:['n30'],modules:[0],toy:0},
 {id:'material',title:'材料会说话',verb:'试样',person:'liao',summary:'轻巧、易弯与结实，并不是同一回事。给一件提篮选择合适的材料。',lesson:'选材取决于用途。以下样品结果只代表本次样品，不是所有木材的固定属性。',unlocks:['n00','n10'],modules:[1],toy:0},
 {id:'join',title:'让弧壳合为一体',verb:'拼合',person:'mu',summary:'放好定位展示环，贴合两片弧形外壳，再扣上外饰环。每一步只需完成眼前的操作。',lesson:'弧面围合形成外壳；本环节是外观拼合玩具，不代表飞行器的实际结构或装配工艺。',unlocks:['n01','n02','n03'],modules:[2],toy:1},
 {id:'mix',title:'凝成一枚燃料芯',verb:'拌合',person:'liao',summary:'倒入星砂、加入凝光，缓慢拌合出一枚发光的架空燃料芯。跟着光点，一步一步完成封装。',lesson:'星砂、凝光及其聚合均为架空表现，没有现实燃料配方、比例或制作条件。',unlocks:['n11','n12','n13'],modules:[3],toy:2},
 {id:'drive',title:'让动作传过去',verb:'传动',person:'ji',summary:'从输入轮接到输出轮，亲手摇动手柄，观察大轮如何转得更慢、更稳。',lesson:'理想传动中的转速与转矩存在取舍，实际装置还会损耗能量。',unlocks:['n20','n21','n22','n23'],modules:[4],toy:3},
 {id:'sequence',title:'让机关按时动作',verb:'编排',person:'ji',summary:'让门先打开，提台再升起，最后响铃。把你想要的顺序交给机关。',lesson:'顺序与联锁可以防止动作互相干涉；这里是民用机关演示。',unlocks:['n31'],modules:[5],toy:4},
 {id:'diagnose',title:'找出真正的问题',verb:'验证',person:'ce',summary:'昨天贴合的接缝，今天出现了变化。用一次有对照的实验，找出原因。',lesson:'木材受湿度变化影响会胀缩；试验应保持其余条件尽量一致。',unlocks:['n32'],modules:[6],toy:5},
 {id:'assembly',title:'最后一处，亲自检查',verb:'检验',person:'ce',summary:'找到图录中未闭合的检查标记，补齐后完成总装展示。',lesson:'地宫造物与巡天器终局属于架空推演。基础实验不能直接实现现代导弹。',unlocks:['n33','final'],modules:[7],toy:6}
];
// Empty compatibility exports keep older saves readable; personnel management is retired.
export const DECISIONS={};
export const dateLabel=y=>y<0?`公元前 ${-y} 年`:`公元 ${y} 年`;
export function freshCampaign(era=0){return {version:3,era,chapter:0,entered:false,completed:[],known:[],results:{},decisions:{},trust:0,color:'#3c857a',preference:'light',record:[],legacy:false}}
export function sanitizeCampaign(raw){if(!raw||raw.version!==3||!Number.isInteger(raw.era)||raw.era<0||raw.era>3)return null;const completed=Array.isArray(raw.completed)?raw.completed:[];const s=freshCampaign(raw.era);s.entered=raw.entered===true;s.completed=CHAPTERS.map(c=>c.id).filter((id,i)=>completed.includes(id)&&CHAPTERS.slice(0,i).every(c=>completed.includes(c.id)));s.chapter=Math.min(s.completed.length,8);s.known=[...new Set(s.completed.flatMap(id=>CHAPTERS.find(c=>c.id===id).unlocks))];s.color=/^#[0-9a-f]{6}$/i.test(raw.color||'')?raw.color:s.color;s.preference=['light','strong','fast'].includes(raw.preference)?raw.preference:'light';s.legacy=raw.legacy===true;for(const [key,d]of Object.entries(DECISIONS)){const o=d.options.find(o=>o.id===raw.decisions?.[key]);if(o){s.decisions[key]=o.id;s.trust+=o.trust}}for(const id of s.completed){const r=raw.results?.[id];if(r&&typeof r==='object')s.results[id]={note:String(r.note||'').slice(0,300),value:String(r.value||'').slice(0,80)}}s.record=(Array.isArray(raw.record)?raw.record:[]).filter(r=>r&&typeof r.text==='string').slice(-50).map(r=>({chapter:Math.max(0,Math.min(7,Math.floor(r.chapter)||0)),text:r.text.slice(0,400)}));return s}
export function decide(s,index,id){const d=DECISIONS[index],o=d?.options.find(o=>o.id===id);if(!o||s.chapter!==Number(index)||s.decisions[index])return false;s.decisions[index]=id;s.trust+=o.trust;s.record.push({chapter:s.chapter,text:o.result});return true}
export function completeChapter(s,result){const c=CHAPTERS[s.chapter];if(!s.entered||!c||!result?.passed)return false;s.results[c.id]={note:String(result.note||c.lesson).slice(0,300),value:String(result.value||'').slice(0,80)};if(c.id==='material')s.preference=['light','strong'].includes(result.value)?result.value:'light';if(c.id==='mix'&&/^#[0-9a-f]{6}$/i.test(result.value||''))s.color=result.value;s.completed.push(c.id);s.known=[...new Set([...s.known,...c.unlocks])];s.record.push({chapter:s.chapter,text:s.results[c.id].note});s.chapter++;return true}
export function legacyCampaign(old){const s=freshCampaign(Number.isInteger(old?.era)?Math.max(0,Math.min(3,old.era)):0);s.legacy=!!old;s.record=old?[{chapter:0,text:'旧版工程进度已保留在旧版入口。新的章节使用不同玩法，原有知识作为旧知档案留存。'}]:[];return s}
export function hallState(s){const built=s.completed.flatMap(id=>CHAPTERS.find(c=>c.id===id).modules);return {era:s.era,phase:s.entered?'playing':'founding',modules:Object.fromEntries(built.map(id=>[id,{quality:90}])),known:s.known,upgrades:Array.from({length:7},(_,i)=>s.chapter>i?1:0),failures:0}}
export function eventFor(s){return [...ERAS[s.era].events].reverse().find(e=>e.at<=Math.min(s.chapter,7))}
