import {SpeechEntity} from "./SpeechEntity";

export interface SpeechRepository {
    create(entity: SpeechEntity): Promise<SpeechEntity>
    update(entity: SpeechEntity): Promise<SpeechEntity>
    get(id: string): Promise<SpeechEntity>
    getList(): Promise<SpeechEntity[]>
}