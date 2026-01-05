// components/simulations/chaos-pendulum/useDoublePendulum.ts
import { useState, useCallback, useRef } from 'react';
import { PendulumState, PhysicsParams, Point } from './types';

// Estado inicial padrão (quase vertical, um pequeno empurrão gera o caos)
const initialState: PendulumState = {
  theta1: Math.PI / 2,
  omega1: 0,
  theta2: Math.PI / 2 + 0.1,
  omega2: 0,
};

const defaultParams: PhysicsParams = {
  m1: 10,
  m2: 10,
  l1: 100, // Unidades arbitrárias de pixels
  l2: 100,
  g: 9.81 * 10, // Gravidade ajustada para escala visual
  damping: 0.999, // Atrito muito leve
};

export const useDoublePendulum = () => {
  const stateRef = useRef<PendulumState>(initialState);
  const paramsRef = useRef<PhysicsParams>(defaultParams);
  // Usamos ref para o rastro para não causar re-renderizações do React a cada frame
  const traceRef = useRef<Point[]>([]);

  // --- O Coração Matemático: As Derivadas ---
  // Calcula as acelerações angulares baseadas no estado atual.
  // Estas equações vêm da Mecânica Lagrangiana.
  const calculateDerivatives = (state: PendulumState, params: PhysicsParams) => {
    const { theta1, omega1, theta2, omega2 } = state;
    const { m1, m2, l1, l2, g } = params;

    const num1 = -g * (2 * m1 + m2) * Math.sin(theta1);
    const num2 = -m2 * g * Math.sin(theta1 - 2 * theta2);
    const num3 = -2 * Math.sin(theta1 - theta2) * m2;
    const num4 = omega2 * omega2 * l2 + omega1 * omega1 * l1 * Math.cos(theta1 - theta2);
    const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
    
    const alpha1 = (num1 + num2 + num3 * num4) / den;

    const num5 = 2 * Math.sin(theta1 - theta2);
    const num6 = omega1 * omega1 * l1 * (m1 + m2);
    const num7 = g * (m1 + m2) * Math.cos(theta1);
    const num8 = omega2 * omega2 * l2 * m2 * Math.cos(theta1 - theta2);
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));

    const alpha2 = (num5 * (num6 + num7 + num8)) / den2;

    return {
      dTheta1: omega1,
      dOmega1: alpha1,
      dTheta2: omega2,
      dOmega2: alpha2,
    };
  };

  // --- O Integrador Numérico: Runge-Kutta 4 (RK4) ---
  const integrateRK4 = useCallback((dt: number) => {
    const state = stateRef.current;
    const params = paramsRef.current;

    // 4 passos do RK
    const k1 = calculateDerivatives(state, params);
    
    const stateK2: PendulumState = {
        theta1: state.theta1 + k1.dTheta1 * dt / 2,
        omega1: state.omega1 + k1.dOmega1 * dt / 2,
        theta2: state.theta2 + k1.dTheta2 * dt / 2,
        omega2: state.omega2 + k1.dOmega2 * dt / 2
    };
    const k2 = calculateDerivatives(stateK2, params);

    const stateK3: PendulumState = {
        theta1: state.theta1 + k2.dTheta1 * dt / 2,
        omega1: state.omega1 + k2.dOmega1 * dt / 2,
        theta2: state.theta2 + k2.dTheta2 * dt / 2,
        omega2: state.omega2 + k2.dOmega2 * dt / 2
    };
    const k3 = calculateDerivatives(stateK3, params);

    const stateK4: PendulumState = {
        theta1: state.theta1 + k3.dTheta1 * dt,
        omega1: state.omega1 + k3.dOmega1 * dt,
        theta2: state.theta2 + k3.dTheta2 * dt,
        omega2: state.omega2 + k3.dOmega2 * dt
    };
    const k4 = calculateDerivatives(stateK4, params);

    // Atualiza o estado final com média ponderada e aplica amortecimento
    stateRef.current = {
      theta1: state.theta1 + (k1.dTheta1 + 2*k2.dTheta1 + 2*k3.dTheta1 + k4.dTheta1) * dt / 6,
      omega1: (state.omega1 + (k1.dOmega1 + 2*k2.dOmega1 + 2*k3.dOmega1 + k4.dOmega1) * dt / 6) * params.damping,
      theta2: state.theta2 + (k1.dTheta2 + 2*k2.dTheta2 + 2*k3.dTheta2 + k4.dTheta2) * dt / 6,
      omega2: (state.omega2 + (k1.dOmega2 + 2*k2.dOmega2 + 2*k3.dOmega2 + k4.dOmega2) * dt / 6) * params.damping,
    };
  }, []);

  // --- Helper para converter ângulos em coordenadas cartesianas para desenho ---
  const getPositions = useCallback((center: Point) => {
    const s = stateRef.current;
    const p = paramsRef.current;

    const x1 = center.x + p.l1 * Math.sin(s.theta1);
    const y1 = center.y + p.l1 * Math.cos(s.theta1);

    const x2 = x1 + p.l2 * Math.sin(s.theta2);
    const y2 = y1 + p.l2 * Math.cos(s.theta2);

    // Adiciona ponto ao rastro (mantém apenas os últimos 200 pontos)
    traceRef.current.push({ x: x2, y: y2 });
    if (traceRef.current.length > 300) {
      traceRef.current.shift();
    }

    return { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 }, trace: traceRef.current };
  }, []);

  const reset = useCallback(() => {
      stateRef.current = initialState;
      traceRef.current = [];
  }, []);

  return { integrateRK4, getPositions, reset, params: paramsRef.current };
};
