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
        this._strategies = [
            HiddenSingleStrategy,
            HiddenPairStrategy,
            HiddenTripleStrategy,
            HiddenQuadStrategy,
            NakedPairStrategy,
            NakedTripleStrategy,
            PointingStrategy,
            BoxLineReductionStrategy,
        ];

        this._strategiesUsed = [];
    }

    /** Return a list of all strategies available. */
    get strategies() {
        return this._strategies;
    }

    /** Return a list of identifiers for each strategy used. */
    get strategiesUsed() {
        return this._strategiesUsed;
    }

    /**
     * Apply all strategies successively in order to resolve the *grid*.
     *
     * Each strategy is applied to the *grid* until the *grid* is resolved or
     * until no progress can be made.
     *
     * *grid* must be a :class:`sudoku.grid.SudokuGrid` instance.
     *
     * Return whether the grid has been successfully solved.
     */
    resolve(grid) {
        let solved = false;
        let solutionsFound;

        do {
            solutionsFound = 0;

            // Update candidates for each cell of the grid and find potential
            // values.
            grid.update();

            // If the grid is already solved, stop here.
            solved = grid.isSolved();
            if (solved) {
                break;
            }

            // Apply all strategy until one return a result.
            const mapping = this.applyStrategiesUntilFirstResult(grid);

            // Update the grid with new candidates found.
            // eslint-disable-next-line no-loop-func
            Object.keys(mapping).forEach((identifier) => {
                const cell = grid.cellFromId(identifier);
                cell.candidates = mapping[identifier].candidates;
                solutionsFound += 1;
            });

            // Keep looping if solutions have been found.
        } while (solutionsFound);


        return solved;
    }

    /**
     * Apply the strategies until one is resolving part of the grid.
     *
     * *grid* must be a :class:`sudoku.grid.SudokuGrid` instance.
     *
     * Return a mapping of each modified :class:`sudoku.cell.SudokuCell`
     * instances organized per identifier.
     *
     * Example::
     *
     *     >>> solver.applyStrategiesUntilFirstResult(grid)
     *     {
     *         "c40": [SudokuCell],
     *         "c43": [SudokuCell],
     *     }
     */
    applyStrategiesUntilFirstResult(grid) {
        let mapping = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const strategy of this.strategies) {
            if (strategy.processGrid) {
                mapping = strategy.processGrid(grid);
                if (Object.keys(mapping).length > 0) {
                    const id = strategy.identifier;
                    if (this._strategiesUsed.indexOf(id) === -1) {
                        this._strategiesUsed.push(id);
                    }
                    break;
                }
            }
        }

        return mapping;
    }
}
