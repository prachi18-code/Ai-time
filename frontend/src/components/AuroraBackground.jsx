import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AuroraBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initializer assets per universe
    const stars = [];
    const particles = [];
    const waves = [];
    const jellyfish = [];
    const petals = [];
    const ripples = [];
    const fishes = [];
    const birds = [];
    const shootingStars = [];
    const galaxyStars = [];
    const zenCircles = [];

    // Zen dust circles
    for (let i = 0; i < 20; i++) {
      zenCircles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 12 + Math.random() * 25,
        speedX: Math.random() * 0.15 - 0.07,
        speedY: -(Math.random() * 0.15 + 0.05),
        opacity: 0.03 + Math.random() * 0.05
      });
    }

    // Galaxy Star Generator
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        twinkleState: Math.random() * Math.PI,
        color: Math.random() > 0.5 ? '#a855f7' : '#06b6d4'
      });
    }

    // Galaxy Planets
    const planets = [
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.25, r: 40, color: '#311042', ring: true, speed: 0.0015, angle: 0 },
      { x: window.innerWidth * 0.15, y: window.innerHeight * 0.7, r: 20, color: '#042746', ring: false, speed: 0.003, angle: 0 }
    ];

    // Cosmic Spiral Galaxy Particles
    const galaxyCenterX = window.innerWidth * 0.4;
    const galaxyCenterY = window.innerHeight * 0.45;
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.pow(Math.random(), 2) * 160;
      const armOffset = (Math.random() > 0.5 ? 0 : Math.PI);
      galaxyStars.push({
        dist,
        baseAngle: angle,
        armOffset,
        speed: 0.0002 + (1 / dist) * 0.04,
        size: Math.random() * 1.5 + 0.3,
        color: Math.random() > 0.6 ? '#f472b6' : Math.random() > 0.3 ? '#c084fc' : '#38bdf8'
      });
    }

    // Zen Silk Waves setup
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        y: window.innerHeight * 0.55 + i * 70,
        length: 0.0008 + i * 0.0004,
        amplitude: 55 + i * 15,
        speed: 0.008 + i * 0.004,
        offset: i * Math.PI * 0.5
      });
    }

    // Sakura Petals
    for (let i = 0; i < 35; i++) {
      petals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        r: Math.random() * 4 + 2,
        d: Math.random() * 30 + 10,
        swing: Math.random() * 2,
        swingSpeed: 0.01 + Math.random() * 0.02,
        swingAngle: Math.random() * Math.PI,
        fallSpeed: 0.8 + Math.random() * 1.2
      });
    }

    // Sakura Birds setup
    for (let i = 0; i < 3; i++) {
      birds.push({
        x: -50 - Math.random() * 250,
        y: 80 + Math.random() * 180,
        size: 14 + Math.random() * 6,
        speedX: 0.7 + Math.random() * 0.5,
        speedY: Math.random() * 0.15 - 0.07,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.12 + Math.random() * 0.05
      });
    }

    // Ocean Jellyfish
    for (let i = 0; i < 4; i++) {
      jellyfish.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200,
        r: Math.random() * 20 + 15,
        speed: 0.4 + Math.random() * 0.5,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseAngle: Math.random() * Math.PI,
        tentaclesCount: 5 + Math.floor(Math.random() * 3)
      });
    }

    // Ocean Bubbles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 5 + 1.5,
        speedY: -(Math.random() * 0.7 + 0.2),
        speedX: Math.random() * 0.4 - 0.2
      });
    }

    // Ocean Fishes setup
    for (let i = 0; i < 5; i++) {
      fishes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: 22 + Math.random() * 14,
        speed: 0.35 + Math.random() * 0.45,
        angle: Math.random() * Math.PI * 2,
        wiggleSpeed: 0.08 + Math.random() * 0.08,
        wiggleAngle: Math.random() * Math.PI
      });
    }

    // Mouse click event for ripples in Ocean World
    const handleCanvasClick = (e) => {
      if (theme === 'ocean') {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80 + Math.random() * 60,
          opacity: 0.7,
          speed: 1.8 + Math.random() * 1.5
        });
      }
    };
    window.addEventListener('mousedown', handleCanvasClick);

    // Galactic Shooting Star Trigger
    const triggerShootingStar = () => {
      if (theme === 'galaxy' && Math.random() < 0.007 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.6,
          y: Math.random() * canvas.height * 0.3,
          dx: 5 + Math.random() * 4,
          dy: 2 + Math.random() * 2,
          length: 70 + Math.random() * 60,
          life: 1.0,
          decay: 0.015 + Math.random() * 0.015
        });
      }
    };

    let time = 0;

    // Draw Loop
    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (theme === 'zen') {
        // Cafe Light background
        ctx.fillStyle = '#FAF7F0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Soft sunlight rays
        const rayGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        rayGrad.addColorStop(0, 'rgba(253, 186, 116, 0.07)'); // warm orange glow
        rayGrad.addColorStop(0.3, 'rgba(254, 243, 199, 0.04)'); // warm yellow light
        rayGrad.addColorStop(0.7, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width * 0.45, 0);
        ctx.lineTo(canvas.width, canvas.height * 0.8);
        ctx.lineTo(0, canvas.height * 0.8);
        ctx.closePath();
        ctx.fill();

        // Render moving white silk waves
        ctx.lineWidth = 1.8;
        waves.forEach((w, index) => {
          ctx.beginPath();
          ctx.strokeStyle = index === 0 
            ? 'rgba(181, 130, 99, 0.05)' 
            : index === 1 
              ? 'rgba(224, 242, 254, 0.1)' 
              : 'rgba(255, 255, 255, 0.9)';
          ctx.fillStyle = index === 2 ? 'rgba(255, 255, 255, 0.55)' : 'transparent';
          
          for (let x = 0; x < canvas.width; x++) {
            const y = w.y + Math.sin(x * w.length + (time * w.speed) + w.offset) * w.amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          if (index === 2) {
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
          }
          ctx.stroke();
        });

        // Draw floating translucent circles
        zenCircles.forEach(c => {
          c.x += c.speedX;
          c.y += c.speedY;
          if (c.y < -c.r) {
            c.y = canvas.height + c.r;
            c.x = Math.random() * canvas.width;
          }
          ctx.fillStyle = 'rgba(181, 130, 99, 0.04)';
          ctx.globalAlpha = c.opacity;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

      } else if (theme === 'galaxy') {
        // Deep cosmic black background
        ctx.fillStyle = '#06030c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Purple nebula clouds
        const nebGrad = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.5, 0, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.6);
        nebGrad.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
        nebGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
        nebGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Twinkling Stars
        stars.forEach(s => {
          s.twinkleState += s.twinkleSpeed;
          const alpha = 0.2 + Math.abs(Math.sin(s.twinkleState)) * 0.8;
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 4;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        });

        // Draw Spiral Galaxy Clustered Stars
        galaxyStars.forEach(s => {
          s.baseAngle += s.speed;
          // Archimedean spiral formula: angle shifts based on distance
          const spiralAngle = s.baseAngle + s.dist * 0.015 + s.armOffset;
          const gx = galaxyCenterX + Math.cos(spiralAngle) * s.dist;
          const gy = galaxyCenterY + Math.sin(spiralAngle) * s.dist;

          ctx.fillStyle = s.color;
          ctx.globalAlpha = 0.12 + (1 - s.dist / 220) * 0.68;
          ctx.beginPath();
          ctx.arc(gx, gy, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Update & Draw Shooting Stars
        triggerShootingStar();
        shootingStars.forEach((ss, idx) => {
          ss.x += ss.dx;
          ss.y += ss.dy;
          ss.life -= ss.decay;
          
          if (ss.life <= 0) {
            shootingStars.splice(idx, 1);
            return;
          }
          
          const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y - ss.length * (ss.dy / ss.dx));
          grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
          grad.addColorStop(0.5, `rgba(168, 85, 247, ${ss.life * 0.5})`);
          grad.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - ss.length, ss.y - ss.length * (ss.dy / ss.dx));
          ctx.stroke();
        });

        // Floating Planets
        planets.forEach(p => {
          p.angle += p.speed;
          const py = p.y + Math.sin(p.angle) * 15;
          const px = p.x + Math.cos(p.angle) * 15;

          const grad = ctx.createRadialGradient(px - p.r*0.3, py - p.r*0.3, p.r * 0.2, px, py, p.r);
          grad.addColorStop(0, '#c084fc');
          grad.addColorStop(1, p.color);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();

          if (p.ring) {
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
            ctx.lineWidth = 3;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(0.3);
            ctx.scale(2, 0.35);
            ctx.beginPath();
            ctx.arc(0, 0, p.r * 1.15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        });

      } else if (theme === 'sakura') {
        // Deep purple-rose background
        ctx.fillStyle = '#0f070e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pink glow overlay
        const pinkGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
        pinkGrad.addColorStop(0, 'rgba(244, 114, 182, 0.08)');
        pinkGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pinkGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Warm golden sun rays
        const sunRayGrad = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height);
        sunRayGrad.addColorStop(0, 'rgba(253, 224, 71, 0.06)');
        sunRayGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.03)');
        sunRayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunRayGrad;
        ctx.beginPath();
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width * 0.5, 0);
        ctx.lineTo(0, canvas.height * 0.85);
        ctx.lineTo(canvas.width, canvas.height * 0.85);
        ctx.closePath();
        ctx.fill();

        // Draw Flapping Bird Silhouettes
        ctx.fillStyle = 'rgba(15, 7, 14, 0.45)';
        birds.forEach(b => {
          b.x += b.speedX;
          b.y += b.speedY;
          b.wingPhase += b.wingSpeed;

          if (b.x > canvas.width + 50) {
            b.x = -50;
            b.y = 80 + Math.random() * 180;
          }

          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.beginPath();
          
          const wingHeight = Math.sin(b.wingPhase) * b.size * 0.45;
          // Left wing
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-b.size * 0.5, -wingHeight - 2, -b.size, 0);
          ctx.quadraticCurveTo(-b.size * 0.5, -wingHeight + 3, 0, 0);
          // Right wing
          ctx.quadraticCurveTo(b.size * 0.5, -wingHeight - 2, b.size, 0);
          ctx.quadraticCurveTo(b.size * 0.5, -wingHeight + 3, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        // Falling Cherry Blossom petals & leaves
        petals.forEach(p => {
          p.y += p.fallSpeed;
          p.swingAngle += p.swingSpeed;
          p.x += Math.sin(p.swingAngle) * p.swing;

          if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.swingAngle);
          ctx.beginPath();
          // Alternate between pink petals and green leaf shapes
          if (p.r > 4.5) {
            ctx.fillStyle = 'rgba(52, 211, 153, 0.45)'; // leaf
            ctx.ellipse(0, 0, p.r * 1.5, p.r * 0.8, Math.PI / 4, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = 'rgba(244, 114, 182, 0.55)'; // petal
            ctx.ellipse(0, 0, p.r * 1.6, p.r, Math.PI / 4, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.restore();
        });

      } else if (theme === 'ocean') {
        // Deep Ocean Blue background
        ctx.fillStyle = '#010a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Underwater light shaft
        const shaft = ctx.createLinearGradient(0, 0, canvas.width * 0.4, canvas.height);
        shaft.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        shaft.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
        shaft.addColorStop(1, 'transparent');
        ctx.fillStyle = shaft;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2, 0);
        ctx.lineTo(canvas.width * 0.6, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Draw clicking ripples
        ctx.lineWidth = 1.8;
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed;
          r.opacity -= 0.015;
          if (r.opacity <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(6, 182, 212, ${r.opacity})`;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Ocean Fishes shadows
        ctx.fillStyle = 'rgba(2, 20, 36, 0.25)';
        fishes.forEach(f => {
          f.x += Math.cos(f.angle) * f.speed;
          f.y += Math.sin(f.angle) * f.speed;
          f.wiggleAngle += f.wiggleSpeed;

          if (f.x > canvas.width + 50) f.x = -50;
          if (f.x < -50) f.x = canvas.width + 50;
          if (f.y > canvas.height + 50) f.y = -50;
          if (f.y < -50) f.y = canvas.height + 50;

          // Draw fish body shadow
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-f.length * 0.4, f.length * 0.25, -f.length, 0);
          ctx.quadraticCurveTo(-f.length * 0.4, -f.length * 0.25, 0, 0);
          ctx.closePath();
          ctx.fill();

          // Fish tail shadow
          ctx.beginPath();
          const tailWiggle = Math.sin(f.wiggleAngle) * 5;
          ctx.moveTo(-f.length, 0);
          ctx.lineTo(-f.length - 8, -6 + tailWiggle);
          ctx.lineTo(-f.length - 8, 6 + tailWiggle);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        // Ocean Bubbles
        particles.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }

          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });

        // Swimming Jellyfish
        jellyfish.forEach(j => {
          j.pulseAngle += j.pulseSpeed;
          const scaleY = 0.9 + Math.sin(j.pulseAngle) * 0.15;
          j.y -= j.speed * scaleY;

          if (j.y < -j.r * 2) {
            j.y = canvas.height + j.r * 2;
            j.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.translate(j.x, j.y);
          ctx.scale(1, scaleY);
          
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.38)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, j.r, Math.PI, 0, false);
          ctx.quadraticCurveTo(j.r, j.r * 0.4, 0, j.r * 0.3);
          ctx.quadraticCurveTo(-j.r, j.r * 0.4, -j.r, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Tentacles
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 1.5;
          for (let i = 0; i < j.tentaclesCount; i++) {
            const tx = -j.r * 0.7 + (i * (j.r * 1.4)) / (j.tentaclesCount - 1);
            ctx.moveTo(tx, j.r * 0.3);
            
            const length = j.r * 2;
            ctx.bezierCurveTo(
              tx + Math.sin(time * 0.05 + i) * 6, j.r * 0.8,
              tx - Math.cos(time * 0.05 + i) * 6, j.r * 1.5,
              tx + Math.sin(time * 0.05 + i) * 4, j.r * 2
            );
          }
          ctx.stroke();
          ctx.restore();
        });

      } else if (theme === 'midnight') {
        // Luxury Night city background
        ctx.fillStyle = '#020204';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Constellation Stars
        stars.slice(0, 45).forEach(s => {
          s.twinkleState += s.twinkleSpeed * 0.5;
          const alpha = 0.3 + Math.abs(Math.sin(s.twinkleState)) * 0.7;
          ctx.fillStyle = '#e2e8f0';
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Draw faint constellation lines
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.04)';
        ctx.lineWidth = 0.7;
        for (let i = 0; i < 30; i += 2) {
          const s1 = stars[i];
          const s2 = stars[i + 1];
          if (s1 && s2) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }

        // Animated neon aurora ribbons
        ctx.lineWidth = 30;
        ctx.shadowBlur = 20;
        const aurColors = ['rgba(168, 85, 247, 0.05)', 'rgba(6, 182, 212, 0.04)', 'rgba(244, 114, 182, 0.04)'];
        aurColors.forEach((color, cIdx) => {
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          ctx.beginPath();
          const speed = 0.003 + cIdx * 0.001;
          const yOffset = canvas.height * 0.15 + cIdx * 25;
          for (let x = 0; x < canvas.width; x += 15) {
            const y = yOffset + Math.sin(x * 0.0025 + time * speed) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
        ctx.shadowBlur = 0;

        // Moon glow reflections & Moon shape
        const mx = canvas.width * 0.85;
        const my = canvas.height * 0.22;
        ctx.save();
        ctx.shadowColor = '#f1f5f9';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.arc(mx, my, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Moon mask to create crescent
        ctx.fillStyle = '#020204';
        ctx.beginPath();
        ctx.arc(mx - 8, my - 4, 22, 0, Math.PI * 2);
        ctx.fill();

        // Draw neon reflections at the bottom
        const reflectGrad = ctx.createLinearGradient(0, canvas.height * 0.9, 0, canvas.height);
        reflectGrad.addColorStop(0, 'transparent');
        reflectGrad.addColorStop(1, 'rgba(168, 85, 247, 0.06)');
        ctx.fillStyle = reflectGrad;
        ctx.fillRect(0, canvas.height * 0.88, canvas.width, canvas.height * 0.12);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none transition-colors duration-1000"
    />
  );
};

export default AuroraBackground;
