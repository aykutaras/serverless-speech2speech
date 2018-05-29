import * as AWS from "aws-sdk"

import {StateMachine} from "domain/StateMachine";

export class AwsStepFunctions implements StateMachine {
    private readonly stepFunctions: AWS.StepFunctions;

    constructor(options) {
        this.stepFunctions = new AWS.StepFunctions(options)
    }

    async start(speechId: string): Promise<boolean> {
        return undefined;
    }

    async stop(speechId: string): Promise<boolean> {
        return undefined;
    }
}