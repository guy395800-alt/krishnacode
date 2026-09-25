// Pure HTML5 Canvas Confetti Engine (Zero-Dependency)
// Provides realistic celebratory fireworks & multicolored confetti particles

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const canvasId = 'nexgen-confetti-canvas';
  let canvas = document.getElementById(canvasId);

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1'];
  const particles = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: width * (0.4 + Math.random() * 0.2),
      y: height * 0.5,
      r: Math.random() * 6 + 3,
      d: Math.random() * count,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      gravity: 0.35,
      opacity: 1
    });
  }

  let animationFrameId;
  let startTime = Date.now();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    let stillAlive = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.tiltAngle += p.tiltAngleIncremental;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.opacity -= 0.008;

      if (p.opacity > 0 && p.y < height + 50) {
        stillAlive = true;
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;

    if (stillAlive && Date.now() - startTime < 3000) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  draw();
}
