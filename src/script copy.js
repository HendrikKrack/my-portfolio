import './style.css'
import * as THREE from 'three'

// Basic Three.js setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a2a6c) // Dark blue background

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)

// Add a simple cube to test the scene
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    
    // Rotate the cube
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    
    renderer.render(scene, camera)
}

// Start the animation loop
animate()
    if (scene.fog) {
        scene.fog.color.copy(fogColor)
    }
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 3, 8)
scene.add(camera)

/**
 * Controls (Simple Mouse Look)
 */
const mouse = new THREE.Vector2()
let targetRotationY = 0
let targetRotationX = 0

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    
    targetRotationY = mouse.x * 0.3
    targetRotationX = mouse.y * 0.1
})

/**
 * San Francisco Scene
 */

// Create a sunset sky gradient
const skyGradient = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5cc1s7QAAABhJREFUeJxi/P//PwM6YGRkZGBgYGRkZGRgYAAAQQMDCQgBqgAAAABJRU5ErkJggg==');
skyGradient.wrapS = skyGradient.wrapT = THREE.RepeatWrapping;
skyGradient.repeat.set(1, 1);

// Ocean with improved sunset reflections
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
        varying vec3 vSunDirection;
        
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;
            vNormal = normalize(normalMatrix * normal);
            vSunDirection = normalize((viewMatrix * vec4(sunDirection, 0.0)).xyz);
            
            // More organic wave animation
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
        varying vec3 vSunDirection;
        
        // Simple noise function for water surface variation
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
            vec3 viewDirection = normalize(vViewPosition);
            vec3 normal = normalize(vNormal);
            
            // Enhanced fresnel effect
            float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 3.0);
            
            // Sun reflection with distortion
            vec2 uv = vWorldPosition.xz * 0.1;
            float noise = random(floor(uv * 10.0) / 10.0) * 0.1;
            vec3 distortedNormal = normalize(normal + vec3(noise, 0.0, noise * 0.5));
            
            vec3 reflectDir = reflect(normalize(vSunDirection), distortedNormal);
            float spec = max(dot(viewDirection, reflectDir), 0.0);
            spec = pow(spec, 64.0) * 2.0;
            
            // Gradient from horizon to sky
            float horizonFactor = smoothstep(0.0, 0.3, 1.0 - abs(normal.y));
            vec3 reflectionColor = mix(horizonColor, skyColor, smoothstep(0.0, 1.0, normal.y * 0.5 + 0.5));
            
            // Combine all effects
            vec3 color = mix(waterColor, reflectionColor, fresnel * 0.8);
            color += spec * sunColor * 0.8;
            
            // Add some sparkle
            float sparkle = step(0.9, random(gl_FragCoord.xy * 0.01 + time * 0.1));
            color += sparkle * vec3(1.0, 1.0, 0.9) * 0.3;
            
            gl_FragColor = vec4(color, 0.85);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// Create ocean mesh with water material
const ocean = new THREE.Mesh(oceanGeometry, waterMaterial)
ocean.rotation.x = -Math.PI / 2
ocean.position.y = -0.5
ocean.receiveShadow = true
ocean.frustumCulled = false // Prevent artifacts at large distances
scene.add(ocean)

// Update sun position for the water shader
const updateSunPosition = () => {
    const sunPosition = new THREE.Vector3(100, 100, -100).normalize()
    waterMaterial.uniforms.sunDirection.value.copy(sunPosition)
}

// Initial update
updateSunPosition()

// Golden Gate Bridge (realistic version)
const bridgeGroup = new THREE.Group()

// Bridge tower geometry with Art Deco styling
function createBridgeTower(x, z) {
    const towerGroup = new THREE.Group()
    
    // Main tower structure
    const towerGeometry = new THREE.BoxGeometry(1.5, 25, 1.5)
    const towerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b', // International Orange
        roughness: 0.6,
        metalness: 0.4
    })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.y = 12.5
    towerGroup.add(tower)
    
    // Tower cross beams (Art Deco style)
    const beamGeometry = new THREE.BoxGeometry(2, 0.3, 0.3)
    const beamMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b',
        roughness: 0.6,
        metalness: 0.4
    })
    
    // Horizontal beams at different heights
    for (let i = 0; i < 5; i++) {
        const beam = new THREE.Mesh(beamGeometry, beamMaterial)
        beam.position.y = 5 + i * 4
        towerGroup.add(beam)
    }
    
    // Tower top details
    const topGeometry = new THREE.BoxGeometry(2, 1, 2)
    const top = new THREE.Mesh(topGeometry, towerMaterial)
    top.position.y = 26
    towerGroup.add(top)
    
    towerGroup.position.set(x, 0, z)
    return towerGroup
}

