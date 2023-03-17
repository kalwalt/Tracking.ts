import { Tracker } from './Tracker';
export declare class ColorTracker extends Tracker {
    constructor(opt_colors: string | Array<string>);
    private static knownColors_;
    private static neighbours_;
    static registerColor(name: string, fn: (r: number, g: number, b: number) => boolean): any;
    static getColor(name: string): any;
    colors: Array<string>;
    minDimension: number;
    maxDimension: number;
    minGroupSize: number;
    private calculateDimensions_;
    getColors(): Array<string>;
    getMinDimension(): number;
    getMaxDimension(): number;
    getMinGroupSize(): number;
    private getNeighboursForWidth_;
    private mergeRectangles_;
    setColors(colors: Array<string>): void;
    setMinDimension(minDimension: number): void;
    setMaxDimension(maxDimension: number): void;
    setMinGroupSize(minGroupSize: number): void;
    track(pixels: Uint8ClampedArray, width: number, height: number): void;
    private trackColor_;
}
