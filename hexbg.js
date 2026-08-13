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
    time += 0.003; // Slightly faster drift for a bit more life

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✨ Orb 1: Deep Violet (Increased opacity)
    const x1 = canvas.width / 2 + Math.cos(time) * canvas.width * 0.3;
    const y1 = canvas.height / 2 + Math.sin(time * 0.8) * canvas.height * 0.3;
    const r1 = Math.max(canvas.width, canvas.height) * 0.4;
    
    const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
    grad1.addColorStop(0, 'rgba(67, 24, 255, 0.18)'); // Much more visible
    grad1.addColorStop(1, 'rgba(67, 24, 255, 0)');
    
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.arc(x1, y1, r1, 0, Math.PI * 2);
    ctx.fill();

    // ✨ Orb 2: Vibrant Magenta (Increased opacity)
    const x2 = canvas.width / 2 + Math.sin(time * 1.1) * canvas.width * 0.25;
    const y2 = canvas.height / 2 + Math.cos(time * 0.9) * canvas.height * 0.25;
    const r2 = Math.max(canvas.width, canvas.height) * 0.35;
    
    const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
    grad2.addColorStop(0, 'rgba(255, 0, 204, 0.15)'); // More pop
    grad2.addColorStop(1, 'rgba(255, 0, 204, 0)');
    
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(x2, y2, r2, 0, Math.PI * 2);
    ctx.fill();

    // ✨ Orb 3: Subtle Cyan (The new addition for depth!)
    const x3 = canvas.width / 2 + Math.cos(time * 1.3) * canvas.width * 0.2;
    const y3 = canvas.height / 2 + Math.sin(time * 1.2) * canvas.height * 0.2;
    const r3 = Math.max(canvas.width, canvas.height) * 0.3;
    
    const grad3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
    grad3.addColorStop(0, 'rgba(0, 255, 255, 0.08)'); // Gentle cyan highlight
    grad3.addColorStop(1, 'rgba(0, 255, 255, 0)');
    
    ctx.fillStyle = grad3;
    ctx.beginPath();
    ctx.arc(x3, y3, r3, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
});