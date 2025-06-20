import * as THREE from 'three'

// Create bridge tower with Art Deco styling
function createBridgeTower(x, z) {
    const towerGroup = new THREE.Group()
    
    // Main tower
    const towerGeometry = new THREE.BoxGeometry(1.5, 25, 1.5)
    const towerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b', // International Orange
        roughness: 0.6,
        metalness: 0.4
    })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.y = 12.5
    towerGroup.add(tower)
    
    // Cross beams
    const beamGeometry = new THREE.BoxGeometry(2, 0.3, 0.3)
    for (let i = 0; i < 5; i++) {
        const beam = new THREE.Mesh(beamGeometry, towerMaterial)
        beam.position.y = 5 + i * 4
        towerGroup.add(beam)
    }
    
    // Tower top
    const topGeometry = new THREE.BoxGeometry(2, 1, 2)
    const top = new THREE.Mesh(topGeometry, towerMaterial)
    top.position.y = 26
    towerGroup.add(top)
    
    towerGroup.position.set(x, 0, z)
    return towerGroup
}

// Create bridge deck with barriers
function createBridgeDeck() {
    const deckGroup = new THREE.Group()
    
    const deckGeometry = new THREE.BoxGeometry(60, 0.8, 4)
    const deckMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.8,
        metalness: 0.2
    })
    const deck = new THREE.Mesh(deckGeometry, deckMaterial)
    deck.position.y = 8
    deckGroup.add(deck)
    
    // Barriers
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

// Create suspension cables with realistic curves
function createSuspensionCables() {
    const cablesGroup = new THREE.Group()
    
    // Main cables - align with tower positions at -25 and +25
    const points1 = []
    const points2 = []
    
    for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const x = -25 + t * 50  // Span from -25 to +25 (50 units total) to align with towers
        const y = 20 + ((x * x) / 100) * 0.8  // Parabolic curve, slightly flatter
        
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
    
    // Hanger cables - also align with the adjusted span
    const hangerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.4,
        metalness: 0.6
    })
    
    for (let i = -24; i <= 24; i += 2) {  // Adjusted to stay within tower bounds
        const cableHeight = 20 + ((i * i) / 100) * 0.8  // Match the main cable curve
        const hangerLength = cableHeight - 8.5
        
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

// Main function to create the complete Golden Gate Bridge
export function createGoldenGateBridge() {
    const bridgeGroup = new THREE.Group()
    
    // Assemble bridge components
    const tower1 = createBridgeTower(-25, -10)
    const tower2 = createBridgeTower(25, -10)
    bridgeGroup.add(tower1, tower2)
    
    const deck = createBridgeDeck()
    bridgeGroup.add(deck)
    
    const suspensionCables = createSuspensionCables()
    bridgeGroup.add(suspensionCables)
    
    // Position and scale the bridge
    bridgeGroup.scale.set(0.4, 0.4, 0.4)
    bridgeGroup.position.set(0, -3, -40)
    
    return {
        group: bridgeGroup,
        update: (time) => {
            // Gentle swaying motion
            bridgeGroup.rotation.z = Math.sin(time * 0.3) * 0.01
        }
    }
} 