// Bridge deck with realistic structure
function createBridgeDeck() {
    const deckGroup = new THREE.Group()
    
    // Main roadway
    const deckGeometry = new THREE.BoxGeometry(60, 0.8, 4)
    const deckMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.8,
        metalness: 0.2
    })
    const deck = new THREE.Mesh(deckGeometry, deckMaterial)
    deck.position.y = 8
    deckGroup.add(deck)
    
    // Side barriers
    const barrierGeometry = new THREE.BoxGeometry(60, 1, 0.2)
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b',
        roughness: 0.6,
        metalness: 0.4
    })
    
    const leftBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    leftBarrier.position.set(0, 9, 2.1)
    deckGroup.add(leftBarrier)
    
    const rightBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    rightBarrier.position.set(0, 9, -2.1)
    deckGroup.add(rightBarrier)
    
    deckGroup.position.set(0, 0, -10)
    return deckGroup
}

// Realistic suspension cables with curves
function createSuspensionCables() {
    const cablesGroup = new THREE.Group()
    
    // Main suspension cables (the big curved ones)
    const points1 = []
    const points2 = []
    
    // Create curved cable from tower to tower
    for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const x = (t - 0.5) * 60 // Span from -30 to 30
        // Parabolic curve for suspension cable
        const y = 20 + (x * x) / 100 // Creates the characteristic sag
        
        points1.push(new THREE.Vector3(x, y, -8.5))
        points2.push(new THREE.Vector3(x, y, -11.5))
    }
    
    const curve1 = new THREE.CatmullRomCurve3(points1)
    const curve2 = new THREE.CatmullRomCurve3(points2)
    
    const tubeGeometry1 = new THREE.TubeGeometry(curve1, 100, 0.08, 8, false)
    const tubeGeometry2 = new THREE.TubeGeometry(curve2, 100, 0.08, 8, false)
    const cableMaterial = new THREE.MeshStandardMaterial({ 
        color: '#34495e',
        roughness: 0.3,
        metalness: 0.7
    })
    
    const mainCable1 = new THREE.Mesh(tubeGeometry1, cableMaterial)
    const mainCable2 = new THREE.Mesh(tubeGeometry2, cableMaterial)
    
    cablesGroup.add(mainCable1)
    cablesGroup.add(mainCable2)
    
    // Vertical hanger cables
    const hangerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.4,
        metalness: 0.6
    })
    
    for (let i = -25; i <= 25; i += 2) {
        // Calculate the height of the main cable at this x position
        const cableHeight = 20 + (i * i) / 100
        const hangerLength = cableHeight - 8.5 // Distance from cable to deck
        
        const hangerGeometry = new THREE.CylinderGeometry(0.02, 0.02, hangerLength)
        
        const hanger1 = new THREE.Mesh(hangerGeometry, hangerMaterial)
        hanger1.position.set(i, 8.5 + hangerLength/2, -8.5)
        cablesGroup.add(hanger1)
        
        const hanger2 = new THREE.Mesh(hangerGeometry, hangerMaterial)
        hanger2.position.set(i, 8.5 + hangerLength/2, -11.5)
        cablesGroup.add(hanger2)
    }
    
    return cablesGroup
}

// Assemble the complete Golden Gate Bridge
// Add towers at proper positions
const tower1 = createBridgeTower(-25, -10)
const tower2 = createBridgeTower(25, -10)
bridgeGroup.add(tower1, tower2)

// Add deck
const deck = createBridgeDeck()
bridgeGroup.add(deck)

// Add suspension cables
const suspensionCables = createSuspensionCables()
bridgeGroup.add(suspensionCables)

// Position the entire bridge in the scene
bridgeGroup.position.x += 10  // Move 10 units to the right
bridgeGroup.scale.set(0.4, 0.4, 0.4)  // Scale down by 50% from original (was 0.8, now 0.4)
bridgeGroup.position.set(0, -3, -40)  // Move further back in the scene (z = -40)
scene.add(bridgeGroup)

