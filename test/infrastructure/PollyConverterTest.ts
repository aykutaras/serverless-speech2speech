import "mocha"
import * as chai from "chai";
import {PollyConverter} from "../../src/infrastructure/PollyConverter";
import {SpeechEntity} from "../../src/domain/SpeechEntity";

chai.should();

describe("PollyConverter", function() {
    this.timeout(20000);
    const converter = new PollyConverter({region: "eu-west-1"});

    it("should convert text to speech with given vocalist and return a Buffer", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: null,
            translatedSpeech: {
                text: "Hello World!",
                language: null,
                voice: {
                    voiceFileName: null,
                    voiceStream: null,
                    vocalist: "Ivy"
                }
            }
        };

        const voiceStream = await converter.convert(entity);
        voiceStream.length.should.greaterThan(0);
    });

    it("should throw ValidationException for invalid vocalist", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: null,
            translatedSpeech: {
                text: "Hello World!",
                language: null,
                voice: {
                    voiceFileName: null,
                    voiceStream: null,
                    vocalist: "Invalid"
                }
            }
        };

        try {
            const voiceStream = await converter.convert(entity);
            voiceStream.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("ValidationException");
        }
    });
});