import "mocha"
import * as uuid from "uuid/v4";
import * as chai from "chai";
import {DynamoDBRepository} from "../../src/infrastructure/DynamoDBRepository";
import {SpeechEntity} from "../../src/domain/SpeechEntity";

chai.should();

describe("DynamoDBRepository", function() {
    this.timeout(20000);

    const repository = new DynamoDBRepository({
        region: 'localhost',
        endpoint: 'http://localhost:9000',
        tableName: "test-speech-table"
    });

    it("should create a new speech entity to database", async () => {
        const entity: SpeechEntity = {
            id: uuid(),
            sourceSpeech: {
                text: "Hello World!",
                language: "en-US",
                voice: {
                    voiceFileName: null,
                    voiceStream: null,
                    vocalist: "Ivy"
                }
            },
            translatedSpeech: null
        };

        const createResponse = await repository.create(entity);
        createResponse.id.should.not.null;
        createResponse.sourceSpeech.text.should.equal(entity.sourceSpeech.text);
    });

    it("should get speech entity by its id", async () => {
        const entity: SpeechEntity = {
            id: uuid(),
            sourceSpeech: {
                text: "Hello World!",
                language: "en-US",
                voice: {
                    voiceFileName: null,
                    voiceStream: null,
                    vocalist: "Ivy"
                }
            },
            translatedSpeech: null
        };

        const createResponse = await repository.create(entity);
        const getResponse = await repository.get(createResponse.id);
        getResponse.id.should.equal(createResponse.id);
        getResponse.sourceSpeech.text.should.equal(createResponse.sourceSpeech.text);
    });

    it("should get all speech entities from table", async () => {
        const getListResponse = await repository.getList();
        getListResponse.length.should.greaterThan(0);
    });

    it("should update speech entity by its id", async () => {
        const entity: SpeechEntity = {
            id: uuid(),
            sourceSpeech: {
                text: "Hello World!",
                language: "en-US",
                voice: {
                    voiceFileName: null,
                    voiceStream: null,
                    vocalist: "Ivy"
                }
            },
            translatedSpeech: null
        };

        const createResponse = await repository.create(entity);
        const getResponse = await repository.get(createResponse.id);

        getResponse.translatedSpeech.text = "Helloo!";
        const updateResponse = await repository.update(getResponse);
        updateResponse.id.should.equal(entity.id);
        updateResponse.translatedSpeech.text.should.equal("Helloo!");
    });
});
