import * as THREE from './vendor/three.module.min.js';
import {OrbitControls} from './vendor/OrbitControls.js';

export function decodeModel(manifest,buffer) {
 return manifest.parts.map(p=>{
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,p.positionOffset,p.vertexCount*3),3));
  geometry.setIndex(new THREE.BufferAttribute(p.indexBytes===2?new Uint16Array(buffer,p.indexOffset,p.indexCount):new Uint32Array(buffer,p.indexOffset,p.indexCount),1));
  geometry.computeVertexNormals();geometry.computeBoundingBox();
  const mesh=new THREE.Mesh(geometry);mesh.name=p.id;mesh.userData={...(p.userData||{}),label:p.name};return mesh;
 });
}

import {QUESTIONS} from './core.mjs';

export function buildAnatomy(muscles,bones=[]){
 const group=new THREE.Group(),meshes=[...muscles],map=new Map(meshes.map(m=>[m.name,m]));
 const boneMaterial=new THREE.MeshStandardMaterial({color:0xd1c8b6,roughness:.8,side:THREE.DoubleSide});
 const muscleMaterial=new THREE.MeshStandardMaterial({color:0xad4b48,roughness:.64,side:THREE.DoubleSide});
 const aponeurosisMaterial=new THREE.MeshStandardMaterial({color:0xd3b4a4,roughness:.8,side:THREE.DoubleSide});
 const highlightMaterial=new THREE.MeshStandardMaterial({color:0xffaa24,emissive:0x6f3000,emissiveIntensity:.3,roughness:.53,side:THREE.DoubleSide});
 bones.forEach(m=>{m.material=boneMaterial;m.userData.baseMaterial=boneMaterial;m.userData.contextBone=true;group.add(m);});
 const baseMaterials=[boneMaterial,aponeurosisMaterial];
 for(const m of meshes){
  const material=m.userData.aponeurosis?aponeurosisMaterial:muscleMaterial.clone();
  if(!m.userData.aponeurosis){let hash=0;for(const c of m.name)hash=(hash*31+c.charCodeAt(0))|0;material.color.offsetHSL(0,(Math.abs(hash)%5)*.008,(Math.abs(hash)%7-3)*.009);baseMaterials.push(material);}
  m.material=material;m.userData.baseMaterial=material;group.add(m);
 }
 const targets=new Map();
 const patterns={temporalis:/temporalis$/i,orbicularisOculi:/orbicularis oculi$/i,parsPeripheralis:/Pars peripheralis/i,pectoralisMajor:/pectoralis major$/i,deltoid:/deltoid$/i,bicepsBrachii:/biceps brachii$/i,rectusAbdominis:/rectus abdominis$/i,externalOblique:/external oblique$/i,sartorius:/sartorius$/i,occipitofrontalis:/occipitofrontalis$/i,sternocleidomastoid:/sternocleidomastoid$/i,brachioradialis:/brachioradialis$/i,tensorFasciaeLatae:/tensor fasciae latae$/i,rectusFemoris:/rectus femoris$/i,vastusLateralis:/vastus lateralis$/i,vastusMedialis:/vastus medialis$/i,tibialisAnterior:/tibialis anterior$/i,gluteusMaximus:/gluteus maximus$/i,bicepsFemoris:/biceps femoris$/i,semitendinosus:/semitendinosus$/i,trapezius:/trapezius$/i,tricepsBrachii:/triceps brachii$/i,latissimusDorsi:/latissimus dorsi$/i,gluteusMedius:/gluteus medius$/i,gastrocnemius:/gastrocnemius$/i};
 for(const q of QUESTIONS){
  const selected=meshes.filter(m=>patterns[q.id].test(m.userData.label));
  if(!selected.length)throw Error('Missing muscle '+q.id);
  // Use the complete bilateral extent for framing, as well as for highlighting.
  const box=new THREE.Box3();selected.forEach(m=>box.expandByObject(m));
  targets.set(q.id,{bones:selected,overlays:[],primary:selected,box});
 }
 group.updateMatrixWorld(true);
 return {group,meshes,map,targets,boneMaterial,muscleMaterial,baseMaterials,highlightMaterial,allBox:new THREE.Box3().setFromObject(group)};
}
export class Viewer {
 constructor(host,anatomy){
  this.host=host;this.anatomy=anatomy;this.current=null;this.view='front';this.focused=false;this.ghost=false;
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));this.renderer.setClearColor(0x112d45);host.prepend(this.renderer.domElement);
  this.renderer.domElement.setAttribute('aria-label','Interactive 3D muscle model. Drag to rotate; scroll or pinch to zoom.');
  this.scene=new THREE.Scene();this.scene.add(anatomy.group);
  this.scene.add(new THREE.HemisphereLight(0xe8f5ff,0x667079,1.8));
  const key=new THREE.DirectionalLight(0xfff4df,2.2);key.position.set(1,3,3);this.scene.add(key);
  const rim=new THREE.DirectionalLight(0x8fcfff,1.5);rim.position.set(-2,1,-2);this.scene.add(rim);
  this.camera=new THREE.PerspectiveCamera(35,1,0.0001,20);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=0.10;this.controls.minDistance=0.045;this.controls.maxDistance=5;this.controls.enablePan=true;
  this.controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
  this.resize();this.frame(anatomy.allBox,'front');
  this.needsRender=true;
  this.controls.addEventListener('change',()=>{this.needsRender=true;});
  this.renderer.setAnimationLoop(()=>{const changed=this.controls.update();if(changed||this.needsRender){this.renderer.render(this.scene,this.camera);this.needsRender=false;}});
  this.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dispatchEvent(new CustomEvent('viewerError',{detail:'The 3D graphics context was lost. Reload this page to restore the muscle model.'}));});
 }
 resize(){const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.needsRender=true;}
 frame(box,view=this.view){
  this.view=view;const center=box.getCenter(new THREE.Vector3());const size=box.getSize(new THREE.Vector3());
  const dir=view==='back'?new THREE.Vector3(0,0,-1):view==='side'?new THREE.Vector3(1,0,0):view==='otherSide'?new THREE.Vector3(-1,0,0):new THREE.Vector3(0,0,1);
  const horizontal=view==='side'||view==='otherSide'?size.z:size.x;
  const verticalFov=THREE.MathUtils.degToRad(this.camera.fov);const horizontalFov=2*Math.atan(Math.tan(verticalFov/2)*this.camera.aspect);
  const distance=Math.max(size.y/(2*Math.tan(verticalFov/2)),horizontal/(2*Math.tan(horizontalFov/2)),0.065)*1.36+Math.max(size.x,size.z)*0.4;
  this.controls.target.copy(center);this.camera.position.copy(center).addScaledVector(dir,distance);this.camera.up.set(0,1,0);this.camera.lookAt(center);this.controls.update();this.needsRender=true;
 }
 highlight(id,view='front',autoFocus=true){
  this.current=id;this.view=view;this.defaultView=view;
  for(const t of this.anatomy.targets.values()){t.bones.forEach(m=>m.material=m.userData.baseMaterial||this.anatomy.boneMaterial);t.overlays.forEach(m=>m.visible=false);}
  const t=this.anatomy.targets.get(id);if(!t)throw Error('Unknown target '+id);
  t.bones.forEach(m=>m.material=this.anatomy.highlightMaterial);t.overlays.forEach(m=>m.visible=true);
  this.focused=autoFocus;this.frame(autoFocus?t.box:this.anatomy.allBox,view);
 }
 focus(){this.focused=true;this.frame(this.anatomy.targets.get(this.current).box,this.view);}
 reset(){this.setGhost(false);this.focused=Boolean(this.current);this.frame(this.current?this.anatomy.targets.get(this.current).box:this.anatomy.allBox,this.current?(this.defaultView||'front'):'front');}
 whole(){this.focused=false;this.frame(this.anatomy.allBox,this.view);}
 setView(view){this.frame(this.focused&&this.current?this.anatomy.targets.get(this.current).box:this.anatomy.allBox,view);}
 setGhost(on){this.ghost=on;for(const m of this.anatomy.baseMaterials){m.transparent=on;m.opacity=on?.13:1;m.depthWrite=!on;m.needsUpdate=true;}this.needsRender=true;}
 rotate(angle){const d=this.camera.position.clone().sub(this.controls.target);d.applyAxisAngle(new THREE.Vector3(0,1,0),angle);this.camera.position.copy(this.controls.target).add(d);this.controls.update();this.needsRender=true;}
 zoom(factor){const d=this.camera.position.clone().sub(this.controls.target);d.multiplyScalar(factor);d.clampLength(this.controls.minDistance,this.controls.maxDistance);this.camera.position.copy(this.controls.target).add(d);this.controls.update();this.needsRender=true;}
}
