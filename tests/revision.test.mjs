import test from 'node:test';import assert from 'node:assert/strict';
import {buildAtlasParts,PARTS_PER_GROUP,TOTAL_PARTS} from '../rocket-atlas-model.mjs';
import {ERAS,CHAPTERS,DECISIONS,SOURCES,eventFor,freshCampaign,completeChapter,sanitizeCampaign} from '../chronicle-data.mjs';
import {DIFFICULTIES,ENDINGS} from '../story-revision.mjs';
import {newTrial,trialAction} from '../lab-rules.mjs';import {trialGuide} from '../trial-guide.mjs';
test('192 distinct display parts unfold to separated cells and unlock in eight complete batches',()=>{
 const parts=buildAtlasParts();assert.equal(parts.length,TOTAL_PARTS);assert.equal(new Set(parts.map(p=>p.id)).size,TOTAL_PARTS);assert.equal(new Set(parts.map(p=>p.grid.join())).size,TOTAL_PARTS);
 for(let group=0;group<8;group++)assert.equal(parts.filter(p=>p.group===group).length,PARTS_PER_GROUP);
 for(const p of parts){assert.ok(p.geometry.attributes.position.count>0);assert.ok([...p.position,...p.rotation,...p.grid,p.gridScale].every(Number.isFinite));const box=p.geometry.boundingBox;assert.ok((box.max.x-box.min.x)*p.gridScale<=1.001);assert.ok((box.max.y-box.min.y)*p.gridScale<=1.001);p.geometry.dispose()}
});
test('all eight trials can be finished by following their live guide, across every character difficulty',()=>{
 for(const difficulty of DIFFICULTIES)for(const chapter of CHAPTERS){const s=newTrial(chapter.id,difficulty.level);let actions=0;while(!s.passed&&actions++<35){const g=trialGuide(s);assert.ok(g.text.length>8);if(g.mark!==undefined)trialAction(s,'mark',[g.mark,0]);else trialAction(s,g.action,g.action==='choose'?'b':g.value)}assert.ok(s.passed,chapter.id+' '+difficulty.label);assert.equal(trialGuide(s).action,'done')}
 assert.notDeepEqual(newTrial('measure',0).marks,newTrial('measure',2).marks);assert.notDeepEqual(newTrial('sequence',0).sequence,newTrial('sequence',2).sequence);
});
test('historical cards have explicit years, real-event sources and never reference crafting fiction',()=>{
 for(let era=0;era<4;era++)for(let chapter=0;chapter<8;chapter++){const e=eventFor({...freshCampaign(era),chapter});assert.ok(e.year<=ERAS[era].years[chapter]);assert.ok(SOURCES[e.source]);assert.ok(!e.fiction);assert.doesNotMatch(e.text,/工坊|造物|工匠|架空/)}
 assert.deepEqual(DECISIONS,{});
});
test('four personal alternate endings retain factual history and valid expression beats',()=>{
 assert.equal(new Set(ENDINGS.map(e=>e.title)).size,4);for(const e of ENDINGS){assert.ok(e.history.startsWith('史实'));assert.ok(SOURCES[e.source]);assert.equal(e.beats.length,4);assert.ok(e.beats.some(([text])=>text.includes('导弹')));assert.ok(e.beats.every(([text,mood])=>text.length>20&&mood>=0&&mood<9))}
 assert.ok(ENDINGS[2].history.includes('尚未称帝'));assert.equal(ENDINGS[2].year,1363);
});
test('old completed campaigns survive the removal of management decisions',()=>{
 const old={...freshCampaign(1),entered:true,completed:CHAPTERS.map(c=>c.id),decisions:{2:'mentor',6:'listen',7:'team'},trust:6};const s=sanitizeCampaign(old);assert.equal(s.chapter,8);assert.equal(s.known.length,17);assert.equal(s.trust,0);assert.deepEqual(s.decisions,{});assert.equal(completeChapter(s,{passed:true}),false);
});
