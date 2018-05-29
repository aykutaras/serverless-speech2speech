import {SpeechRepository} from "domain/SpeechRepository";
import {DynamoDBRepository} from "infrastructure/DynamoDBRepository";

export const main = async (event, context, callback) => {
    const repository: SpeechRepository = new DynamoDBRepository({
        region: process.env.region,
        tableName: process.env.tableName
    });
    const speechEntity = await repository.get(event.speechId);

    const response = {
        "statusCode": 200,
        "body": speechEntity === undefined ? [] : [speechEntity],
        "isBase64Encoded": false
    };

    callback(null, response);
};