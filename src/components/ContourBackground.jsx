import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ContourBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;
    let t = 0;
    let isVisible = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Grid parameters
    const step = 42;
    // Isovalues for contour lines
    const isovals = [-0.65, -0.4, -0.15, 0.1, 0.35, 0.6];

    // Smooth field generator
    const evaluateField = (x, y, time) => {
      const s1 = Math.sin(x * 0.0018 + time * 0.07) * Math.cos(y * 0.0022 - time * 0.05);
      const s2 = Math.sin((x + y) * 0.0014 + time * 0.04);
      const s3 = Math.cos((x * 0.8 - y * 1.2) * 0.0016 - time * 0.03);
      return s1 * 0.55 + s2 * 0.3 + s3 * 0.15;
    };

    // Edge linear interpolation
    const interp = (x1, y1, v1, x2, y2, v2, iso) => {
      if (Math.abs(v2 - v1) < 0.00001) return [x1, y1];
      const frac = (iso - v1) / (v2 - v1);
      return [x1 + frac * (x2 - x1), y1 + frac * (y2 - y1)];
    };

    const drawFrame = (currentTime) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(drawFrame);
        return;
      }

      // Throttle to ~20fps (50ms interval)
      if (currentTime - lastTime < 48 && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawFrame);
        return;
      }
      lastTime = currentTime;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Read contour color from CSS variables
      const contourColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-contour').trim() || (theme === 'attack' ? '#5A3441' : '#9DB4C8');

      ctx.strokeStyle = contourColor;
      ctx.lineWidth = 0.85;
      ctx.globalAlpha = theme === 'attack' ? 0.32 : 0.42;

      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;

      // Compute grid values
      const grid = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        const y = r * step;
        for (let c = 0; c < cols; c++) {
          const x = c * step;
          grid[r * cols + c] = evaluateField(x, y, t);
        }
      }

      // Draw marching squares for each isovalue
      for (const iso of isovals) {
        ctx.beginPath();
        for (let r = 0; r < rows - 1; r++) {
          const y0 = r * step;
          const y1 = (r + 1) * step;
          for (let c = 0; c < cols - 1; c++) {
            const x0 = c * step;
            const x1 = (c + 1) * step;

            const v0 = grid[r * cols + c];           // top-left
            const v1 = grid[r * cols + (c + 1)];       // top-right
            const v2 = grid[(r + 1) * cols + (c + 1)]; // bottom-right
            const v3 = grid[(r + 1) * cols + c];       // bottom-left

            let cellCase = 0;
            if (v0 > iso) cellCase |= 1;
            if (v1 > iso) cellCase |= 2;
            if (v2 > iso) cellCase |= 4;
            if (v3 > iso) cellCase |= 8;

            if (cellCase === 0 || cellCase === 15) continue;

            const top = interp(x0, y0, v0, x1, y0, v1, iso);
            const right = interp(x1, y0, v1, x1, y1, v2, iso);
            const bottom = interp(x0, y1, v3, x1, y1, v2, iso);
            const left = interp(x0, y0, v0, x0, y1, v3, iso);

            switch (cellCase) {
              case 1:
              case 14:
                ctx.moveTo(left[0], left[1]);
                ctx.lineTo(top[0], top[1]);
                break;
              case 2:
              case 13:
                ctx.moveTo(top[0], top[1]);
                ctx.lineTo(right[0], right[1]);
                break;
              case 3:
              case 12:
                ctx.moveTo(left[0], left[1]);
                ctx.lineTo(right[0], right[1]);
                break;
              case 4:
              case 11:
                ctx.moveTo(right[0], right[1]);
                ctx.lineTo(bottom[0], bottom[1]);
                break;
              case 5:
                ctx.moveTo(left[0], left[1]);
                ctx.lineTo(top[0], top[1]);
                ctx.moveTo(right[0], right[1]);
                ctx.lineTo(bottom[0], bottom[1]);
                break;
              case 6:
              case 9:
                ctx.moveTo(top[0], top[1]);
                ctx.lineTo(bottom[0], bottom[1]);
                break;
              case 7:
              case 8:
                ctx.moveTo(left[0], left[1]);
                ctx.lineTo(bottom[0], bottom[1]);
                break;
              case 10:
                ctx.moveTo(top[0], top[1]);
                ctx.lineTo(right[0], right[1]);
                ctx.moveTo(left[0], left[1]);
                ctx.lineTo(bottom[0], bottom[1]);
                break;
              default:
                break;
            }
          }
        }
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        t += 0.015;
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
}
