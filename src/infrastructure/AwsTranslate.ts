import * as AWS from "aws-sdk"

import {Translator} from "domain/Translator";
import {TranslationEntity} from "domain/TranslationEntity";

export class AwsTranslate implements Translator {
    private readonly translator: AWS.Translate;

    constructor(options) {
        this.translator = new AWS.Translate(options)
    }

    async translate(entity: TranslationEntity): Promise<TranslationEntity> {
        const params: AWS.Translate.TranslateTextRequest = {
            SourceLanguageCode: entity.sourceLanguageCode,
            TargetLanguageCode: entity.targetLanguageCode,
            Text: entity.sourceText
        };

        const translateResponse: AWS.Translate.TranslateTextResponse = await this.translator.translateText(params).promise();

        entity.translatedText = translateResponse.TranslatedText;
        return entity;
    }
}