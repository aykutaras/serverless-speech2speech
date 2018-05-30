import {SpeechEntity} from "./SpeechEntity";

export interface TextToSpeechConverter {
    convert(entity: SpeechEntity): Promise<Buffer>
}