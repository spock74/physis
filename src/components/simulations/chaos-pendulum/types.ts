// components/simulations/chaos-pendulum/types.ts

// O estado do sistema em um dado momento
export type PendulumState = {
  theta1: number; // Ângulo do primeiro braço
  omega1: number; // Velocidade angular do primeiro braço
  theta2: number; // Ângulo do segundo braço
  omega2: number; // Velocidade angular do segundo braço
};

// Os parâmetros físicos que definem o "universo" da simulação
export type PhysicsParams = {
  m1: number; // Massa 1
  m2: number; // Massa 2
  l1: number; // Comprimento 1
  l2: number; // Comprimento 2
  g: number;  // Gravidade
  damping: number; // Fator de amortecimento (atrito do ar)
};

// Coordenadas simples para desenhar
export type Point = { x: number; y: number };
