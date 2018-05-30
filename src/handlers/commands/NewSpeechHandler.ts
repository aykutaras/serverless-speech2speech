import * as uuid from "uuid/v4";
import {VoiceStore} from "domain/VoiceStore";
import {S3Store} from "infrastructure/S3Store";
import {SpeechValueObject, VoiceValueObject} from "domain/SpeechEntity";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";
import {SpeechRepository} from "domain/SpeechRepository";
import {SpeechEntity} from "domain/SpeechEntity";

export const main = async (event, context, callback) => {
    const store: VoiceStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });

    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    const speechId = uuid();
    const sourceVoice: VoiceValueObject = {
        vocalist: event.vocalist,
        voiceFileName: `source.${event.language}.${speechId}.wav`,
        voiceStream: event.voiceStream
    };

    await store.upload(sourceVoice);

    const sourceSpeech: SpeechValueObject = {
        language: event.language,
        text: null,
        voice: sourceVoice
    };
    const speechEntity: SpeechEntity = {
        id: speechId,
        sourceSpeech: sourceSpeech,
        translatedSpeech: null
    };

    const storeResponse = await repository.create(speechEntity);
    const response = {
        "statusCode": 200,
        "body": {"speechId": storeResponse.id},
        "isBase64Encoded": false
    };

    callback(null, response);
};