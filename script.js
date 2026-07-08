window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

document.getElementById('navHamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// scroll reveal
const revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revEls.forEach(el => revObs.observe(el));

// counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const val = Math.floor((1 - Math.pow(1 - elapsed, 3)) * target);
    el.textContent = val.toLocaleString() + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-counter]').forEach(animateCounter);
      counterObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const firstCounter = document.querySelector('[data-counter]');
if (firstCounter) counterObs.observe(firstCounter);

// carousel
let carIdx = 0;
const carSlides = 3;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');

function goToSlide(idx) {
  carIdx = (idx + carSlides) % carSlides;
  track.style.transform = `translateX(-${carIdx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === carIdx));
}

document.getElementById('carNext').addEventListener('click', () => goToSlide(carIdx + 1));
document.getElementById('carPrev').addEventListener('click', () => goToSlide(carIdx - 1));
dots.forEach(d => d.addEventListener('click', () => goToSlide(parseInt(d.dataset.idx))));

let autoCarousel = setInterval(() => goToSlide(carIdx + 1), 5500);
track.closest('section').addEventListener('mouseenter', () => clearInterval(autoCarousel));
track.closest('section').addEventListener('mouseleave', () => { autoCarousel = setInterval(() => goToSlide(carIdx + 1), 5500); });

function switchTab(name) {
  document.getElementById('wrapLeads').style.display = name === 'leads' ? '' : 'none';
  document.getElementById('wrapLoan').style.display = name === 'loan' ? '' : 'none';
  document.getElementById('tabLeads').classList.toggle('active', name === 'leads');
  document.getElementById('tabLoan').classList.toggle('active', name === 'loan');
}

function handleMUpload(input, zoneId, nameId) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); input.value = ''; return; }
  document.getElementById(zoneId).classList.add('has-file');
  const nameEl = document.getElementById(nameId);
  nameEl.textContent = file.name;
  nameEl.classList.remove('hidden');
}

function updateKinIdField() {
  const isPassport = document.querySelector('input[name="kin_id_type"]:checked').value === 'passport';
  document.getElementById('kin_id_doc_label').innerHTML = isPassport
    ? 'Passport Number <span style="color:var(--color-red)">*</span>'
    : 'National ID Number <span style="color:var(--color-red)">*</span>';
  document.getElementById('kin_id_no').style.display = isPassport ? 'none' : '';
  document.getElementById('kin_passport_no').style.display = isPassport ? '' : 'none';
  if (isPassport) document.getElementById('kin_id_no').value = '';
  else document.getElementById('kin_passport_no').value = '';
}