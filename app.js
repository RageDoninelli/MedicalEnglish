'use strict';
const KEY='viva-medical-english-lab-v1';
const sections=[['vocab','Clinical vocabulary'],['listening','Listening lab'],['dialogue','Patient interview'],['practice','Clinical challenges'],['exam','Unit assessment']];
const words=[
 ['complaint','The main problem a patient reports','What brings you in today?'],
 ['symptom','A change or problem a patient experiences','What symptoms have you noticed?'],
 ['onset','The time a symptom began','When did the pain start?'],
 ['duration','How long something has continued','How long have you had the cough?'],
 ['severity','How strong or serious a symptom is','How severe is the pain?'],
 ['dizziness','Feeling light-headed or unsteady','Have you felt dizzy?'],
 ['shortness of breath','Difficulty breathing comfortably','Are you experiencing shortness of breath?'],
 ['nausea','Feeling that you might vomit','Have you had any nausea?']
];
const conversation=[
 ['Doctor','Good morning. I’m Dr. Rivera. What brings you in today?'],
 ['Patient','I’ve had a headache since yesterday afternoon.'],
 ['Doctor','I’m sorry to hear that. Where exactly does it hurt?'],
 ['Patient','Mostly across my forehead.'],
 ['Doctor','On a scale from zero to ten, how severe is the pain?'],
 ['Patient','About six out of ten.'],
 ['Doctor','Have you noticed any other symptoms, such as nausea or dizziness?'],
 ['Patient','I felt a little dizzy this morning.'],
 ['Doctor','Thank you. I’d like to ask a few more questions about your symptoms.']
];
const questions=[
 {q:'What is the patient’s main complaint?',a:['A headache','A sore throat','Chest pain'],correct:0,why:'The patient reports a headache.'},
 {q:'When did the headache begin?',a:['Last week','Yesterday afternoon','This morning'],correct:1,why:'The patient says “since yesterday afternoon.”'},
 {q:'Where is the pain located?',a:['Across the forehead','In the lower back','In the left leg'],correct:0,why:'The patient says “across my forehead.”'},
 {q:'How severe is the pain?',a:['Two out of ten','Ten out of ten','Six out of ten'],correct:2,why:'The patient rates the pain as six out of ten.'},
 {q:'What other symptom does the patient mention?',a:['Dizziness','A rash','A fever'],correct:0,why:'The patient felt dizzy this morning.'}
];
const challenges=[
 {q:'Choose the most natural opening question.',a:['What brings you in today?','You have a disease, right?','Tell me your diagnosis.'],correct:0,why:'An open question invites the patient to describe the complaint.'},
 {q:'Which question explores onset?',a:['Where is the pain?','When did it start?','How strong is the pain?'],correct:1,why:'Onset means when a symptom began.'},
 {q:'Which question explores severity?',a:['How severe is it on a scale of zero to ten?','How long has it lasted?','Does anyone in your family smoke?'],correct:0,why:'A numerical scale can help describe pain severity.'},
 {q:'Choose the most empathetic response.',a:['That is not important.','I’m sorry to hear that.','Stop worrying.'],correct:1,why:'Acknowledging discomfort supports respectful communication.'}
];
const exam=[
 {q:'A patient says “I have been coughing for three days.” Which follow-up explores duration?',a:['How long have you had the cough?','Where is your ID?','Is your address correct?'],correct:0},
 {q:'Which phrase is most appropriate for the chief complaint?',a:['What brings you in today?','What is your favorite movie?','What do you want to buy?'],correct:0},
 {q:'“Onset” refers to…',a:['The location of a symptom','When a symptom started','The treatment outcome'],correct:1},
 {q:'A patient rates pain as 8/10. The doctor has asked about…',a:['Severity','Duration','Family history'],correct:0},
 {q:'Which phrase asks about associated symptoms?',a:['Have you noticed any other symptoms?','How do you spell your name?','Do you work here?'],correct:0},
 {q:'“I feel dizzy” means…',a:['I feel unsteady or light-headed','I am hungry','I have a rash'],correct:0},
 {q:'Which response shows empathy?',a:['That cannot be true.','I’m sorry you’re feeling unwell.','Be quiet, please.'],correct:1},
 {q:'Which question asks about location?',a:['When did it start?','Where exactly does it hurt?','How often do you exercise?'],correct:1},
 {q:'What does “shortness of breath” describe?',a:['Difficulty breathing comfortably','A skin condition','A headache'],correct:0},
 {q:'Choose the most professional closing transition.',a:['That is enough. Goodbye.','Thank you. I’d like to ask a few more questions.','You should know the answer.'],correct:1}
];
let state=load(),view='home',section='vocab',flashIndex=0,flipped=false,answers={},submitted=false,practiceAnswers={},practiceChecked=false,listenAnswers={},listenChecked=false;
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return {done:s.done||{},best:Math.max(0,Math.min(100,Number(s.best)||0)),attempts:Number(s.attempts)||0}}catch{return {done:{},best:0,attempts:0}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const completed=()=>sections.filter(([id])=>state.done[id]).length;
function mark(id){state.done[id]=true;save();render()}
function speak(text){if(!('speechSynthesis'in window)){alert('Text-to-speech is unavailable in this browser.');return}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.85;window.speechSynthesis.speak(utterance)}
function button(label,fn,cls='secondary'){const b=document.createElement('button');b.className=cls;b.textContent=label;b.addEventListener('click',fn);return b}
function addAction(id,label,fn,cls='secondary'){const e=document.getElementById(id);if(e)e.append(button(label,fn,cls))}
function nav(v){view=v;render();window.scrollTo({top:0,behavior:'smooth'})}
function openSection(s){section=s;submitted=false;render()}
function render(){document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.getElementById('overall').textContent=`${Math.round(completed()/sections.length*100)}% Unit 1 complete`;document.getElementById('best').textContent=state.attempts?`Best assessment: ${state.best}%`:'Assessment not taken';document.getElementById('progressBar').style.width=`${completed()/sections.length*100}%`;const e=document.getElementById('screen');e.innerHTML=view==='home'?home():view==='progress'?progress():unit();wire()}
function home(){return `<div class="card"><span class="kicker">Your learning path</span><h2>Unit 1 · Presenting Complaints</h2><p>Learn to ask why a patient has come in, explore symptoms and respond with empathy.</p><div class="grid">${sections.map(([id,name],i)=>`<div class="unitTile"><span class="status ${state.done[id]?'':'locked'}">${state.done[id]?'Completed':'Activity '+(i+1)}</span><h3>${esc(name)}</h3><p>${['8 clinical expressions and examples','Audio dialogue + 5 comprehension questions','A model patient interview with playback','4 communication decisions','10 questions · pass with 70%'][i]}</p><button class="secondary" data-section="${id}">${state.done[id]?'Review':'Start activity'}</button></div>`).join('')}</div></div><div class="card"><span class="kicker">Coming next</span><h2>Units 2–12</h2><p>Planned for future releases. They are not yet available and will not be counted as completed.</p><span class="status locked">Coming soon</span></div>`}
function progress(){return `<div class="card"><h2>My progress</h2><p><span class="number">${completed()}/5</span> learning activities completed</p><p>Best assessment score: <strong>${state.attempts?state.best+'%':'Not taken'}</strong> · Attempts: ${state.attempts}</p><p>${state.done.exam?'Unit 1 passed — well done!':'Pass the final assessment with at least 70% to complete Unit 1.'}</p><div class="grid">${sections.map(([id,name])=>`<div class="unitTile"><strong>${esc(name)}</strong><p>${state.done[id]?'✓ Completed':'Not yet completed'}</p></div>`).join('')}</div></div><div class="card"><h3>Data and privacy</h3><p>Your progress is saved only in this browser on this device. Clearing browser data or switching devices can erase it. No account or cloud synchronization is included.</p><div id="reset"></div></div>`}
function unit(){return `<div class="card"><span class="kicker">Unit 1 · Presenting Complaints</span><h2>${esc(sections.find(x=>x[0]===section)[1])}</h2><div class="lessonNav">${sections.map(([id,name])=>`<button data-section="${id}" class="${id===section?'active':''}">${esc(name)}</button>`).join('')}</div>${section==='vocab'?vocab():section==='listening'?listening():section==='dialogue'?dialogue():section==='practice'?practice():assessment()}</div>`}
function vocab(){const w=words[flashIndex];return `<p>Study the expressions, listen to their pronunciation and flip each card to see its meaning and a clinical example.</p><p class="muted mini">Card ${flashIndex+1} of ${words.length}</p><div class="flash"><div class="word">${esc(w[0])}</div>${flipped?`<p>${esc(w[1])}</p><em>${esc(w[2])}</em>`:'<p>Tap “Reveal meaning” to turn the card.</p>'}</div><div class="actions" id="vocabActions"></div><p class="muted mini">Speech uses the device’s English text-to-speech voice. A voice download or internet connection may be required.</p><div id="completeVocab"></div>`}
function listening(){return `<p>Listen to a short consultation. Play the entire conversation or read the transcript after attempting the questions.</p><div class="actions" id="listenActions"></div><details><summary>Show transcript (optional)</summary><div class="dialogue" style="margin-top:12px">${conversation.map(([r,t])=>`<div class="line ${r==='Patient'?'patient':''}"><strong>${r}</strong>${esc(t)}</div>`).join('')}</div></details><h3>Comprehension check</h3>${quizHtml(questions,listenAnswers,'listen')}<div class="actions" id="listenCheck"></div><div id="listenFeedback"></div>`}
function dialogue(){return `<p>Listen to the clinical interview, then practice reading the doctor’s lines aloud. Pay attention to polite questions and empathetic responses.</p><div class="dialogue">${conversation.map(([r,t],i)=>`<div class="line ${r==='Patient'?'patient':''}"><strong>${r}</strong>${esc(t)} <button class="pill mini" data-say="${i}">▶ Listen</button></div>`).join('')}</div><div class="actions" id="dialogueActions"></div><p class="muted mini">Speaking practice is self-directed in this version; microphone recording and pronunciation scoring are not included.</p>`}
function practice(){return `<p>Choose the most appropriate English expression in each clinical situation.</p>${quizHtml(challenges,practiceAnswers,'practice')}<div class="actions" id="practiceCheck"></div><div id="practiceFeedback"></div>`}
function assessment(){return `<p>Answer all 10 questions. A score of <strong>70% or higher</strong> unlocks Unit 1 completion. You can retry as many times as needed.</p>${submitted?`<div class="feedback ${lastScore<70?'warning':''}"><h3>${lastScore>=70?'Assessment passed!':'Keep practicing'}</h3><p>Score: <strong>${lastScore}%</strong> (${Math.round(lastScore/10)} of 10). ${lastScore>=70?'Unit 1 is complete.':'Review the learning activities and try again.'}</p><div id="retry"></div></div>`:quizHtml(exam,answers,'exam')+'<div class="actions" id="examActions"></div><div id="examFeedback"></div>'}`}
let lastScore=0;
function quizHtml(items,selected,prefix){return items.map((q,i)=>`<div class="q"><strong>${i+1}. ${esc(q.q)}</strong>${q.a.map((a,j)=>`<button class="choice ${selected[i]===j?'selected':''}" data-quiz="${prefix}" data-i="${i}" data-j="${j}" aria-pressed="${selected[i]===j}">${esc(a)}</button>`).join('')}</div>`).join('')}
function grade(items,selected){return Math.round(items.reduce((s,q,i)=>s+(selected[i]===q.correct?1:0),0)/items.length*100)}
function wire(){document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>{view='unit';openSection(b.dataset.section)}));document.querySelectorAll('[data-quiz]').forEach(b=>b.addEventListener('click',()=>{const obj=b.dataset.quiz==='listen'?listenAnswers:b.dataset.quiz==='practice'?practiceAnswers:answers;obj[Number(b.dataset.i)]=Number(b.dataset.j);render()}));document.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>speak(conversation[Number(b.dataset.say)][1])));
 if(view==='progress'){addAction('reset','Erase local progress',()=>{if(confirm('Erase all saved progress and scores on this device?')){state={done:{},best:0,attempts:0};save();render()}})}
 if(view!=='unit')return;
 if(section==='vocab'){addAction('vocabActions','◀ Previous',()=>{flashIndex=(flashIndex+words.length-1)%words.length;flipped=false;render()});addAction('vocabActions',flipped?'Hide meaning':'Reveal meaning',()=>{flipped=!flipped;render()},'primary');addAction('vocabActions','▶ Listen',()=>speak(words[flashIndex][0]+'. '+words[flashIndex][2]));addAction('vocabActions','Next ▶',()=>{flashIndex=(flashIndex+1)%words.length;flipped=false;render()});addAction('completeVocab',state.done.vocab?'✓ Vocabulary completed':'Mark vocabulary studied',()=>mark('vocab'),'primary')}
 if(section==='listening'){addAction('listenActions','▶ Play conversation',()=>speak(conversation.map(x=>x[1]).join(' ')),'primary');addAction('listenCheck','Check my answers',()=>check(questions,listenAnswers,'listening','listenFeedback'),'primary')}
 if(section==='dialogue'){addAction('dialogueActions','▶ Play full dialogue',()=>speak(conversation.map(x=>x[1]).join(' ')));addAction('dialogueActions',state.done.dialogue?'✓ Interview practiced':'I practiced the interview',()=>mark('dialogue'),'primary')}
 if(section==='practice')addAction('practiceCheck','Check my answers',()=>check(challenges,practiceAnswers,'practice','practiceFeedback'),'primary');
 if(section==='exam'){if(submitted){addAction('retry','Try assessment again',()=>{answers={};submitted=false;render()},'primary')}else addAction('examActions','Submit assessment',()=>{if(Object.keys(answers).length<exam.length){document.getElementById('examFeedback').innerHTML='<p class="feedback warning">Please answer all 10 questions before submitting.</p>';return}lastScore=grade(exam,answers);state.attempts++;state.best=Math.max(state.best,lastScore);if(lastScore>=70)state.done.exam=true;save();submitted=true;render()},'primary')}
}
function check(items,selected,id,target){const e=document.getElementById(target);if(Object.keys(selected).length<items.length){e.innerHTML='<p class="feedback warning">Please answer all questions first.</p>';return}const score=grade(items,selected);if(score>=70){state.done[id]=true;save()}e.innerHTML=`<div class="feedback ${score<70?'warning':''}"><strong>${score}% correct</strong><p>${score>=70?'Activity completed.':'Review your answers and try again.'}</p>${items.map((q,i)=>`<p class="mini">${i+1}. ${selected[i]===q.correct?'✓':'✗'} Correct: ${esc(q.a[q.correct])}${q.why?' — '+esc(q.why):''}</p>`).join('')}</div>`;document.getElementById('overall').textContent=`${Math.round(completed()/sections.length*100)}% Unit 1 complete`;document.getElementById('progressBar').style.width=`${completed()/sections.length*100}%`}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('install').hidden=false});document.getElementById('install').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById('install').hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));render();