// Hills (San Francisco style)
const hillsGroup = new THREE.Group()

for (let i = 0; i < 8; i++) {
    const hillGeometry = new THREE.ConeGeometry(2 + Math.random() * 2, 3 + Math.random() * 4, 8)
    const hillMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(0.3, 0.4, 0.3 + Math.random() * 0.3)
    })
    
    const hill = new THREE.Mesh(hillGeometry, hillMaterial)
    hill.position.set(
        (Math.random() - 0.5) * 40,
        -1,
        -15 - Math.random() * 20
    )
    hill.rotation.y = Math.random() * Math.PI * 2
    hillsGroup.add(hill)
}

scene.add(hillsGroup)

// Add small sand circles around the base of the mountains
const sandMaterial = new THREE.MeshStandardMaterial({ 
    color: '#d2c29a', 
    roughness: 0.9,
    flatShading: true
})

const sandCircles = new THREE.Group()

// Create multiple small sand circles around the base of the mountains
for (let i = 0; i < 50; i++) {
    const size = 1 + Math.random() * 3  // Random size between 1 and 4
    const sandGeometry = new THREE.CircleGeometry(size, 8)  // 8 segments for a slightly rough circle
    const sandCircle = new THREE.Mesh(sandGeometry, sandMaterial)
    
    // Position around the base of the mountains
    const angle = Math.random() * Math.PI * 2
    const distance = 5 + Math.random() * 15  // Distance from center
    
    sandCircle.position.set(
        Math.cos(angle) * distance,
        -0.4,  // Slightly below ground level
        -15 - Math.random() * 25  // In front of the mountains
    )
    
    // Rotate to be horizontal and random rotation
    sandCircle.rotation.x = -Math.PI / 2
    sandCircle.rotation.z = Math.random() * Math.PI
    
    // Random scale for more natural look
    sandCircle.scale.set(1, 1, 0.8 + Math.random() * 0.4)
    
    sandCircles.add(sandCircle)
}

scene.add(sandCircles)

// Transamerica Pyramid
function createTransamericaPyramid() {
    const pyramidGroup = new THREE.Group()
    
    // Main pyramid body (using a cone for the basic shape)
    const pyramidHeight = 20
    const pyramidBase = 3
    const pyramidGeometry = new THREE.ConeGeometry(pyramidBase, pyramidHeight, 4, 1, true)
    const pyramidMaterial = new THREE.MeshStandardMaterial({ 
        color: '#a0a0a0',
        metalness: 0.3,
        roughness: 0.7
    })
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
    pyramid.rotation.y = Math.PI / 4  // Rotate 45 degrees to align the corners
    pyramid.position.y = pyramidHeight / 2
    
    // Add the spire on top
    const spireHeight = 10
    const spireGeometry = new THREE.CylinderGeometry(0.1, 0.5, spireHeight, 8)
    const spire = new THREE.Mesh(spireGeometry, pyramidMaterial)
    spire.position.y = pyramidHeight + (spireHeight / 2)
    
    // Add the horizontal beams (simplified)
    for (let i = 1; i <= 3; i++) {
        const beamHeight = i * (pyramidHeight / 4)
        const beamSize = pyramidBase * (1 - (i * 0.2))  // Make beams smaller as they go up
        
        const beamGeometry = new THREE.BoxGeometry(beamSize * 1.5, 0.1, 0.3)
        const beam = new THREE.Mesh(beamGeometry, pyramidMaterial)
        beam.position.y = beamHeight
        
        // Add beams on each side
        for (let j = 0; j < 4; j++) {
            const beamCopy = beam.clone()
            beamCopy.rotation.y = (Math.PI / 2) * j
            pyramidGroup.add(beamCopy)
        }
    }
    
    // Add the base (wings on the sides)
    const baseGeometry = new THREE.BoxGeometry(pyramidBase * 2, 0.5, pyramidBase * 2)
    const base = new THREE.Mesh(baseGeometry, pyramidMaterial)
    base.position.y = -0.25
    
    pyramidGroup.add(pyramid)
    pyramidGroup.add(spire)
    pyramidGroup.add(base)
    
    // Position the pyramid in the background
    pyramidGroup.position.set(-15, 0, -50)
    pyramidGroup.scale.set(0.8, 0.8, 0.8)
    
    return pyramidGroup
}

