# Serverless Speech To Speech [WIP]

*Read this in other languages: [English](README.md), [Türkçe](README.tr.md).*

## Installation

1. Create an AWS account and create a user that has AccessKey and Secret
2. Node.js v8.11.1
3. Open a terminal window and type
4. `npm install serverless -g`
5. `npm install`
6. `serverless deploy`
7. Update API Gateway endpoint inside `static/scripts.js`
8. Upload `static/` folder to newly created S3 bucket via `aws s3 sync --acl public-read static/ s3://S3BUCKETNAME`

![InstallationGif](https://i.imgur.com/iBRROtd.gif)

## Service Diagram
All services that we have used in this project are AWS's `as a service` solutions. All the infrastructure are handled by AWS but of course architecture and usage's of these services needs to be the responsibility of the developer. You can find the service diagram of application below:

![Service Diagram](https://raw.githubusercontent.com/aykutaras/serverless-speech2speech/master/ServerlessSpeechToSpeech.png)