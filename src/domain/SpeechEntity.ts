export interface SpeechEntity {
    id: string
    sourceSpeech: SpeechValueObject
    translatedSpeech: SpeechValueObject
}

export interface SpeechValueObject {
    language: string
    text: string
    voice: VoiceValueObject
}

export interface VoiceValueObject {
    vocalist: string
    voiceFileName: string
    voiceStream: Buffer
}
