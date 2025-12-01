/* =============================
 app.js
============================== */
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // Init year
  const y = new Date().getFullYear();
  const yEl = $('#year'); if (yEl) yEl.textContent = y;

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navList = $('#navmenu');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navList.style.display = open ? 'none' : 'flex';
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.12});
  $$('.section, .card, .feature, .quote').forEach(el=>{ el.classList.add('reveal'); io.observe(el); });

  // WhatsApp helper
  const waBase = 'https://wa.me/91';
  const defaultPhone = '9152691665'; // Optional: set your business number like '9876543210'

  function waLink(payload){
    const txt = encodeURIComponent(payload);
    const phone = defaultPhone || ($('#book-form input[name="phone"]').value || '').replace(/\D/g,'');
    const url = `${waBase}${phone ? phone : ''}?text=${txt}`;
    return url;
  }

  // Floating WA preset from hero locality
  const localitySel = $('#locality');
  const waFloat = $('#whatsapp-float');
  function setWAFloat(){
    const loc = localitySel ? localitySel.value : 'Mumbai';
    const msg = `Hi Pawzy! I want to book a walk in ${loc}.`;
    waFloat.href = waLink(msg);
  }
  if (waFloat){ setWAFloat(); localitySel && localitySel.addEventListener('change', setWAFloat); }

  // Hero CTA button -> WA
  const cta = $('#cta-book');
  if (cta){ cta.addEventListener('click', ()=>{
    const loc = localitySel.value;
    const msg = `Hi Pawzy! I'd like to book a walk in ${loc}.`;
    window.open(waLink(msg),'_blank');
  }); }

  // Booking form -> WA with structured message
  const form = $('#book-form');
  const status = $('#form-status');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name');
    const phone = (fd.get('phone')||'').toString().replace(/\D/g,'');
    const locality = fd.get('locality');
    const service = fd.get('service');
    const size = fd.get('size');
    const time = fd.get('time');

    if (!name || !phone || phone.length !== 10){
      status.textContent = 'Please enter your name and a valid 10-digit WhatsApp number.';
      status.style.color = '#f97316';
      return;
    }

    const msg = `Booking Request\nName: ${name}\nPhone: ${phone}\nLocality: ${locality}\nService: ${service}\nPet size: ${size}\nPreferred time: ${time}`;
    const url = waLink(msg);
    window.open(url,'_blank');
    status.textContent = 'Opening WhatsApp...';
    status.style.color = '';
    form.reset();
  });

  // i18n strings
  const dict = {
    en:{
      brand:'Pawzy', tagline:'Complete pet care at your doorstep',
      nav_services:'Services', nav_pricing:'Pricing', nav_why:'Why Us', nav_testimonials:'Testimonials', nav_contact:'Contact',
      hero_title:'Happy walks. Healthy pets. Hassle-free for you.',
      hero_sub:'Serving Mumbai, Navi Mumbai and Thane with reliable walking, grooming, day boarding and vet accompany.',
      cta_book:'Book a walk',
      services_title:'Services',
      svc_walk_title:'Dog Walking', svc_walk_text:'Daily, weekly, or on-demand walks with GPS check-in and photo updates.',
      svc_groom_title:'Grooming at Home', svc_groom_text:'Bath, brush, nails, and ear cleaning at your doorstep.',
      svc_vet_title:'Vet Accompany',
      pricing_title:'Pricing',
      price_walk_title:'Walks', price_walk_30:'30 min walk', price_walk_60:'60 min walk', price_walk_pkg:'10-walk pack',
      price_groom_title:'Grooming', price_groom_small:'Small breed', price_groom_med:'Medium breed', price_groom_large:'Large breed',
      price_vet_title:'Vet Accompany', price_vet_basic:'Clinic visit (up to 1 hr)', price_vet_extra:'Every extra 30 min',
      price_note:'Prices vary by locality and size; final quote confirmed on WhatsApp.',
      why_title:'Why choose Pawzy?', why_local:'Local walkers from your area', why_local_p:'Mumbai, Navi Mumbai and Thane specialists who know every lane and park.', why_safe:'Safety-first', why_safe_p:'Leashes, ID checks, and real-time updates.', why_convenient:'Convenient scheduling', why_convenient_p:'Book in seconds, reschedule anytime.', why_value:'Great value', why_value_p:'Transparent pricing and packages.',
      testi_title:'Loved by pet parents', testi_1:'“Reliable and caring. My Husky actually waits by the door!”', testi_2:'“Grooming at home saved us so much time. Super neat.”', testi_3:'“They handled the vet visit end-to-end. Stress-free.”',
      contact_title:'Book now', form_name:'Your name', form_phone:'Phone (WhatsApp)', form_locality:'Locality', form_service:'Service', form_pet_size:'Pet size', form_time:'Preferred time', form_submit:'Send on WhatsApp',
      footer_local:'Mumbai • Navi Mumbai • Thane'
    },
    
  };

  function applyLang(lang){
    const t = dict[lang] || dict.en;
    $$('#lang option').forEach(o=> o.selected = (o.value===lang));
    $$('[data-i18n]').forEach(el=>{ const key = el.getAttribute('data-i18n'); if (t[key]) el.textContent = t[key]; });
    document.title = `${t.brand} • ${t.tagline}`;
  }

  const langSel = $('#lang');
  const saved = localStorage.getItem('pawzy:lang') || 'en';
  applyLang(saved);
  langSel?.addEventListener('change',()=>{
    const v = langSel.value; localStorage.setItem('pawzy:lang', v); applyLang(v);
  });
})();
