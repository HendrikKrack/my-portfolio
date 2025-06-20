import * as THREE from 'three'

export function createSurfboards() {
    const surfboards = new THREE.Group()
    
    const surfboardDesigns = [
        { color: '#FF4136', stripeColor: '#FFFFFF' }, // Red with white stripe
        { color: '#0074D9', stripeColor: '#FFDC00' }, // Blue with yellow stripe
        { color: '#2ECC40', stripeColor: '#001F3F' }, // Green with navy stripe
        { color: '#FFDC00', stripeColor: '#FF4136' }, // Yellow with red stripe
        { color: '#B10DC9', stripeColor: '#7FDBFF' }  // Purple with light blue stripe
    ]
    
    for (let i = 0; i < 12; i++) {
        const surfboard = new THREE.Group()
        const design = surfboardDesigns[Math.floor(Math.random() * surfboardDesigns.length)]
        
        // Board body
        const boardGeometry = new THREE.BoxGeometry(2, 0.1, 0.6)
        const boardMaterial = new THREE.MeshStandardMaterial({
            color: design.color,
            roughness: 0.3,
            metalness: 0.1
        })
        const board = new THREE.Mesh(boardGeometry, boardMaterial)
        
        // Stripe down the middle
        const stripeGeometry = new THREE.BoxGeometry(1.6, 0.05, 0.1)
        const stripeMaterial = new THREE.MeshStandardMaterial({
            color: design.stripeColor,
            roughness: 0.3
        })
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
        stripe.position.y = 0.01 // Slightly above the board
        
        // Surfboard fins
        const finGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.15)
        const finMaterial = new THREE.MeshStandardMaterial({ color: '#333333' })
        
        // Rear fin (bigger)
        const rearFin = new THREE.Mesh(finGeometry, finMaterial)
        rearFin.position.set(0, 0.1, -0.2)
        
        // Side fins (smaller)
        const leftFin = new THREE.Mesh(finGeometry, finMaterial)
        leftFin.position.set(-0.15, 0.05, -0.1)
        
        const rightFin = new THREE.Mesh(finGeometry, finMaterial)
        rightFin.position.set(0.15, 0.05, -0.1)
        
        // Add all parts to the surfboard group
        surfboard.add(board, stripe, rearFin, leftFin, rightFin)
        
        // Position randomly in the water
        const angle = Math.random() * Math.PI * 2
        const distance = 15 + Math.random() * 25
        surfboard.position.set(
            Math.cos(angle) * distance,
            0.5 + Math.random() * 0.3, // Slightly above water
            Math.sin(angle) * distance - 20
        )
        
        // Random rotation
        surfboard.rotation.y = Math.random() * Math.PI * 2
        surfboard.rotation.x = Math.random() * 0.2
        surfboard.rotation.z = Math.random() * 0.2
        
        // Random scale for variety
        const scale = 0.8 + Math.random() * 0.4
        surfboard.scale.set(scale, scale, scale)
        
        // Animation data for floating motion
        surfboard.userData = {
            offset: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            originalY: surfboard.position.y
        }
        
        surfboards.add(surfboard)
    }
    
    return {
        group: surfboards,
        update: (time) => {
            // Animate floating motion for each surfboard
            surfboards.children.forEach((surfboard) => {
                // Gentle bobbing motion
                surfboard.position.y = surfboard.userData.originalY + 
                    Math.sin(time * surfboard.userData.speed + surfboard.userData.offset) * 0.2
                
                // Slight rotation for realism
                surfboard.rotation.y += surfboard.userData.rotationSpeed
            })
        }
    }
} 