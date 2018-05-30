import * as AWS from "aws-sdk"

import {SpeechToTextConverter} from "domain/SpeechToTextConverter";
import {SpeechEntity} from "domain/SpeechEntity";
import {VoiceStore} from "domain/VoiceStore";

export class AwsTranscribe implements SpeechToTextConverter {
    private readonly transcribe: AWS.TranscribeService;
    private readonly store: VoiceStore;

    constructor(options, store: VoiceStore) {
        this.transcribe = new AWS.TranscribeService(options)
        this.store = store;
    }

    async checkConversion(eventId: string): Promise<string> {
        const request = {
            TranscriptionJobName: eventId
        };

        const response = await this.transcribe.getTranscriptionJob(request).promise();

        switch (response.TranscriptionJob.TranscriptionJobStatus) {
            case "IN_PROGRESS": {
                return null;
            }
            case "FAILED": {
                throw new Error(response.TranscriptionJob.FailureReason);
            }
            case "COMPLETED": {
                return response.TranscriptionJob.Transcript.TranscriptFileUri;
            }
        }

        return null;
    }

    async startConversion(entity: SpeechEntity): Promise<void> {
        const transcribeRequest = {
            LanguageCode: entity.sourceSpeech.language, //en-US | es-US,
            Media: {
                MediaFileUri: this.store.getVoiceUrl(entity.sourceSpeech.voice.voiceFileName) //"https://s3-" + process.env.region + ".amazonaws.com/" + process.env.voiceBucket + "/" + speech.voice.voiceFileName
            },
            MediaFormat: 'wav',
            TranscriptionJobName: entity.id
        };

        await this.transcribe.startTranscriptionJob(transcribeRequest).promise();
    }
}
