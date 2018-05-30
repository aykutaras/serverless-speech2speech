import "mocha"
import * as chai from "chai";
import {AwsTranslate} from "../../src/infrastructure/AwsTranslate";
import {SpeechEntity} from "../../src/domain/SpeechEntity";

chai.should();

describe("AwsTranslate", function() {
    this.timeout(20000);
    const translator = new AwsTranslate({region: "eu-west-1"});

    it("should translate english text to french text", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: {
                text: "Hello World!",
                language: "en-US",
                voice: null
            },
            translatedSpeech: {
                text: null,
                language: "fr-FR",
                voice: null
            }
        };

        const translationText = await translator.translate(entity);
        translationText.should.equal("Bonjour le monde !");
        console.log(translationText);
    });

    it("should translate french text to english text", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: {
                text: "Bonjour le monde !",
                language: "fr-FR",
                voice: null
            },
            translatedSpeech: {
                text: null,
                language: "en-US",
                voice: null
            }
        };

        const translationText = await translator.translate(entity);
        translationText.should.equal("Hello, world!");
        console.log(translationText);
    });

    it("should discover language french for french text and translate to english text", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: {
                text: "Bonjour le monde !",
                language: "auto",
                voice: null
            },
            translatedSpeech: {
                text: null,
                language: "en-US",
                voice: null
            }
        };

        const translationText = await translator.translate(entity);
        translationText.should.equal("Hello, world!");
        console.log(translationText);
    });

    it("should throw UnsupportedLanguagePairException when source is not en", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: {
                text: "Hello World!",
                language: "es-US",
                voice: null
            },
            translatedSpeech: {
                text: null,
                language: "fr-FR",
                voice: null
            }
        };

        try {
            const translationText = await translator.translate(entity);
            translationText.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("UnsupportedLanguagePairException");
        }
    });

    it("should throw ValidationException when source is null", async () => {
        const entity: SpeechEntity = {
            id: null,
            sourceSpeech: {
                text: "Hello World!",
                language: "",
                voice: null
            },
            translatedSpeech: {
                text: null,
                language: "fr-FR",
                voice: null
            }
        };

        try {
            const translationText = await translator.translate(entity);
            translationText.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("ValidationException");
        }
    });
});
