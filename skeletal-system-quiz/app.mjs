import {QUESTIONS,REGIONS,makeChoices,Quiz,serializeSession,restoreSession} from './core.mjs?v=1.3.2';
import {decodeModel,buildAnatomy,Viewer} from './model.mjs?v=1.3.2';
const $=id=>document.getElementById(id);
const screens={menu:$('menuScreen'),quiz:$('quizScreen'),results:$('resultsScreen')};
let viewer=null,quiz=null,lastPool=QUESTIONS,lastMode='mc',currentChoices=[];
const SESSION_KEY='rvhs-skeletal-session-v1',PREFS_KEY='rvhs-skeletal-preferences-v1';
function readLocal(key){try {return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
function writeLocal(key,data){try {localStorage.setItem(key,JSON.stringify(data));return true;}catch{$('storageStatus').textContent='Progress saving is unavailable in this browser. You can still use the quiz normally.';return false;}}
function removeLocal(key){try {localStorage.removeItem(key);}catch{}}
const preferences=readLocal(PREFS_KEY);
if(preferences&&typeof preferences==='object'){
 if(typeof preferences.remember==='boolean')$('rememberProgress').checked=preferences.remember;
 if(typeof preferences.autoFocus==='boolean')$('autoFocus').checked=preferences.autoFocus;
 if(typeof preferences.ghost==='boolean')$('ghostToggle').checked=preferences.ghost;
}
function savePreferences(){writeLocal(PREFS_KEY,{remember:$('rememberProgress').checked,autoFocus:$('autoFocus').checked,ghost:$('ghostToggle').checked});}
function refreshSavedSession(){
 const saved=$('rememberProgress').checked?restoreSession(readLocal(SESSION_KEY)):null;
 $('savedSession').hidden=!saved;$('resumeButton').disabled=!saved||!viewer;
 if(saved)$('savedSummary').textContent='Saved '+(saved.quiz.mode==='mc'?'multiple-choice':'free-response')+' quiz · question '+(saved.quiz.index+1)+' of '+saved.quiz.deck.length+' · '+saved.quiz.score+' correct';
}
function saveSession(){if(quiz&&quiz.current&&$('rememberProgress').checked)writeLocal(SESSION_KEY,serializeSession(quiz,currentChoices));refreshSavedSession();}
function clearSavedSession(){removeLocal(SESSION_KEY);refreshSavedSession();}
const labels={front:'Front view',back:'Back view',side:'Left-side view',otherSide:'Right-side view'};
const noteFor=id=>({falseRibs:'The orange group includes ribs 8–12. Floating ribs 11–12 are included here and also have their own question.',orbit:'The orange outlines mark the bony eye sockets; the orbit is a space formed by several bones.',nasalAperture:'The orange outline marks the opening, rather than a separate bone.',coccyx:'This small structure is represented by a simplified model supplement.',symphysis:'This cartilage joint is represented by a simplified model supplement.',ilium:'This highlight shows the upper region of the fused adult hip bone.',ischium:'This highlight shows the lower posterior region of the fused adult hip bone.',pubis:'This highlight shows the anterior region of the fused adult hip bone.',transverse:'A pair of transverse processes on a lumbar vertebra is shown as an example.',femoralCondyle:'The distal rounded knee surfaces are highlighted, rather than the whole femur.',acromion:'Only the projecting acromion region is highlighted, rather than the whole scapula.'}[id]||'');
for(const region of REGIONS){const option=document.createElement('option');option.value=region;option.textContent=region+' · '+QUESTIONS.filter(q=>q.region===region).length+' structures';$('regionSelect').append(option);}
function show(screen){for(const [name,element] of Object.entries(screens))element.hidden=name!==screen;$('scoreChip').hidden=screen==='menu';$('backToQuestion').hidden=screen!=='quiz';}
function setView(view){viewer.setView(view);$('orientation').textContent=labels[view];}
function showMenu(){saveSession();show('menu');quiz=null;currentChoices=[];for(const t of viewer.anatomy.targets.values()){t.bones.forEach(m=>m.material=viewer.anatomy.boneMaterial);t.overlays.forEach(m=>m.visible=false);}viewer.current=null;viewer.whole();$('focusButton').disabled=true;$('targetHint').textContent='Explore the model';refreshSavedSession();$('modeHeading').setAttribute('tabindex','-1');$('modeHeading').focus({preventScroll:true});}
function start(mode,pool=null){
 if(!viewer)return;lastMode=mode;lastPool=pool||QUESTIONS.filter(q=>$('regionSelect').value==='all'||q.region===$('regionSelect').value);quiz=new Quiz(mode,lastPool);show('quiz');renderQuestion();
}
function renderQuestion(savedChoices=null){
 const q=quiz.current;$('questionCount').textContent='Question '+(quiz.index+1)+' of '+quiz.deck.length;$('modeLabel').textContent=quiz.mode==='mc'?'Multiple choice':'Free response';$('progressBar').max=quiz.deck.length;$('progressBar').value=quiz.index;$('scoreChip').textContent=quiz.score+' / '+quiz.records.length+' correct';
 $('feedback').hidden=true;$('factBox').hidden=true;$('landmarkNote').hidden=true;$('nextButton').disabled=true;$('nextButton').textContent=quiz.index===quiz.deck.length-1?'See results →':'Next question →';$('skipButton').disabled=false;
 $('choices').replaceChildren();$('choices').hidden=quiz.mode!=='mc';$('freeForm').hidden=quiz.mode!=='free';$('freeAnswer').disabled=false;$('submitButton').disabled=false;$('freeAnswer').value='';
 currentChoices=quiz.mode==='mc'?(savedChoices||makeChoices(q)):[];
 if(quiz.mode==='mc')currentChoices.forEach((choice,i)=>{const button=document.createElement('button');button.type='button';button.className='answer-button';button.dataset.answer=choice.answer;const n=document.createElement('span');n.className='choice-number';n.textContent=i+1;const label=document.createElement('span');label.textContent=choice.answer;button.append(n,label);button.addEventListener('click',()=>answer(choice.answer));$('choices').append(button);});
 viewer.highlight(q.id,q.view,$('autoFocus').checked);$('focusButton').disabled=false;$('orientation').textContent=labels[q.view];$('targetHint').textContent='Orange = the structure to identify';
 saveSession();
 if(quiz.mode==='free'&&!quiz.answered)$('freeAnswer').focus({preventScroll:true});
}
function answer(text,skip=false){
 if(!quiz||quiz.answered)return;
 if(!skip&&!String(text).trim()){$('feedback').hidden=false;$('feedback').className='feedback wrong';$('feedback').textContent='Type a structure name, or choose “I don’t know.”';$('freeAnswer').focus({preventScroll:true});return;}
 const record=quiz.answer(text,skip);if(!record)return;presentAnswer(record);saveSession();
}
function presentAnswer(record){
 const q=record.question,text=record.provided,skip=record.skipped;
 $('feedback').className='feedback '+(record.correct?'correct':'wrong');$('feedback').textContent=record.correct?'✓ Correct — '+q.answer+'.':(skip?'Answer: ':'✕ The correct answer is ')+q.answer+'.';$('feedback').hidden=false;
 if(!record.correct&&!skip){const provided=document.createElement('span');provided.className='user-answer';provided.textContent='Your answer: '+text;$('feedback').append(provided);}
 $('factTitle').textContent=q.answer;$('factText').textContent=q.note;const extra=noteFor(q.id);$('landmarkNote').textContent=extra;$('landmarkNote').hidden=!extra;$('factBox').hidden=false;
 for(const button of $('choices').querySelectorAll('button')){button.disabled=true;if(button.dataset.answer===q.answer)button.classList.add('correct');else if(button.dataset.answer===text&&!record.correct)button.classList.add('wrong');else button.classList.add('faded');}
 $('freeAnswer').disabled=true;$('submitButton').disabled=true;$('skipButton').disabled=true;$('nextButton').disabled=false;$('scoreChip').textContent=quiz.score+' / '+quiz.records.length+' correct';$('progressBar').value=quiz.records.length;$('nextButton').focus({preventScroll:true});
}
function next(){if(!quiz||!quiz.answered)return;if(quiz.next())renderQuestion();else showResults();}
function resume(){
 const saved=restoreSession(readLocal(SESSION_KEY));if(!saved||!viewer){refreshSavedSession();return;}
 quiz=saved.quiz;lastMode=quiz.mode;lastPool=[...quiz.deck];
 const regions=new Set(quiz.deck.map(q=>q.region));$('regionSelect').value=regions.size===1?[...regions][0]:'all';
 show('quiz');renderQuestion(saved.choices);
 if(quiz.answered){const record=quiz.records.at(-1);$('freeAnswer').value=record.provided;presentAnswer(record);}
}
function showResults(){
 clearSavedSession();show('results');const percent=Math.round(100*quiz.score/quiz.deck.length);$('percentScore').textContent=percent+'%';$('rawScore').textContent=quiz.score+' of '+quiz.deck.length+' correct';$('resultSummary').textContent=quiz.missed.length?'Review the '+quiz.missed.length+' missed structures below, or practice them in a fresh round.':'You identified every structure in this round. Try a new shuffle or switch answer modes.';$('missedButton').hidden=!quiz.missed.length;$('reviewHeading').textContent=quiz.missed.length?'Missed structures':'All structures identified';$('reviewList').replaceChildren();
 for(const q of quiz.missed){const card=document.createElement('article');card.className='review-item';const title=document.createElement('h4');title.textContent=q.answer;const p=document.createElement('p');p.textContent=q.note;const record=quiz.records.find(r=>r.question.id===q.id);if(record&&!record.skipped)p.textContent+=' Your answer: '+record.provided;const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent='Show on skeleton';button.addEventListener('click',()=>{viewer.highlight(q.id,q.view,true);$('focusButton').disabled=false;$('targetHint').textContent=q.answer;$('orientation').textContent=labels[q.view];if(innerWidth<720)$('viewer').scrollIntoView({behavior:scrollBehavior(),block:'center'});});card.append(title,p,button);$('reviewList').append(card);}
 $('scoreChip').textContent=quiz.score+' / '+quiz.deck.length+' correct';$('resultsHeading').setAttribute('tabindex','-1');$('resultsHeading').focus({preventScroll:true});
}
$('mcModeButton').addEventListener('click',()=>start('mc'));$('freeModeButton').addEventListener('click',()=>start('free'));
$('resumeButton').addEventListener('click',resume);$('clearSavedButton').addEventListener('click',clearSavedSession);
$('rememberProgress').addEventListener('change',()=>{savePreferences();if($('rememberProgress').checked)saveSession();else clearSavedSession();refreshSavedSession();});
$('autoFocus').addEventListener('change',savePreferences);
const scrollBehavior=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
$('jumpToModel').addEventListener('click',()=>$('viewer').scrollIntoView({behavior:scrollBehavior(),block:'center'}));
$('backToQuestion').addEventListener('click',()=>{$('quizScreen').scrollIntoView({behavior:scrollBehavior(),block:'start'});if(quiz?.mode==='free'&&!quiz.answered)$('freeAnswer').focus({preventScroll:true});else $('questionTitle').focus({preventScroll:true});});
$('freeForm').addEventListener('submit',event=>{event.preventDefault();answer($('freeAnswer').value);});$('skipButton').addEventListener('click',()=>answer('',true));$('nextButton').addEventListener('click',next);$('changeMode').addEventListener('click',showMenu);$('menuButton').addEventListener('click',showMenu);$('retryButton').addEventListener('click',()=>start(lastMode,lastPool));$('missedButton').addEventListener('click',()=>start(lastMode,quiz.missed));
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>setView(button.dataset.view));
$('focusButton').addEventListener('click',()=>{if(viewer.current)viewer.focus();});$('wholeButton').addEventListener('click',()=>viewer.whole());$('resetView').addEventListener('click',()=>{viewer.reset();$('ghostToggle').checked=false;$('orientation').textContent=labels[viewer.view||'front'];savePreferences();});$('rotateLeft').addEventListener('click',()=>{viewer.rotate(-Math.PI/8);$('orientation').textContent='Rotated view';});$('rotateRight').addEventListener('click',()=>{viewer.rotate(Math.PI/8);$('orientation').textContent='Rotated view';});$('zoomIn').addEventListener('click',()=>viewer.zoom(.8));$('zoomOut').addEventListener('click',()=>viewer.zoom(1.25));$('ghostToggle').addEventListener('change',()=>{viewer.setGhost($('ghostToggle').checked);savePreferences();});
$('viewer').addEventListener('keydown',event=>{if(!viewer)return;if(['ArrowLeft','ArrowRight','+','=','-'].includes(event.key))event.preventDefault();if(event.key==='ArrowLeft')viewer.rotate(-Math.PI/12);if(event.key==='ArrowRight')viewer.rotate(Math.PI/12);if(event.key==='+'||event.key==='=')viewer.zoom(.85);if(event.key==='-')viewer.zoom(1.18);});
document.addEventListener('keydown',event=>{if(!quiz||screens.quiz.hidden||event.repeat)return;if(event.target.matches('input,select,textarea'))return;if(quiz.answered&&event.key==='Enter'){event.preventDefault();next();}else if(quiz.mode==='mc'&&!quiz.answered&&/^[1-4]$/.test(event.key)){event.preventDefault();$('choices').querySelectorAll('button')[Number(event.key)-1]?.click();}});
function showLoadError(message){$('loadMessage').hidden=false;$('loadMessage').className='load-message error';$('loadMessage').textContent=message;document.querySelectorAll('.viewer-controls button,.viewer-controls input,#mcModeButton,#freeModeButton').forEach(b=>b.disabled=true);}
$('viewer').addEventListener('viewerError',event=>showLoadError(event.detail));
refreshSavedSession();
try {
 const [mr,br]=await Promise.all([fetch(new URL('skeleton.json',import.meta.url)),fetch(new URL('skeleton.bin',import.meta.url))]);if(!mr.ok||!br.ok)throw Error('Model files could not be loaded.');
 const [manifest,buffer]=await Promise.all([mr.json(),br.arrayBuffer()]);const anatomy=buildAnatomy(decodeModel(manifest,buffer));
 for(const q of QUESTIONS)if(!anatomy.targets.has(q.id))throw Error('A target is missing from the skeleton.');
 viewer=new Viewer($('viewer'),anatomy);viewer.setGhost($('ghostToggle').checked);$('loadMessage').hidden=true;document.querySelectorAll('.viewer-controls button,.viewer-controls input,#mcModeButton,#freeModeButton').forEach(b=>b.disabled=false);$('focusButton').disabled=true;refreshSavedSession();
} catch(error){console.error(error);showLoadError(location.protocol==='file:'?'Open this quiz through GitHub Pages or a local web server. See README.txt in the download for local preview instructions.':'The 3D skeleton could not load. Refresh the page and check that WebGL is enabled and all quiz files were uploaded.');}
