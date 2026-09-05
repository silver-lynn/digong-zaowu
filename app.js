const views = {
  home: document.getElementById('home-view'),
  adventure: document.getElementById('adventure-view'),
  tree: document.getElementById('tree-view')
};

let currentView = 'home';
let attempts = 0;
let currentMission = null;
let lastDiagnosis = null;
let heroModel = null;
let workbenchModel = null;
let galleryModel = null;

const machineShowcase = {
  hammer:{code:'MECH-010 · 汉代起',title:'水轮自动锻锤',summary:'水流先推动水轮，再经主轴和凸轮，把连续旋转变成重锤的周期起落。',principle:'能量转换与旋转—往复运动',risk:'木轴扭裂、轴承抱死、凸轮崩齿',next:'扩大冶炼与锻造能力',chain:['水流','水轮','锻锤','冶金'],parts:[['wheel','水轮'],['shaft','主轴'],['cam','凸轮'],['hammer','锻锤']]},
  lathe:{code:'MECH-031 · 跨时代推演',title:'脚踏车床',summary:'脚踏飞轮储存不稳定的人力，通过主轴带动工件旋转；刀架必须沿稳定导轨缓慢移动。',principle:'旋转加工、同轴度与进给控制',risk:'床身变形、主轴跳动、刀架爬行',next:'制造标准件与精密阀门',chain:['脚踏','主轴','刀架','标准件'],parts:[['drive','飞轮'],['spindle','主轴'],['bed','床身'],['tool','刀架']]},
  generator:{code:'ELEC-021 · 近代原理',title:'手摇发电机',summary:'手轮带动转子切割磁场，线圈中出现电流；真正的难点是细铜线、绝缘和可靠接点。',principle:'机械能—电能转换与电磁感应',risk:'线圈短路、磁体过弱、接点烧蚀',next:'获得点火、传感与制导电源',chain:['手摇','磁场','线圈','控制'],parts:[['crank','手轮'],['magnet','磁极'],['coil','线圈'],['output','输出']]},
  pump:{code:'FLUID-014 · 古代基础',title:'双缸活塞泵',summary:'曲轴让两根活塞交替抽压，单向阀控制流向；双缸设计让断续冲程接近连续供水。',principle:'容积变化、单向阀与相位错开',risk:'阀片泄漏、活塞失圆、管路水锤',next:'建立冷却、排水与燃料输送系统',chain:['曲柄','活塞','阀门','循环'],parts:[['crank','曲柄'],['piston','活塞'],['valve','阀门'],['pipe','管路']]}
};

const missions = [
  {
    dynasty: '北宋', seal: '宋', place: '汴京',
    task: '让一柄重锤每天重复锻打铁坯，不再依靠十名工匠轮班。',
    resources: ['城外有一条流速稳定的河渠', '可以雇到木匠与铁匠', '青铜昂贵，铁料供应不稳']
  },
  {
    dynasty: '东汉', seal: '汉', place: '南阳',
    task: '驱动两组风箱持续鼓风，提高炉温并减少人力中断。',
    resources: ['附近溪水季节性变化明显', '硬木充足，但金属铸件粗糙', '工匠熟悉水排与木制齿轮']
  },
  {
    dynasty: '盛唐', seal: '唐', place: '长安西郊',
    task: '为官营作坊建造自动舂米机构，并保证一天内不停机。',
    resources: ['灌渠水量稳定但落差较小', '可以获得榆木、麻绳和少量铜料', '期限只有十二天']
  },
  {
    dynasty: '明代', seal: '明', place: '南京',
    task: '用一套往复机构驱动矿井排水泵，替代四组人力提水。',
    resources: ['河道与矿井相距约三百步', '铁制工具质量较好', '潮湿会让木构件快速变形']
  },
  {
    dynasty: '清初', seal: '清', place: '景德镇',
    task: '让水力装置稳定粉碎瓷石，同时避免石粉污染轴承。',
    resources: ['溪流水量大但夹带泥沙', '当地烧造与木作技术成熟', '精密青铜件需要从外地购入']
  }
];

