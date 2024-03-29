export class Math {
    constructor() { };

    /**
     * Euclidean distance between two points P(x0, y0) and P(x1, y1).
     * @param {number} x0 Horizontal coordinate of P0.
     * @param {number} y0 Vertical coordinate of P0.
     * @param {number} x1 Horizontal coordinate of P1.
     * @param {number} y1 Vertical coordinate of P1.
     * @return {number} The euclidean distance.
     */
    static distance(x0: number, y0: number, x1: number, y1: number): number {
        var dx = x1 - x0;
        var dy = y1 - y0;

        return globalThis.Math.sqrt(dx * dx + dy * dy);
    };

    /**
     * Calculates the Hamming weight of a string, which is the number of symbols that are
     * different from the zero-symbol of the alphabet used. It is thus
     * equivalent to the Hamming distance from the all-zero string of the same
     * length. For the most typical case, a string of bits, this is the number
     * of 1's in the string.
     *
     * Example:
     *
     * <pre>
     *  Binary string     Hamming weight
     *   11101                 4
     *   11101010              5
     * </pre>
     *
     * @param {number} i Number that holds the binary string to extract the hamming weight.
     * @return {number} The hamming weight.
     */

    static hammingWeight(i: number) {
        i = i - ((i >> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >> 2) & 0x33333333);

        return ((i + (i >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    };

    /**
     * Generates a random number between [a, b] interval.
     * @param {number} a
     * @param {number} b
     * @return {number}
     */
    static uniformRandom(a: number, b: number): number {
        return a + globalThis.Math.random() * (b - a);
    };

    /**
     * Tests if a rectangle intersects with another.
     *
     *  <pre>
     *  x0y0 --------       x2y2 --------
     *      |       |           |       |
     *      -------- x1y1       -------- x3y3
     * </pre>
     *
     * @param {number} x0 Horizontal coordinate of P0.
     * @param {number} y0 Vertical coordinate of P0.
     * @param {number} x1 Horizontal coordinate of P1.
     * @param {number} y1 Vertical coordinate of P1.
     * @param {number} x2 Horizontal coordinate of P2.
     * @param {number} y2 Vertical coordinate of P2.
     * @param {number} x3 Horizontal coordinate of P3.
     * @param {number} y3 Vertical coordinate of P3.
     * @return {boolean}
     */
    static intersectRect(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean {
        return !(x2 > x1 || x3 < x0 || y2 > y1 || y3 < y0);
    };
}