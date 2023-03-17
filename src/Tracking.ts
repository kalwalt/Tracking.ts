import { EventEmitter as _EventEmitter } from './EventEmitter'
import { Canvas as _Canvas}  from './Canvas'
import { Image as _Image } from './Image'

export default  class Tracking {

    static EventEmitter: typeof _EventEmitter;
    static Canvas: typeof _Canvas;
    static Image: typeof _Image;

    constructor() { }

    /**
    * Captures the user camera when tracking a video element and set its source
    * to the camera stream.
    * @param {HTMLVideoElement} element Canvas element to track.
    * @param {object} opt_options Optional configuration to the tracker.
    */
    initUserMedia_(element: HTMLVideoElement, opt_options: any) {
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: (opt_options && opt_options.audio) ? true : false,
        }).then(function (stream) {
            element.srcObject = stream;
        }).catch(function (err) {
            throw Error('Cannot capture user camera.');
        });
    };

    /**
    * Tests whether the object is a dom node.
    * @param {object} o Object to be tested.
    * @return {boolean} True if the object is a dom node.
    */
    isNode(o: any): boolean {
        return o.nodeType || this.isWindow(o);
    }

    /**
    * Tests whether the object is the `window` object.
    * @param {object} o Object to be tested.
    * @return {boolean} True if the object is the `window` object.
    */
    isWindow(o: any): boolean {
        return !!(o && o.alert && o.document);
    }

    /**
   * Selects a dom node from a CSS3 selector using `document.querySelector`.
   * @param {string} selector
   * @param {object} opt_element The root element for the query. When not
   *     specified `document` is used as root element.
   * @return {HTMLElement} The first dom element that matches to the selector.
   *     If not found, returns `null`.
   */
    one(selector: HTMLElement, opt_element: any): HTMLElement {
        if (this.isNode(selector)) {
            return selector;
        }
        return (opt_element || document).querySelector(selector);
    };

    public EventEmitter = _EventEmitter;

    public Canvas = _Canvas;

    public Image = _Image;
}

Tracking.EventEmitter = _EventEmitter;

Tracking.Canvas = _Canvas;

Tracking.Image = _Image;