// Add the pyramid to the scene
const pyramid = createTransamericaPyramid()
scene.add(pyramid)

// Surfboards (the main attraction!)
const surfboardsGroup = new THREE.Group()

// Surfboards floating in the water
const surfboards = new THREE.Group()

// Create different surfboard designs
const surfboardDesigns = [
    { color: '#FF4136', stripeColor: '#FFFFFF' },  // Red with white stripe
    { color: '#0074D9', stripeColor: '#FFDC00' },  // Blue with yellow stripe
    { color: '#2ECC40', stripeColor: '#001F3F' },  // Green with navy stripe
    { color: '#FFDC00', stripeColor: '#FF4136' },  // Yellow with red stripe
    { color: '#B10DC9', stripeColor: '#7FDBFF' }   // Purple with light blue stripe
]

for (let i = 0; i < 12; i++) {
    const surfboard = new THREE.Group()
    
    // Randomly select a design
    const design = surfboardDesigns[Math.floor(Math.random() * surfboardDesigns.length)]
    
    // Board shape (pointed nose, rounded tail)
    const boardLength = 2 + Math.random() * 1.5
    const boardWidth = 0.6 + Math.random() * 0.3
    const boardThickness = 0.1 + Math.random() * 0.05
    
    // Create board body
    const boardGeometry = new THREE.CylinderGeometry(
        boardWidth * 0.8,  // Top radius (narrower at top)
        boardWidth,        // Bottom radius (wider at bottom)
        boardThickness,    // Height (thickness)
        16,                // Radial segments
        1,                 // Height segments
        true               // Open ended
    )
    
    // Scale to make it oval
    boardGeometry.scale(1, 0.3, 1)
    
    // Rotate to be horizontal
    boardGeometry.rotateX(Math.PI / 2)
    
    const boardMaterial = new THREE.MeshStandardMaterial({
        color: design.color,
        roughness: 0.3,
        metalness: 0.1
    })
    
    const board = new THREE.Mesh(boardGeometry, boardMaterial)
    
    // Add a stripe down the middle
    const stripeGeometry = new THREE.BoxGeometry(
        boardLength * 0.8,
        boardThickness * 0.5,
        boardWidth * 0.1
    )
    const stripeMaterial = new THREE.MeshStandardMaterial({
        color: design.stripeColor,
        roughness: 0.3
    })
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
    stripe.position.z = 0.01  // Slightly above the board
    
    // Add fins
    const finGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.4)
    const finMaterial = new THREE.MeshStandardMaterial({ color: '#333333' })
    
    // Rear fin (bigger)
    const rearFin = new THREE.Mesh(finGeometry, finMaterial)
    rearFin.position.set(0, 0.1, -boardWidth * 0.7)
    rearFin.rotation.x = Math.PI / 4
    
    // Side fins (smaller)
    const sideFinGeometry = new THREE.BoxGeometry(0.1, 0.12, 0.25)
    const leftFin = new THREE.Mesh(sideFinGeometry, finMaterial)
    leftFin.position.set(-0.2, 0.05, -boardWidth * 0.4)
    leftFin.rotation.x = Math.PI / 6
    leftFin.rotation.z = -Math.PI / 8
    
    const rightFin = leftFin.clone()
    rightFin.position.x = 0.2
    rightFin.rotation.z = Math.PI / 8
    
    // Add all parts to the surfboard group
    surfboard.add(board, stripe, rearFin, leftFin, rightFin)
    
    // Position and rotate randomly in the water
    const angle = Math.random() * Math.PI * 2
    const distance = 15 + Math.random() * 25
    surfboard.position.set(
        Math.cos(angle) * distance,
        0.5 + Math.random() * 0.3,  // Slightly above water
        Math.sin(angle) * distance - 20
    )
    
    // Random rotation
    surfboard.rotation.y = Math.random() * Math.PI * 2
    surfboard.rotation.x = Math.random() * 0.2
    surfboard.rotation.z = Math.random() * 0.2
    
    // Random scale for variety
    const scale = 0.8 + Math.random() * 0.4
    surfboard.scale.set(scale, scale, scale)
    
    // Add floating animation data
    surfboard.userData = {
        offset: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        originalY: surfboard.position.y
    }
    
    surfboards.add(surfboard)
}

