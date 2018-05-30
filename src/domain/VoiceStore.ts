import {SpeechEntity, VoiceValueObject} from "./SpeechEntity";

export interface VoiceStore {
    upload(voice: VoiceValueObject): Promise<void>;
    download(voiceFileName: string): Promise<Buffer>;
    getVoiceUrl(voiceFileName: string): string;
    resolveFileName(voiceFileName: string): SpeechEntity;
}