const treeStages = [
  {
    era: 'STAGE 01 · 基础', title: '取材与度量', nodes: [
      ['charcoal','木炭与高温炉','先秦起 · 历史实证','real'],
      ['measurement','尺度、直角与圆','先秦起 · 历史实证','real'],
      ['waterwheel','水轮与水排','汉代起 · 历史实证','real deep'],
      ['paper','造纸与记录','东汉起 · 历史实证','real'],
      ['glass','透明玻璃','长期演进 · 历史实证','real']
    ]
  },
  {
    era: 'STAGE 02 · 材料', title: '控制材料性能', nodes: [
      ['iron','冶铁与渗碳钢','汉代成熟 · 历史实证','real'],
      ['bronze','青铜铸造','商周起 · 历史实证','real'],
      ['ceramic','耐火陶瓷','长期演进 · 历史实证','real'],
      ['acid','酸、碱与提纯','古代萌芽 · 工程推演','sim'],
      ['rubber','橡胶与密封','近代条件 · 工程推演','sim']
    ]
  },
  {
    era: 'STAGE 03 · 机械', title: '把运动变准确', nodes: [
      ['gear','齿轮与凸轮','汉代起 · 历史实证','real'],
      ['bearing','轴承与润滑','古代基础 · 历史实证','real'],
      ['lathe','从木车床到机床','跨时代 · 深度专题','sim deep'],
      ['pump','活塞泵与阀门','古代基础 · 工程推演','sim'],
      ['clock','机械钟与擒纵','宋代高峰 · 历史实证','real']
    ]
  },
  {
    era: 'STAGE 04 · 动力', title: '获得持续功率', nodes: [
      ['steam','锅炉与蒸汽机','近代突破 · 工程推演','sim'],
      ['turbine','涡轮与叶片','精密制造后 · 工程推演','sim'],
      ['pressure','压力容器','材料科学后 · 工程推演','sim'],
      ['engine','内燃机','化学工业后 · 工程推演','sim'],
      ['cooling','泵与循环冷却','系统工程 · 工程推演','sim']
    ]
  },
  {
    era: 'STAGE 05 · 电气', title: '测量、传输、控制', nodes: [
      ['magnet','磁石与磁场','古代已知 · 历史实证','real'],
      ['copperwire','铜线与绝缘','精密拉丝后 · 工程推演','sim'],
      ['generator','手摇发电机','近代原理 · 深度专题','sim deep'],
      ['motor','电动机','电磁学后 · 工程推演','sim'],
      ['sensor','传感器与反馈','工业体系后 · 工程推演','sim']
    ]
  },
  {
    era: 'STAGE 06 · 化工', title: '制造高能物质', nodes: [
      ['saltpeter','硝石提纯与火药','唐宋起 · 历史实证','real'],
      ['oxygen','氧气与液化气体','近代化学后 · 工程推演','sim'],
      ['fuel','煤油与高纯燃料','炼化工业后 · 工程推演','sim'],
      ['aluminum','铝与轻质合金','电解工业后 · 工程推演','sim'],
      ['propellant','现代推进剂','多学科汇合 · 工程推演','sim']
    ]
  },
  {
    era: 'STAGE 07 · 航天', title: '离开地面', nodes: [
      ['nozzle','喷管与燃烧室','高温材料后 · 工程推演','sim'],
      ['guidance','陀螺与制导','精密电气后 · 工程推演','sim'],
      ['staging','多级结构','系统工程 · 工程推演','sim'],
      ['telemetry','遥测与通信','无线电后 · 工程推演','sim'],
      ['rocket','进入近地轨道','终极目标 · 工程推演','sim target']
    ]
  }
];