// Add surfboards to the scene
scene.add(surfboards)

// Sun light (warm directional light for sunset)
const sunLight = new THREE.DirectionalLight(0xff8c42, 1.8)
sunLight.position.set(5, 10, -15)
sunLight.castShadow = true
sunLight.shadow.mapSize.width = 2048
sunLight.shadow.mapSize.height = 2048
sunLight.shadow.camera.near = 0.5
sunLight.shadow.camera.far = 100
sunLight.shadow.camera.left = -50
sunLight.shadow.camera.right = 50
sunLight.shadow.camera.top = 50
sunLight.shadow.camera.bottom = -50
scene.add(sunLight)

// Add fill light to reduce harsh shadows
const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.5)
fillLight.position.set(-5, 5, 10)
scene.add(fillLight)

// Add ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
scene.add(ambientLight)

// Add hemisphere light for sky illumination
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a2a6c, 0.6)
scene.add(hemiLight)

// Point light for warm glow
const pointLight = new THREE.PointLight('#ff9a5a', 1.5, 30)
pointLight.position.set(0, 10, -30)
pointLight.distance = 100
scene.add(pointLight)

// Simple renderer configuration
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true
renderer.setClearColor('#1a2a6c', 1)

/**
 * Loading Manager
 */
const loadingScreen = document.querySelector('.loading-screen')
const loadingProgress = document.querySelector('.loading-progress')

// Simple loading simulation
let progress = 0
const loadingInterval = setInterval(() => {
    progress += Math.random() * 20
    if (progress >= 100) {
        progress = 100
        clearInterval(loadingInterval)
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden')
        }, 500)
    }
    loadingProgress.style.width = `${progress}%`
}, 150)

/**
 * Interactions
 */
const raycaster = new THREE.Raycaster()

window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(surfboardsGroup.children)
    
    if (intersects.length > 0) {
        const surfboard = intersects[0].object
        
        // Animate the clicked surfboard
        gsap.to(surfboard.rotation, { 
            duration: 1, 
            y: surfboard.rotation.y + Math.PI * 2,
            ease: "power2.out"
        })
        
        gsap.to(surfboard.position, { 
            duration: 0.5, 
            y: surfboard.position.y + 1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        })
    }
})

/**
 * Animation
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Update ocean waves
    oceanMaterial.uniforms.time.value = elapsedTime
    
    // Smooth camera rotation based on mouse
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05
    
    // Animate surfboards floating
    surfboardsGroup.children.forEach((surfboard) => {
        const { originalY, floatOffset } = surfboard.userData
        surfboard.position.y = originalY + Math.sin(elapsedTime + floatOffset) * 0.1
        surfboard.rotation.z = Math.sin(elapsedTime * 0.5 + floatOffset) * 0.05
    })
    
    // Gentle bridge sway
    bridgeGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.01
    
    // Animate surfboards
    surfboards.children.forEach((surfboard) => {
        // Gentle bobbing motion
        surfboard.position.y = surfboard.userData.originalY + 
            Math.sin(elapsedTime * surfboard.userData.speed + surfboard.userData.offset) * 0.2
        
        // Slight rotation
        surfboard.rotation.y += surfboard.userData.rotationSpeed
    })
    
    // Animate point light
    pointLight.intensity = 0.5 + Math.sin(elapsedTime * 2) * 0.1
    
    // Update water shader time
    waterMaterial.uniforms.time.value = elapsedTime * 0.5
    
    // Update sun position for water shader and fog
    updateSunPosition()
    updateFogColor()
    
    // Animate sun position for time of day effect
    const timeOfDay = Math.sin(elapsedTime * 0.1) * 0.5 + 0.5 // 0 to 1
    const sunHeight = timeOfDay * 2 - 0.5 // -0.5 to 1.5
    sunLight.position.y = Math.max(0, sunHeight * 20)
    
    // Update sun color based on height
    const sunIntensity = Math.max(0, Math.min(1, sunLight.position.y / 15 + 0.3))
    sunLight.color.setHSL(0.1, 0.9, 0.5 + sunIntensity * 0.3)
    sunLight.intensity = 0.5 + sunIntensity * 1.3
    
    // Render the scene
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
