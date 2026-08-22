/* ==========================================================================
   THE ROYAL 3D WEDDING INVITATION • INTERACTIVE ENGINE
   Shaik Mannur Kaleem & Shaik Roshni
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeOpeningCeremony();
  initEnvelope3DTilt();
  initCountdown();
  initAmbientCanvas();
  initSoundAtmosphere();
  initShareEngine();
  initVenueActions();
  initPhotoLightbox();
});

/* ==========================================================================
   1. ACT 0: REALISTIC 3D ENVELOPE OPENING CEREMONY
   ========================================================================== */
let isEnvelopeOpened = false;

function initEnvelopeOpeningCeremony() {
  const overlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openEnvelopeBtn');
  const reopenBtn = document.getElementById('reopenEnvelopeBtn');

  function openEnvelope() {
    if (isEnvelopeOpened || !overlay) return;
    isEnvelopeOpened = true;

    // Haptic feedback if supported
    if (navigator.vibrate) {
      try { navigator.vibrate([25, 40, 25]); } catch (e) {}
    }

    // 1. Play Royal Harp Chord progression
    playRoyalChimeSequence();

    // 2. Start ambient background music
    startAtmosphereSound();

    // 3. Trigger celebratory confetti shower
    setTimeout(() => {
      triggerCelebrationConfetti();
    }, 600);

    // 4. Smoothly unveil envelope overlay with 4-stage physics:
    // - Seal breaks & aura flares (0ms)
    // - Flap rotates open in 3D (240ms)
    // - Letter card slides up out of pocket (800ms)
    // - Camera zooms into letter & dissolves (1400ms - 2400ms)
    overlay.classList.add('opened');

    showToast('✨ Welcome to Kaleem & Roshni’s Wedding Invitation');
  }

  function reopenEnvelope() {
    if (!isEnvelopeOpened || !overlay) return;
    isEnvelopeOpened = false;

    overlay.classList.remove('opened');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('💌 Envelope Re-Sealed');
  }

  if (openBtn) {
    openBtn.addEventListener('click', openEnvelope);
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', reopenEnvelope);
  }
}

/* 3D Cursor / Device Tilt on Envelope */
function initEnvelope3DTilt() {
  const assembly = document.querySelector('.envelope-3d-assembly');
  if (!assembly) return;

  document.addEventListener('mousemove', (e) => {
    if (isEnvelopeOpened) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * -16;
    assembly.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', (e) => {
      if (isEnvelopeOpened || !e.gamma || !e.beta) return;
      const gamma = Math.max(-20, Math.min(20, e.gamma)) * 0.4;
      const beta = Math.max(-20, Math.min(20, e.beta - 45)) * -0.4;
      assembly.style.transform = `rotateX(${beta}deg) rotateY(${gamma}deg)`;
    });
  }
}

function playRoyalChimeSequence() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    setTimeout(() => playChime(392.00, 1.2), 100);  // G4
    setTimeout(() => playChime(523.25, 1.3), 350);  // C5
    setTimeout(() => playChime(659.25, 1.4), 650);  // E5
    setTimeout(() => playChime(783.99, 1.8), 950);  // G5
  } catch (e) {
    console.log('Audio chord exception:', e);
  }
}

/* ==========================================================================
   2. PRECISION COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const weddingDate = new Date('2026-09-27T11:30:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. AMBIENT CANVAS & GOLDEN STARDUST PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -Math.random() * 0.45 - 0.15;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.3 ? '#fae084' : '#ffffff';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 5;
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fae084';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();

  // Mouse Follower Glow
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }
}

/* ==========================================================================
   4. WEB AUDIO HARMONIC CHIMES & ATMOSPHERE
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientOsc1 = null, ambientOsc2 = null, ambientGain = null;

function playChime(freq, duration = 1.0) {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log('Chime error:', e);
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

    if (ambientOsc1) return; // already playing

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc2 = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4

    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4

    ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 2.0);

    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientOsc1.start();
    ambientOsc2.start();

    isAudioPlaying = true;
    document.body.classList.add('audio-active');
  } catch (e) {
    console.log('Atmosphere sound error:', e);
  }
}

function stopAtmosphereSound() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (ambientOsc1) { ambientOsc1.stop(); ambientOsc1.disconnect(); ambientOsc1 = null; }
      if (ambientOsc2) { ambientOsc2.stop(); ambientOsc2.disconnect(); ambientOsc2 = null; }
      isAudioPlaying = false;
      document.body.classList.remove('audio-active');
    }, 500);
  }
}

function initSoundAtmosphere() {
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        stopAtmosphereSound();
        showToast('🔇 Music Muted');
      } else {
        startAtmosphereSound();
        showToast('🎵 Wedding Atmosphere On');
      }
    });
  }
}

/* ==========================================================================
   5. CELEBRATION CONFETTI SHOWER
   ========================================================================== */
