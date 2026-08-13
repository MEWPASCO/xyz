document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('hexCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.002; // Very slow, ambient drift

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✨ Orb 1: Deep Violet
    const x1 = canvas.width / 2 + Math.cos(time) * canvas.width * 0.3;
    const y1 = canvas.height / 2 + Math.sin(time * 0.8) * canvas.height * 0.3;
    const r1 = Math.max(canvas.width, canvas.height) * 0.4;
    
    const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
    grad1.addColorStop(0, 'rgba(67, 24, 255, 0.08)'); // Center of the glow
    grad1.addColorStop(1, 'rgba(67, 24, 255, 0)'); // Fades to invisible
    
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.arc(x1, y1, r1, 0, Math.PI * 2);
    ctx.fill();

    // ✨ Orb 2: Subtle Magenta
    const x2 = canvas.width / 2 + Math.sin(time * 1.1) * canvas.width * 0.25;
    const y2 = canvas.height / 2 + Math.cos(time * 0.9) * canvas.height * 0.25;
    const r2 = Math.max(canvas.width, canvas.height) * 0.35;
    
    const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
    grad2.addColorStop(0, 'rgba(255, 0, 204, 0.06)');
    grad2.addColorStop(1, 'rgba(255, 0, 204, 0)');
    
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(x2, y2, r2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
});