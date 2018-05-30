import {SpeechEntity} from "./SpeechEntity";

export interface Translator {
    translate(entity: SpeechEntity): Promise<string>
}