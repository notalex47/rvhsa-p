// Quiz data and answer checking are separate from the viewer.
const q = (id, answer, region, note, aliases = [], view = 'front') => ({id, answer, region, note, aliases, view});
export const QUESTIONS = [
 q('frontal','Frontal bone','Skull','The frontal bone forms the forehead and the roofs of the eye sockets. It helps protect the front of the brain.',['frontal']),
 q('orbit','Orbit','Skull','The orbit is the bony eye socket. Several skull bones form its walls, which protect the eye and contain its muscles.',['eye socket','eye sockets','orbital cavity','orbital socket','orbits']),
 q('cervical','Cervical vertebrae','Spine','Seven cervical vertebrae form the neck. They support the head, protect the spinal cord, and allow neck movement.',['cervical vertebra','cervical spine','neck vertebrae','c1 c7']),
 q('costal','Costal cartilage','Thorax','Costal cartilage links ribs to the front of the thoracic cage and adds flexibility for breathing. It is cartilage, not bone.',['costal cartilages','rib cartilage']),
 q('trueRibs','True ribs','Thorax','Rib pairs 1–7 are true ribs. Each connects directly to the sternum through its own costal cartilage.',['true rib','ribs 1 7','vertebrosternal ribs']),
 q('thoracic','Thoracic vertebrae','Spine','The twelve thoracic vertebrae occupy the upper and middle back. They articulate with the ribs and help support the chest.',['thoracic vertebra','thoracid vertebrae','thoracic spine','t1 t12'],'back'),
 q('transverse','Transverse process','Spine','A transverse process projects sideways from a vertebra. These projections provide attachment sites for muscles and ligaments.',['transverse processes','vertebral transverse process'],'back'),
 q('lumbar','Lumbar vertebrae','Spine','The five lumbar vertebrae form the lower back. Their large bodies carry much of the weight of the upper body.',['lumbar vertebra','lumbar spine','l1 l5'],'back'),
 q('ilium','Ilium','Pelvis','The ilium is the broad upper part of each hip bone. Its crest and surfaces provide attachment sites for trunk and hip muscles.',['ilia','iliac bone']),
 q('sacrum','Sacrum','Spine','The sacrum consists of five fused vertebrae. It joins the hip bones and transfers weight from the spine into the pelvis.',[],'back'),
 q('coccyx','Coccyx','Spine','The coccyx, or tailbone, lies below the sacrum. It provides attachment sites for pelvic floor muscles and ligaments.',['tailbone','coccyz','coccygeal bone'],'back'),
 q('ischium','Ischium','Pelvis','The ischium forms the lower back part of the hip bone. Its ischial tuberosity bears weight when you sit.',['ischia','ischial bone'],'back'),
 q('pubis','Pubic bone','Pelvis','The pubis forms the front part of the hip bone. The left and right pubic bones meet at the pubic symphysis.',['pubis','pubic bones','pubes']),
 q('symphysis','Pubic symphysis','Pelvis','The pubic symphysis is the fibrocartilaginous joint between the two pubic bones. It allows limited movement while stabilizing the pelvis.',['symphysis pubis','pubic synthesis','pubic symphisis']),
 q('tarsals','Tarsals','Legs & feet','Seven tarsal bones form the ankle and back of each foot. They include the talus and calcaneus.',['tarsal bones','tarsal']),
 q('metatarsals','Metatarsals','Legs & feet','The five metatarsals lie between the tarsals and toe bones. They help form the foot’s arches and support walking.',['metatarsal bones','metatarsal']),
 q('toePhalanges','Phalanges (toes)','Legs & feet','Toe phalanges help with balance and push-off during walking. The big toe has two; each other toe has three.',['toe phalanges','phalanges of the toes','phalanges of the foot','foot phalanges','toe bones','phalanges','phalanx']),
 q('talus','Talus','Legs & feet','The talus sits above the calcaneus and below the tibia. It transfers body weight from the leg into the foot.',['tali','talus bone']),
 q('fibula','Fibula','Legs & feet','The fibula is the slender bone on the outer side of the lower leg. It provides muscle attachments and helps stabilize the ankle.',['fibulae','fibular bone']),
 q('tibia','Tibia','Legs & feet','The tibia is the large, medial shin bone. It bears most of the weight transmitted through the lower leg.',['tibiae','shin bone','shinbone']),
 q('patella','Patella','Legs & feet','The patella is the kneecap, embedded in the quadriceps tendon. It improves the muscle’s leverage when straightening the knee.',['patellae','kneecap','knee cap']),
 q('femur','Femur','Legs & feet','The femur is the thigh bone. It connects the hip to the knee and bears substantial weight during standing and movement.',['femora','thigh bone','thighbone']),
 q('handPhalanges','Phalanges (hands)','Shoulders, arms & hands','Finger phalanges enable grasping and fine movements. The thumb has two phalanges; each other finger has three.',['hand phalanges','finger phalanges','phalanges of the hand','phalanges of the fingers','finger bones','phalanges','phalanx']),
 q('metacarpals','Metacarpals','Shoulders, arms & hands','Five metacarpals form the palm between the wrist and fingers. Their distal heads form the knuckles.',['metacarpal bones','metacarpal']),
 q('ulna','Ulna','Shoulders, arms & hands','The ulna lies on the little-finger side of the forearm in anatomical position. Its upper end forms the elbow’s bony tip.',['ulnae','ulnar bone']),
 q('radius','Radius','Shoulders, arms & hands','The radius lies on the thumb side of the forearm in anatomical position. It contributes to the wrist and rotates around the ulna.',['radii','radial bone']),
 q('falseRibs','False ribs','Thorax','Rib pairs 8–12 are false ribs because they do not attach directly to the sternum. Ribs 8–10 connect indirectly through cartilage; ribs 11–12 are the floating subset.',['false rib','ribs 8 12']),
 q('floatingRibs','Floating ribs','Thorax','Rib pairs 11–12 are floating ribs. They attach to thoracic vertebrae but have no anterior attachment to the sternum.',['floating rib','ribs 11 12','vertebral ribs'],'back'),
 q('humerus','Humerus','Shoulders, arms & hands','The humerus is the upper-arm bone. It joins the scapula at the shoulder and the radius and ulna at the elbow.',['humeri','humerous','humurous','upper arm bone']),
 q('sternum','Sternum','Thorax','The sternum, or breastbone, lies at the front of the chest. It anchors costal cartilages and helps protect the heart.',['breastbone','breast bone']),
 q('clavicle','Clavicle','Shoulders, arms & hands','The clavicle, or collarbone, connects the sternum to the scapula. It acts as a strut that holds the shoulder away from the chest.',['clavicles','collarbone','collar bone']),
 q('mandible','Mandible','Skull','The mandible is the lower jaw. It holds the lower teeth and moves at the temporomandibular joints during chewing and speech.',['lower jaw','jawbone','mandibular bone']),
 q('teeth','Teeth','Skull','Teeth cut and grind food. They sit in sockets in the maxilla and mandible; teeth are mineralized organs, not bones.',['tooth','dentition']),
 q('nasalAperture','Anterior nasal aperture','Skull','The anterior nasal aperture is the pear-shaped opening at the front of the bony nasal cavity, bordered by the nasal bones and maxillae.',['nasal aperture','piriform aperture','pyriform aperture','anterior nasal opening']),
 q('parietal','Parietal bone','Skull','The paired parietal bones form much of the top and sides of the skull and protect the brain.',['parietal','parietal bones'],'side'),
 q('occipital','Occipital bone','Skull','The occipital bone forms the back and base of the skull. Its foramen magnum allows passage between the brainstem and spinal cord.',['occipital'],'back'),
 q('axis','Axis (C2)','Spine','The axis is the second cervical vertebra. Its upward dens acts as a pivot for rotation of the atlas and head.',['axis','axis bone','c2','second cervical vertebra','second cervical vertebrae'],'back'),
 q('acromion','Acromion process','Shoulders, arms & hands','The acromion extends from the scapular spine over the shoulder joint. It articulates with the clavicle at the acromioclavicular joint.',['acromion','acromial process'],'back'),
 q('calcaneus','Calcaneus','Legs & feet','The calcaneus is the heel bone, beneath the talus. It bears weight and anchors the Achilles tendon.',['calcanei','heel bone','calcaneal bone'],'side'),
 q('atlas','Atlas (C1)','Spine','The atlas is the first cervical vertebra. It supports the skull and allows the nodding motion used to signal “yes.”',['atlas','atlas bone','c1','first cervical vertebra','first cervical vertebrae'],'back'),
 q('scapula','Scapula','Shoulders, arms & hands','The scapula, or shoulder blade, lies on the upper back. Its glenoid cavity forms the socket of the shoulder joint.',['scapulae','scapulas','shoulder blade'],'back'),
 q('femoralCondyle','Femoral condyle','Legs & feet','The medial and lateral femoral condyles are rounded surfaces at the lower end of the femur. They articulate with the tibia at the knee.',['femoral condyles','condyle of femur','condyles of femur','medial femoral condyle','lateral femoral condyle'],'back')
];
export const REGIONS = [...new Set(QUESTIONS.map(x=>x.region))];
export function shuffle(input, random = Math.random) {
 const a=[...input]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}
export function makeChoices(question, random=Math.random) {
 const others=shuffle(QUESTIONS.filter(x=>x.id!==question.id),random).slice(0,3);
 return shuffle([question,...others],random);
}
export function normalize(text) {
 return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
export function isCorrect(question,text) {
 return [question.answer,...question.aliases].some(a=>normalize(a)===normalize(text));
}
export class Quiz {
 constructor(mode,questions=QUESTIONS){this.mode=mode;this.deck=shuffle(questions);this.index=0;this.records=[];this.answered=false;}
 get current(){return this.deck[this.index];}
 get score(){return this.records.filter(r=>r.correct).length;}
 get missed(){return this.records.filter(r=>!r.correct).map(r=>r.question);}
 answer(text,skip=false){if(this.answered||!this.current)return null;this.answered=true;const r={question:this.current,provided:text,correct:!skip&&isCorrect(this.current,text),skipped:skip};this.records.push(r);return r;}
 next(){if(!this.answered)return false;this.index++;this.answered=false;return this.index<this.deck.length;}
}
