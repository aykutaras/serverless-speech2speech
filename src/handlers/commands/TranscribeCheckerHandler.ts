import {SpeechToTextConverter} from "domain/SpeechToTextConverter";
import {AwsTranscribe} from "infrastructure/AwsTranscribe";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";
import {SpeechRepository} from "domain/SpeechRepository";
import {S3Store} from "infrastructure/S3Store";
import {VoiceStore} from "domain/VoiceStore";

export const main = async (event, context, callback) => {
    const speechId = event.speechId;

    const store: VoiceStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });
    const converter: SpeechToTextConverter = new AwsTranscribe({ region: process.env.region }, store);
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    try {
        const transcript = await converter.checkConversion(speechId);
        if (transcript !== null) {
            const speechEntity = await repository.get(speechId);
            speechEntity.sourceSpeech.text = transcript;
            await repository.update(speechEntity);

            callback(null, {status: "SUCCESS"});
        }

        callback(null, {status: "IN_PROGRESS"});
    } catch (e) {
        callback(null, {status: "FAILED", reason: e})
    }
};
