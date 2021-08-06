export const calcStatus: (filled: number) => 'Unfilled' | 'Partially Filled' = (filled) => {
    if (filled > 0) {
        return 'Partially Filled';
    }
    return 'Unfilled';
};

/**
 * Calculate if a value is within a certain range above
 * @param epsilon decimal percental range
 * @param a
 * @param b
 */
export const isWithinRange: (epsilon: number, a: number, b: number) => boolean = (epsilon, a, b) =>
    Math.max(Math.abs(1 - b / a), Math.abs(1 - a / b)) < epsilon;
