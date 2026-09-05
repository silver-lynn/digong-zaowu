(function () {
  'use strict';

  const META_KEY = 'engineering-time-travel-soul-meta-v1';
  const numerals = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
  const worlds = [
    { dynasty:'东汉', seal:'汉', place:'洛阳', age:17, life:44, wealth:'盐铁尚利，天下初定' },
    { dynasty:'盛唐', seal:'唐', place:'长安', age:19, life:41, wealth:'四海来朝，百工齐集' },
    { dynasty:'北宋', seal:'宋', place:'汴京', age:18, life:42, wealth:'国库尚丰，市易繁盛' },
    { dynasty:'永乐年间', seal:'明', place:'南京', age:20, life:39, wealth:'舟师强盛，匠户充足' },
    { dynasty:'清初', seal:'清', place:'北京', age:16, life:46, wealth:'版图初定，内库充盈' }
  ];

  let meta = loadMeta();
  let state = null;
  let soulModel = null;

  function loadMeta() {
    try {
      const parsed = JSON.parse(localStorage.getItem(META_KEY) || '{}');
      return { cycle:Number(parsed.cycle)||0, clues:Array.isArray(parsed.clues)?parsed.clues:[] };
    } catch { return {cycle:0, clues:[]}; }
  }
  function saveMeta() { localStorage.setItem(META_KEY, JSON.stringify(meta)); }
  function hasItem(item) { return state.inventory.includes(item); }
  function hasClue(text) { return meta.clues.some(clue => clue.includes(text)); }

  const nodes = {
    wake: () => ({
      label:'醒来 · 即位第一日',
      question:'龙榻外跪满了人。\n你第一句话说什么？',
      copy:'你记得现代科技，却没有说明书。你拥有这个时代最多的资源，也拥有最昂贵的每一次试错。',
      choices:[
        {text:'召太医，先查朕喝的水与每日膳食',hint:'先确认自己能不能活到工业化。',years:1,item:'太医院水册',clue:'宫井清澈，不等于没有致病之物。',next:'vow'},
        {text:'敲钟召百官：四十年内，朕要造出火箭',hint:'你决定用宏大目标检验群臣的想象力。',years:2,trap:true,death:{word:'被幽',cause:'百官认定新帝中邪，你被“静养”至死。',title:'狂宣炀皇帝',comment:'志在九天，奈何第一道诏书就没走出寝宫。',clue:'不要在第一次朝会上宣布造火箭；先拿出一个能转的东西。'}},
        {text:'封锁寝宫，默写全部现代知识',hint:'没人敢打扰你，但朝局开始猜疑。',years:3,credit:-8,item:'工程残卷',clue:'记忆中的结论很多，能落地的尺寸很少。',next:'vow'}
      ]
    }),
    vow: () => ({
      label:`立愿 · 在位第 ${state.years+1} 年`,
      question:'一生只有一次。\n你准备先改变什么？',
      copy:'“最终造出火箭”不是一个项目，而是几百项能力的合流。你必须决定这一世先把哪块地基钉进历史。',
      choices:[
        {text:'先活下去：净水、消毒与公共卫生',hint:'延长自己与工匠的寿命，回报慢但稳。',years:5,goal:'建立不靠运气的卫生体系',tech:'净水试行',next:'appoint'},
        {text:'先有动力：水轮、传动与自动锻锤',hint:'用机械力扩大冶炼与加工能力。',years:6,goal:'建立可复制的水力工坊',item:'御作监调令',next:'appoint'},
        {text:'目标不变：现在就造一枚现代火箭',hint:hasClue('火药火箭')?'前世纸条在你袖中发烫。':'硝石、硫黄、木炭——听起来已经够了。',years:8,trap:true,death:{word:'炸崩',cause:'内廷第一次整机点火，连观礼台一起消失。',title:'火升烈皇帝',comment:'以火药为火箭，以勇气为制导，升得很快，落得更快。',clue:'火药火箭与运载火箭不是一回事；先解决材料、精度与控制。'}}
      ]
    }),
    appoint: () => ({
      label:`用人 · 在位第 ${state.years+1} 年`,
      question:'谁来主持这件\n前所未有的工程？',
      copy:'你是皇帝，不是万能工程师。真正的第一项技术，也许是让正确的人能说真话。',
      artifact:{type:'案头物品',glyph:'册',name:'百工花名册',copy:'三千二百名匠户只有籍贯、差役和欠税，没有人记录他们真正会做什么。'},
      choices:[
        {text:'撤掉门槛，从木匠、铁匠和窑工中当面选人',hint:'会得罪礼部，但能找到真的手。',years:2,credit:-4,item:'老木匠鲁七',clue:'能说出失败原因的工匠，比从不失败的祥瑞可靠。',next:'inspect'},
        {text:'点本年状元总领御作监',hint:'他极擅长写出一份没有尺寸的完整章程。',years:6,credit:8,item:'漂亮章程',next:'inspect'},
        {text:'交给最受信任的内侍，限期三月',hint:'命令传得最快，坏消息回来得最慢。',years:1,credit:-22,death:{word:'暴毙',cause:'内库亏空败露前夜，你喝下了“安神汤”。',title:'亲信愍皇帝',comment:'疑天下人而信一人，终使一人替天下做了决定。',clue:'工程汇报必须让工匠越级说出坏消息。'}}
      ]
    }),
    inspect: () => ({
      label:`寻证 · 在位第 ${state.years+1} 年`,
      question:'御作监送来一根\n反复断裂的旧主轴。',
      copy:'它比所有歌功颂德的奏疏都诚实。断口、磨痕与焦黑处正在告诉你，机器为什么活不久。',
      artifact:{type:'获得物品',glyph:'轴',name:'断裂的榆木主轴',copy:'一侧光滑发亮，另一侧沿木纹撕裂。轴承座上还残留着烧焦的动物油脂。'},
      choices:[
        {text:'亲赴作坊，让匠人按停机顺序复述事故',hint:'你可能听到不符合圣意的真话。',years:2,item:'断裂榆木轴',clue:'先看失效部位，再追究责任；否则只会得到新的谎话。',next:'prototype'},
        {text:'命画师画成御制结构图，呈送书房研究',hint:'图会很美，但摩擦热不会画在纸上。',years:4,item:'御制结构图',next:'prototype'},
        {text:'无需再查，拨银十万两一次造足百台',hint:hasItem('老木匠鲁七')?'鲁七跪着不肯领旨。':'没有人敢问哪一种设计。',years:10,credit:-18,death:{word:'失国',cause:'百台机器一同损坏，国库与威望一起见底。',title:'百机躁皇帝',comment:'一台尚未学会，便急着把同一个错误复制一百遍。',clue:'先做一台能活过冬天的机器，再谈一百台。'}}
      ]
    }),
    prototype: () => ({
      label:`试作 · 在位第 ${state.years+1} 年`,
      question:'第一台水轮锻锤\n准备试车。你怎么做？',
      copy:'水轮、主轴、六枚凸轮和重锤已经装好。所有人都看着你，机器也在等你犯第一个错误。',
      showModel:true,
      choices:[
        {text:'先空载，再逐级加锤重；每次只改一个变量',hint:'慢，但能知道究竟是哪一步起作用。',years:4,item:'三凸轮样机',tech:'水力试验台',clue:'一次只改一个变量，失败才会留下知识。',next:'standard'},
        {text:'挂满六枚凸轮，直接以最高水量冲车',hint:'最壮观的第一次，也可能是最后一次。',years:1,trap:true,death:{word:'殉工',cause:'凸轮碎裂，一截硬木越过三道护栏。',title:'求速烈皇帝',comment:'嫌试验太慢，遂令事故替自己加速。',clue:'高频冲击会叠加；先降低凸轮数量并设置护栏。'}},
        {text:'站到锤头旁边，亲眼观察它为何卡顿',hint:'你相信第一视角能看见最多细节。',years:1,trap:true,death:{word:'锤崩',cause:'你准确观察到了锤头落下前的最后一瞬。',title:'亲试烈皇帝',comment:'躬亲器械，诚为美德；站在运动路径上，未必。',clue:'观察机器时，不要站在任何运动部件的路径上。'}}
      ]
    }),
    standard: () => ({
      label:`定法 · 在位第 ${state.years+1} 年`,
      question:'样机终于能转。\n怎样让第二台也能转？',
      copy:'鲁七可以凭手感修好它，但鲁七会老。你要保存的不是一台机器，而是不依赖某个人的制造能力。',
      artifact:{type:'获得纸条',glyph:'度',name:'鲁七塞来的尺寸纸',copy:'“臣死后，若无人知道这个孔究竟多大，机器便也跟着臣死了。”'},
      choices:[
        {text:'统一尺规、塞规和零件编号，允许工匠标记废品',hint:'标准化很无聊，却能跨过人的寿命。',years:6,tech:'统一量具',item:'御定塞规',clue:'可复制的精度，比一位天才工匠更接近工业。',next:'crossroad'},
        {text:'重赏鲁七，命他终身亲手修每一台机器',hint:'今天最省事，十年后最昂贵。',years:2,item:'神匠金牌',next:'crossroad'},
        {text:'列为绝密，图纸只准皇帝一人观看',hint:'没有泄密，也没有复核。',years:1,credit:-7,next:'crossroad'}
      ]
    }),
    crossroad: () => ({
      label:`暮年 · 在位第 ${state.years+1} 年`,
      question:'白发来得比蒸汽机快。\n剩下的寿命投向哪里？',
      copy:`你还剩约 ${state.life} 年。火箭仍在遥远的科技树尽头，但这一世已经有东西可以留下。`,
      choices:[
        {text:'建立净水条例与工匠医馆，先让后来者活久一点',hint:'消耗六年，但改善健康可能为你多争取八年。',years:6,lifeGain:8,tech:'工匠医馆',next:'succession'},
        {text:'跨过所有中间环节，秘密研制高压蒸汽锅炉',hint:state.tech.length>=2?'你至少已经学会测量与试验。':'没有量具、压力表和可靠钢材。',years:14,death:state.tech.length>=2?null:{word:'炉崩',cause:'锅炉没有压力表，裂纹也没有第二次警告。',title:'蒸骨烈皇帝',comment:'水可载舟，蒸汽亦可把屋顶载到三里之外。',clue:'高压容器需要可靠钢材、压力测量与安全阀。'},tech:state.tech.length>=2?'低压蒸汽试验':null,next:'succession'},
        {text:'停止折腾，把余年用来享受已经拥有的一切',hint:'安全地活着，也是一种目标。',years:Math.max(1,state.life-1),ending:{cause:'你在安稳中寿终，未再推进工程。',title:'知止安皇帝',comment:'不曾飞向九天，但也没有把宫殿送上九天。',clue:'有限寿命下，停止也是选择；只是科技树不会自己生长。'}}
      ]
    }),
    succession: () => ({
      label:`传承 · 在位第 ${state.years+1} 年`,
      question:'最后一道诏书，\n写给谁看？',
      copy:'你终于明白：真正超过一生尺度的技术，只能靠制度把记忆交给下一代。',
      choices:[
        {text:'设工艺学馆，让匠人、算学家与医者共同授课',hint:'最昂贵，但能让失败被下一代继承。',years:8,tech:'工艺学馆',ending:{cause:'你在学馆第一届学生毕业后安然离世。',title:'启工宣皇帝',comment:'未尝见火箭，而使后世终于知道该先造什么。',clue:'跨世代工程的核心不是长生，而是让知识不随人殉葬。'}},
        {text:'把所有图纸封入皇陵，待有缘人开启',hint:'保存得很好，以至于没人能用。',years:3,ending:{cause:'图纸随你下葬，工坊随后停摆。',title:'秘图幽皇帝',comment:'爱知识如爱珍宝，遂将二者一同藏到无人可见。',clue:'知识必须被使用、质疑和复制，保存本身不是传承。'}},
        {text:'耗尽余寿，再尝试一次整枚火箭点火',hint:'也许这一世会有不同。也许。',years:Math.max(1,state.life),trap:true,death:{word:'升天',cause:'你和未经验证的推进器完成了同一次首飞。',title:'再火烈皇帝',comment:'一世已学会试验，末了仍选择跳过试验。',clue:'终极目标不值得用一次不可复现的成功或死亡来交换。'}}
      ]
    })
  };

  function start(force = false) {
    if (state && !state.dead && !force) {
      renderAll();
      window.scrollTo({top:0, behavior:'instant'});
      return;
    }
    meta.cycle += 1; saveMeta();
    const world = worlds[(meta.cycle - 1) % worlds.length];
    state = {
      world, maxLife:world.life, life:world.life, years:0, credit:70,
      tech:[], inventory:[], clues:[], log:[], goal:null, node:'wake', decisions:0, dead:false
    };
    document.getElementById('soul-death').classList.add('hidden');
    renderAll();
    window.scrollTo({top:0, behavior:'instant'});
  }

  function renderAll() {
    renderHUD(); renderDesk(); renderChronicle(); renderNode();
  }

  function renderHUD() {
    const {world}=state;
    document.getElementById('soul-cycle').textContent = numerals[meta.cycle] || String(meta.cycle);
    document.getElementById('ruler-seal').textContent=world.seal;
    document.getElementById('ruler-title').textContent=`${world.dynasty}当朝天子`;
    document.getElementById('ruler-age').textContent=`${world.age+state.years} 岁 · ${world.place} · ${world.wealth}`;
    document.getElementById('life-value').textContent=`${Math.max(0,state.life)} 年`;
    document.getElementById('life-bar').style.width=`${Math.max(0,state.life/state.maxLife*100)}%`;
    document.getElementById('credit-value').textContent=Math.max(0,state.credit);
    document.getElementById('tech-value').textContent=state.tech.length;
  }

  function renderDesk() {
    const goal=document.getElementById('goal-display');
    goal.textContent=state.goal||'尚未立愿'; goal.className=state.goal?'goal-slot':'empty-slot';
    const inventory=document.getElementById('inventory-list');
    inventory.innerHTML=state.inventory.length?state.inventory.map(i=>`<span>${i}</span>`).join(''):'<span class="empty-token">空</span>';
    const clues=[...meta.clues,...state.clues];
    document.getElementById('clue-list').innerHTML=clues.length?clues.slice(-4).reverse().map(c=>`<p class="clue-paper">${c}</p>`).join(''):'<p>尚无线索。死一次或许就有了。</p>';
  }

  function renderChronicle() {
    document.getElementById('decision-count').textContent=`${state.decisions} 诏`;
    document.getElementById('chronicle-list').innerHTML=state.log.length?state.log.slice().reverse().map(entry=>`<li><b>${entry.text}</b><small>耗寿 ${entry.years} 年</small></li>`).join(''):'<li class="empty-entry">史官正在磨墨。</li>';
  }

  function renderNode() {
    const node=nodes[state.node]();
    document.getElementById('scene-label').textContent=node.label;
    document.getElementById('scene-question').innerHTML=node.question.replace(/\n/g,'<br>');
    document.getElementById('scene-copy').textContent=node.copy;
    const previous=document.getElementById('previous-note');
    if(meta.clues.length){previous.classList.remove('hidden');document.getElementById('previous-note-copy').textContent=meta.clues.at(-1);}else{previous.classList.add('hidden');}
    const artifact=document.getElementById('found-object');
    if(node.artifact){artifact.classList.remove('hidden');document.getElementById('object-type').textContent=node.artifact.type;document.getElementById('object-glyph').textContent=node.artifact.glyph;document.getElementById('object-name').textContent=node.artifact.name;document.getElementById('object-copy').textContent=node.artifact.copy;}else{artifact.classList.add('hidden');}
    const modelWrap=document.getElementById('soul-model-wrap');
    modelWrap.classList.toggle('hidden',!node.showModel);
    if(node.showModel){requestAnimationFrame(()=>{soulModel?.resize();soulModel?.setOptions({power:'water',shaft:'elm',cams:6,tolerance:5});});}
    document.getElementById('choice-list').innerHTML=node.choices.map((choice,index)=>{
      const locked=choice.requires&&!choice.requires();
      return `<button class="soul-choice ${choice.trap?'trap':''} ${locked?'locked':''}" data-choice="${index}" ${locked?'disabled':''}><span class="choice-key">${index+1}</span><span><strong>${choice.text}</strong><small>${choice.hint||''}</small></span><span class="year-cost">− ${choice.years} 年</span></button>`;
    }).join('');
    document.querySelectorAll('#choice-list [data-choice]').forEach(button=>button.addEventListener('click',()=>choose(node.choices[Number(button.dataset.choice)])));
  }

  function choose(choice) {
    state.decisions += 1; state.years += choice.years; state.life -= choice.years; state.credit += choice.credit||0;
    if(choice.goal)state.goal=choice.goal;
    if(choice.item&&!state.inventory.includes(choice.item))state.inventory.push(choice.item);
    if(choice.clue&&!state.clues.includes(choice.clue))state.clues.push(choice.clue);
    if(choice.tech&&!state.tech.includes(choice.tech))state.tech.push(choice.tech);
    if(choice.lifeGain){state.life=Math.min(state.maxLife+12,state.life+choice.lifeGain);state.maxLife+=choice.lifeGain;}
    state.log.push({text:choice.text,years:choice.years});
    renderHUD();renderDesk();renderChronicle();
    if(choice.death){die(choice.death);return;}
    if(choice.ending){die({...choice.ending,word:'寿终'});return;}
    if(state.credit<=0){die({word:'被废',cause:'朝局信用耗尽，宗室与重臣替你结束了实验。',title:'失信愍皇帝',comment:'能令机器转动，未能令朝堂继续相信。',clue:'资源最多不等于政治成本为零；先用小成功换取下一次试错。'});return;}
    if(state.life<=0){die(naturalEnding());return;}
    state.node=choice.next||state.node;
    renderNode();
  }

  function naturalEnding() {
    if(state.tech.length>=3)return{word:'寿终',cause:'你的寿命耗尽，但工坊仍在继续运转。',title:'器成穆皇帝',comment:'身未至九天，所立尺度已越过一世。',clue:'一生最好的产物，可能是一套别人能够继续使用的标准。'};
    return{word:'寿终',cause:'岁月用尽，目标仍停留在御案上。',title:'空想哀皇帝',comment:'所知甚多，所试甚少；以一生保存答案，未曾留下方法。',clue:'知识只有经过小规模试验，才会从记忆变成技术。'};
  }

  function die(result) {
    state.dead=true;
    if(result.clue&&!meta.clues.includes(result.clue))meta.clues.push(result.clue);
    saveMeta();
    document.getElementById('death-word').textContent=result.word||'崩殂';
    document.getElementById('death-cause').textContent=result.cause;
    document.getElementById('posthumous-title').textContent=result.title;
    document.getElementById('historian-comment').textContent=`“${result.comment}”`;
    document.getElementById('summary-years').textContent=`${state.years} 年`;
    document.getElementById('summary-decisions').textContent=`${state.decisions} 道`;
    document.getElementById('summary-tech').textContent=`${state.tech.length} 项`;
    document.getElementById('legacy-clue').textContent=result.clue;
    document.getElementById('soul-death').classList.remove('hidden');
    window.scrollTo({top:0, behavior:'instant'});
  }

  function initModel() {
    if(!window.EngineeringModel3D||soulModel)return;
    soulModel=new window.EngineeringModel3D(document.getElementById('soul-model-3d'),{variant:'workbench',autoOrbit:true,running:true,yaw:.86,pitch:.22,distance:12.8});
  }

  document.getElementById('reincarnate').addEventListener('click',()=>start(true));
  document.getElementById('forget-memory').addEventListener('click',()=>{meta.clues=[];saveMeta();renderDesk();renderNode();});
  document.getElementById('copy-epitaph').addEventListener('click',async()=>{
    const text=`《工科穿越指南》本世谥号：${document.getElementById('posthumous-title').textContent}。史官批语：${document.getElementById('historian-comment').textContent}`;
    try{await navigator.clipboard.writeText(text);}catch{}
    const toast=document.getElementById('toast');toast.textContent='已抄下谥号与批语';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500);
  });

  window.SoulAdventure={start,initModel};
})();
