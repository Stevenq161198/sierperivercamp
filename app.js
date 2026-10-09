'use strict';
// Content is fetched separately. Replace loadContent() with a future API adapter.
const app = document.getElementById('app');
let content, language = 'es', activeCategory = 'all', photoIndex = 0;
let motionObserver;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHTML;
const paths = {
  arrow:'M5 12h14m-6-6 6 6-6 6', down:'M12 5v14m-6-6 6 6 6-6', up:'M12 19V5m-6 6 6-6 6 6',
  close:'m6 6 12 12M18 6 6 18',menu:'M4 7h16M4 12h16M4 17h16',plus:'M12 5v14M5 12h14',
  leaf:'M20 3C9 2 3 7 5 15s13 8 15-12ZM6 19 16 8',
  home:'m3 11 9-8 9 8M5 10v10h14V10M10 20v-7h4v7',
  boat:'M5 15V8h14v7M12 8V3m-3 0h6M3 15l9-3 9 3-4 5H7ZM3 22q3-2 6 0t6 0 6 0',
  bed:'M3 19V8m0 7h18v4M3 10h6v5m0-4h9q3 0 3 4M5 8h2',
  food:'M5 3v7m3-7v7m-6-7v7q3 4 6 0M5 13v8M18 3q-5 4-2 10h3V3m0 10v8',
  sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  wifi:'M2 8q10-9 20 0M5 12q7-6 14 0M8.5 16q3.5-3 7 0M12 20h.01',
  waves:'M2 7q3-3 6 0t6 0 6 0M2 12q3-3 6 0t6 0 6 0M2 17q3-3 6 0t6 0 6 0',
  bird:'M3 17q8 1 11-7V6q3-4 6 0l2 2h-3v3q-1 9-14 9M8 20l-2 2m7-3v3M3 12l7 3m7-9h.01',
  compass:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M15.5 8.5l-2 5-5 2 2-5Z',
  pin:'M19 10c0 6-7 12-7 12S5 16 5 10a7 7 0 0 1 14 0ZM14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0',
  check:'m5 12 4 4L19 6',left:'m15 5-7 7 7 7',right:'m9 5 7 7-7 7',
  wa:'M20.5 11.6a8.5 8.5 0 0 1-12.7 7.3L3 20l1.3-4.6A8.5 8.5 0 1 1 20.5 11.6ZM8 7q-1 3 2.5 6.5t6 2l-2-2-1.5 1q-3-1-4-4L10 9Z',
  logo:'M7 21q8-8 16 0t16 0M7 31q8-8 16 0t16 0M7 41q8-8 16 0t16 0M15 12l8-10 8 10'
};
const icon = (name, cls='') => `<svg class="${e(cls)}" aria-hidden="true" viewBox="${name==='logo'?'0 0 46 46':'0 0 24 24'}"><path d="${paths[name] || paths.leaf}"/></svg>`;
const external = 'target="_blank" rel="noopener noreferrer"';
const t = () => content.locales[language];
const waURL = message => `https://wa.me/${content.brand.whatsapp}?text=${encodeURIComponent(message)}`;
const directMessage = () => `${t().booking.waGreeting}\n\n${t().booking.waAvailability}`;
const title = (first, second) => `${e(first)}<br><em>${e(second)}</em>`;
const image = (src, alt, attrs='') => `<img src="${e(src)}" alt="${e(alt)}" loading="lazy" decoding="async" ${attrs}>`;
const brand = () => `<a class="brand" href="#inicio" aria-label="${e(content.brand.name)}">${icon('logo')}<span><span class="brand-title">${e(content.brand.name)}</span><span class="brand-subtitle">${e(content.brand.location.toUpperCase())}</span></span></a>`;
async function loadContent(){
  const response = await fetch('./content.json', {cache:'no-cache'});
  if (!response.ok) throw new Error('Content unavailable');
  const data = await response.json();
  if(!data.locales?.es || !/^\d{8,15}$/.test(data.brand?.whatsapp || '')) throw new Error('Invalid content');
  return data;
}
function render(){
  const ui=t(), {brand:b,images:im}=content;
  document.documentElement.lang=language;
  document.title=ui.pageTitle;
  document.querySelector('meta[name="description"]').content=ui.metaDescription;
  app.innerHTML=`
    <a class="skip" href="#main">${e(ui.skip)}</a>
    <header class="header" id="header"><div class="header-inner">
      ${brand()}<nav class="nav" id="nav" aria-label="${e(b.name)}">${ui.nav.map(n=>`<a href="#${e(n.id)}">${e(n.label)}</a>`).join('')}</nav>
      <div class="header-actions"><button class="lang" type="button" aria-label="${e(ui.language)}"><span class="${language==='es'?'':'inactive'}">ES</span><span class="${language==='en'?'':'inactive'}">EN</span></button><a class="btn light book-header" href="#reservar">${e(ui.book)} ${icon('arrow')}</a><button type="button" class="menu-toggle" aria-label="${e(ui.menu)}" aria-controls="nav" aria-expanded="false">${icon('menu')}</button></div>
    </div></header>
    <main id="main">
      <section class="hero" id="inicio" aria-labelledby="hero-title">
        <picture class="hero-photo"><source media="(max-width: 700px)" srcset="${e(im.heroMobile)}"><img src="${e(im.hero)}" alt="${e(ui.hero.imageAlt)}" width="1760" height="984" fetchpriority="high" decoding="async"></picture>
        <div class="hero-content wrap"><span class="eyebrow">${e(ui.hero.eyebrow)}</span><h1 id="hero-title">${title(ui.hero.title,ui.hero.titleItalic)}</h1><p>${e(ui.hero.description)}</p><div class="hero-ctas"><a class="btn light" href="#experiencias">${e(ui.hero.primary)} ${icon('arrow')}</a><a class="text-link" href="#refugio">${e(ui.hero.secondary)} ${icon('down')}</a></div></div>
        <div class="hero-bottom"><div><div class="hero-caption">${e(ui.hero.caption)}</div><div class="hero-location">${icon('pin')}${e(b.location)}</div></div><a class="scroll-cue" href="#refugio" aria-label="${e(ui.hero.scroll)}">${e(ui.hero.scroll)}<span>${icon('down')}</span></a></div>
      </section>
      <div class="facts"><div class="facts-inner wrap">${ui.hero.facts.map(f=>`<div class="fact">${icon(f.icon)}<span>${e(f.label)}</span></div>`).join('')}</div></div>
      <section class="section wrap" id="refugio" aria-labelledby="story-title">
        <div class="story"><div class="story-images reveal">${image(im.story,ui.story.imageAlt,'class="story-main" width="1100" height="1100"')}<div class="host-card">${image(im.host,ui.story.hostAlt,'width="75" height="80"')}<div><strong>${e(ui.story.hostName)}</strong><span>${e(ui.story.hostRole)}</span></div></div></div>
        <div class="story-copy reveal"><span class="eyebrow">${e(ui.story.eyebrow)}</span><h2 id="story-title">${title(ui.story.title,ui.story.italic)}</h2><p>${e(ui.story.body)}</p><p>${e(ui.story.body2)}</p><span class="hand-note">${e(ui.story.note)}</span></div></div>
        <div class="amenities reveal"><div class="amenities-heading">${e(ui.amenities.title)}</div><div class="amenity-grid">${ui.amenities.items.map(a=>`<article class="amenity">${icon(a.icon)}<div><h3>${e(a.title)}</h3><p>${e(a.text)}</p></div></article>`).join('')}</div></div>
      </section>
      <section class="section experiences" id="experiencias" aria-labelledby="experience-title"><div class="wrap">
        <div class="section-heading reveal"><div><span class="eyebrow">${e(ui.experiences.eyebrow)}</span><h2 id="experience-title">${title(ui.experiences.title,ui.experiences.italic)}</h2></div><p>${e(ui.experiences.description)}</p></div>
        <div class="filters" role="group" aria-label="${e(ui.nav[1].label)}">${ui.experiences.categories.map(c=>`<button class="filter" type="button" data-category="${e(c.id)}" aria-pressed="${activeCategory===c.id}" aria-controls="experience-grid">${e(c.label)}</button>`).join('')}</div>
        <div class="experience-grid" id="experience-grid" aria-live="polite">${ui.experiences.items.map(x=>`<article class="experience" data-group="${e(x.category)}" ${activeCategory!=='all'&&activeCategory!==x.category?'hidden':''}><div class="experience-image">${image(x.image,x.alt,'width="550" height="400"')}<span class="experience-tag">${e(x.tag)}</span></div><div class="experience-copy"><h3>${e(x.title)}</h3><p>${e(x.description)}</p><div class="experience-bottom"><span class="experience-meta">${icon(x.icon)}${e(x.meta)}</span><button class="round-btn" type="button" data-tour="${e(x.id)}" aria-label="${e(ui.experiences.details)}: ${e(x.title)}">${icon('arrow')}</button></div></div></article>`).join('')}</div><p class="availability">${e(ui.experiences.availability)}</p>
      </div></section>
      <section class="section wrap" id="estadia" aria-labelledby="stay-title"><div class="stay"><div class="stay-image reveal">${image(im.room,ui.stay.imageAlt,'width="1100" height="825"')}<div class="stay-badge">${icon('sun')}<span>${e(ui.stay.badge)}</span></div></div><div class="stay-copy reveal"><span class="eyebrow">${e(ui.stay.eyebrow)}</span><h2 id="stay-title">${title(ui.stay.title,ui.stay.italic)}</h2><p>${e(ui.stay.description)}</p><ul class="features">${ui.stay.features.map(f=>`<li>${icon('check')}${e(f)}</li>`).join('')}</ul><p class="note">${e(ui.stay.note)}</p><a class="btn" href="${e(waURL(`${ui.booking.waGreeting}\n${ui.booking.waStay}\n${ui.booking.waAvailability}`))}" ${external}>${e(ui.stay.cta)} ${icon('arrow')}</a></div></div></section>
      <section class="pause" aria-labelledby="pause-title">${image(im.sunset,ui.pause.alt,'data-parallax="sunset" width="1800" height="1014"')}<div class="wrap reveal"><span class="eyebrow">${e(ui.pause.eyebrow)}</span><h2 id="pause-title">${title(ui.pause.title,ui.pause.italic)}</h2></div></section>
      <section class="section wrap" id="galeria" aria-labelledby="gallery-title"><div class="gallery-heading reveal"><span class="eyebrow">${e(ui.gallery.eyebrow)}</span><h2 id="gallery-title">${e(ui.gallery.title)}</h2><p>${e(ui.gallery.hint)}</p></div><div class="gallery-grid reveal">${ui.gallery.items.map((g,i)=>`<button class="gallery-item" type="button" data-photo="${i}" aria-label="${e(ui.galleryOpen)}: ${e(g.caption)}">${image(g.src,g.alt,'width="700" height="500"')}<span>${e(g.caption)}${icon('plus')}</span></button>`).join('')}</div></section>
      <section class="section arrival" id="llegar" aria-labelledby="arrival-title"><div class="wrap arrival-layout"><div class="arrival-intro reveal"><span class="eyebrow">${e(ui.arrival.eyebrow)}</span><h2 id="arrival-title">${title(ui.arrival.title,ui.arrival.italic)}</h2><p>${e(ui.arrival.description)}</p><div class="river-route" aria-hidden="true"><svg class="route-art" viewBox="0 0 410 125"><path stroke="#617c66" d="M-10 47q65-50 150-16t145 0 140-15M-10 86q65-50 150-16t145 0 140-15M-10 108q65-50 150-16t145 0 140-15"/><path class="route-dash" d="M28 71Q120 11 199 48t175-5"/><circle cx="28" cy="71" r="6" fill="#ddc7a3" stroke="none"/><circle cx="374" cy="43" r="6" fill="#ddc7a3" stroke="none"/><path d="m190 43 9-7 9 7-4 6h-10Z" fill="#ddc7a3" stroke="#ddc7a3"/><path stroke="#8b9b79" d="m54 4 6 12 6-12m-6 0v22m244 77 6 12 6-12m-6 0v22m49-121 6 12 6-12m-6 0v22"/></svg><div class="route-labels"><span>SIERPE</span><span>${e(b.name)}</span></div></div><a class="text-link" href="${e(b.mapUrl)}" ${external}>${e(ui.arrival.map)} ${icon('arrow')}</a><p class="map-note">${e(ui.arrival.mapNote)}</p></div><div class="arrival-steps reveal">${ui.arrival.steps.map((s,i)=>`<article class="arrival-step"><div class="step-number">0${i+1}</div><div><h3>${e(s.title)}</h3><p>${e(s.text)}</p></div></article>`).join('')}</div></div></section>
      <section class="section faq wrap" aria-labelledby="faq-title"><div class="faq-layout"><div class="reveal"><span class="eyebrow">${e(ui.faq.eyebrow)}</span><h2 id="faq-title">${e(ui.faq.title)}</h2></div><div class="faq-list reveal">${ui.faq.items.map(f=>`<details><summary>${e(f.question)}</summary><p>${e(f.answer)}</p></details>`).join('')}</div></div></section>
      <section class="section booking" id="reservar" aria-labelledby="booking-title"><div class="wrap booking-layout"><div class="booking-copy reveal"><span class="eyebrow">${e(ui.booking.eyebrow)}</span><h2 id="booking-title">${title(ui.booking.title,ui.booking.italic)}</h2><p>${e(ui.booking.description)}</p><p class="direct">${e(ui.booking.direct)}</p><a class="text-link" href="${e(waURL(directMessage()))}" ${external}>${e(ui.booking.directCta)} ${icon('wa')}</a></div>
        <form class="booking-form reveal" id="booking-form"><div class="field full"><label for="guest-name">${e(ui.booking.name)}</label><input id="guest-name" name="name" placeholder="${e(ui.booking.namePlaceholder)}" required maxlength="100" autocomplete="given-name"></div><div class="field"><label for="arrival-date">${e(ui.booking.arrival)}</label><input id="arrival-date" name="arrival" type="date"></div><div class="field"><label for="departure-date">${e(ui.booking.departure)}</label><input id="departure-date" name="departure" type="date"></div><p class="hint full">${e(ui.booking.datesOptional)}</p><div class="field"><label for="guests">${e(ui.booking.guests)}</label><input id="guests" name="guests" type="number" inputmode="numeric" min="1" value="2" required></div><div class="field"><label for="interest">${e(ui.booking.interest)}</label><select id="interest" name="interest">${ui.booking.interests.map((v,i)=>`<option value="${i}">${e(v)}</option>`).join('')}</select></div><div class="field full"><label for="message">${e(ui.booking.message)}</label><textarea id="message" name="message" maxlength="1500" placeholder="${e(ui.booking.messagePlaceholder)}"></textarea></div><button type="submit" class="btn full">${icon('wa')}${e(ui.booking.submit)} ${icon('arrow')}</button><p class="note full">${e(ui.booking.note)}</p><a class="email-link full" href="mailto:${e(b.email)}">${e(ui.booking.emailCta)}</a></form>
      </div></section>
    </main>
    <footer class="footer"><div class="wrap"><div class="footer-main"><div>${brand()}<p class="footer-tag">${e(ui.footer.tagline)}</p></div><div class="footer-contact"><p>${e(ui.footer.location)}</p><a href="mailto:${e(b.email)}">${e(b.email)}</a><br><a href="${e(waURL(directMessage()))}" ${external}>+${e(b.whatsapp.slice(0,3))} ${e(b.whatsapp.slice(3,7))} ${e(b.whatsapp.slice(7))}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${e(b.name)}. ${e(ui.footer.copyright)}</span><span class="privacy">${e(ui.footer.privacy)}</span><a href="#inicio">${e(ui.footer.top)} ${icon('up')}</a></div></div></footer>
    <a class="floating-wa" href="${e(waURL(directMessage()))}" ${external} aria-label="${e(ui.whatsapp)}">${icon('wa')}</a>
    <dialog class="dialog" id="tour-dialog" aria-labelledby="tour-title"><button class="dialog-close" type="button" data-close aria-label="${e(ui.close)}">${icon('close')}</button><div id="tour-content"></div></dialog>
    <dialog class="dialog photo-dialog" id="photo-dialog" aria-label="${e(ui.gallery.title)}"><button class="dialog-close" type="button" data-close aria-label="${e(ui.close)}">${icon('close')}</button><figure><img id="lightbox-image" src="${e(ui.gallery.items[0].src)}" alt="${e(ui.gallery.items[0].alt)}"><figcaption><span id="photo-caption"></span><span id="photo-counter" aria-live="polite"></span></figcaption></figure><button type="button" class="photo-control prev" data-direction="-1" aria-label="${e(ui.prev)}">${icon('left')}</button><button type="button" class="photo-control next" data-direction="1" aria-label="${e(ui.next)}">${icon('right')}</button></dialog>`;
  app.setAttribute('aria-busy','false');
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('close',()=>{document.body.style.overflow='';});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();}});
  });
  document.getElementById('arrival-date').min=today();
  document.getElementById('departure-date').min=today();
  bindMotion();
  updateScroll();
}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Costa_Rica',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function bindMotion(){
  motionObserver?.disconnect();
  if(reducedMotion.matches) return;
  document.documentElement.classList.add('motion-ready');
  motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');motionObserver.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>motionObserver.observe(el));
}
function openDialog(id){document.getElementById(id).showModal();document.body.style.overflow='hidden';}
function openTour(id){
  const ui=t(), item=ui.experiences.items.find(x=>x.id===id);
  if(!item)return;
  document.getElementById('tour-content').innerHTML=`${image(item.image,item.alt,'class="tour-dialog-img"')}<div class="dialog-copy"><span class="eyebrow">${e(item.tag)}</span><h2 id="tour-title">${e(item.title)}</h2><p>${e(item.details)}</p><a class="btn" href="${e(waURL(`${ui.booking.waGreeting}\n\n${ui.booking.waTour} ${item.title}\n${ui.booking.waAvailability}`))}" ${external}>${e(ui.experiences.consult)} ${icon('wa')}</a></div>`;
  openDialog('tour-dialog');
}
function updatePhoto(){
  const ui=t(), photos=ui.gallery.items;
  photoIndex=(photoIndex+photos.length)%photos.length;
  const item=photos[photoIndex], img=document.getElementById('lightbox-image');
  img.src=item.src;img.alt=item.alt;
  document.getElementById('photo-caption').textContent=item.caption;
  document.getElementById('photo-counter').textContent=`${ui.photoCount} ${photoIndex+1} ${ui.of} ${photos.length}`;
}
app.addEventListener('click',event=>{
  const el=event.target.closest('button,a');if(!el)return;
  if(el.classList.contains('lang')){
    const form=document.getElementById('booking-form');
    const values=Object.fromEntries(new FormData(form));
    language=language==='es'?'en':'es';render();
    for(const [key,value] of Object.entries(values)){const field=document.getElementById('booking-form').elements.namedItem(key);if(field)field.value=value;}
    validateDates();document.querySelector('.lang').focus({preventScroll:true});
  } else if(el.classList.contains('menu-toggle')){
    const isOpen=el.getAttribute('aria-expanded')==='true';
    el.setAttribute('aria-expanded',String(!isOpen));el.setAttribute('aria-label',isOpen?t().menu:t().close);
    document.getElementById('nav').classList.toggle('open',!isOpen);
    el.innerHTML=icon(isOpen?'menu':'close');
  } else if(el.dataset.category){
    activeCategory=el.dataset.category;
    document.querySelectorAll('.filter').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.category===activeCategory)));
    document.querySelectorAll('.experience').forEach(card=>{card.hidden=activeCategory!=='all'&&card.dataset.group!==activeCategory;});
  } else if(el.dataset.tour){openTour(el.dataset.tour);
  } else if(el.dataset.photo!==undefined){photoIndex=Number(el.dataset.photo);updatePhoto();openDialog('photo-dialog');
  } else if(el.dataset.direction){photoIndex+=Number(el.dataset.direction);updatePhoto();
  } else if(el.hasAttribute('data-close')){el.closest('dialog').close();
  } else if(el.getAttribute('href')?.startsWith('#')){
    const toggle=document.querySelector('.menu-toggle');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',t().menu);toggle.innerHTML=icon('menu');document.getElementById('nav').classList.remove('open');
  }
});
document.addEventListener('keydown',event=>{
  const dialog=document.getElementById('photo-dialog');
  if(dialog?.open && ['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();photoIndex+=event.key==='ArrowRight'?1:-1;updatePhoto();}
  if(event.key==='Escape'){document.getElementById('nav')?.classList.remove('open');const toggle=document.querySelector('.menu-toggle');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',t().menu);toggle.innerHTML=icon('menu');}}
});
function validateDates(){
  const a=document.getElementById('arrival-date'),d=document.getElementById('departure-date');
  a.required=Boolean(d.value);d.required=Boolean(a.value);
  if(a.value){const next=new Date(`${a.value}T12:00:00Z`);next.setUTCDate(next.getUTCDate()+1);d.min=next.toISOString().slice(0,10);}else d.min=today();
  d.setCustomValidity(a.value&&d.value&&d.value<=a.value?t().booking.dateError:'');
}
app.addEventListener('input',event=>{if(['arrival-date','departure-date'].includes(event.target.id))validateDates();});
const dateLabel=value=>value?new Intl.DateTimeFormat(language==='es'?'es-CR':'en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`)):'';
app.addEventListener('submit',event=>{
  if(event.target.id!=='booking-form')return;
  event.preventDefault();validateDates();if(!event.target.reportValidity())return;
  const fields=Object.fromEntries(new FormData(event.target)),ui=t().booking;
  const lines=[ui.waGreeting,'',`${ui.name}: ${fields.name.trim()}`,`${ui.guests}: ${fields.guests}`,`${ui.interest}: ${ui.interests[Number(fields.interest)]}`];
  if(fields.arrival)lines.push(`${ui.arrival}: ${dateLabel(fields.arrival)}`);
  if(fields.departure)lines.push(`${ui.departure}: ${dateLabel(fields.departure)}`);
  if(fields.message.trim())lines.push('',fields.message.trim());
  lines.push('',ui.waAvailability);
  window.open(waURL(lines.join('\n')),'_blank','noopener,noreferrer');
});
let scrolling=false;
function updateScroll(){
  scrolling=false;
  document.getElementById('header')?.classList.toggle('scrolled',window.scrollY>90);
  if(reducedMotion.matches||window.innerWidth<701)return;
  const hero=document.querySelector('.hero-photo');
  if(hero&&window.scrollY<window.innerHeight)hero.style.transform=`translate3d(0,${Math.min(window.scrollY*.16,125)}px,0)`;
  const sunset=document.querySelector('[data-parallax]');
  if(sunset){const rect=sunset.parentElement.getBoundingClientRect();if(rect.top<window.innerHeight&&rect.bottom>0)sunset.style.transform=`translate3d(0,${(window.innerHeight/2-rect.top-rect.height/2)*.09}px,0)`;}
}
window.addEventListener('scroll',()=>{if(!scrolling){scrolling=true;requestAnimationFrame(updateScroll);}},{passive:true});
reducedMotion.addEventListener('change',()=>{document.documentElement.classList.remove('motion-ready');document.querySelectorAll('.hero-photo,[data-parallax]').forEach(el=>el.style.transform='');bindMotion();});
loadContent().then(data=>{content=data;render();}).catch(()=>{
  app.setAttribute('aria-busy','false');
  app.innerHTML='<div class="loading">Sierpe River Camp<span>No pudimos cargar el contenido. Intenta recargar la página.</span><a href="https://wa.me/50686634386" target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a></div>';
});
