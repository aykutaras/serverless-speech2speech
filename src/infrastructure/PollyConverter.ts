import * as AWS from "aws-sdk"
import {TextToSpeechConverter} from "domain/TextToSpeechConverter";
import {SpeechEntity} from "domain/SpeechEntity";

export class PollyConverter implements TextToSpeechConverter {
    private readonly polly: AWS.Polly;

    constructor(options) {
        this.polly = new AWS.Polly(options);
    }

    async convert(entity: SpeechEntity): Promise<Buffer> {
        const params = {
            OutputFormat: "mp3",
            Text: entity.translatedSpeech.text,
            TextType: "text",
            VoiceId: entity.translatedSpeech.voice.vocalist
        };

        const data = await this.polly.synthesizeSpeech(params).promise();
        return <Buffer>data.AudioStream;
    }
}