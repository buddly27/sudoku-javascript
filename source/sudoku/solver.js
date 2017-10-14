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
     * Return a mapping of each modified :class:`sudoku.cell.SudokuCell`
     * instances organized per identifier.
     *
     * Example::
     *
     *     >>> solver.resolve(grid)
     *     {
     *         "c15": [SudokuCell],
     *         "c16": [SudokuCell],
     *         "c18": [SudokuCell],
     *         "c40": [SudokuCell],
     *         "c43": [SudokuCell],
     *     }
     */
    resolve(grid) {
        let mapping = {};

        while (grid.update()) {
            const solved = grid.isSolved();
            if (solved) {
                break;
            }

            const _mapping = this.applyStrategiesUntilFirstResult(grid);
            mapping = Object.assign({}, mapping, _mapping);
        }

        return mapping;
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
        const mapping = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const strategy of this.strategies) {
            if (strategy.processGrid) {
                const modifiedCells = strategy.processGrid(grid);
                if (modifiedCells.length > 0) {
                    const id = strategy.identifier;
                    if (this._strategiesUsed.indexOf(id) === -1) {
                        this._strategiesUsed.push(id);
                    }

                    modifiedCells.forEach((cell) => {
                        mapping[cell.identifier] = cell;
                    });
                    break;
                }
            }
        }

        return mapping;
    }
}