const nodeDetails = {
  waterwheel: {
    code:'MECH-010', title:'水轮与水排', tags:['汉代实证','动力转换','首发深挖'],
    summary:'把连续水流转换成旋转运动，再通过凸轮或曲柄获得往复动作。它是古代少数能长时间输出稳定功率的装置。',
    history:'东汉杜诗制造水排的记载，证明水力鼓风已进入生产。不同朝代又发展出水碓、水磨与复杂传动。',
    need:'稳定水源、木作结构、轴承润滑、齿轮或凸轮，以及控制加工误差的基本量具。',
    rocket:'为冶金、锻造和早期机床提供机械动力，是通往高质量金属零件的早期入口。',
    path:['水流','水轮','凸轮','锻锤','冶金','机床','火箭']
  },
  lathe: {
    code:'MECH-031', title:'从木车床到精密机床', tags:['工程推演','精密制造','第二专题'],
    summary:'车床让工件绕固定轴旋转，刀具沿受控方向切削。真正困难的不是“让它转”，而是让导轨、丝杠和刀具保持一致。',
    history:'古代已有弓形车床和脚踏车床；工业革命后，丝杠车床与标准量具把“手艺”变成可复制精度。',
    need:'稳定床身、硬质刀具、直线导轨、丝杠、量具和低间隙轴承。',
    rocket:'发动机喷注器、涡轮泵、阀门与壳体都依赖可测量、可复制的精密加工。',
    path:['量具','车床','丝杠','标准件','涡轮泵','火箭']
  },
  generator: {
    code:'ELEC-021', title:'手摇发电机', tags:['工程推演','电磁学','第三专题'],
    summary:'让导体切割磁场，把机械运动转成电流。视觉上简单，真正的门槛却藏在铜线、绝缘层、磁体强度和稳定轴承里。',
    history:'古代中国长期掌握磁石与指南针，但电磁感应需要近代实验科学、铜线工业和测量仪器共同出现。',
    need:'高纯铜、细线拉制、耐热绝缘、强磁体、换向或整流结构以及电流测量。',
    rocket:'供电、点火、阀门控制、制导与遥测均依赖稳定电源和电气系统。',
    path:['磁石','铜线','发电机','传感器','制导','火箭']
  },
  rocket: {
    code:'SPACE-001', title:'进入近地轨道', tags:['终极目标','系统工程','工程推演'],
    summary:'火箭不是一个孤立发明，而是材料、化工、精密制造、电气控制和测量体系同时达到门槛后的总结果。',
    history:'古代火药火箭提供了反作用推进的早期实践；进入轨道则要求高能推进剂、质量控制、分级和制导。',
    need:'推进剂、燃烧室、喷管、涡轮泵、轻质结构、制导、遥测、试验体系与工业质量控制。',
    rocket:'你已经抵达目标。但科技树不会结束：可靠性、载荷和重复使用会继续提出新问题。',
    path:['原料','工业体系','推进系统','制导','分级','近地轨道']
  }
};

const genericDetail = (id, title, meta) => ({
  code: id.toUpperCase().slice(0,8), title, tags:[meta.includes('历史')?'历史实证':'工程推演','路线节点'],
  summary:`${title}是通往现代工业体系的一项必要能力。这里暂时保留为路线节点，不做大而全的百科内容。`,
  history:'首版只标注它在技术链中的位置；后续仅在它直接影响深度专题时补充必要证据。',
  need:'材料、工具、可重复工艺与测量方法。',
  rocket:'它会把能力传递给后续节点，最终参与推进、结构、制导或制造体系。',
  path:[title,'后续工艺','系统集成','火箭']
});

function navigate(name) {
  currentView = name;
  Object.entries(views).forEach(([key, el]) => el.classList.toggle('active', key === name));
  document.querySelector('.topbar').style.display = name === 'home' ? 'grid' : 'none';
  window.scrollTo({top:0, behavior:'instant'});
  if (name === 'adventure') {
    window.SoulAdventure?.initModel();
    window.SoulAdventure?.start();
  }
  if (name === 'tree') renderTree();
  requestAnimationFrame(() => {
    heroModel?.resize();
    workbenchModel?.resize();
  });
}

document.addEventListener('click', (event) => {
  const go = event.target.closest('[data-go]');
  if (go) navigate(go.dataset.go);
  const scroll = event.target.closest('[data-scroll]');
  if (scroll) document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
  const nodeShortcut = event.target.closest('[data-node]');
  if (nodeShortcut) { navigate('tree'); setTimeout(() => selectNode(nodeShortcut.dataset.node), 80); }
});

function rerollMission() {
  let next = missions[Math.floor(Math.random() * missions.length)];
  if (missions.length > 1 && next === currentMission) next = missions[(missions.indexOf(next)+1)%missions.length];
  currentMission = next;
  attempts = 0;
  document.getElementById('mission-id').textContent = `CASE ${String(Math.floor(1000+Math.random()*8999))}`;
  document.getElementById('dynasty-seal').textContent = next.seal;
  document.getElementById('mission-place').textContent = `${next.dynasty} · ${next.place}`;
  document.getElementById('mission-task').textContent = next.task;
  document.getElementById('mission-resources').innerHTML = next.resources.map(r=>`<li>${r}</li>`).join('');
  document.getElementById('attempt-count').textContent = '0 次';
  resetDiagnosis();
  resetControls();
}

function resetControls() {
  document.getElementById('power-select').value='human';
  document.getElementById('shaft-select').value='pine';
  document.getElementById('cam-select').value='6';
  document.getElementById('tolerance').value='7';
  document.getElementById('tolerance-output').textContent='±7 mm';
  syncModelOptions();
}

