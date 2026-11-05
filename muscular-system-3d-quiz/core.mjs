// Every entry is one complete quiz target, regardless of its number of heads.
const q=(id,answer,region,note,aliases=[],view='front')=>({id,answer,region,note,aliases,view});
export const QUESTIONS=[
 q('temporalis','Temporalis','Head & neck','This fan-shaped chewing muscle covers the temporal fossa on the side of the skull. It elevates the mandible, and its posterior fibers help retract the jaw.',['temporal muscle'],'side'),
 q('orbicularisOculi','Orbicularis oculi','Head & neck','Orbicularis oculi surrounds each eye. Its eyelid portion gently closes the eyelids, while its orbital portion closes them tightly.',['orbicularis oculi muscle']),
 q('parsPeripheralis','Pars peripheralis','Head & neck','The pars peripheralis is the peripheral portion of orbicularis oris in the cutaneous lips, outside the marginal portion at the lip edge. It helps position and shape the lips during facial expression and speech.',['pars peripheralis of orbicularis oris','orbicularis oris pars peripheralis','peripheral part of orbicularis oris','orbicularis oris peripheral part']),
 q('pectoralisMajor','Pectoralis major','Trunk','Pectoralis major is the large superficial chest muscle. Its clavicular, sternocostal, and abdominal portions act together to adduct and medially rotate the arm; the clavicular portion also helps flex it.',['pec major','pectoralis major muscle']),
 q('deltoid','Deltoid','Shoulders & arms','The deltoid forms the rounded shoulder. Its middle fibers abduct the arm, its anterior fibers help flex and medially rotate it, and its posterior fibers help extend and laterally rotate it.',['deltoids']),
 q('bicepsBrachii','Biceps brachii','Shoulders & arms','Both heads of biceps brachii lie in the anterior arm. It flexes the elbow and strongly supinates the forearm, turning the palm forward or upward.',['biceps','bicep brachii','bicep']),
 q('rectusAbdominis','Rectus abdominis','Trunk','Rectus abdominis runs vertically from the pubis to the xiphoid process and costal cartilages 5–7. It flexes the trunk and compresses the abdomen. Tendinous intersections divide its visible bellies.',['rectus abdominalis','abdominal rectus']),
 q('externalOblique','Abdominal external oblique','Trunk','The external oblique covers the sides of the abdomen. Its fibers generally run downward and medially. It compresses the abdomen and helps flex the trunk and rotate it toward the opposite side.',['external oblique','external abdominal oblique','abdominal external oblique muscle']),
 q('sartorius','Sartorius','Hips & thighs','Sartorius is the long strap crossing the anterior thigh from the anterior superior iliac spine to the medial proximal tibia. It flexes, abducts, and laterally rotates the hip and flexes the knee.',['surtorius','sartorius muscle']),
 q('occipitofrontalis','Occipitofrontalis','Head & neck','Occipitofrontalis has frontal and occipital bellies joined by the epicranial aponeurosis. The frontal bellies raise the eyebrows and wrinkle the forehead; the occipital bellies draw the scalp backward.',['occipito frontalis','epicranius']),
 q('sternocleidomastoid','Sternocleidomastoid','Head & neck','Sternocleidomastoid runs from the sternum and clavicle to the mastoid process. One side turns the face toward the opposite side; both sides help flex the neck.',['scm','sterno cleido mastoid']),
 q('brachioradialis','Brachioradialis','Shoulders & arms','Brachioradialis lies along the lateral forearm from the humerus to the distal radius. It flexes the elbow most effectively with the forearm in the neutral, thumb-up position.',['brachio radialis']),
 q('tensorFasciaeLatae','Tensor fasciae latae','Hips & thighs','This short muscle lies at the anterolateral hip. It tenses the iliotibial tract, helps stabilize the pelvis and knee, and assists hip flexion, abduction, and medial rotation.',['tensor fascia lata','tensor fascia latae','tensor fasciae lata','tfl'],'side'),
 q('rectusFemoris','Rectus femoris','Hips & thighs','Rectus femoris is the superficial central quadriceps muscle. It crosses both the hip and knee, so it flexes the hip as well as extending the knee.',['rectus femoris muscle']),
 q('vastusLateralis','Vastus lateralis','Hips & thighs','Vastus lateralis occupies the lateral thigh. As part of the quadriceps femoris, it extends the knee through the quadriceps tendon, patella, and patellar ligament.',[],'front'),
 q('vastusMedialis','Vastus medialis','Hips & thighs','Vastus medialis lies on the medial thigh and has a prominent teardrop-shaped distal part. It extends the knee and helps stabilize the patella.',['vastus medialis obliquus']),
 q('tibialisAnterior','Tibialis anterior','Lower legs','Tibialis anterior runs along the front and lateral side of the tibia. It dorsiflexes the ankle and inverts the foot, helping clear the toes during walking.',['anterior tibialis']),
 q('gluteusMaximus','Gluteus maximus','Hips & thighs','Gluteus maximus forms much of the buttock. It powerfully extends and laterally rotates the hip, especially when rising from a chair or climbing stairs.',['glute max'],'back'),
 q('bicepsFemoris','Biceps femoris','Hips & thighs','Biceps femoris is the lateral hamstring, with long and short heads. Both flex the knee and laterally rotate the flexed leg; the long head also extends the hip.',['biceps femoris muscle'],'back'),
 q('semitendinosus','Semitendinosus','Hips & thighs','Semitendinosus is a medial hamstring with a long distal tendon. It extends the hip, flexes the knee, and medially rotates the leg when the knee is flexed.',['semi tendinosus'],'back'),
 q('trapezius','Trapezius','Trunk','Trapezius spans the posterior neck and upper back. Its upper, middle, and lower fibers help elevate, retract, depress, and upwardly rotate the scapula.',['traps'],'back'),
 q('tricepsBrachii','Triceps brachii','Shoulders & arms','Triceps brachii has long, lateral, and medial heads on the posterior arm. All extend the elbow; the long head also helps extend and adduct the arm at the shoulder.',['triceps','tricep brachii','tricep'],'back'),
 q('latissimusDorsi','Latissimus dorsi','Trunk','Latissimus dorsi is the broad muscle of the lower and lateral back. It extends, adducts, and medially rotates the humerus, as in pulling the body upward.',['lats','latissimus'],'back'),
 q('gluteusMedius','Gluteus medius','Hips & thighs','Gluteus medius lies on the lateral surface of the ilium, partly deep to gluteus maximus. It abducts the hip and holds the pelvis level while standing on one leg.',['glute med'],'side'),
 q('gastrocnemius','Gastrocnemius','Lower legs','The medial and lateral heads of gastrocnemius form the superficial calf. It plantarflexes the ankle and helps flex the knee. Its tendon joins the calcaneal (Achilles) tendon.',['gastroc','gastrocnemius muscle'],'back')
];
export const REGIONS=[...new Set(QUESTIONS.map(q=>q.region))];
export function shuffle(input, random = Math.random) {
 const a=[...input]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}
