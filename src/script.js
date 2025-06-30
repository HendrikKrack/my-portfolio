import './style.css'
import * as THREE from 'three'

// Import our modular objects
import { createOcean } from './objects/Ocean.js'
import { createGoldenGateBridge } from './objects/Bridge.js'
import { createSunsetLighting } from './objects/Lighting.js'
import { createBridgeAdjacentHills } from './objects/bridgeAdjacentHills.js'
import { createStarfield } from './objects/Stars.js'
import { createProjectManager } from './objects/Projects/ProjectManager.js'
import { AudioSystem } from './objects/AudioSystem.js'

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
    // Create a fallback canvas
    const fallbackCanvas = document.createElement('canvas')
    fallbackCanvas.className = 'webgl'
    fallbackCanvas.style.position = 'fixed'
    fallbackCanvas.style.top = '0'
    fallbackCanvas.style.left = '0'
    fallbackCanvas.style.zIndex = '-1'
    document.body.appendChild(fallbackCanvas)
    console.log('Created fallback canvas')
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

// Mouse controls for camera movement and interactions
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let targetRotationY = 0
let targetRotationX = 0
let isInBirdsEyeView = false
let originalCameraPosition = new THREE.Vector3()
let originalCameraRotation = new THREE.Euler()
let targetCameraPosition = new THREE.Vector3()
let targetCameraRotation = new THREE.Euler()
let cameraTransitionProgress = 0
let isTransitioning = false

// Store original camera state
originalCameraPosition.copy(camera.position)
originalCameraRotation.copy(camera.rotation)

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    
    if (!isInBirdsEyeView && !isTransitioning) {
        targetRotationY = -mouse.x * 0.3  // Inverted: mouse left = camera left
        targetRotationX = -mouse.y * 0.1  // Inverted: mouse up = camera up
        
        // Check for hover over islands
        raycaster.setFromCamera(mouse, camera)
        const githubIsland = projectManager.getProject('github')
        if (githubIsland) {
            const intersects = raycaster.intersectObjects(githubIsland.group.children, true)
            
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer'
                if (githubIsland.setHover) githubIsland.setHover(true)
            } else {
                document.body.style.cursor = 'default'
                if (githubIsland.setHover) githubIsland.setHover(false)
            }
        }
    }
})

// Click handler for island interactions
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    
    // Check for intersections with project islands
    const githubIsland = projectManager.getProject('github')
    if (githubIsland) {
        const intersects = raycaster.intersectObjects(githubIsland.group.children, true)
        
        if (intersects.length > 0) {
            console.log('🏝️ GitHub Island clicked!')
            toggleBirdsEyeView(githubIsland)
        }
    }
})

// Function to toggle bird's eye view
function toggleBirdsEyeView(targetProject) {
    if (isTransitioning) return
    
    isTransitioning = true
    cameraTransitionProgress = 0
    
    if (!isInBirdsEyeView) {
        // Switch to bird's eye view
        console.log('📹 Switching to bird\'s eye view')
        
        const projectPosition = targetProject.getPosition()
        targetCameraPosition.set(
            projectPosition.x,
            projectPosition.y + 15, // Adjusted height for smaller island
            projectPosition.z
        )
        targetCameraRotation.set(-Math.PI / 2, 0, 0) // Looking straight down
        
        isInBirdsEyeView = true
    } else {
        // Return to original view
        console.log('📹 Returning to original view')
        
        targetCameraPosition.copy(originalCameraPosition)
        targetCameraRotation.copy(originalCameraRotation)
        
        isInBirdsEyeView = false
    }
}

// ESC key to return to original view
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isInBirdsEyeView) {
        toggleBirdsEyeView(null)
    }
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

const bridgeAdjacentHills = createBridgeAdjacentHills()
scene.add(bridgeAdjacentHills.group)

const starfield = createStarfield()
scene.add(starfield.group)

const projectManager = createProjectManager()
scene.add(projectManager.group)

//const bridgeHill = createBridgeHill()
//scene.add(bridgeHill)

// ADD COORDINATE SYSTEM HELPERS FOR UNDERSTANDING SPACE
function createCoordinateHelpers() {
    const helpersGroup = new THREE.Group()
    
    // Create axis helper (Red=X, Green=Y, Blue=Z)
    const axesHelper = new THREE.AxesHelper(10)
    helpersGroup.add(axesHelper)
    
    // Add coordinate grid on the ground (XZ plane)
    const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x444444)
    gridHelper.position.y = 0
    helpersGroup.add(gridHelper)
    
    // Camera position marker (Yellow cube)
    const cameraMarkerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const cameraMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const cameraMarker = new THREE.Mesh(cameraMarkerGeometry, cameraMarkerMaterial)
    cameraMarker.position.copy(camera.position)
    helpersGroup.add(cameraMarker)
    
    // Add text labels for understanding
    console.log('🎯 COORDINATE SYSTEM EXPLANATION:')
    console.log('📍 Camera Position:', camera.position)
    console.log('🌊 Ocean Position:', ocean.mesh.position)
    console.log('🌉 Bridge Position:', bridge.group.position)
    console.log('📏 Distance Camera to Bridge:', camera.position.distanceTo(bridge.group.position))
    
    return helpersGroup
}

