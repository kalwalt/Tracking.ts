import { EventEmitter } from "./EventEmitter";
import { Tracker } from "./Tracker";

export class TrackerTask extends EventEmitter {
    constructor(tracker: Tracker) {
        super();
        if (!tracker) {
            throw new Error('Tracker instance not specified.');
        }

        this.setTracker(tracker);
    };

    /**
     * Holds the tracker instance managed by this task.
     * @type {Tracker}
     * @private
     */
    private tracker_: Tracker = null;

    /**
     * Holds if the tracker task is in running.
     * @type {boolean}
     * @private
     */
    private running_ = false;

    /**
     * Gets the tracker instance managed by this task.
     * @return {Tracker}
     */
    getTracker() {
        return this.tracker_;
    };

    /**
     * Returns true if the tracker task is in running, false otherwise.
     * @return {boolean}
     * @private
     */
    private inRunning() {
        return this.running_;
    };

    /**
     * Sets if the tracker task is in running.
     * @param {boolean} running
     * @private
     */
    private setRunning(running: boolean) {
        this.running_ = running;
    };

    /**
     * Sets the tracker instance managed by this task.
     * @return {Tracker}
     */
    setTracker(tracker: Tracker) {
        this.tracker_ = tracker;
    };

    /**
     * Emits a `run` event on the tracker task for the implementers to run any
     * child action, e.g. `requestAnimationFrame`.
     * @return {object} Returns itself, so calls can be chained.
     */
    run() {
        var self = this;

        if (this.inRunning()) {
            return;
        }

        this.setRunning(true);
        const reemitTrackEvent_ = function (event: any) {
            self.emit('track', event);
        };
        this.tracker_.on('track', reemitTrackEvent_);
        this.emit('run');
        return this;
    };

    /**
     * Emits a `stop` event on the tracker task for the implementers to stop any
     * child action being done, e.g. `requestAnimationFrame`.
     * @return {object} Returns itself, so calls can be chained.
     */
    stop() {
        if (!this.inRunning()) {
            return;
        }
        var self = this;

        this.setRunning(false);
        this.emit('stop');
        const reemitTrackEvent_ = function (event: any) {
            self.emit('track', event);
        };
        this.tracker_.removeListener('track', reemitTrackEvent_);
        return this;
    };
}