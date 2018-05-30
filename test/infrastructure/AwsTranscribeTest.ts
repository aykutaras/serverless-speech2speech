import "mocha"
import * as chai from "chai";
import * as uuid from "uuid/v4";
import {AwsTranscribe} from "../../src/infrastructure/AwsTranscribe";
import {SpeechEntity} from "../../src/domain/SpeechEntity";
import {S3Store} from "../../src/infrastructure/S3Store";

chai.should();

describe("AwsTranscribe", function() {
    this.timeout(20000);
    const store = new S3Store({
        region: "eu-west-1",
        voiceBucket: "test-speech-bucket"
    });

    const transcribe = new AwsTranscribe({region: "eu-west-1"}, store);

    it("should start transcription for english voice to text", async () => {
        const entity: SpeechEntity = {
            id: uuid(),
            sourceSpeech: {
                text: "Hello World!",
                language: "en-US",
                voice: {
                    vocalist: null,
                    voiceStream: null,
                    voiceFileName: "test.mp3"
                }
            },
            translatedSpeech: null
        };

        await transcribe.startConversion(entity);
    });

    it("should check status of an already started conversion", async () => {
        const status = await transcribe.checkConversion("5e13925c-57b7-4346-8728-c45f62e4b0f7");
        console.log(status);
        status.length.should.greaterThan(0);
    });
});
