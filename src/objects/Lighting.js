import * as THREE from 'three'

export function createSunsetLighting() {
    const lightingGroup = new THREE.Group()
    
    // Main sun light (warm directional light for sunset)
    const sunLight = new THREE.DirectionalLight(0xff8c42, 1.8)
    sunLight.position.set(5, 10, -15)
    sunLight.castShadow = true
    
    // Configure shadow settings for better performance
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 100
    sunLight.shadow.camera.left = -50
    sunLight.shadow.camera.right = 50
    sunLight.shadow.camera.top = 50
    sunLight.shadow.camera.bottom = -50
    
    lightingGroup.add(sunLight)
    
    // Fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.5)
    fillLight.position.set(-5, 5, 10)
    lightingGroup.add(fillLight)
    
    // Ambient light for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
    lightingGroup.add(ambientLight)
    
    // Hemisphere light for sky illumination (realistic sky-ground lighting)
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a2a6c, 0.6)
    lightingGroup.add(hemiLight)
    
    // Point light for warm glow effect
    const pointLight = new THREE.PointLight('#ff9a5a', 1.5, 30)
    pointLight.position.set(0, 10, -30)
    pointLight.distance = 100
    lightingGroup.add(pointLight)
    
    return {
        group: lightingGroup,
        lights: {
            sunLight,
            fillLight,
            ambientLight,
            hemiLight,
            pointLight
        },
        update: (time) => {
            // Animate point light intensity
            pointLight.intensity = 1.5 + Math.sin(time * 2) * 0.1
            
            // Dynamic sunset colors - sun moves through the sky
            const timeOfDay = Math.sin(time * 0.1) * 0.5 + 0.5 // 0 to 1
            const sunHeight = timeOfDay * 2 - 0.5 // -0.5 to 1.5
            sunLight.position.y = Math.max(0, sunHeight * 50)
            
            // Change sun color based on height (lower = more orange/red)
            const sunIntensity = Math.max(0, Math.min(1, sunLight.position.y / 15 + 0.3))
            sunLight.color.setHSL(
                0.1,                              // Hue (orange-red)
                0.9,                              // Saturation
                0.5 + sunIntensity * 0.3          // Lightness varies with height
            )
            sunLight.intensity = 0.5 + sunIntensity * 2.3
            
            // Update hemisphere light to match time of day
            hemiLight.intensity = 0.4 + sunIntensity * 0.2
        }
    }
} 