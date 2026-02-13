import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FireworksOverlayProps {
  intensity?: 'normal' | 'high';
}

export default function FireworksOverlay({ intensity = 'normal' }: FireworksOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const intervalIdsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#ff1744', '#ff4081', '#f50057', '#ff6090', '#ffc1e3', '#ffeb3b', '#ff9800', '#e91e63', '#ff5722'];

    // Mobile detection for performance scaling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const performanceScale = isMobile ? 0.7 : 1;

    // Intensity configuration
    const config = intensity === 'high' ? {
      particlesPerBurst: Math.floor(80 * performanceScale),
      initialBursts: Math.floor(12 * performanceScale),
      burstInterval: 250,
      maxParticles: Math.floor(1500 * performanceScale),
      multiBurstChance: 0.4,
    } : {
      particlesPerBurst: Math.floor(50 * performanceScale),
      initialBursts: Math.floor(8 * performanceScale),
      burstInterval: 400,
      maxParticles: Math.floor(1000 * performanceScale),
      multiBurstChance: 0.2,
    };

    const createFirework = (x: number, y: number) => {
      // Enforce max particle limit for performance
      if (particles.length > config.maxParticles) {
        return;
      }

      const particleCount = config.particlesPerBurst;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 4 + 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          age: 0,
          maxLife: Math.random() * 70 + 70,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 3.5,
        });
      }
    };

    const createMultiBurst = (baseX: number, baseY: number) => {
      // Create 2-3 bursts in close proximity
      const burstCount = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < burstCount; i++) {
        const offsetX = (Math.random() - 0.5) * 150;
        const offsetY = (Math.random() - 0.5) * 150;
        const timeout = setTimeout(() => {
          createFirework(baseX + offsetX, baseY + offsetY);
        }, i * 100);
        intervalIdsRef.current.push(timeout);
      }
    };

    // Create initial fireworks burst
    for (let i = 0; i < config.initialBursts; i++) {
      const timeout = setTimeout(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.1;
        
        if (Math.random() < config.multiBurstChance) {
          createMultiBurst(x, y);
        } else {
          createFirework(x, y);
        }
      }, i * 150);
      intervalIdsRef.current.push(timeout);
    }

    // Continue creating fireworks at regular intervals
    const mainInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.1;
      
      if (Math.random() < config.multiBurstChance) {
        createMultiBurst(x, y);
      } else {
        createFirework(x, y);
      }
    }, config.burstInterval);
    intervalIdsRef.current.push(mainInterval);

    const animate = () => {
      // Use very light transparent clear for subtle trails without darkening
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set composite mode for additive blending (brighter particles)
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Calculate alpha: start at 1.0, fade out in last 30% of life
        const lifeRatio = p.age / p.maxLife;
        const alpha = lifeRatio < 0.7 ? 1.0 : (1.0 - (lifeRatio - 0.7) / 0.3);
        
        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        
        // Reset shadow for next particle
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.99; // air resistance
        p.age++;

        if (p.age >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Reset composite mode
      ctx.globalCompositeOperation = 'source-over';

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Clear all intervals and timeouts
      intervalIdsRef.current.forEach(id => clearTimeout(id));
      intervalIdsRef.current = [];
      
      // Cancel animation frame
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      // Clear particles array
      particles.length = 0;
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
