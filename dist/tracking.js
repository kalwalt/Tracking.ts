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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTmtDO0FBQ2xDLGlFQUFlO0lBQ1gsUUFBUTtDQUNYIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVHJhY2tpbmcvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL0NhbnZhcy50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9Db2xvclRyYWNrZXIudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvRXZlbnRFbWl0dGVyLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL0ltYWdlLnRzIiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL01hdGgudHMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvLi9zcmMvVHJhY2tlci50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9UcmFja2VyVGFzay50cyIsIndlYnBhY2s6Ly9UcmFja2luZy8uL3NyYy9UcmFja2luZy50cyIsIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVHJhY2tpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9UcmFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RyYWNraW5nLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRyYWNraW5nXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRyYWNraW5nXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsImV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYW52YXMgdXRpbGl0eS5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIExvYWRzIGFuIGltYWdlIHNvdXJjZSBpbnRvIHRoZSBjYW52YXMuXHJcbiAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzIFRoZSBjYW52YXMgZG9tIGVsZW1lbnQuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyYyBUaGUgaW1hZ2Ugc291cmNlLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSBjYW52YXMgaG9yaXpvbnRhbCBjb29yZGluYXRlIHRvIGxvYWQgdGhlIGltYWdlLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IFRoZSBjYW52YXMgdmVydGljYWwgY29vcmRpbmF0ZSB0byBsb2FkIHRoZSBpbWFnZS5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRfY2FsbGJhY2sgQ2FsbGJhY2sgdGhhdCBmaXJlcyB3aGVuIHRoZSBpbWFnZSBpcyBsb2FkZWRcclxuICAgKiAgICAgaW50byB0aGUgY2FudmFzLlxyXG4gICAqIEBzdGF0aWNcclxuICAgKi9cclxuICAgIHN0YXRpYyBsb2FkSW1hZ2UoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgc3JjOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgb3B0X2NhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcclxuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnKic7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGlmIChvcHRfY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIG9wdF9jYWxsYmFjay5jYWxsKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9IHNyYztcclxuICAgIH07XHJcbn0iLCJpbXBvcnQgeyBUcmFja2VyIH0gZnJvbSAnLi9UcmFja2VyJztcclxuaW1wb3J0IHsgTWF0aCBhcyBfTWF0aCB9IGZyb20gJy4vTWF0aCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JUcmFja2VyIGV4dGVuZHMgVHJhY2tlciB7XHJcbiAgICAvKipcclxuICAgICAqIENvbG9yVHJhY2tlciB1dGlsaXR5IHRvIHRyYWNrIGNvbG9yZWQgYmxvYnMgaW4gYSBmcmFtZSB1c2luZyBjb2xvclxyXG4gICAgICogZGlmZmVyZW5jZSBldmFsdWF0aW9uLlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheTxzdHJpbmc+fSBvcHRfY29sb3JzIE9wdGlvbmFsIGNvbG9ycyB0byB0cmFjay5cclxuICAgICAqIEBleHRlbmRzIHtUcmFja2VyfVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRfY29sb3JzOiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG5cclxuICAgICAgIHRoaXMuaW5pdENvbG9ycygpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdF9jb2xvcnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wdF9jb2xvcnMgPSBbb3B0X2NvbG9yc107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0X2NvbG9ycykge1xyXG4gICAgICAgICAgICBvcHRfY29sb3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUNvbG9yVHJhY2tlci5nZXRDb2xvcihjb2xvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIG5vdCB2YWxpZCwgdHJ5IGBuZXcgdHJhY2tpbmcuQ29sb3JUcmFja2VyKFwibWFnZW50YVwiKWAuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbG9ycyhvcHRfY29sb3JzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIGtub3duIGNvbG9ycy5cclxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga25vd25Db2xvcnNfOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4gPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb24+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWNoZXMgY29vcmRpbmF0ZXMgdmFsdWVzIG9mIHRoZSBuZWlnaGJvdXJzIHN1cnJvdW5kaW5nIGEgcGl4ZWwuXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0LjxudW1iZXIsIEludDMyQXJyYXk+fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbmVpZ2hib3Vyc186ICBNYXA8bnVtYmVyLCBJbnQzMkFycmF5PiA9IG5ldyBNYXA8bnVtYmVyLCBJbnQzMkFycmF5PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXJzIGEgY29sb3IgYXMga25vd24gY29sb3IuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgY29sb3IgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBjb2xvciBmdW5jdGlvbiB0byB0ZXN0IGlmIHRoZSBwYXNzZWQgKHIsZyxiKSBpc1xyXG4gICAgICogICAgIHRoZSBkZXNpcmVkIGNvbG9yLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVnaXN0ZXJDb2xvcihuYW1lOiBzdHJpbmcsIGZuOiAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikgPT4gYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgQ29sb3JUcmFja2VyLmtub3duQ29sb3JzXy5zZXQobmFtZSwgZm4pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBHZXRzIHRoZSBrbm93biBjb2xvciBmdW5jdGlvbiB0aGF0IGlzIGFibGUgdG8gdGVzdCB3aGV0aGVyIGFuIChyLGcsYikgaXNcclxuICAgKiB0aGUgZGVzaXJlZCBjb2xvci5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgY29sb3IgbmFtZS5cclxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGtub3duIGNvbG9yIHRlc3QgZnVuY3Rpb24uXHJcbiAgICogQHN0YXRpY1xyXG4gICAqL1xyXG4gICAgc3RhdGljIGdldENvbG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBDb2xvclRyYWNrZXIua25vd25Db2xvcnNfLmdldChuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyB0aGUgY29sb3JzIHRvIGJlIHRyYWNrZWQgYnkgdGhlIGBDb2xvclRyYWNrZXJgIGluc3RhbmNlLlxyXG4gICAgICogQGRlZmF1bHQgWydtYWdlbnRhJ11cclxuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAqL1xyXG4gICAgY29sb3JzOiBBcnJheTxzdHJpbmc+ID0gWydtYWdlbnRhJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICogSG9sZHMgdGhlIG1pbmltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAqIEBkZWZhdWx0IDIwXHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKi9cclxuICAgIG1pbkRpbWVuc2lvbiA9IDIwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIG1heGltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQGRlZmF1bHQgSW5maW5pdHlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIG1heERpbWVuc2lvbiA9IEluZmluaXR5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIG1pbmltdW0gZ3JvdXAgc2l6ZSB0byBiZSBjbGFzc2lmaWVkIGFzIGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQGRlZmF1bHQgMzBcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIG1pbkdyb3VwU2l6ZSA9IDMwO1xyXG5cclxuICAgIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNlbnRyYWwgY29vcmRpbmF0ZSBmcm9tIHRoZSBjbG91ZCBwb2ludHMuIFRoZSBjbG91ZCBwb2ludHNcclxuICAgKiBhcmUgYWxsIHBvaW50cyB0aGF0IG1hdGNoZXMgdGhlIGRlc2lyZWQgY29sb3IuXHJcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY2xvdWQgTWFqb3Igcm93IG9yZGVyIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZVxyXG4gICAqICAgICBwb2ludHMgZnJvbSB0aGUgZGVzaXJlZCBjb2xvciwgZS5nLiBbeDEsIHkxLCBjMiwgeTIsIC4uLl0uXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIFRvdGFsIG51bWJlcnMgb2YgcGl4ZWxzIG9mIHRoZSBkZXNpcmVkIGNvbG9yLlxyXG4gICAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHgsIHkgYW5kIGVzdGltYXRlZCB6IGNvb3JkaW5hdGUgb2ZcclxuICAgKiAgICAgdGhlIGJsb2cgZXh0cmFjdGVkIGZyb20gdGhlIGNsb3VkIHBvaW50cy5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zXyhjbG91ZDogYW55LCB0b3RhbDogbnVtYmVyKTogb2JqZWN0IHtcclxuICAgICAgICB2YXIgbWF4eCA9IC0xO1xyXG4gICAgICAgIHZhciBtYXh5ID0gLTE7XHJcbiAgICAgICAgdmFyIG1pbnggPSBJbmZpbml0eTtcclxuICAgICAgICB2YXIgbWlueSA9IEluZmluaXR5O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRvdGFsOyBjICs9IDIpIHtcclxuICAgICAgICAgICAgdmFyIHggPSBjbG91ZFtjXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBjbG91ZFtjICsgMV07XHJcblxyXG4gICAgICAgICAgICBpZiAoeCA8IG1pbngpIHtcclxuICAgICAgICAgICAgICAgIG1pbnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4ID4gbWF4eCkge1xyXG4gICAgICAgICAgICAgICAgbWF4eCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkgPCBtaW55KSB7XHJcbiAgICAgICAgICAgICAgICBtaW55ID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA+IG1heHkpIHtcclxuICAgICAgICAgICAgICAgIG1heHkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogbWF4eCAtIG1pbngsXHJcbiAgICAgICAgICAgIGhlaWdodDogbWF4eSAtIG1pbnksXHJcbiAgICAgICAgICAgIHg6IG1pbngsXHJcbiAgICAgICAgICAgIHk6IG1pbnlcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGNvbG9ycyBiZWluZyB0cmFja2VkIGJ5IHRoZSBgQ29sb3JUcmFja2VyYCBpbnN0YW5jZS5cclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxyXG4gICAgICovXHJcbiAgICBnZXRDb2xvcnMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIGRpbWVuc2lvbiB0byBjbGFzc2lmeSBhIHJlY3RhbmdsZS5cclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgICBnZXRNaW5EaW1lbnNpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5taW5EaW1lbnNpb247XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbWF4aW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldE1heERpbWVuc2lvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1heERpbWVuc2lvbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBtaW5pbXVtIGdyb3VwIHNpemUgdG8gYmUgY2xhc3NpZmllZCBhcyBhIHJlY3RhbmdsZS5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TWluR3JvdXBTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWluR3JvdXBTaXplO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAqIEdldHMgdGhlIGVpZ2h0IG9mZnNldCB2YWx1ZXMgb2YgdGhlIG5laWdoYm91cnMgc3Vycm91bmRpbmcgYSBwaXhlbC5cclxuICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgKiBAcmV0dXJuIHthcnJheX0gQXJyYXkgd2l0aCB0aGUgZWlnaHQgb2Zmc2V0IHZhbHVlcyBvZiB0aGUgbmVpZ2hib3Vyc1xyXG4gICogICAgIHN1cnJvdW5kaW5nIGEgcGl4ZWwuXHJcbiAgKiBAcHJpdmF0ZVxyXG4gICovXHJcbiAgICBwcml2YXRlIGdldE5laWdoYm91cnNGb3JXaWR0aF8od2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChDb2xvclRyYWNrZXIubmVpZ2hib3Vyc18uZ2V0KHdpZHRoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29sb3JUcmFja2VyLm5laWdoYm91cnNfLmdldCh3aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbmVpZ2hib3VycyA9IG5ldyBJbnQzMkFycmF5KDgpO1xyXG5cclxuICAgICAgICBuZWlnaGJvdXJzWzBdID0gLXdpZHRoICogNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzFdID0gLXdpZHRoICogNCArIDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1syXSA9IDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1szXSA9IHdpZHRoICogNCArIDQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1s0XSA9IHdpZHRoICogNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzVdID0gd2lkdGggKiA0IC0gNDtcclxuICAgICAgICBuZWlnaGJvdXJzWzZdID0gLTQ7XHJcbiAgICAgICAgbmVpZ2hib3Vyc1s3XSA9IC13aWR0aCAqIDQgLSA0O1xyXG5cclxuICAgICAgICBDb2xvclRyYWNrZXIubmVpZ2hib3Vyc18uc2V0KHdpZHRoLCBuZWlnaGJvdXJzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5laWdoYm91cnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5pdGVzIGdyb3VwcyB3aG9zZSBib3VuZGluZyBib3ggaW50ZXJzZWN0IHdpdGggZWFjaCBvdGhlci5cclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IHJlY3RzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG1lcmdlUmVjdGFuZ2xlc18ocmVjdHM6IGFueSkge1xyXG4gICAgICAgIHZhciBpbnRlcnNlY3RzO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgdmFyIG1pbkRpbWVuc2lvbiA9IHRoaXMuZ2V0TWluRGltZW5zaW9uKCk7XHJcbiAgICAgICAgdmFyIG1heERpbWVuc2lvbiA9IHRoaXMuZ2V0TWF4RGltZW5zaW9uKCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgcmVjdHMubGVuZ3RoOyByKyspIHtcclxuICAgICAgICAgICAgdmFyIHIxID0gcmVjdHNbcl07XHJcbiAgICAgICAgICAgIGludGVyc2VjdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBzID0gciArIDE7IHMgPCByZWN0cy5sZW5ndGg7IHMrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHIyID0gcmVjdHNbc107XHJcbiAgICAgICAgICAgICAgICBpZiAoX01hdGguaW50ZXJzZWN0UmVjdChyMS54LCByMS55LCByMS54ICsgcjEud2lkdGgsIHIxLnkgKyByMS5oZWlnaHQsIHIyLngsIHIyLnksIHIyLnggKyByMi53aWR0aCwgcjIueSArIHIyLmhlaWdodCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHgxID0gTWF0aC5taW4ocjEueCwgcjIueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHkxID0gTWF0aC5taW4ocjEueSwgcjIueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHgyID0gTWF0aC5tYXgocjEueCArIHIxLndpZHRoLCByMi54ICsgcjIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB5MiA9IE1hdGgubWF4KHIxLnkgKyByMS5oZWlnaHQsIHIyLnkgKyByMi5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLmhlaWdodCA9IHkyIC0geTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcjIud2lkdGggPSB4MiAtIHgxO1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLnggPSB4MTtcclxuICAgICAgICAgICAgICAgICAgICByMi55ID0geTE7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocjEud2lkdGggPj0gbWluRGltZW5zaW9uICYmIHIxLmhlaWdodCA+PSBtaW5EaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocjEud2lkdGggPD0gbWF4RGltZW5zaW9uICYmIHIxLmhlaWdodCA8PSBtYXhEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHIxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbG9ycyB0byBiZSB0cmFja2VkIGJ5IHRoZSBgQ29sb3JUcmFja2VyYCBpbnN0YW5jZS5cclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNvbG9yc1xyXG4gICAgICovXHJcbiAgICBzZXRDb2xvcnMoY29sb3JzOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jb2xvcnMgPSBjb2xvcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbWluaW11bSBkaW1lbnNpb24gdG8gY2xhc3NpZnkgYSByZWN0YW5nbGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluRGltZW5zaW9uXHJcbiAgICAgKi9cclxuICAgIHNldE1pbkRpbWVuc2lvbihtaW5EaW1lbnNpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubWluRGltZW5zaW9uID0gbWluRGltZW5zaW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIG1heGltdW0gZGltZW5zaW9uIHRvIGNsYXNzaWZ5IGEgcmVjdGFuZ2xlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heERpbWVuc2lvblxyXG4gICAgICovXHJcbiAgICBzZXRNYXhEaW1lbnNpb24obWF4RGltZW5zaW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1heERpbWVuc2lvbiA9IG1heERpbWVuc2lvbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBtaW5pbXVtIGdyb3VwIHNpemUgdG8gYmUgY2xhc3NpZmllZCBhcyBhIHJlY3RhbmdsZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5Hcm91cFNpemVcclxuICAgICAqL1xyXG4gICAgc2V0TWluR3JvdXBTaXplKG1pbkdyb3VwU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5taW5Hcm91cFNpemUgPSBtaW5Hcm91cFNpemU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIFRyYWNrcyB0aGUgYFZpZGVvYCBmcmFtZXMuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmb3IgZWFjaCB2aWRlbyBmcmFtZSBpblxyXG4gICAqIG9yZGVyIHRvIGVtaXQgYHRyYWNrYCBldmVudC5cclxuICAgKiBAcGFyYW0ge1VpbnQ4Q2xhbXBlZEFycmF5fSBwaXhlbHMgVGhlIHBpeGVscyBkYXRhIHRvIHRyYWNrLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgcGl4ZWxzIGNhbnZhcyB3aWR0aC5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBwaXhlbHMgY2FudmFzIGhlaWdodC5cclxuICAgKi9cclxuICAgIHRyYWNrKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb2xvcnMgPSB0aGlzLmdldENvbG9ycygpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbG9ycykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9ycyBub3Qgc3BlY2lmaWVkLCB0cnkgYG5ldyB0cmFja2luZy5Db2xvclRyYWNrZXIoXCJtYWdlbnRhXCIpYC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXN1bHRzOiBhbnkgPSBbXTtcclxuXHJcbiAgICAgICAgY29sb3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChzZWxmLnRyYWNrQ29sb3JfKHBpeGVscywgd2lkdGgsIGhlaWdodCwgY29sb3IpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjaycsIHtcclxuICAgICAgICAgICAgZGF0YTogcmVzdWx0c1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBGaW5kIHRoZSBnaXZlbiBjb2xvciBpbiB0aGUgZ2l2ZW4gbWF0cml4IG9mIHBpeGVscyB1c2luZyBGbG9vZCBmaWxsXHJcbiAgICogYWxnb3JpdGhtIHRvIGRldGVybWluZXMgdGhlIGFyZWEgY29ubmVjdGVkIHRvIGEgZ2l2ZW4gbm9kZSBpbiBhXHJcbiAgICogbXVsdGktZGltZW5zaW9uYWwgYXJyYXkuXHJcbiAgICogQHBhcmFtIHtVaW50OENsYW1wZWRBcnJheX0gcGl4ZWxzIFRoZSBwaXhlbHMgZGF0YSB0byB0cmFjay5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIHBpeGVscyBjYW52YXMgd2lkdGguXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgcGl4ZWxzIGNhbnZhcyBoZWlnaHQuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIFRoZSBjb2xvciB0byBiZSBmb3VuZFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgICBwcml2YXRlIHRyYWNrQ29sb3JfKHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvcjogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgY29sb3JGbiA9IENvbG9yVHJhY2tlci5rbm93bkNvbG9yc18uZ2V0KGNvbG9yKTtcclxuICAgICAgICB2YXIgY3Vyckdyb3VwID0gbmV3IEludDMyQXJyYXkocGl4ZWxzLmxlbmd0aCA+PiAyKTtcclxuICAgICAgICB2YXIgY3Vyckdyb3VwU2l6ZTtcclxuICAgICAgICB2YXIgY3Vyckk7XHJcbiAgICAgICAgdmFyIGN1cnJKO1xyXG4gICAgICAgIHZhciBjdXJyVztcclxuICAgICAgICB2YXIgbWFya2VkID0gbmV3IEludDhBcnJheShwaXhlbHMubGVuZ3RoKTtcclxuICAgICAgICB2YXIgbWluR3JvdXBTaXplID0gdGhpcy5nZXRNaW5Hcm91cFNpemUoKTtcclxuICAgICAgICB2YXIgbmVpZ2hib3Vyc1cgPSB0aGlzLmdldE5laWdoYm91cnNGb3JXaWR0aF8od2lkdGgpO1xyXG4gICAgICAgIC8vIENhY2hpbmcgbmVpZ2hib3VyIGkvaiBvZmZzZXQgdmFsdWVzLlxyXG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIHZhciBuZWlnaGJvdXJzSSA9IG5ldyBJbnQzMkFycmF5KFstMSwgLTEsIDAsIDEsIDEsIDEsIDAsIC0xXSk7XHJcbiAgICAgICAgdmFyIG5laWdoYm91cnNKID0gbmV3IEludDMyQXJyYXkoWzAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTFdKTtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgSW50MzJBcnJheShwaXhlbHMubGVuZ3RoKTtcclxuICAgICAgICB2YXIgcXVldWVQb3NpdGlvbjtcclxuICAgICAgICB2YXIgcmVzdWx0czogYW55ID0gW107XHJcbiAgICAgICAgdmFyIHcgPSAtNDtcclxuXHJcbiAgICAgICAgaWYgKCFjb2xvckZuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHcgKz0gNDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWFya2VkW3ddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3Vyckdyb3VwU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgcXVldWVQb3NpdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IHc7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gaTtcclxuICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSBqO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hcmtlZFt3XSA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHF1ZXVlUG9zaXRpb24gPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJKID0gcXVldWVbcXVldWVQb3NpdGlvbi0tXTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJySSA9IHF1ZXVlW3F1ZXVlUG9zaXRpb24tLV07XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyclcgPSBxdWV1ZVtxdWV1ZVBvc2l0aW9uLS1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JGbigocGl4ZWxzW2N1cnJXXSwgcGl4ZWxzW2N1cnJXICsgMV0sIHBpeGVsc1tjdXJyVyArIDJdLCBwaXhlbHNbY3VyclcgKyAzXSwgY3VyclcpLCBjdXJySSwgY3VyckopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJHcm91cFtjdXJyR3JvdXBTaXplKytdID0gY3Vycko7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJHcm91cFtjdXJyR3JvdXBTaXplKytdID0gY3Vyckk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG5laWdoYm91cnNXLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXJXID0gY3VyclcgKyBuZWlnaGJvdXJzV1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdGhlckkgPSBjdXJySSArIG5laWdoYm91cnNJW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVySiA9IGN1cnJKICsgbmVpZ2hib3Vyc0pba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1hcmtlZFtvdGhlclddICYmIG90aGVySSA+PSAwICYmIG90aGVySSA8IGhlaWdodCAmJiBvdGhlckogPj0gMCAmJiBvdGhlckogPCB3aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlWysrcXVldWVQb3NpdGlvbl0gPSBvdGhlclc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWVbKytxdWV1ZVBvc2l0aW9uXSA9IG90aGVySTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZVsrK3F1ZXVlUG9zaXRpb25dID0gb3RoZXJKO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZWRbb3RoZXJXXSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJHcm91cFNpemUgPj0gbWluR3JvdXBTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGE6IGFueSA9IHRoaXMuY2FsY3VsYXRlRGltZW5zaW9uc18oY3Vyckdyb3VwLCBjdXJyR3JvdXBTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlUmVjdGFuZ2xlc18ocmVzdWx0cyk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBEZWZhdWx0IGNvbG9yc1xyXG4gICAgLy89PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgICAgIENvbG9yVHJhY2tlci5yZWdpc3RlckNvbG9yKCdjeWFuJywgKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdmFyIHRocmVzaG9sZEdyZWVuID0gNTAsXHJcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGRCbHVlID0gNzAsXHJcbiAgICAgICAgICAgICAgICBkeCA9IHIgLSAwLFxyXG4gICAgICAgICAgICAgICAgZHkgPSBnIC0gMjU1LFxyXG4gICAgICAgICAgICAgICAgZHogPSBiIC0gMjU1O1xyXG5cclxuICAgICAgICAgICAgaWYgKChnIC0gcikgPj0gdGhyZXNob2xkR3JlZW4gJiYgKGIgLSByKSA+PSB0aHJlc2hvbGRCbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6IDwgNjQwMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgQ29sb3JUcmFja2VyLnJlZ2lzdGVyQ29sb3IoJ21hZ2VudGEnLCBmdW5jdGlvbiAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgdGhyZXNob2xkID0gNTAsXHJcbiAgICAgICAgICAgICAgICBkeCA9IHIgLSAyNTUsXHJcbiAgICAgICAgICAgICAgICBkeSA9IGcgLSAwLFxyXG4gICAgICAgICAgICAgICAgZHogPSBiIC0gMjU1O1xyXG5cclxuICAgICAgICAgICAgaWYgKChyIC0gZykgPj0gdGhyZXNob2xkICYmIChiIC0gZykgPj0gdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6IDwgMTk2MDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIENvbG9yVHJhY2tlci5yZWdpc3RlckNvbG9yKCd5ZWxsb3cnLCBmdW5jdGlvbiAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgdGhyZXNob2xkID0gNTAsXHJcbiAgICAgICAgICAgICAgICBkeCA9IHIgLSAyNTUsXHJcbiAgICAgICAgICAgICAgICBkeSA9IGcgLSAyNTUsXHJcbiAgICAgICAgICAgICAgICBkeiA9IGIgLSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKChyIC0gYikgPj0gdGhyZXNob2xkICYmIChnIC0gYikgPj0gdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgKyBkeiAqIGR6IDwgMTAwMDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG59IiwiZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFdmVudEVtaXR0ZXIgdXRpbGl0eS5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBIb2xkcyBldmVudCBsaXN0ZW5lcnMgc2NvcGVkIGJ5IGV2ZW50IHR5cGUuXHJcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZXZlbnRzXzogYW55ID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RlbmVycyBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50c18pIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHNfID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgZXZlbnQsIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50c19bZXZlbnRdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzX1tldmVudF0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRzX1tldmVudF0ucHVzaChsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBBcnJheSBvZiBsaXN0ZW5lcnMuXHJcbiAgICAgKi9cclxuICAgIGxpc3RlbmVycyhldmVudDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzXyAmJiB0aGlzLmV2ZW50c19bZXZlbnRdO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgaW4gb3JkZXIgd2l0aCB0aGUgc3VwcGxpZWQgYXJndW1lbnRzLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0geyp9IG9wdF9hcmdzIFthcmcxXSwgW2FyZzJdLCBbLi4uXVxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgZW1pdChldmVudDogc3RyaW5nLCAuLi5vcHRfYXJnczogYW55KSB7XHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KTtcclxuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdGVuZXJzIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGVtaXR0ZXIsIHNvIGNhbGxzIGNhbiBiZSBjaGFpbmVkLlxyXG4gICAgICovXHJcbiAgICBvbiA9IHRoaXMuYWRkTGlzdGVuZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgb25lIHRpbWUgbGlzdGVuZXIgZm9yIHRoZSBldmVudC4gVGhpcyBsaXN0ZW5lciBpcyBpbnZva2VkIG9ubHkgdGhlXHJcbiAgICAgKiBuZXh0IHRpbWUgdGhlIGV2ZW50IGlzIGZpcmVkLCBhZnRlciB3aGljaCBpdCBpcyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGVtaXR0ZXIsIHNvIGNhbGxzIGNhbiBiZSBjaGFpbmVkLlxyXG4gICAgICovXHJcbiAgICBvbmNlKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9uKGV2ZW50LCBmdW5jdGlvbiBoYW5kbGVySW50ZXJuYWwodGhpczogYW55KSB7XHJcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXJJbnRlcm5hbCk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LiBJdCdzIG5vdCBhIGdvb2RcclxuICAgICAqIGlkZWEgdG8gcmVtb3ZlIGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQgZWxzZXdoZXJlIGluIHRoZSBjb2RlLFxyXG4gICAgICogZXNwZWNpYWxseSB3aGVuIGl0J3Mgb24gYW4gZW1pdHRlciB0aGF0IHlvdSBkaWRuJ3QgY3JlYXRlLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgZW1pdHRlciwgc28gY2FsbHMgY2FuIGJlIGNoYWluZWQuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFsbExpc3RlbmVycyhvcHRfZXZlbnQ6IHN0cmluZyB8IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHNfKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0X2V2ZW50KSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c19bb3B0X2V2ZW50XTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNfO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIHRoZSBsaXN0ZW5lciBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cclxuICAgICAqIENhdXRpb246IGNoYW5nZXMgYXJyYXkgaW5kaWNlcyBpbiB0aGUgbGlzdGVuZXIgYXJyYXkgYmVoaW5kIHRoZSBsaXN0ZW5lci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBlbWl0dGVyLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50c18pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMoZXZlbnQpO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzXHJcbiAgICAgKiBhcmUgYWRkZWQgZm9yIGEgcGFydGljdWxhciBldmVudC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzXHJcbiAgICAgKiBmaW5kaW5nIG1lbW9yeSBsZWFrcy4gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFsbG93cyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBtYXhpbXVtIG51bWJlciBvZiBsaXN0ZW5lcnMuXHJcbiAgICAgKi9cclxuICAgIHNldE1heExpc3RlbmVycygpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xyXG4gICAgfTtcclxufSIsImV4cG9ydCBjbGFzcyBJbWFnZSB7XHJcbiAgICAvKipcclxuICAgICAqIEltYWdlIHV0aWxpdHkuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIGdhdXNzaWFuIGJsdXIuIEFkYXB0ZWQgZnJvbVxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2tpZy9jYW52YXNmaWx0ZXJzLlxyXG4gICAgICogQHBhcmFtIHtwaXhlbHN9IHBpeGVscyBUaGUgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRpYW1ldGVyIEdhdXNzaWFuIGJsdXIgZGlhbWV0ZXIsIG11c3QgYmUgZ3JlYXRlciB0aGFuIDEuXHJcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gVGhlIGVkZ2UgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAqL1xyXG4gICAgYmx1cihwaXhlbHM6IEZsb2F0MzJBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRpYW1ldGVyOiBudW1iZXIpIHtcclxuICAgICAgICBkaWFtZXRlciA9IE1hdGguYWJzKGRpYW1ldGVyKTtcclxuICAgICAgICBpZiAoZGlhbWV0ZXIgPD0gMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpYW1ldGVyIHNob3VsZCBiZSBncmVhdGVyIHRoYW4gMS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IGRpYW1ldGVyIC8gMjtcclxuICAgICAgICB2YXIgbGVuID0gTWF0aC5jZWlsKGRpYW1ldGVyKSArICgxIC0gKE1hdGguY2VpbChkaWFtZXRlcikgJSAyKSk7XHJcbiAgICAgICAgdmFyIHdlaWdodHMgPSBuZXcgRmxvYXQzMkFycmF5KGxlbik7XHJcbiAgICAgICAgdmFyIHJobyA9IChyYWRpdXMgKyAwLjUpIC8gMztcclxuICAgICAgICB2YXIgcmhvU3EgPSByaG8gKiByaG87XHJcbiAgICAgICAgdmFyIGdhdXNzaWFuRmFjdG9yID0gMSAvIE1hdGguc3FydCgyICogTWF0aC5QSSAqIHJob1NxKTtcclxuICAgICAgICB2YXIgcmhvRmFjdG9yID0gLTEgLyAoMiAqIHJobyAqIHJobyk7XHJcbiAgICAgICAgdmFyIHdzdW0gPSAwO1xyXG4gICAgICAgIHZhciBtaWRkbGUgPSBNYXRoLmZsb29yKGxlbiAvIDIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHggPSBpIC0gbWlkZGxlO1xyXG4gICAgICAgICAgICB2YXIgZ3ggPSBnYXVzc2lhbkZhY3RvciAqIE1hdGguZXhwKHggKiB4ICogcmhvRmFjdG9yKTtcclxuICAgICAgICAgICAgd2VpZ2h0c1tpXSA9IGd4O1xyXG4gICAgICAgICAgICB3c3VtICs9IGd4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdlaWdodHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgd2VpZ2h0c1tqXSAvPSB3c3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zZXBhcmFibGVDb252b2x2ZShwaXhlbHMsIHdpZHRoLCBoZWlnaHQsIHdlaWdodHMsIHdlaWdodHMsIGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgaW50ZWdyYWwgaW1hZ2UgZm9yIHN1bW1lZCwgc3F1YXJlZCwgcm90YXRlZCBhbmQgc29iZWwgcGl4ZWxzLlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gcGl4ZWxzIFRoZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheSB0byBsb29wXHJcbiAgICAgKiAgICAgdGhyb3VnaC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgaW1hZ2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IFRoZSBpbWFnZSBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRfaW50ZWdyYWxJbWFnZSBFbXB0eSBhcnJheSBvZiBzaXplIGB3aWR0aCAqIGhlaWdodGAgdG9cclxuICAgICAqICAgICBiZSBmaWxsZWQgd2l0aCB0aGUgaW50ZWdyYWwgaW1hZ2UgdmFsdWVzLiBJZiBub3Qgc3BlY2lmaWVkIGNvbXB1dGUgc3VtXHJcbiAgICAgKiAgICAgdmFsdWVzIHdpbGwgYmUgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IG9wdF9pbnRlZ3JhbEltYWdlU3F1YXJlIEVtcHR5IGFycmF5IG9mIHNpemUgYHdpZHRoICpcclxuICAgICAqICAgICBoZWlnaHRgIHRvIGJlIGZpbGxlZCB3aXRoIHRoZSBpbnRlZ3JhbCBpbWFnZSBzcXVhcmVkIHZhbHVlcy4gSWYgbm90XHJcbiAgICAgKiAgICAgc3BlY2lmaWVkIGNvbXB1dGUgc3F1YXJlZCB2YWx1ZXMgd2lsbCBiZSBza2lwcGVkLlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gb3B0X3RpbHRlZEludGVncmFsSW1hZ2UgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKlxyXG4gICAgICogICAgIGhlaWdodGAgdG8gYmUgZmlsbGVkIHdpdGggdGhlIHJvdGF0ZWQgaW50ZWdyYWwgaW1hZ2UgdmFsdWVzLiBJZiBub3RcclxuICAgICAqICAgICBzcGVjaWZpZWQgY29tcHV0ZSBzdW0gdmFsdWVzIHdpbGwgYmUgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IG9wdF9pbnRlZ3JhbEltYWdlU29iZWwgRW1wdHkgYXJyYXkgb2Ygc2l6ZSBgd2lkdGggKlxyXG4gICAgICogICAgIGhlaWdodGAgdG8gYmUgZmlsbGVkIHdpdGggdGhlIGludGVncmFsIGltYWdlIG9mIHNvYmVsIHZhbHVlcy4gSWYgbm90XHJcbiAgICAgKiAgICAgc3BlY2lmaWVkIGNvbXB1dGUgc29iZWwgZmlsdGVyaW5nIHdpbGwgYmUgc2tpcHBlZC5cclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqL1xyXG4gICAgY29tcHV0ZUludGVncmFsSW1hZ2UocGl4ZWxzOiBVaW50OENsYW1wZWRBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIG9wdF9pbnRlZ3JhbEltYWdlOiBhbnksIG9wdF9pbnRlZ3JhbEltYWdlU3F1YXJlOiBhbnksIG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlOiBhbnksIG9wdF9pbnRlZ3JhbEltYWdlU29iZWw6IGFueSkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgNCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSBhdCBsZWFzdCBvbmUgb3V0cHV0IGFycmF5IGluIHRoZSBvcmRlcjogc3VtLCBzcXVhcmUsIHRpbHRlZCwgc29iZWwuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwaXhlbHNTb2JlbDtcclxuICAgICAgICBpZiAob3B0X2ludGVncmFsSW1hZ2VTb2JlbCkge1xyXG4gICAgICAgICAgICBwaXhlbHNTb2JlbCA9IHRoaXMuc29iZWwocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB3ID0gaSAqIHdpZHRoICogNCArIGogKiA0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBpeGVsID0gfn4ocGl4ZWxzW3ddICogMC4yOTkgKyBwaXhlbHNbdyArIDFdICogMC41ODcgKyBwaXhlbHNbdyArIDJdICogMC4xMTQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF9pbnRlZ3JhbEltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVNBVF8ob3B0X2ludGVncmFsSW1hZ2UsIHdpZHRoLCBpLCBqLCBwaXhlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0X2ludGVncmFsSW1hZ2VTcXVhcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVQaXhlbFZhbHVlU0FUXyhvcHRfaW50ZWdyYWxJbWFnZVNxdWFyZSwgd2lkdGgsIGksIGosIHBpeGVsICogcGl4ZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdF90aWx0ZWRJbnRlZ3JhbEltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHcxID0gdyAtIHdpZHRoICogNDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGl4ZWxBYm92ZSA9IH5+KHBpeGVsc1t3MV0gKiAwLjI5OSArIHBpeGVsc1t3MSArIDFdICogMC41ODcgKyBwaXhlbHNbdzEgKyAyXSAqIDAuMTE0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVQaXhlbFZhbHVlUlNBVF8ob3B0X3RpbHRlZEludGVncmFsSW1hZ2UsIHdpZHRoLCBpLCBqLCBwaXhlbCwgcGl4ZWxBYm92ZSB8fCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRfaW50ZWdyYWxJbWFnZVNvYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUGl4ZWxWYWx1ZVNBVF8ob3B0X2ludGVncmFsSW1hZ2VTb2JlbCwgd2lkdGgsIGksIGosIHBpeGVsc1NvYmVsW3ddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGNvbXB1dGUgdGhlIHJvdGF0ZWQgc3VtbWVkIGFyZWEgdGFibGUgKFJTQVQpIGJ5IHRoZVxyXG4gICAgICogZm9ybXVsYTpcclxuICAgICAqXHJcbiAgICAgKiBSU0FUKHgsIHkpID0gUlNBVCh4LTEsIHktMSkgKyBSU0FUKHgrMSwgeS0xKSAtIFJTQVQoeCwgeS0yKSArIEkoeCwgeSkgKyBJKHgsIHktMSlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gUlNBVCBFbXB0eSBhcnJheSBvZiBzaXplIGB3aWR0aCAqIGhlaWdodGAgdG8gYmUgZmlsbGVkIHdpdGhcclxuICAgICAqICAgICB0aGUgaW50ZWdyYWwgaW1hZ2UgdmFsdWVzLiBJZiBub3Qgc3BlY2lmaWVkIGNvbXB1dGUgc3VtIHZhbHVlcyB3aWxsIGJlXHJcbiAgICAgKiAgICAgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpIFZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSBwaXhlbCB0byBiZSBldmFsdWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaiBIb3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSBwaXhlbCB0byBiZSBldmFsdWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGl4ZWwgUGl4ZWwgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIGludGVncmFsIGltYWdlLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjb21wdXRlUGl4ZWxWYWx1ZVJTQVRfKFJTQVQ6IG51bWJlcltdLCB3aWR0aDogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgcGl4ZWw6IG51bWJlciwgcGl4ZWxBYm92ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHcgPSBpICogd2lkdGggKyBqO1xyXG4gICAgICAgIFJTQVRbd10gPSAoUlNBVFt3IC0gd2lkdGggLSAxXSB8fCAwKSArIChSU0FUW3cgLSB3aWR0aCArIDFdIHx8IDApIC0gKFJTQVRbdyAtIHdpZHRoIC0gd2lkdGhdIHx8IDApICsgcGl4ZWwgKyBwaXhlbEFib3ZlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBtZXRob2QgdG8gY29tcHV0ZSB0aGUgc3VtbWVkIGFyZWEgdGFibGUgKFNBVCkgYnkgdGhlIGZvcm11bGE6XHJcbiAgICAgKlxyXG4gICAgICogU0FUKHgsIHkpID0gU0FUKHgsIHktMSkgKyBTQVQoeC0xLCB5KSArIEkoeCwgeSkgLSBTQVQoeC0xLCB5LTEpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IFNBVCBFbXB0eSBhcnJheSBvZiBzaXplIGB3aWR0aCAqIGhlaWdodGAgdG8gYmUgZmlsbGVkIHdpdGhcclxuICAgICAqICAgICB0aGUgaW50ZWdyYWwgaW1hZ2UgdmFsdWVzLiBJZiBub3Qgc3BlY2lmaWVkIGNvbXB1dGUgc3VtIHZhbHVlcyB3aWxsIGJlXHJcbiAgICAgKiAgICAgc2tpcHBlZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpIFZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSBwaXhlbCB0byBiZSBldmFsdWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaiBIb3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSBwaXhlbCB0byBiZSBldmFsdWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGl4ZWwgUGl4ZWwgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIGludGVncmFsIGltYWdlLlxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgY29tcHV0ZVBpeGVsVmFsdWVTQVRfKFNBVDogbnVtYmVyW10sIHdpZHRoOiBudW1iZXIsIGk6IG51bWJlciwgajogbnVtYmVyLCBwaXhlbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHcgPSBpICogd2lkdGggKyBqO1xyXG4gICAgICAgIFNBVFt3XSA9IChTQVRbdyAtIHdpZHRoXSB8fCAwKSArIChTQVRbdyAtIDFdIHx8IDApICsgcGl4ZWwgLSAoU0FUW3cgLSB3aWR0aCAtIDFdIHx8IDApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgY29sb3IgZnJvbSBhIGNvbG9yc3BhY2UgYmFzZWQgb24gYW4gUkdCIGNvbG9yIG1vZGVsIHRvIGFcclxuICAgICAqIGdyYXlzY2FsZSByZXByZXNlbnRhdGlvbiBvZiBpdHMgbHVtaW5hbmNlLiBUaGUgY29lZmZpY2llbnRzIHJlcHJlc2VudCB0aGVcclxuICAgICAqIG1lYXN1cmVkIGludGVuc2l0eSBwZXJjZXB0aW9uIG9mIHR5cGljYWwgdHJpY2hyb21hdCBodW1hbnMsIGluXHJcbiAgICAgKiBwYXJ0aWN1bGFyLCBodW1hbiB2aXNpb24gaXMgbW9zdCBzZW5zaXRpdmUgdG8gZ3JlZW4gYW5kIGxlYXN0IHNlbnNpdGl2ZVxyXG4gICAgICogdG8gYmx1ZS5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZmlsbFJHQkEgSWYgdGhlIHJlc3VsdCBzaG91bGQgZmlsbCBhbGwgUkdCQSB2YWx1ZXMgd2l0aCB0aGUgZ3JheSBzY2FsZVxyXG4gICAgICogIHZhbHVlcywgaW5zdGVhZCBvZiByZXR1cm5pbmcgYSBzaW5nbGUgdmFsdWUgcGVyIHBpeGVsLlxyXG4gICAgICogQHBhcmFtIHtVaW50OENsYW1wZWRBcnJheX0gVGhlIGdyYXlzY2FsZSBwaXhlbHMgaW4gYSBsaW5lYXIgYXJyYXkgKFtwLHAscCxhLC4uLl0gaWYgZmlsbFJHQkFcclxuICAgICAqICBpcyB0cnVlIGFuZCBbcDEsIHAyLCBwMywgLi4uXSBpZiBmaWxsUkdCQSBpcyBmYWxzZSkuXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBncmF5c2NhbGUocGl4ZWxzOiBVaW50OENsYW1wZWRBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGZpbGxSR0JBOiBib29sZWFuKTogVWludDhDbGFtcGVkQXJyYXkge1xyXG4gICAgICAgIHZhciBncmF5ID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGZpbGxSR0JBID8gcGl4ZWxzLmxlbmd0aCA6IHBpeGVscy5sZW5ndGggPj4gMik7XHJcbiAgICAgICAgdmFyIHAgPSAwO1xyXG4gICAgICAgIHZhciB3ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGl4ZWxzW3ddICogMC4yOTkgKyBwaXhlbHNbdyArIDFdICogMC41ODcgKyBwaXhlbHNbdyArIDJdICogMC4xMTQ7XHJcbiAgICAgICAgICAgICAgICBncmF5W3ArK10gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsbFJHQkEpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmF5W3ArK10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBncmF5W3ArK10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBncmF5W3ArK10gPSBwaXhlbHNbdyArIDNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHcgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ3JheTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGYXN0IGhvcml6b250YWwgc2VwYXJhYmxlIGNvbnZvbHV0aW9uLiBBIHBvaW50IHNwcmVhZCBmdW5jdGlvbiAoUFNGKSBpc1xyXG4gICAgICogc2FpZCB0byBiZSBzZXBhcmFibGUgaWYgaXQgY2FuIGJlIGJyb2tlbiBpbnRvIHR3byBvbmUtZGltZW5zaW9uYWxcclxuICAgICAqIHNpZ25hbHM6IGEgdmVydGljYWwgYW5kIGEgaG9yaXpvbnRhbCBwcm9qZWN0aW9uLiBUaGUgY29udm9sdXRpb24gaXNcclxuICAgICAqIHBlcmZvcm1lZCBieSBzbGlkaW5nIHRoZSBrZXJuZWwgb3ZlciB0aGUgaW1hZ2UsIGdlbmVyYWxseSBzdGFydGluZyBhdCB0aGVcclxuICAgICAqIHRvcCBsZWZ0IGNvcm5lciwgc28gYXMgdG8gbW92ZSB0aGUga2VybmVsIHRocm91Z2ggYWxsIHRoZSBwb3NpdGlvbnMgd2hlcmVcclxuICAgICAqIHRoZSBrZXJuZWwgZml0cyBlbnRpcmVseSB3aXRoaW4gdGhlIGJvdW5kYXJpZXMgb2YgdGhlIGltYWdlLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHdlaWdodHNWZWN0b3IgVGhlIHdlaWdodGluZyB2ZWN0b3IsIGUuZyBbLTEsMCwxXS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcGFxdWVcclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgY29udm9sdXRlZCBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgaG9yaXpvbnRhbENvbnZvbHZlKHBpeGVsczogRmxvYXQzMkFycmF5LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgd2VpZ2h0c1ZlY3RvcjogRmxvYXQzMkFycmF5LCBvcGFxdWU6IGJvb2xlYW4pOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHZhciBzaWRlID0gd2VpZ2h0c1ZlY3Rvci5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGhhbGZTaWRlID0gTWF0aC5mbG9vcihzaWRlIC8gMik7XHJcbiAgICAgICAgdmFyIG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkod2lkdGggKiBoZWlnaHQgKiA0KTtcclxuICAgICAgICB2YXIgYWxwaGFGYWMgPSBvcGFxdWUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzeSA9IHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3ggPSB4O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9ICh5ICogd2lkdGggKyB4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgciA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjeCA9IDA7IGN4IDwgc2lkZTsgY3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3kgPSBzeTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2N4ID0gTWF0aC5taW4od2lkdGggLSAxLCBNYXRoLm1heCgwLCBzeCArIGN4IC0gaGFsZlNpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9mZnNldCA9IChzY3kgKiB3aWR0aCArIHNjeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3dCA9IHdlaWdodHNWZWN0b3JbY3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIHIgKz0gcGl4ZWxzW3BvZmZzZXRdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgZyArPSBwaXhlbHNbcG9mZnNldCArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYiArPSBwaXhlbHNbcG9mZnNldCArIDJdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgYSArPSBwaXhlbHNbcG9mZnNldCArIDNdICogd3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0XSA9IHI7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDJdID0gYjtcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAzXSA9IGEgKyBhbHBoYUZhYyAqICgyNTUgLSBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhc3QgdmVydGljYWwgc2VwYXJhYmxlIGNvbnZvbHV0aW9uLiBBIHBvaW50IHNwcmVhZCBmdW5jdGlvbiAoUFNGKSBpc1xyXG4gICAgICogc2FpZCB0byBiZSBzZXBhcmFibGUgaWYgaXQgY2FuIGJlIGJyb2tlbiBpbnRvIHR3byBvbmUtZGltZW5zaW9uYWxcclxuICAgICAqIHNpZ25hbHM6IGEgdmVydGljYWwgYW5kIGEgaG9yaXpvbnRhbCBwcm9qZWN0aW9uLiBUaGUgY29udm9sdXRpb24gaXNcclxuICAgICAqIHBlcmZvcm1lZCBieSBzbGlkaW5nIHRoZSBrZXJuZWwgb3ZlciB0aGUgaW1hZ2UsIGdlbmVyYWxseSBzdGFydGluZyBhdCB0aGVcclxuICAgICAqIHRvcCBsZWZ0IGNvcm5lciwgc28gYXMgdG8gbW92ZSB0aGUga2VybmVsIHRocm91Z2ggYWxsIHRoZSBwb3NpdGlvbnMgd2hlcmVcclxuICAgICAqIHRoZSBrZXJuZWwgZml0cyBlbnRpcmVseSB3aXRoaW4gdGhlIGJvdW5kYXJpZXMgb2YgdGhlIGltYWdlLiBBZGFwdGVkIGZyb21cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHdlaWdodHNWZWN0b3IgVGhlIHdlaWdodGluZyB2ZWN0b3IsIGUuZyBbLTEsMCwxXS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcGFxdWVcclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgY29udm9sdXRlZCBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgdmVydGljYWxDb252b2x2ZShwaXhlbHM6IEZsb2F0MzJBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHdlaWdodHNWZWN0b3I6IEZsb2F0MzJBcnJheSwgb3BhcXVlOiBib29sZWFuKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICB2YXIgc2lkZSA9IHdlaWdodHNWZWN0b3IubGVuZ3RoO1xyXG4gICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbiAgICAgICAgdmFyIGFscGhhRmFjID0gb3BhcXVlID8gMSA6IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3kgPSB5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAoeSAqIHdpZHRoICsgeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY3kgPSAwOyBjeSA8IHNpZGU7IGN5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2N5ID0gTWF0aC5taW4oaGVpZ2h0IC0gMSwgTWF0aC5tYXgoMCwgc3kgKyBjeSAtIGhhbGZTaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjeCA9IHN4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb2Zmc2V0ID0gKHNjeSAqIHdpZHRoICsgc2N4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHd0ID0gd2VpZ2h0c1ZlY3RvcltjeV07XHJcbiAgICAgICAgICAgICAgICAgICAgciArPSBwaXhlbHNbcG9mZnNldF0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICBnICs9IHBpeGVsc1twb2Zmc2V0ICsgMV0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICBiICs9IHBpeGVsc1twb2Zmc2V0ICsgMl0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICBhICs9IHBpeGVsc1twb2Zmc2V0ICsgM10gKiB3dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXRdID0gcjtcclxuICAgICAgICAgICAgICAgIG91dHB1dFtvZmZzZXQgKyAxXSA9IGc7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbb2Zmc2V0ICsgMl0gPSBiO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W29mZnNldCArIDNdID0gYSArIGFscGhhRmFjICogKDI1NSAtIGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFzdCBzZXBhcmFibGUgY29udm9sdXRpb24uIEEgcG9pbnQgc3ByZWFkIGZ1bmN0aW9uIChQU0YpIGlzIHNhaWQgdG8gYmVcclxuICAgICAqIHNlcGFyYWJsZSBpZiBpdCBjYW4gYmUgYnJva2VuIGludG8gdHdvIG9uZS1kaW1lbnNpb25hbCBzaWduYWxzOiBhXHJcbiAgICAgKiB2ZXJ0aWNhbCBhbmQgYSBob3Jpem9udGFsIHByb2plY3Rpb24uIFRoZSBjb252b2x1dGlvbiBpcyBwZXJmb3JtZWQgYnlcclxuICAgICAqIHNsaWRpbmcgdGhlIGtlcm5lbCBvdmVyIHRoZSBpbWFnZSwgZ2VuZXJhbGx5IHN0YXJ0aW5nIGF0IHRoZSB0b3AgbGVmdFxyXG4gICAgICogY29ybmVyLCBzbyBhcyB0byBtb3ZlIHRoZSBrZXJuZWwgdGhyb3VnaCBhbGwgdGhlIHBvc2l0aW9ucyB3aGVyZSB0aGVcclxuICAgICAqIGtlcm5lbCBmaXRzIGVudGlyZWx5IHdpdGhpbiB0aGUgYm91bmRhcmllcyBvZiB0aGUgaW1hZ2UuIEFkYXB0ZWQgZnJvbVxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2tpZy9jYW52YXNmaWx0ZXJzLlxyXG4gICAgICogQHBhcmFtIHtwaXhlbHN9IHBpeGVscyBUaGUgcGl4ZWxzIGluIGEgbGluZWFyIFtyLGcsYixhLC4uLl0gYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHthcnJheX0gaG9yaXpXZWlnaHRzIFRoZSBob3Jpem9udGFsIHdlaWdodGluZyB2ZWN0b3IsIGUuZyBbLTEsMCwxXS5cclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHZlcnRXZWlnaHRzIFRoZSB2ZXJ0aWNhbCB2ZWN0b3IsIGUuZyBbLTEsMCwxXS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcGFxdWVcclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgY29udm9sdXRlZCBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgc2VwYXJhYmxlQ29udm9sdmUocGl4ZWxzOiBGbG9hdDMyQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBob3JpeldlaWdodHM6IEZsb2F0MzJBcnJheSwgdmVydFdlaWdodHM6IEZsb2F0MzJBcnJheSwgb3BhcXVlPzogYm9vbGVhbik6IEZsb2F0MzJBcnJheSB7XHJcbiAgICAgICAgdmFyIHZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbENvbnZvbHZlKHBpeGVscywgd2lkdGgsIGhlaWdodCwgdmVydFdlaWdodHMsIG9wYXF1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaG9yaXpvbnRhbENvbnZvbHZlKHZlcnRpY2FsLCB3aWR0aCwgaGVpZ2h0LCBob3JpeldlaWdodHMsIG9wYXF1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZSBpbWFnZSBlZGdlcyB1c2luZyBTb2JlbCBvcGVyYXRvci4gQ29tcHV0ZXMgdGhlIHZlcnRpY2FsIGFuZFxyXG4gICAgICogaG9yaXpvbnRhbCBncmFkaWVudHMgb2YgdGhlIGltYWdlIGFuZCBjb21iaW5lcyB0aGUgY29tcHV0ZWQgaW1hZ2VzIHRvXHJcbiAgICAgKiBmaW5kIGVkZ2VzIGluIHRoZSBpbWFnZS4gVGhlIHdheSB3ZSBpbXBsZW1lbnQgdGhlIFNvYmVsIGZpbHRlciBoZXJlIGlzIGJ5XHJcbiAgICAgKiBmaXJzdCBncmF5c2NhbGluZyB0aGUgaW1hZ2UsIHRoZW4gdGFraW5nIHRoZSBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbFxyXG4gICAgICogZ3JhZGllbnRzIGFuZCBmaW5hbGx5IGNvbWJpbmluZyB0aGUgZ3JhZGllbnQgaW1hZ2VzIHRvIG1ha2UgdXAgdGhlIGZpbmFsXHJcbiAgICAgKiBpbWFnZS4gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9raWcvY2FudmFzZmlsdGVycy5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIHBpeGVscyBpbiBhIGxpbmVhciBbcixnLGIsYSwuLi5dIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBpbWFnZSB3aWR0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgVGhlIGltYWdlIGhlaWdodC5cclxuICAgICAqIEByZXR1cm4ge2FycmF5fSBUaGUgZWRnZSBwaXhlbHMgaW4gYSBsaW5lYXIgW3IsZyxiLGEsLi4uXSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgc29iZWwocGl4ZWxzOiBVaW50OENsYW1wZWRBcnJheSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHZhciBfcGl4ZWxzOiBGbG9hdDMyQXJyYXkgPSA8RmxvYXQzMkFycmF5Pjx1bmtub3duPkltYWdlLmdyYXlzY2FsZShwaXhlbHMsIHdpZHRoLCBoZWlnaHQsIHRydWUpO1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbiAgICAgICAgdmFyIHNvYmVsU2lnblZlY3RvciA9IG5ldyBGbG9hdDMyQXJyYXkoWy0xLCAwLCAxXSk7XHJcbiAgICAgICAgdmFyIHNvYmVsU2NhbGVWZWN0b3IgPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAxXSk7XHJcbiAgICAgICAgdmFyIHZlcnRpY2FsID0gdGhpcy5zZXBhcmFibGVDb252b2x2ZShfcGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCBzb2JlbFNpZ25WZWN0b3IsIHNvYmVsU2NhbGVWZWN0b3IpO1xyXG4gICAgICAgIHZhciBob3Jpem9udGFsID0gdGhpcy5zZXBhcmFibGVDb252b2x2ZShfcGl4ZWxzLCB3aWR0aCwgaGVpZ2h0LCBzb2JlbFNjYWxlVmVjdG9yLCBzb2JlbFNpZ25WZWN0b3IpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICAgICAgICB2YXIgdiA9IHZlcnRpY2FsW2ldO1xyXG4gICAgICAgICAgICB2YXIgaCA9IGhvcml6b250YWxbaV07XHJcbiAgICAgICAgICAgIHZhciBwID0gTWF0aC5zcXJ0KGggKiBoICsgdiAqIHYpO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBwO1xyXG4gICAgICAgICAgICBvdXRwdXRbaSArIDFdID0gcDtcclxuICAgICAgICAgICAgb3V0cHV0W2kgKyAyXSA9IHA7XHJcbiAgICAgICAgICAgIG91dHB1dFtpICsgM10gPSAyNTU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVxdWFsaXplcyB0aGUgaGlzdG9ncmFtIG9mIGEgZ3JheXNjYWxlIGltYWdlLCBub3JtYWxpemluZyB0aGVcclxuICAgICAqIGJyaWdodG5lc3MgYW5kIGluY3JlYXNpbmcgdGhlIGNvbnRyYXN0IG9mIHRoZSBpbWFnZS5cclxuICAgICAqIEBwYXJhbSB7cGl4ZWxzfSBwaXhlbHMgVGhlIGdyYXlzY2FsZSBwaXhlbHMgaW4gYSBsaW5lYXIgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggVGhlIGltYWdlIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgaW1hZ2UgaGVpZ2h0LlxyXG4gICAgICogQHJldHVybiB7YXJyYXl9IFRoZSBlcXVhbGl6ZWQgZ3JheXNjYWxlIHBpeGVscyBpbiBhIGxpbmVhciBhcnJheS5cclxuICAgICAqL1xyXG4gICAgZXF1YWxpemVIaXN0KHBpeGVsczogVWludDhDbGFtcGVkQXJyYXksIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGVxdWFsaXplZCA9IG5ldyBVaW50OENsYW1wZWRBcnJheShwaXhlbHMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgdmFyIGhpc3RvZ3JhbSA9IG5ldyBBcnJheSgyNTYpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIGhpc3RvZ3JhbVtpXSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGl4ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVxdWFsaXplZFtpXSA9IHBpeGVsc1tpXTtcclxuICAgICAgICAgICAgaGlzdG9ncmFtW3BpeGVsc1tpXV0rKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcmV2ID0gaGlzdG9ncmFtWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcclxuICAgICAgICAgICAgaGlzdG9ncmFtW2ldICs9IHByZXY7XHJcbiAgICAgICAgICAgIHByZXYgPSBoaXN0b2dyYW1baV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbm9ybSA9IDI1NSAvIHBpeGVscy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXhlbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGVxdWFsaXplZFtpXSA9IChoaXN0b2dyYW1bcGl4ZWxzW2ldXSAqIG5vcm0gKyAwLjUpIHwgMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVxdWFsaXplZDtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBNYXRoIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiBhIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggYW5vdGhlci5cclxuICAgICAqXHJcbiAgICAgKiAgPHByZT5cclxuICAgICAqICB4MHkwIC0tLS0tLS0tICAgICAgIHgyeTIgLS0tLS0tLS1cclxuICAgICAqICAgICAgfCAgICAgICB8ICAgICAgICAgICB8ICAgICAgIHxcclxuICAgICAqICAgICAgLS0tLS0tLS0geDF5MSAgICAgICAtLS0tLS0tLSB4M3kzXHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDAgSG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIFAwLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwIFZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgUDAuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDEgSG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIFAxLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkxIFZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgUDEuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDIgSG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIFAyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkyIFZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgUDIuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDMgSG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIFAzLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkzIFZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgUDMuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW50ZXJzZWN0UmVjdCh4MDogbnVtYmVyLCB5MDogbnVtYmVyLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEoeDIgPiB4MSB8fCB4MyA8IHgwIHx8IHkyID4geTEgfHwgeTMgPCB5MCk7XHJcbiAgICB9O1xyXG59IiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJhY2tlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfTtcclxuICAgIGFic3RyYWN0IHRyYWNrKGVsZW1lbnQ6IGFueSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBhbnk7XHJcbn0iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi9FdmVudEVtaXR0ZXJcIjtcclxuaW1wb3J0IHsgVHJhY2tlciB9IGZyb20gXCIuL1RyYWNrZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2VyVGFzayBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0cmFja2VyOiBUcmFja2VyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoIXRyYWNrZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VyIGluc3RhbmNlIG5vdCBzcGVjaWZpZWQuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFRyYWNrZXIodHJhY2tlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgdGhlIHRyYWNrZXIgaW5zdGFuY2UgbWFuYWdlZCBieSB0aGlzIHRhc2suXHJcbiAgICAgKiBAdHlwZSB7VHJhY2tlcn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJhY2tlcl86IFRyYWNrZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG9sZHMgaWYgdGhlIHRyYWNrZXIgdGFzayBpcyBpbiBydW5uaW5nLlxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJ1bm5pbmdfID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSB0cmFja2VyIGluc3RhbmNlIG1hbmFnZWQgYnkgdGhpcyB0YXNrLlxyXG4gICAgICogQHJldHVybiB7VHJhY2tlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0VHJhY2tlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFja2VyXztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyYWNrZXIgdGFzayBpcyBpbiBydW5uaW5nLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpblJ1bm5pbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnVubmluZ187XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBpZiB0aGUgdHJhY2tlciB0YXNrIGlzIGluIHJ1bm5pbmcuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJ1bm5pbmdcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2V0UnVubmluZyhydW5uaW5nOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5ydW5uaW5nXyA9IHJ1bm5pbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdHJhY2tlciBpbnN0YW5jZSBtYW5hZ2VkIGJ5IHRoaXMgdGFzay5cclxuICAgICAqIEByZXR1cm4ge1RyYWNrZXJ9XHJcbiAgICAgKi9cclxuICAgIHNldFRyYWNrZXIodHJhY2tlcjogVHJhY2tlcikge1xyXG4gICAgICAgIHRoaXMudHJhY2tlcl8gPSB0cmFja2VyO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlZW1pdFRyYWNrRXZlbnRfKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrJywgZXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVtaXRzIGEgYHJ1bmAgZXZlbnQgb24gdGhlIHRyYWNrZXIgdGFzayBmb3IgdGhlIGltcGxlbWVudGVycyB0byBydW4gYW55XHJcbiAgICAgKiBjaGlsZCBhY3Rpb24sIGUuZy4gYHJlcXVlc3RBbmltYXRpb25GcmFtZWAuXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgaXRzZWxmLCBzbyBjYWxscyBjYW4gYmUgY2hhaW5lZC5cclxuICAgICAqL1xyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIC8vdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pblJ1bm5pbmcoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFJ1bm5pbmcodHJ1ZSk7XHJcbiAgICAgICAgLyp0aGlzLnJlZW1pdFRyYWNrRXZlbnRfID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYuZW1pdCgndHJhY2snLCBldmVudCk7XHJcbiAgICAgICAgfTsqL1xyXG4gICAgICAgIHRoaXMudHJhY2tlcl8ub24oJ3RyYWNrJywgdGhpcy5yZWVtaXRUcmFja0V2ZW50Xyk7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdydW4nKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbWl0cyBhIGBzdG9wYCBldmVudCBvbiB0aGUgdHJhY2tlciB0YXNrIGZvciB0aGUgaW1wbGVtZW50ZXJzIHRvIHN0b3AgYW55XHJcbiAgICAgKiBjaGlsZCBhY3Rpb24gYmVpbmcgZG9uZSwgZS5nLiBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYC5cclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBpdHNlbGYsIHNvIGNhbGxzIGNhbiBiZSBjaGFpbmVkLlxyXG4gICAgICovXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pblJ1bm5pbmcoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFJ1bm5pbmcoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZW1pdCgnc3RvcCcpO1xyXG4gICAgICAgIHRoaXMudHJhY2tlcl8ucmVtb3ZlTGlzdGVuZXIoJ3RyYWNrJywgdGhpcy5yZWVtaXRUcmFja0V2ZW50Xyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59IiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIF9FdmVudEVtaXR0ZXIgfSBmcm9tICcuL0V2ZW50RW1pdHRlcidcclxuaW1wb3J0IHsgQ2FudmFzIGFzIF9DYW52YXMgfSBmcm9tICcuL0NhbnZhcydcclxuaW1wb3J0IHsgSW1hZ2UgYXMgX0ltYWdlIH0gZnJvbSAnLi9JbWFnZSdcclxuaW1wb3J0IHsgVHJhY2tlciB9IGZyb20gJy4vVHJhY2tlcidcclxuaW1wb3J0IHsgVHJhY2tlclRhc2sgfSBmcm9tICcuL1RyYWNrZXJUYXNrJ1xyXG5pbXBvcnQgeyBDb2xvclRyYWNrZXIgYXMgX0NvbG9yVHJhY2tlciB9IGZyb20gJy4vQ29sb3JUcmFja2VyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2tpbmcge1xyXG5cclxuICAgIHN0YXRpYyBFdmVudEVtaXR0ZXI6IHR5cGVvZiBfRXZlbnRFbWl0dGVyO1xyXG4gICAgc3RhdGljIENhbnZhczogdHlwZW9mIF9DYW52YXM7XHJcbiAgICBzdGF0aWMgSW1hZ2U6IHR5cGVvZiBfSW1hZ2U7XHJcbiAgICBzdGF0aWMgQ29sb3JUcmFja2VyOiB0eXBlb2YgX0NvbG9yVHJhY2tlcjtcclxuXHJcbiAgICBzdGF0aWMgZ3JheXNjYWxlOiB0eXBlb2YgX0ltYWdlLmdyYXlzY2FsZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIENhcHR1cmVzIHRoZSB1c2VyIGNhbWVyYSB3aGVuIHRyYWNraW5nIGEgdmlkZW8gZWxlbWVudCBhbmQgc2V0IGl0cyBzb3VyY2VcclxuICAgICogdG8gdGhlIGNhbWVyYSBzdHJlYW0uXHJcbiAgICAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gZWxlbWVudCBDYW52YXMgZWxlbWVudCB0byB0cmFjay5cclxuICAgICogQHBhcmFtIHtvYmplY3R9IG9wdF9vcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHRyYWNrZXIuXHJcbiAgICAqL1xyXG4gICAgaW5pdFVzZXJNZWRpYV8oZWxlbWVudDogSFRNTFZpZGVvRWxlbWVudCwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xyXG4gICAgICAgICAgICB2aWRlbzogdHJ1ZSxcclxuICAgICAgICAgICAgYXVkaW86IChvcHRfb3B0aW9ucyAmJiBvcHRfb3B0aW9ucy5hdWRpbykgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBjYXB0dXJlIHVzZXIgY2FtZXJhLicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICogVGVzdHMgd2hldGhlciB0aGUgb2JqZWN0IGlzIGEgZG9tIG5vZGUuXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvIE9iamVjdCB0byBiZSB0ZXN0ZWQuXHJcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG9iamVjdCBpcyBhIGRvbSBub2RlLlxyXG4gICAgKi9cclxuICAgIGlzTm9kZShvOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gby5ub2RlVHlwZSB8fCB0aGlzLmlzV2luZG93KG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBUZXN0cyB3aGV0aGVyIHRoZSBvYmplY3QgaXMgdGhlIGB3aW5kb3dgIG9iamVjdC5cclxuICAgICogQHBhcmFtIHtvYmplY3R9IG8gT2JqZWN0IHRvIGJlIHRlc3RlZC5cclxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIHRoZSBgd2luZG93YCBvYmplY3QuXHJcbiAgICAqL1xyXG4gICAgaXNXaW5kb3cobzogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhKG8gJiYgby5hbGVydCAmJiBvLmRvY3VtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZWxlY3RzIGEgZG9tIG5vZGUgZnJvbSBhIENTUzMgc2VsZWN0b3IgdXNpbmcgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IGZvciB0aGUgcXVlcnkuIFdoZW4gbm90XHJcbiAgICogICAgIHNwZWNpZmllZCBgZG9jdW1lbnRgIGlzIHVzZWQgYXMgcm9vdCBlbGVtZW50LlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgZmlyc3QgZG9tIGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRvIHRoZSBzZWxlY3Rvci5cclxuICAgKiAgICAgSWYgbm90IGZvdW5kLCByZXR1cm5zIGBudWxsYC5cclxuICAgKi9cclxuICAgIG9uZShzZWxlY3RvcjogSFRNTEVsZW1lbnQsIG9wdF9lbGVtZW50PzogYW55KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTm9kZShzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKG9wdF9lbGVtZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFja3MgYSBjYW52YXMsIGltYWdlIG9yIHZpZGVvIGVsZW1lbnQgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBgdHJhY2tlcmBcclxuICAgICAqIGluc3RhbmNlLiBUaGlzIG1ldGhvZCBleHRyYWN0IHRoZSBwaXhlbCBpbmZvcm1hdGlvbiBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICogdG8gcGFzcyB0byB0aGUgYHRyYWNrZXJgIGluc3RhbmNlLiBXaGVuIHRyYWNraW5nIGEgdmlkZW8sIHRoZVxyXG4gICAgICogYHRyYWNrZXIudHJhY2socGl4ZWxzLCB3aWR0aCwgaGVpZ2h0KWAgd2lsbCBiZSBpbiBhXHJcbiAgICAgKiBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBsb29wIGluIG9yZGVyIHRvIHRyYWNrIGFsbCB2aWRlbyBmcmFtZXMuXHJcbiAgICAgKlxyXG4gICAgICogRXhhbXBsZTpcclxuICAgICAqIHZhciB0cmFja2VyID0gbmV3IHRyYWNraW5nLkNvbG9yVHJhY2tlcigpO1xyXG4gICAgICpcclxuICAgICAqIHRyYWNraW5nLnRyYWNrKCcjdmlkZW8nLCB0cmFja2VyKTtcclxuICAgICAqIG9yXHJcbiAgICAgKiB0cmFja2luZy50cmFjaygnI3ZpZGVvJywgdHJhY2tlciwgeyBjYW1lcmE6IHRydWUgfSk7XHJcbiAgICAgKlxyXG4gICAgICogdHJhY2tlci5vbigndHJhY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICogICAvLyBjb25zb2xlLmxvZyhldmVudC5kYXRhWzBdLngsIGV2ZW50LmRhdGFbMF0ueSlcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gdHJhY2ssIGNhbnZhcywgaW1hZ2Ugb3JcclxuICAgICAqICAgICB2aWRlby5cclxuICAgICAqIEBwYXJhbSB7VHJhY2tlcn0gdHJhY2tlciBUaGUgdHJhY2tlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIHRoZVxyXG4gICAgICogICAgIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0X29wdGlvbnMgT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byB0aGUgdHJhY2tlci5cclxuICAgICAqL1xyXG4gICAgdHJhY2soZWxlbWVudDogYW55LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLm9uZShlbGVtZW50KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBmb3VuZCwgdHJ5IGEgZGlmZmVyZW50IGVsZW1lbnQgb3Igc2VsZWN0b3IuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdHJhY2tlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXIgbm90IHNwZWNpZmllZCwgdHJ5IGB0cmFja2luZy50cmFjayhlbGVtZW50LCBuZXcgdHJhY2tpbmcuRmFjZVRyYWNrZXIoKSlgLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSAnY2FudmFzJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNrQ2FudmFzXyhlbGVtZW50LCB0cmFja2VyLCBvcHRfb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ltZyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0ltZ18oZWxlbWVudCwgdHJhY2tlciwgb3B0X29wdGlvbnMpO1xyXG4gICAgICAgICAgICBjYXNlICd2aWRlbyc6XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0X29wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0X29wdGlvbnMuY2FtZXJhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFVzZXJNZWRpYV8oZWxlbWVudCwgb3B0X29wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNrVmlkZW9fKGVsZW1lbnQsIHRyYWNrZXIsIG9wdF9vcHRpb25zKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3Qgc3VwcG9ydGVkLCB0cnkgaW4gYSBjYW52YXMsIGltZywgb3IgdmlkZW8uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYWNrcyBhIGNhbnZhcyBlbGVtZW50IGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgYHRyYWNrZXJgIGluc3RhbmNlIGFuZFxyXG4gICAgICogcmV0dXJucyBhIGBUcmFja2VyVGFza2AgZm9yIHRoaXMgdHJhY2suXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBlbGVtZW50IENhbnZhcyBlbGVtZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHt0cmFja2luZy5UcmFja2VyfSB0cmFja2VyIFRoZSB0cmFja2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgdGhlXHJcbiAgICAgKiAgICAgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgICogQHJldHVybiB7dHJhY2tpbmcuVHJhY2tlclRhc2t9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyYWNrQ2FudmFzXyhlbGVtZW50OiBhbnksIHRyYWNrZXI6IFRyYWNrZXIsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0YXNrID0gbmV3IFRyYWNrZXJUYXNrKHRyYWNrZXIpO1xyXG4gICAgICAgIHRhc2sub24oJ3J1bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi50cmFja0NhbnZhc0ludGVybmFsXyhlbGVtZW50LCB0cmFja2VyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGFzay5ydW4oKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFja3MgYSBjYW52YXMgZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZS4gVGhpc1xyXG4gICAgICogbWV0aG9kIGV4dHJhY3QgdGhlIHBpeGVsIGluZm9ybWF0aW9uIG9mIHRoZSBpbnB1dCBlbGVtZW50IHRvIHBhc3MgdG8gdGhlXHJcbiAgICAgKiBgdHJhY2tlcmAgaW5zdGFuY2UuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBlbGVtZW50IENhbnZhcyBlbGVtZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHt0cmFja2luZy5UcmFja2VyfSB0cmFja2VyIFRoZSB0cmFja2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgdGhlXHJcbiAgICAgKiAgICAgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cmFja0NhbnZhc0ludGVybmFsXyhlbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudCwgdHJhY2tlcjogVHJhY2tlciwgb3B0X29wdGlvbnM/OiBhbnkpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50LndpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50LmhlaWdodDtcclxuICAgICAgICB2YXIgY29udGV4dCA9IGVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB2YXIgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdHJhY2tlci50cmFjayhpbWFnZURhdGEuZGF0YSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgaW1hZ2UgZWxlbWVudCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGB0cmFja2VyYCBpbnN0YW5jZS4gVGhpc1xyXG4gICAgICogbWV0aG9kIGV4dHJhY3QgdGhlIHBpeGVsIGluZm9ybWF0aW9uIG9mIHRoZSBpbnB1dCBlbGVtZW50IHRvIHBhc3MgdG8gdGhlXHJcbiAgICAgKiBgdHJhY2tlcmAgaW5zdGFuY2UuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGVsZW1lbnQgQ2FudmFzIGVsZW1lbnQgdG8gdHJhY2suXHJcbiAgICAgKiBAcGFyYW0ge1RyYWNrZXJ9IHRyYWNrZXIgVGhlIHRyYWNrZXIgaW5zdGFuY2UgdXNlZCB0byB0cmFjayB0aGVcclxuICAgICAqICAgICBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdF9vcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHRyYWNrZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyYWNrSW1nXyhlbGVtZW50OiBhbnksIHRyYWNrZXI6IFRyYWNrZXIsIG9wdF9vcHRpb25zPzogYW55KSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC53aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICB2YXIgdGFzayA9IG5ldyBUcmFja2VyVGFzayh0cmFja2VyKTtcclxuICAgICAgICB0YXNrLm9uKCdydW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIFRyYWNraW5nLkNhbnZhcy5sb2FkSW1hZ2UoY2FudmFzLCBlbGVtZW50LnNyYywgMCwgMCwgd2lkdGgsIGhlaWdodCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFja0NhbnZhc0ludGVybmFsXyhjYW52YXMsIHRyYWNrZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGFzay5ydW4oKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFja3MgYSB2aWRlbyBlbGVtZW50IGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgYHRyYWNrZXJgIGluc3RhbmNlLiBUaGlzXHJcbiAgICAgKiBtZXRob2QgZXh0cmFjdCB0aGUgcGl4ZWwgaW5mb3JtYXRpb24gb2YgdGhlIGlucHV0IGVsZW1lbnQgdG8gcGFzcyB0byB0aGVcclxuICAgICAqIGB0cmFja2VyYCBpbnN0YW5jZS4gVGhlIGB0cmFja2VyLnRyYWNrKHBpeGVscywgd2lkdGgsIGhlaWdodClgIHdpbGwgYmUgaW5cclxuICAgICAqIGEgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgbG9vcCBpbiBvcmRlciB0byB0cmFjayBhbGwgdmlkZW8gZnJhbWVzLlxyXG4gICAgICogQHBhcmFtIHtIVE1MVmlkZW9FbGVtZW50fSBlbGVtZW50IENhbnZhcyBlbGVtZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtUcmFja2VyfSB0cmFja2VyIFRoZSB0cmFja2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgdGhlXHJcbiAgICAgKiAgICAgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRfb3B0aW9ucyBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIHRoZSB0cmFja2VyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICBwcml2YXRlIHRyYWNrVmlkZW9fIChlbGVtZW50OiBIVE1MVmlkZW9FbGVtZW50LCB0cmFja2VyOiBUcmFja2VyLCBvcHRfb3B0aW9ucz86IGFueSkge1xyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHZhciB3aWR0aDogbnVtYmVyO1xyXG4gICAgdmFyIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIHZhciByZXNpemVDYW52YXNfID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgICAgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfTtcclxuICAgIHJlc2l6ZUNhbnZhc18oKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FudmFzXyk7XHJcblxyXG4gICAgdmFyIHJlcXVlc3RJZDogbnVtYmVyO1xyXG4gICAgdmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZV8gPSAoKSA9PiB7XHJcbiAgICAgIHJlcXVlc3RJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnJlYWR5U3RhdGUgPT09IGVsZW1lbnQuSEFWRV9FTk9VR0hfREFUQSkge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gRmlyZWZveCB2fjMwLjAgZ2V0cyBjb25mdXNlZCB3aXRoIHRoZSB2aWRlbyByZWFkeVN0YXRlIGZpcmluZyBhblxyXG4gICAgICAgICAgICAvLyBlcnJvbmVvdXMgSEFWRV9FTk9VR0hfREFUQSBqdXN0IGJlZm9yZSBIQVZFX0NVUlJFTlRfREFUQSBzdGF0ZSxcclxuICAgICAgICAgICAgLy8gaGVuY2Uga2VlcCB0cnlpbmcgdG8gcmVhZCBpdCB1bnRpbCByZXNvbHZlZC5cclxuICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoZWxlbWVudCwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHt9XHJcbiAgICAgICAgICB0aGlzLnRyYWNrQ2FudmFzSW50ZXJuYWxfKGNhbnZhcywgdHJhY2tlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZV8oKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB0YXNrID0gbmV3IFRyYWNrZXJUYXNrKHRyYWNrZXIpO1xyXG4gICAgdGFzay5vbignc3RvcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElkKTtcclxuICAgIH0pO1xyXG4gICAgdGFzay5vbigncnVuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZV8oKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRhc2sucnVuKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gICAgcHVibGljIEV2ZW50RW1pdHRlciA9IF9FdmVudEVtaXR0ZXI7XHJcblxyXG4gICAgcHVibGljIENhbnZhcyA9IF9DYW52YXM7XHJcblxyXG4gICAgcHVibGljIEltYWdlID0gX0ltYWdlO1xyXG5cclxuICAgIHB1YmxpYyBDb2xvclRyYWNrZXIgPSBfQ29sb3JUcmFja2VyO1xyXG59XHJcblxyXG5UcmFja2luZy5FdmVudEVtaXR0ZXIgPSBfRXZlbnRFbWl0dGVyO1xyXG5cclxuVHJhY2tpbmcuQ2FudmFzID0gX0NhbnZhcztcclxuXHJcblRyYWNraW5nLkltYWdlID0gX0ltYWdlO1xyXG5cclxuVHJhY2tpbmcuQ29sb3JUcmFja2VyID0gX0NvbG9yVHJhY2tlcjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBUcmFja2luZyBmcm9tIFwiLi9UcmFja2luZ1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBUcmFja2luZ1xyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9