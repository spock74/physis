'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const LogisticMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [r, setR] = useState<number>(3.5);
  const [x0, setX0] = useState<number>(0.2);
  const [iterations, setIterations] = useState<number>(50);
  
  const animationFrameId = useRef<number>(0);

  const t = useTranslations('LogisticMap');

  const draw = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    currentR: number,
    currentX0: number,
    currentIterations: number
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const mapX = (x: number) => x * width;
    const mapY = (y: number) => height - y * height;

    ctx.strokeStyle = '#9ca3af'; // gray-400
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(1), mapY(0));
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(0), mapY(1));
    ctx.stroke();
    
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(1), mapY(1));
    ctx.stroke();

    ctx.strokeStyle = '#ef4444'; // red-500
    ctx.beginPath();
    for (let i = 0; i <= width; i++) {
      const x = i / width;
      const y = currentR * x * (1 - x);
      if (y >= 0 && y <= 1) {
        if (i === 0) ctx.moveTo(mapX(x), mapY(y));
        else ctx.lineTo(mapX(x), mapY(y));
      }
    }
    ctx.stroke();

    let x = currentX0;
    let y = 0;
    let iter = 0;

    const animateCobweb = () => {
        if (iter >= currentIterations) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            return;
        }

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // emerald-500
        ctx.lineWidth = 1;

        const nextY = currentR * x * (1 - x);
        ctx.beginPath();
        ctx.moveTo(mapX(x), mapY(y));
        ctx.lineTo(mapX(x), mapY(nextY));
        ctx.stroke();
        y = nextY;

        const nextX = y;
        ctx.beginPath();
        ctx.moveTo(mapX(x), mapY(y));
        ctx.lineTo(mapX(nextX), mapY(y));
        ctx.stroke();
        
        x = nextX;
        iter++;
        
        animationFrameId.current = requestAnimationFrame(animateCobweb);
    };
    
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animateCobweb();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        const container = containerRef.current;
        if(container) {
            const size = container.clientWidth;
            canvas.width = size;
            canvas.height = size;
            draw(ctx, canvas, r, x0, iterations);
        }
    }

    const debounceTimeout = setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);

    return () => {
        clearTimeout(debounceTimeout);
        window.removeEventListener('resize', resizeCanvas);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, [r, x0, iterations, draw]);

  return (
    <div className="flex flex-col items-center font-sans gap-4 bg-background p-4 sm:p-8 rounded-lg text-foreground max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary">{t('title')}</h2>
      
      <div ref={containerRef} className="w-full aspect-square">
        <canvas ref={canvasRef} className="border border-secondary rounded-md" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 items-center">
        <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
            <label htmlFor="r-slider" className="font-medium text-primary">r:</label>
            <input id="r-slider" type="range" min="0" max="4" step="0.01" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full"/>
            <span className="font-mono text-sm">{r.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
            <label htmlFor="x0-slider" className="font-medium text-primary">x₀:</label>
            <input id="x0-slider" type="range" min="0.01" max="0.99" step="0.01" value={x0} onChange={(e) => setX0(parseFloat(e.target.value))} className="w-full"/>
            <span className="font-mono text-sm">{x0.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
            <label htmlFor="iter-slider" className="font-medium text-primary">{t('iterations')}:</label>
            <input id="iter-slider" type="range" min="5" max="200" step="1" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value, 10))} className="w-full"/>
            <span className="font-mono text-sm">{iterations}</span>
        </div>
      </div>

       <div className="w-full mt-4 text-sm text-gray-600 space-y-4">
          <p>{t('description')}</p>
          <ul className="list-disc list-inside text-left space-y-1">
              <li><strong className="text-red-500">{t('parabolaLabel')}:</strong> {t('parabolaDesc')}</li>
              <li><strong className="text-blue-500">{t('lineLabel')}:</strong> {t('lineDesc')}</li>
              <li><strong className="text-emerald-500">{t('cobwebLabel')}:</strong> {t('cobwebDesc')}</li>
          </ul>
          <p>{t('adjustmentHint')}</p>
      </div>
    </div>
  );
};

export default LogisticMap;
