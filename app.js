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
  const defaultPhone = '9138421314'; // Optional: set your business number like '9876543210'

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
    const loc = localitySel ? localitySel.value : 'Kharghar';
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
      hero_sub:'Serving Kharghar, Panvel, and Ulwe with reliable walking, grooming, day boarding and vet accompany.',
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
      why_title:'Why choose Pawzy?', why_local:'Local walkers from your area', why_local_p:'Kharghar, Panvel, and Ulwe specialists who know every lane and park.', why_safe:'Safety-first', why_safe_p:'Leashes, ID checks, and real-time updates.', why_convenient:'Convenient scheduling', why_convenient_p:'Book in seconds, reschedule anytime.', why_value:'Great value', why_value_p:'Transparent pricing and packages.',
      testi_title:'Loved by pet parents', testi_1:'“Reliable and caring. My Husky actually waits by the door!”', testi_2:'“Grooming at home saved us so much time. Super neat.”', testi_3:'“They handled the vet visit end-to-end. Stress-free.”',
      contact_title:'Book now', form_name:'Your name', form_phone:'Phone (WhatsApp)', form_locality:'Locality', form_service:'Service', form_pet_size:'Pet size', form_time:'Preferred time', form_submit:'Send on WhatsApp',
      footer_local:'Kharghar • Panvel • Ulwe'
    },
    hi:{
      brand:'पेटोपिया', tagline:'आपके दरवाज़े पर संपूर्ण पालतू देखभाल',
      nav_services:'सेवाएँ', nav_pricing:'कीमत', nav_why:'क्यों हम', nav_testimonials:'प्रशंसापत्र', nav_contact:'संपर्क',
      hero_title:'खुशहाल वॉक. स्वस्थ पालतू. आपकी सुविधा के लिए।',
      hero_sub:'खारघर, पनवेल और उरण-उलवे में भरोसेमंद वॉक, ग्रूमिंग और वेट साथ सेवा।',
      cta_book:'वॉक बुक करें',
      services_title:'सेवाएँ',
      svc_walk_title:'डॉग वॉकिंग', svc_walk_text:'जीपीएस चेक-इन और फोटो अपडेट के साथ दैनिक/साप्ताहिक वॉक।',
      svc_groom_title:'घर पर ग्रूमिंग', svc_groom_text:'नहाना, ब्रश, नाखून और कान सफाई आपके घर पर।',
      svc_vet_title:'वेट साथ',
      pricing_title:'कीमत', price_walk_title:'वॉक', price_walk_30:'30 मिनट वॉक', price_walk_60:'60 मिनट वॉक', price_walk_pkg:'10-वॉक पैक',
      price_groom_title:'ग्रूमिंग', price_groom_small:'छोटी नस्ल', price_groom_med:'मध्यम नस्ल', price_groom_large:'बड़ी नस्ल',
      price_vet_title:'वेट साथ', price_vet_basic:'क्लिनिक विज़िट (1 घंटा)', price_vet_extra:'हर अतिरिक्त 30 मिनट',
      price_note:'कीमत क्षेत्र और आकार पर निर्भर; अंतिम कोट व्हाट्सएप पर।',
      why_title:'पेटोपिया क्यों?', why_local:'आपके इलाके के वॉकर', why_local_p:'खारघर, पनवेल और उलवे के जानकार वॉकर।', why_safe:'सुरक्षा पहले', why_safe_p:'लीश, आईडी चेक, रीयल-टाइम अपडेट।', why_convenient:'सुविधाजनक शेड्यूलिंग', why_convenient_p:'सेकंडों में बुक करें, कभी भी बदलें।', why_value:'बेहतरीन मूल्य', why_value_p:'पारदर्शी कीमत और पैकेज।',
      testi_title:'पेट पैरेंट्स की पसंद', testi_1:'“भरोसेमंद और केयरिंग. मेरा हस्की दरवाज़े पर इंतज़ार करता है!”', testi_2:'“घर पर ग्रूमिंग से बहुत समय बचा. बढ़िया।”', testi_3:'“वेट विज़िट उन्होंने पूरी संभाली. तनाव-मुक्त।”',
      contact_title:'अभी बुक करें', form_name:'आपका नाम', form_phone:'फ़ोन (व्हाट्सएप)', form_locality:'इलाका', form_service:'सेवा', form_pet_size:'पेट का आकार', form_time:'समय', form_submit:'व्हाट्सएप पर भेजें',
      footer_local:'खारघर • पनवेल • उलवे'
    },
    mr:{
      brand:'पेटोपिया', tagline:'तुमच्या दारात संपूर्ण पाळीव प्राणी सेवा',
      nav_services:'सेवा', nav_pricing:'किंमत', nav_why:'का आम्ही', nav_testimonials:'प्रशंसापत्र', nav_contact:'संपर्क',
      hero_title:'आनंदी वॉक. निरोगी पेट्स. तुमच्यासाठी सोपे.',
      hero_sub:'खारघर, पनवेल आणि उलवे येथे विश्वासार्ह वॉक, ग्रूमिंग आणि व्हेट सोबत सेवा.',
      cta_book:'वॉक बुक करा',
      services_title:'सेवा',
      svc_walk_title:'डॉग वॉकिंग', svc_walk_text:'GPS चेक-इन आणि फोटो अपडेटसह वॉक.',
      svc_groom_title:'घरी ग्रूमिंग', svc_groom_text:'आंघोळ, ब्रश, नखं आणि कान साफ घरीच.',
      svc_vet_title:'व्हेट सोबत',
      pricing_title:'किंमत', price_walk_title:'वॉक', price_walk_30:'30 मिनिटांची वॉक', price_walk_60:'60 मिनिटांची वॉक', price_walk_pkg:'10-वॉक पॅक',
      price_groom_title:'ग्रूमिंग', price_groom_small:'लहान जाती', price_groom_med:'मध्यम जाती', price_groom_large:'मोठी जाती',
      price_vet_title:'व्हेट सोबत', price_vet_basic:'क्लिनिक भेट (1 तास)', price_vet_extra:'प्रत्येक अतिरिक्त 30 मिनिटे',
      price_note:'किंमत क्षेत्र व आकारावर अवलंबून; अंतिम कोट WhatsApp वर.',
      why_title:'Pawzy का निवडाल?', why_local:'तुमच्या भागातील वॉकर', why_local_p:'खारघर, पनवेल आणि उलवे येथील तज्ज्ञ.', why_safe:'सेफ्टी फर्स्ट', why_safe_p:'लीश, आयडी चेक, रिअल-टाइम अपडेट्स.', why_convenient:'सोयीस्कर वेळापत्रक', why_convenient_p:'सेकंदात बुक करा, कधीही बदला.', why_value:'मोलाचा फायदा', why_value_p:'पारदर्शक किंमत आणि पॅक.',
      testi_title:'पेट पॅरेंट्सना आवडले', testi_1:'“विश्वासू आणि काळजी घेणारे. माझा हस्की दारात वाट पाहतो!”', testi_2:'“घरी ग्रूमिंगने खूप वेळ वाचला. एकदम neat.”', testi_3:'“व्हेट व्हिजिट त्यांनी पूर्ण हाताळली. Stress-free.”',
      contact_title:'आता बुक करा', form_name:'तुमचे नाव', form_phone:'फोन (WhatsApp)', form_locality:'भाग', form_service:'सेवा', form_pet_size:'पेटचा आकार', form_time:'वेळ', form_submit:'WhatsApp वर पाठवा',
      footer_local:'खारघर • पनवेल • उलवे'
    }
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
