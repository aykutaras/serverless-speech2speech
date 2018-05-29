import * as uuid from "uuid/v4";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";
import {SpeechRepository} from "domain/SpeechRepository";
import {SpeechEntity} from "domain/SpeechEntity";

export const main = async (event, context, callback) => {
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });

    const entity: SpeechEntity = {
        "id": uuid(),
        "vocalist": event.voice,
        "speechText": event.text,
        "speechUrl": null
    };

    let storeResponse = await repository.create(entity);
    const response = {
        "statusCode": 200,
        "body": {"speechId": storeResponse.id},
        "isBase64Encoded": false
    };

    callback(null, response);
};