function resetDiagnosis() {
  document.getElementById('diagnosis-empty').classList.remove('hidden');
  document.getElementById('diagnosis-result').classList.add('hidden');
  const machine = document.getElementById('machine-live');
  machine.classList.remove('running','overheat');
  workbenchModel?.setRunning(false);
  workbenchModel?.setFault(null);
  document.getElementById('metric-rpm').textContent='0 rpm';
  document.getElementById('metric-heat').textContent='22℃';
  document.getElementById('metric-hits').textContent='0 次';
}

document.getElementById('reroll').addEventListener('click', rerollMission);
document.getElementById('reroll-top').addEventListener('click', rerollMission);
document.getElementById('retry').addEventListener('click', () => {
  document.getElementById('diagnosis-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  document.getElementById('diagnosis-result').classList.add('hidden');
  document.getElementById('diagnosis-empty').classList.remove('hidden');
});
document.getElementById('tolerance').addEventListener('input', e => {
  document.getElementById('tolerance-output').textContent=`±${e.target.value} mm`;
  syncModelOptions();
});

function syncModelOptions() {
  workbenchModel?.setOptions({
    power: document.getElementById('power-select').value,
    shaft: document.getElementById('shaft-select').value,
    cams: Number(document.getElementById('cam-select').value),
    tolerance: Number(document.getElementById('tolerance').value)
  });
}

['power-select','shaft-select','cam-select'].forEach(id => {
  document.getElementById(id).addEventListener('change', syncModelOptions);
});

function diagnose() {
  const power = document.getElementById('power-select').value;
  const shaft = document.getElementById('shaft-select').value;
  const cams = Number(document.getElementById('cam-select').value);
  const tolerance = Number(document.getElementById('tolerance').value);
  if (power === 'human') return {part:'wheel',title:'动力迅速衰减', reason:'动力来源错误', copy:'四人踩踏只能短时提供峰值功率，无法让重锤持续工作。', fix:'利用稳定水流作为持续动力输入。', time:'00:11', rpm:7, heat:39, hits:3, share:'累倒四名工匠的豪华健身器'};
  if (power === 'animal') return {part:'wheel',title:'转速波动过大', reason:'动力不够稳定', copy:'牲畜转盘的速度随疲劳和步态变化，凸轮冲击无法保持一致。', fix:'改用河渠水轮，并通过闸门调节流量。', time:'00:27', rpm:11, heat:48, hits:8, share:'连牛都不愿再看的自动锻锤'};
  if (shaft === 'pine') return {part:'shaft',title:'主轴扭裂', reason:'材料强度不足', copy:'松木纹理较软，六枚凸轮产生的周期冲击让主轴沿木纹开裂。', fix:'换用榆木并减少凸轮，或在轴颈加入青铜衬套。', time:'00:08', rpm:19, heat:52, hits:4, share:'能把自己先锤坏的自动锻锤'};
  if (tolerance > 4) return {part:'bearing',title:'主轴抱死', reason:'加工精度不足', copy:'轴与轴承之间的偏差造成局部摩擦，木轴受热膨胀后迅速卡死。', fix:'将配合误差控制到 ±4 mm 以内；使用青铜衬套时可放宽到 ±3 mm。', time:'00:16', rpm:14, heat:86, hits:7, share:'只能转三圈的大型木制暖手宝'};
  if (cams === 6 && shaft !== 'bronze') return {part:'cam',title:'凸轮连续崩齿', reason:'冲击频率过高', copy:'六枚凸轮让锤头尚未充分回落就再次受力，冲击叠加破坏木质凸轮。', fix:'减少为三枚等距凸轮，给锤头留下完整回落时间。', time:'00:34', rpm:17, heat:67, hits:12, share:'把凸轮当耗材使用的碎木机'};
  if (cams === 1) return {part:'cam',title:'产能严重不足', reason:'传动参数不合理', copy:'单枚凸轮虽然可靠，但每圈只锤击一次，无法达到作坊要求。', fix:'采用三枚等距凸轮，在可靠性和频率之间取得平衡。', time:'02:00', rpm:13, heat:41, hits:26, share:'很稳，但工匠已经下班的慢锤'};
  if (tolerance > 2 && shaft !== 'bronze') return {part:'bearing',title:'轴颈持续过热', reason:'精度与润滑不足', copy:'榆木轴可以承受载荷，但配合仍偏松，冲击让轴颈反复偏载发热。', fix:'把误差进一步控制到 ±2 mm，或增加青铜衬套。', time:'01:23', rpm:15, heat:74, hits:41, share:'附带取暖功能的水力锻锤'};
  return {part:null,success:true,title:'连续试车成功',reason:'动力链已经闭合',copy:'水轮、主轴与三枚凸轮保持稳定配合，锤击频率达到任务要求。',fix:'下一步：记录磨损，建立定期润滑和更换标准。',time:'10:00',rpm:16,heat:46,hits:480,share:'真的能连续工作的水力锻锤'};
}

document.getElementById('test-machine').addEventListener('click', () => {
  attempts += 1;
  document.getElementById('attempt-count').textContent=`${attempts} 次`;
  const result = diagnose();
  lastDiagnosis = result;
  const machine = document.getElementById('machine-live');
  machine.classList.add('running');
  machine.classList.toggle('overheat', !result.success && (result.heat > 60));
  syncModelOptions();
  workbenchModel?.setFault(null);
  workbenchModel?.setRunning(true);
  document.getElementById('metric-rpm').textContent=`${result.rpm} rpm`;
  document.getElementById('metric-heat').textContent=`${result.heat}℃`;
  document.getElementById('metric-hits').textContent=`${result.hits} 次`;
  document.getElementById('test-machine').disabled=true;
  document.getElementById('test-machine').textContent='试车进行中…';
  setTimeout(() => {
    machine.classList.remove('running');
    workbenchModel?.setRunning(false);
    workbenchModel?.setFault(result.part);
    document.getElementById('test-machine').disabled=false;
    document.getElementById('test-machine').innerHTML='再次试车 <span>→</span>';
    showDiagnosis(result);
  }, 1250);
});

function showDiagnosis(result) {
  document.getElementById('diagnosis-empty').classList.add('hidden');
  document.getElementById('diagnosis-result').classList.remove('hidden');
  const badge = document.getElementById('diagnosis-badge');
  badge.textContent=result.success?'试车成功':'试车失败';
  badge.classList.toggle('success',!!result.success);
  document.getElementById('run-time').textContent=result.time;
  document.getElementById('diagnosis-title').textContent=result.title;
  document.getElementById('diagnosis-copy').textContent=result.copy;
  document.getElementById('diagnosis-reason').textContent=result.reason;
  document.getElementById('diagnosis-fix').textContent=result.fix;
  document.getElementById('make-share').textContent=result.success?'生成成功档案':'生成失败分享卡';
  document.getElementById('diagnosis-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function openShare() {
  if (!lastDiagnosis) return;
  const result=lastDiagnosis;
  document.getElementById('share-case').textContent=document.getElementById('mission-id').textContent;
  document.getElementById('share-place').textContent=`${currentMission.dynasty} · ${currentMission.place}`;
  document.getElementById('share-title').innerHTML=result.share.replace('的','的<br>');
  document.getElementById('share-reason').textContent=result.reason;
  document.getElementById('share-copy').textContent=result.copy;
  const modal=document.getElementById('share-modal');
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}
document.getElementById('make-share').addEventListener('click',openShare);
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>{const m=document.getElementById('share-modal');m.classList.remove('open');m.setAttribute('aria-hidden','true');}));
document.getElementById('copy-result').addEventListener('click', async () => {
  const text=`我在${currentMission.dynasty}成功发明了「${lastDiagnosis.share}」：${lastDiagnosis.copy} #地宫造物 #我在古代造火箭`;
  try{await navigator.clipboard.writeText(text);}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
  const toast=document.getElementById('toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1600);
});

function renderTree() {
  const canvas=document.getElementById('tree-canvas');
  if(canvas.children.length) return;
  treeStages.forEach(stage=>{
    const col=document.createElement('section'); col.className='tree-stage';
    col.innerHTML=`<div class="stage-head"><span>${stage.era}</span><h2>${stage.title}</h2></div>`;
    stage.nodes.forEach(([id,title,meta,cls])=>{
      const btn=document.createElement('button'); btn.className=`tech-node ${cls}`; btn.dataset.id=id; btn.dataset.title=title; btn.dataset.meta=meta;
      btn.innerHTML=`<strong>${title}</strong><small>${meta}</small>`;
      btn.addEventListener('click',()=>selectNode(id)); col.appendChild(btn);
    });
    canvas.appendChild(col);
  });
}

function selectNode(id) {
  renderTree();
  const button=document.querySelector(`.tech-node[data-id="${id}"]`);
  if(!button) return;
  document.querySelectorAll('.tech-node').forEach(n=>n.classList.toggle('selected',n===button));
  button.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
  const detail=nodeDetails[id]||genericDetail(id,button.dataset.title,button.dataset.meta);
  const inspector=document.getElementById('node-inspector');
  inspector.innerHTML=`<article class="node-detail">
    <span class="inspector-code">${detail.code}</span><h2>${detail.title}</h2>
    <div class="node-tags">${detail.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    <p>${detail.summary}</p>
    <div class="node-fact"><label>真实发展脉络</label><p>${detail.history}</p></div>
    <div class="node-fact"><label>需要先解决</label><p>${detail.need}</p></div>
    <div class="node-fact"><label>为什么影响火箭</label><p>${detail.rocket}</p></div>
    <div class="node-fact"><label>能力传递路径</label><div class="node-path">${detail.path.map((p,i)=>`<span>${p}${i<detail.path.length-1?' →':''}</span>`).join('')}</div></div>
    ${id==='waterwheel'?'<button class="btn primary full" data-go="adventure">进入深度实验</button>':'<button class="btn ghost full">首版仅展示路线位置</button>'}
  </article>`;
  inspector.classList.add('open');
}

document.getElementById('tree-search').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll('.tech-node').forEach(node=>node.classList.toggle('dimmed',q&&!node.textContent.toLowerCase().includes(q)));
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    const modal=document.getElementById('share-modal'); modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.getElementById('node-inspector').classList.remove('open');
  }
});

