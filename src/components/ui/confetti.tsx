import { useEffect } from 'react';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  drift?: number;
  gravity?: number;
  decay?: number;
  startVelocity?: number;
  ticks?: number;
}

export const useConfetti = () => {
  const confetti = (options: ConfettiOptions = {}) => {
    const {
      particleCount = 100,
      spread = 45,
      origin = { x: 0.5, y: 0.5 },
      colors = ['#26ccff', '#a25afd', '#ff5722', '#4caf50', '#ffeb3b'],
      scalar = 1,
      gravity = 1,
      decay = 0.9,
      startVelocity = 30,
      ticks = 200
    } = options;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      decay: number;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = (spread * (Math.random() - 0.5) * Math.PI) / 180;
      const velocity = startVelocity * (0.75 + Math.random() * 0.5);
      
      particles.push({
        x: canvas.width * (origin.x || 0.5),
        y: canvas.height * (origin.y || 0.5),
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: decay,
        size: scalar * (5 + Math.random() * 5)
      });
    }

    let frame = 0;
    const animate = () => {
      if (frame >= ticks) {
        document.body.removeChild(canvas);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += gravity;
        particle.life *= particle.decay;
        
        if (particle.life > 0.1) {
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  return { confetti };
};

export const triggerConfetti = (options?: ConfettiOptions) => {
  const { confetti } = useConfetti();
  confetti(options);
};