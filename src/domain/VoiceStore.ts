import {SpeechEntity, VoiceValueObject} from "./SpeechEntity";

export interface VoiceStore {
    upload(voice: VoiceValueObject): Promise<void>;
    download<T>(voiceFileName: string): Promise<T>;
    getVoiceUrl(voiceFileName: string): string;
    resolveFileName(voiceFileName: string): SpeechEntity;
}