import {SpeechToTextConverter} from "domain/SpeechToTextConverter";
import {StateMachine} from "domain/StateMachine";

import {AwsTranscribe} from "infrastructure/AwsTranscribe";
import {AwsStepFunctions} from "infrastructure/AwsStepFunctions";
import {VoiceStore} from "domain/VoiceStore";
import {S3Store} from "infrastructure/S3Store";

export const main = async (event, context, callback) => {
    const s3Key = event.Records[0].s3.object.key;
    const store: VoiceStore = new S3Store({
        region: process.env.region,
        voiceBucket: process.env.voiceBucket
    });

    const converter: SpeechToTextConverter = new AwsTranscribe({ region: process.env.region }, store);
    const stateMachine: StateMachine = new AwsStepFunctions({ region: process.env.region });

    const speechEntity = store.resolveFileName(s3Key);

    if (speechEntity.sourceSpeech === null) {
        callback(null, {success: false});
    }

    await converter.startConversion(speechEntity);
    await stateMachine.start(speechEntity.id);

    callback(null, {success: true});
};
