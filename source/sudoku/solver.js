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
     * Apply all strategies successively in order to resolve the *grid*.
     *
     * Each strategy is applied to the *grid* until the *grid* is resolved or
     * until no progress can be made.
     *
     * *grid* must be a :class:`sudoku.grid.SudokuGrid` instance.
     *
     * Return a list of modified :class:`sudoku.cell.SudokuCell` instances.
     */
    resolve(grid) {
        let modifiedCells = [];

        while (grid.update()) {
            const solved = grid.isSolved();
            if (solved) {
                break;
            }

            const _modifiedCells = this.applyStrategiesUntilFirstResult(grid);
            modifiedCells = modifiedCells.concat(_modifiedCells);
        }

        return modifiedCells;
    }

    /**
     * Apply the strategies until one is resolving part of the grid.
     *
     * *grid* must be a :class:`sudoku.grid.SudokuGrid` instance.
     *
     * Return a list of modified :class:`sudoku.cell.SudokuCell` instances.
     */
    applyStrategiesUntilFirstResult(grid) {
        let modifiedCells = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const strategy of this.strategies) {
            if (strategy.processGrid) {
                modifiedCells = strategy.processGrid(grid);
                if (modifiedCells.length > 0) {
                    const id = strategy.identifier;
                    if (this.strategiesUsed.indexOf(id) === -1) {
                        this.strategiesUsed.push(id);
                    }
                    break;
                }
            }
        }

        return modifiedCells;
    }
}
