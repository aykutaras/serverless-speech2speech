import {SpeechEntity} from "./SpeechEntity";

export interface SpeechToTextConverter {
    startConversion(entity: SpeechEntity): Promise<void>
    checkConversion(speechId: string): Promise<string>
}
