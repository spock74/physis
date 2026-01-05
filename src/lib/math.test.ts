import { describe, it, expect } from 'vitest'
import { rk4, Vector3 } from './math'

describe('Math Utils', () => {
  describe('rk4', () => {
    it('should integrate a simple linear function correctly', () => {
      // dy/dt = y, y(0) = 1. Solution: y(t) = e^t
      // Let's test for one step
      // f signature: (t, y, params) => [dxdt, dydt, dzdt]
      const f = (t: number, y: Vector3) => [y[0], 0, 0] as Vector3
      const t0 = 0
      const y0: Vector3 = [1, 0, 0]
      const dt = 0.1
      const params = {}
      
      // rk4 signature: (f, t, y, h, params)
      const result = rk4(f, t0, y0, dt, params)
      
      // Euler would be 1 + 0.1*1 = 1.1
      // Exact is e^0.1 ≈ 1.10517
      // RK4 should be very close to exact
      
      expect(result[0]).toBeCloseTo(1.10517, 5)
    })
  })
})
