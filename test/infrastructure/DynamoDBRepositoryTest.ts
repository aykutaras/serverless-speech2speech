import "mocha"
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
            id: null,
            speechText: "Hello World!",
            vocalist: "Ivy",
            speechUrl: null
        };

        const createResponse = await repository.create(entity);
        createResponse.id.should.not.null;
        createResponse.speechText.should.equal(entity.speechText);
    });

    it("should get speech entity by its id", async () => {
        const entity: SpeechEntity = {
            id: null,
            speechText: "Hello World!",
            vocalist: "Ivy",
            speechUrl: null
        };

        const createResponse = await repository.create(entity);
        const getResponse = await repository.get(createResponse.id);
        getResponse.id.should.equal(createResponse.id);
        getResponse.speechText.should.equal(createResponse.speechText);
    });

    it("should get all speech entities from table", async () => {
        const getListResponse = await repository.getList();
        getListResponse.length.should.greaterThan(0);
    });

    it("should update speech entity by its id", async () => {
        const entity: SpeechEntity = {
            id: null,
            speechText: "Hello World!",
            vocalist: "Ivy",
            speechUrl: null
        };

        const createResponse = await repository.create(entity);

        createResponse.speechUrl = "https://example.com/";
        const updateResponse = await repository.update(createResponse);
        updateResponse.id.should.equal(entity.id);
        updateResponse.speechText.should.equal(entity.speechText);
    });
});