export function makeChoices(question, random=Math.random) {
 const others=shuffle(QUESTIONS.filter(x=>x.id!==question.id),random).slice(0,3);
 return shuffle([question,...others],random);
}
export function normalize(text) {
 return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ').replace(/^(the|a|an) /,'');
}
export function isCorrect(question,text) {
 let input=normalize(text);
 input=input.replace(/^(left|right) /,'');
 return [question.answer,...question.aliases].some(a=>normalize(a)===input);
}
export class Quiz {
 constructor(mode,questions=QUESTIONS){this.mode=mode;this.deck=shuffle(questions);this.index=0;this.records=[];this.answered=false;}
 get current(){return this.deck[this.index];}
 get score(){return this.records.filter(r=>r.correct).length;}
 get missed(){return this.records.filter(r=>!r.correct).map(r=>r.question);}
 answer(text,skip=false){if(this.answered||!this.current)return null;this.answered=true;const r={question:this.current,provided:text,correct:!skip&&isCorrect(this.current,text),skipped:skip};this.records.push(r);return r;}
 next(){if(!this.answered)return false;this.index++;this.answered=false;return this.index<this.deck.length;}
}

export function serializeSession(quiz,choices=[]) {
 return {
  schema:1,mode:quiz.mode,deck:quiz.deck.map(q=>q.id),index:quiz.index,
  answered:quiz.answered,
  records:quiz.records.map(r=>({id:r.question.id,provided:r.provided,skipped:r.skipped})),
  choices:choices.map(q=>q.id)
 };
}

// Restore the exact deck and existing choices. Do not call shuffle/makeChoices
// here: refreshing a page must not change an unanswered question's choices.
export function restoreSession(data) {
 try {
  if(!data||data.schema!==1||!['mc','free'].includes(data.mode))return null;
  const byId=new Map(QUESTIONS.map(q=>[q.id,q]));
  if(!Array.isArray(data.deck)||!data.deck.length||data.deck.length>QUESTIONS.length||new Set(data.deck).size!==data.deck.length||data.deck.some(id=>!byId.has(id)))return null;
  if(!Number.isInteger(data.index)||data.index<0||data.index>=data.deck.length||typeof data.answered!=='boolean')return null;
  if(!Array.isArray(data.records)||data.records.length!==data.index+(data.answered?1:0))return null;
  const quiz=Object.create(Quiz.prototype);quiz.mode=data.mode;quiz.deck=data.deck.map(id=>byId.get(id));quiz.index=data.index;quiz.answered=data.answered;
  quiz.records=data.records.map((r,i)=>{
   if(r.id!==quiz.deck[i].id||typeof r.provided!=='string'||r.provided.length>100||typeof r.skipped!=='boolean')throw Error('Invalid saved answer');
   return {question:quiz.deck[i],provided:r.provided,skipped:r.skipped,correct:!r.skipped&&isCorrect(quiz.deck[i],r.provided)};
  });
  if(!Array.isArray(data.choices))return null;
  if(data.mode==='mc'&&(data.choices.length!==4||new Set(data.choices).size!==4||!data.choices.includes(quiz.current.id)||data.choices.some(id=>!byId.has(id))))return null;
  if(data.mode==='free'&&data.choices.length)return null;
  return {quiz,choices:data.choices.map(id=>byId.get(id))};
 } catch {return null;}
}
