import './style.css'
import * as THREE from 'three'

// Import our modular objects
import { createOcean } from './objects/Ocean.js'
import { createGoldenGateBridge } from './objects/Bridge.js'
import { createSurfboards } from './objects/Surfboards.js'
import { createSanFranciscoHills } from './objects/Hills.js'
import { createSunsetLighting } from './objects/Lighting.js'

// Application state
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a2a6c) // Dark blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 3, 8)
scene.add(camera)

// Canvas element
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
    console.error('Canvas element not found. Make sure you have an element with class "webgl" in your HTML.')
}

// Renderer setup with enhanced settings
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0

// Mouse controls for camera movement
const mouse = new THREE.Vector2()
let targetRotationY = 0
let targetRotationX = 0

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    
    targetRotationY = mouse.x * 0.3
    targetRotationX = mouse.y * 0.1
})

// Window resize handler
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

// Create all scene objects
const ocean = createOcean()
scene.add(ocean.mesh)

const bridge = createGoldenGateBridge()
scene.add(bridge.group)

const surfboards = createSurfboards()
scene.add(surfboards.group)

const hills = createSanFranciscoHills()
scene.add(hills.group)

const lighting = createSunsetLighting()
scene.add(lighting.group)

// Loading screen management
const loadingScreen = document.querySelector('.loading-screen')
const loadingProgress = document.querySelector('.loading-progress')

let progress = 0
const loadingInterval = setInterval(() => {
    progress += Math.random() * 20
    if (progress >= 100) {
        progress = 100
        clearInterval(loadingInterval)
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none'
            }
        }, 500)
    }
    if (loadingProgress) {
        loadingProgress.style.width = `${progress}%`
    }
}, 150)

// Main animation loop
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()
    
    // Update all animated objects
    ocean.update(elapsedTime)
    bridge.update(elapsedTime)
    surfboards.update(elapsedTime)
    hills.update(elapsedTime)
    lighting.update(elapsedTime)
    
    // Smooth camera rotation based on mouse
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05
    
    // Render the scene
    renderer.render(scene, camera)
    
    requestAnimationFrame(animate)
}

// Start the application
if (canvas) {
    animate()
} else {
    console.error('Cannot start animation: Canvas element not found')
}
