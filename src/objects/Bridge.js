import * as THREE from 'three'

// Create bridge tower with Art Deco styling
function createBridgeTower(x, z) {
    const towerGroup = new THREE.Group()
    
    // Main tower - OPTIMAL HEIGHT for water clearance
    const towerGeometry = new THREE.BoxGeometry(1.5, 24, 1.5)  // Reduced by 3 units from 27 to 24
    const towerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b', // International Orange
        roughness: 0.6,
        metalness: 0.4
    })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.y = 12  // Adjusted for new height (24/2 = 12)
    towerGroup.add(tower)
    
    // Cross beams - adjusted positions for 24-unit tower height
    const beamGeometry = new THREE.BoxGeometry(2, 0.3, 0.3)
    for (let i = 0; i < 6; i++) {  // 6 beams evenly spaced
        const beam = new THREE.Mesh(beamGeometry, towerMaterial)
        beam.position.y = 4 + i * 3.2  // Adjusted spacing for 24-unit tower
        towerGroup.add(beam)
    }
    
    // Tower top - adjusted for new height
    const topGeometry = new THREE.BoxGeometry(2, 1, 2)
    const top = new THREE.Mesh(topGeometry, towerMaterial)
    top.position.y = 25  // Top of the 24-unit tower + 1 unit cap
    towerGroup.add(top)
    
    // Tower foundation - extends down to below water level
    const foundationHeight = 3  // Extends 3 units below tower base
    const foundationGeometry = new THREE.BoxGeometry(2.5, foundationHeight, 2.5)  // Slightly wider than tower
    const foundationMaterial = new THREE.MeshStandardMaterial({ 
        color: '#8B4513', // Saddle brown for concrete foundation
        roughness: 0.8,
        metalness: 0.1
    })
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial)
    foundation.position.y = -foundationHeight / 2  // Position foundation below tower base
    towerGroup.add(foundation)
    
    // Underwater foundation base - even wider for stability
    const underwaterHeight = 2
    const underwaterGeometry = new THREE.BoxGeometry(3.5, underwaterHeight, 3.5)  // Even wider
    const underwaterMaterial = new THREE.MeshStandardMaterial({ 
        color: '#654321', // Dark brown for underwater concrete
        roughness: 0.9,
        metalness: 0.05
    })
    const underwaterBase = new THREE.Mesh(underwaterGeometry, underwaterMaterial)
    underwaterBase.position.y = -foundationHeight - underwaterHeight / 2  // Below foundation
    towerGroup.add(underwaterBase)
    
    towerGroup.position.set(x, 0, z)
    return towerGroup
}

