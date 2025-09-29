// Configuration: set your boyfriend's birthday here
const TARGET_BIRTHDAY = { month: 9, day: 30, year: 2004 }; // Sep 30, 2004

const monthEl = document.getElementById('month');
const dayEl = document.getElementById('day');
const yearEl = document.getElementById('year');
const feedbackEl = document.getElementById('feedback');
const arrowEl = document.getElementById('scrollArrow');
const brandEl = document.getElementById('brandHome');

// Populate selects
function populate() {
  createDropdown(monthEl, Array.from({length:12},(_,i)=>({value:String(i+1), label:String(i+1).padStart(2,'0')})));
  createDropdown(dayEl, Array.from({length:31},(_,i)=>({value:String(i+1), label:String(i+1).padStart(2,'0')})));
  const yearNow = new Date().getFullYear();
  createDropdown(yearEl, Array.from({length:71},(_,i)=>{const y=yearNow-i; return {value:String(y), label:String(y)};}));
}

function createDropdown(input, items){
  const list = document.createElement('div');
  list.className='dropdown-list';
  input.parentElement.appendChild(list);
  function render(filter=''){
    const f = filter.trim().toLowerCase();
    list.innerHTML='';
    items.filter(it => it.label.toLowerCase().startsWith(f)).forEach(it=>{
      const div=document.createElement('div');
      div.className='dropdown-item';
      div.textContent=it.label;
      div.addEventListener('mousedown', e=>{ e.preventDefault(); input.value=it.value; close(); checkInvite(); });
      list.appendChild(div);
    });
  }
  function open(){ render(input.value); list.classList.add('open'); }
  function close(){ list.classList.remove('open'); }
  input.addEventListener('focus', open);
  input.addEventListener('input', ()=>{ render(input.value); checkInvite(); });
  input.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  document.addEventListener('click', e=>{ if(!input.parentElement.contains(e.target)) close(); });
}

function checkInvite() {
  const m = parseInt(monthEl.value, 10);
  const d = parseInt(dayEl.value, 10);
  const y = parseInt(yearEl.value, 10);
  if (!m || !d || !y) {
    setFeedback('', '');
    disableSurprises(true);
    localStorage.removeItem('invite_ok');
    return;
  }
  const isMatch = m === TARGET_BIRTHDAY.month && d === TARGET_BIRTHDAY.day && y === TARGET_BIRTHDAY.year;
  if (isMatch) {
    setFeedback('YAY! Am I invited??? >< KIDDING', 'good');
    localStorage.setItem('invite_ok','1');
    // no music here; plays on letter page only
  } else {
    setFeedback('AWW TRY AGAIN BABYYYY :(', 'bad');
    disableSurprises(true);
    localStorage.removeItem('invite_ok');
  }
}

function setFeedback(text, state) {
  feedbackEl.textContent = text;
  feedbackEl.classList.remove('good','bad');
  if (state) feedbackEl.classList.add(state);
}

function disableSurprises(disabled){
  document.querySelectorAll('.surprise-card').forEach(card=>{
    if (disabled) card.classList.add('disabled');
    else card.classList.remove('disabled');
  });
  const section = document.getElementById('surprises');
  if (section) section.classList.toggle('hidden', disabled);
}

function confettiBurst(){
  // Tiny, dependency-free burst
  const count = 36;
  for(let i=0;i<count;i++){
    const p = document.createElement('span');
    p.className='confetti';
    p.style.setProperty('--h', String((i/count)*360));
    p.style.setProperty('--r', String(120 + Math.random()*40));
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 1600);
  }
}

arrowEl?.addEventListener('click', ()=>{
  const ok = localStorage.getItem('invite_ok') === '1';
  if (ok) {
    disableSurprises(false);
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hidden');
    document.getElementById('surprises')?.scrollIntoView({behavior:'smooth'});
    // no music here; plays on letter page only
  } else {
    // nudge: brief shake on feedback if not allowed yet
    feedbackEl.textContent = 'AWW TRY AGAIN BABYYYY :(';
    feedbackEl.classList.remove('good');
    feedbackEl.classList.add('bad');
  }
});

brandEl?.addEventListener('click', (e)=>{
  const ok = localStorage.getItem('invite_ok') === '1';
  if (ok) {
    e.preventDefault();
    disableSurprises(false);
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hidden');
    document.getElementById('surprises')?.scrollIntoView({behavior:'smooth'});
    // no music here; plays on letter page only
  }
});

// If arriving with #surprises and already invited, reveal automatically
if (location.hash === '#surprises' && localStorage.getItem('invite_ok') === '1') {
  disableSurprises(false);
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('hidden');
  // no music here; plays on letter page only
}


['change','input'].forEach(ev=>{
  monthEl?.addEventListener(ev, checkInvite);
  dayEl?.addEventListener(ev, checkInvite);
  yearEl?.addEventListener(ev, checkInvite);
});

// If user clicks the letter card, mark that music should start on the letter page
document.getElementById('toLetter')?.addEventListener('click', (e)=>{
  // Intercept navigation and open letter inside overlay iframe.
  // This ensures the click gesture is used to start audio within the iframe context.
  e.preventDefault();
  const ok = localStorage.getItem('invite_ok') === '1';
  if (!ok) return;
  const overlay = document.getElementById('letterOverlay');
  const frame = document.getElementById('letterFrame');
  if (!overlay || !frame) return;
  overlay.classList.add('open');
  // Append query flag so letter page knows to start audio on load
  const url = new URL('letter.html', location.href);
  url.searchParams.set('auto', '1');
  frame.src = url.toString();
});

document.getElementById('toGallery')?.addEventListener('click', (e)=>{
  // Intercept to open gallery in overlay so click counts as gesture for video with sound
  e.preventDefault();
  const ok = localStorage.getItem('invite_ok') === '1';
  if (!ok) return;
  const overlay = document.getElementById('galleryOverlay');
  const frame = document.getElementById('galleryFrame');
  if (!overlay || !frame) return;
  overlay.classList.add('open');
  const url = new URL('gallery.html', location.href);
  url.searchParams.set('auto', '1');
  frame.src = url.toString();
});

populate();


