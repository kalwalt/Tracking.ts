import { EventEmitter } from "./EventEmitter";
import { Tracker } from "./Tracker";
export declare class TrackerTask extends EventEmitter {
    constructor(tracker: Tracker);
    private tracker_;
    private running_;
    getTracker(): Tracker;
    private inRunning;
    private setRunning;
    setTracker(tracker: Tracker): void;
    private reemitTrackEvent_;
    run(): this;
    stop(): this;
}
