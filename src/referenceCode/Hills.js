import * as THREE from 'three'

// Function to create a text label for hills
function createHillLabel(text, position) {
    // Create a canvas for the text
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 128
    canvas.height = 64
    
    // Style the text
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000000'
    context.font = 'bold 20px Arial'
    context.textAlign = 'center'
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 7)
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    
    // Create a plane to display the text
    const labelGeometry = new THREE.PlaneGeometry(2, 1)
    const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
    })
    const label = new THREE.Mesh(labelGeometry, labelMaterial)
    
    // Position the label above the hill
    label.position.copy(position)
    label.position.y += 3  // Place above the hill
    
    // Make label always face the camera
    label.lookAt(0, 10, 8)  // Look towards camera position
    
    return label
}

export function createSanFranciscoHills() {
    const hillsGroup = new THREE.Group()
    
    // Define fixed positions and properties for main hills (20% bigger)
    const mainHills = [
        { id: 'hill_main_1', radius: 3.84, x: -20, z: -18, rotation: 0.5, hue: 0.28, sat: 0.45, light: 0.42 },
        { id: 'hill_main_4', radius: 3.12, x: 1, z: -10, rotation: 0.8, hue: 0.35, sat: 0.42, light: 0.45 },
        { id: 'hill_main_5', radius: 3.72, x: 28, z: -28, rotation: 1.7, hue: 0.29, sat: 0.48, light: 0.38 },
        { id: 'hill_main_6', radius: 3.48, x: -1, z: -35, rotation: 0.3, hue: 0.31, sat: 0.44, light: 0.41 },
        { id: 'hill_main_7', radius: 3.96, x: 12, z: -32, rotation: 1.9, hue: 0.27, sat: 0.46, light: 0.44 },
        { id: 'hill_main_8', radius: 3.24, x: -25, z: -30, rotation: 1.4, hue: 0.33, sat: 0.41, light: 0.39 }
    ]
    
    // Create main hills with fixed properties
    mainHills.forEach((hillData, index) => {
        const hillGeometry = new THREE.SphereGeometry(
            hillData.radius,      // Fixed radius (now 20% bigger)
            16,                   // Width segments for smooth curves
            8,                    // Height segments
            0,                    // Phi start
            Math.PI * 2,          // Phi length (full circle)
            0,                    // Theta start
            Math.PI * 0.6         // Theta length (cut sphere to create hill shape)
        )
        
        // Scale the geometry to make it more hill-like (flatter but wide)
        hillGeometry.scale(1, 0.7, 1)
        
        const hillMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color().setHSL(hillData.hue, hillData.sat, hillData.light),
            roughness: 0.9,
            metalness: 0.0
        })
        
        const hill = new THREE.Mesh(hillGeometry, hillMaterial)
        hill.name = hillData.id  // Assign ID to the hill
        
        // Set fixed position
        hill.position.set(hillData.x, -1.5, hillData.z)
        
        // Set fixed rotation
        hill.rotation.y = hillData.rotation
        hill.rotation.x = 0.05  // Slight forward tilt
        hill.rotation.z = 0.02  // Slight side tilt
        
        // Enable shadow casting and receiving
        hill.castShadow = true
        hill.receiveShadow = true
        
        hillsGroup.add(hill)
        
        // Add label showing hill number
        const label = createHillLabel(`M${index + 1}`, hill.position)
        hillsGroup.add(label)
    })
    
    // Define fixed positions for background hills (smaller, further back, also 20% bigger)
    const backgroundHills = [
        { id: 'hill_bg_1', radius: 2.16, x: -35, z: -45, rotation: 0.7, hue: 0.32, sat: 0.35, light: 0.28 },
        { id: 'hill_bg_2', radius: 1.8, x: -15, z: -20, rotation: 1.5, hue: 0.28, sat: 0.38, light: 0.25 },
        { id: 'hill_bg_3', radius: 2.52, x: 8, z: -42, rotation: 0.2, hue: 0.34, sat: 0.32, light: 0.30 },
        { id: 'hill_bg_4', radius: 2.04, x: 25, z: -46, rotation: 1.8, hue: 0.30, sat: 0.36, light: 0.27 },
        { id: 'hill_bg_5', radius: 2.28, x: 40, z: -50, rotation: 1.1, hue: 0.29, sat: 0.34, light: 0.29 },
        { id: 'hill_bg_6', radius: 1.92, x: -20, z: -52, rotation: 0.9, hue: 0.33, sat: 0.37, light: 0.26 }
    ]
    
    // Create background hills with fixed properties
    backgroundHills.forEach((hillData, index) => {
        const smallHillGeometry = new THREE.SphereGeometry(
            hillData.radius,      // Fixed smaller radius (now 20% bigger)
            12,                   // Lower detail for background hills
            6,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.5         // Even flatter
        )
        
        smallHillGeometry.scale(1.2, 0.5, 1.2)  // More flattened
        
        const smallHillMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color().setHSL(hillData.hue, hillData.sat, hillData.light),
            roughness: 0.95,
            metalness: 0.0
        })
        
        const smallHill = new THREE.Mesh(smallHillGeometry, smallHillMaterial)
        smallHill.name = hillData.id  // Assign ID to the background hill
        
        // Set fixed position
        smallHill.position.set(hillData.x, -2, hillData.z)
        
        // Set fixed rotation
        smallHill.rotation.y = hillData.rotation
        
        smallHill.castShadow = true
        smallHill.receiveShadow = true
        
        hillsGroup.add(smallHill)
        
        // Add label showing background hill number
        const label = createHillLabel(`B${index + 1}`, smallHill.position)
        hillsGroup.add(label)
    })
    
    return {
        group: hillsGroup,
        // Get hill by ID function
        getHillById: (id) => {
            return hillsGroup.children.find(hill => hill.name === id)
        },
        // Get all hill IDs
        getHillIds: () => {
            return hillsGroup.children.filter(child => child.name).map(hill => hill.name)
        },
        update: (time) => {
            // Optional: Add very subtle wind animation to make hills feel alive
            hillsGroup.children.forEach((hill, index) => {
                // Only animate hills, not labels
                if (hill.name && hill.name.includes('hill')) {
                    // Very subtle movement to simulate heat shimmer or distant haze
                    hill.position.y += Math.sin(time * 0.3 + index) * 0.002
                }
            })
        }
    }
} 