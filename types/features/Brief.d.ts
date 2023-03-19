interface IMatches {
    index1: number;
    index2: number;
    keypoint1: Array<number>;
    keypoint2: Array<number>;
    confidence: number;
}
export declare class Brief {
    constructor();
    private math;
    static N: number;
    private static randomImageOffsets_;
    private static randomWindowOffsets_;
    static getDescriptors(pixels: number[], width: number, keypoints: number[]): Int32Array;
    static match(keypoints1: number[], descriptors1: number[], keypoints2: number[], descriptors2: number[]): Array<IMatches>;
    static reciprocalMatch(keypoints1: number[], descriptors1: number[], keypoints2: number[], descriptors2: number[]): IMatches[];
    private static getRandomOffsets_;
}
export {};
