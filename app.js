/* ==========================================================================
   THE ROYAL 3D WEDDING INVITATION • INTERACTIVE & DYNAMIC ENGINE
   Shaik Mannur Kaleem & Shaik Roshni
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  init3DCardInteraction();
  initDynamicTiltPhysics();
  initCountdown();
  initAmbientCanvas();
  initSoundAtmosphere();
  initShareEngine();
  initVenueActions();
  initPhotoLightbox();
});

/* ==========================================================================
   1. 3D CARD OPENING & UNFOLDING CONTROLLER
   ========================================================================== */
let isCardOpened = false;

function init3DCardInteraction() {
  const cardWrapper = document.getElementById('main-3d-card');
  const sealTrigger = document.getElementById('open-seal-trigger');
  const toggleCardBtn = document.getElementById('toggle-card-btn');
  const cardStateText = document.getElementById('card-state-text');

  function openCard() {
    if (isCardOpened || !cardWrapper) return;
    isCardOpened = true;

    // Trigger celebratory sparkles
    triggerCelebrationConfetti();

    // Start background atmosphere
    startAtmosphereSound();

    // Open card with 3D flap physics
    cardWrapper.classList.add('is-opened');

    if (cardStateText) cardStateText.innerText = 'Fold Card';
    showToast('✨ Invitation Unfolded in 3D');
  }

  function closeCard() {
    if (!isCardOpened || !cardWrapper) return;
    isCardOpened = false;

    // Re-fold card
    cardWrapper.classList.remove('is-opened');

    if (cardStateText) cardStateText.innerText = 'Open Card';
    showToast('💌 Invitation Re-Folded');
  }

  if (sealTrigger) {
    sealTrigger.addEventListener('click', openCard);
  }

  if (toggleCardBtn) {
    toggleCardBtn.addEventListener('click', () => {
      if (isCardOpened) {
        closeCard();
      } else {
        openCard();
      }
    });
  }
}

/* ==========================================================================
   2. UNIVERSAL DYNAMIC TILT PHYSICS (MOUSE + GYROSCOPE + TOUCH)
   ========================================================================== */
function initDynamicTiltPhysics() {
  const viewport = document.getElementById('viewport-stage');
  const card = document.getElementById('main-3d-card');

  if (!viewport || !card) return;

  // A. Desktop Mouse Movement
  viewport.addEventListener('mousemove', (e) => {
    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  viewport.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  // B. Mobile Gyroscope / Device Orientation
  if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ permission request on user interaction
    document.body.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().then((state) => {
        if (state === 'granted') {
          bindGyroscope(card);
        }
      }).catch(() => {});
    }, { once: true });
  } else if (window.DeviceOrientationEvent) {
    // Android & standard mobile browsers
    bindGyroscope(card);
  }

  // C. Mobile Touch Dragging Tilt
  let touchStartX = 0;
  let touchStartY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && !isCardOpened) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      const rotateY = Math.max(Math.min(deltaX * 0.08, 10), -10);
      const rotateX = Math.max(Math.min(deltaY * -0.08, 10), -10);

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isCardOpened) {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  }, { passive: true });
}

function bindGyroscope(card) {
  window.addEventListener('deviceorientation', (e) => {
    if (!card) return;
    const gamma = e.gamma; // Left to right [-90, 90]
    const beta = e.beta;   // Front to back [-180, 180]

    if (gamma !== null && beta !== null) {
      const rotateY = Math.max(Math.min(gamma * 0.25, 8), -8);
      const rotateX = Math.max(Math.min((beta - 45) * 0.2, 8), -8);

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Sunday, 27th September 2026 at 11:30 AM IST (UTC+5:30)
  const targetDate = new Date('2026-09-27T11:30:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. AMBIENT GOLDEN DUST CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = window.innerWidth < 768 ? 20 : 40;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      gold: Math.random() > 0.25
    });
  }

  function render() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(250, 224, 132, ${p.alpha})`
        : `rgba(255, 255, 255, ${p.alpha * 0.8})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   5. BACKGROUND WEDDING MUSIC SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let isSoundActive = false;
let soundLoopTimer = null;

function initSoundAtmosphere() {
  const btn = document.getElementById('sound-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (isSoundActive) {
        stopAtmosphereSound();
      } else {
        startAtmosphereSound();
      }
    });
  }
}

