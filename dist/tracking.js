(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Tracking"] = factory();
	else
		root["Tracking"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Canvas": () => (/* binding */ Canvas)
/* harmony export */ });
class Canvas {
    constructor() { }
    static loadImage(canvas, src, x, y, width, height, opt_callback) {
        var instance = this;
        var img = new window.Image();
        img.crossOrigin = '*';
        img.onload = function () {
            var context = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, x, y, width, height);
            if (opt_callback) {
                opt_callback.call(instance);
            }
            img = null;
        };
        img.src = src;
    }
    ;
}


/***/ }),

/***/ "./src/ColorTracker.ts":
/*!*****************************!*\
  !*** ./src/ColorTracker.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorTracker": () => (/* binding */ ColorTracker)
/* harmony export */ });
/* harmony import */ var _Tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tracker */ "./src/Tracker.ts");
/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Math */ "./src/Math.ts");


class ColorTracker extends _Tracker__WEBPACK_IMPORTED_MODULE_0__.Tracker {
    constructor(opt_colors) {
        super();
        this.initColors();
        if (typeof opt_colors === 'string') {
            opt_colors = [opt_colors];
        }
        if (opt_colors) {
            opt_colors.forEach(function (color) {
                if (!ColorTracker.getColor(color)) {
                    throw new Error('Color not valid, try `new tracking.ColorTracker("magenta")`.');
                }
            });
            this.setColors(opt_colors);
        }
    }
    static knownColors_ = new Map();
    static neighbours_;
    static registerColor(name, fn) {
        ColorTracker.knownColors_.set(name, fn);
    }
    ;
    static getColor(name) {
        return ColorTracker.knownColors_.get(name);
    }
    ;
    colors = ['magenta'];
    minDimension = 20;
    maxDimension = Infinity;
    minGroupSize = 30;
    calculateDimensions_(cloud, total) {
        var maxx = -1;
        var maxy = -1;
        var minx = Infinity;
        var miny = Infinity;
        for (var c = 0; c < total; c += 2) {
            var x = cloud[c];
            var y = cloud[c + 1];
            if (x < minx) {
                minx = x;
            }
            if (x > maxx) {
                maxx = x;
            }
            if (y < miny) {
                miny = y;
            }
            if (y > maxy) {
                maxy = y;
            }
        }
        return {
            width: maxx - minx,
            height: maxy - miny,
            x: minx,
            y: miny
        };
    }
    ;
    getColors() {
        return this.colors;
    }
    ;
    getMinDimension() {
        return this.minDimension;
    }
    ;
    getMaxDimension() {
        return this.maxDimension;
    }
    ;
    getMinGroupSize() {
        return this.minGroupSize;
    }
    ;
    getNeighboursForWidth_(width) {
        if (ColorTracker.neighbours_[width]) {
            return ColorTracker.neighbours_[width];
        }
        var neighbours = new Int32Array(8);
        neighbours[0] = -width * 4;
        neighbours[1] = -width * 4 + 4;
        neighbours[2] = 4;
        neighbours[3] = width * 4 + 4;
        neighbours[4] = width * 4;
        neighbours[5] = width * 4 - 4;
        neighbours[6] = -4;
        neighbours[7] = -width * 4 - 4;
        ColorTracker.neighbours_[width] = neighbours;
        return neighbours;
    }
    ;
    mergeRectangles_(rects) {
        var intersects;
        var results = [];
        var minDimension = this.getMinDimension();
        var maxDimension = this.getMaxDimension();
        for (var r = 0; r < rects.length; r++) {
            var r1 = rects[r];
            intersects = true;
            for (var s = r + 1; s < rects.length; s++) {
                var r2 = rects[s];
                if (_Math__WEBPACK_IMPORTED_MODULE_1__.Math.intersectRect(r1.x, r1.y, r1.x + r1.width, r1.y + r1.height, r2.x, r2.y, r2.x + r2.width, r2.y + r2.height)) {
                    intersects = false;
                    var x1 = Math.min(r1.x, r2.x);
                    var y1 = Math.min(r1.y, r2.y);
                    var x2 = Math.max(r1.x + r1.width, r2.x + r2.width);
                    var y2 = Math.max(r1.y + r1.height, r2.y + r2.height);
                    r2.height = y2 - y1;
                    r2.width = x2 - x1;
                    r2.x = x1;
                    r2.y = y1;
                    break;
                }
            }
            if (intersects) {
                if (r1.width >= minDimension && r1.height >= minDimension) {
                    if (r1.width <= maxDimension && r1.height <= maxDimension) {
                        results.push(r1);
                    }
                }
            }
        }
        return results;
    }
    ;
    setColors(colors) {
        this.colors = colors;
    }
    ;
    setMinDimension(minDimension) {
        this.minDimension = minDimension;
    }
    ;
    setMaxDimension(maxDimension) {
        this.maxDimension = maxDimension;
    }
    ;
    setMinGroupSize(minGroupSize) {
        this.minGroupSize = minGroupSize;
    }
    ;
    track(pixels, width, height) {
        var self = this;
        var colors = this.getColors();
        if (!colors) {
            throw new Error('Colors not specified, try `new tracking.ColorTracker("magenta")`.');
        }
        var results = [];
        colors.forEach(function (color) {
            results = results.concat(self.trackColor_(pixels, width, height, color));
        });
        this.emit('track', {
            data: results
        });
    }
    ;
    trackColor_(pixels, width, height, color) {
        var colorFn = ColorTracker.knownColors_.get(color);
        var currGroup = new Int32Array(pixels.length >> 2);
        var currGroupSize;
        var currI;
        var currJ;
        var currW;
        var marked = new Int8Array(pixels.length);
        var minGroupSize = this.getMinGroupSize();
        var neighboursW = this.getNeighboursForWidth_(width);
        var neighboursI = new Int32Array([-1, -1, 0, 1, 1, 1, 0, -1]);
        var neighboursJ = new Int32Array([0, 1, 1, 1, 0, -1, -1, -1]);
        var queue = new Int32Array(pixels.length);
        var queuePosition;
        var results = [];
        var w = -4;
        if (!colorFn) {
            return results;
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                w += 4;
                if (marked[w]) {
                    continue;
                }
                currGroupSize = 0;
                queuePosition = -1;
                queue[++queuePosition] = w;
                queue[++queuePosition] = i;
                queue[++queuePosition] = j;
                marked[w] = 1;
                while (queuePosition >= 0) {
                    currJ = queue[queuePosition--];
                    currI = queue[queuePosition--];
                    currW = queue[queuePosition--];
                    if (colorFn((pixels[currW], pixels[currW + 1], pixels[currW + 2], pixels[currW + 3], currW), currI, currJ)) {
                        currGroup[currGroupSize++] = currJ;
                        currGroup[currGroupSize++] = currI;
                        for (var k = 0; k < neighboursW.length; k++) {
                            var otherW = currW + neighboursW[k];
                            var otherI = currI + neighboursI[k];
                            var otherJ = currJ + neighboursJ[k];
                            if (!marked[otherW] && otherI >= 0 && otherI < height && otherJ >= 0 && otherJ < width) {
                                queue[++queuePosition] = otherW;
                                queue[++queuePosition] = otherI;
                                queue[++queuePosition] = otherJ;
                                marked[otherW] = 1;
                            }
                        }
                    }
                }
                if (currGroupSize >= minGroupSize) {
                    var data = this.calculateDimensions_(currGroup, currGroupSize);
                    if (data) {
                        data.color = color;
                        results.push(data);
                    }
                }
            }
        }
        return this.mergeRectangles_(results);
    }
    ;
    initColors() {
        ColorTracker.registerColor('cyan', (r, g, b) => {
            var thresholdGreen = 50, thresholdBlue = 70, dx = r - 0, dy = g - 255, dz = b - 255;
            if ((g - r) >= thresholdGreen && (b - r) >= thresholdBlue) {
                return true;
            }
            return dx * dx + dy * dy + dz * dz < 6400;
        });
        ColorTracker.registerColor('magenta', function (r, g, b) {
            var threshold = 50, dx = r - 255, dy = g - 0, dz = b - 255;
            if ((r - g) >= threshold && (b - g) >= threshold) {
                return true;
            }
            return dx * dx + dy * dy + dz * dz < 19600;
        });
        ColorTracker.registerColor('yellow', function (r, g, b) {
            var threshold = 50, dx = r - 255, dy = g - 255, dz = b - 0;
            if ((r - b) >= threshold && (g - b) >= threshold) {
                return true;
            }
            return dx * dx + dy * dy + dz * dz < 10000;
        });
    }
}



/***/ }),

/***/ "./src/EventEmitter.ts":
/*!*****************************!*\
  !*** ./src/EventEmitter.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    constructor() { }
    events_ = null;
    addListener(event, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this.events_) {
            this.events_ = {};
        }
        this.emit('newListener', event, listener);
        if (!this.events_[event]) {
            this.events_[event] = [];
        }
        this.events_[event].push(listener);
        return this;
    }
    ;
    listeners(event) {
        return this.events_ && this.events_[event];
    }
    ;
    emit(event, ...opt_args) {
        var listeners = this.listeners(event);
        if (listeners) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i]) {
                    listeners[i].apply(this, args);
                }
            }
            return true;
        }
        return false;
    }
    ;
    on = this.addListener;
    once(event, listener) {
        var self = this;
        self.on(event, function handlerInternal() {
            self.removeListener(event, handlerInternal);
            listener.apply(this, arguments);
        });
    }
    ;
    removeAllListeners(opt_event) {
        if (!this.events_) {
            return this;
        }
        if (opt_event) {
            delete this.events_[opt_event];
        }
        else {
            delete this.events_;
        }
        return this;
    }
    ;
    removeListener(event, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this.events_) {
            return this;
        }
        var listeners = this.listeners(event);
        if (Array.isArray(listeners)) {
            var i = listeners.indexOf(listener);
            if (i < 0) {
                return this;
            }
            listeners.splice(i, 1);
        }
        return this;
    }
    ;
    setMaxListeners() {
        throw new Error('Not implemented');
    }
    ;
}


/***/ }),

/***/ "./src/Image.ts":
/*!**********************!*\
  !*** ./src/Image.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Image": () => (/* binding */ Image)
