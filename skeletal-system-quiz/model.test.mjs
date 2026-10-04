import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import * as THREE from './vendor/three.module.min.js';
import {buildAnatomy,decodeModel} from './model.mjs';

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
 }
 const floating=anatomy.targets.get('floatingRibs').bones;
 assert.equal(floating.length,4,'both pairs of floating ribs should be present');
 assert.ok(floating.every(mesh=>!mesh.userData.supplement),'floating ribs should have no cartilage');
});
