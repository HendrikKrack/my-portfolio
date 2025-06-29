import * as THREE from 'three'

// Create simple geometric hill blocks like in the reference images
function createHillBlock(position, scale = { x: 8, y: 15, z: 12 }, isRightHill = false) {
    const blockGroup = new THREE.Group()
    
    // Calculate height to extend from water level to 1 unit above bridge deck level
    const waterLevel = -0.5  // Ocean Y position
    const bridgeDeckLevel = 9.4  // Bridge deck world Y position
    const extensionAboveDeck = 1  // How much to extend above deck
    const extensionBelowWater = 1  // How much to extend below water
    
    const totalHeight = (bridgeDeckLevel + extensionAboveDeck) - (waterLevel - extensionBelowWater)
    const blockBottomY = waterLevel - extensionBelowWater
    const blockCenterY = blockBottomY + totalHeight / 2
    
    // Hill colors - simple and clean like the reference
    const hillMaterial = new THREE.MeshLambertMaterial({ 
        color: '#4A7C59', // Forest green
        flatShading: true  // Flat shading for geometric look
    })
    
    const hillMaterialDark = new THREE.MeshLambertMaterial({ 
        color: '#2F5233', // Darker green for depth
        flatShading: true
    })
    
    // Special material for middle rectangle - green-brown color
    const hillMaterialBridge = new THREE.MeshLambertMaterial({ 
        color: '#5D7C47', // Green-brown color for bridge connection
        flatShading: true
    })
    
    // Base rectangle - back to original proportional height
    const baseGeometry = new THREE.BoxGeometry(scale.x, totalHeight * 0.6, scale.z)
    const baseBlock = new THREE.Mesh(baseGeometry, hillMaterial)
    baseBlock.position.y = (blockCenterY - position.y) - totalHeight * 0.2
    blockGroup.add(baseBlock)
    
    // Middle rectangle - smaller and offset, aligned with bridge platform edge for right hill
    const midGeometry = new THREE.BoxGeometry(scale.x * 0.7, totalHeight * 0.4, scale.z * 0.8)
    const midBlock = new THREE.Mesh(midGeometry, isRightHill ? hillMaterialBridge : hillMaterialDark)
    
    // Calculate offset to align middle rectangle edge with bridge platform edge
    let midOffsetX
    if (isRightHill) {
        // For right hill: position so the middle rectangle almost touches the bridge platform
        // Add small gap to prevent z-fighting with bridge platform
        midOffsetX = -((scale.x / 2) - (scale.x * 0.7 / 2)) + 0.2  // Small gap to prevent z-fighting
    } else {
        // For left hill: add small gap to prevent z-fighting with base rectangle
        midOffsetX = scale.x * 0.15 + 0.2  // Small gap to prevent z-fighting
    }
    
    midBlock.position.set(
        midOffsetX,
        (blockCenterY - position.y) + totalHeight * 0.1 + (isRightHill ? 0.02 : 0.15),  // Larger Y offset for left hill
        isRightHill ? 0.05 : 0.15  // Z offset to ensure separation
    )
    blockGroup.add(midBlock)
    
    // Top rectangle - smallest
    const topGeometry = new THREE.BoxGeometry(scale.x * 0.5, totalHeight * 0.3, scale.z * 0.6)
    const topBlock = new THREE.Mesh(topGeometry, hillMaterial)
    topBlock.position.set(
        -scale.x * 0.1,  // Offset to other side
        (blockCenterY - position.y) + totalHeight * 0.25 + 0.04,  // Y offset to separate from middle rectangle
        scale.z * 0.1 + 0.15  // Z offset to ensure complete separation
    )
    blockGroup.add(topBlock)
    
    // Add diverse geometric shapes using piecewise approach
    
    // Create additional material for variety
    const hillMaterialMid = new THREE.MeshLambertMaterial({ 
        color: '#3D6B47', // Mid-tone green
        flatShading: true
    })
    
    // Piece 1: Elongated hexagonal prism (ridge-like)
    const ridgeGeometry = new THREE.CylinderGeometry(
        scale.x * 0.12,  // Top radius
        scale.x * 0.28,  // Bottom radius  
        totalHeight * 0.35, // Tall height
        6 // 6 sides
    )
    const ridge = new THREE.Mesh(ridgeGeometry, hillMaterialDark)
    ridge.position.set(
        -scale.x * 0.25,  // Far left
        (blockCenterY - position.y) + totalHeight * 0.1,
        scale.z * 0.15
    )
    ridge.rotation.z = Math.PI * 0.1  // Slight tilt
    blockGroup.add(ridge)
    
    // Piece 2: Octagonal dome (radial basis function inspired)
    const domeGeometry = new THREE.CylinderGeometry(
        scale.x * 0.08,  // Small top
        scale.x * 0.35,  // Wide base
        totalHeight * 0.2, // Medium height
        8 // 8 sides for dome-like appearance
    )
    const dome = new THREE.Mesh(domeGeometry, hillMaterial)
    dome.position.set(
        scale.x * 0.3,   // Far right
        (blockCenterY - position.y) + totalHeight * 0.25,
        -scale.z * 0.1
    )
    blockGroup.add(dome)
    
    // Piece 3: Triangular prism (cliff-like)
    const cliffGeometry = new THREE.CylinderGeometry(
        0,  // Point at top
        scale.x * 0.2,   // Base
        totalHeight * 0.3, // Height
        3 // 3 sides = triangle
    )
    const cliff = new THREE.Mesh(cliffGeometry, hillMaterialMid)
    cliff.position.set(
        scale.x * 0.05,  // Center-ish
        (blockCenterY - position.y) + totalHeight * 0.35,
        scale.z * 0.25
    )
    cliff.rotation.y = Math.PI * 0.3  // Rotate for asymmetry
    blockGroup.add(cliff)
    
    // Piece 4: Pentagonal tower (fractal-inspired)
    const towerGeometry = new THREE.CylinderGeometry(
        scale.x * 0.06,  // Narrow top
        scale.x * 0.15,  // Base
        totalHeight * 0.25, // Height
        5 // 5 sides
    )
    const tower = new THREE.Mesh(towerGeometry, hillMaterialDark)
    tower.position.set(
        -scale.x * 0.05,  // Slight left
        (blockCenterY - position.y) + totalHeight * 0.4,
        -scale.z * 0.2
    )
    tower.rotation.x = Math.PI * 0.05  // Slight forward tilt
    blockGroup.add(tower)
    
    // Piece 5: Irregular quadrilateral (super-ellipsoid inspired)
    const irregularGeometry = new THREE.CylinderGeometry(
        scale.x * 0.1,   // Top
        scale.x * 0.22,  // Bottom
        totalHeight * 0.18, // Height
        4 // 4 sides but will be rotated
    )
    const irregular = new THREE.Mesh(irregularGeometry, hillMaterialMid)
    irregular.position.set(
        scale.x * 0.2,   // Right side
        (blockCenterY - position.y) + totalHeight * 0.45,
        scale.z * 0.05
    )
    irregular.rotation.y = Math.PI * 0.125  // 22.5 degree rotation
    irregular.scale.set(1.2, 1, 0.8)  // Stretch to make irregular
    blockGroup.add(irregular)
    
    // Piece 6: Tiny peak cluster (multiple small elements)
    for (let i = 0; i < 3; i++) {
        const peakGeometry = new THREE.CylinderGeometry(
            scale.x * 0.02,  // Very small top
            scale.x * (0.06 + i * 0.02),  // Varying base sizes
            totalHeight * (0.08 + i * 0.02), // Varying heights
            3 + i // 3, 4, 5 sides
        )
        const peak = new THREE.Mesh(peakGeometry, i % 2 ? hillMaterial : hillMaterialDark)
        peak.position.set(
            scale.x * (-0.15 + i * 0.1),  // Spread across
            (blockCenterY - position.y) + totalHeight * (0.5 + i * 0.05),
            scale.z * (-0.05 + i * 0.05)
        )
        peak.rotation.y = Math.PI * i * 0.2  // Different rotations
        blockGroup.add(peak)
    }
    
    blockGroup.position.copy(position)
    return blockGroup
}