/* harmony export */ });
class Image {
    constructor() { }
    blur(pixels, width, height, diameter) {
        diameter = Math.abs(diameter);
        if (diameter <= 1) {
            throw new Error('Diameter should be greater than 1.');
        }
        var radius = diameter / 2;
        var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
        var weights = new Float32Array(len);
        var rho = (radius + 0.5) / 3;
        var rhoSq = rho * rho;
        var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
        var rhoFactor = -1 / (2 * rho * rho);
        var wsum = 0;
        var middle = Math.floor(len / 2);
        for (var i = 0; i < len; i++) {
            var x = i - middle;
            var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
            weights[i] = gx;
            wsum += gx;
        }
        for (var j = 0; j < weights.length; j++) {
            weights[j] /= wsum;
        }
        return this.separableConvolve(pixels, width, height, weights, weights, false);
    }
    ;
    computeIntegralImage(pixels, width, height, opt_integralImage, opt_integralImageSquare, opt_tiltedIntegralImage, opt_integralImageSobel) {
        if (arguments.length < 4) {
            throw new Error('You should specify at least one output array in the order: sum, square, tilted, sobel.');
        }
        var pixelsSobel;
        if (opt_integralImageSobel) {
            pixelsSobel = this.sobel(pixels, width, height);
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var w = i * width * 4 + j * 4;
                var pixel = ~~(pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114);
                if (opt_integralImage) {
                    this.computePixelValueSAT_(opt_integralImage, width, i, j, pixel);
                }
                if (opt_integralImageSquare) {
                    this.computePixelValueSAT_(opt_integralImageSquare, width, i, j, pixel * pixel);
                }
                if (opt_tiltedIntegralImage) {
                    var w1 = w - width * 4;
                    var pixelAbove = ~~(pixels[w1] * 0.299 + pixels[w1 + 1] * 0.587 + pixels[w1 + 2] * 0.114);
                    this.computePixelValueRSAT_(opt_tiltedIntegralImage, width, i, j, pixel, pixelAbove || 0);
                }
                if (opt_integralImageSobel) {
                    this.computePixelValueSAT_(opt_integralImageSobel, width, i, j, pixelsSobel[w]);
                }
            }
        }
    }
    ;
    computePixelValueRSAT_(RSAT, width, i, j, pixel, pixelAbove) {
        var w = i * width + j;
        RSAT[w] = (RSAT[w - width - 1] || 0) + (RSAT[w - width + 1] || 0) - (RSAT[w - width - width] || 0) + pixel + pixelAbove;
    }
    ;
    computePixelValueSAT_(SAT, width, i, j, pixel) {
        var w = i * width + j;
        SAT[w] = (SAT[w - width] || 0) + (SAT[w - 1] || 0) + pixel - (SAT[w - width - 1] || 0);
    }
    ;
    static grayscale(pixels, width, height, fillRGBA) {
        var gray = new Uint8ClampedArray(fillRGBA ? pixels.length : pixels.length >> 2);
        var p = 0;
        var w = 0;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
                gray[p++] = value;
                if (fillRGBA) {
                    gray[p++] = value;
                    gray[p++] = value;
                    gray[p++] = pixels[w + 3];
                }
                w += 4;
            }
        }
        return gray;
    }
    ;
    horizontalConvolve(pixels, width, height, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);
        var output = new Float32Array(width * height * 4);
        var alphaFac = opaque ? 1 : 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var sy = y;
                var sx = x;
                var offset = (y * width + x) * 4;
                var r = 0;
                var g = 0;
                var b = 0;
                var a = 0;
                for (var cx = 0; cx < side; cx++) {
                    var scy = sy;
                    var scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
                    var poffset = (scy * width + scx) * 4;
                    var wt = weightsVector[cx];
                    r += pixels[poffset] * wt;
                    g += pixels[poffset + 1] * wt;
                    b += pixels[poffset + 2] * wt;
                    a += pixels[poffset + 3] * wt;
                }
                output[offset] = r;
                output[offset + 1] = g;
                output[offset + 2] = b;
                output[offset + 3] = a + alphaFac * (255 - a);
            }
        }
        return output;
    }
    ;
    verticalConvolve(pixels, width, height, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);
        var output = new Float32Array(width * height * 4);
        var alphaFac = opaque ? 1 : 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var sy = y;
                var sx = x;
                var offset = (y * width + x) * 4;
                var r = 0;
                var g = 0;
                var b = 0;
                var a = 0;
                for (var cy = 0; cy < side; cy++) {
                    var scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
                    var scx = sx;
                    var poffset = (scy * width + scx) * 4;
                    var wt = weightsVector[cy];
                    r += pixels[poffset] * wt;
                    g += pixels[poffset + 1] * wt;
                    b += pixels[poffset + 2] * wt;
                    a += pixels[poffset + 3] * wt;
                }
                output[offset] = r;
                output[offset + 1] = g;
                output[offset + 2] = b;
                output[offset + 3] = a + alphaFac * (255 - a);
            }
        }
        return output;
    }
    ;
    separableConvolve(pixels, width, height, horizWeights, vertWeights, opaque) {
        var vertical = this.verticalConvolve(pixels, width, height, vertWeights, opaque);
        return this.horizontalConvolve(vertical, width, height, horizWeights, opaque);
    }
    ;
    sobel(pixels, width, height) {
        var _pixels = Image.grayscale(pixels, width, height, true);
        var output = new Float32Array(width * height * 4);
        var sobelSignVector = new Float32Array([-1, 0, 1]);
        var sobelScaleVector = new Float32Array([1, 2, 1]);
        var vertical = this.separableConvolve(_pixels, width, height, sobelSignVector, sobelScaleVector);
        var horizontal = this.separableConvolve(_pixels, width, height, sobelScaleVector, sobelSignVector);
        for (var i = 0; i < output.length; i += 4) {
            var v = vertical[i];
            var h = horizontal[i];
            var p = Math.sqrt(h * h + v * v);
            output[i] = p;
            output[i + 1] = p;
            output[i + 2] = p;
            output[i + 3] = 255;
        }
        return output;
    }
    ;
    equalizeHist(pixels, width, height) {
        var equalized = new Uint8ClampedArray(pixels.length);
        var histogram = new Array(256);
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;
        for (var i = 0; i < pixels.length; i++) {
            equalized[i] = pixels[i];
            histogram[pixels[i]]++;
        }
        var prev = histogram[0];
        for (var i = 0; i < 256; i++) {
            histogram[i] += prev;
            prev = histogram[i];
        }
        var norm = 255 / pixels.length;
        for (var i = 0; i < pixels.length; i++)
            equalized[i] = (histogram[pixels[i]] * norm + 0.5) | 0;
        return equalized;
    }
}


/***/ }),

/***/ "./src/Math.ts":
/*!*********************!*\
  !*** ./src/Math.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Math": () => (/* binding */ Math)
/* harmony export */ });
class Math {
    constructor() { }
    ;
    static intersectRect(x0, y0, x1, y1, x2, y2, x3, y3) {
        return !(x2 > x1 || x3 < x0 || y2 > y1 || y3 < y0);
    }
    ;
}


/***/ }),

/***/ "./src/Tracker.ts":
/*!************************!*\
  !*** ./src/Tracker.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tracker": () => (/* binding */ Tracker)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");

class Tracker extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {
        super();
    }
    ;
}


/***/ }),

/***/ "./src/TrackerTask.ts":
/*!****************************!*\
  !*** ./src/TrackerTask.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrackerTask": () => (/* binding */ TrackerTask)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");

class TrackerTask extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor(tracker) {
        super();
        if (!tracker) {
            throw new Error('Tracker instance not specified.');
        }
        this.setTracker(tracker);
    }
    ;
    tracker_ = null;
    running_ = false;
    getTracker() {
        return this.tracker_;
    }
    ;
    inRunning() {
        return this.running_;
    }
    ;
    setRunning(running) {
        this.running_ = running;
    }
    ;
    setTracker(tracker) {
        this.tracker_ = tracker;
    }
    ;
    reemitTrackEvent_(event) {
        this.emit('track', event);
    }
    ;
    run() {
        if (this.inRunning()) {
            return;
        }
        this.setRunning(true);
        this.tracker_.on('track', this.reemitTrackEvent_);
        this.emit('run');
        return this;
    }
    ;
    stop() {
        if (!this.inRunning()) {
            return;
        }
        this.setRunning(false);
        this.emit('stop');
        this.tracker_.removeListener('track', this.reemitTrackEvent_);
        return this;
    }
    ;
}


/***/ }),

/***/ "./src/Tracking.ts":
/*!*************************!*\
  !*** ./src/Tracking.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tracking)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/EventEmitter.ts");
/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Canvas */ "./src/Canvas.ts");
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Image */ "./src/Image.ts");
/* harmony import */ var _TrackerTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TrackerTask */ "./src/TrackerTask.ts");
/* harmony import */ var _ColorTracker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ColorTracker */ "./src/ColorTracker.ts");





