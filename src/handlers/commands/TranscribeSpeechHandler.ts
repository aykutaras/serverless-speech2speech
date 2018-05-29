import {SpeechToTextConverter} from "domain/SpeechToTextConverter";
import {StateMachine} from "domain/StateMachine";

import {AwsTranscribe} from "infrastructure/AwsTranscribe";
import {AwsStepFunctions} from "infrastructure/AwsStepFunctions";

export const main = async (event, context, callback) => {
    const s3Key = event.Records[0].s3.object.key;
    const splitted = s3Key.split('.');
    if (splitted.length < 4) {
        callback("Invalid formatted file", null);
    }

    if (splitted[0] !== 'raw') {
        callback(null, {success: false});
    }

    const converter: SpeechToTextConverter = new AwsTranscribe({ region: process.env.region });
    const stateMachine: StateMachine = new AwsStepFunctions({ region: process.env.region });

    const transcribeRequest = {
        LanguageCode: splitted[1], //en-US | es-US,
        Media: {
            MediaFileUri: "https://s3-" + process.env.region + ".amazonaws.com/" + process.env.voiceBucket + "/" + s3Key
        },
        MediaFormat: 'wav',
        TranscriptionJobName: s3Key[2]
    };

    const stepFunctionsRequest = {
        stateMachineArn: process.env.stateMachine,
        input: JSON.stringify({speechId: s3Key[2]}),
        name: s3Key[2]
    };

    // start transcription
    // start step function
};
