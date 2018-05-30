import * as AWS from "aws-sdk"

import {SpeechRepository} from "domain/SpeechRepository";
import {SpeechEntity} from "domain/SpeechEntity";

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
        const params = {
            TableName: this.tableName,
            Item: {
                "id": entity.id,
                "sourceSpeech": {
                    "language": entity.sourceSpeech.language,
                    "text": entity.sourceSpeech.text,
                    "voice": {
                        "vocalist": entity.sourceSpeech.voice.vocalist,
                        "voiceFileName": entity.sourceSpeech.voice.voiceFileName
                    }
                },
                "translatedSpeech": {
                    "language": entity.translatedSpeech.language,
                    "text": entity.translatedSpeech.text,
                    "voice": {
                        "vocalist": entity.translatedSpeech.voice.vocalist,
                        "voiceFileName": entity.translatedSpeech.voice.voiceFileName
                    }
                }
            }
        };

        await this.client.put(params).promise();
        return entity;
    }

    async update(entity: SpeechEntity): Promise<SpeechEntity> {
        const params = {
            TableName: this.tableName,
            Key: {
                "id": entity.id
            },
            UpdateExpression: "set sourceSpeech.text = :ss, translatedSpeech.voice.voiceFileName = :vfn, translatedSpeech.text = :t",
            ExpressionAttributeValues: {
                ":ss": entity.sourceSpeech.text,
                ":vfn": entity.translatedSpeech.voice.voiceFileName,
                ":t": entity.translatedSpeech.text
            },
            ReturnValues: "UPDATED_NEW"
        };

        const updateResponse = await this.client.update(params).promise();
        entity.sourceSpeech.text = updateResponse.Attributes.sourceSpeech.text;
        return entity;
    }
}