import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

const NeuralShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorBase: new THREE.Color("#115e59"), // Teal escuro
    uColorActive: new THREE.Color("#ffffff"), // Branco Puro
    uAttractorPos: new THREE.Vector3(0, 0, 0),
    uRadius: 8.0, // Raio generoso
  },
  // Vertex Shader
  `
    varying vec3 vWorldPos;
    
    void main() {
      // MAGIA AQUI: Multiplicamos pela instanceMatrix para ter a posição real no mundo
      vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColorBase;
    uniform vec3 uColorActive;
    uniform vec3 uAttractorPos;
    uniform float uRadius;
    
    varying vec3 vWorldPos;

    void main() {
      // Calcula distância entre ESTE neurônio e o Atrator
      float dist = distance(vWorldPos, uAttractorPos);
      
      // Cria um brilho suave (quanto mais perto, mais intenso)
      // Ajuste o '4.0' para controlar o decaimento do brilho
      float intensity = 1.0 / (1.0 + pow(dist / uRadius, 4.0));
      
      // Mistura as cores
      vec3 finalColor = mix(uColorBase, uColorActive, intensity);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ NeuralShaderMaterial })

export { NeuralShaderMaterial }

// TypeScript support
declare global {
  namespace JSX {
    interface IntrinsicElements {
      neuralShaderMaterial: any
    }
  }
}
