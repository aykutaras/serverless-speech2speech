import {TranslationEntity} from "./TranslationEntity";

export interface Translator {
    translate(entity: TranslationEntity): Promise<TranslationEntity>
}