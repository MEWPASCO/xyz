// Animated background orbs + motion preferences.
// (File name kept as hexbg.js so every page that loads it keeps working.)
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hexCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const TWO_PI = Math.PI * 2;
  const SCALE = 0.5;          // render at half resolution; CSS scales it up (the gradients are soft)
  const SPEED = 0.12;         // radians per second (same pace as the old 0.002/frame at 60Hz)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let time = 0;
  let last = 0;
  let rafId = 0;

  function resizeCanvas() {
    canvas.width = Math.max(1, Math.round(window.innerWidth * SCALE));
    canvas.height = Math.max(1, Math.round(window.innerHeight * SCALE));
    draw(); // repaint immediately so a resize never shows a blank frame
  }

  function orb(cx, cy, radius, rgb, alpha) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const big = Math.max(w, h);

    ctx.clearRect(0, 0, w, h);

    // Orb 1: deep violet
    orb(w / 2 + Math.cos(time) * w * 0.3,
        h / 2 + Math.sin(time * 0.8) * h * 0.3,
        big * 0.4, '67, 24, 255', 0.18);

    // Orb 2: vibrant magenta
    orb(w / 2 + Math.sin(time * 1.1) * w * 0.25,
        h / 2 + Math.cos(time * 0.9) * h * 0.25,
        big * 0.35, '255, 0, 204', 0.15);

    // Orb 3: subtle cyan
    orb(w / 2 + Math.cos(time * 1.3) * w * 0.2,
        h / 2 + Math.sin(time * 1.2) * h * 0.2,
        big * 0.3, '0, 255, 255', 0.08);
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1); // clamp so a tab switch doesn't make it jump
    last = now;
    time += dt * SPEED;
    draw();
  }

  function start() {
    if (rafId || reducedMotion.matches || document.hidden) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // Debounced resize so dragging the window doesn't thrash the canvas
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 120);
  });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  // Respect "reduce motion": show one still frame and pause the video
  const video = document.querySelector('.gif-container video');
  function applyMotionPreference() {
    if (reducedMotion.matches) {
      stop();
      draw();
      if (video) video.pause();
    } else {
      start();
      if (video) video.play().catch(() => {});
    }
  }
  reducedMotion.addEventListener('change', applyMotionPreference);

  resizeCanvas();
  applyMotionPreference();
});
