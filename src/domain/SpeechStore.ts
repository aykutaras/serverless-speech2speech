import {VoiceEntity} from "./SpeechEntity";

export interface SpeechStore {
    upload(entity: VoiceEntity): Promise<string>;
    download(speechId: string): Promise<VoiceEntity>;
}