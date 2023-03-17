import { EventEmitter as _EventEmitter } from './EventEmitter';
import { Canvas as _Canvas } from './Canvas';
import { Image as _Image } from './Image';
export default class Tracking {
    static EventEmitter: typeof _EventEmitter;
    static Canvas: typeof _Canvas;
    static Image: typeof _Image;
    constructor();
    initUserMedia_(element: HTMLVideoElement, opt_options: any): void;
    isNode(o: any): boolean;
    isWindow(o: any): boolean;
    one(selector: HTMLElement, opt_element: any): HTMLElement;
    EventEmitter: typeof _EventEmitter;
    Canvas: typeof _Canvas;
    Image: typeof _Image;
}
