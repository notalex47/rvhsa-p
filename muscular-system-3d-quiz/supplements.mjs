import * as THREE from './vendor/three.module.min.js';

// Original closed teaching meshes, placed in the BodyParts3D coordinate system.
// They are explicitly distinguished from the source anatomical surfaces.
function mesh(geometry,id,label){geometry.computeVertexNormals();geometry.computeBoundingBox();const m=new THREE.Mesh(geometry);m.name=id;m.userData={label,supplement:true};return m;}
function geometry(positions,indices){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);return g;}
function swept(rows,cross,normal,segments=64,sides=24,modulate=()=>1){
 const curve=new THREE.CatmullRomCurve3(rows.map(r=>new THREE.Vector3(...r.slice(0,3))));
 const widths=new THREE.CatmullRomCurve3(rows.map(r=>new THREE.Vector3(r[3],r[4],0)));
 const positions=[],indices=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=curve.getPoint(t),w=widths.getPoint(t);
  for(let j=0;j<sides;j++){
   const a=j/sides*Math.PI*2,v=p.clone().addScaledVector(cross,Math.cos(a)*Math.max(.0005,w.x)).addScaledVector(normal,Math.sin(a)*Math.max(.0005,w.y)*modulate(p.y));positions.push(...v.toArray());
  }
 }
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides,c=a+sides,d=b+sides;indices.push(a,c,b,b,c,d);}
 for(const [ring,t,reverse] of [[0,0,false],[segments,1,true]]){const n=positions.length/3;positions.push(...curve.getPoint(t).toArray());for(let j=0;j<sides;j++){const a=ring*sides+j,b=ring*sides+(j+1)%sides;indices.push(n,reverse?a:b,reverse?b:a);}}
 return geometry(positions,indices);
}
function ellipticalBand(cx,cy,cz,outerX,outerY,innerX,innerY,depth,segments=96){
 const p=[],ind=[];
 for(let layer=0;layer<2;layer++)for(let ring=0;ring<2;ring++)for(let i=0;i<segments;i++){
  const a=i/segments*Math.PI*2,rx=ring?outerX:innerX,ry=ring?outerY:innerY;
  p.push(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cz+(layer?depth:-depth));
 }
 const connect=(r1,r2)=>{for(let i=0;i<segments;i++){const j=(i+1)%segments,a=r1*segments+i,b=r1*segments+j,c=r2*segments+i,d=r2*segments+j;ind.push(a,c,b,b,c,d);}};
 connect(0,1);connect(3,2);connect(2,0);connect(1,3);
 return geometry(p,ind);
}
function latissimus(side){
 // Medial and lateral outlines follow the posterior rib cage into the axilla.
 const rows=[[.90,.008,.055,-.005,.020],[.97,.005,.108,-.013,.012],[1.06,.006,.142,-.015,.020],[1.145,.020,.166,-.009,.040],[1.215,.110,.181,.014,.066],[1.265,.174,.195,.055,.079]];
 const medial=new THREE.CatmullRomCurve3(rows.map(r=>new THREE.Vector3(side*r[1],r[0],r[3]))),lateral=new THREE.CatmullRomCurve3(rows.map(r=>new THREE.Vector3(side*r[2],r[0],r[4])));
 const p=[],ind=[],ny=60,nx=24;
 for(let layer=0;layer<2;layer++)for(let i=0;i<=ny;i++){
  const t=i/ny,a=medial.getPoint(t),b=lateral.getPoint(t);
  for(let j=0;j<=nx;j++){const u=j/nx,v=a.clone().lerp(b,u);v.z-=Math.sin(u*Math.PI)*.014+(layer?-.003:.003);p.push(...v.toArray());}
 }
 const stride=(ny+1)*(nx+1);
 for(let layer=0;layer<2;layer++)for(let i=0;i<ny;i++)for(let j=0;j<nx;j++){const a=layer*stride+i*(nx+1)+j,b=a+1,c=a+nx+1,d=c+1;ind.push(a,b,c,b,d,c);}
 const join=(a,b)=>ind.push(a,a+stride,b,b,a+stride,b+stride);
 for(let i=0;i<ny;i++){join(i*(nx+1),(i+1)*(nx+1));join(i*(nx+1)+nx,(i+1)*(nx+1)+nx);}
 for(let j=0;j<nx;j++){join(j,j+1);join(ny*(nx+1)+j,ny*(nx+1)+j+1);}
 return geometry(p,ind);
}
function scalpSheet(){
 const p=[],ind=[],nu=48,nv=48;
 // Ellipsoidal cap connecting the frontal and occipital bellies over the vault.
 for(let layer=0;layer<2;layer++)for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){
  const u=i/nu,v=j/nv,theta=-Math.PI*.36+u*Math.PI*.72,phi=.19+v*(Math.PI-.38);
  const x=.063*Math.sin(theta),y=1.563+(.089+layer*.0008)*Math.cos(theta)*Math.sin(phi),z=.104+(.082+layer*.0008)*Math.cos(phi);p.push(x,y,z);
 }
 const stride=(nu+1)*(nv+1);
 for(let layer=0;layer<2;layer++)for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=layer*stride+i*(nv+1)+j,b=a+1,c=a+nv+1;ind.push(a,b,c,b,c+1,c);}
 const join=(a,b)=>ind.push(a,b,a+stride,b,b+stride,a+stride);
 for(let i=0;i<nu;i++){join(i*(nv+1),(i+1)*(nv+1));join(i*(nv+1)+nv,(i+1)*(nv+1)+nv);}
 for(let j=0;j<nv;j++){join(j,j+1);join(nu*(nv+1)+j,nu*(nv+1)+j+1);}
 return geometry(p,ind);
}
export function createSupplements(bones=[]){
 const result=[],x=new THREE.Vector3(1,0,0),z=new THREE.Vector3(0,0,1);
 for(const side of [-1,1]){
  const word=side>0?'Left':'Right';
  result.push(mesh(swept([[side*.051,1.485,.137,.004,.002],[side*.072,1.515,.125,.025,.004],[side*.077,1.555,.108,.041,.005],[side*.064,1.593,.105,.032,.004],[side*.049,1.611,.105,.002,.001]],z,x),`supp-temporalis-${side}`,`${word} temporalis`));
  result.push(mesh(ellipticalBand(side*.032,1.527,.176,.026,.023,.016,.011,.002),`supp-oculi-${side}`,`${word} orbicularis oculi`));
  result.push(mesh(swept([[side*.015,1.557,.180,.010,.003],[side*.021,1.585,.175,.022,.003],[side*.022,1.610,.156,.025,.003],[side*.020,1.627,.139,.016,.002]],x,z),`supp-frontal-${side}`,`${word} frontal belly of occipitofrontalis`));
  result.push(mesh(swept([[side*.018,1.542,.019,.009,.002],[side*.025,1.560,.018,.018,.003],[side*.026,1.581,.025,.022,.003],[side*.020,1.600,.041,.014,.002]],x,z),`supp-occipital-${side}`,`${word} occipital belly of occipitofrontalis`));
  const intersections=y=>1-[.914,1.015,1.100,1.161].reduce((s,level)=>s+.48*Math.exp(-(((y-level)/.004)**2)),0);
  result.push(mesh(swept([[side*.014,.805,.144,.006,.002],[side*.024,.86,.179,.019,.005],[side*.027,.94,.211,.024,.008],[side*.029,1.04,.225,.028,.009],[side*.034,1.13,.224,.031,.008],[side*.039,1.196,.207,.030,.004]],x,z,80,24,intersections),`supp-rectus-${side}`,`${word} rectus abdominis`));
  result.push(mesh(latissimus(side),`supp-latissimus-${side}`,`${word} latissimus dorsi`));
 }
 result.push(mesh(ellipticalBand(0,1.456,.193,.028,.017,.019,.008,.002), 'supp-peripheralis','Pars peripheralis of orbicularis oris'));
 const scalp=mesh(scalpSheet(),'supp-galea','Epicranial aponeurosis of occipitofrontalis');scalp.userData.aponeurosis=true;result.push(scalp);
 // Fit the scalp sheet and bellies to the source skull instead of using a
 // detached ellipsoid. Each radial sample finds the outermost skull surface.
 const skull=bones.filter(m=>/frontal bone|parietal bone|occipital bone|temporal bone/i.test(m.userData.label||''));
 if(skull.length){
  const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
  const surfaces=skull.map(m=>{const copy=new THREE.Mesh(m.geometry,material);copy.updateMatrixWorld();return copy;});
  const center=new THREE.Vector3(0,1.558,.102),ray=new THREE.Raycaster(),point=new THREE.Vector3();
  for(const m of result.filter(m=>/supp-(frontal|occipital|galea)/.test(m.name))){
   const position=m.geometry.attributes.position;
   for(let i=0;i<position.count;i++){
    point.fromBufferAttribute(position,i);const direction=point.clone().sub(center).normalize();ray.set(center,direction);ray.far=.14;
    const hits=ray.intersectObjects(surfaces,false);if(!hits.length)continue;
    const distance=hits.at(-1).distance;
    // Preserve a thin surface relief for the belly and its back face.
    const offset=m.userData.aponeurosis?.0015:.0025+Math.min(.003,Math.max(0,point.distanceTo(center)-distance));
    point.copy(center).addScaledVector(direction,distance+offset);position.setXYZ(i,point.x,point.y,point.z);
   }
   position.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingBox();
  }
  material.dispose();
 }
 return result;
}
