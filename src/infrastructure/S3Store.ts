import * as AWS from "aws-sdk"
import {VoiceStore} from "domain/VoiceStore";
import {SpeechEntity, SpeechValueObject, VoiceValueObject} from "domain/SpeechEntity";

export class S3Store implements VoiceStore {
    private readonly options;
    private readonly s3Client: AWS.S3;

    constructor(options) {
        this.options = options;
        this.s3Client = new AWS.S3(this.options);
    }

    async download<T>(voiceFileName: string): Promise<T> {
        const params = {
            Bucket: this.options.voiceBucket,
            Key: voiceFileName,
        };

        const getResponse = await this.s3Client.getObject(params).promise();
        return <T>getResponse.Body
    }

    async upload(entity: VoiceValueObject): Promise<void> {
        const params = {
            Bucket: this.options.voiceBucket,
            Key: entity.voiceFileName,
            Body: entity.voiceStream,
            ACL: 'public-read'
        };

        await this.s3Client.upload(params).promise();
    }

    getVoiceUrl(voiceFileName: string): string {
        return "https://s3-" + this.options.region + ".amazonaws.com/" + this.options.voiceBucket + "/" + voiceFileName;
    }

    resolveFileName(voiceFileName: string): SpeechEntity {
        const splittedFileName = voiceFileName.split('.');

        if (splittedFileName.length < 4) {
            throw new Error("Invalid formatted file");
        }

        const isSource = splittedFileName[0] !== 'source';

        const speech: SpeechValueObject = {
            language: splittedFileName[1],
            text: null,
            voice: {
                voiceFileName: voiceFileName,
                vocalist: null,
                voiceStream: null
            }
        };

        return {
            id: splittedFileName[2],
            sourceSpeech: isSource ? speech : null,
            translatedSpeech: isSource ? null : speech
        };
    }
}
