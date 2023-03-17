export declare class EventEmitter {
    constructor();
    events_: any;
    addListener(event: string, listener: Function): this;
    listeners(event: string): any;
    emit(event: string, ...opt_args: any): boolean;
    on: (event: string, listener: Function) => this;
    once(event: string, listener: Function): void;
    removeAllListeners(opt_event: string | number): this;
    removeListener(event: string, listener: Function): this;
    setMaxListeners(): void;
}
