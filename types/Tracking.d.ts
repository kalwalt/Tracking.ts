import { EventEmitter as _EventEmitter } from './EventEmitter';
import { Canvas as _Canvas } from './Canvas';
import { Image as _Image } from './Image';
import { Tracker } from './Tracker';
import { TrackerTask } from './TrackerTask';
import { ColorTracker as _ColorTracker } from './ColorTracker';
export default class Tracking {
    static EventEmitter: typeof _EventEmitter;
    static Canvas: typeof _Canvas;
    static Image: typeof _Image;
    static ColorTracker: typeof _ColorTracker;
    static grayscale: typeof _Image.grayscale;
    constructor();
    initUserMedia_(element: HTMLVideoElement, opt_options?: any): void;
    isNode(o: any): boolean;
    isWindow(o: any): boolean;
    one(selector: HTMLElement, opt_element?: any): HTMLElement;
    track(element: any, tracker: Tracker, opt_options?: any): TrackerTask;
    private trackCanvas_;
    private trackCanvasInternal_;
    private trackImg_;
    private trackVideo_;
    EventEmitter: typeof _EventEmitter;
    Canvas: typeof _Canvas;
    Image: typeof _Image;
    ColorTracker: typeof _ColorTracker;
}
