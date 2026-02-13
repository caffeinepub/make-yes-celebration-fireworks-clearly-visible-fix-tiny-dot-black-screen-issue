import { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

export default function FloatingHeartsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create hearts
    const hearts: Heart[] = [];
    const heartCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);

    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.2,
        drift: Math.random() * 2 - 1,
      });
    }

    // Draw heart shape
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      
      // Left curve
      ctx.bezierCurveTo(
        x, y,
        x - size / 2, y,
        x - size / 2, y + topCurveHeight
      );
      
      ctx.bezierCurveTo(
        x - size / 2, y + (size + topCurveHeight) / 2,
        x, y + (size + topCurveHeight) / 1.2,
        x, y + size
      );
      
      // Right curve
      ctx.bezierCurveTo(
        x, y + (size + topCurveHeight) / 1.2,
        x + size / 2, y + (size + topCurveHeight) / 2,
        x + size / 2, y + topCurveHeight
      );
      
      ctx.bezierCurveTo(
        x + size / 2, y,
        x, y,
        x, y + topCurveHeight
      );
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hearts.forEach((heart) => {
        drawHeart(heart.x, heart.y, heart.size, heart.opacity);

        // Move heart up
        heart.y -= heart.speed;
        heart.x += heart.drift * 0.3;

        // Reset heart when it goes off screen
        if (heart.y + heart.size < 0) {
          heart.y = canvas.height + heart.size;
          heart.x = Math.random() * canvas.width;
        }

        // Wrap horizontally
        if (heart.x < -heart.size) heart.x = canvas.width + heart.size;
        if (heart.x > canvas.width + heart.size) heart.x = -heart.size;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #fce4ec, #f8bbd0)' }}
    />
  );
}
