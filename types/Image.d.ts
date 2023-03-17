export declare class Image {
    constructor();
    blur(pixels: Float32Array, width: number, height: number, diameter: number): Float32Array;
    computeIntegralImage(pixels: Uint8ClampedArray, width: number, height: number, opt_integralImage: any, opt_integralImageSquare: any, opt_tiltedIntegralImage: any, opt_integralImageSobel: any): void;
    private computePixelValueRSAT_;
    computePixelValueSAT_(SAT: number[], width: number, i: number, j: number, pixel: number): void;
    grayscale(pixels: Uint8ClampedArray, width: number, height: number, fillRGBA: boolean): Uint8ClampedArray;
    horizontalConvolve(pixels: Float32Array, width: number, height: number, weightsVector: Float32Array, opaque: boolean): Float32Array;
    verticalConvolve(pixels: Float32Array, width: number, height: number, weightsVector: Float32Array, opaque: boolean): Float32Array;
    separableConvolve(pixels: Float32Array, width: number, height: number, horizWeights: Float32Array, vertWeights: Float32Array, opaque?: boolean): Float32Array;
    sobel(pixels: Uint8ClampedArray, width: number, height: number): Float32Array;
    equalizeHist(pixels: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray;
}
