import * as THREE from './vendor/three.module.min.js';
import {OrbitControls} from './vendor/OrbitControls.js';

export function decodeModel(manifest,buffer) {
 return manifest.parts.map(p=>{
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,p.positionOffset,p.vertexCount*3),3));
  geometry.setIndex(new THREE.BufferAttribute(p.indexBytes===2?new Uint16Array(buffer,p.indexOffset,p.indexCount):new Uint32Array(buffer,p.indexOffset,p.indexCount),1));
  geometry.computeVertexNormals();geometry.computeBoundingBox();
  const mesh=new THREE.Mesh(geometry);mesh.name=p.id;mesh.userData.label=p.name;return mesh;
 });
}

// Only triangles in the named anatomical landmark receive the orange overlay.
function crop(mesh,predicate) {
 const p=mesh.geometry.attributes.position;const index=mesh.geometry.index;const selected=[];
 for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);
  const x=(p.getX(a)+p.getX(b)+p.getX(c))/3,y=(p.getY(a)+p.getY(b)+p.getY(c))/3,z=(p.getZ(a)+p.getZ(b)+p.getZ(c))/3;
  if(predicate(x,y,z)){for(const j of [a,b,c])selected.push(p.getX(j),p.getY(j),p.getZ(j));}
 }
 if(!selected.length)throw Error('Empty landmark on '+mesh.name);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(selected,3));geometry.computeVertexNormals();geometry.computeBoundingBox();return new THREE.Mesh(geometry);
}
function tube(points,radius=0.0018){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),true);return new THREE.Mesh(new THREE.TubeGeometry(curve,80,radius,8,true));}
function ellipse(cx,cy,cz,rx,ry){return tube(Array.from({length:24},(_,i)=>{const t=i/24*Math.PI*2;return[cx+rx*Math.cos(t),cy+ry*Math.sin(t),cz];}));}

