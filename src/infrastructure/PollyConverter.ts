import * as AWS from "aws-sdk"
import {TextToSpeechConverter} from "domain/TextToSpeechConverter";
import {SpeechEntity, VoiceEntity} from "domain/SpeechEntity";

export class PollyConverter implements TextToSpeechConverter {
    private readonly polly: AWS.Polly;

    constructor(options) {
        this.polly = new AWS.Polly(options);
    }

    async convert(entity: SpeechEntity): Promise<VoiceEntity> {
        const params = {
            OutputFormat: "mp3",
            Text: entity.speechText,
            TextType: "text",
            VoiceId: entity.vocalist
        };

        const data = await this.polly.synthesizeSpeech(params).promise();
        return {
            speechId: entity.id,
            voiceStream: <Buffer>data.AudioStream
        }
    }

}