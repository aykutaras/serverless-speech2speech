import * as AWS from "aws-sdk"

import {Translator} from "domain/Translator";
import {SpeechEntity} from "domain/SpeechEntity";

export class AwsTranslate implements Translator {
    private readonly translator: AWS.Translate;

    constructor(options) {
        this.translator = new AWS.Translate(options)
    }

    async translate(entity: SpeechEntity): Promise<string> {
        const sourceLanguage = entity.sourceSpeech.language;
        const params: AWS.Translate.TranslateTextRequest = {
            SourceLanguageCode: sourceLanguage === 'auto' ? sourceLanguage : sourceLanguage.substr(0, 2),
            TargetLanguageCode: entity.translatedSpeech.language.substr(0, 2),
            Text: entity.sourceSpeech.text
        };

        const translateResponse: AWS.Translate.TranslateTextResponse = await this.translator.translateText(params).promise();

        return translateResponse.TranslatedText;
    }
}