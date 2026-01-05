// components/simulations/chaos-pendulum/ChaosPendulum.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDoublePendulum } from './useDoublePendulum';
import { Point } from './types';

const ChaosPendulum = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { integrateRK4, getPositions, reset } = useDoublePendulum();
  const requestRef = useRef<number | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(true);

  // Configurações de estilo
  const colors = {
    bob1: '#334155', // slate-700
    bob2: '#be123c', // rose-700 (o agente do caos)
    rod: '#94a3b8', // slate-400
    trace: 'rgba(190, 18, 60, 0.3)', // rose-700 com transparência
    bg: '#f8fafc', // slate-50 (creme muito suave)
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Limpa a tela
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);

    const center: Point = { x: width / 2, y: height / 2.5 }; // Ponto de pivô centralizado

    // 1. Avança a física um pequeno passo de tempo
    if (isRunning) {
        integrateRK4(0.15); // dt = 0.15 parece dar uma boa velocidade visual
    }

    // 2. Obtém as posições atuais
    const { p1, p2, trace } = getPositions(center);

    // 3. Desenha o rastro (Trace)
    if (trace.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trace[0].x, trace[0].y);
        for (let i = 1; i < trace.length; i++) {
            // Desenha linhas suaves entre os pontos do rastro
            ctx.lineTo(trace[i].x, trace[i].y);
        }
        ctx.strokeStyle = colors.trace;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 4. Desenha as hastes
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = colors.rod;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. Desenha as massas (bobs)
    // Bob 1
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = colors.bob1;
    ctx.fill();
    
    // Bob 2
    ctx.beginPath();
    ctx.arc(p2.x, p2.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = colors.bob2;
    ctx.fill();

    // Pivô central
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = colors.rod;
    ctx.fill();
  };

  // O Loop de Animação
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lida com telas de alta densidade (Retina) para não ficar borrado
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    const animate = () => {
      draw(ctx, width, height);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [integrateRK4, getPositions, isRunning]); // Recria o loop se as dependências mudarem

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <canvas
          ref={canvasRef}
          style={{ width: '600px', height: '400px' }}
          className="bg-slate-50 cursor-pointer"
          onClick={() => setIsRunning(!isRunning)}
          title="Clique para pausar/continuar"
        />
      </div>
      <div className="flex space-x-4 text-sm text-slate-600 font-serif">
        <button onClick={reset} className="hover:text-rose-700 transition-colors">
            Reiniciar
        </button>
        <span>|</span>
        <button onClick={() => setIsRunning(!isRunning)} className="hover:text-slate-900 transition-colors">
            {isRunning ? "Pausar" : "Continuar"}
        </button>
      </div>
      <p className="text-xs text-slate-400 font-serif italic max-w-md text-center">
        A sensibilidade às condições iniciais: uma mudança infinitesimal no ângulo inicial altera completamente o futuro do sistema.
      </p>
    </div>
  );
};

export default ChaosPendulum;
