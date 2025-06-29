// Procedural audio generation for ocean waves and wind sounds
export class AudioGenerator {
    static generateOceanWaves(duration = 10, sampleRate = 44100) {
        const length = duration * sampleRate
        const buffer = new Float32Array(length)
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate
            
            // Multiple wave frequencies for realistic ocean sound
            const wave1 = Math.sin(2 * Math.PI * 0.1 * t) * 0.3  // Deep ocean waves
            const wave2 = Math.sin(2 * Math.PI * 0.3 * t) * 0.2  // Medium waves
            const wave3 = Math.sin(2 * Math.PI * 0.8 * t) * 0.1  // Surface ripples
            
            // Add some randomness for natural variation
            const noise = (Math.random() - 0.5) * 0.05
            
            // Combine waves with envelope
            const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.05 * t) // Slow amplitude variation
            buffer[i] = (wave1 + wave2 + wave3 + noise) * envelope * 0.4
        }
        
        return buffer
    }
    
    static generateWind(duration = 10, sampleRate = 44100) {
        const length = duration * sampleRate
        const buffer = new Float32Array(length)
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate
            
            // Wind is primarily noise with some low-frequency modulation
            const noise = (Math.random() - 0.5) * 2
            
            // Low-frequency modulation for wind gusts
            const gust1 = Math.sin(2 * Math.PI * 0.02 * t) * 0.3
            const gust2 = Math.sin(2 * Math.PI * 0.05 * t) * 0.2
            
            // High-frequency filtering effect (simple low-pass)
            const filtered = noise * 0.7 + (i > 0 ? buffer[i-1] * 0.3 : 0)
            
            buffer[i] = filtered * (0.3 + gust1 + gust2) * 0.3
        }
        
        return buffer
    }
    
    static generateAmbience(duration = 10, sampleRate = 44100) {
        const length = duration * sampleRate
        const buffer = new Float32Array(length)
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate
            
            // Very low frequency ambient drone
            const drone1 = Math.sin(2 * Math.PI * 0.01 * t) * 0.1
            const drone2 = Math.sin(2 * Math.PI * 0.015 * t) * 0.08
            
            // Subtle noise
            const noise = (Math.random() - 0.5) * 0.02
            
            buffer[i] = (drone1 + drone2 + noise) * 0.5
        }
        
        return buffer
    }
    
    // Convert Float32Array to WAV blob
    static createWAVBlob(audioBuffer, sampleRate = 44100) {
        const length = audioBuffer.length
        const arrayBuffer = new ArrayBuffer(44 + length * 2)
        const view = new DataView(arrayBuffer)
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i))
            }
        }
        
        writeString(0, 'RIFF')
        view.setUint32(4, 36 + length * 2, true)
        writeString(8, 'WAVE')
        writeString(12, 'fmt ')
        view.setUint32(16, 16, true)
        view.setUint16(20, 1, true)
        view.setUint16(22, 1, true)
        view.setUint32(24, sampleRate, true)
        view.setUint32(28, sampleRate * 2, true)
        view.setUint16(32, 2, true)
        view.setUint16(34, 16, true)
        writeString(36, 'data')
        view.setUint32(40, length * 2, true)
        
        // Convert float samples to 16-bit PCM
        let offset = 44
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, audioBuffer[i]))
            view.setInt16(offset, sample * 0x7FFF, true)
            offset += 2
        }
        
        return new Blob([arrayBuffer], { type: 'audio/wav' })
    }
    
    // Generate and return URLs for all audio types
    static generateAllAudioURLs() {
        const oceanBuffer = this.generateOceanWaves(15) // 15 seconds
        const windBuffer = this.generateWind(20) // 20 seconds
        const ambienceBuffer = this.generateAmbience(25) // 25 seconds
        
        return {
            oceanWaves: URL.createObjectURL(this.createWAVBlob(oceanBuffer)),
            wind: URL.createObjectURL(this.createWAVBlob(windBuffer)),
            ambience: URL.createObjectURL(this.createWAVBlob(ambienceBuffer))
        }
    }
} 