// Create bridge deck with barriers
function createBridgeDeck() {
    const deckGroup = new THREE.Group()
    
    const deckGeometry = new THREE.BoxGeometry(79, 0.8, 4)  // Extended by another 10% from 72 to 79
    const deckMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.8,
        metalness: 0.2
    })
    const deck = new THREE.Mesh(deckGeometry, deckMaterial)
    deck.position.y = 9  // Lowered by 3 units from 12 to 9 to blend with hills
    deckGroup.add(deck)
    
    // Barriers - extended to match new deck length
    const barrierGeometry = new THREE.BoxGeometry(79, 1, 0.2)  // Extended by another 10% from 72 to 79
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
        color: '#c0392b',
        roughness: 0.6,
        metalness: 0.4
    })
    
    const leftBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    leftBarrier.position.set(0, 10, 2.1)  // Lowered by 3 units from 13 to 10
    deckGroup.add(leftBarrier)
    
    const rightBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
    rightBarrier.position.set(0, 10, -2.1)  // Lowered by 3 units from 13 to 10
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
        const y = 19 + ((x * x) / 100) * 0.8  // Adjusted for 24-unit towers
        
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
    
    // APPROACH CABLES - From towers to platform edges
    // Left approach cable (from left platform edge to left tower TOP)
    const leftApproachPoints = []
    for (let i = 0; i <= 50; i++) {
        const t = i / 50
        const x = -39.5 + t * 14.5  // From left platform edge (-39.5) to left tower (-25)
        // Correct height: from platform level (9) to tower top (25) with more sag
        const y = 9 + t * 16 - t * (1 - t) * 8  // More concave/hanging curve for approach cable
        leftApproachPoints.push(new THREE.Vector3(x, y, -10))
    }
    
    // Right approach cable (from right tower TOP to right platform edge)  
    const rightApproachPoints = []
    for (let i = 0; i <= 50; i++) {
        const t = i / 50
        const x = 25 + t * 14.5  // From right tower (25) to right platform edge (39.5)
        // Correct height: from tower top (25) to platform level (9) with more sag
        const y = 25 - t * 16 - t * (1 - t) * 8  // More concave/hanging curve for approach cable
        rightApproachPoints.push(new THREE.Vector3(x, y, -10))
    }
    
    const leftApproachCurve = new THREE.CatmullRomCurve3(leftApproachPoints)
    const rightApproachCurve = new THREE.CatmullRomCurve3(rightApproachPoints)
    
    const leftApproachGeometry = new THREE.TubeGeometry(leftApproachCurve, 50, 0.06, 8, false)
    const rightApproachGeometry = new THREE.TubeGeometry(rightApproachCurve, 50, 0.06, 8, false)
    
    const leftApproachCable = new THREE.Mesh(leftApproachGeometry, cableMaterial)
    const rightApproachCable = new THREE.Mesh(rightApproachGeometry, cableMaterial)
    
    cablesGroup.add(leftApproachCable)
    cablesGroup.add(rightApproachCable)
    
    // Hanger cables - also align with the adjusted span
    const hangerMaterial = new THREE.MeshStandardMaterial({ 
        color: '#2c3e50',
        roughness: 0.4,
        metalness: 0.6
    })
    
    for (let i = -24; i <= 24; i += 2) {  // Adjusted to stay within tower bounds
        const cableHeight = 19 + ((i * i) / 100) * 0.8  // Match the main cable curve (adjusted to 19)
        const hangerLength = cableHeight - 9.5  // Adjusted for new deck height (9 + 0.5 buffer)
        
        const hangerGeometry = new THREE.CylinderGeometry(0.02, 0.02, hangerLength)
        
        const hanger1 = new THREE.Mesh(hangerGeometry, hangerMaterial)
        hanger1.position.set(i, 9.5 + hangerLength/2, -8.5)  // Adjusted start position for lowered deck
        cablesGroup.add(hanger1)
        
        const hanger2 = new THREE.Mesh(hangerGeometry, hangerMaterial)
        hanger2.position.set(i, 9.5 + hangerLength/2, -11.5)  // Adjusted start position for lowered deck
        cablesGroup.add(hanger2)
    }
    
    // APPROACH HANGER CABLES - Connect approach cables to platform extensions
    // Left approach hangers (from left platform edge to left tower)
    for (let i = -36; i <= -26; i += 2) {  // Cover the left extension area
        const t = (i + 39.5) / 14.5  // Position along the left approach span (0 to 1)
        const approachCableHeight = 9 + t * 16 - t * (1 - t) * 8  // Match the approach cable curve with more sag
        const approachHangerLength = approachCableHeight - 9
        
        if (approachHangerLength > 0.2) {  // Only create if cable is meaningfully above deck
            const approachHangerGeometry = new THREE.CylinderGeometry(0.015, 0.015, approachHangerLength)
            const leftApproachHanger = new THREE.Mesh(approachHangerGeometry, hangerMaterial)
            leftApproachHanger.position.set(i, 9 + approachHangerLength/2, -10)
            cablesGroup.add(leftApproachHanger)
        }
    }
    
    // Right approach hangers (from right tower to right platform edge)
    for (let i = 26; i <= 36; i += 2) {  // Cover the right extension area
        const t = (i - 25) / 14.5  // Position along the right approach span (0 to 1)
        const approachCableHeight = 25 - t * 16 - t * (1 - t) * 8  // Match the approach cable curve with more sag
        const approachHangerLength = approachCableHeight - 9
        
        if (approachHangerLength > 0.2) {  // Only create if cable is meaningfully above deck
            const approachHangerGeometry = new THREE.CylinderGeometry(0.015, 0.015, approachHangerLength)
            const rightApproachHanger = new THREE.Mesh(approachHangerGeometry, hangerMaterial)
            rightApproachHanger.position.set(i, 9 + approachHangerLength/2, -10)
            cablesGroup.add(rightApproachHanger)
        }
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
    
    // IMPROVED POSITIONING - Moved much further back for wide composition
    bridgeGroup.scale.set(0.7, 0.7, 0.7)  // Increased from 0.4 to 0.7
    bridgeGroup.position.set(0, 1, -70)    // Moved to Z: -70 for wide viewing distance
    
    return {
        group: bridgeGroup,
        // Add position info for debugging
        positioning: {
            scale: 0.7,
            position: { x: 0, y: 1, z: -30 },
            description: "Bridge positioned for optimal viewing - 30 units from camera, 1 unit above water"
        },
        update: (time) => {
            // Gentle swaying motion
            bridgeGroup.rotation.z = Math.sin(time * 0.3) * 0.01
        }
    }
} 