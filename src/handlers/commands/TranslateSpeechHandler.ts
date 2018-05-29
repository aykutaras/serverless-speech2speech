import * as uuid from "uuid/v4";
import {AwsTranslate} from "infrastructure/AwsTranslate";
import {Translator} from "domain/Translator";
import {TranslationEntity} from "domain/TranslationEntity";

export const main = async (event, context, callback) => {
    const entity: TranslationEntity = {
        id: uuid(),
        sourceLanguageCode: event.sourceLanguageCode,
        targetLanguageCode: event.targetLanguageCode,
        sourceText: event.sourceText,
        translatedText: null
    };

    const translator: Translator = new AwsTranslate({ region: process.env.region });
    const translationResponse = await translator.translate(entity);

    const response = {
        "statusCode": 200,
        "body": { translatedText: translationResponse.translatedText },
        "isBase64Encoded": false
    };

    callback(null, response);
};
