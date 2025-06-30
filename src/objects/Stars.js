import * as THREE from 'three'

// Create a simple, reliable starfield that will definitely be visible
export function createStarfield() {
    const starsGroup = new THREE.Group()
    
    console.log('🌟 Creating starfield...')
    
    // Create simple white dots as stars - much more reliable
    const starCount = 1000
    const starGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    
    // Generate random star positions
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3
        
        // Create stars in a large sphere around the scene
        const radius = 150 + Math.random() * 100
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.cos(phi) 
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    // Create a circular texture for round stars
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    
    // Draw a white circle
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    
    const starTexture = new THREE.CanvasTexture(canvas)
    
    // Simple bright white material with circular texture
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 3.5,  // Reduced by 12.5% (was 4.0)
        sizeAttenuation: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        map: starTexture
    })
    
    const starMesh = new THREE.Points(starGeometry, starMaterial)
    starsGroup.add(starMesh)
    
    // Add some bigger bright stars
    const brightStarCount = 50
    const brightStarGeometry = new THREE.BufferGeometry()
    const brightPositions = new Float32Array(brightStarCount * 3)
    
    for (let i = 0; i < brightStarCount; i++) {
        const i3 = i * 3
        const radius = 120 + Math.random() * 80
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        brightPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        brightPositions[i3 + 1] = radius * Math.cos(phi)
        brightPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    
    brightStarGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3))
    
    const brightStarMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 7.0,  // Reduced by 12.5% (was 8.0)
        sizeAttenuation: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        map: starTexture  // Use the same circular texture
    })
    
    const brightStarMesh = new THREE.Points(brightStarGeometry, brightStarMaterial)
    starsGroup.add(brightStarMesh)
    
    // Add some very bright stars using small spheres for maximum visibility
    const superBrightStars = new THREE.Group()
    for (let i = 0; i < 20; i++) {
        const radius = 100 + Math.random() * 60
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        
        const starGeometry = new THREE.SphereGeometry(0.44, 8, 8)  // Reduced by 12% (was 0.5)
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9
        })
        
        const star = new THREE.Mesh(starGeometry, starMaterial)
        star.position.set(x, y, z)
        superBrightStars.add(star)
    }
    
    starsGroup.add(superBrightStars)
    
    console.log('⭐ SIMPLE STARFIELD CREATED:')
    console.log(`📊 Point Stars: ${starCount}`)
    console.log(`🌟 Bright Stars: ${brightStarCount}`)
    console.log(`💫 Super Bright Stars: 20`)
    console.log(`🎯 Starfield Group Position:`, starsGroup.position)
    console.log(`👁️ Starfield Visible:`, starsGroup.visible)
    
    return {
        group: starsGroup,
        meshes: [starMesh, brightStarMesh],
        update: (time) => {
            // Simple rotation
            starsGroup.rotation.y = time * 0.005
            
            // Simple twinkling by changing opacity
            starMaterial.opacity = 0.7 + Math.sin(time * 2) * 0.3
            brightStarMaterial.opacity = 0.8 + Math.sin(time * 1.5) * 0.2
        },
        setVisibility: (visible) => {
            starsGroup.visible = visible
            console.log(`🌟 Stars visibility set to:`, visible)
        },
                 setBrightness: (brightness) => {
             starMaterial.size = 3.5 * brightness  // Updated base size
             brightStarMaterial.size = 7.0 * brightness  // Updated base size
             console.log(`🔆 Stars brightness set to:`, brightness)
         }
    }
} 