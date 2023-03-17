import { EventEmitter } from "./EventEmitter";

export abstract class Tracker extends EventEmitter {
    constructor() {
        super();
    };
    abstract track(element: any, width: number, height: number): any;
}