renderTree();

function selectGalleryMachine(machine, shouldScroll = false) {
  const data = machineShowcase[machine];
  if (!data) return;
  galleryModel?.setMachine(machine);
  galleryModel?.setRunning(true);
  document.getElementById('gallery-explode').value = 0;
  document.getElementById('gallery-code').textContent = data.code;
  document.getElementById('gallery-title').textContent = data.title;
  document.getElementById('gallery-summary').textContent = data.summary;
  document.getElementById('gallery-principle').textContent = data.principle;
  document.getElementById('gallery-risk').textContent = data.risk;
  document.getElementById('gallery-next').textContent = data.next;
  document.getElementById('gallery-chain').innerHTML = data.chain.map((item,index)=>`<span>${item}</span>${index<data.chain.length-1?'<i>→</i>':''}`).join('');
  document.getElementById('gallery-part-index').innerHTML = data.parts.map(([part,label],index)=>`<button data-gallery-part="${part}"><b>${String(index+1).padStart(2,'0')}</b> ${label}</button>`).join('');
  document.querySelectorAll('[data-machine]').forEach(button=>{
    const active=button.dataset.machine===machine;
    button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));
  });
  if (shouldScroll) document.getElementById('model-library').scrollIntoView({behavior:'smooth',block:'start'});
}

