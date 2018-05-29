import * as AWS from "aws-sdk"
import * as uuid from "uuid/v4"

import {SpeechRepository} from "domain/SpeechRepository";
import {SpeechEntity} from "domain/SpeechEntity";
import {AttributeMap} from "aws-sdk/clients/dynamodb";

export class DynamoDBRepository implements SpeechRepository {
    private readonly client: AWS.DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor(options) {
        this.client = new AWS.DynamoDB.DocumentClient(options);
        this.tableName = options.tableName;
    }

    async get(id: string): Promise<SpeechEntity> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            }
        };

        const getResponse = await this.client.get(params).promise();
        return <SpeechEntity>getResponse.Item;
    }

    async getList(): Promise<SpeechEntity[]> {
        const params = {
            TableName: this.tableName
        };

        let scanResponse = await this.client.scan(params).promise();
        return <SpeechEntity[]>scanResponse.Items;
    }

    async create(entity: SpeechEntity): Promise<SpeechEntity> {
        entity.id = uuid();

        const params = {
            TableName: this.tableName,
            Item: {
                "id": entity.id,
                "vocalist": entity.vocalist,
                "speechText": entity.speechText,
                "speechUrl": null
            }
        };

        console.log(params);

        await this.client.put(params).promise();
        return entity;
    }

    async update(entity: SpeechEntity): Promise<SpeechEntity> {
        const params = {
            TableName: this.tableName,
            Key: {
                "id": entity.id
            },
            UpdateExpression: "set #u = :u",
            ExpressionAttributeNames: {
                "#u": "speechUrl"
            },
            ExpressionAttributeValues: {
                ":u": entity.speechUrl
            },
            ReturnValues: "UPDATED_NEW"
        };

        const updateResponse = await this.client.update(params).promise();
        entity.speechUrl = updateResponse.Attributes.speechUrl;
        return entity;
    }

    private static mapEntity(attributeMap: AttributeMap): SpeechEntity {
        return {
            id: <string>attributeMap.id,
            vocalist: <string>attributeMap.vocalist,
            speechText: <string>attributeMap.speechText,
            speechUrl: <string>attributeMap.speechUrl
        };
    }
}