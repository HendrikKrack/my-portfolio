import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Simple GitHub island with Bruno Simon's model
export function createGitHubIsland() {
    const islandGroup = new THREE.Group()
    
    console.log('🏝️ Creating GitHub Island...')
    
    // Position the group first
    islandGroup.position.set(-35, -1, -25)
    
    // Create a simple island base
    const islandGeometry = new THREE.CylinderGeometry(4, 5, 2, 16)
    const islandMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4A7C59 // Forest green like the hills
    })
    const islandMesh = new THREE.Mesh(islandGeometry, islandMaterial)
    islandMesh.position.y = 0
    islandGroup.add(islandMesh)
    
    // Load Bruno Simon's information static base model
    const gltfLoader = new GLTFLoader()
    
    gltfLoader.load(
        '../folio-2019/static/models/information/static/base.glb',
        (gltf) => {
            console.log('✅ Successfully loaded Bruno Simon\'s information base model!')
            
            // Add the model on top of the island
            const model = gltf.scene
            model.scale.setScalar(0.5) // Make it 50% smaller
            model.position.y = 1 // Position on top of the island base
            islandGroup.add(model)
            
            console.log('🎯 Model added to scene')
        },
        (progress) => {
            console.log('📦 Loading progress:', Math.round((progress.loaded / progress.total) * 100) + '%')
        },
        (error) => {
            console.error('❌ Failed to load Bruno Simon\'s model:', error)
            
            // Create a simple red cube as fallback - 50% smaller and on top of island
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1) // 50% smaller
            const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
            cube.position.y = 1.5 // Position on top of the island base
            islandGroup.add(cube)
            
            console.log('🔴 Added red cube fallback on top of island')
        }
    )
    
    // Create a GitHub sign that's visible from the user's angle
    const signGroup = new THREE.Group()
    
    // Sign post
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8)
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }) // Brown
    const postMesh = new THREE.Mesh(postGeometry, postMaterial)
    postMesh.position.set(0, 2, 3) // In front of the island, facing the user
    signGroup.add(postMesh)
    
    // Sign board
    const signGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.1)
    const signMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }) // White background
    const signMesh = new THREE.Mesh(signGeometry, signMaterial)
    signMesh.position.set(0, 2.8, 3)
    signGroup.add(signMesh)
    
    // Create GitHub text on the sign using canvas texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const context = canvas.getContext('2d')
    
    // Fill background
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 512, 128)
    
    // Add GitHub text
    context.fillStyle = '#24292e' // GitHub dark color
    context.font = 'bold 48px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('GITHUB', 256, 64)
    
    // Create texture from canvas
    const signTexture = new THREE.CanvasTexture(canvas)
    signTexture.needsUpdate = true
    
    // Apply texture to sign
    const textMaterial = new THREE.MeshLambertMaterial({ 
        map: signTexture,
        transparent: true
    })
    const textMesh = new THREE.Mesh(signGeometry, textMaterial)
    textMesh.position.set(0, 2.8, 3.01) // Slightly in front of the white sign
    signGroup.add(textMesh)
    
    // Add the sign to the island group
    islandGroup.add(signGroup)
    
    console.log('🪧 Added GitHub sign visible from user angle')
    console.log('🏝️ GitHub Island created successfully!')
    
    return {
        group: islandGroup,
        setHover: (isHovered) => {
            if (isHovered) {
                console.log('👆 Hovering over GitHub model')
                // Add glow effect to the sign
                signMesh.material.emissive.setHex(0x0366d6)
                signMesh.material.emissiveIntensity = 0.3
            } else {
                signMesh.material.emissive.setHex(0x000000)
                signMesh.material.emissiveIntensity = 0
            }
        },
        animate: (time) => {
            // Simple rotation
            islandGroup.rotation.y = time * 0.0001
            
            // Make the sign gently sway
            signGroup.rotation.z = Math.sin(time * 0.001) * 0.05
        }
    }
} 