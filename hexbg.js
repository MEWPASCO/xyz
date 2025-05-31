document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('hexCanvas');
  const ctx = canvas.getContext('2d');

  const config = window.HEX_CONFIG || {};
  const hexSize = config.size || 10;
  const spacing = hexSize * 3.5;
  const speed = config.speed || 0.2;
  const colors = config.colors || [
    'rgba(0, 255, 255, OPACITY)',
    'rgba(255, 0, 255, OPACITY)',
    'rgba(255, 128, 255, OPACITY)'
  ];

  let hexes = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initHexes();
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });

  function initHexes() {
    hexes = [];
    for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
      for (let x = -spacing; x < canvas.width + spacing; x += spacing * 1.5) {
        const rowOffset = (Math.floor(y / spacing) % 2) * spacing * 0.75;
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        const phase = Math.random() * Math.PI * 2;
        hexes.push({ x: x + rowOffset, y, colorBase, phase });
      }
    }
  }

  function drawHex(x, y, size, rotation, color, glowAlpha) {
    const angle = Math.PI / 3;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const px = x + size * Math.cos(angle * i + rotation);
      const py = y + size * Math.sin(angle * i + rotation);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.shadowColor = color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgba($1,$2,$3,' + glowAlpha + ')');
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  let offset = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offset += speed;

    const driftX = Math.sin(offset * 0.01) * spacing;
    const driftY = Math.cos(offset * 0.01) * spacing;
    const parallaxX = mouseX * 20;
    const parallaxY = mouseY * 20;
    const timeFactor = Date.now() * 0.002;

    for (const hex of hexes) {
      const opacity = 0.03 + Math.abs(Math.sin(timeFactor + hex.phase)) * 0.1;
      const glow = 0.3 + Math.abs(Math.sin(timeFactor + hex.phase)) * 0.5;
      const finalColor = hex.colorBase.replace('OPACITY', opacity.toFixed(2));
      drawHex(
        hex.x + driftX + parallaxX,
        hex.y + driftY + parallaxY,
        hexSize,
        Math.PI / 4,
        finalColor,
        glow.toFixed(2)
      );
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
});
