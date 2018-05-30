import {AwsTranslate} from "infrastructure/AwsTranslate";
import {Translator} from "domain/Translator";
import {SpeechEntity} from "domain/SpeechEntity";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";
import {SpeechRepository} from "domain/SpeechRepository";

export const main = async (event, context, callback) => {
    const speechRecord = getNewRecordFromEvent(event);
    if (speechRecord === null) {
        callback(null, {success: false});
    }

    if (speechRecord.translatedSpeech.text !== null) {
        callback(null, {translatedText: speechRecord.translatedSpeech.text});
    }

    const translator: Translator = new AwsTranslate({ region: process.env.region });
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    const translationResponse = await translator.translate(speechRecord);
    speechRecord.translatedSpeech.text = translationResponse;

    await repository.update(speechRecord);

    callback(null, {translatedText: translationResponse});
};

function getNewRecordFromEvent(event): SpeechEntity {
    const record = event.Records[0];
    if (record.eventName !== "MODIFY") {
        return null;
    }

    const newSpeech = record.dynamodb.NewImage;

    if (newSpeech.translatedSpeech.text.S !== null) {
        return null; // Already translated move on
    }

    return {
        id: newSpeech.id.S,
        sourceSpeech: {
            voice: {
                voiceFileName: newSpeech.sourceSpeech.voice.voiceFileName.S,
                vocalist: newSpeech.sourceSpeech.voice.vocalist.S,
                voiceStream: null
            },
            text: newSpeech.sourceSpeech.text.S,
            language: newSpeech.sourceSpeech.language.S
        },
        translatedSpeech: {
            voice: {
                voiceFileName: newSpeech.translatedSpeech.voice.voiceFileName.S,
                vocalist: newSpeech.translatedSpeech.voice.vocalist.S,
                voiceStream: null
            },
            text: newSpeech.translatedSpeech.text.S,
            language: newSpeech.translatedSpeech.language.S
        }
    };
}
