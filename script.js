function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch { return {}; }
}
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function setCurrentUser(name) { localStorage.setItem('currentUser', name); }
function getCurrentUser() { return localStorage.getItem('currentUser'); }
function clearCurrentUser() { localStorage.removeItem('currentUser'); }

// ===== SHOW MESSAGE =====
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'msg ' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'msg'; }, 3500);
}

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.opacity = '0.9';
  } else {
    input.type = 'password';
    btn.style.opacity = '0.4';
  }
}

// ===== REGISTER =====
function register() {
  const name = document.getElementById('regName').value.trim();
  const pass = document.getElementById('regPassword').value;

  if (!name) { showMsg('regMsg', '⚠️ Ism kiritilmadi!', 'error'); return; }
  if (pass.length < 4) { showMsg('regMsg', '⚠️ Parol kamida 4 ta belgi bo\'lsin!', 'error'); return; }

  const users = getUsers();
  if (users[name]) {
    showMsg('regMsg', '⚠️ Bu ism allaqachon ro\'yxatdan o\'tgan!', 'error');
    return;
  }

  users[name] = pass;
  saveUsers(users);
  showMsg('regMsg', '✅ Ro\'yxatdan o\'tish muvaffaqiyatli!', 'success');

  document.getElementById('regName').value = '';
  document.getElementById('regPassword').value = '';
}

// ===== LOGIN =====
function login() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPassword').value;

  if (!name || !pass) {
    showMsg('loginMsg', '⚠️ Ism va parolni kiriting!', 'error');
    return;
  }

  const users = getUsers();
  if (users[name] && users[name] === pass) {
    showMsg('loginMsg', '✅ Kirish muvaffaqiyatli! Yo\'naltirilmoqda...', 'success');
    setCurrentUser(name);
    setTimeout(() => { window.location.href = 'app.html'; }, 1200);
  } else {
    showMsg('loginMsg', '❌ Ism yoki parol noto\'g\'ri!', 'error');
    shakeDom('loginCard');
  }
}

// Shake animation on wrong credentials
function shakeDom(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'transform 0.08s';
  const steps = ['-8px','8px','-6px','6px','-4px','4px','0px'];
  let i = 0;
  const interval = setInterval(() => {
    el.style.transform = `translateX(${steps[i]})`;
    i++;
    if (i >= steps.length) { clearInterval(interval); el.style.transform = ''; }
  }, 60);
}

// Enter key triggers login/register
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (!active) return;
    const id = active.id;
    if (id === 'regName' || id === 'regPassword') register();
    if (id === 'loginName' || id === 'loginPassword') login();
  }
});

// ===== APP PAGE LOGIC =====
if (document.getElementById('welcomeName')) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
  } else {
    const nameEl = document.getElementById('welcomeName');
    const avatarEl = document.getElementById('avatarCircle');
    nameEl.textContent = user;
    if (avatarEl) avatarEl.textContent = user.charAt(0).toUpperCase();
  }
}

// ===== LOGOUT =====
function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

// ===== TEXT TO SPEECH =====
function speak() {
  const text = document.getElementById('ttsText')?.value.trim();
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'uz-UZ';
  utterance.rate = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// ===== SLIDER =====
let currentSlide = 0;
const totalSlides = 3;

function updateSlider() {
  const slides = document.getElementById('slides');
  const idx = document.getElementById('slideIndex');
  if (slides) slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (idx) idx.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

// Auto-slide every 4s
if (document.getElementById('slides')) {
  setInterval(nextSlide, 4000);
}
