import { Howl, Howler } from 'howler'

export class AudioSystem {
    constructor() {
        this.sounds = {}
        this.isInitialized = false
        this.masterVolume = 0.7
        this.audioContext = null
        
        // Set up Howler global settings
        Howler.volume(this.masterVolume)
        
        this.initializeAudio()
    }
    
    async initializeAudio() {
        try {
            // Create audio context for spatial audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            
            console.log('🌊 Loading wave sound...')
            
            // Create ocean waves sound using your provided audio file
            this.sounds.oceanWaves = new Howl({
                src: ['./audio/mixkit-small-waves-harbor-rocks-1208.wav'],
                loop: true,
                volume: 0.5,
                rate: 1.0,
                autoplay: false,
                html5: false
            })
            
            console.log('🔊 Audio system initialized with real wave sounds')
            this.isInitialized = true
            
        } catch (error) {
            console.warn('⚠️ Audio initialization failed:', error)
            this.isInitialized = false
        }
    }
    
    // Start the ambient soundscape
    startAmbientSounds() {
        if (!this.isInitialized) {
            console.warn('⚠️ Audio system not initialized')
            return
        }
        
        // Start ocean waves
        if (this.sounds.oceanWaves && !this.sounds.oceanWaves.playing()) {
            this.sounds.oceanWaves.play()
            console.log('🌊 Ocean waves started')
        }
    }
    
    // Stop all ambient sounds
    stopAmbientSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.playing()) {
                sound.fade(sound.volume(), 0, 1000)
                setTimeout(() => sound.stop(), 1000)
            }
        })
        console.log('🔇 Ambient sounds stopped')
    }
    
    // Update audio based on camera position and scene state
    updateSpatialAudio(cameraPosition, sceneState = {}) {
        if (!this.isInitialized) return
        
        // Calculate distance from camera to water (ocean is at Y: -0.5)
        const distanceToWater = Math.abs(cameraPosition.y - (-0.5))
        const waterProximity = Math.max(0, 1 - (distanceToWater / 20)) // Normalize to 0-1
        
        // Update ocean waves volume based on proximity to water
        if (this.sounds.oceanWaves) {
            const waveVolume = Math.max(0.3, waterProximity * 0.8) // Keep minimum volume, max 0.8
            this.sounds.oceanWaves.volume(waveVolume)
        }
    }
    

    
    // Set master volume
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume))
        Howler.volume(this.masterVolume)
        console.log(`🔊 Master volume set to ${Math.round(this.masterVolume * 100)}%`)
    }
    
    // Mute/unmute all audio
    toggleMute() {
        if (Howler.volume() > 0) {
            this.previousVolume = Howler.volume()
            Howler.volume(0)
            console.log('🔇 Audio muted')
        } else {
            Howler.volume(this.previousVolume || this.masterVolume)
            console.log('🔊 Audio unmuted')
        }
    }
    
    // Clean up audio resources
    destroy() {
        this.stopAmbientSounds()
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.unload()
        })
        this.sounds = {}
        console.log('🗑️ Audio system destroyed')
    }
} 