// Add visual helpers
const coordinateHelpers = createCoordinateHelpers()
scene.add(coordinateHelpers)



const lighting = createSunsetLighting()
scene.add(lighting.group)

// Initialize audio system
const audioSystem = new AudioSystem()

// Simple audio control
window.audioControls = {
    startAudio: () => audioSystem.startAmbientSounds(),
    stopAudio: () => audioSystem.stopAmbientSounds(),
    toggleMute: () => audioSystem.toggleMute()
}

// Star controls for easy adjustment
window.starControls = {
    show: () => {
        starfield.setVisibility(true)
        console.log('⭐ Stars should now be visible!')
    },
    hide: () => {
        starfield.setVisibility(false)
        console.log('🌑 Stars hidden')
    },
    superBright: () => {
        starfield.setBrightness(10.0)
        console.log('🔆 Stars set to SUPER BRIGHT!')
    },
    brighten: () => {
        starfield.setBrightness(6.0)
        console.log('✨ Stars brightened!')
    },
    normal: () => {
        starfield.setBrightness(4.0)
        console.log('🌟 Stars set to normal brightness')
    },
    dim: () => {
        starfield.setBrightness(2.0)
        console.log('🌙 Stars dimmed')
    },
    debug: () => {
        console.log('🔍 STAR DEBUG INFO:')
        console.log('Group visible:', starfield.group.visible)
        console.log('Group position:', starfield.group.position)
        console.log('Group children:', starfield.group.children.length)
        console.log('Meshes:', starfield.meshes.length)
    }
}

// Auto-start audio on first user interaction
let audioStarted = false
const startAudioOnInteraction = () => {
    if (!audioStarted) {
        audioSystem.startAmbientSounds()
        audioStarted = true
        console.log('🔊 Ocean waves started on user interaction')
        showAudioStatus('🌊 Ocean waves playing')
        
        // Remove event listeners after first interaction
        window.removeEventListener('click', startAudioOnInteraction)
        window.removeEventListener('keydown', startAudioOnInteraction)
        window.removeEventListener('mousemove', startAudioOnInteraction)
    }
}

window.addEventListener('click', startAudioOnInteraction)
window.addEventListener('keydown', startAudioOnInteraction)
window.addEventListener('mousemove', startAudioOnInteraction)

// Simple audio status
const audioStatus = document.getElementById('audio-status')

// Show audio status message
function showAudioStatus(message) {
    if (audioStatus) {
        audioStatus.textContent = message
        audioStatus.classList.add('show')
        setTimeout(() => {
            audioStatus.classList.remove('show')
        }, 3000)
    }
}

// Loading screen management
const loadingScreen = document.getElementById('loading-screen')
const loadingProgress = document.getElementById('progress-fill')

let progress = 0
const loadingInterval = setInterval(() => {
    progress += Math.random() * 20
    if (progress >= 100) {
        progress = 100
        clearInterval(loadingInterval)
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden')
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
    bridgeAdjacentHills.update(elapsedTime)
    starfield.update(elapsedTime)
    projectManager.update(elapsedTime)
    lighting.update(elapsedTime)
    
    // Handle camera transitions
    if (isTransitioning) {
        cameraTransitionProgress += 0.02 // Smooth transition speed
        
        if (cameraTransitionProgress >= 1) {
            cameraTransitionProgress = 1
            isTransitioning = false
        }
        
        // Smooth interpolation between camera positions and rotations
        const t = easeInOutCubic(cameraTransitionProgress)
        
        camera.position.lerpVectors(
            isInBirdsEyeView ? originalCameraPosition : camera.position,
            targetCameraPosition,
            isInBirdsEyeView ? t : t
        )
        
        // Interpolate rotation
        const startRotation = isInBirdsEyeView ? originalCameraRotation : camera.rotation
        camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetCameraRotation.x, t)
        camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetCameraRotation.y, t)
        camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetCameraRotation.z, t)
        
    } else if (!isInBirdsEyeView) {
        // Normal mouse-based camera rotation (only when not in bird's eye view)
        camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05
        camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05
    }
    
    // Easing function for smooth transitions
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    // Update spatial audio based on camera position
    if (audioStarted) {
        audioSystem.updateSpatialAudio(camera.position, {
            bridgePosition: bridge.group.position
        })
    }
    
    // Render the scene
    renderer.render(scene, camera)
    
    requestAnimationFrame(animate)
}

// Start the application
try {
    const finalCanvas = document.querySelector('canvas.webgl')
    if (finalCanvas) {
        console.log('🚀 Starting 3D Golden Gate Bridge experience...')
        animate()
    } else {
        console.error('Cannot start animation: Canvas element not found')
    }
} catch (error) {
    console.error('Error starting application:', error)
    // Show error message to user
    document.body.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(255,0,0,0.8); color: white; padding: 20px; border-radius: 10px; 
                    font-family: Arial, sans-serif; text-align: center; z-index: 9999;">
            <h2>🚨 Error Loading 3D Scene</h2>
            <p>There was an error loading the 3D experience.</p>
            <p>Please check the browser console for details.</p>
            <p>Error: ${error.message}</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; 
                    background: white; color: red; border: none; border-radius: 5px; cursor: pointer;">
                Reload Page
            </button>
        </div>
    `
}
