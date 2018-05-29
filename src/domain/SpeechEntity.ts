export interface SpeechEntity {
    id: string
    vocalist: string
    speechText: string
    speechUrl: string
}

export interface VoiceEntity {
    speechId: string
    voiceStream: Buffer
}
