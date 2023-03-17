import { EventEmitter } from "./EventEmitter";
export declare abstract class Tracker extends EventEmitter {
    constructor();
    abstract track(element: any, width: number, height: number): any;
}
