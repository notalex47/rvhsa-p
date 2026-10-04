import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import * as THREE from './vendor/three.module.min.js';
import {buildAnatomy,decodeModel,Viewer} from './model.mjs';

test('model data itself contains all six lower cartilages before anatomy construction',async()=>{
 const manifest=JSON.parse(await readFile(new URL('./skeleton.json',import.meta.url),'utf8'));
 const bytes=await readFile(new URL('./skeleton.bin',import.meta.url));
 const decoded=decodeModel(manifest,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
 const lower=decoded.filter(m=>/^(Left|Right) (eighth|ninth|tenth) costal cartilage$/i.test(m.userData.label));
 assert.equal(lower.length,6,'the connections must exist in the asset, not just a repair function');
 assert.equal(new Set(lower.map(m=>m.name)).size,6);
 for(const mesh of lower){assert.ok(mesh.userData.supplement);assert.ok(mesh.geometry.index.count>0);assert.ok(mesh.geometry.attributes.position.count>0);}
 const anatomy=buildAnatomy(decoded);
 assert.equal(anatomy.targets.get('costal').bones.length,20);
 assert.equal(anatomy.targets.get('falseRibs').bones.length,16);
 assert.equal(anatomy.group.children.filter(m=>lower.some(l=>l.name===m.name)).length,6,'do not create duplicate repairs');
 const olderManifest=structuredClone(manifest);olderManifest.parts=olderManifest.parts.filter(p=>!p.userData?.supplement);
 const fallback=buildAnatomy(decodeModel(olderManifest,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)));
 assert.equal(fallback.targets.get('costal').bones.length,20,'old asset fallback remains supported');
});

async function loadAnatomy() {
 const manifest=JSON.parse(await readFile(new URL('./skeleton.json',import.meta.url),'utf8'));
 const bytes=await readFile(new URL('./skeleton.bin',import.meta.url));
 const buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
 return buildAnatomy(decodeModel(manifest,buffer));
}

function distanceToSurface(mesh,point) {
 const positions=mesh.geometry.attributes.position,index=mesh.geometry.index;
 const triangle=new THREE.Triangle(),closest=new THREE.Vector3();
 let distance=Infinity;
 for(let i=0;i<index.count;i+=3){
  triangle.a.fromBufferAttribute(positions,index.getX(i));
  triangle.b.fromBufferAttribute(positions,index.getX(i+1));
  triangle.c.fromBufferAttribute(positions,index.getX(i+2));
  triangle.closestPointToPoint(point,closest);
  distance=Math.min(distance,closest.distanceTo(point));
 }
 return distance;
}

// Check actual overlap, not just a center's distance from a surface. Use
// three non-axis-aligned rays to avoid counting shared triangle edges twice.
function inside(mesh,point) {
 const directions=[[1,.257,.139],[.177,1,.331],[.119,.237,1]];
 const votes=directions.map(d=>{
  const hits=new THREE.Raycaster(point,new THREE.Vector3(...d).normalize(),1e-7).intersectObject(mesh,false).map(h=>h.distance).sort((a,b)=>a-b);
  const unique=hits.filter((distance,i)=>!i||distance-hits[i-1]>1e-6);
  return unique.length%2===1;
 });
 return votes.filter(Boolean).length>=2;
}

test('ribs 8–10 have overlapping cartilage attachments while ribs 11–12 float',async()=>{
 const anatomy=await loadAnatomy();
 const falseRibs=anatomy.targets.get('falseRibs').bones;
 const attachments=falseRibs.filter(mesh=>mesh.userData.supplement);
 const attachmentByName=new Map(attachments.map(mesh=>[mesh.name,mesh]));
 assert.equal(attachments.length,6,'three cartilage attachments should exist on each side');
 for(const attachment of attachments){
  const rib=anatomy.map.get(attachment.userData.ribId);
  const anchor=new THREE.Vector3(...attachment.userData.ribAnchor);
  assert.ok(rib,`${attachment.name} should identify its rib`);
  assert.ok(distanceToSurface(rib,anchor)<0.004,`${attachment.name} should overlap its rib`);
  const upper=anatomy.map.get(attachment.userData.upperCartilage)||attachmentByName.get(attachment.userData.upperCartilage);
  const upperAnchor=new THREE.Vector3(...attachment.userData.upperAnchor);
  assert.ok(upper,`${attachment.name} should identify the cartilage above it`);
  assert.ok(distanceToSurface(upper,upperAnchor)<0.006,`${attachment.name} should meet the cartilage above it`);
  const p=attachment.geometry.attributes.position,{sides,segments}=attachment.userData;
  let inRib=0,inUpper=0;
  for(let i=0;i<sides;i++){
   if(inside(rib,new THREE.Vector3().fromBufferAttribute(p,i)))inRib++;
   if(inside(upper,new THREE.Vector3().fromBufferAttribute(p,segments*(sides+1)+i)))inUpper++;
  }
  assert.ok(inRib>=2,`${attachment.name} must physically overlap its rib`);
  assert.ok(inUpper>=2,`${attachment.name} must physically overlap the upper cartilage`);
 }
 const floating=anatomy.targets.get('floatingRibs').bones;
 assert.equal(floating.length,4,'both pairs of floating ribs should be present');
 assert.ok(floating.every(mesh=>!mesh.userData.supplement),'floating ribs should have no cartilage');
});

test('cartilage remains visible through false-rib, cartilage, and other highlights',async()=>{
 const anatomy=await loadAnatomy(),viewer=Object.create(Viewer.prototype);
 viewer.anatomy=anatomy;viewer.camera=new THREE.PerspectiveCamera(35,1.2,.0001,20);viewer.controls={target:new THREE.Vector3(),update(){}};
 const cartilages=anatomy.targets.get('costal').bones;
 const lower=cartilages.filter(m=>m.userData.supplement);
 for(const id of ['falseRibs','costal','floatingRibs','frontal','falseRibs']){
  viewer.highlight(id);
  for(const m of lower){
   assert.ok(m.visible&&m.parent===anatomy.group);
   assert.equal(m.material,['falseRibs','costal'].includes(id)?anatomy.highlightMaterial:anatomy.cartilageMaterial);
  }
 }
});
