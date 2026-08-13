document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('hexCanvas');
  const ctx = canvas.getContext('2d');

  const spacing = 45; // Distance between grid lines
  const colorRGB = '255, 255, 255'; // Clean white for the grid

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ⏱️ 60 FPS Limiter
  let lastTime = 0;
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;
  let time = 0;

  function animate(currentTime) {
    requestAnimationFrame(animate);
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameInterval) {
      lastTime = currentTime - (deltaTime % frameInterval);
      time += 0.008; // How fast the fading patches move

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;

      for (let y = 0; y < canvas.height + spacing; y += spacing) {
        for (let x = 0; x < canvas.width + spacing; x += spacing) {
          
          // ✨ The Math Magic: Creates moving interference patterns
          let patchWave = (Math.sin(x * 0.005 + time) + Math.cos(y * 0.008 - time * 0.8) + Math.sin((x + y) * 0.004 + time * 0.5)) / 3;
          
          // Maps negative values to 0 (creates the completely missing patches)
          let alpha = Math.max(0, patchWave * 2.0); 

          if (alpha > 0.02) { // Only draw if it's visible enough
            // Draw grid dot
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colorRGB}, ${alpha.toFixed(2)})`;
            ctx.fill();

            // Connect line to the right
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + spacing, y);
            ctx.strokeStyle = `rgba(${colorRGB}, ${(alpha * 0.25).toFixed(2)})`; // Lines are much softer than dots
            ctx.stroke();

            // Connect line downwards
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + spacing);
            ctx.strokeStyle = `rgba(${colorRGB}, ${(alpha * 0.25).toFixed(2)})`;
            ctx.stroke();
          }
        }
      }
    }
  }

  requestAnimationFrame(animate); 
});