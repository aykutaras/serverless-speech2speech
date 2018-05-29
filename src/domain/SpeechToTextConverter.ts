import {SpeechEntity, VoiceEntity} from "./SpeechEntity";

export interface SpeechToTextConverter {
    startConversion(entity: VoiceEntity): Promise<string>
    checkConversion(eventId: string): Promise<string>
}
