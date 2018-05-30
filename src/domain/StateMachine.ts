export interface StateMachine {
    start(speechId: string): Promise<string>
    stop(speechId: string): Promise<void>
}