function startAtmosphereSound() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isSoundActive = true;
    const btn = document.getElementById('sound-btn');
    if (btn) btn.classList.add('audio-active');

    playAtmosphereLoop();
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function stopAtmosphereSound() {
  isSoundActive = false;
  if (soundLoopTimer) clearTimeout(soundLoopTimer);
  const btn = document.getElementById('sound-btn');
  if (btn) btn.classList.remove('audio-active');
  showToast('🔇 Music paused');
}

const melodyChimes = [
  { f: 261.63, d: 0.9 }, // C4
  { f: 329.63, d: 0.9 }, // E4
  { f: 392.00, d: 1.0 }, // G4
  { f: 523.25, d: 1.3 }, // C5
  { f: 440.00, d: 0.9 }, // A4
  { f: 392.00, d: 0.9 }, // G4
  { f: 329.63, d: 1.4 }  // E4
];

let chimeIndex = 0;

function playAtmosphereLoop() {
  if (!isSoundActive || !audioCtx) return;

  const current = melodyChimes[chimeIndex % melodyChimes.length];
  playChime(current.f, current.d);

  chimeIndex++;
  const delay = current.d * 850;
  soundLoopTimer = setTimeout(playAtmosphereLoop, delay);
}

function playChime(frequency, duration) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration * 1.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration * 1.6);
}

/* ==========================================================================
   6. SHARE ENGINE
   ========================================================================== */
function initShareEngine() {
  const shareText = "💍 *You're Invited!*\n\nExperience the 3D wedding invitation of *Shaik Mannur Kaleem & Shaik Roshni* on 26th & 27th September 2026 at PVR Function Hall, Gudur.\n\n✨ Open the invitation:\n" + window.location.href;

  function triggerShare() {
    triggerCelebrationConfetti();
    if (navigator.share) {
      navigator.share({
        title: "The Wedding of Kaleem & Roshni",
        text: shareText,
        url: window.location.href
      }).catch(() => {
        openWhatsApp();
      });
    } else {
      openWhatsApp();
    }
  }

  function openWhatsApp() {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }

  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) shareBtn.addEventListener('click', triggerShare);
}

/* ==========================================================================
   7. CALENDAR INTEGRATION
   ========================================================================== */
window.addToGoogleCalendar = function(type) {
  let title, details, location, start, end;

  if (type === 'haldi') {
    title = "Kaleem & Roshni - Haldi Ceremony & Festive Dinner";
    details = "Haldi & Dinner Celebration of Shaik Mannur Kaleem & Shaik Roshni at PVR Function Hall, Gudur.";
    location = "PVR Function Hall, New Balaji Nagar, East Gudur Rural, Andhra Pradesh 524101";
    start = "20260926T150000Z";
    end = "20260926T180000Z";
  } else {
    title = "The Wedding of Kaleem & Roshni";
    details = "Wedding Ceremony (11:30 AM) & Grand Lunch (12:30 PM) of Shaik Mannur Kaleem & Shaik Roshni.";
    location = "PVR Function Hall, Near RTC Bus Stand, New Balaji Nagar, East Gudur Rural, Andhra Pradesh 524101";
    start = "20260927T060000Z";
    end = "20260927T103000Z";
  }

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(url, '_blank');
};

/* ==========================================================================
   8. VENUE ACTIONS
   ========================================================================== */
function initVenueActions() {
  const copyBtn = document.getElementById('copy-address-btn');
  const address = "PVR Function Hall, Near the RTC Bus Stand, New Balaji Nagar, East Gudur Rural, Andhra Pradesh – 524101";

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(address, '📍 Venue address copied to clipboard!');
    });
  }
}

/* ==========================================================================
   9. PHOTO LIGHTBOX MODAL
   ========================================================================== */
function initPhotoLightbox() {
  const trigger = document.getElementById('open-photo-lightbox');
  const modal = document.getElementById('photo-lightbox');
  const closeBtn = document.getElementById('close-lightbox-btn');
  const backdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(e) {
    e.stopPropagation();
    if (modal) modal.classList.add('active');
  }

  function closeLightbox() {
    if (modal) modal.classList.remove('active');
  }

  if (trigger) trigger.addEventListener('click', openLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
}

/* ==========================================================================
   UTILITIES
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-sparkles"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  showToast(successMsg);
}

function triggerCelebrationConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#fae084', '#d4af37', '#ffffff', '#25D366', '#f472b6']
    });
  }
}
