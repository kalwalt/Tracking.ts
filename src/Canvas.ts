export class Canvas {
    /**
     * Canvas utility.
     * @constructor
     */
    constructor() { }

    /**
   * Loads an image source into the canvas.
   * @param {HTMLCanvasElement} canvas The canvas dom element.
   * @param {string} src The image source.
   * @param {number} x The canvas horizontal coordinate to load the image.
   * @param {number} y The canvas vertical coordinate to load the image.
   * @param {number} width The image width.
   * @param {number} height The image height.
   * @param {function} opt_callback Callback that fires when the image is loaded
   *     into the canvas.
   * @static
   */
    static loadImage(canvas: HTMLCanvasElement, src: string, x: number, y: number, width: number, height: number, opt_callback: Function) {
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
    };
}