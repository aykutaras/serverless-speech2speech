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
        vocalist: null,
        voiceFileName: `source.${event.sourceSpeech.language}.${speechId}.wav`,
        voiceStream: event.sourceSpeech.voice.voiceStream
    };

    const uploadPromise = store.upload(sourceVoice);

    const translatedVoice: VoiceValueObject = {
        vocalist: event.translatedSpeech.voice.vocalist,
        voiceFileName: null,
        voiceStream: null
    };

    const sourceSpeech: SpeechValueObject = {
        language: event.sourceSpeech.language,
        text: null,
        voice: sourceVoice
    };

    const translatedSpeech: SpeechValueObject = {
        language: event.translatedSpeech.language,
        text: null,
        voice: translatedVoice
    };

    const speechEntity: SpeechEntity = {
        id: speechId,
        sourceSpeech: sourceSpeech,
        translatedSpeech: translatedSpeech
    };

    await uploadPromise;
    const storeResponse = await repository.create(speechEntity);
    const response = {
        "statusCode": 200,
        "body": {"speechId": storeResponse.id},
        "isBase64Encoded": false
    };

    callback(null, response);
};