/**
 * Sudoku solver.
 */

import {
    HiddenSingleStrategy,
    HiddenPairStrategy,
    HiddenTripleStrategy,
    HiddenQuadStrategy,
    NakedPairStrategy,
    NakedTripleStrategy,
    PointingStrategy,
    BoxLineReductionStrategy,
} from "./strategy";


/**
 * Represent a Sudoku Solver object.
 */
export class SudokuSolver {
    /**
     * Create a Sudoku Solver.
     *
     * The list of strategies to use in order to resolve a grid is initiated.
     */
    constructor() {
        this.strategies = [
            HiddenSingleStrategy,
            HiddenPairStrategy,
            HiddenTripleStrategy,
            HiddenQuadStrategy,
            NakedPairStrategy,
            NakedTripleStrategy,
            PointingStrategy,
            BoxLineReductionStrategy,
        ];

        this.strategiesUsed = [];
    }

    /**
     * Attempt to resolve the *grid* and return whether it has been solved.
     *
     * Apply each strategy in order any time it produce a result that lead to
     * a modification of the grid.
     */
    resolve(grid) {
        let solved = false;

        while (grid.update()) {
            solved = grid.isSolved();
            if (solved) {
                break;
            }

            this.applyStrategiesUntilFirstResult(grid);
        }

        return solved;
    }

    /**
     * Apply the strategies until one is resolving part of the grid.
     */
    applyStrategiesUntilFirstResult(grid) {
        // eslint-disable-next-line no-restricted-syntax
        for (const strategy of this.strategies) {
            if (strategy.processGrid) {
                const results = strategy.processGrid(grid);
                if (results.length > 0) {
                    const id = strategy.identifier;
                    if (this.strategiesUsed.indexOf(id) === -1) {
                        this.strategiesUsed.push(id);
                    }
                    break;
                }
            }
        }
    }
}
