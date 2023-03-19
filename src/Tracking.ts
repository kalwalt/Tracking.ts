import { EventEmitter as _EventEmitter } from './EventEmitter'
import { Canvas as _Canvas } from './Canvas'
import { Image as _Image } from './Image'
import { Tracker } from './Tracker'
import { TrackerTask } from './TrackerTask'
import { ColorTracker as _ColorTracker } from './ColorTracker'
import { Brief as _Brief } from './features/Brief'
import { Fast as _Fast } from './features/Fast'

export default class Tracking {

    static EventEmitter: typeof _EventEmitter;
    static Canvas: typeof _Canvas;
    static Image: typeof _Image;
    static ColorTracker: typeof _ColorTracker;
    static Brief: typeof _Brief;
    static Fast: typeof _Fast;

    static grayscale: typeof _Image.grayscale

    static blur: typeof _Image.blur

    constructor() { }

    /**
    * Captures the user camera when tracking a video element and set its source
    * to the camera stream.
    * @param {HTMLVideoElement} element Canvas element to track.
    * @param {object} opt_options Optional configuration to the tracker.
    */
    initUserMedia_(element: HTMLVideoElement, opt_options?: any) {
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
    one(selector: HTMLElement, opt_element?: any): HTMLElement {
        if (this.isNode(selector)) {
            return selector;
        }
        return (opt_element || document).querySelector(selector);
    };

    /**
     * Tracks a canvas, image or video element based on the specified `tracker`
     * instance. This method extract the pixel information of the input element
     * to pass to the `tracker` instance. When tracking a video, the
     * `tracker.track(pixels, width, height)` will be in a
     * `requestAnimationFrame` loop in order to track all video frames.
     *
     * Example:
     * var tracker = new tracking.ColorTracker();
     *
     * tracking.track('#video', tracker);
     * or
     * tracking.track('#video', tracker, { camera: true });
     *
     * tracker.on('track', function(event) {
     *   // console.log(event.data[0].x, event.data[0].y)
     * });
     *
     * @param {HTMLElement} element The element to track, canvas, image or
     *     video.
     * @param {Tracker} tracker The tracker instance used to track the
     *     element.
     * @param {object} opt_options Optional configuration to the tracker.
     */
    track(element: any, tracker: Tracker, opt_options?: any) {
        element = this.one(element);
        if (!element) {
            throw new Error('Element not found, try a different element or selector.');
        }
        if (!tracker) {
            throw new Error('Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.');
        }

        switch (element.nodeName.toLowerCase()) {
            case 'canvas':
                return this.trackCanvas_(element, tracker, opt_options);
            case 'img':
                return this.trackImg_(element, tracker, opt_options);
            case 'video':
                if (opt_options) {
                    if (opt_options.camera) {
                        this.initUserMedia_(element, opt_options);
                    }
                }
                return this.trackVideo_(element, tracker, opt_options);
            default:
                throw new Error('Element not supported, try in a canvas, img, or video.');
        }
    };

    /**
     * Tracks a canvas element based on the specified `tracker` instance and
     * returns a `TrackerTask` for this track.
     * @param {HTMLCanvasElement} element Canvas element to track.
     * @param {tracking.Tracker} tracker The tracker instance used to track the
     *     element.
     * @param {object} opt_options Optional configuration to the tracker.
     * @return {tracking.TrackerTask}
     * @private
     */
    private trackCanvas_(element: any, tracker: Tracker, opt_options?: any) {
        var self = this;
        var task = new TrackerTask(tracker);
        task.on('run', function () {
            self.trackCanvasInternal_(element, tracker);
        });
        return task.run();
    };

    /**
     * Tracks a canvas element based on the specified `tracker` instance. This
     * method extract the pixel information of the input element to pass to the
     * `tracker` instance.
     * @param {HTMLCanvasElement} element Canvas element to track.
     * @param {tracking.Tracker} tracker The tracker instance used to track the
     *     element.
     * @param {object} opt_options Optional configuration to the tracker.
     * @private
     */
    private trackCanvasInternal_(element: HTMLCanvasElement, tracker: Tracker, opt_options?: any) {
        var width = element.width;
        var height = element.height;
        var context = element.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        tracker.track(imageData.data, width, height);
    };

    /**
     * Tracks a image element based on the specified `tracker` instance. This
     * method extract the pixel information of the input element to pass to the
     * `tracker` instance.
     * @param {HTMLImageElement} element Canvas element to track.
     * @param {Tracker} tracker The tracker instance used to track the
     *     element.
     * @param {object} opt_options Optional configuration to the tracker.
     * @private
     */
    private trackImg_(element: any, tracker: Tracker, opt_options?: any) {
        var width = element.width;
        var height = element.height;
        var canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        var task = new TrackerTask(tracker);
        task.on('run', () => {
            Tracking.Canvas.loadImage(canvas, element.src, 0, 0, width, height, () => {
                this.trackCanvasInternal_(canvas, tracker);
            });
        });
        return task.run();
    };

    /**
     * Tracks a video element based on the specified `tracker` instance. This
     * method extract the pixel information of the input element to pass to the
     * `tracker` instance. The `tracker.track(pixels, width, height)` will be in
     * a `requestAnimationFrame` loop in order to track all video frames.
     * @param {HTMLVideoElement} element Canvas element to track.
     * @param {Tracker} tracker The tracker instance used to track the
     *     element.
     * @param {object} opt_options Optional configuration to the tracker.
     * @private
     */
   private trackVideo_ (element: HTMLVideoElement, tracker: Tracker, opt_options?: any) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width: number;
    var height: number;

    var resizeCanvas_ = function() {
      width = element.offsetWidth;
      height = element.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas_();
    element.addEventListener('resize', resizeCanvas_);

    var requestId: number;
    var requestAnimationFrame_ = () => {
      requestId = window.requestAnimationFrame(() => {
        if (element.readyState === element.HAVE_ENOUGH_DATA) {
          try {
            // Firefox v~30.0 gets confused with the video readyState firing an
            // erroneous HAVE_ENOUGH_DATA just before HAVE_CURRENT_DATA state,
            // hence keep trying to read it until resolved.
            context.drawImage(element, 0, 0, width, height);
          } catch (err) {}
          this.trackCanvasInternal_(canvas, tracker);
        }
        requestAnimationFrame_();
      });
    };

    var task = new TrackerTask(tracker);
    task.on('stop', function() {
      window.cancelAnimationFrame(requestId);
    });
    task.on('run', function() {
      requestAnimationFrame_();
    });
    return task.run();
  };


    public EventEmitter = _EventEmitter;

    public Canvas = _Canvas;

    public Image = _Image;

    public ColorTracker = _ColorTracker;

    public Brief = _Brief;

    public Fast = _Fast;
}

Tracking.EventEmitter = _EventEmitter;

Tracking.Canvas = _Canvas;

Tracking.Image = _Image;

Tracking.ColorTracker = _ColorTracker;

Tracking.Brief = _Brief;

Tracking.Fast = _Fast;