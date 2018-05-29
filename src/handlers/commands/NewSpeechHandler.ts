import * as uuid from "uuid/v4";
import {SpeechStore} from "domain/SpeechStore";
import {S3Store} from "infrastructure/S3Store";
import {VoiceEntity} from "domain/SpeechEntity";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";
import {SpeechRepository} from "domain/SpeechRepository";
import {SpeechEntity} from "domain/SpeechEntity";

export const main = async (event, context, callback) => {
    const store: SpeechStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });

    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    const speechId = uuid();
    const voiceEntity: VoiceEntity = {
        speechFileName: `raw.${event.language}.${speechId}.wav`,
        voiceStream: event.voiceStream
    };

    const sourceSpeechUrl = await store.upload(voiceEntity);

    const speechEntity: SpeechEntity = {
        id: speechId,
        language: event.language,
        vocalist: event.voice,
        sourceSpeechText: null,
        sourceSpeechUrl: sourceSpeechUrl,
        translatedSpeechText: null,
        translatedSpeechUrl: null
    };

    const storeResponse = await repository.create(speechEntity);
    const response = {
        "statusCode": 200,
        "body": {"speechId": storeResponse.id},
        "isBase64Encoded": false
    };

    callback(null, response);
};