function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  confetti({
    particleCount: 60,
    spread: 75,
    origin: { y: 0.6 },
    colors: ['#fae084', '#d4af37', '#ffffff', '#ffd1dc', '#93c5fd']
  });

  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: ['#fae084', '#d4af37', '#ffffff']
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: ['#fae084', '#d4af37', '#ffffff']
    });
  }, 250);
}

/* ==========================================================================
   6. CALENDAR (.ICS & GOOGLE) GENERATORS
   ========================================================================== */
function addToGoogleCalendar(eventKey) {
  let title, details, start, end, location = 'PVR Function Hall, Gudur, Andhra Pradesh 524101';

  if (eventKey === 'haldi') {
    title = 'Kaleem & Roshni - Haldi Ceremony & Dinner';
    details = 'Haldi ceremony and dinner celebration for the wedding of Shaik Mannur Kaleem & Shaik Roshni.';
    start = '20260926T150000Z'; // 8:30 PM IST (UTC + 5:30)
    end = '20260926T173000Z';
  } else {
    title = 'The Wedding of Kaleem & Roshni (Ceremony & Lunch)';
    details = 'Auspicious wedding ceremony and grand feast (Walima) for Shaik Mannur Kaleem & Shaik Roshni.';
    start = '20260927T060000Z'; // 11:30 AM IST
    end = '20260927T103000Z';
  }

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(url, '_blank');
  showToast('📅 Opening Google Calendar...');
}

function downloadICS(eventKey) {
  let title, start, end, details;
  const location = 'PVR Function Hall, Gudur, Andhra Pradesh 524101';

  if (eventKey === 'haldi') {
    title = 'Kaleem & Roshni - Haldi Ceremony & Dinner';
    start = '20260926T203000';
    end = '20260926T230000';
    details = 'Haldi celebration for Shaik Mannur Kaleem & Shaik Roshni';
  } else {
    title = 'The Wedding of Kaleem & Roshni';
    start = '20260927T113000';
    end = '20260927T160000';
    details = 'Wedding Ceremony & Grand Lunch for Shaik Mannur Kaleem & Shaik Roshni';
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kaleem & Roshni Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${title}
DTSTART;TZID=Asia/Kolkata:${start}
DTEND;TZID=Asia/Kolkata:${end}
LOCATION:${location}
DESCRIPTION:${details}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${eventKey}_kaleem_roshni_wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Calendar (.ics) downloaded');
}

/* ==========================================================================
   7. SHARE & VENUE ACTIONS
   ========================================================================== */
function initShareEngine() {
  const shareText = `💌 You are cordially invited to the Wedding Celebrations of Shaik Mannur Kaleem & Shaik Roshni on September 26 & 27, 2026 in Gudur, AP! View the invitation here: ${window.location.href}`;

  function share() {
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Invitation • Kaleem & Roshni',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  }

  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) shareBtn.addEventListener('click', share);
}

function initVenueActions() {
  const copyBtn = document.getElementById('copy-address-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const addr = "PVR Function Hall, Near RTC Bus Stand, New Balaji Nagar, East Gudur Rural, Andhra Pradesh 524101";
      navigator.clipboard.writeText(addr).then(() => {
        showToast('📋 Venue address copied to clipboard');
      });
    });
  }
}

/* ==========================================================================
   8. PHOTO LIGHTBOX MODAL
   ========================================================================== */
function initPhotoLightbox() {
  const trigger = document.getElementById('open-photo-lightbox');
  const modal = document.getElementById('photo-lightbox');
  const closeBtn = document.getElementById('close-lightbox-btn');
  const backdrop = document.getElementById('lightbox-backdrop');

  function open() {
    if (modal) modal.classList.add('active');
  }

  function close() {
    if (modal) modal.classList.remove('active');
  }

  if (trigger) trigger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      close();
    }
  });
}

/* ==========================================================================
   9. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3200);
}