export function buildAnatomy(meshes) {
 const group=new THREE.Group(),map=new Map(meshes.map(m=>[m.name,m]));
 const boneMaterial=new THREE.MeshStandardMaterial({color:0xe6ddc5,roughness:0.62,metalness:0.02,side:THREE.DoubleSide});
 const highlightMaterial=new THREE.MeshStandardMaterial({color:0xffa126,emissive:0x7c3300,emissiveIntensity:0.32,roughness:0.48,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 for(const m of meshes){m.material=boneMaterial;group.add(m);}
 const targets=new Map();
 const named=(re)=>meshes.filter(m=>re.test(m.userData.label));
 const add=(id,bones,overlays=[],primary=bones)=>{overlays.forEach(m=>{m.material=highlightMaterial;m.visible=false;m.renderOrder=2;group.add(m);});targets.set(id,{bones,overlays,primary,box:new THREE.Box3()});};
 const pair=(a,b)=>[map.get(a),map.get(b)];
 const ids=(...names)=>names.map(n=>map.get(n));
 add('frontal',ids('FJ3200'));
 add('parietal',pair('FJ3274','FJ3380'),[],ids('FJ3274'));
 add('occipital',ids('FJ3309'));
 add('mandible',ids('FJ3289'));
 add('teeth',named(/tooth$/i));
 add('cervical',ids('FJ3176','FJ3177','FJ3161','FJ3164','FJ3167','FJ3170','FJ3172'));
 add('atlas',ids('FJ3176'));add('axis',ids('FJ3177'));
 add('thoracic',named(/thoracic vertebra$/i));add('lumbar',named(/lumbar vertebra$/i));
 const vertebra=map.get('FJ3162');
 add('transverse',[],[crop(vertebra,(x,y,z)=>Math.abs(x)>0.023&&y>0.979&&y<1.003&&z>0.053&&z<0.086)]);
 add('sacrum',ids('FJ3393'));
 add('costal',named(/costal cartilage$/i));
 add('trueRibs',named(/(first|second|third|fourth|fifth|sixth|seventh) rib$/i));
 add('falseRibs',named(/(eighth|ninth|tenth|eleventh|twelfth) rib$/i));
 add('floatingRibs',named(/(eleventh|twelfth) rib$/i));
 add('sternum',ids('FJ3153','FJ3178','FJ3290'));
 add('clavicle',pair('FJ3237','FJ3362'));
 add('scapula',pair('FJ3279','FJ3384'),[],ids('FJ3279'));
 const scapulae=pair('FJ3279','FJ3384');
 add('acromion',[],scapulae.map(m=>crop(m,(x,y,z)=>Math.abs(x)>0.134&&y>1.320)));
 add('humerus',pair('FJ3262','FJ3368'),[],ids('FJ3262'));
 add('radius',pair('FJ3277','FJ3349'),[],ids('FJ3277'));
 add('ulna',pair('FJ3286','FJ3391'),[],ids('FJ3286'));
 const metacarpals=named(/metacarpal bone$/i);add('metacarpals',metacarpals,[],metacarpals.filter(m=>/left/i.test(m.userData.label)));
 const fingers=named(/phalanx.*(finger|thumb)$/i);add('handPhalanges',fingers,[],fingers.filter(m=>/left/i.test(m.userData.label)));
 const hips=pair('FJ3288','FJ3152');
 add('ilium',[],hips.map(m=>crop(m,(x,y,z)=>y>0.858)));
 add('pubis',[],hips.map(m=>crop(m,(x,y,z)=>y<=0.858&&z>0.102)));
 add('ischium',[],hips.map(m=>crop(m,(x,y,z)=>y<=0.858&&z<=0.102)));
 // The source lacks a separate coccyx and symphyseal cartilage. These two
 // original supplements occupy their anatomical positions; they are not scan meshes.
 const symphysis=new THREE.Mesh(new THREE.SphereGeometry(1,24,16));symphysis.scale.set(0.005,0.019,0.007);symphysis.position.set(0,0.802,0.130);symphysis.material=boneMaterial;group.add(symphysis);add('symphysis',[symphysis]);
 const coccyxPositions=[],coccyxIndices=[],rings=33,sides=20;
 for(let i=0;i<rings;i++){const t=i/(rings-1),lobes=1+0.10*Math.sin(t*Math.PI*8);const rx=(0.0105*(1-t)+0.002*t)*lobes,rz=(0.007*(1-t)+0.0018*t)*lobes;
  for(let j=0;j<sides;j++){const angle=j/sides*Math.PI*2;coccyxPositions.push(rx*Math.cos(angle),0.784-0.056*t,0.079+0.021*t*t+rz*Math.sin(angle));}
 }
 for(let i=0;i<rings-1;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides,c=(i+1)*sides+j,d=(i+1)*sides+(j+1)%sides;coccyxIndices.push(a,b,c,b,d,c);}
 const coccyxGeometry=new THREE.BufferGeometry();coccyxGeometry.setAttribute('position',new THREE.Float32BufferAttribute(coccyxPositions,3));coccyxGeometry.setIndex(coccyxIndices);coccyxGeometry.computeVertexNormals();
 const coccyxMesh=new THREE.Mesh(coccyxGeometry,boneMaterial);group.add(coccyxMesh);add('coccyx',[coccyxMesh]);
 add('femur',pair('FJ3259','FJ3365'),[],ids('FJ3259'));
 add('femoralCondyle',[],pair('FJ3259','FJ3365').map(m=>crop(m,(x,y,z)=>y<0.405&&z<0.094)));
 add('patella',pair('FJ3275','FJ3381'),[],ids('FJ3275'));
 add('tibia',pair('FJ3282','FJ3387'),[],ids('FJ3282'));
 add('fibula',pair('FJ3260','FJ3366'),[],ids('FJ3260'));
 add('talus',pair('FJ3280','FJ3385'),[],ids('FJ3280'));
 add('calcaneus',pair('FJ3256','FJ3360'),[],ids('FJ3256'));
 const tarsals=named(/(talus|calcaneus|cuboid bone|cuneiform bone|navicular bone of.*foot)$/i);add('tarsals',tarsals,[],tarsals.filter(m=>/left/i.test(m.userData.label)));
 const metatarsals=named(/metatarsal bone$/i);add('metatarsals',metatarsals,[],metatarsals.filter(m=>/left/i.test(m.userData.label)));
 const toes=named(/phalanx.*toe$/i);add('toePhalanges',toes,[],toes.filter(m=>/left/i.test(m.userData.label)));
 // Orange perimeter markers identify openings without inventing an "orbit bone".
 const orbits=[ellipse(0.031,1.526,0.168,0.019,0.017),ellipse(-0.032,1.526,0.168,0.019,0.017)];add('orbit',[],orbits);
 const aperture=tube([[0,1.510,0.189],[0.009,1.503,0.187],[0.013,1.488,0.184],[0.009,1.482,0.183],[0,1.480,0.183],[-0.010,1.482,0.183],[-0.014,1.488,0.184],[-0.010,1.503,0.187]],0.0016);add('nasalAperture',[],[aperture]);
 group.updateMatrixWorld(true);
 for(const [id,t] of targets){
  const focus=t.primary.length?t.primary:t.overlays;
  if(!t.bones.length&&!t.overlays.length)throw Error('Missing target '+id);
  for(const m of focus)t.box.expandByObject(m);
  if(t.box.isEmpty())throw Error('Invalid target '+id);
 }
 const allBox=new THREE.Box3().setFromObject(group);
 return {group,meshes,map,targets,boneMaterial,highlightMaterial,allBox};
}

export class Viewer {
 constructor(host,anatomy){
  this.host=host;this.anatomy=anatomy;this.current=null;this.view='front';this.focused=false;this.ghost=false;
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));this.renderer.setClearColor(0x112d45);host.prepend(this.renderer.domElement);
  this.renderer.domElement.setAttribute('aria-label','Interactive 3D skeleton. Drag to rotate; scroll or pinch to zoom.');
  this.scene=new THREE.Scene();this.scene.add(anatomy.group);
  this.scene.add(new THREE.HemisphereLight(0xe8f5ff,0x667079,2.4));
  const key=new THREE.DirectionalLight(0xfff4df,3.4);key.position.set(1,3,3);this.scene.add(key);
  const rim=new THREE.DirectionalLight(0x8fcfff,2.0);rim.position.set(-2,1,-2);this.scene.add(rim);
  this.camera=new THREE.PerspectiveCamera(35,1,0.0001,20);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=0.10;this.controls.minDistance=0.045;this.controls.maxDistance=5;this.controls.enablePan=true;
  this.controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
  this.resize();this.frame(anatomy.allBox,'front');
  this.renderer.setAnimationLoop(()=>{this.controls.update();this.renderer.render(this.scene,this.camera);});
  this.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dispatchEvent(new CustomEvent('viewerError',{detail:'The 3D graphics context was lost. Reload this page to restore the skeleton.'}));});
 }
 resize(){const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
 frame(box,view=this.view){
  this.view=view;const center=box.getCenter(new THREE.Vector3());const size=box.getSize(new THREE.Vector3());
  const dir=view==='back'?new THREE.Vector3(0,0,-1):view==='side'?new THREE.Vector3(1,0,0):view==='otherSide'?new THREE.Vector3(-1,0,0):new THREE.Vector3(0,0,1);
  const horizontal=view==='side'||view==='otherSide'?size.z:size.x;
  const verticalFov=THREE.MathUtils.degToRad(this.camera.fov);const horizontalFov=2*Math.atan(Math.tan(verticalFov/2)*this.camera.aspect);
  const distance=Math.max(size.y/(2*Math.tan(verticalFov/2)),horizontal/(2*Math.tan(horizontalFov/2)),0.065)*1.36+Math.max(size.x,size.z)*0.4;
  this.controls.target.copy(center);this.camera.position.copy(center).addScaledVector(dir,distance);this.camera.up.set(0,1,0);this.camera.lookAt(center);this.controls.update();
 }
 highlight(id,view='front',autoFocus=true){
  this.current=id;this.view=view;
  for(const t of this.anatomy.targets.values()){t.bones.forEach(m=>m.material=this.anatomy.boneMaterial);t.overlays.forEach(m=>m.visible=false);}
  const t=this.anatomy.targets.get(id);if(!t)throw Error('Unknown target '+id);
  t.bones.forEach(m=>m.material=this.anatomy.highlightMaterial);t.overlays.forEach(m=>m.visible=true);
  this.focused=autoFocus;this.frame(autoFocus?t.box:this.anatomy.allBox,view);
 }
 focus(){this.focused=true;this.frame(this.anatomy.targets.get(this.current).box,this.view);}
 whole(){this.focused=false;this.frame(this.anatomy.allBox,this.view);}
 setView(view){this.frame(this.focused&&this.current?this.anatomy.targets.get(this.current).box:this.anatomy.allBox,view);}
 setGhost(on){this.ghost=on;const m=this.anatomy.boneMaterial;m.transparent=on;m.opacity=on?0.19:1;m.depthWrite=!on;m.needsUpdate=true;}
 rotate(angle){const d=this.camera.position.clone().sub(this.controls.target);d.applyAxisAngle(new THREE.Vector3(0,1,0),angle);this.camera.position.copy(this.controls.target).add(d);this.controls.update();}
 zoom(factor){const d=this.camera.position.clone().sub(this.controls.target);d.multiplyScalar(factor);d.clampLength(this.controls.minDistance,this.controls.maxDistance);this.camera.position.copy(this.controls.target).add(d);this.controls.update();}
}
