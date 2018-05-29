import {SpeechEntity, VoiceEntity} from "./SpeechEntity";

export interface TextToSpeechConverter {
    convert(entity: SpeechEntity): Promise<VoiceEntity>
}