document.querySelectorAll('[data-machine]').forEach(button=>button.addEventListener('click',()=>selectGalleryMachine(button.dataset.machine)));
document.querySelectorAll('[data-show-machine]').forEach(button=>button.addEventListener('click',()=>selectGalleryMachine(button.dataset.showMachine,true)));
document.getElementById('gallery-explode').addEventListener('input',event=>galleryModel?.setExplode(event.target.value/100));
document.getElementById('gallery-part-index').addEventListener('click',event=>{
  const button=event.target.closest('[data-gallery-part]');if(!button)return;
  galleryModel?.setFocus(button.dataset.galleryPart);
  document.querySelectorAll('[data-gallery-part]').forEach(item=>item.classList.toggle('active',item===button&&!item.classList.contains('active')));
});

function initialize3DModels() {
  if (!window.EngineeringModel3D) return;
  heroModel = new window.EngineeringModel3D(document.getElementById('hero-model-3d'), {variant:'hero', autoOrbit:true, running:true, yaw:.92, pitch:.25, distance:12.5});
  galleryModel = new window.EngineeringModel3D(document.getElementById('model-gallery-3d'), {variant:'hero', machine:'hammer', autoOrbit:true, running:true, yaw:.92, pitch:.25, distance:12.5});
  selectGalleryMachine('hammer');
  document.getElementById('hero-explode').addEventListener('input', e => heroModel?.setExplode(e.target.value/100));
  document.querySelectorAll('[data-model][data-part]').forEach(button => button.addEventListener('click', () => {
    const model = button.dataset.model === 'hero' ? heroModel : workbenchModel;
    model?.setFocus(button.dataset.part);
    const group = button.closest('.model-part-index');
    group?.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button && !item.classList.contains('active')));
  }));
}

initialize3DModels();
