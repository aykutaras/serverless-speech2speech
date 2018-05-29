import "mocha"
import * as chai from "chai";
import {AwsTranslate} from "../../src/infrastructure/AwsTranslate";
import {TranslationEntity} from "../../src/domain/TranslationEntity";

chai.should();

describe("AwsTranslate", function() {
    this.timeout(20000);
    const translator = new AwsTranslate({region: "eu-west-1"});

    it("should translate english text to french text", async () => {
        const entity: TranslationEntity = {
            id: null,
            sourceText: "Hello World!",
            sourceLanguageCode: "en",
            targetLanguageCode: "fr",
            translatedText: null
        };

        const translationEntity = await translator.translate(entity);
        translationEntity.sourceText.should.equal(entity.sourceText);
        translationEntity.translatedText.should.equal("Bonjour le monde !");
        console.log(translationEntity.translatedText);
    });

    it("should translate french text to english text", async () => {
        const entity: TranslationEntity = {
            id: null,
            sourceText: "Bonjour le monde !",
            sourceLanguageCode: "fr",
            targetLanguageCode: "en",
            translatedText: null
        };

        const translationEntity = await translator.translate(entity);
        translationEntity.sourceText.should.equal(entity.sourceText);
        translationEntity.translatedText.should.equal("Hello, world!");
        console.log(translationEntity.translatedText);
    });

    it("should discover language french for french text and translate to english text", async () => {
        const entity: TranslationEntity = {
            id: null,
            sourceText: "Bonjour le monde !",
            sourceLanguageCode: "auto",
            targetLanguageCode: "en",
            translatedText: null
        };

        const translationEntity = await translator.translate(entity);
        translationEntity.sourceText.should.equal(entity.sourceText);
        translationEntity.translatedText.should.equal("Hello, world!");
        console.log(translationEntity.translatedText);
    });

    it("should throw UnsupportedLanguagePairException when source is not en", async () => {
        const entity: TranslationEntity = {
            id: null,
            sourceText: "Hello World!",
            sourceLanguageCode: "fr",
            targetLanguageCode: "es",
            translatedText: null
        };

        try {
            const translationEntity = await translator.translate(entity);
            translationEntity.sourceText.should.equal(entity.sourceText);
            translationEntity.translatedText.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("UnsupportedLanguagePairException");
        }
    });

    it("should throw ValidationException when source is null", async () => {
        const entity: TranslationEntity = {
            id: null,
            sourceText: "Hello World!",
            sourceLanguageCode: "",
            targetLanguageCode: "es",
            translatedText: null
        };

        try {
            const translationEntity = await translator.translate(entity);
            translationEntity.sourceText.should.equal(entity.sourceText);
            translationEntity.translatedText.length.should.greaterThan(0);
        } catch (e) {
            e.code.should.equal("ValidationException");
        }
    });
});
