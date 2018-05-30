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
    return null;
    // const record = event.Records[0];
    // if (record.eventName !== "INSERT") { // TODO this needs to be update
    //     return null;
    // }
    //
    // const newSpeech = record.dynamodb.NewImage;
    // return {
    //     id: newSpeech.id.S,
    //     vocalist: newSpeech.vocalist.S,
    //     speechText: newSpeech.speechText.S,
    //     speechUrl: null
    // };
}