class Tracking {
    static EventEmitter;
    static Canvas;
    static Image;
    static ColorTracker;
    static grayscale;
    constructor() { }
    initUserMedia_(element, opt_options) {
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: (opt_options && opt_options.audio) ? true : false,
        }).then(function (stream) {
            element.srcObject = stream;
        }).catch(function (err) {
            throw Error('Cannot capture user camera.');
        });
    }
    ;
    isNode(o) {
        return o.nodeType || this.isWindow(o);
    }
    isWindow(o) {
        return !!(o && o.alert && o.document);
    }
    one(selector, opt_element) {
        if (this.isNode(selector)) {
            return selector;
        }
        return (opt_element || document).querySelector(selector);
    }
    ;
    track(element, tracker, opt_options) {
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
    }
    ;
    trackCanvas_(element, tracker, opt_options) {
        var self = this;
        var task = new _TrackerTask__WEBPACK_IMPORTED_MODULE_3__.TrackerTask(tracker);
        task.on('run', function () {
            self.trackCanvasInternal_(element, tracker);
        });
        return task.run();
    }
    ;
    trackCanvasInternal_(element, tracker, opt_options) {
        var width = element.width;
        var height = element.height;
        var context = element.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        tracker.track(imageData.data, width, height);
    }
    ;
    trackImg_(element, tracker, opt_options) {
        var width = element.width;
        var height = element.height;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var task = new _TrackerTask__WEBPACK_IMPORTED_MODULE_3__.TrackerTask(tracker);
        task.on('run', () => {
            Tracking.Canvas.loadImage(canvas, element.src, 0, 0, width, height, () => {
                this.trackCanvasInternal_(canvas, tracker);
            });
        });
        return task.run();
    }
    ;
    trackVideo_(element, tracker, opt_options) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width;
        var height;
        var resizeCanvas_ = function () {
            width = element.offsetWidth;
            height = element.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resizeCanvas_();
        element.addEventListener('resize', resizeCanvas_);
        var requestId;
        var requestAnimationFrame_ = () => {
            requestId = window.requestAnimationFrame(() => {
                if (element.readyState === element.HAVE_ENOUGH_DATA) {
                    try {
                        context.drawImage(element, 0, 0, width, height);
                    }
                    catch (err) { }
                    this.trackCanvasInternal_(canvas, tracker);
                }
                requestAnimationFrame_();
            });
        };
        var task = new _TrackerTask__WEBPACK_IMPORTED_MODULE_3__.TrackerTask(tracker);
        task.on('stop', function () {
            window.cancelAnimationFrame(requestId);
        });
        task.on('run', function () {
            requestAnimationFrame_();
        });
        return task.run();
    }
    ;
    EventEmitter = _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter;
    Canvas = _Canvas__WEBPACK_IMPORTED_MODULE_1__.Canvas;
    Image = _Image__WEBPACK_IMPORTED_MODULE_2__.Image;
    ColorTracker = _ColorTracker__WEBPACK_IMPORTED_MODULE_4__.ColorTracker;
}
Tracking.EventEmitter = _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter;
Tracking.Canvas = _Canvas__WEBPACK_IMPORTED_MODULE_1__.Canvas;
Tracking.Image = _Image__WEBPACK_IMPORTED_MODULE_2__.Image;
Tracking.ColorTracker = _ColorTracker__WEBPACK_IMPORTED_MODULE_4__.ColorTracker;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tracking__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tracking */ "./src/Tracking.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Tracking: _Tracking__WEBPACK_IMPORTED_MODULE_0__["default"]
});

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tpbmcuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7O0FDVk8sTUFBTSxNQUFNO0lBS2YsZ0JBQWdCLENBQUM7SUFjakIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUF5QixFQUFFLEdBQVcsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsWUFBc0I7UUFDaEksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7WUFDVCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLElBQUksWUFBWSxFQUFFO2dCQUNkLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDL0I7WUFDRCxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUFBLENBQUM7Q0FDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ21DO0FBQ0c7QUFFdkMsTUFBYSxZQUFhLFNBQVEsNkNBQU87SUFRckMsWUFBWSxVQUFrQztRQUMxQyxLQUFLLEVBQUU7UUFFUixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFakIsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7WUFDaEMsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDN0I7UUFFRCxJQUFJLFVBQVUsRUFBRTtZQUNaLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLO2dCQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO2lCQUNuRjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5QjtJQUVMLENBQUM7SUFRTyxNQUFNLENBQUMsWUFBWSxHQUEwQixJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQVF6RSxNQUFNLENBQUMsV0FBVyxDQUFNO0lBU2hDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBWSxFQUFFLEVBQWdEO1FBQy9FLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQUEsQ0FBQztJQVNGLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWTtRQUN4QixPQUFPLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFBQSxDQUFDO0lBT0YsTUFBTSxHQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBT3BDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFPbEIsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQU94QixZQUFZLEdBQUcsRUFBRSxDQUFDO0lBWVYsb0JBQW9CLENBQUMsS0FBVSxFQUFFLEtBQWE7UUFDbEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNwQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7UUFFcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXJCLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ1o7WUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNaO1lBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUNWLElBQUksR0FBRyxDQUFDLENBQUM7YUFDWjtZQUNELElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ1o7U0FDSjtRQUVELE9BQU87WUFDSCxLQUFLLEVBQUUsSUFBSSxHQUFHLElBQUk7WUFDbEIsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJO1lBQ25CLENBQUMsRUFBRSxJQUFJO1lBQ1AsQ0FBQyxFQUFFLElBQUk7U0FDVixDQUFDO0lBQ04sQ0FBQztJQUFBLENBQUM7SUFNRixTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFBQSxDQUFDO0lBTUYsZUFBZTtRQUNYLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBQUEsQ0FBQztJQU1GLGVBQWU7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUFBLENBQUM7SUFNRixlQUFlO1FBQ1gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFBQSxDQUFDO0lBU00sc0JBQXNCLENBQUMsS0FBYTtRQUN4QyxJQUFJLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMzQixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMxQixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25CLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBRTdDLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFBQSxDQUFDO0lBT00sZ0JBQWdCLENBQUMsS0FBVTtRQUMvQixJQUFJLFVBQVUsQ0FBQztRQUNmLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDMUMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRTFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLHFEQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ25ILFVBQVUsR0FBRyxLQUFLLENBQUM7b0JBQ25CLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsRUFBRSxDQUFD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QUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDbEMsaUVBQWU7SUFDWCxRQUFRO0NBQ1giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvQ2FudmFzLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL0NvbG9yVHJhY2tlci50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9FdmVudEVtaXR0ZXIudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvSW1hZ2UudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvTWF0aC50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9UcmFja2VyLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL1RyYWNrZXJUYXNrLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL1RyYWNraW5nLnRzIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVHJhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiVHJhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiZXhwb3J0IGNsYXNzIENhbnZhcyB7XHJcbiAgICAvKipcclxuICAgICAqIENhbnZhcyB1dGlsaXR5LlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogTG9hZHMgYW4gaW1hZ2Ugc291cmNlIGludG8gdGhlIGNhbnZhcy5cclxuICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgVGhlIGNhbnZhcyBkb20gZWxlbWVudC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3JjIFRoZSBpbWFnZSBzb3VyY2UuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIGNhbnZhcyBob3Jpem9udGFsIGNvb3JkaW5hdGUgdG8gbG9hZCB0aGUgaW1hZ2UuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIGNhbnZhcyB2ZXJ0aWNhbCBjb29yZGluYXRlIHRvIGxvYWQgdGhlIGltYWdlLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdF9jYWxsYmFjayBDYWxsYmFjayB0aGF0IGZpcmVzIHdoZW4gdGhlIGltYWdlIGlzIGxvYWRlZFxyXG4gICAqICAgICBpbnRvIHRoZSBjYW52YXMuXHJcbiAgICogQHN0YXRpY1xyXG4gICAqL1xyXG4gICAgc3RhdGljIGxvYWRJbWFnZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzcmM6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBvcHRfY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcztcclxuICAgICAgICB2YXIgaW1nID0gbmV3IHdpbmRvdy5JbWFnZSgpO1xyXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICcqJztcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKG9wdF9jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgb3B0X2NhbGxiYWNrLmNhbGwoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZyA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gc3JjO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IFRyYWNrZXIgfSBmcm9tICcuL1RyYWNrZXInO1xyXG5pbXBvcnQgeyBNYXRoIGFzIF9NYXRoIH0gZnJvbSAnLi9NYXRoJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclRyYWNrZXIgZXh0ZW5kcyBUcmFja2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogQ29sb3JUcmFja2VyIHV0aWxpdHkgdG8gdHJhY2sgY29sb3JlZCBibG9icyBpbiBhIGZyYW1lIHVzaW5nIGNvbG9yXHJcbiAgICAgKiBkaWZmZXJlbmNlIGV2YWx1YXRpb24uXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PHN0cmluZz59IG9wdF9jb2xvcnMgT3B0aW9uYWwgY29sb3JzIHRvIHRyYWNrLlxyXG4gICAgICogQGV4dGVuZHMge1RyYWNrZXJ9XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdF9jb2xvcnM6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICBzdXBlcigpXHJcblxyXG4gICAgICAgdGhpcy5pbml0Q29sb3JzKCk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0X2NvbG9ycyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgb3B0X2NvbG9ycyA9IFtvcHRfY29sb3JzXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRfY29sb3JzKSB7XHJcbiAgICAgICAgICAgIG9wdF9jb2xvcnMuZm9yRWFjaChmdW5jdGlvbiAoY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmICghQ29sb3JUcmFja2VyLmdldENvbG9yKGNvbG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3Igbm90IHZhbGlkLCB0cnkgYG5ldyB0cmFja2luZy5Db2xvclRyYWNrZXIoXCJtYWdlbnRhXCIpYC4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29sb3JzKG9wdF9jb2xvcnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyB0aGUga25vd24gY29sb3JzLlxyXG4gICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBrbm93bkNvbG9yc186IE1hcDxzdHJpbmcsIEZ1bmN0aW9uPiA9IG5ldyBNYXA8c3RyaW5nLCBGdW5jdGlvbj4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhY2hlcyBjb29yZGluYXRlcyB2YWx1ZXMgb2YgdGhlIG5laWdoYm91cnMgc3Vycm91bmRpbmcgYSBwaXhlbC5cclxuICAgICAqIEB0eXBlIHtPYmplY3QuPG51bWJlciwgSW50MzJBcnJheT59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBuZWlnaGJvdXJzXzogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXJzIGEgY29sb3IgYXMga25vd24gY29sb3IuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgY29sb3IgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBjb2xvciBmdW5jdGlvbiB0byB0ZXN0IGlmIHRoZSBwYXNzZWQgKHIsZyxiKSBpc1xyXG4gICAgICogICAgIHRoZSBkZXNpcmVkIGNvbG9yLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVnaXN0ZXJDb2xvcihuYW1lOiBzdHJpbmcsIGZuOiAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikgPT4gYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgQ29sb3JUcmFja2VyLmtub3duQ29sb3JzXy5zZXQobmFtZSwgZm4pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBHZXRzIHRoZSBrbm93biBjb2xvciBmdW5jdGlvbiB0aGF0IGlzIGFibGUgdG8gdGVzdCB3aGV0aGVyIGFuIChyLGcsYikgaXNcclxuICAgKiB0aGUgZGVzaXJlZCBjb2xvci5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgY29sb3IgbmFtZS5cclxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGtub3duIGNvbG9yIHRlc3QgZnVuY3Rpb24uXHJcbiAgICogQHN0YXRpY1xyXG4gICAqL1xyXG4gICAgc3RhdGljIGdldENvbG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBDb2xvclRyYWNrZXIua25vd25Db2xvcnNfLmdldChuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyB0aGUgY29sb3JzIHRvIGJlIHRyYWNrZWQgYnkgdGhlIGBDb2xvclRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQGRlZmF1bHQgWydtYWdlbnRhJ11cclxuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAqL1xyXG4gICAgY29sb3JzOiBBcnJheTxzdHJpbmc+ID0gWydtYWdlbnRhJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICogSG9sZHMgdGhlIG1pbmltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAqIEBkZWZhdWx0IDIwXHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKi9cclxuICAgIG1pbkRpbWVuc2lvbiA9IDIwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIG1heGltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQGRlZmF1bHQgSW5maW5pdHlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIG1heERpbWVuc2lvbiA9IEluZmluaXR5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIG1pbmltdW0gZ3JvdXAgc2l6ZSB0byBiZSBjbGFzc2lmaWVkIGFzIGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQGRlZmF1bHQgMzBcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIG1pbkdyb3VwU2l6ZSA9IDMwO1xyXG5cclxuICAgIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNlbnRyYWwgY29vcmRpbmF0ZSBmcm9tIHRoZSBjbG91ZCBwb2ludHMuIFRoZSBjbG91ZCBwb2ludHNcclxuICAgKiBhcmUgYWxsIHBvaW50cyB0aGF0IG1hdGNoZXMgdGhlIGRlc2lyZWQgY29sb3IuXHJcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY2xvdWQgTWFqb3Igcm93IG9yZGVyIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZVxyXG4gICAqICAgICBwb2ludHMgZnJvbSB0aGUgZGVzaXJlZCBjb2xvciwgZS5nLiBbeDEsIHkxLCBjMiwgeTIsIC4uLl0uXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIFRvdGFsIG51bWJlcnMgb2YgcGl4ZWxzIG9mIHRoZSBkZXNpcmVkIGNvbG9yLlxyXG4gICAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHgsIHkgYW5kIGVzdGltYXRlZCB6IGNvb3JkaW5hdGUgb2ZcclxuICAgKiAgICAgdGhlIGJsb2cgZXh0cmFjdGVkIGZyb20gdGhlIGNsb3VkIHBvaW50cy5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zXyhjbG91ZDogYW55LCB0b3RhbDogbnVtYmVyKTogb2JqZWN0IHtcclxuICAgICAgICB2YXIgbWF4eCA9IC0xO1xyXG4gICAgICAgIHZhciBtYXh5ID0gLTE7XHJcbiAgICAgICAgdmFyIG1pbnggPSBJbmZpbml0eTtcclxuICAgICAgICB2YXIgbWlueSA9IEluZmluaXR5O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRvdGFsOyBjICs9IDIpIHtcclxuICAgICAgICAgICAgdmFyIHggPSBjbG91ZFtjXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBjbG91ZFtjICsgMV07XHJcblxyXG4gICAgICAgICAgICBpZiAoeCA8IG1pbngpIHtcclxuICAgICAgICAgICAgICAgIG1pbnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4ID4gbWF4eCkge1xyXG4gICAgICAgICAgICAgICAgbWF4eCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkgPCBtaW55KSB7XHJcbiAgICAgICAgICAgICAgICBtaW55ID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA+IG1heHkpIHtcclxuICAgICAgICAgICAgICAgIG1heHkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogbWF4eCAtIG1pbngsXHJcbiAgICAgICAgICAgIGhlaWdodDogbWF4eSAtIG1pbnksXHJcbiAgICAgICAgICAgIHg6IG1pbngsXHJcbiAgICAgICAgICAgIHk6IG1pbnlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGNvbG9ycyBiZWluZyB0cmFja2VkIGJ5IHRoZSBgQ29sb3JUcmFja2VyYCBpbnN0YW5jZS5cclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxyXG4gICAgICovXHJcbiAgICBnZXRDb2xvcnMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIGRpbWVuc2lvbiB0byBjbGFzc2lmeSBhIHJlY3RhbmdsZS5cclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgICBnZXRNaW5EaW1lbnNpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5taW5EaW1lbnNpb247XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbWF4aW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldE1heERpbWVuc2lvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1heERpbWVuc2lvbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBtaW5pbXVtIGdyb3VwIHNpemUgdG8gYmUgY2xhc3NpZmllZCBhcyBhIHJlY3RhbmdsZS5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TWluR3JvdXBTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWluR3JvdXBTaXplO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAqIEdldHMgdGhlIGVpZ2h0IG9mZnNldCB2YWx1ZXMgb2YgdGhlIG5laWdoYm91cnMgc3Vycm91bmRpbmcgYSBwaXhlbC5cclxuICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgKiBAcmV0dXJuIHthcnJheX0gQXJyYXkgd2l0aCB0aGUgZWlnaHQgb2Zmc2V0IHZhbHVlcyBvZiB0aGUgbmVpZ2hib3Vyc1xyXG4gICogICAgIHN1cnJvdW5kaW5nIGEgcGl4ZWwuXHJcbiAgKiBAcHJpdmF0ZVxyXG4gICovXHJcbiAgICBwcml2YXRlIGdldE5laWdoYm91cnNGb3JXaWR0aF8od2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChDb2xvclRyYWNrZXIubmVpZ2hib3Vyc19bd2lkdGhdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvclRyYWNrZXIubmVpZ2hib3Vyc19bd2lkdGhdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5laWdoYm91cnMgPSBuZXcgSW50MzJBcnJheSg4KTtcclxuXHJcbiAgICAgICAgbmVpZ2hib3Vyc1swXSA9IC13aWR0aCAqIDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1sxXSA9IC13aWR0aCAqIDQgKyA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbMl0gPSA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbM10gPSB3aWR0aCAqIDQgKyA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbNF0gPSB3aWR0aCAqIDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1s1XSA9IHdpZHRoICogNCAtIDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1s2XSA9IC00O1xyXG4gICAgICAgIG5laWdoYm91cnNbN10gPSAtd2lkdGggKiA0IC0gNDtcclxuXHJcbiAgICAgICAgQ29sb3JUcmFja2VyLm5laWdoYm91cnNfW3dpZHRoXSA9IG5laWdoYm91cnM7XHJcblxyXG4gICAgICAgIHJldHVybiBuZWlnaGJvdXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuaXRlcyBncm91cHMgd2hvc2UgYm91bmRpbmcgYm94IGludGVyc2VjdCB3aXRoIGVhY2ggb3RoZXIuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSByZWN0c1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBtZXJnZVJlY3RhbmdsZXNfKHJlY3RzOiBhbnkpIHtcclxuICAgICAgICB2YXIgaW50ZXJzZWN0cztcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIHZhciBtaW5EaW1lbnNpb24gPSB0aGlzLmdldE1pbkRpbWVuc2lvbigpO1xyXG4gICAgICAgIHZhciBtYXhEaW1lbnNpb24gPSB0aGlzLmdldE1heERpbWVuc2lvbigpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHJlY3RzLmxlbmd0aDsgcisrKSB7XHJcbiAgICAgICAgICAgIHZhciByMSA9IHJlY3RzW3JdO1xyXG4gICAgICAgICAgICBpbnRlcnNlY3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcyA9IHIgKyAxOyBzIDwgcmVjdHMubGVuZ3RoOyBzKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByMiA9IHJlY3RzW3NdO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9NYXRoLmludGVyc2VjdFJlY3QocjEueCwgcjEueSwgcjEueCArIHIxLndpZHRoLCByMS55ICsgcjEuaGVpZ2h0LCByMi54LCByMi55LCByMi54ICsgcjIud2lkdGgsIHIyLnkgKyByMi5oZWlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB4MSA9IE1hdGgubWluKHIxLngsIHIyLngpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB5MSA9IE1hdGgubWluKHIxLnksIHIyLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB4MiA9IE1hdGgubWF4KHIxLnggKyByMS53aWR0aCwgcjIueCArIHIyLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeTIgPSBNYXRoLm1heChyMS55ICsgcjEuaGVpZ2h0LCByMi55ICsgcjIuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICByMi5oZWlnaHQgPSB5MiAtIHkxO1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLndpZHRoID0geDIgLSB4MTtcclxuICAgICAgICAgICAgICAgICAgICByMi54ID0geDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcjIueSA9IHkxO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHIxLndpZHRoID49IG1pbkRpbWVuc2lvbiAmJiByMS5oZWlnaHQgPj0gbWluRGltZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIxLndpZHRoIDw9IG1heERpbWVuc2lvbiAmJiByMS5oZWlnaHQgPD0gbWF4RGltZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChyMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb2xvcnMgdG8gYmUgdHJhY2tlZCBieSB0aGUgYENvbG9yVHJhY2tlcmAgaW5zdGFuY2UuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjb2xvcnNcclxuICAgICAqL1xyXG4gICAgc2V0Q29sb3JzKGNvbG9yczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sb3JzID0gY29sb3JzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIG1pbmltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbkRpbWVuc2lvblxyXG4gICAgICovXHJcbiAgICBzZXRNaW5EaW1lbnNpb24obWluRGltZW5zaW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1pbkRpbWVuc2lvbiA9IG1pbkRpbWVuc2lvbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtYXhpbXVtIGRpbWVuc2lvbiB0byBjbGFzc2lmeSBhIHJlY3RhbmdsZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhEaW1lbnNpb25cclxuICAgICAqL1xyXG4gICAgc2V0TWF4RGltZW5zaW9uKG1heERpbWVuc2lvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXhEaW1lbnNpb24gPSBtYXhEaW1lbnNpb247XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbWluaW11bSBncm91cCBzaXplIHRvIGJlIGNsYXNzaWZpZWQgYXMgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluR3JvdXBTaXplXHJcbiAgICAgKi9cclxuICAgIHNldE1pbkdyb3VwU2l6ZShtaW5Hcm91cFNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubWluR3JvdXBTaXplID0gbWluR3JvdXBTaXplO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBUcmFja3MgdGhlIGBWaWRlb2AgZnJhbWVzLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZm9yIGVhY2ggdmlkZW8gZnJhbWUgaW5cclxuICAgKiBvcmRlciB0byBlbWl0IGB0cmFja2AgZXZlbnQuXHJcbiAgICogQHBhcmFtIHtVaW50OENsYW1wZWRBcnJheX0gcGl4ZWxzIFRoZSBwaXhlbHMgZGF0YSB0byB0cmFjay5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIHBpeGVscyBjYW52YXMgd2lkdGguXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgcGl4ZWxzIGNhbnZhcyBoZWlnaHQuXHJcbiAgICovXHJcbiAgICB0cmFjayhwaXhlbHM6IFVpbnQ4Q2xhbXBlZEFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29sb3JzID0gdGhpcy5nZXRDb2xvcnMoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjb2xvcnMpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvcnMgbm90IHNwZWNpZmllZCwgdHJ5IGBuZXcgdHJhY2tpbmcuQ29sb3JUcmFja2VyKFwibWFnZW50YVwiKWAuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVzdWx0czogYW55ID0gW107XHJcblxyXG4gICAgICAgIGNvbG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChjb2xvcikge1xyXG4gICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQoc2VsZi50cmFja0NvbG9yXyhwaXhlbHMsIHdpZHRoLCBoZWlnaHQsIGNvbG9yKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2snLCB7XHJcbiAgICAgICAgICAgIGRhdGE6IHJlc3VsdHNcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogRmluZCB0aGUgZ2l2ZW4gY29sb3IgaW4gdGhlIGdpdmVuIG1hdHJpeCBvZiBwaXhlbHMgdXNpbmcgRmxvb2QgZmlsbFxyXG4gICAqIGFsZ29yaXRobSB0byBkZXRlcm1pbmVzIHRoZSBhcmVhIGNvbm5lY3RlZCB0byBhIGdpdmVuIG5vZGUgaW4gYVxyXG4gICAqIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5LlxyXG4gICAqIEBwYXJhbSB7VWludDhDbGFtcGVkQXJyYXl9IHBpeGVscyBUaGUgcGl4ZWxzIGRhdGEgdG8gdHJhY2suXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBwaXhlbHMgY2FudmFzIHdpZHRoLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIHBpeGVscyBjYW52YXMgaGVpZ2h0LlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciBUaGUgY29sb3IgdG8gYmUgZm91bmRcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0NvbG9yXyhwaXhlbHM6IFVpbnQ4Q2xhbXBlZEFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY29sb3I6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGNvbG9yRm4gPSBDb2xvclRyYWNrZXIua25vd25Db2xvcnNfLmdldChjb2xvcik7XHJcbiAgICAgICAgdmFyIGN1cnJHcm91cCA9IG5ldyBJbnQzMkFycmF5KHBpeGVscy5sZW5ndGggPj4gMik7XHJcbiAgICAgICAgdmFyIGN1cnJHcm91cFNpemU7XHJcbiAgICAgICAgdmFyIGN1cnJJO1xyXG4gICAgICAgIHZhciBjdXJySjtcclxuICAgICAgICB2YXIgY3Vyclc7XHJcbiAgICAgICAgdmFyIG1hcmtlZCA9IG5ldyBJbnQ4QXJyYXkocGl4ZWxzLmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIG1pbkdyb3VwU2l6ZSA9IHRoaXMuZ2V0TWluR3JvdXBTaXplKCk7XHJcbiAgICAgICAgdmFyIG5laWdoYm91cnNXID0gdGhpcy5nZXROZWlnaGJvdXJzRm9yV2lkdGhfKHdpZHRoKTtcclxuICAgICAgICAvLyBDYWNoaW5nIG5laWdoYm91ciBpL2ogb2Zmc2V0IHZhbHVlcy5cclxuICAgICAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICB2YXIgbmVpZ2hib3Vyc0kgPSBuZXcgSW50MzJBcnJheShbLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMV0pO1xyXG4gICAgICAgIHZhciBuZWlnaGJvdXJzSiA9IG5ldyBJbnQzMkFycmF5KFswLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xXSk7XHJcbiAgICAgICAgdmFyIHF1ZXVlID0gbmV3IEludDMyQXJyYXkocGl4ZWxzLmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIHF1ZXVlUG9zaXRpb247XHJcbiAgICAgICAgdmFyIHJlc3VsdHM6IGFueSA9IFtdO1xyXG4gICAgICAgIHZhciB3ID0gLTQ7XHJcblxyXG4gICAgICAgIGlmICghY29sb3JGbikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB3ICs9IDQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1hcmtlZFt3XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJHcm91cFNpemUgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIHF1ZXVlUG9zaXRpb24gPSAtMTtcclxuICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSB3O1xyXG4gICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IGk7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gajtcclxuXHJcbiAgICAgICAgICAgICAgICBtYXJrZWRbd10gPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChxdWV1ZVBvc2l0aW9uID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJySiA9IHF1ZXVlW3F1ZXVlUG9zaXRpb24tLV07XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyckkgPSBxdWV1ZVtxdWV1ZVBvc2l0aW9uLS1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJXID0gcXVldWVbcXVldWVQb3NpdGlvbi0tXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yRm4oKHBpeGVsc1tjdXJyV10sIHBpeGVsc1tjdXJyVyArIDFdLCBwaXhlbHNbY3VyclcgKyAyXSwgcGl4ZWxzW2N1cnJXICsgM10sIGN1cnJXKSwgY3VyckksIGN1cnJKKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyR3JvdXBbY3Vyckdyb3VwU2l6ZSsrXSA9IGN1cnJKO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyR3JvdXBbY3Vyckdyb3VwU2l6ZSsrXSA9IGN1cnJJO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBuZWlnaGJvdXJzVy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyVyA9IGN1cnJXICsgbmVpZ2hib3Vyc1dba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXJJID0gY3VyckkgKyBuZWlnaGJvdXJzSVtrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdGhlckogPSBjdXJySiArIG5laWdoYm91cnNKW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXJrZWRbb3RoZXJXXSAmJiBvdGhlckkgPj0gMCAmJiBvdGhlckkgPCBoZWlnaHQgJiYgb3RoZXJKID49IDAgJiYgb3RoZXJKIDwgd2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gb3RoZXJXO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSBvdGhlckk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IG90aGVySjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VkW290aGVyV10gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyR3JvdXBTaXplID49IG1pbkdyb3VwU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhOiBhbnkgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnNfKGN1cnJHcm91cCwgY3Vyckdyb3VwU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVJlY3RhbmdsZXNfKHJlc3VsdHMpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gRGVmYXVsdCBjb2xvcnNcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENvbG9ycygpOiB2b2lkIHtcclxuICAgICAgICBDb2xvclRyYWNrZXIucmVnaXN0ZXJDb2xvcignY3lhbicsIChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB0aHJlc2hvbGRHcmVlbiA9IDUwLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkQmx1ZSA9IDcwLFxyXG4gICAgICAgICAgICAgICAgZHggPSByIC0gMCxcclxuICAgICAgICAgICAgICAgIGR5ID0gZyAtIDI1NSxcclxuICAgICAgICAgICAgICAgIGR6ID0gYiAtIDI1NTtcclxuXHJcbiAgICAgICAgICAgIGlmICgoZyAtIHIpID49IHRocmVzaG9sZEdyZWVuICYmIChiIC0gcikgPj0gdGhyZXNob2xkQmx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeiA8IDY0MDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIENvbG9yVHJhY2tlci5yZWdpc3RlckNvbG9yKCdtYWdlbnRhJywgZnVuY3Rpb24gKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHRocmVzaG9sZCA9IDUwLFxyXG4gICAgICAgICAgICAgICAgZHggPSByIC0gMjU1LFxyXG4gICAgICAgICAgICAgICAgZHkgPSBnIC0gMCxcclxuICAgICAgICAgICAgICAgIGR6ID0gYiAtIDI1NTtcclxuXHJcbiAgICAgICAgICAgIGlmICgociAtIGcpID49IHRocmVzaG9sZCAmJiAoYiAtIGcpID49IHRocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeiA8IDE5NjAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBDb2xvclRyYWNrZXIucmVnaXN0ZXJDb2xvcigneWVsbG93JywgZnVuY3Rpb24gKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHRocmVzaG9sZCA9IDUwLFxyXG4gICAgICAgICAgICAgICAgZHggPSByIC0gMjU1LFxyXG4gICAgICAgICAgICAgICAgZHkgPSBnIC0gMjU1LFxyXG4gICAgICAgICAgICAgICAgZHogPSBiIC0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICgociAtIGIpID49IHRocmVzaG9sZCAmJiAoZyAtIGIpID49IHRocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeiA8IDEwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxufSIsImV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnRFbWl0dGVyIHV0aWxpdHkuXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgZXZlbnQgbGlzdGVuZXJzIHNjb3BlZCBieSBldmVudCB0eXBlLlxyXG4gICAgICogQHR5cGUge29iamVjdH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGV2ZW50c186IGFueSA9IG51bGw7XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0ZW5lcnMgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgZW1pdHRlciwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIGFkZExpc3RlbmVyKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzXyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIGV2ZW50LCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfW2V2ZW50XSkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c19bZXZlbnRdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50c19bZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gQXJyYXkgb2YgbGlzdGVuZXJzLlxyXG4gICAgICovXHJcbiAgICBsaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c18gJiYgdGhpcy5ldmVudHNfW2V2ZW50XTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIGluIG9yZGVyIHdpdGggdGhlIHN1cHBsaWVkIGFyZ3VtZW50cy5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHsqfSBvcHRfYXJncyBbYXJnMV0sIFthcmcyXSwgWy4uLl1cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBldmVudCBoYWQgbGlzdGVuZXJzLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4ub3B0X2FyZ3M6IGFueSkge1xyXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyhldmVudCk7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RlbmVycyBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgb24gPSB0aGlzLmFkZExpc3RlbmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIG9uZSB0aW1lIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQuIFRoaXMgbGlzdGVuZXIgaXMgaW52b2tlZCBvbmx5IHRoZVxyXG4gICAgICogbmV4dCB0aW1lIHRoZSBldmVudCBpcyBmaXJlZCwgYWZ0ZXIgd2hpY2ggaXQgaXMgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgb25jZShldmVudDogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vbihldmVudCwgZnVuY3Rpb24gaGFuZGxlckludGVybmFsKHRoaXM6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBoYW5kbGVySW50ZXJuYWwpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC4gSXQncyBub3QgYSBnb29kXHJcbiAgICAgKiBpZGVhIHRvIHJlbW92ZSBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkIGVsc2V3aGVyZSBpbiB0aGUgY29kZSxcclxuICAgICAqIGVzcGVjaWFsbHkgd2hlbiBpdCdzIG9uIGFuIGVtaXR0ZXIgdGhhdCB5b3UgZGlkbid0IGNyZWF0ZS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGVtaXR0ZXIsIHNvIGNhbGxzIGNhbiBiZSBjaGFpbmVkLlxyXG4gICAgICovXHJcbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMob3B0X2V2ZW50OiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzXykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdF9ldmVudCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNfW29wdF9ldmVudF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzXztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXHJcbiAgICAgKiBDYXV0aW9uOiBjaGFuZ2VzIGFycmF5IGluZGljZXMgaW4gdGhlIGxpc3RlbmVyIGFycmF5IGJlaGluZCB0aGUgbGlzdGVuZXIuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgZW1pdHRlciwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVyc1xyXG4gICAgICogYXJlIGFkZGVkIGZvciBhIHBhcnRpY3VsYXIgZXZlbnQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwc1xyXG4gICAgICogZmluZGluZyBtZW1vcnkgbGVha3MuIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbWF4aW11bSBudW1iZXIgb2YgbGlzdGVuZXJzLlxyXG4gICAgICovXHJcbiAgICBzZXRNYXhMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcclxuICAgIH07XHJcbn0iLCJleHBvcnQgY2xhc3MgSW1hZ2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbWFnZSB1dGlsaXR5LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyBnYXVzc2lhbiBibHVyLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaWFtZXRlciBHYXVzc2lhbiBibHVyIGRpYW1ldGVyLCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAxLlxyXG4gICAgICogQHJldHVybiB7YXJyYXl9IFRoZSBlZGdlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgKi9cclxuICAgIGJsdXIocGl4ZWxzOiBGbG9hdDMyQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkaWFtZXRlcjogbnVtYmVyKSB7XHJcbiAgICAgICAgZGlhbWV0ZXIgPSBNYXRoLmFicyhkaWFtZXRlcik7XHJcbiAgICAgICAgaWYgKGRpYW1ldGVyIDw9IDEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaWFtZXRlciBzaG91bGQgYmUgZ3JlYXRlciB0aGFuIDEuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYWRpdXMgPSBkaWFtZXRlciAvIDI7XHJcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguY2VpbChkaWFtZXRlcikgKyAoMSAtIChNYXRoLmNlaWwoZGlhbWV0ZXIpICUgMikpO1xyXG4gICAgICAgIHZhciB3ZWlnaHRzID0gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xyXG4gICAgICAgIHZhciByaG8gPSAocmFkaXVzICsgMC41KSAvIDM7XHJcbiAgICAgICAgdmFyIHJob1NxID0gcmhvICogcmhvO1xyXG4gICAgICAgIHZhciBnYXVzc2lhbkZhY3RvciA9IDEgLyBNYXRoLnNxcnQoMiAqIE1hdGguUEkgKiByaG9TcSk7XHJcbiAgICAgICAgdmFyIHJob0ZhY3RvciA9IC0xIC8gKDIgKiByaG8gKiByaG8pO1xyXG4gICAgICAgIHZhciB3c3VtID0gMDtcclxuICAgICAgICB2YXIgbWlkZGxlID0gTWF0aC5mbG9vcihsZW4gLyAyKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gaSAtIG1pZGRsZTtcclxuICAgICAgICAgICAgdmFyIGd4ID0gZ2F1c3NpYW5GYWN0b3IgKiBNYXRoLmV4cCh4ICogeCAqIHJob0ZhY3Rvcik7XHJcbiAgICAgICAgICAgIHdlaWdodHNbaV0gPSBneDtcclxuICAgICAgICAgICAgd3N1bSArPSBneDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3ZWlnaHRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHdlaWdodHNbal0gLz0gd3N1bTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VwYXJhYmxlQ29udm9sdmUocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCB3ZWlnaHRzLCB3ZWlnaHRzLCBmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIGludGVncmFsIGltYWdlIGZvciBzdW1tZWQsIHNxdWFyZWQsIHJvdGF0ZWQgYW5kIHNvYmVsIHBpeGVscy5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHBpeGVscyBUaGUgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkgdG8gbG9vcFxyXG4gICAgICogICAgIHRocm91Z2guXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gb3B0X2ludGVncmFsSW1hZ2UgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvXHJcbiAgICAgKiAgICAgYmUgZmlsbGVkIHdpdGggdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bVxyXG4gICAgICogICAgIHZhbHVlcyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRfaW50ZWdyYWxJbWFnZVNxdWFyZSBFbXB0eSBhcnJheSBvZiBzaXplIGB3aWR0aCAqXHJcbiAgICAgKiAgICAgaGVpZ2h0YCB0byBiZSBmaWxsZWQgd2l0aCB0aGUgaW50ZWdyYWwgaW1hZ2Ugc3F1YXJlZCB2YWx1ZXMuIElmIG5vdFxyXG4gICAgICogICAgIHNwZWNpZmllZCBjb21wdXRlIHNxdWFyZWQgdmFsdWVzIHdpbGwgYmUgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlIEVtcHR5IGFycmF5IG9mIHNpemUgYHdpZHRoICpcclxuICAgICAqICAgICBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoIHRoZSByb3RhdGVkIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90XHJcbiAgICAgKiAgICAgc3BlY2lmaWVkIGNvbXB1dGUgc3VtIHZhbHVlcyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRfaW50ZWdyYWxJbWFnZVNvYmVsIEVtcHR5IGFycmF5IG9mIHNpemUgYHdpZHRoICpcclxuICAgICAqICAgICBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoIHRoZSBpbnRlZ3JhbCBpbWFnZSBvZiBzb2JlbCB2YWx1ZXMuIElmIG5vdFxyXG4gICAgICogICAgIHNwZWNpZmllZCBjb21wdXRlIHNvYmVsIGZpbHRlcmluZyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKi9cclxuICAgIGNvbXB1dGVJbnRlZ3JhbEltYWdlKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBvcHRfaW50ZWdyYWxJbWFnZTogYW55LCBvcHRfaW50ZWdyYWxJbWFnZVNxdWFyZTogYW55LCBvcHRfdGlsdGVkSW50ZWdyYWxJbWFnZTogYW55LCBvcHRfaW50ZWdyYWxJbWFnZVNvYmVsOiBhbnkpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2hvdWxkIHNwZWNpZnkgYXQgbGVhc3Qgb25lIG91dHB1dCBhcnJheSBpbiB0aGUgb3JkZXI6IHN1bSwgc3F1YXJlLCB0aWx0ZWQsIHNvYmVsLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGl4ZWxzU29iZWw7XHJcbiAgICAgICAgaWYgKG9wdF9pbnRlZ3JhbEltYWdlU29iZWwpIHtcclxuICAgICAgICAgICAgcGl4ZWxzU29iZWwgPSB0aGlzLnNvYmVsKHBpeGVscywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IGkgKiB3aWR0aCAqIDQgKyBqICogNDtcclxuICAgICAgICAgICAgICAgIHZhciBwaXhlbCA9IH5+KHBpeGVsc1t3XSAqIDAuMjk5ICsgcGl4ZWxzW3cgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cgKyAyXSAqIDAuMTE0KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRfaW50ZWdyYWxJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBpeGVsVmFsdWVTQVRfKG9wdF9pbnRlZ3JhbEltYWdlLCB3aWR0aCwgaSwgaiwgcGl4ZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF9pbnRlZ3JhbEltYWdlU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVNBVF8ob3B0X2ludGVncmFsSW1hZ2VTcXVhcmUsIHdpZHRoLCBpLCBqLCBwaXhlbCAqIHBpeGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRfdGlsdGVkSW50ZWdyYWxJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3MSA9IHcgLSB3aWR0aCAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBpeGVsQWJvdmUgPSB+fihwaXhlbHNbdzFdICogMC4yOTkgKyBwaXhlbHNbdzEgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cxICsgMl0gKiAwLjExNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVJTQVRfKG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlLCB3aWR0aCwgaSwgaiwgcGl4ZWwsIHBpeGVsQWJvdmUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0X2ludGVncmFsSW1hZ2VTb2JlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBpeGVsVmFsdWVTQVRfKG9wdF9pbnRlZ3JhbEltYWdlU29iZWwsIHdpZHRoLCBpLCBqLCBwaXhlbHNTb2JlbFt3XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIG1ldGhvZCB0byBjb21wdXRlIHRoZSByb3RhdGVkIHN1bW1lZCBhcmVhIHRhYmxlIChSU0FUKSBieSB0aGVcclxuICAgICAqIGZvcm11bGE6XHJcbiAgICAgKlxyXG4gICAgICogUlNBVCh4LCB5KSA9IFJTQVQoeC0xLCB5LTEpICsgUlNBVCh4KzEsIHktMSkgLSBSU0FUKHgsIHktMikgKyBJKHgsIHkpICsgSSh4LCB5LTEpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IFJTQVQgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoXHJcbiAgICAgKiAgICAgdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bSB2YWx1ZXMgd2lsbCBiZVxyXG4gICAgICogICAgIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaSBWZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGogSG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpeGVsIFBpeGVsIHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBpbnRlZ3JhbCBpbWFnZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY29tcHV0ZVBpeGVsVmFsdWVSU0FUXyhSU0FUOiBudW1iZXJbXSwgd2lkdGg6IG51bWJlciwgaTogbnVtYmVyLCBqOiBudW1iZXIsIHBpeGVsOiBudW1iZXIsIHBpeGVsQWJvdmU6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB3ID0gaSAqIHdpZHRoICsgajtcclxuICAgICAgICBSU0FUW3ddID0gKFJTQVRbdyAtIHdpZHRoIC0gMV0gfHwgMCkgKyAoUlNBVFt3IC0gd2lkdGggKyAxXSB8fCAwKSAtIChSU0FUW3cgLSB3aWR0aCAtIHdpZHRoXSB8fCAwKSArIHBpeGVsICsgcGl4ZWxBYm92ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGNvbXB1dGUgdGhlIHN1bW1lZCBhcmVhIHRhYmxlIChTQVQpIGJ5IHRoZSBmb3JtdWxhOlxyXG4gICAgICpcclxuICAgICAqIFNBVCh4LCB5KSA9IFNBVCh4LCB5LTEpICsgU0FUKHgtMSwgeSkgKyBJKHgsIHkpIC0gU0FUKHgtMSwgeS0xKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBTQVQgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoXHJcbiAgICAgKiAgICAgdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bSB2YWx1ZXMgd2lsbCBiZVxyXG4gICAgICogICAgIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaSBWZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGogSG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpeGVsIFBpeGVsIHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBpbnRlZ3JhbCBpbWFnZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbXB1dGVQaXhlbFZhbHVlU0FUXyhTQVQ6IG51bWJlcltdLCB3aWR0aDogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgcGl4ZWw6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB3ID0gaSAqIHdpZHRoICsgajtcclxuICAgICAgICBTQVRbd10gPSAoU0FUW3cgLSB3aWR0aF0gfHwgMCkgKyAoU0FUW3cgLSAxXSB8fCAwKSArIHBpeGVsIC0gKFNBVFt3IC0gd2lkdGggLSAxXSB8fCAwKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIGNvbG9yIGZyb20gYSBjb2xvcnNwYWNlIGJhc2VkIG9uIGFuIFJHQiBjb2xvciBtb2RlbCB0byBhXHJcbiAgICAgKiBncmF5c2NhbGUgcmVwcmVzZW50YXRpb24gb2YgaXRzIGx1bWluYW5jZS4gVGhlIGNvZWZmaWNpZW50cyByZXByZXNlbnQgdGhlXHJcbiAgICAgKiBtZWFzdXJlZCBpbnRlbnNpdHkgcGVyY2VwdGlvbiBvZiB0eXBpY2FsIHRyaWNocm9tYXQgaHVtYW5zLCBpblxyXG4gICAgICogcGFydGljdWxhciwgaHVtYW4gdmlzaW9uIGlzIG1vc3Qgc2Vuc2l0aXZlIHRvIGdyZWVuIGFuZCBsZWFzdCBzZW5zaXRpdmVcclxuICAgICAqIHRvIGJsdWUuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZpbGxSR0JBIElmIHRoZSByZXN1bHQgc2hvdWxkIGZpbGwgYWxsIFJHQkEgdmFsdWVzIHdpdGggdGhlIGdyYXkgc2NhbGVcclxuICAgICAqICB2YWx1ZXMsIGluc3RlYWQgb2YgcmV0dXJuaW5nIGEgc2luZ2xlIHZhbHVlIHBlciBwaXhlbC5cclxuICAgICAqIEBwYXJhbSB7VWludDhDbGFtcGVkQXJyYXl9IFRoZSBncmF5c2NhbGUgcGl4ZWxzIGluIGEgbGluZWFyIGFycmF5IChbcCxwLHAsYSwuLi5dIGlmIGZpbGxSR0JBXHJcbiAgICAgKiAgaXMgdHJ1ZSBhbmQgW3AxLCBwMiwgcDMsIC4uLl0gaWYgZmlsbFJHQkEgaXMgZmFsc2UpLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ3JheXNjYWxlKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBmaWxsUkdCQTogYm9vbGVhbik6IFVpbnQ4Q2xhbXBlZEFycmF5IHtcclxuICAgICAgICB2YXIgZ3JheSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShmaWxsUkdCQSA/IHBpeGVscy5sZW5ndGggOiBwaXhlbHMubGVuZ3RoID4+IDIpO1xyXG4gICAgICAgIHZhciBwID0gMDtcclxuICAgICAgICB2YXIgdyA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBpeGVsc1t3XSAqIDAuMjk5ICsgcGl4ZWxzW3cgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cgKyAyXSAqIDAuMTE0O1xyXG4gICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGxSR0JBKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gcGl4ZWxzW3cgKyAzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB3ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYXk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFzdCBob3Jpem9udGFsIHNlcGFyYWJsZSBjb252b2x1dGlvbi4gQSBwb2ludCBzcHJlYWQgZnVuY3Rpb24gKFBTRikgaXNcclxuICAgICAqIHNhaWQgdG8gYmUgc2VwYXJhYmxlIGlmIGl0IGNhbiBiZSBicm9rZW4gaW50byB0d28gb25lLWRpbWVuc2lvbmFsXHJcbiAgICAgKiBzaWduYWxzOiBhIHZlcnRpY2FsIGFuZCBhIGhvcml6b250YWwgcHJvamVjdGlvbi4gVGhlIGNvbnZvbHV0aW9uIGlzXHJcbiAgICAgKiBwZXJmb3JtZWQgYnkgc2xpZGluZyB0aGUga2VybmVsIG92ZXIgdGhlIGltYWdlLCBnZW5lcmFsbHkgc3RhcnRpbmcgYXQgdGhlXHJcbiAgICAgKiB0b3AgbGVmdCBjb3JuZXIsIHNvIGFzIHRvIG1vdmUgdGhlIGtlcm5lbCB0aHJvdWdoIGFsbCB0aGUgcG9zaXRpb25zIHdoZXJlXHJcbiAgICAgKiB0aGUga2VybmVsIGZpdHMgZW50aXJlbHkgd2l0aGluIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBpbWFnZS4gQWRhcHRlZCBmcm9tXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB3ZWlnaHRzVmVjdG9yIFRoZSB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIGhvcml6b250YWxDb252b2x2ZShwaXhlbHM6IEZsb2F0MzJBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHdlaWdodHNWZWN0b3I6IEZsb2F0MzJBcnJheSwgb3BhcXVlOiBib29sZWFuKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICB2YXIgc2lkZSA9IHdlaWdodHNWZWN0b3IubGVuZ3RoO1xyXG4gICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbiAgICAgICAgdmFyIGFscGhhRmFjID0gb3BhcXVlID8gMSA6IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3kgPSB5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAoeSAqIHdpZHRoICsgeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY3ggPSAwOyBjeCA8IHNpZGU7IGN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2N5ID0gc3k7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjeCA9IE1hdGgubWluKHdpZHRoIC0gMSwgTWF0aC5tYXgoMCwgc3ggKyBjeCAtIGhhbGZTaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvZmZzZXQgPSAoc2N5ICogd2lkdGggKyBzY3gpICogNDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3QgPSB3ZWlnaHRzVmVjdG9yW2N4XTtcclxuICAgICAgICAgICAgICAgICAgICByICs9IHBpeGVsc1twb2Zmc2V0XSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGcgKz0gcGl4ZWxzW3BvZmZzZXQgKyAxXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGIgKz0gcGl4ZWxzW3BvZmZzZXQgKyAyXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGEgKz0gcGl4ZWxzW3BvZmZzZXQgKyAzXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldF0gPSByO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDFdID0gZztcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgM10gPSBhICsgYWxwaGFGYWMgKiAoMjU1IC0gYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGYXN0IHZlcnRpY2FsIHNlcGFyYWJsZSBjb252b2x1dGlvbi4gQSBwb2ludCBzcHJlYWQgZnVuY3Rpb24gKFBTRikgaXNcclxuICAgICAqIHNhaWQgdG8gYmUgc2VwYXJhYmxlIGlmIGl0IGNhbiBiZSBicm9rZW4gaW50byB0d28gb25lLWRpbWVuc2lvbmFsXHJcbiAgICAgKiBzaWduYWxzOiBhIHZlcnRpY2FsIGFuZCBhIGhvcml6b250YWwgcHJvamVjdGlvbi4gVGhlIGNvbnZvbHV0aW9uIGlzXHJcbiAgICAgKiBwZXJmb3JtZWQgYnkgc2xpZGluZyB0aGUga2VybmVsIG92ZXIgdGhlIGltYWdlLCBnZW5lcmFsbHkgc3RhcnRpbmcgYXQgdGhlXHJcbiAgICAgKiB0b3AgbGVmdCBjb3JuZXIsIHNvIGFzIHRvIG1vdmUgdGhlIGtlcm5lbCB0aHJvdWdoIGFsbCB0aGUgcG9zaXRpb25zIHdoZXJlXHJcbiAgICAgKiB0aGUga2VybmVsIGZpdHMgZW50aXJlbHkgd2l0aGluIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBpbWFnZS4gQWRhcHRlZCBmcm9tXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB3ZWlnaHRzVmVjdG9yIFRoZSB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHZlcnRpY2FsQ29udm9sdmUocGl4ZWxzOiBGbG9hdDMyQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCB3ZWlnaHRzVmVjdG9yOiBGbG9hdDMyQXJyYXksIG9wYXF1ZTogYm9vbGVhbik6IEZsb2F0MzJBcnJheSB7XHJcbiAgICAgICAgdmFyIHNpZGUgPSB3ZWlnaHRzVmVjdG9yLmxlbmd0aDtcclxuICAgICAgICB2YXIgaGFsZlNpZGUgPSBNYXRoLmZsb29yKHNpZGUgLyAyKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG4gICAgICAgIHZhciBhbHBoYUZhYyA9IG9wYXF1ZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN5ID0geTtcclxuICAgICAgICAgICAgICAgIHZhciBzeCA9IHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gKHkgKiB3aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgICAgIHZhciByID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBnID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGN5ID0gMDsgY3kgPCBzaWRlOyBjeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjeSA9IE1hdGgubWluKGhlaWdodCAtIDEsIE1hdGgubWF4KDAsIHN5ICsgY3kgLSBoYWxmU2lkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3ggPSBzeDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9mZnNldCA9IChzY3kgKiB3aWR0aCArIHNjeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3dCA9IHdlaWdodHNWZWN0b3JbY3ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHIgKz0gcGl4ZWxzW3BvZmZzZXRdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgZyArPSBwaXhlbHNbcG9mZnNldCArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYiArPSBwaXhlbHNbcG9mZnNldCArIDJdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYSArPSBwaXhlbHNbcG9mZnNldCArIDNdICogd3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0XSA9IHI7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDJdID0gYjtcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAzXSA9IGEgKyBhbHBoYUZhYyAqICgyNTUgLSBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhc3Qgc2VwYXJhYmxlIGNvbnZvbHV0aW9uLiBBIHBvaW50IHNwcmVhZCBmdW5jdGlvbiAoUFNGKSBpcyBzYWlkIHRvIGJlXHJcbiAgICAgKiBzZXBhcmFibGUgaWYgaXQgY2FuIGJlIGJyb2tlbiBpbnRvIHR3byBvbmUtZGltZW5zaW9uYWwgc2lnbmFsczogYVxyXG4gICAgICogdmVydGljYWwgYW5kIGEgaG9yaXpvbnRhbCBwcm9qZWN0aW9uLiBUaGUgY29udm9sdXRpb24gaXMgcGVyZm9ybWVkIGJ5XHJcbiAgICAgKiBzbGlkaW5nIHRoZSBrZXJuZWwgb3ZlciB0aGUgaW1hZ2UsIGdlbmVyYWxseSBzdGFydGluZyBhdCB0aGUgdG9wIGxlZnRcclxuICAgICAqIGNvcm5lciwgc28gYXMgdG8gbW92ZSB0aGUga2VybmVsIHRocm91Z2ggYWxsIHRoZSBwb3NpdGlvbnMgd2hlcmUgdGhlXHJcbiAgICAgKiBrZXJuZWwgZml0cyBlbnRpcmVseSB3aXRoaW4gdGhlIGJvdW5kYXJpZXMgb2YgdGhlIGltYWdlLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGhvcml6V2VpZ2h0cyBUaGUgaG9yaXpvbnRhbCB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB2ZXJ0V2VpZ2h0cyBUaGUgdmVydGljYWwgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHNlcGFyYWJsZUNvbnZvbHZlKHBpeGVsczogRmxvYXQzMkFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaG9yaXpXZWlnaHRzOiBGbG9hdDMyQXJyYXksIHZlcnRXZWlnaHRzOiBGbG9hdDMyQXJyYXksIG9wYXF1ZT86IGJvb2xlYW4pOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHZhciB2ZXJ0aWNhbCA9IHRoaXMudmVydGljYWxDb252b2x2ZShwaXhlbHMsIHdpZHRoLCBoZWlnaHQsIHZlcnRXZWlnaHRzLCBvcGFxdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhvcml6b250YWxDb252b2x2ZSh2ZXJ0aWNhbCwgd2lkdGgsIGhlaWdodCwgaG9yaXpXZWlnaHRzLCBvcGFxdWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGUgaW1hZ2UgZWRnZXMgdXNpbmcgU29iZWwgb3BlcmF0b3IuIENvbXB1dGVzIHRoZSB2ZXJ0aWNhbCBhbmRcclxuICAgICAqIGhvcml6b250YWwgZ3JhZGllbnRzIG9mIHRoZSBpbWFnZSBhbmQgY29tYmluZXMgdGhlIGNvbXB1dGVkIGltYWdlcyB0b1xyXG4gICAgICogZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2UuIFRoZSB3YXkgd2UgaW1wbGVtZW50IHRoZSBTb2JlbCBmaWx0ZXIgaGVyZSBpcyBieVxyXG4gICAgICogZmlyc3QgZ3JheXNjYWxpbmcgdGhlIGltYWdlLCB0aGVuIHRha2luZyB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWxcclxuICAgICAqIGdyYWRpZW50cyBhbmQgZmluYWxseSBjb21iaW5pbmcgdGhlIGdyYWRpZW50IGltYWdlcyB0byBtYWtlIHVwIHRoZSBmaW5hbFxyXG4gICAgICogaW1hZ2UuIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGVkZ2UgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHNvYmVsKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICB2YXIgX3BpeGVsczogRmxvYXQzMkFycmF5ID0gPEZsb2F0MzJBcnJheT48dW5rbm93bj5JbWFnZS5ncmF5c2NhbGUocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCB0cnVlKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG4gICAgICAgIHZhciBzb2JlbFNpZ25WZWN0b3IgPSBuZXcgRmxvYXQzMkFycmF5KFstMSwgMCwgMV0pO1xyXG4gICAgICAgIHZhciBzb2JlbFNjYWxlVmVjdG9yID0gbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMV0pO1xyXG4gICAgICAgIHZhciB2ZXJ0aWNhbCA9IHRoaXMuc2VwYXJhYmxlQ29udm9sdmUoX3BpeGVscywgd2lkdGgsIGhlaWdodCwgc29iZWxTaWduVmVjdG9yLCBzb2JlbFNjYWxlVmVjdG9yKTtcclxuICAgICAgICB2YXIgaG9yaXpvbnRhbCA9IHRoaXMuc2VwYXJhYmxlQ29udm9sdmUoX3BpeGVscywgd2lkdGgsIGhlaWdodCwgc29iZWxTY2FsZVZlY3Rvciwgc29iZWxTaWduVmVjdG9yKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgdmFyIHYgPSB2ZXJ0aWNhbFtpXTtcclxuICAgICAgICAgICAgdmFyIGggPSBob3Jpem9udGFsW2ldO1xyXG4gICAgICAgICAgICB2YXIgcCA9IE1hdGguc3FydChoICogaCArIHYgKiB2KTtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gcDtcclxuICAgICAgICAgICAgb3V0cHV0W2kgKyAxXSA9IHA7XHJcbiAgICAgICAgICAgIG91dHB1dFtpICsgMl0gPSBwO1xyXG4gICAgICAgICAgICBvdXRwdXRbaSArIDNdID0gMjU1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFcXVhbGl6ZXMgdGhlIGhpc3RvZ3JhbSBvZiBhIGdyYXlzY2FsZSBpbWFnZSwgbm9ybWFsaXppbmcgdGhlXHJcbiAgICAgKiBicmlnaHRuZXNzIGFuZCBpbmNyZWFzaW5nIHRoZSBjb250cmFzdCBvZiB0aGUgaW1hZ2UuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBncmF5c2NhbGUgcGl4ZWxzIGluIGEgbGluZWFyIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgZXF1YWxpemVkIGdyYXlzY2FsZSBwaXhlbHMgaW4gYSBsaW5lYXIgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIGVxdWFsaXplSGlzdChwaXhlbHM6IFVpbnQ4Q2xhbXBlZEFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBlcXVhbGl6ZWQgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkocGl4ZWxzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIHZhciBoaXN0b2dyYW0gPSBuZXcgQXJyYXkoMjU2KTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSBoaXN0b2dyYW1baV0gPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBlcXVhbGl6ZWRbaV0gPSBwaXhlbHNbaV07XHJcbiAgICAgICAgICAgIGhpc3RvZ3JhbVtwaXhlbHNbaV1dKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldiA9IGhpc3RvZ3JhbVswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGhpc3RvZ3JhbVtpXSArPSBwcmV2O1xyXG4gICAgICAgICAgICBwcmV2ID0gaGlzdG9ncmFtW2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vcm0gPSAyNTUgLyBwaXhlbHMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGl4ZWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBlcXVhbGl6ZWRbaV0gPSAoaGlzdG9ncmFtW3BpeGVsc1tpXV0gKiBub3JtICsgMC41KSB8IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBlcXVhbGl6ZWQ7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgTWF0aCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgYSByZWN0YW5nbGUgaW50ZXJzZWN0cyB3aXRoIGFub3RoZXIuXHJcbiAgICAgKlxyXG4gICAgICogIDxwcmU+XHJcbiAgICAgKiAgeDB5MCAtLS0tLS0tLSAgICAgICB4MnkyIC0tLS0tLS0tXHJcbiAgICAgKiAgICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICB8XHJcbiAgICAgKiAgICAgIC0tLS0tLS0tIHgxeTEgICAgICAgLS0tLS0tLS0geDN5M1xyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAwLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgxIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MSBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAxLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgyIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MiBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgzIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMy5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MyBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGludGVyc2VjdFJlY3QoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhKHgyID4geDEgfHwgeDMgPCB4MCB8fCB5MiA+IHkxIHx8IHkzIDwgeTApO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCIuL0V2ZW50RW1pdHRlclwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH07XHJcbiAgICBhYnN0cmFjdCB0cmFjayhlbGVtZW50OiBhbnksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogYW55O1xyXG59IiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XHJcbmltcG9ydCB7IFRyYWNrZXIgfSBmcm9tIFwiLi9UcmFja2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2tlclRhc2sgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IodHJhY2tlcjogVHJhY2tlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKCF0cmFja2VyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlciBpbnN0YW5jZSBub3Qgc3BlY2lmaWVkLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRUcmFja2VyKHRyYWNrZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhvbGRzIHRoZSB0cmFja2VyIGluc3RhbmNlIG1hbmFnZWQgYnkgdGhpcyB0YXNrLlxyXG4gICAgICogQHR5cGUge1RyYWNrZXJ9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyYWNrZXJfOiBUcmFja2VyID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhvbGRzIGlmIHRoZSB0cmFja2VyIHRhc2sgaXMgaW4gcnVubmluZy5cclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBydW5uaW5nXyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdHJhY2tlciBpbnN0YW5jZSBtYW5hZ2VkIGJ5IHRoaXMgdGFzay5cclxuICAgICAqIEByZXR1cm4ge1RyYWNrZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldFRyYWNrZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhY2tlcl87XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmFja2VyIHRhc2sgaXMgaW4gcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5SdW5uaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bm5pbmdfO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgaWYgdGhlIHRyYWNrZXIgdGFzayBpcyBpbiBydW5uaW5nLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBydW5uaW5nXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFJ1bm5pbmcocnVubmluZzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucnVubmluZ18gPSBydW5uaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRyYWNrZXIgaW5zdGFuY2UgbWFuYWdlZCBieSB0aGlzIHRhc2suXHJcbiAgICAgKiBAcmV0dXJuIHtUcmFja2VyfVxyXG4gICAgICovXHJcbiAgICBzZXRUcmFja2VyKHRyYWNrZXI6IFRyYWNrZXIpIHtcclxuICAgICAgICB0aGlzLnRyYWNrZXJfID0gdHJhY2tlcjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZWVtaXRUcmFja0V2ZW50XyhldmVudDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjaycsIGV2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbWl0cyBhIGBydW5gIGV2ZW50IG9uIHRoZSB0cmFja2VyIHRhc2sgZm9yIHRoZSBpbXBsZW1lbnRlcnMgdG8gcnVuIGFueVxyXG4gICAgICogY2hpbGQgYWN0aW9uLCBlLmcuIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGl0c2VsZiwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHJ1bigpIHtcclxuICAgICAgICAvL3ZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5SdW5uaW5nKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRSdW5uaW5nKHRydWUpO1xyXG4gICAgICAgIC8qdGhpcy5yZWVtaXRUcmFja0V2ZW50XyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICBzZWxmLmVtaXQoJ3RyYWNrJywgZXZlbnQpO1xyXG4gICAgICAgIH07Ki9cclxuICAgICAgICB0aGlzLnRyYWNrZXJfLm9uKCd0cmFjaycsIHRoaXMucmVlbWl0VHJhY2tFdmVudF8pO1xyXG4gICAgICAgIHRoaXMuZW1pdCgncnVuJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW1pdHMgYSBgc3RvcGAgZXZlbnQgb24gdGhlIHRyYWNrZXIgdGFzayBmb3IgdGhlIGltcGxlbWVudGVycyB0byBzdG9wIGFueVxyXG4gICAgICogY2hpbGQgYWN0aW9uIGJlaW5nIGRvbmUsIGUuZy4gYHJlcXVlc3RBbmltYXRpb25GcmFtZWAuXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgaXRzZWxmLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5SdW5uaW5nKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRSdW5uaW5nKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmVtaXQoJ3N0b3AnKTtcclxuICAgICAgICB0aGlzLnRyYWNrZXJfLnJlbW92ZUxpc3RlbmVyKCd0cmFjaycsIHRoaXMucmVlbWl0VHJhY2tFdmVudF8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBfRXZlbnRFbWl0dGVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInXHJcbmltcG9ydCB7IENhbnZhcyBhcyBfQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnXHJcbmltcG9ydCB7IEltYWdlIGFzIF9JbWFnZSB9IGZyb20gJy4vSW1hZ2UnXHJcbmltcG9ydCB7IFRyYWNrZXIgfSBmcm9tICcuL1RyYWNrZXInXHJcbmltcG9ydCB7IFRyYWNrZXJUYXNrIH0gZnJvbSAnLi9UcmFja2VyVGFzaydcclxuaW1wb3J0IHsgQ29sb3JUcmFja2VyIGFzIF9Db2xvclRyYWNrZXIgfSBmcm9tICcuL0NvbG9yVHJhY2tlcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNraW5nIHtcclxuXHJcbiAgICBzdGF0aWMgRXZlbnRFbWl0dGVyOiB0eXBlb2YgX0V2ZW50RW1pdHRlcjtcclxuICAgIHN0YXRpYyBDYW52YXM6IHR5cGVvZiBfQ2FudmFzO1xyXG4gICAgc3RhdGljIEltYWdlOiB0eXBlb2YgX0ltYWdlO1xyXG4gICAgc3RhdGljIENvbG9yVHJhY2tlcjogdHlwZW9mIF9Db2xvclRyYWNrZXI7XHJcblxyXG4gICAgc3RhdGljIGdyYXlzY2FsZTogdHlwZW9mIF9JbWFnZS5ncmF5c2NhbGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBDYXB0dXJlcyB0aGUgdXNlciBjYW1lcmEgd2hlbiB0cmFja2luZyBhIHZpZGVvIGVsZW1lbnQgYW5kIHNldCBpdHMgc291cmNlXHJcbiAgICAqIHRvIHRoZSBjYW1lcmEgc3RyZWFtLlxyXG4gICAgKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IGVsZW1lbnQgQ2FudmFzIGVsZW1lbnQgdG8gdHJhY2suXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgKi9cclxuICAgIGluaXRVc2VyTWVkaWFfKGVsZW1lbnQ6IEhUTUxWaWRlb0VsZW1lbnQsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcclxuICAgICAgICAgICAgdmlkZW86IHRydWUsXHJcbiAgICAgICAgICAgIGF1ZGlvOiAob3B0X29wdGlvbnMgJiYgb3B0X29wdGlvbnMuYXVkaW8pID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgY2FwdHVyZSB1c2VyIGNhbWVyYS4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIFRlc3RzIHdoZXRoZXIgdGhlIG9iamVjdCBpcyBhIGRvbSBub2RlLlxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gbyBPYmplY3QgdG8gYmUgdGVzdGVkLlxyXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBvYmplY3QgaXMgYSBkb20gbm9kZS5cclxuICAgICovXHJcbiAgICBpc05vZGUobzogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG8ubm9kZVR5cGUgfHwgdGhpcy5pc1dpbmRvdyhvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogVGVzdHMgd2hldGhlciB0aGUgb2JqZWN0IGlzIHRoZSBgd2luZG93YCBvYmplY3QuXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvIE9iamVjdCB0byBiZSB0ZXN0ZWQuXHJcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG9iamVjdCBpcyB0aGUgYHdpbmRvd2Agb2JqZWN0LlxyXG4gICAgKi9cclxuICAgIGlzV2luZG93KG86IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIShvICYmIG8uYWxlcnQgJiYgby5kb2N1bWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VsZWN0cyBhIGRvbSBub2RlIGZyb20gYSBDU1MzIHNlbGVjdG9yIHVzaW5nIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcclxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X2VsZW1lbnQgVGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIHF1ZXJ5LiBXaGVuIG5vdFxyXG4gICAqICAgICBzcGVjaWZpZWQgYGRvY3VtZW50YCBpcyB1c2VkIGFzIHJvb3QgZWxlbWVudC5cclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gVGhlIGZpcnN0IGRvbSBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0byB0aGUgc2VsZWN0b3IuXHJcbiAgICogICAgIElmIG5vdCBmb3VuZCwgcmV0dXJucyBgbnVsbGAuXHJcbiAgICovXHJcbiAgICBvbmUoc2VsZWN0b3I6IEhUTUxFbGVtZW50LCBvcHRfZWxlbWVudD86IGFueSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5pc05vZGUoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChvcHRfZWxlbWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgY2FudmFzLCBpbWFnZSBvciB2aWRlbyBlbGVtZW50IGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgYHRyYWNrZXJgXHJcbiAgICAgKiBpbnN0YW5jZS4gVGhpcyBtZXRob2QgZXh0cmFjdCB0aGUgcGl4ZWwgaW5mb3JtYXRpb24gb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqIHRvIHBhc3MgdG8gdGhlIGB0cmFja2VyYCBpbnN0YW5jZS4gV2hlbiB0cmFja2luZyBhIHZpZGVvLCB0aGVcclxuICAgICAqIGB0cmFja2VyLnRyYWNrKHBpeGVscywgd2lkdGgsIGhlaWdodClgIHdpbGwgYmUgaW4gYVxyXG4gICAgICogYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgbG9vcCBpbiBvcmRlciB0byB0cmFjayBhbGwgdmlkZW8gZnJhbWVzLlxyXG4gICAgICpcclxuICAgICAqIEV4YW1wbGU6XHJcbiAgICAgKiB2YXIgdHJhY2tlciA9IG5ldyB0cmFja2luZy5Db2xvclRyYWNrZXIoKTtcclxuICAgICAqXHJcbiAgICAgKiB0cmFja2luZy50cmFjaygnI3ZpZGVvJywgdHJhY2tlcik7XHJcbiAgICAgKiBvclxyXG4gICAgICogdHJhY2tpbmcudHJhY2soJyN2aWRlbycsIHRyYWNrZXIsIHsgY2FtZXJhOiB0cnVlIH0pO1xyXG4gICAgICpcclxuICAgICAqIHRyYWNrZXIub24oJ3RyYWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAqICAgLy8gY29uc29sZS5sb2coZXZlbnQuZGF0YVswXS54LCBldmVudC5kYXRhWzBdLnkpXHJcbiAgICAgKiB9KTtcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRyYWNrLCBjYW52YXMsIGltYWdlIG9yXHJcbiAgICAgKiAgICAgdmlkZW8uXHJcbiAgICAgKiBAcGFyYW0ge1RyYWNrZXJ9IHRyYWNrZXIgVGhlIHRyYWNrZXIgaW5zdGFuY2UgdXNlZCB0byB0cmFjayB0aGVcclxuICAgICAqICAgICBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdF9vcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHRyYWNrZXIuXHJcbiAgICAgKi9cclxuICAgIHRyYWNrKGVsZW1lbnQ6IGFueSwgdHJhY2tlcjogVHJhY2tlciwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgICAgICBlbGVtZW50ID0gdGhpcy5vbmUoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZm91bmQsIHRyeSBhIGRpZmZlcmVudCBlbGVtZW50IG9yIHNlbGVjdG9yLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRyYWNrZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VyIG5vdCBzcGVjaWZpZWQsIHRyeSBgdHJhY2tpbmcudHJhY2soZWxlbWVudCwgbmV3IHRyYWNraW5nLkZhY2VUcmFja2VyKCkpYC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NhbnZhcyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0NhbnZhc18oZWxlbWVudCwgdHJhY2tlciwgb3B0X29wdGlvbnMpO1xyXG4gICAgICAgICAgICBjYXNlICdpbWcnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2tJbWdfKGVsZW1lbnQsIHRyYWNrZXIsIG9wdF9vcHRpb25zKTtcclxuICAgICAgICAgICAgY2FzZSAndmlkZW8nOlxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF9vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdF9vcHRpb25zLmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRVc2VyTWVkaWFfKGVsZW1lbnQsIG9wdF9vcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja1ZpZGVvXyhlbGVtZW50LCB0cmFja2VyLCBvcHRfb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IHN1cHBvcnRlZCwgdHJ5IGluIGEgY2FudmFzLCBpbWcsIG9yIHZpZGVvLicpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFja3MgYSBjYW52YXMgZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZSBhbmRcclxuICAgICAqIHJldHVybnMgYSBgVHJhY2tlclRhc2tgIGZvciB0aGlzIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7dHJhY2tpbmcuVHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEByZXR1cm4ge3RyYWNraW5nLlRyYWNrZXJUYXNrfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0NhbnZhc18oZWxlbWVudDogYW55LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgdGFzayA9IG5ldyBUcmFja2VyVGFzayh0cmFja2VyKTtcclxuICAgICAgICB0YXNrLm9uKCdydW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudHJhY2tDYW52YXNJbnRlcm5hbF8oZWxlbWVudCwgdHJhY2tlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2sucnVuKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgY2FudmFzIGVsZW1lbnQgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoaXNcclxuICAgICAqIG1ldGhvZCBleHRyYWN0IHRoZSBwaXhlbCBpbmZvcm1hdGlvbiBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byBwYXNzIHRvIHRoZVxyXG4gICAgICogYHRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7dHJhY2tpbmcuVHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhY2tDYW52YXNJbnRlcm5hbF8oZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQsIHRyYWNrZXI6IFRyYWNrZXIsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC53aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSBlbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdmFyIGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRyYWNrZXIudHJhY2soaW1hZ2VEYXRhLmRhdGEsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYWNrcyBhIGltYWdlIGVsZW1lbnQgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoaXNcclxuICAgICAqIG1ldGhvZCBleHRyYWN0IHRoZSBwaXhlbCBpbmZvcm1hdGlvbiBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byBwYXNzIHRvIHRoZVxyXG4gICAgICogYHRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBlbGVtZW50IENhbnZhcyBlbGVtZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtUcmFja2VyfSB0cmFja2VyIFRoZSB0cmFja2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgdGhlXHJcbiAgICAgKiAgICAgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0ltZ18oZWxlbWVudDogYW55LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIHRhc2sgPSBuZXcgVHJhY2tlclRhc2sodHJhY2tlcik7XHJcbiAgICAgICAgdGFzay5vbigncnVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBUcmFja2luZy5DYW52YXMubG9hZEltYWdlKGNhbnZhcywgZWxlbWVudC5zcmMsIDAsIDAsIHdpZHRoLCBoZWlnaHQsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tDYW52YXNJbnRlcm5hbF8oY2FudmFzLCB0cmFja2VyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2sucnVuKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgdmlkZW8gZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZS4gVGhpc1xyXG4gICAgICogbWV0aG9kIGV4dHJhY3QgdGhlIHBpeGVsIGluZm9ybWF0aW9uIG9mIHRoZSBpbnB1dCBlbGVtZW50IHRvIHBhc3MgdG8gdGhlXHJcbiAgICAgKiBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoZSBgdHJhY2tlci50cmFjayhwaXhlbHMsIHdpZHRoLCBoZWlnaHQpYCB3aWxsIGJlIGluXHJcbiAgICAgKiBhIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGxvb3AgaW4gb3JkZXIgdG8gdHJhY2sgYWxsIHZpZGVvIGZyYW1lcy5cclxuICAgICAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7VHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgcHJpdmF0ZSB0cmFja1ZpZGVvXyAoZWxlbWVudDogSFRNTFZpZGVvRWxlbWVudCwgdHJhY2tlcjogVHJhY2tlciwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB2YXIgd2lkdGg6IG51bWJlcjtcclxuICAgIHZhciBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICB2YXIgcmVzaXplQ2FudmFzXyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH07XHJcbiAgICByZXNpemVDYW52YXNfKCk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbnZhc18pO1xyXG5cclxuICAgIHZhciByZXF1ZXN0SWQ6IG51bWJlcjtcclxuICAgIHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfID0gKCkgPT4ge1xyXG4gICAgICByZXF1ZXN0SWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5yZWFkeVN0YXRlID09PSBlbGVtZW50LkhBVkVfRU5PVUdIX0RBVEEpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggdn4zMC4wIGdldHMgY29uZnVzZWQgd2l0aCB0aGUgdmlkZW8gcmVhZHlTdGF0ZSBmaXJpbmcgYW5cclxuICAgICAgICAgICAgLy8gZXJyb25lb3VzIEhBVkVfRU5PVUdIX0RBVEEganVzdCBiZWZvcmUgSEFWRV9DVVJSRU5UX0RBVEEgc3RhdGUsXHJcbiAgICAgICAgICAgIC8vIGhlbmNlIGtlZXAgdHJ5aW5nIHRvIHJlYWQgaXQgdW50aWwgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGVsZW1lbnQsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxyXG4gICAgICAgICAgdGhpcy50cmFja0NhbnZhc0ludGVybmFsXyhjYW52YXMsIHRyYWNrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdGFzayA9IG5ldyBUcmFja2VyVGFzayh0cmFja2VyKTtcclxuICAgIHRhc2sub24oJ3N0b3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJZCk7XHJcbiAgICB9KTtcclxuICAgIHRhc2sub24oJ3J1bicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfKCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0YXNrLnJ1bigpO1xyXG4gIH07XHJcblxyXG5cclxuICAgIHB1YmxpYyBFdmVudEVtaXR0ZXIgPSBfRXZlbnRFbWl0dGVyO1xyXG5cclxuICAgIHB1YmxpYyBDYW52YXMgPSBfQ2FudmFzO1xyXG5cclxuICAgIHB1YmxpYyBJbWFnZSA9IF9JbWFnZTtcclxuXHJcbiAgICBwdWJsaWMgQ29sb3JUcmFja2VyID0gX0NvbG9yVHJhY2tlcjtcclxufVxyXG5cclxuVHJhY2tpbmcuRXZlbnRFbWl0dGVyID0gX0V2ZW50RW1pdHRlcjtcclxuXHJcblRyYWNraW5nLkNhbnZhcyA9IF9DYW52YXM7XHJcblxyXG5UcmFja2luZy5JbWFnZSA9IF9JbWFnZTtcclxuXHJcblRyYWNraW5nLkNvbG9yVHJhY2tlciA9IF9Db2xvclRyYWNrZXI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVHJhY2tpbmcgZnJvbSBcIi4vVHJhY2tpbmdcIjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgVHJhY2tpbmdcclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==