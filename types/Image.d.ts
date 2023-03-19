export declare class Image {
    constructor();
    static blur(pixels: Float32Array, width: number, height: number, diameter: number): Float32Array;
    static computeIntegralImage(pixels: Uint8ClampedArray, width: number, height: number, opt_integralImage: any, opt_integralImageSquare: any, opt_tiltedIntegralImage: any, opt_integralImageSobel: any): void;
    private static computePixelValueRSAT_;
    private static computePixelValueSAT_;
    static grayscale(pixels: Uint8ClampedArray, width: number, height: number, fillRGBA: boolean): Uint8ClampedArray;
    static horizontalConvolve(pixels: Float32Array, width: number, height: number, weightsVector: Float32Array, opaque: boolean): Float32Array;
    static verticalConvolve(pixels: Float32Array, width: number, height: number, weightsVector: Float32Array, opaque: boolean): Float32Array;
    static separableConvolve(pixels: Float32Array, width: number, height: number, horizWeights: Float32Array, vertWeights: Float32Array, opaque?: boolean): Float32Array;
    static sobel(pixels: Uint8ClampedArray, width: number, height: number): Float32Array;
    static equalizeHist(pixels: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray;
}
