import * as THREE from 'three'

export function createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 50, 50)
    const waterMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            waterColor: { value: new THREE.Color(0.1, 0.2, 0.4) },
            sunDirection: { value: new THREE.Vector3(0.5, -0.5, -0.5).normalize() },
            skyColor: { value: new THREE.Color(0.5, 0.7, 1.0) },
            horizonColor: { value: new THREE.Color(1.0, 0.6, 0.3) },
            sunColor: { value: new THREE.Color(1.0, 0.8, 0.6) },
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying vec3 vNormal;
            uniform float time;
            
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;
                vNormal = normalize(normalMatrix * normal);
                
                // Animated waves
                float wave1 = sin(position.x * 0.5 + time * 0.5) * 0.1;
                float wave2 = sin(position.z * 0.3 + time * 0.3) * 0.15;
                float wave3 = sin(position.x * 0.2 + position.z * 0.3 + time * 0.2) * 0.08;
                float wave = (wave1 + wave2 + wave3) / 3.0;
                
                vec3 newPosition = position + normal * wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 waterColor;
            uniform vec3 sunDirection;
            uniform vec3 skyColor;
            uniform vec3 horizonColor;
            uniform vec3 sunColor;
            
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying vec3 vNormal;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            void main() {
                vec3 viewDirection = normalize(vViewPosition);
                vec3 normal = normalize(vNormal);
                
                // Fresnel effect
                float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 3.0);
                
                // Sun reflection
                vec2 uv = vWorldPosition.xz * 0.1;
                float noise = random(floor(uv * 10.0) / 10.0) * 0.1;
                vec3 distortedNormal = normalize(normal + vec3(noise, 0.0, noise * 0.5));
                
                vec3 reflectDir = reflect(normalize(sunDirection), distortedNormal);
                float spec = max(dot(viewDirection, reflectDir), 0.0);
                spec = pow(spec, 64.0) * 2.0;
                
                // Color mixing
                vec3 reflectionColor = mix(horizonColor, skyColor, smoothstep(0.0, 1.0, normal.y * 0.5 + 0.5));
                vec3 color = mix(waterColor, reflectionColor, fresnel * 0.8);
                color += spec * sunColor * 0.8;
                
                // Sparkles
                float sparkle = step(0.9, random(gl_FragCoord.xy * 0.01 + time * 0.1));
                color += sparkle * vec3(1.0, 1.0, 0.9) * 0.3;
                
                gl_FragColor = vec4(color, 0.85);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
    })

    const ocean = new THREE.Mesh(oceanGeometry, waterMaterial)
    ocean.rotation.x = -Math.PI / 2
    ocean.position.y = -0.5
    
    return {
        mesh: ocean,
        material: waterMaterial,
        update: (time) => {
            waterMaterial.uniforms.time.value = time
        }
    }
} 