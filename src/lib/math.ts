export type Vector3 = [number, number, number]

/**
 * Runge-Kutta 4th Order Solver
 * @param f - The system of differential equations (dxdt, dydt, dzdt)
 * @param y - Current state vector [x, y, z]
 * @param h - Time step
 * @param params - Parameters for the system (sigma, rho, beta)
 */
export function rk4(
  f: (t: number, y: Vector3, params: any) => Vector3,
  t: number,
  y: Vector3,
  h: number,
  params: any
): Vector3 {
  const k1 = f(t, y, params)
  const k2 = f(t + h / 2, [y[0] + (h / 2) * k1[0], y[1] + (h / 2) * k1[1], y[2] + (h / 2) * k1[2]], params)
  const k3 = f(t + h / 2, [y[0] + (h / 2) * k2[0], y[1] + (h / 2) * k2[1], y[2] + (h / 2) * k2[2]], params)
  const k4 = f(t + h, [y[0] + h * k3[0], y[1] + h * k3[1], y[2] + h * k3[2]], params)

  return [
    y[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    y[2] + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ]
}
