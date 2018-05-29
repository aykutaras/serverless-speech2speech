import * as AWS from "aws-sdk"

import {SpeechToTextConverter} from "domain/SpeechToTextConverter";
import {VoiceEntity} from "domain/SpeechEntity";

export class AwsTranscribe implements SpeechToTextConverter {
    private readonly transcribe: AWS.TranscribeService;

    constructor(options) {
        this.transcribe = new AWS.TranscribeService(options)
    }

    async checkConversion(eventId: string): Promise<string> {
        return undefined;
    }

    async startConversion(entity: VoiceEntity): Promise<string> {
        return undefined;
    }

}