// Calculate bridge deck edge positions in world coordinates
function calculateBridgeEdgePositions() {
    // Bridge positioning from Bridge.js:
    // - Bridge group: position (0, 1, -70), scale 0.7
    // - Deck within group: position (0, 0, -10), width 79 units
    
    const bridgeGroupPos = { x: 0, y: 1, z: -70 }
    const bridgeScale = 0.7
    const deckRelativePos = { x: 0, y: 12, z: -10 }  // Deck Y is 12 relative to bridge group
    const deckWidth = 79 * bridgeScale  // 55.3 units in world scale
    
    // World position of deck center
    const deckWorldPos = {
        x: bridgeGroupPos.x + (deckRelativePos.x * bridgeScale),
        y: bridgeGroupPos.y + (deckRelativePos.y * bridgeScale),
        z: bridgeGroupPos.z + (deckRelativePos.z * bridgeScale)
    }
    
    // Calculate edge positions - align inner surfaces with bridge platform edges
    const leftEdge = new THREE.Vector3(
        deckWorldPos.x - deckWidth / 2 - 15,  // Position so inner edge aligns with bridge edge (30/2 = 15)
        deckWorldPos.y - 2,  // Slightly below deck level
        deckWorldPos.z
    )
    
    const rightEdge = new THREE.Vector3(
        deckWorldPos.x + deckWidth / 2 + 15,  // Position so inner edge aligns with bridge edge (30/2 = 15)
        deckWorldPos.y - 2,  // Slightly below deck level
        deckWorldPos.z
    )
    
    console.log('🌉 BRIDGE EDGE CALCULATIONS:')
    console.log('📍 Bridge Group Position:', bridgeGroupPos)
    console.log('📏 Deck World Position:', deckWorldPos)
    console.log('📐 Deck Width (scaled):', deckWidth)
    console.log('⬅️ Left Hill Position:', leftEdge)
    console.log('➡️ Right Hill Position:', rightEdge)
    
    return { leftEdge, rightEdge }
}

// Main function to create adjacent hills at bridge edges
export function createBridgeAdjacentHills() {
    const hillsGroup = new THREE.Group()
    
    // Calculate precise edge positions
    const edgePositions = calculateBridgeEdgePositions()
    
    // Create hill blocks at both edges - expanded by 20 units outward in X axis
    const leftHill = createHillBlock(edgePositions.leftEdge, { x: 30, y: 18, z: 15 }, false)  // Left hill
    const rightHill = createHillBlock(edgePositions.rightEdge, { x: 30, y: 18, z: 15 }, true)  // Right hill with alignment
    
    // Rotate the right hill by 180 degrees around its Y-axis for asymmetry
    rightHill.rotation.y = Math.PI  // 180 degrees rotation
    
    hillsGroup.add(leftHill)
    hillsGroup.add(rightHill)
    
    return {
        group: hillsGroup,
        positioning: {
            leftEdge: edgePositions.leftEdge,
            rightEdge: edgePositions.rightEdge,
            description: "Rectangular hill blocks positioned at bridge deck edges"
        },
        update: (time) => {
            // Subtle animation - gentle swaying
            hillsGroup.children.forEach((hill, index) => {
                hill.rotation.y = Math.sin(time * 0.2 + index) * 0.02
            })
        }
    }
} 