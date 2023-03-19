export declare class Fast {
    constructor();
    static THRESHOLD: number;
    private static circles_;
    static findCorners(pixels: Int32Array, width: number, height: number, opt_threshold?: number): number[];
    static isBrighter(circlePixel: number, p: number, threshold: number): boolean;
    static isCorner(p: number, circlePixels: Int32Array, threshold: number): boolean;
    static isDarker(circlePixel: number, p: number, threshold: number): boolean;
    static isTriviallyExcluded(circlePixels: Int32Array, p: number, threshold: number): boolean;
    private static getCircleOffsets_;
}
