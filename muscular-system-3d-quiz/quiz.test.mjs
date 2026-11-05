import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from './vendor/three.module.min.js';
import {QUESTIONS,makeChoices,isCorrect,Quiz,serializeSession,restoreSession} from './core.mjs';
import {decodeModel,buildAnatomy,Viewer} from './model.mjs';
async function load(path){const manifest=JSON.parse(await readFile(new URL(path+'.json',import.meta.url)));const bytes=await readFile(new URL(path+'.bin',import.meta.url));return decodeModel(manifest,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));}
const anatomy=buildAnatomy(await load('./muscles'),await load('../skeletal-system-quiz/skeleton'));
test('exactly the 25 requested structures, with meaningful answer handling',()=>{
 assert.equal(QUESTIONS.length,25);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,25);
 assert.equal(isCorrect(QUESTIONS.find(q=>q.id==='sartorius'),'Surtorius'),true);
 assert.equal(isCorrect(QUESTIONS.find(q=>q.id==='parsPeripheralis'),'orbicularis oris'),false,'a whole muscle name must not substitute for its specific requested part');
 for(const q of QUESTIONS){assert.ok(isCorrect(q,q.answer));assert.ok(isCorrect(q,'Left '+q.answer));const choices=makeChoices(q);assert.equal(choices.length,4);assert.equal(new Set(choices.map(q=>q.id)).size,4);assert.equal(choices.filter(c=>c.id===q.id).length,1);}
});
test('every target uses full geometries, all sides, and all heads or portions',()=>{
 const counts={temporalis:2,orbicularisOculi:2,parsPeripheralis:1,pectoralisMajor:6,deltoid:6,bicepsBrachii:4,rectusAbdominis:2,externalOblique:2,sartorius:2,occipitofrontalis:5,sternocleidomastoid:2,brachioradialis:2,tensorFasciaeLatae:2,rectusFemoris:2,vastusLateralis:2,vastusMedialis:2,tibialisAnterior:2,gluteusMaximus:2,bicepsFemoris:4,semitendinosus:2,trapezius:6,tricepsBrachii:6,latissimusDorsi:2,gluteusMedius:2,gastrocnemius:4};
 assert.equal(anatomy.targets.size,25);
 const mock={anatomy,frame(){}};
 for(const q of QUESTIONS){
  const t=anatomy.targets.get(q.id);assert.equal(t.bones.length,counts[q.id],q.id);assert.equal(t.overlays.length,0);
  Viewer.prototype.highlight.call(mock,q.id,q.view,true);
  assert.equal(anatomy.meshes.filter(m=>m.material===anatomy.highlightMaterial).length,counts[q.id],q.id+' must not leave another target highlighted');
  for(const m of t.bones){assert.equal(m.material,anatomy.highlightMaterial);assert.ok(m.geometry.index.count>0);assert.ok(m.geometry.attributes.position.count>0);}
  if(q.id!=='parsPeripheralis'){assert.ok(t.box.min.x<0&&t.box.max.x>0,q.id+' must span both sides');}
 }
});
test('all bundled mesh buffers are finite and indices are valid',()=>{
 for(const m of anatomy.group.children){const p=m.geometry.attributes.position;assert.ok([...p.array].every(Number.isFinite),m.name);for(const i of m.geometry.index.array)assert.ok(i<p.count,m.name);}
});
test('all targets fit the auto-focus camera on wide and narrow screens',()=>{
 for(const aspect of [1.3,.75])for(const q of QUESTIONS){
  const camera=new THREE.PerspectiveCamera(35,aspect,.0001,20),mock={camera,controls:{target:new THREE.Vector3(),update(){}}};
  const b=anatomy.targets.get(q.id).box;Viewer.prototype.frame.call(mock,b,q.view);camera.updateMatrixWorld();
  for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const p=new THREE.Vector3(x,y,z).project(camera);assert.ok(Math.abs(p.x)<=1&&Math.abs(p.y)<=1,q.id+' must remain in frame');}
 }
});
test('a full quiz scores once per question and restores exact progress',()=>{
 const quiz=new Quiz('mc');const choices=makeChoices(quiz.current);quiz.answer(quiz.current.answer);assert.equal(quiz.answer('anything'),null);const saved=serializeSession(quiz,choices),restored=restoreSession(saved);assert.ok(restored);assert.equal(restored.quiz.score,1);assert.deepEqual(restored.choices.map(q=>q.id),saved.choices);assert.deepEqual(restored.quiz.deck.map(q=>q.id),saved.deck);
 while(quiz.next()){quiz.answer(quiz.current.answer);}
 assert.equal(quiz.score,25);assert.equal(quiz.missed.length,0);
 const free=new Quiz('free');free.answer('',true);assert.equal(free.score,0);assert.equal(free.missed.length,1);assert.ok(restoreSession(serializeSession(free)));
 assert.equal(restoreSession({...saved,deck:['bogus']}),null);
});
