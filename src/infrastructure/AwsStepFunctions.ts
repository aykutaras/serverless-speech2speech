import * as AWS from "aws-sdk"

import {StateMachine} from "domain/StateMachine";

export class AwsStepFunctions implements StateMachine {
    private readonly stepFunctions: AWS.StepFunctions;
    private readonly stateMachineArn: string;

    constructor(options) {
        this.stepFunctions = new AWS.StepFunctions(options);
        this.stateMachineArn = options.stateMachine;
    }

    async start(speechId: string): Promise<string> {
        const stepFunctionsRequest = {
            stateMachineArn: this.stateMachineArn,
            input: JSON.stringify({speechId: speechId}),
            name: speechId
        };

        const response = await this.stepFunctions.startExecution(stepFunctionsRequest).promise();
        return response.executionArn;
    }

    async stop(executionArn: string): Promise<void> {
        const request = {
            executionArn: executionArn,
            error: '400',
            cause: 'Operation cancelled'
        };
        await this.stepFunctions.stopExecution(request).promise();
    }
}