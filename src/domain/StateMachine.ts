export interface StateMachine {
    start(speechId: string): Promise<boolean>
    stop(speechId: string): Promise<boolean>
}