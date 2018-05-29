export interface SpeechEntity {
    id: string
    language: string
    vocalist: string
    sourceSpeechText: string
    translatedSpeechText: string
    sourceSpeechUrl: string
    translatedSpeechUrl: string
}

export interface VoiceEntity {
    speechFileName: string
    voiceStream: Buffer
}

export enum TranscriptLanguage {
    en = 'en-US',
    es = 'es-US'
}
