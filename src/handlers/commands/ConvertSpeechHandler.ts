import {TextToSpeechConverter} from "domain/TextToSpeechConverter";
import {PollyConverter} from "infrastructure/PollyConverter";
import {SpeechEntity} from "domain/SpeechEntity";
import {VoiceStore} from "domain/VoiceStore";
import {S3Store} from "infrastructure/S3Store";
import {SpeechRepository} from "domain/SpeechRepository";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";

export const main = async (event, context, callback) => {
    const speechRecord = getNewRecordFromEvent(event);
    if (speechRecord === null) {
        callback(null, {"success": false});
    }

    const converter: TextToSpeechConverter = new PollyConverter({ region: process.env.region });
    const store: VoiceStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    speechRecord.translatedSpeech.voice.voiceStream = await converter.convert(speechRecord);
    speechRecord.translatedSpeech.voice.voiceFileName = `translated-${speechRecord.translatedSpeech.language}-${speechRecord.id}.mp3`;

    await store.upload(speechRecord.translatedSpeech.voice);
    const updatedRecord = await repository.update(speechRecord);
    callback(null, {"success": updatedRecord !== null})
};

function getNewRecordFromEvent(event): SpeechEntity {
    const record = event.Records[0];
    if (record.eventName !== "MODIFY") {
        return null;
    }

    const newSpeech = record.dynamodb.NewImage;

    if (newSpeech.translatedSpeech.text.S === null || newSpeech.translatedSpeech.voice.voiceFileName.S !== null) {
        return null; // Source text not translated yet or already synt, we can ignore message
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

