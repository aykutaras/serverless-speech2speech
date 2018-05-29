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
            id: "123456",
            vocalist: "Ivy",
            speechText: "Hello World!",
            speechUrl: null
        };

        const voiceEntity = await converter.convert(entity);
        voiceEntity.speechId.should.equal(entity.id);
        voiceEntity.voiceStream.length.should.greaterThan(0);
    });

    it("should throw ValidationException for invalid vocalist", async () => {
        const entity: SpeechEntity = {
            id: "123456",
            vocalist: "Invalid",
            speechText: "Hello World!",
            speechUrl: null
        };

        try {
            const voiceEntity = await converter.convert(entity);
            voiceEntity.speechId.should.equal(entity.id);
            voiceEntity.voiceStream.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("ValidationException");
        }
    });
});