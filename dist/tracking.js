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
    static neighbours_ = new Map();
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
        if (ColorTracker.neighbours_.get(width)) {
            return ColorTracker.neighbours_.get(width);
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
        ColorTracker.neighbours_.set(width, neighbours);
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
    run() {
        var self = this;
        if (this.inRunning()) {
            return;
        }
        this.setRunning(true);
        const reemitTrackEvent_ = function (event) {
            self.emit('track', event);
        };
        this.tracker_.on('track', reemitTrackEvent_);
        this.emit('run');
        return this;
    }
    ;
    stop() {
        if (!this.inRunning()) {
            return;
        }
        var self = this;
        this.setRunning(false);
        this.emit('stop');
        const reemitTrackEvent_ = function (event) {
            self.emit('track', event);
        };
        this.tracker_.removeListener('track', reemitTrackEvent_);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUV4QixRQUFRLENBQUMsWUFBWSxHQUFHLHVEQUFhLENBQUM7Ozs7Ozs7VUMxUHRDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDbEMsaUVBQWU7SUFDWCxRQUFRO0NBQ1giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvQ2FudmFzLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL0NvbG9yVHJhY2tlci50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9FdmVudEVtaXR0ZXIudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvSW1hZ2UudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvTWF0aC50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9UcmFja2VyLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL1RyYWNrZXJUYXNrLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL1RyYWNraW5nLnRzIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RyYWNraW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVHJhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiVHJhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiZXhwb3J0IGNsYXNzIENhbnZhcyB7XHJcbiAgICAvKipcclxuICAgICAqIENhbnZhcyB1dGlsaXR5LlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogTG9hZHMgYW4gaW1hZ2Ugc291cmNlIGludG8gdGhlIGNhbnZhcy5cclxuICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgVGhlIGNhbnZhcyBkb20gZWxlbWVudC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3JjIFRoZSBpbWFnZSBzb3VyY2UuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIGNhbnZhcyBob3Jpem9udGFsIGNvb3JkaW5hdGUgdG8gbG9hZCB0aGUgaW1hZ2UuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIGNhbnZhcyB2ZXJ0aWNhbCBjb29yZGluYXRlIHRvIGxvYWQgdGhlIGltYWdlLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdF9jYWxsYmFjayBDYWxsYmFjayB0aGF0IGZpcmVzIHdoZW4gdGhlIGltYWdlIGlzIGxvYWRlZFxyXG4gICAqICAgICBpbnRvIHRoZSBjYW52YXMuXHJcbiAgICogQHN0YXRpY1xyXG4gICAqL1xyXG4gICAgc3RhdGljIGxvYWRJbWFnZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzcmM6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBvcHRfY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcztcclxuICAgICAgICB2YXIgaW1nID0gbmV3IHdpbmRvdy5JbWFnZSgpO1xyXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICcqJztcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKG9wdF9jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgb3B0X2NhbGxiYWNrLmNhbGwoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZyA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gc3JjO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IFRyYWNrZXIgfSBmcm9tICcuL1RyYWNrZXInO1xyXG5pbXBvcnQgeyBNYXRoIGFzIF9NYXRoIH0gZnJvbSAnLi9NYXRoJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclRyYWNrZXIgZXh0ZW5kcyBUcmFja2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogQ29sb3JUcmFja2VyIHV0aWxpdHkgdG8gdHJhY2sgY29sb3JlZCBibG9icyBpbiBhIGZyYW1lIHVzaW5nIGNvbG9yXHJcbiAgICAgKiBkaWZmZXJlbmNlIGV2YWx1YXRpb24uXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PHN0cmluZz59IG9wdF9jb2xvcnMgT3B0aW9uYWwgY29sb3JzIHRvIHRyYWNrLlxyXG4gICAgICogQGV4dGVuZHMge1RyYWNrZXJ9XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdF9jb2xvcnM6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICBzdXBlcigpXHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENvbG9ycygpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdF9jb2xvcnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wdF9jb2xvcnMgPSBbb3B0X2NvbG9yc107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0X2NvbG9ycykge1xyXG4gICAgICAgICAgICBvcHRfY29sb3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUNvbG9yVHJhY2tlci5nZXRDb2xvcihjb2xvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIG5vdCB2YWxpZCwgdHJ5IGBuZXcgdHJhY2tpbmcuQ29sb3JUcmFja2VyKFwibWFnZW50YVwiKWAuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbG9ycyhvcHRfY29sb3JzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIGtub3duIGNvbG9ycy5cclxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga25vd25Db2xvcnNfOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4gPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb24+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWNoZXMgY29vcmRpbmF0ZXMgdmFsdWVzIG9mIHRoZSBuZWlnaGJvdXJzIHN1cnJvdW5kaW5nIGEgcGl4ZWwuXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0LjxudW1iZXIsIEludDMyQXJyYXk+fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbmVpZ2hib3Vyc186IE1hcDxudW1iZXIsIEludDMyQXJyYXk+ID0gbmV3IE1hcDxudW1iZXIsIEludDMyQXJyYXk+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlcnMgYSBjb2xvciBhcyBrbm93biBjb2xvci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBjb2xvciBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gVGhlIGNvbG9yIGZ1bmN0aW9uIHRvIHRlc3QgaWYgdGhlIHBhc3NlZCAocixnLGIpIGlzXHJcbiAgICAgKiAgICAgdGhlIGRlc2lyZWQgY29sb3IuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWdpc3RlckNvbG9yKG5hbWU6IHN0cmluZywgZm46IChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSA9PiBib29sZWFuKTogYW55IHtcclxuICAgICAgICBDb2xvclRyYWNrZXIua25vd25Db2xvcnNfLnNldChuYW1lLCBmbik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIEdldHMgdGhlIGtub3duIGNvbG9yIGZ1bmN0aW9uIHRoYXQgaXMgYWJsZSB0byB0ZXN0IHdoZXRoZXIgYW4gKHIsZyxiKSBpc1xyXG4gICAqIHRoZSBkZXNpcmVkIGNvbG9yLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBjb2xvciBuYW1lLlxyXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBUaGUga25vd24gY29sb3IgdGVzdCBmdW5jdGlvbi5cclxuICAgKiBAc3RhdGljXHJcbiAgICovXHJcbiAgICBzdGF0aWMgZ2V0Q29sb3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbG9yVHJhY2tlci5rbm93bkNvbG9yc18uZ2V0KG5hbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhvbGRzIHRoZSBjb2xvcnMgdG8gYmUgdHJhY2tlZCBieSB0aGUgYENvbG9yVHJhY2tlcmAgaW5zdGFuY2UuXHJcbiAgICAgKiBAZGVmYXVsdCBbJ21hZ2VudGEnXVxyXG4gICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxyXG4gICAgICovXHJcbiAgICBjb2xvcnM6IEFycmF5PHN0cmluZz4gPSBbJ21hZ2VudGEnXTtcclxuXHJcbiAgICAvKipcclxuICAgKiBIb2xkcyB0aGUgbWluaW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICogQGRlZmF1bHQgMjBcclxuICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAqL1xyXG4gICAgbWluRGltZW5zaW9uID0gMjA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyB0aGUgbWF4aW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAZGVmYXVsdCBJbmZpbml0eVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgbWF4RGltZW5zaW9uID0gSW5maW5pdHk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyB0aGUgbWluaW11bSBncm91cCBzaXplIHRvIGJlIGNsYXNzaWZpZWQgYXMgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAZGVmYXVsdCAzMFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgbWluR3JvdXBTaXplID0gMzA7XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgY2VudHJhbCBjb29yZGluYXRlIGZyb20gdGhlIGNsb3VkIHBvaW50cy4gVGhlIGNsb3VkIHBvaW50c1xyXG4gICAqIGFyZSBhbGwgcG9pbnRzIHRoYXQgbWF0Y2hlcyB0aGUgZGVzaXJlZCBjb2xvci5cclxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjbG91ZCBNYWpvciByb3cgb3JkZXIgYXJyYXkgY29udGFpbmluZyBhbGwgdGhlXHJcbiAgICogICAgIHBvaW50cyBmcm9tIHRoZSBkZXNpcmVkIGNvbG9yLCBlLmcuIFt4MSwgeTEsIGMyLCB5MiwgLi4uXS5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gdG90YWwgVG90YWwgbnVtYmVycyBvZiBwaXhlbHMgb2YgdGhlIGRlc2lyZWQgY29sb3IuXHJcbiAgICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgeCwgeSBhbmQgZXN0aW1hdGVkIHogY29vcmRpbmF0ZSBvZlxyXG4gICAqICAgICB0aGUgYmxvZyBleHRyYWN0ZWQgZnJvbSB0aGUgY2xvdWQgcG9pbnRzLlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZURpbWVuc2lvbnNfKGNsb3VkOiBhbnksIHRvdGFsOiBudW1iZXIpOiBvYmplY3Qge1xyXG4gICAgICAgIHZhciBtYXh4ID0gLTE7XHJcbiAgICAgICAgdmFyIG1heHkgPSAtMTtcclxuICAgICAgICB2YXIgbWlueCA9IEluZmluaXR5O1xyXG4gICAgICAgIHZhciBtaW55ID0gSW5maW5pdHk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdG90YWw7IGMgKz0gMikge1xyXG4gICAgICAgICAgICB2YXIgeCA9IGNsb3VkW2NdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IGNsb3VkW2MgKyAxXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh4IDwgbWlueCkge1xyXG4gICAgICAgICAgICAgICAgbWlueCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHggPiBtYXh4KSB7XHJcbiAgICAgICAgICAgICAgICBtYXh4ID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA8IG1pbnkpIHtcclxuICAgICAgICAgICAgICAgIG1pbnkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5ID4gbWF4eSkge1xyXG4gICAgICAgICAgICAgICAgbWF4eSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBtYXh4IC0gbWlueCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBtYXh5IC0gbWlueSxcclxuICAgICAgICAgICAgeDogbWlueCxcclxuICAgICAgICAgICAgeTogbWlueVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY29sb3JzIGJlaW5nIHRyYWNrZWQgYnkgdGhlIGBDb2xvclRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XHJcbiAgICAgKi9cclxuICAgIGdldENvbG9ycygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xvcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIEdldHMgdGhlIG1pbmltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICAgIGdldE1pbkRpbWVuc2lvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1pbkRpbWVuc2lvbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBtYXhpbXVtIGRpbWVuc2lvbiB0byBjbGFzc2lmeSBhIHJlY3RhbmdsZS5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TWF4RGltZW5zaW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4RGltZW5zaW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIG1pbmltdW0gZ3JvdXAgc2l6ZSB0byBiZSBjbGFzc2lmaWVkIGFzIGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXRNaW5Hcm91cFNpemUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5taW5Hcm91cFNpemU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICogR2V0cyB0aGUgZWlnaHQgb2Zmc2V0IHZhbHVlcyBvZiB0aGUgbmVpZ2hib3VycyBzdXJyb3VuZGluZyBhIHBpeGVsLlxyXG4gICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAqIEByZXR1cm4ge2FycmF5fSBBcnJheSB3aXRoIHRoZSBlaWdodCBvZmZzZXQgdmFsdWVzIG9mIHRoZSBuZWlnaGJvdXJzXHJcbiAgKiAgICAgc3Vycm91bmRpbmcgYSBwaXhlbC5cclxuICAqIEBwcml2YXRlXHJcbiAgKi9cclxuICAgIHByaXZhdGUgZ2V0TmVpZ2hib3Vyc0ZvcldpZHRoXyh3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKENvbG9yVHJhY2tlci5uZWlnaGJvdXJzXy5nZXQod2lkdGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvclRyYWNrZXIubmVpZ2hib3Vyc18uZ2V0KHdpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuZWlnaGJvdXJzID0gbmV3IEludDMyQXJyYXkoOCk7XHJcblxyXG4gICAgICAgIG5laWdoYm91cnNbMF0gPSAtd2lkdGggKiA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbMV0gPSAtd2lkdGggKiA0ICsgNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzJdID0gNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzNdID0gd2lkdGggKiA0ICsgNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzRdID0gd2lkdGggKiA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbNV0gPSB3aWR0aCAqIDQgLSA0O1xyXG4gICAgICAgIG5laWdoYm91cnNbNl0gPSAtNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzddID0gLXdpZHRoICogNCAtIDQ7XHJcblxyXG4gICAgICAgIENvbG9yVHJhY2tlci5uZWlnaGJvdXJzXy5zZXQod2lkdGgsIG5laWdoYm91cnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmVpZ2hib3VycztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbml0ZXMgZ3JvdXBzIHdob3NlIGJvdW5kaW5nIGJveCBpbnRlcnNlY3Qgd2l0aCBlYWNoIG90aGVyLlxyXG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gcmVjdHNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWVyZ2VSZWN0YW5nbGVzXyhyZWN0czogYW55KSB7XHJcbiAgICAgICAgdmFyIGludGVyc2VjdHM7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgICB2YXIgbWluRGltZW5zaW9uID0gdGhpcy5nZXRNaW5EaW1lbnNpb24oKTtcclxuICAgICAgICB2YXIgbWF4RGltZW5zaW9uID0gdGhpcy5nZXRNYXhEaW1lbnNpb24oKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCByZWN0cy5sZW5ndGg7IHIrKykge1xyXG4gICAgICAgICAgICB2YXIgcjEgPSByZWN0c1tyXTtcclxuICAgICAgICAgICAgaW50ZXJzZWN0cyA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHMgPSByICsgMTsgcyA8IHJlY3RzLmxlbmd0aDsgcysrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcjIgPSByZWN0c1tzXTtcclxuICAgICAgICAgICAgICAgIGlmIChfTWF0aC5pbnRlcnNlY3RSZWN0KHIxLngsIHIxLnksIHIxLnggKyByMS53aWR0aCwgcjEueSArIHIxLmhlaWdodCwgcjIueCwgcjIueSwgcjIueCArIHIyLndpZHRoLCByMi55ICsgcjIuaGVpZ2h0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeDEgPSBNYXRoLm1pbihyMS54LCByMi54KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeTEgPSBNYXRoLm1pbihyMS55LCByMi55KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeDIgPSBNYXRoLm1heChyMS54ICsgcjEud2lkdGgsIHIyLnggKyByMi53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHkyID0gTWF0aC5tYXgocjEueSArIHIxLmhlaWdodCwgcjIueSArIHIyLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcjIuaGVpZ2h0ID0geTIgLSB5MTtcclxuICAgICAgICAgICAgICAgICAgICByMi53aWR0aCA9IHgyIC0geDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcjIueCA9IHgxO1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLnkgPSB5MTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGludGVyc2VjdHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyMS53aWR0aCA+PSBtaW5EaW1lbnNpb24gJiYgcjEuaGVpZ2h0ID49IG1pbkRpbWVuc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyMS53aWR0aCA8PSBtYXhEaW1lbnNpb24gJiYgcjEuaGVpZ2h0IDw9IG1heERpbWVuc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocjEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29sb3JzIHRvIGJlIHRyYWNrZWQgYnkgdGhlIGBDb2xvclRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY29sb3JzXHJcbiAgICAgKi9cclxuICAgIHNldENvbG9ycyhjb2xvcnM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbG9ycyA9IGNvbG9ycztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtaW5pbXVtIGRpbWVuc2lvbiB0byBjbGFzc2lmeSBhIHJlY3RhbmdsZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5EaW1lbnNpb25cclxuICAgICAqL1xyXG4gICAgc2V0TWluRGltZW5zaW9uKG1pbkRpbWVuc2lvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5taW5EaW1lbnNpb24gPSBtaW5EaW1lbnNpb247XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbWF4aW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4RGltZW5zaW9uXHJcbiAgICAgKi9cclxuICAgIHNldE1heERpbWVuc2lvbihtYXhEaW1lbnNpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubWF4RGltZW5zaW9uID0gbWF4RGltZW5zaW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIG1pbmltdW0gZ3JvdXAgc2l6ZSB0byBiZSBjbGFzc2lmaWVkIGFzIGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbkdyb3VwU2l6ZVxyXG4gICAgICovXHJcbiAgICBzZXRNaW5Hcm91cFNpemUobWluR3JvdXBTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1pbkdyb3VwU2l6ZSA9IG1pbkdyb3VwU2l6ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogVHJhY2tzIHRoZSBgVmlkZW9gIGZyYW1lcy4gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZvciBlYWNoIHZpZGVvIGZyYW1lIGluXHJcbiAgICogb3JkZXIgdG8gZW1pdCBgdHJhY2tgIGV2ZW50LlxyXG4gICAqIEBwYXJhbSB7VWludDhDbGFtcGVkQXJyYXl9IHBpeGVscyBUaGUgcGl4ZWxzIGRhdGEgdG8gdHJhY2suXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBwaXhlbHMgY2FudmFzIHdpZHRoLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIHBpeGVscyBjYW52YXMgaGVpZ2h0LlxyXG4gICAqL1xyXG4gICAgdHJhY2socGl4ZWxzOiBVaW50OENsYW1wZWRBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbG9ycyA9IHRoaXMuZ2V0Q29sb3JzKCk7XHJcblxyXG4gICAgICAgIGlmICghY29sb3JzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3JzIG5vdCBzcGVjaWZpZWQsIHRyeSBgbmV3IHRyYWNraW5nLkNvbG9yVHJhY2tlcihcIm1hZ2VudGFcIilgLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdHM6IGFueSA9IFtdO1xyXG5cclxuICAgICAgICBjb2xvcnMuZm9yRWFjaChmdW5jdGlvbiAoY29sb3IpIHtcclxuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KHNlbGYudHJhY2tDb2xvcl8ocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCBjb2xvcikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrJywge1xyXG4gICAgICAgICAgICBkYXRhOiByZXN1bHRzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIEZpbmQgdGhlIGdpdmVuIGNvbG9yIGluIHRoZSBnaXZlbiBtYXRyaXggb2YgcGl4ZWxzIHVzaW5nIEZsb29kIGZpbGxcclxuICAgKiBhbGdvcml0aG0gdG8gZGV0ZXJtaW5lcyB0aGUgYXJlYSBjb25uZWN0ZWQgdG8gYSBnaXZlbiBub2RlIGluIGFcclxuICAgKiBtdWx0aS1kaW1lbnNpb25hbCBhcnJheS5cclxuICAgKiBAcGFyYW0ge1VpbnQ4Q2xhbXBlZEFycmF5fSBwaXhlbHMgVGhlIHBpeGVscyBkYXRhIHRvIHRyYWNrLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgcGl4ZWxzIGNhbnZhcyB3aWR0aC5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBwaXhlbHMgY2FudmFzIGhlaWdodC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgVGhlIGNvbG9yIHRvIGJlIGZvdW5kXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICAgIHByaXZhdGUgdHJhY2tDb2xvcl8ocGl4ZWxzOiBVaW50OENsYW1wZWRBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNvbG9yOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciBjb2xvckZuID0gQ29sb3JUcmFja2VyLmtub3duQ29sb3JzXy5nZXQoY29sb3IpO1xyXG4gICAgICAgIHZhciBjdXJyR3JvdXAgPSBuZXcgSW50MzJBcnJheShwaXhlbHMubGVuZ3RoID4+IDIpO1xyXG4gICAgICAgIHZhciBjdXJyR3JvdXBTaXplO1xyXG4gICAgICAgIHZhciBjdXJySTtcclxuICAgICAgICB2YXIgY3Vycko7XHJcbiAgICAgICAgdmFyIGN1cnJXO1xyXG4gICAgICAgIHZhciBtYXJrZWQgPSBuZXcgSW50OEFycmF5KHBpeGVscy5sZW5ndGgpO1xyXG4gICAgICAgIHZhciBtaW5Hcm91cFNpemUgPSB0aGlzLmdldE1pbkdyb3VwU2l6ZSgpO1xyXG4gICAgICAgIHZhciBuZWlnaGJvdXJzVyA9IHRoaXMuZ2V0TmVpZ2hib3Vyc0ZvcldpZHRoXyh3aWR0aCk7XHJcbiAgICAgICAgLy8gQ2FjaGluZyBuZWlnaGJvdXIgaS9qIG9mZnNldCB2YWx1ZXMuXHJcbiAgICAgICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgdmFyIG5laWdoYm91cnNJID0gbmV3IEludDMyQXJyYXkoWy0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgLTFdKTtcclxuICAgICAgICB2YXIgbmVpZ2hib3Vyc0ogPSBuZXcgSW50MzJBcnJheShbMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMV0pO1xyXG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBJbnQzMkFycmF5KHBpeGVscy5sZW5ndGgpO1xyXG4gICAgICAgIHZhciBxdWV1ZVBvc2l0aW9uO1xyXG4gICAgICAgIHZhciByZXN1bHRzOiBhbnkgPSBbXTtcclxuICAgICAgICB2YXIgdyA9IC00O1xyXG5cclxuICAgICAgICBpZiAoIWNvbG9yRm4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdyArPSA0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtYXJrZWRbd10pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyR3JvdXBTaXplID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBxdWV1ZVBvc2l0aW9uID0gLTE7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gdztcclxuICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSBpO1xyXG4gICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IGo7XHJcblxyXG4gICAgICAgICAgICAgICAgbWFya2VkW3ddID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocXVldWVQb3NpdGlvbiA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyckogPSBxdWV1ZVtxdWV1ZVBvc2l0aW9uLS1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJJID0gcXVldWVbcXVldWVQb3NpdGlvbi0tXTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyVyA9IHF1ZXVlW3F1ZXVlUG9zaXRpb24tLV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2xvckZuKChwaXhlbHNbY3VyclddLCBwaXhlbHNbY3VyclcgKyAxXSwgcGl4ZWxzW2N1cnJXICsgMl0sIHBpeGVsc1tjdXJyVyArIDNdLCBjdXJyVyksIGN1cnJJLCBjdXJySikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyckdyb3VwW2N1cnJHcm91cFNpemUrK10gPSBjdXJySjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyckdyb3VwW2N1cnJHcm91cFNpemUrK10gPSBjdXJySTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbmVpZ2hib3Vyc1cubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdGhlclcgPSBjdXJyVyArIG5laWdoYm91cnNXW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVySSA9IGN1cnJJICsgbmVpZ2hib3Vyc0lba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXJKID0gY3VyckogKyBuZWlnaGJvdXJzSltrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWFya2VkW290aGVyV10gJiYgb3RoZXJJID49IDAgJiYgb3RoZXJJIDwgaGVpZ2h0ICYmIG90aGVySiA+PSAwICYmIG90aGVySiA8IHdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IG90aGVyVztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gb3RoZXJJO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSBvdGhlcko7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlZFtvdGhlclddID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3Vyckdyb3VwU2l6ZSA+PSBtaW5Hcm91cFNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YTogYW55ID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zXyhjdXJyR3JvdXAsIGN1cnJHcm91cFNpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2VSZWN0YW5nbGVzXyhyZXN1bHRzKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIERlZmF1bHQgY29sb3JzXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICAgICAgQ29sb3JUcmFja2VyLnJlZ2lzdGVyQ29sb3IoJ2N5YW4nLCAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdGhyZXNob2xkR3JlZW4gPSA1MCxcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZEJsdWUgPSA3MCxcclxuICAgICAgICAgICAgICAgIGR4ID0gciAtIDAsXHJcbiAgICAgICAgICAgICAgICBkeSA9IGcgLSAyNTUsXHJcbiAgICAgICAgICAgICAgICBkeiA9IGIgLSAyNTU7XHJcblxyXG4gICAgICAgICAgICBpZiAoKGcgLSByKSA+PSB0aHJlc2hvbGRHcmVlbiAmJiAoYiAtIHIpID49IHRocmVzaG9sZEJsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeSArIGR6ICogZHogPCA2NDAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBDb2xvclRyYWNrZXIucmVnaXN0ZXJDb2xvcignbWFnZW50YScsIGZ1bmN0aW9uIChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciB0aHJlc2hvbGQgPSA1MCxcclxuICAgICAgICAgICAgICAgIGR4ID0gciAtIDI1NSxcclxuICAgICAgICAgICAgICAgIGR5ID0gZyAtIDAsXHJcbiAgICAgICAgICAgICAgICBkeiA9IGIgLSAyNTU7XHJcblxyXG4gICAgICAgICAgICBpZiAoKHIgLSBnKSA+PSB0aHJlc2hvbGQgJiYgKGIgLSBnKSA+PSB0aHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeSArIGR6ICogZHogPCAxOTYwMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgQ29sb3JUcmFja2VyLnJlZ2lzdGVyQ29sb3IoJ3llbGxvdycsIGZ1bmN0aW9uIChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciB0aHJlc2hvbGQgPSA1MCxcclxuICAgICAgICAgICAgICAgIGR4ID0gciAtIDI1NSxcclxuICAgICAgICAgICAgICAgIGR5ID0gZyAtIDI1NSxcclxuICAgICAgICAgICAgICAgIGR6ID0gYiAtIDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoKHIgLSBiKSA+PSB0aHJlc2hvbGQgJiYgKGcgLSBiKSA+PSB0aHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeSArIGR6ICogZHogPCAxMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnRFbWl0dGVyIHV0aWxpdHkuXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgZXZlbnQgbGlzdGVuZXJzIHNjb3BlZCBieSBldmVudCB0eXBlLlxyXG4gICAgICogQHR5cGUge29iamVjdH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGV2ZW50c186IGFueSA9IG51bGw7XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0ZW5lcnMgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgZW1pdHRlciwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIGFkZExpc3RlbmVyKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzXyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIGV2ZW50LCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfW2V2ZW50XSkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c19bZXZlbnRdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmV2ZW50c19bZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gQXJyYXkgb2YgbGlzdGVuZXJzLlxyXG4gICAgICovXHJcbiAgICBsaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c18gJiYgdGhpcy5ldmVudHNfW2V2ZW50XTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIGluIG9yZGVyIHdpdGggdGhlIHN1cHBsaWVkIGFyZ3VtZW50cy5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHsqfSBvcHRfYXJncyBbYXJnMV0sIFthcmcyXSwgWy4uLl1cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBldmVudCBoYWQgbGlzdGVuZXJzLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4ub3B0X2FyZ3M6IGFueSkge1xyXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyhldmVudCk7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RlbmVycyBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgb24gPSB0aGlzLmFkZExpc3RlbmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIG9uZSB0aW1lIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQuIFRoaXMgbGlzdGVuZXIgaXMgaW52b2tlZCBvbmx5IHRoZVxyXG4gICAgICogbmV4dCB0aW1lIHRoZSBldmVudCBpcyBmaXJlZCwgYWZ0ZXIgd2hpY2ggaXQgaXMgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgb25jZShldmVudDogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vbihldmVudCwgZnVuY3Rpb24gaGFuZGxlckludGVybmFsKHRoaXM6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBoYW5kbGVySW50ZXJuYWwpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC4gSXQncyBub3QgYSBnb29kXHJcbiAgICAgKiBpZGVhIHRvIHJlbW92ZSBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkIGVsc2V3aGVyZSBpbiB0aGUgY29kZSxcclxuICAgICAqIGVzcGVjaWFsbHkgd2hlbiBpdCdzIG9uIGFuIGVtaXR0ZXIgdGhhdCB5b3UgZGlkbid0IGNyZWF0ZS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGVtaXR0ZXIsIHNvIGNhbGxzIGNhbiBiZSBjaGFpbmVkLlxyXG4gICAgICovXHJcbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMob3B0X2V2ZW50OiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzXykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdF9ldmVudCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNfW29wdF9ldmVudF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzXztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXHJcbiAgICAgKiBDYXV0aW9uOiBjaGFuZ2VzIGFycmF5IGluZGljZXMgaW4gdGhlIGxpc3RlbmVyIGFycmF5IGJlaGluZCB0aGUgbGlzdGVuZXIuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgZW1pdHRlciwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVyc1xyXG4gICAgICogYXJlIGFkZGVkIGZvciBhIHBhcnRpY3VsYXIgZXZlbnQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwc1xyXG4gICAgICogZmluZGluZyBtZW1vcnkgbGVha3MuIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbWF4aW11bSBudW1iZXIgb2YgbGlzdGVuZXJzLlxyXG4gICAgICovXHJcbiAgICBzZXRNYXhMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcclxuICAgIH07XHJcbn0iLCJleHBvcnQgY2xhc3MgSW1hZ2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbWFnZSB1dGlsaXR5LlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyBnYXVzc2lhbiBibHVyLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaWFtZXRlciBHYXVzc2lhbiBibHVyIGRpYW1ldGVyLCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAxLlxyXG4gICAgICogQHJldHVybiB7YXJyYXl9IFRoZSBlZGdlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgKi9cclxuICAgIGJsdXIocGl4ZWxzOiBGbG9hdDMyQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkaWFtZXRlcjogbnVtYmVyKSB7XHJcbiAgICAgICAgZGlhbWV0ZXIgPSBNYXRoLmFicyhkaWFtZXRlcik7XHJcbiAgICAgICAgaWYgKGRpYW1ldGVyIDw9IDEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaWFtZXRlciBzaG91bGQgYmUgZ3JlYXRlciB0aGFuIDEuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYWRpdXMgPSBkaWFtZXRlciAvIDI7XHJcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguY2VpbChkaWFtZXRlcikgKyAoMSAtIChNYXRoLmNlaWwoZGlhbWV0ZXIpICUgMikpO1xyXG4gICAgICAgIHZhciB3ZWlnaHRzID0gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xyXG4gICAgICAgIHZhciByaG8gPSAocmFkaXVzICsgMC41KSAvIDM7XHJcbiAgICAgICAgdmFyIHJob1NxID0gcmhvICogcmhvO1xyXG4gICAgICAgIHZhciBnYXVzc2lhbkZhY3RvciA9IDEgLyBNYXRoLnNxcnQoMiAqIE1hdGguUEkgKiByaG9TcSk7XHJcbiAgICAgICAgdmFyIHJob0ZhY3RvciA9IC0xIC8gKDIgKiByaG8gKiByaG8pO1xyXG4gICAgICAgIHZhciB3c3VtID0gMDtcclxuICAgICAgICB2YXIgbWlkZGxlID0gTWF0aC5mbG9vcihsZW4gLyAyKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gaSAtIG1pZGRsZTtcclxuICAgICAgICAgICAgdmFyIGd4ID0gZ2F1c3NpYW5GYWN0b3IgKiBNYXRoLmV4cCh4ICogeCAqIHJob0ZhY3Rvcik7XHJcbiAgICAgICAgICAgIHdlaWdodHNbaV0gPSBneDtcclxuICAgICAgICAgICAgd3N1bSArPSBneDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3ZWlnaHRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHdlaWdodHNbal0gLz0gd3N1bTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VwYXJhYmxlQ29udm9sdmUocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCB3ZWlnaHRzLCB3ZWlnaHRzLCBmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIGludGVncmFsIGltYWdlIGZvciBzdW1tZWQsIHNxdWFyZWQsIHJvdGF0ZWQgYW5kIHNvYmVsIHBpeGVscy5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHBpeGVscyBUaGUgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkgdG8gbG9vcFxyXG4gICAgICogICAgIHRocm91Z2guXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gb3B0X2ludGVncmFsSW1hZ2UgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvXHJcbiAgICAgKiAgICAgYmUgZmlsbGVkIHdpdGggdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bVxyXG4gICAgICogICAgIHZhbHVlcyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRfaW50ZWdyYWxJbWFnZVNxdWFyZSBFbXB0eSBhcnJheSBvZiBzaXplIGB3aWR0aCAqXHJcbiAgICAgKiAgICAgaGVpZ2h0YCB0byBiZSBmaWxsZWQgd2l0aCB0aGUgaW50ZWdyYWwgaW1hZ2Ugc3F1YXJlZCB2YWx1ZXMuIElmIG5vdFxyXG4gICAgICogICAgIHNwZWNpZmllZCBjb21wdXRlIHNxdWFyZWQgdmFsdWVzIHdpbGwgYmUgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlIEVtcHR5IGFycmF5IG9mIHNpemUgYHdpZHRoICpcclxuICAgICAqICAgICBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoIHRoZSByb3RhdGVkIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90XHJcbiAgICAgKiAgICAgc3BlY2lmaWVkIGNvbXB1dGUgc3VtIHZhbHVlcyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRfaW50ZWdyYWxJbWFnZVNvYmVsIEVtcHR5IGFycmF5IG9mIHNpemUgYHdpZHRoICpcclxuICAgICAqICAgICBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoIHRoZSBpbnRlZ3JhbCBpbWFnZSBvZiBzb2JlbCB2YWx1ZXMuIElmIG5vdFxyXG4gICAgICogICAgIHNwZWNpZmllZCBjb21wdXRlIHNvYmVsIGZpbHRlcmluZyB3aWxsIGJlIHNraXBwZWQuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKi9cclxuICAgIGNvbXB1dGVJbnRlZ3JhbEltYWdlKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBvcHRfaW50ZWdyYWxJbWFnZTogYW55LCBvcHRfaW50ZWdyYWxJbWFnZVNxdWFyZTogYW55LCBvcHRfdGlsdGVkSW50ZWdyYWxJbWFnZTogYW55LCBvcHRfaW50ZWdyYWxJbWFnZVNvYmVsOiBhbnkpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2hvdWxkIHNwZWNpZnkgYXQgbGVhc3Qgb25lIG91dHB1dCBhcnJheSBpbiB0aGUgb3JkZXI6IHN1bSwgc3F1YXJlLCB0aWx0ZWQsIHNvYmVsLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGl4ZWxzU29iZWw7XHJcbiAgICAgICAgaWYgKG9wdF9pbnRlZ3JhbEltYWdlU29iZWwpIHtcclxuICAgICAgICAgICAgcGl4ZWxzU29iZWwgPSB0aGlzLnNvYmVsKHBpeGVscywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IGkgKiB3aWR0aCAqIDQgKyBqICogNDtcclxuICAgICAgICAgICAgICAgIHZhciBwaXhlbCA9IH5+KHBpeGVsc1t3XSAqIDAuMjk5ICsgcGl4ZWxzW3cgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cgKyAyXSAqIDAuMTE0KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRfaW50ZWdyYWxJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBpeGVsVmFsdWVTQVRfKG9wdF9pbnRlZ3JhbEltYWdlLCB3aWR0aCwgaSwgaiwgcGl4ZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF9pbnRlZ3JhbEltYWdlU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVNBVF8ob3B0X2ludGVncmFsSW1hZ2VTcXVhcmUsIHdpZHRoLCBpLCBqLCBwaXhlbCAqIHBpeGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRfdGlsdGVkSW50ZWdyYWxJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3MSA9IHcgLSB3aWR0aCAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBpeGVsQWJvdmUgPSB+fihwaXhlbHNbdzFdICogMC4yOTkgKyBwaXhlbHNbdzEgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cxICsgMl0gKiAwLjExNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVJTQVRfKG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlLCB3aWR0aCwgaSwgaiwgcGl4ZWwsIHBpeGVsQWJvdmUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0X2ludGVncmFsSW1hZ2VTb2JlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBpeGVsVmFsdWVTQVRfKG9wdF9pbnRlZ3JhbEltYWdlU29iZWwsIHdpZHRoLCBpLCBqLCBwaXhlbHNTb2JlbFt3XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIG1ldGhvZCB0byBjb21wdXRlIHRoZSByb3RhdGVkIHN1bW1lZCBhcmVhIHRhYmxlIChSU0FUKSBieSB0aGVcclxuICAgICAqIGZvcm11bGE6XHJcbiAgICAgKlxyXG4gICAgICogUlNBVCh4LCB5KSA9IFJTQVQoeC0xLCB5LTEpICsgUlNBVCh4KzEsIHktMSkgLSBSU0FUKHgsIHktMikgKyBJKHgsIHkpICsgSSh4LCB5LTEpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IFJTQVQgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoXHJcbiAgICAgKiAgICAgdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bSB2YWx1ZXMgd2lsbCBiZVxyXG4gICAgICogICAgIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaSBWZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGogSG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpeGVsIFBpeGVsIHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBpbnRlZ3JhbCBpbWFnZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY29tcHV0ZVBpeGVsVmFsdWVSU0FUXyhSU0FUOiBudW1iZXJbXSwgd2lkdGg6IG51bWJlciwgaTogbnVtYmVyLCBqOiBudW1iZXIsIHBpeGVsOiBudW1iZXIsIHBpeGVsQWJvdmU6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB3ID0gaSAqIHdpZHRoICsgajtcclxuICAgICAgICBSU0FUW3ddID0gKFJTQVRbdyAtIHdpZHRoIC0gMV0gfHwgMCkgKyAoUlNBVFt3IC0gd2lkdGggKyAxXSB8fCAwKSAtIChSU0FUW3cgLSB3aWR0aCAtIHdpZHRoXSB8fCAwKSArIHBpeGVsICsgcGl4ZWxBYm92ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGNvbXB1dGUgdGhlIHN1bW1lZCBhcmVhIHRhYmxlIChTQVQpIGJ5IHRoZSBmb3JtdWxhOlxyXG4gICAgICpcclxuICAgICAqIFNBVCh4LCB5KSA9IFNBVCh4LCB5LTEpICsgU0FUKHgtMSwgeSkgKyBJKHgsIHkpIC0gU0FUKHgtMSwgeS0xKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBTQVQgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKiBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoXHJcbiAgICAgKiAgICAgdGhlIGludGVncmFsIGltYWdlIHZhbHVlcy4gSWYgbm90IHNwZWNpZmllZCBjb21wdXRlIHN1bSB2YWx1ZXMgd2lsbCBiZVxyXG4gICAgICogICAgIHNraXBwZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaSBWZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGogSG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgcGl4ZWwgdG8gYmUgZXZhbHVhdGVkLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpeGVsIFBpeGVsIHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBpbnRlZ3JhbCBpbWFnZS5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbXB1dGVQaXhlbFZhbHVlU0FUXyhTQVQ6IG51bWJlcltdLCB3aWR0aDogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgcGl4ZWw6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB3ID0gaSAqIHdpZHRoICsgajtcclxuICAgICAgICBTQVRbd10gPSAoU0FUW3cgLSB3aWR0aF0gfHwgMCkgKyAoU0FUW3cgLSAxXSB8fCAwKSArIHBpeGVsIC0gKFNBVFt3IC0gd2lkdGggLSAxXSB8fCAwKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIGNvbG9yIGZyb20gYSBjb2xvcnNwYWNlIGJhc2VkIG9uIGFuIFJHQiBjb2xvciBtb2RlbCB0byBhXHJcbiAgICAgKiBncmF5c2NhbGUgcmVwcmVzZW50YXRpb24gb2YgaXRzIGx1bWluYW5jZS4gVGhlIGNvZWZmaWNpZW50cyByZXByZXNlbnQgdGhlXHJcbiAgICAgKiBtZWFzdXJlZCBpbnRlbnNpdHkgcGVyY2VwdGlvbiBvZiB0eXBpY2FsIHRyaWNocm9tYXQgaHVtYW5zLCBpblxyXG4gICAgICogcGFydGljdWxhciwgaHVtYW4gdmlzaW9uIGlzIG1vc3Qgc2Vuc2l0aXZlIHRvIGdyZWVuIGFuZCBsZWFzdCBzZW5zaXRpdmVcclxuICAgICAqIHRvIGJsdWUuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZpbGxSR0JBIElmIHRoZSByZXN1bHQgc2hvdWxkIGZpbGwgYWxsIFJHQkEgdmFsdWVzIHdpdGggdGhlIGdyYXkgc2NhbGVcclxuICAgICAqICB2YWx1ZXMsIGluc3RlYWQgb2YgcmV0dXJuaW5nIGEgc2luZ2xlIHZhbHVlIHBlciBwaXhlbC5cclxuICAgICAqIEBwYXJhbSB7VWludDhDbGFtcGVkQXJyYXl9IFRoZSBncmF5c2NhbGUgcGl4ZWxzIGluIGEgbGluZWFyIGFycmF5IChbcCxwLHAsYSwuLi5dIGlmIGZpbGxSR0JBXHJcbiAgICAgKiAgaXMgdHJ1ZSBhbmQgW3AxLCBwMiwgcDMsIC4uLl0gaWYgZmlsbFJHQkEgaXMgZmFsc2UpLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ3JheXNjYWxlKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBmaWxsUkdCQTogYm9vbGVhbik6IFVpbnQ4Q2xhbXBlZEFycmF5IHtcclxuICAgICAgICB2YXIgZ3JheSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShmaWxsUkdCQSA/IHBpeGVscy5sZW5ndGggOiBwaXhlbHMubGVuZ3RoID4+IDIpO1xyXG4gICAgICAgIHZhciBwID0gMDtcclxuICAgICAgICB2YXIgdyA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBpeGVsc1t3XSAqIDAuMjk5ICsgcGl4ZWxzW3cgKyAxXSAqIDAuNTg3ICsgcGl4ZWxzW3cgKyAyXSAqIDAuMTE0O1xyXG4gICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGxSR0JBKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JheVtwKytdID0gcGl4ZWxzW3cgKyAzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB3ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYXk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFzdCBob3Jpem9udGFsIHNlcGFyYWJsZSBjb252b2x1dGlvbi4gQSBwb2ludCBzcHJlYWQgZnVuY3Rpb24gKFBTRikgaXNcclxuICAgICAqIHNhaWQgdG8gYmUgc2VwYXJhYmxlIGlmIGl0IGNhbiBiZSBicm9rZW4gaW50byB0d28gb25lLWRpbWVuc2lvbmFsXHJcbiAgICAgKiBzaWduYWxzOiBhIHZlcnRpY2FsIGFuZCBhIGhvcml6b250YWwgcHJvamVjdGlvbi4gVGhlIGNvbnZvbHV0aW9uIGlzXHJcbiAgICAgKiBwZXJmb3JtZWQgYnkgc2xpZGluZyB0aGUga2VybmVsIG92ZXIgdGhlIGltYWdlLCBnZW5lcmFsbHkgc3RhcnRpbmcgYXQgdGhlXHJcbiAgICAgKiB0b3AgbGVmdCBjb3JuZXIsIHNvIGFzIHRvIG1vdmUgdGhlIGtlcm5lbCB0aHJvdWdoIGFsbCB0aGUgcG9zaXRpb25zIHdoZXJlXHJcbiAgICAgKiB0aGUga2VybmVsIGZpdHMgZW50aXJlbHkgd2l0aGluIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBpbWFnZS4gQWRhcHRlZCBmcm9tXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB3ZWlnaHRzVmVjdG9yIFRoZSB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIGhvcml6b250YWxDb252b2x2ZShwaXhlbHM6IEZsb2F0MzJBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHdlaWdodHNWZWN0b3I6IEZsb2F0MzJBcnJheSwgb3BhcXVlOiBib29sZWFuKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICB2YXIgc2lkZSA9IHdlaWdodHNWZWN0b3IubGVuZ3RoO1xyXG4gICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbiAgICAgICAgdmFyIGFscGhhRmFjID0gb3BhcXVlID8gMSA6IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3kgPSB5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAoeSAqIHdpZHRoICsgeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY3ggPSAwOyBjeCA8IHNpZGU7IGN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2N5ID0gc3k7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjeCA9IE1hdGgubWluKHdpZHRoIC0gMSwgTWF0aC5tYXgoMCwgc3ggKyBjeCAtIGhhbGZTaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvZmZzZXQgPSAoc2N5ICogd2lkdGggKyBzY3gpICogNDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3QgPSB3ZWlnaHRzVmVjdG9yW2N4XTtcclxuICAgICAgICAgICAgICAgICAgICByICs9IHBpeGVsc1twb2Zmc2V0XSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGcgKz0gcGl4ZWxzW3BvZmZzZXQgKyAxXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGIgKz0gcGl4ZWxzW3BvZmZzZXQgKyAyXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgIGEgKz0gcGl4ZWxzW3BvZmZzZXQgKyAzXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldF0gPSByO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDFdID0gZztcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgM10gPSBhICsgYWxwaGFGYWMgKiAoMjU1IC0gYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGYXN0IHZlcnRpY2FsIHNlcGFyYWJsZSBjb252b2x1dGlvbi4gQSBwb2ludCBzcHJlYWQgZnVuY3Rpb24gKFBTRikgaXNcclxuICAgICAqIHNhaWQgdG8gYmUgc2VwYXJhYmxlIGlmIGl0IGNhbiBiZSBicm9rZW4gaW50byB0d28gb25lLWRpbWVuc2lvbmFsXHJcbiAgICAgKiBzaWduYWxzOiBhIHZlcnRpY2FsIGFuZCBhIGhvcml6b250YWwgcHJvamVjdGlvbi4gVGhlIGNvbnZvbHV0aW9uIGlzXHJcbiAgICAgKiBwZXJmb3JtZWQgYnkgc2xpZGluZyB0aGUga2VybmVsIG92ZXIgdGhlIGltYWdlLCBnZW5lcmFsbHkgc3RhcnRpbmcgYXQgdGhlXHJcbiAgICAgKiB0b3AgbGVmdCBjb3JuZXIsIHNvIGFzIHRvIG1vdmUgdGhlIGtlcm5lbCB0aHJvdWdoIGFsbCB0aGUgcG9zaXRpb25zIHdoZXJlXHJcbiAgICAgKiB0aGUga2VybmVsIGZpdHMgZW50aXJlbHkgd2l0aGluIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBpbWFnZS4gQWRhcHRlZCBmcm9tXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB3ZWlnaHRzVmVjdG9yIFRoZSB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHZlcnRpY2FsQ29udm9sdmUocGl4ZWxzOiBGbG9hdDMyQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCB3ZWlnaHRzVmVjdG9yOiBGbG9hdDMyQXJyYXksIG9wYXF1ZTogYm9vbGVhbik6IEZsb2F0MzJBcnJheSB7XHJcbiAgICAgICAgdmFyIHNpZGUgPSB3ZWlnaHRzVmVjdG9yLmxlbmd0aDtcclxuICAgICAgICB2YXIgaGFsZlNpZGUgPSBNYXRoLmZsb29yKHNpZGUgLyAyKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG4gICAgICAgIHZhciBhbHBoYUZhYyA9IG9wYXF1ZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN5ID0geTtcclxuICAgICAgICAgICAgICAgIHZhciBzeCA9IHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gKHkgKiB3aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgICAgIHZhciByID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBnID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGN5ID0gMDsgY3kgPCBzaWRlOyBjeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjeSA9IE1hdGgubWluKGhlaWdodCAtIDEsIE1hdGgubWF4KDAsIHN5ICsgY3kgLSBoYWxmU2lkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3ggPSBzeDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9mZnNldCA9IChzY3kgKiB3aWR0aCArIHNjeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3dCA9IHdlaWdodHNWZWN0b3JbY3ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHIgKz0gcGl4ZWxzW3BvZmZzZXRdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgZyArPSBwaXhlbHNbcG9mZnNldCArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYiArPSBwaXhlbHNbcG9mZnNldCArIDJdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYSArPSBwaXhlbHNbcG9mZnNldCArIDNdICogd3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0XSA9IHI7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDJdID0gYjtcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAzXSA9IGEgKyBhbHBoYUZhYyAqICgyNTUgLSBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhc3Qgc2VwYXJhYmxlIGNvbnZvbHV0aW9uLiBBIHBvaW50IHNwcmVhZCBmdW5jdGlvbiAoUFNGKSBpcyBzYWlkIHRvIGJlXHJcbiAgICAgKiBzZXBhcmFibGUgaWYgaXQgY2FuIGJlIGJyb2tlbiBpbnRvIHR3byBvbmUtZGltZW5zaW9uYWwgc2lnbmFsczogYVxyXG4gICAgICogdmVydGljYWwgYW5kIGEgaG9yaXpvbnRhbCBwcm9qZWN0aW9uLiBUaGUgY29udm9sdXRpb24gaXMgcGVyZm9ybWVkIGJ5XHJcbiAgICAgKiBzbGlkaW5nIHRoZSBrZXJuZWwgb3ZlciB0aGUgaW1hZ2UsIGdlbmVyYWxseSBzdGFydGluZyBhdCB0aGUgdG9wIGxlZnRcclxuICAgICAqIGNvcm5lciwgc28gYXMgdG8gbW92ZSB0aGUga2VybmVsIHRocm91Z2ggYWxsIHRoZSBwb3NpdGlvbnMgd2hlcmUgdGhlXHJcbiAgICAgKiBrZXJuZWwgZml0cyBlbnRpcmVseSB3aXRoaW4gdGhlIGJvdW5kYXJpZXMgb2YgdGhlIGltYWdlLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGhvcml6V2VpZ2h0cyBUaGUgaG9yaXpvbnRhbCB3ZWlnaHRpbmcgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB2ZXJ0V2VpZ2h0cyBUaGUgdmVydGljYWwgdmVjdG9yLCBlLmcgWy0xLDAsMV0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhcXVlXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGNvbnZvbHV0ZWQgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHNlcGFyYWJsZUNvbnZvbHZlKHBpeGVsczogRmxvYXQzMkFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaG9yaXpXZWlnaHRzOiBGbG9hdDMyQXJyYXksIHZlcnRXZWlnaHRzOiBGbG9hdDMyQXJyYXksIG9wYXF1ZT86IGJvb2xlYW4pOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHZhciB2ZXJ0aWNhbCA9IHRoaXMudmVydGljYWxDb252b2x2ZShwaXhlbHMsIHdpZHRoLCBoZWlnaHQsIHZlcnRXZWlnaHRzLCBvcGFxdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhvcml6b250YWxDb252b2x2ZSh2ZXJ0aWNhbCwgd2lkdGgsIGhlaWdodCwgaG9yaXpXZWlnaHRzLCBvcGFxdWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGUgaW1hZ2UgZWRnZXMgdXNpbmcgU29iZWwgb3BlcmF0b3IuIENvbXB1dGVzIHRoZSB2ZXJ0aWNhbCBhbmRcclxuICAgICAqIGhvcml6b250YWwgZ3JhZGllbnRzIG9mIHRoZSBpbWFnZSBhbmQgY29tYmluZXMgdGhlIGNvbXB1dGVkIGltYWdlcyB0b1xyXG4gICAgICogZmluZCBlZGdlcyBpbiB0aGUgaW1hZ2UuIFRoZSB3YXkgd2UgaW1wbGVtZW50IHRoZSBTb2JlbCBmaWx0ZXIgaGVyZSBpcyBieVxyXG4gICAgICogZmlyc3QgZ3JheXNjYWxpbmcgdGhlIGltYWdlLCB0aGVuIHRha2luZyB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWxcclxuICAgICAqIGdyYWRpZW50cyBhbmQgZmluYWxseSBjb21iaW5pbmcgdGhlIGdyYWRpZW50IGltYWdlcyB0byBtYWtlIHVwIHRoZSBmaW5hbFxyXG4gICAgICogaW1hZ2UuIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20va2lnL2NhbnZhc2ZpbHRlcnMuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGVkZ2UgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHNvYmVsKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICB2YXIgX3BpeGVsczogRmxvYXQzMkFycmF5ID0gPEZsb2F0MzJBcnJheT48dW5rbm93bj5JbWFnZS5ncmF5c2NhbGUocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCB0cnVlKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG4gICAgICAgIHZhciBzb2JlbFNpZ25WZWN0b3IgPSBuZXcgRmxvYXQzMkFycmF5KFstMSwgMCwgMV0pO1xyXG4gICAgICAgIHZhciBzb2JlbFNjYWxlVmVjdG9yID0gbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMV0pO1xyXG4gICAgICAgIHZhciB2ZXJ0aWNhbCA9IHRoaXMuc2VwYXJhYmxlQ29udm9sdmUoX3BpeGVscywgd2lkdGgsIGhlaWdodCwgc29iZWxTaWduVmVjdG9yLCBzb2JlbFNjYWxlVmVjdG9yKTtcclxuICAgICAgICB2YXIgaG9yaXpvbnRhbCA9IHRoaXMuc2VwYXJhYmxlQ29udm9sdmUoX3BpeGVscywgd2lkdGgsIGhlaWdodCwgc29iZWxTY2FsZVZlY3Rvciwgc29iZWxTaWduVmVjdG9yKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgdmFyIHYgPSB2ZXJ0aWNhbFtpXTtcclxuICAgICAgICAgICAgdmFyIGggPSBob3Jpem9udGFsW2ldO1xyXG4gICAgICAgICAgICB2YXIgcCA9IE1hdGguc3FydChoICogaCArIHYgKiB2KTtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gcDtcclxuICAgICAgICAgICAgb3V0cHV0W2kgKyAxXSA9IHA7XHJcbiAgICAgICAgICAgIG91dHB1dFtpICsgMl0gPSBwO1xyXG4gICAgICAgICAgICBvdXRwdXRbaSArIDNdID0gMjU1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFcXVhbGl6ZXMgdGhlIGhpc3RvZ3JhbSBvZiBhIGdyYXlzY2FsZSBpbWFnZSwgbm9ybWFsaXppbmcgdGhlXHJcbiAgICAgKiBicmlnaHRuZXNzIGFuZCBpbmNyZWFzaW5nIHRoZSBjb250cmFzdCBvZiB0aGUgaW1hZ2UuXHJcbiAgICAgKiBAcGFyYW0ge3BpeGVsc30gcGl4ZWxzIFRoZSBncmF5c2NhbGUgcGl4ZWxzIGluIGEgbGluZWFyIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgZXF1YWxpemVkIGdyYXlzY2FsZSBwaXhlbHMgaW4gYSBsaW5lYXIgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIGVxdWFsaXplSGlzdChwaXhlbHM6IFVpbnQ4Q2xhbXBlZEFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBlcXVhbGl6ZWQgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkocGl4ZWxzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIHZhciBoaXN0b2dyYW0gPSBuZXcgQXJyYXkoMjU2KTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSBoaXN0b2dyYW1baV0gPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBlcXVhbGl6ZWRbaV0gPSBwaXhlbHNbaV07XHJcbiAgICAgICAgICAgIGhpc3RvZ3JhbVtwaXhlbHNbaV1dKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldiA9IGhpc3RvZ3JhbVswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGhpc3RvZ3JhbVtpXSArPSBwcmV2O1xyXG4gICAgICAgICAgICBwcmV2ID0gaGlzdG9ncmFtW2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vcm0gPSAyNTUgLyBwaXhlbHMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGl4ZWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBlcXVhbGl6ZWRbaV0gPSAoaGlzdG9ncmFtW3BpeGVsc1tpXV0gKiBub3JtICsgMC41KSB8IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBlcXVhbGl6ZWQ7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgTWF0aCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgYSByZWN0YW5nbGUgaW50ZXJzZWN0cyB3aXRoIGFub3RoZXIuXHJcbiAgICAgKlxyXG4gICAgICogIDxwcmU+XHJcbiAgICAgKiAgeDB5MCAtLS0tLS0tLSAgICAgICB4MnkyIC0tLS0tLS0tXHJcbiAgICAgKiAgICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICB8XHJcbiAgICAgKiAgICAgIC0tLS0tLS0tIHgxeTEgICAgICAgLS0tLS0tLS0geDN5M1xyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAwLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgxIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MSBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAxLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgyIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MiBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgzIEhvcml6b250YWwgY29vcmRpbmF0ZSBvZiBQMy5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MyBWZXJ0aWNhbCBjb29yZGluYXRlIG9mIFAzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGludGVyc2VjdFJlY3QoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhKHgyID4geDEgfHwgeDMgPCB4MCB8fCB5MiA+IHkxIHx8IHkzIDwgeTApO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCIuL0V2ZW50RW1pdHRlclwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRyYWNrZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH07XHJcbiAgICBhYnN0cmFjdCB0cmFjayhlbGVtZW50OiBhbnksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogYW55O1xyXG59IiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XHJcbmltcG9ydCB7IFRyYWNrZXIgfSBmcm9tIFwiLi9UcmFja2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2tlclRhc2sgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IodHJhY2tlcjogVHJhY2tlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKCF0cmFja2VyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlciBpbnN0YW5jZSBub3Qgc3BlY2lmaWVkLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRUcmFja2VyKHRyYWNrZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhvbGRzIHRoZSB0cmFja2VyIGluc3RhbmNlIG1hbmFnZWQgYnkgdGhpcyB0YXNrLlxyXG4gICAgICogQHR5cGUge1RyYWNrZXJ9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyYWNrZXJfOiBUcmFja2VyID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhvbGRzIGlmIHRoZSB0cmFja2VyIHRhc2sgaXMgaW4gcnVubmluZy5cclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBydW5uaW5nXyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdHJhY2tlciBpbnN0YW5jZSBtYW5hZ2VkIGJ5IHRoaXMgdGFzay5cclxuICAgICAqIEByZXR1cm4ge1RyYWNrZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldFRyYWNrZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhY2tlcl87XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmFja2VyIHRhc2sgaXMgaW4gcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5SdW5uaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bm5pbmdfO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgaWYgdGhlIHRyYWNrZXIgdGFzayBpcyBpbiBydW5uaW5nLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBydW5uaW5nXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFJ1bm5pbmcocnVubmluZzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucnVubmluZ18gPSBydW5uaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRyYWNrZXIgaW5zdGFuY2UgbWFuYWdlZCBieSB0aGlzIHRhc2suXHJcbiAgICAgKiBAcmV0dXJuIHtUcmFja2VyfVxyXG4gICAgICovXHJcbiAgICBzZXRUcmFja2VyKHRyYWNrZXI6IFRyYWNrZXIpIHtcclxuICAgICAgICB0aGlzLnRyYWNrZXJfID0gdHJhY2tlcjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbWl0cyBhIGBydW5gIGV2ZW50IG9uIHRoZSB0cmFja2VyIHRhc2sgZm9yIHRoZSBpbXBsZW1lbnRlcnMgdG8gcnVuIGFueVxyXG4gICAgICogY2hpbGQgYWN0aW9uLCBlLmcuIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGl0c2VsZiwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmluUnVubmluZygpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UnVubmluZyh0cnVlKTtcclxuICAgICAgICBjb25zdCByZWVtaXRUcmFja0V2ZW50XyA9IGZ1bmN0aW9uIChldmVudDogYW55KSB7XHJcbiAgICAgICAgICAgIHNlbGYuZW1pdCgndHJhY2snLCBldmVudCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRyYWNrZXJfLm9uKCd0cmFjaycsIHJlZW1pdFRyYWNrRXZlbnRfKTtcclxuICAgICAgICB0aGlzLmVtaXQoJ3J1bicpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVtaXRzIGEgYHN0b3BgIGV2ZW50IG9uIHRoZSB0cmFja2VyIHRhc2sgZm9yIHRoZSBpbXBsZW1lbnRlcnMgdG8gc3RvcCBhbnlcclxuICAgICAqIGNoaWxkIGFjdGlvbiBiZWluZyBkb25lLCBlLmcuIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGl0c2VsZiwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmluUnVubmluZygpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldFJ1bm5pbmcoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZW1pdCgnc3RvcCcpO1xyXG4gICAgICAgIGNvbnN0IHJlZW1pdFRyYWNrRXZlbnRfID0gZnVuY3Rpb24gKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICAgICAgc2VsZi5lbWl0KCd0cmFjaycsIGV2ZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudHJhY2tlcl8ucmVtb3ZlTGlzdGVuZXIoJ3RyYWNrJywgcmVlbWl0VHJhY2tFdmVudF8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBfRXZlbnRFbWl0dGVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInXHJcbmltcG9ydCB7IENhbnZhcyBhcyBfQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnXHJcbmltcG9ydCB7IEltYWdlIGFzIF9JbWFnZSB9IGZyb20gJy4vSW1hZ2UnXHJcbmltcG9ydCB7IFRyYWNrZXIgfSBmcm9tICcuL1RyYWNrZXInXHJcbmltcG9ydCB7IFRyYWNrZXJUYXNrIH0gZnJvbSAnLi9UcmFja2VyVGFzaydcclxuaW1wb3J0IHsgQ29sb3JUcmFja2VyIGFzIF9Db2xvclRyYWNrZXIgfSBmcm9tICcuL0NvbG9yVHJhY2tlcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNraW5nIHtcclxuXHJcbiAgICBzdGF0aWMgRXZlbnRFbWl0dGVyOiB0eXBlb2YgX0V2ZW50RW1pdHRlcjtcclxuICAgIHN0YXRpYyBDYW52YXM6IHR5cGVvZiBfQ2FudmFzO1xyXG4gICAgc3RhdGljIEltYWdlOiB0eXBlb2YgX0ltYWdlO1xyXG4gICAgc3RhdGljIENvbG9yVHJhY2tlcjogdHlwZW9mIF9Db2xvclRyYWNrZXI7XHJcblxyXG4gICAgc3RhdGljIGdyYXlzY2FsZTogdHlwZW9mIF9JbWFnZS5ncmF5c2NhbGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBDYXB0dXJlcyB0aGUgdXNlciBjYW1lcmEgd2hlbiB0cmFja2luZyBhIHZpZGVvIGVsZW1lbnQgYW5kIHNldCBpdHMgc291cmNlXHJcbiAgICAqIHRvIHRoZSBjYW1lcmEgc3RyZWFtLlxyXG4gICAgKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IGVsZW1lbnQgQ2FudmFzIGVsZW1lbnQgdG8gdHJhY2suXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgKi9cclxuICAgIGluaXRVc2VyTWVkaWFfKGVsZW1lbnQ6IEhUTUxWaWRlb0VsZW1lbnQsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcclxuICAgICAgICAgICAgdmlkZW86IHRydWUsXHJcbiAgICAgICAgICAgIGF1ZGlvOiAob3B0X29wdGlvbnMgJiYgb3B0X29wdGlvbnMuYXVkaW8pID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgY2FwdHVyZSB1c2VyIGNhbWVyYS4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIFRlc3RzIHdoZXRoZXIgdGhlIG9iamVjdCBpcyBhIGRvbSBub2RlLlxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gbyBPYmplY3QgdG8gYmUgdGVzdGVkLlxyXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBvYmplY3QgaXMgYSBkb20gbm9kZS5cclxuICAgICovXHJcbiAgICBpc05vZGUobzogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG8ubm9kZVR5cGUgfHwgdGhpcy5pc1dpbmRvdyhvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogVGVzdHMgd2hldGhlciB0aGUgb2JqZWN0IGlzIHRoZSBgd2luZG93YCBvYmplY3QuXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvIE9iamVjdCB0byBiZSB0ZXN0ZWQuXHJcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG9iamVjdCBpcyB0aGUgYHdpbmRvd2Agb2JqZWN0LlxyXG4gICAgKi9cclxuICAgIGlzV2luZG93KG86IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIShvICYmIG8uYWxlcnQgJiYgby5kb2N1bWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VsZWN0cyBhIGRvbSBub2RlIGZyb20gYSBDU1MzIHNlbGVjdG9yIHVzaW5nIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcclxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X2VsZW1lbnQgVGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIHF1ZXJ5LiBXaGVuIG5vdFxyXG4gICAqICAgICBzcGVjaWZpZWQgYGRvY3VtZW50YCBpcyB1c2VkIGFzIHJvb3QgZWxlbWVudC5cclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gVGhlIGZpcnN0IGRvbSBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0byB0aGUgc2VsZWN0b3IuXHJcbiAgICogICAgIElmIG5vdCBmb3VuZCwgcmV0dXJucyBgbnVsbGAuXHJcbiAgICovXHJcbiAgICBvbmUoc2VsZWN0b3I6IEhUTUxFbGVtZW50LCBvcHRfZWxlbWVudD86IGFueSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5pc05vZGUoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChvcHRfZWxlbWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgY2FudmFzLCBpbWFnZSBvciB2aWRlbyBlbGVtZW50IGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgYHRyYWNrZXJgXHJcbiAgICAgKiBpbnN0YW5jZS4gVGhpcyBtZXRob2QgZXh0cmFjdCB0aGUgcGl4ZWwgaW5mb3JtYXRpb24gb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqIHRvIHBhc3MgdG8gdGhlIGB0cmFja2VyYCBpbnN0YW5jZS4gV2hlbiB0cmFja2luZyBhIHZpZGVvLCB0aGVcclxuICAgICAqIGB0cmFja2VyLnRyYWNrKHBpeGVscywgd2lkdGgsIGhlaWdodClgIHdpbGwgYmUgaW4gYVxyXG4gICAgICogYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgbG9vcCBpbiBvcmRlciB0byB0cmFjayBhbGwgdmlkZW8gZnJhbWVzLlxyXG4gICAgICpcclxuICAgICAqIEV4YW1wbGU6XHJcbiAgICAgKiB2YXIgdHJhY2tlciA9IG5ldyB0cmFja2luZy5Db2xvclRyYWNrZXIoKTtcclxuICAgICAqXHJcbiAgICAgKiB0cmFja2luZy50cmFjaygnI3ZpZGVvJywgdHJhY2tlcik7XHJcbiAgICAgKiBvclxyXG4gICAgICogdHJhY2tpbmcudHJhY2soJyN2aWRlbycsIHRyYWNrZXIsIHsgY2FtZXJhOiB0cnVlIH0pO1xyXG4gICAgICpcclxuICAgICAqIHRyYWNrZXIub24oJ3RyYWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAqICAgLy8gY29uc29sZS5sb2coZXZlbnQuZGF0YVswXS54LCBldmVudC5kYXRhWzBdLnkpXHJcbiAgICAgKiB9KTtcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHRyYWNrLCBjYW52YXMsIGltYWdlIG9yXHJcbiAgICAgKiAgICAgdmlkZW8uXHJcbiAgICAgKiBAcGFyYW0ge1RyYWNrZXJ9IHRyYWNrZXIgVGhlIHRyYWNrZXIgaW5zdGFuY2UgdXNlZCB0byB0cmFjayB0aGVcclxuICAgICAqICAgICBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdF9vcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHRyYWNrZXIuXHJcbiAgICAgKi9cclxuICAgIHRyYWNrKGVsZW1lbnQ6IGFueSwgdHJhY2tlcjogVHJhY2tlciwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgICAgICBlbGVtZW50ID0gdGhpcy5vbmUoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZm91bmQsIHRyeSBhIGRpZmZlcmVudCBlbGVtZW50IG9yIHNlbGVjdG9yLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRyYWNrZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VyIG5vdCBzcGVjaWZpZWQsIHRyeSBgdHJhY2tpbmcudHJhY2soZWxlbWVudCwgbmV3IHRyYWNraW5nLkZhY2VUcmFja2VyKCkpYC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NhbnZhcyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0NhbnZhc18oZWxlbWVudCwgdHJhY2tlciwgb3B0X29wdGlvbnMpO1xyXG4gICAgICAgICAgICBjYXNlICdpbWcnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2tJbWdfKGVsZW1lbnQsIHRyYWNrZXIsIG9wdF9vcHRpb25zKTtcclxuICAgICAgICAgICAgY2FzZSAndmlkZW8nOlxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF9vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdF9vcHRpb25zLmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRVc2VyTWVkaWFfKGVsZW1lbnQsIG9wdF9vcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja1ZpZGVvXyhlbGVtZW50LCB0cmFja2VyLCBvcHRfb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IHN1cHBvcnRlZCwgdHJ5IGluIGEgY2FudmFzLCBpbWcsIG9yIHZpZGVvLicpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFja3MgYSBjYW52YXMgZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZSBhbmRcclxuICAgICAqIHJldHVybnMgYSBgVHJhY2tlclRhc2tgIGZvciB0aGlzIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7dHJhY2tpbmcuVHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEByZXR1cm4ge3RyYWNraW5nLlRyYWNrZXJUYXNrfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0NhbnZhc18oZWxlbWVudDogYW55LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgdGFzayA9IG5ldyBUcmFja2VyVGFzayh0cmFja2VyKTtcclxuICAgICAgICB0YXNrLm9uKCdydW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudHJhY2tDYW52YXNJbnRlcm5hbF8oZWxlbWVudCwgdHJhY2tlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2sucnVuKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgY2FudmFzIGVsZW1lbnQgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoaXNcclxuICAgICAqIG1ldGhvZCBleHRyYWN0IHRoZSBwaXhlbCBpbmZvcm1hdGlvbiBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byBwYXNzIHRvIHRoZVxyXG4gICAgICogYHRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7dHJhY2tpbmcuVHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhY2tDYW52YXNJbnRlcm5hbF8oZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQsIHRyYWNrZXI6IFRyYWNrZXIsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC53aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSBlbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdmFyIGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRyYWNrZXIudHJhY2soaW1hZ2VEYXRhLmRhdGEsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYWNrcyBhIGltYWdlIGVsZW1lbnQgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoaXNcclxuICAgICAqIG1ldGhvZCBleHRyYWN0IHRoZSBwaXhlbCBpbmZvcm1hdGlvbiBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byBwYXNzIHRvIHRoZVxyXG4gICAgICogYHRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBlbGVtZW50IENhbnZhcyBlbGVtZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtUcmFja2VyfSB0cmFja2VyIFRoZSB0cmFja2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgdGhlXHJcbiAgICAgKiAgICAgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0ltZ18oZWxlbWVudDogYW55LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0O1xyXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIHRhc2sgPSBuZXcgVHJhY2tlclRhc2sodHJhY2tlcik7XHJcbiAgICAgICAgdGFzay5vbigncnVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBUcmFja2luZy5DYW52YXMubG9hZEltYWdlKGNhbnZhcywgZWxlbWVudC5zcmMsIDAsIDAsIHdpZHRoLCBoZWlnaHQsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tDYW52YXNJbnRlcm5hbF8oY2FudmFzLCB0cmFja2VyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2sucnVuKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgdmlkZW8gZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZS4gVGhpc1xyXG4gICAgICogbWV0aG9kIGV4dHJhY3QgdGhlIHBpeGVsIGluZm9ybWF0aW9uIG9mIHRoZSBpbnB1dCBlbGVtZW50IHRvIHBhc3MgdG8gdGhlXHJcbiAgICAgKiBgdHJhY2tlcmAgaW5zdGFuY2UuIFRoZSBgdHJhY2tlci50cmFjayhwaXhlbHMsIHdpZHRoLCBoZWlnaHQpYCB3aWxsIGJlIGluXHJcbiAgICAgKiBhIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGxvb3AgaW4gb3JkZXIgdG8gdHJhY2sgYWxsIHZpZGVvIGZyYW1lcy5cclxuICAgICAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICAqIEBwYXJhbSB7VHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgcHJpdmF0ZSB0cmFja1ZpZGVvXyAoZWxlbWVudDogSFRNTFZpZGVvRWxlbWVudCwgdHJhY2tlcjogVHJhY2tlciwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB2YXIgd2lkdGg6IG51bWJlcjtcclxuICAgIHZhciBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICB2YXIgcmVzaXplQ2FudmFzXyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH07XHJcbiAgICByZXNpemVDYW52YXNfKCk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbnZhc18pO1xyXG5cclxuICAgIHZhciByZXF1ZXN0SWQ6IG51bWJlcjtcclxuICAgIHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfID0gKCkgPT4ge1xyXG4gICAgICByZXF1ZXN0SWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5yZWFkeVN0YXRlID09PSBlbGVtZW50LkhBVkVfRU5PVUdIX0RBVEEpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggdn4zMC4wIGdldHMgY29uZnVzZWQgd2l0aCB0aGUgdmlkZW8gcmVhZHlTdGF0ZSBmaXJpbmcgYW5cclxuICAgICAgICAgICAgLy8gZXJyb25lb3VzIEhBVkVfRU5PVUdIX0RBVEEganVzdCBiZWZvcmUgSEFWRV9DVVJSRU5UX0RBVEEgc3RhdGUsXHJcbiAgICAgICAgICAgIC8vIGhlbmNlIGtlZXAgdHJ5aW5nIHRvIHJlYWQgaXQgdW50aWwgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGVsZW1lbnQsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxyXG4gICAgICAgICAgdGhpcy50cmFja0NhbnZhc0ludGVybmFsXyhjYW52YXMsIHRyYWNrZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdGFzayA9IG5ldyBUcmFja2VyVGFzayh0cmFja2VyKTtcclxuICAgIHRhc2sub24oJ3N0b3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJZCk7XHJcbiAgICB9KTtcclxuICAgIHRhc2sub24oJ3J1bicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVfKCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0YXNrLnJ1bigpO1xyXG4gIH07XHJcblxyXG5cclxuICAgIHB1YmxpYyBFdmVudEVtaXR0ZXIgPSBfRXZlbnRFbWl0dGVyO1xyXG5cclxuICAgIHB1YmxpYyBDYW52YXMgPSBfQ2FudmFzO1xyXG5cclxuICAgIHB1YmxpYyBJbWFnZSA9IF9JbWFnZTtcclxuXHJcbiAgICBwdWJsaWMgQ29sb3JUcmFja2VyID0gX0NvbG9yVHJhY2tlcjtcclxufVxyXG5cclxuVHJhY2tpbmcuRXZlbnRFbWl0dGVyID0gX0V2ZW50RW1pdHRlcjtcclxuXHJcblRyYWNraW5nLkNhbnZhcyA9IF9DYW52YXM7XHJcblxyXG5UcmFja2luZy5JbWFnZSA9IF9JbWFnZTtcclxuXHJcblRyYWNraW5nLkNvbG9yVHJhY2tlciA9IF9Db2xvclRyYWNrZXI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVHJhY2tpbmcgZnJvbSBcIi4vVHJhY2tpbmdcIjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgVHJhY2tpbmdcclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==