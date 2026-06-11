import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector2 } from 'three'
import './WatercolorCanvas.css'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simple noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float n = snoise(uv * 3.0 + uTime * 0.1);

    // Distort UV based on mouse
    float dist = distance(uv, uMouse);
    float strength = 0.5 / (dist + 0.5);
    uv += n * 0.05 * strength;

    // Watercolor palette (Matched to preview-magical.html)
    vec3 buttercream = vec3(1.0, 0.99, 0.90);
    vec3 sakura = vec3(0.98, 0.90, 0.95);
    vec3 lavender = vec3(0.91, 0.83, 1.0);

    // Exact preview mixing (lines 2367-2371)
    float mix1 = snoise(uv * 2.0 + uTime * 0.05);
    float mix2 = snoise(uv * 1.5 - uTime * 0.07);

    vec3 finalColor = mix(buttercream, sakura, clamp(mix1, 0.0, 1.0));
    finalColor = mix(finalColor, lavender, clamp(mix2, 0.0, 1.0));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function FluidBackground() {
    const meshRef = useRef();
    // The canvas sits at z-index -1 behind all content, so it never receives
    // pointer events itself — track the mouse at the document level instead
    // (matches preview-magical.html lines 2400-2403).
    const mouseTarget = useRef(new Vector2(0.5, 0.5));
    const { size, viewport } = useThree();
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uResolution: { value: new Vector2(size.width, size.height) }
    }), [size]);

    useEffect(() => {
        const onMouseMove = (e) => {
            mouseTarget.current.set(
                e.clientX / window.innerWidth,
                1.0 - (e.clientY / window.innerHeight)
            );
        };
        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        uniforms.uMouse.value.lerp(mouseTarget.current, 0.1);
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

function WatercolorCanvas() {
    return (
        <div className="watercolor-canvas" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                style={{ width: '100%', height: '100%', display: 'block' }}
            >
                <FluidBackground />
            </Canvas>
        </div>
    )
}

export default WatercolorCanvas
