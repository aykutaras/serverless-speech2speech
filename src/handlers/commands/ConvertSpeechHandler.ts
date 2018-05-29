import {TextToSpeechConverter} from "domain/TextToSpeechConverter";
import {PollyConverter} from "infrastructure/PollyConverter";
import {SpeechEntity} from "domain/SpeechEntity";
import {SpeechStore} from "domain/SpeechStore";
import {S3Store} from "infrastructure/S3Store";
import {SpeechRepository} from "domain/SpeechRepository";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";

export const main = async (event, context, callback) => {
    const speechRecord = getNewRecordFromEvent(event);
    if (speechRecord === null) {
        callback(null, {"success": false});
    }

    const converter: TextToSpeechConverter = new PollyConverter({ region: process.env.region });
    const store: SpeechStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    const voiceEntity = await converter.convert(speechRecord);
    speechRecord.speechUrl = await store.upload(voiceEntity);
    const updatedRecord = await repository.update(speechRecord);
    callback(null, {"success": updatedRecord !== null})
};

function getNewRecordFromEvent(event): SpeechEntity {
    const record = event.Records[0];
    if (record.eventName !== "INSERT") {
        return null;
    }

    const newSpeech = record.dynamodb.NewImage;
    return {
        id: newSpeech.id.S,
        vocalist: newSpeech.vocalist.S,
        speechText: newSpeech.speechText.S,
        speechUrl: null
    };
}
