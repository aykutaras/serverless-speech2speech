import * as AWS from "aws-sdk"
import {SpeechStore} from "domain/SpeechStore";
import {VoiceEntity} from "domain/SpeechEntity";

export class S3Store implements SpeechStore {
    private readonly options;
    private readonly s3Client: AWS.S3;

    constructor(options) {
        this.options = options;
        this.s3Client = new AWS.S3(this.options);
    }

    async download(speechId: string): Promise<VoiceEntity> {
        const params = {
            Bucket: this.options.voiceBucket,
            Key: speechId + ".mp3",
        };

        const getResponse = await this.s3Client.getObject(params).promise();

        return {
            speechId: speechId,
            voiceStream: <Buffer>getResponse.Body
        };
    }

    async upload(entity: VoiceEntity): Promise<string> {
        const params = {
            Bucket: this.options.voiceBucket,
            Key: entity.speechFileName,
            Body: entity.voiceStream,
            ACL: 'public-read'
        };

        const s3Response = await this.s3Client.upload(params).promise();
        return "https://s3-" + this.options.region + ".amazonaws.com/" + this.options.voiceBucket + "/" + s3Response.Key;
    }

}
