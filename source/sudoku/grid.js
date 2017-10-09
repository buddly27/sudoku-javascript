/**
 * Sudoku grid.
 */

/* eslint-disable object-property-newline */

import _ from "lodash";

import {SudokuCell} from "./cell";


/**
 * Represent a Sudoku Grid object.
 */
export class SudokuGrid {
    /**
     * Create a Sudoku Grid 9x9 from a *cellMapping*.
     *
     * *cellMapping* should be a mapping containing values of each cell
     * between 0 and 9 (0 means that the cell is not filled). The grid contains
     * 81 cells with 81 corresponding cell identifier properties that specify
     * the position of the cell in the grid. The first number and the second
     * number of the property name indicate respectfully the row index and the
     * column index. 'c00' indicates the cell in the top left corner and 'c88'
     * the cell in the bottom right corner.
     *
     * By default, each cell is initiated to 0.
     *
     *
     * Example::
     *
     *     >>> new SudokuGrid({
     *     ...     c03: 1, c05: 5,
     *     ...     c10: 1, c11: 4, c16: 6, c17: 7,
     *     ...     c21: 8, c25: 2, c26: 4,
     *     ...     c31: 6, c32: 3, c34: 7, c37: 1,
     *     ...     c40: 9, c48: 3,
     *     ...     c51: 1, c54: 9, c56: 5, c57: 2,
     *     ...     c62: 7, c63: 2, c67: 8,
     *     ...     c71: 2, c72: 6, c77: 3, c78: 5,
     *     ...     c83: 4, c85: 9,
     *     ... });
     */
    constructor(cellMapping = {}) {
        this.blockRowSize = 3;
        this.blockColumnSize = 3;
        this.rowSize = this.blockRowSize * 3;
        this.columnSize = this.blockColumnSize * 3;

        const {
            c00 = 0, c01 = 0, c02 = 0, c03 = 0, c04 = 0,
            c05 = 0, c06 = 0, c07 = 0, c08 = 0,
            c10 = 0, c11 = 0, c12 = 0, c13 = 0, c14 = 0,
            c15 = 0, c16 = 0, c17 = 0, c18 = 0,
            c20 = 0, c21 = 0, c22 = 0, c23 = 0, c24 = 0,
            c25 = 0, c26 = 0, c27 = 0, c28 = 0,
            c30 = 0, c31 = 0, c32 = 0, c33 = 0, c34 = 0,
            c35 = 0, c36 = 0, c37 = 0, c38 = 0,
            c40 = 0, c41 = 0, c42 = 0, c43 = 0, c44 = 0,
            c45 = 0, c46 = 0, c47 = 0, c48 = 0,
            c50 = 0, c51 = 0, c52 = 0, c53 = 0, c54 = 0,
            c55 = 0, c56 = 0, c57 = 0, c58 = 0,
            c60 = 0, c61 = 0, c62 = 0, c63 = 0, c64 = 0,
            c65 = 0, c66 = 0, c67 = 0, c68 = 0,
            c70 = 0, c71 = 0, c72 = 0, c73 = 0, c74 = 0,
            c75 = 0, c76 = 0, c77 = 0, c78 = 0,
            c80 = 0, c81 = 0, c82 = 0, c83 = 0, c84 = 0,
            c85 = 0, c86 = 0, c87 = 0, c88 = 0,
        } = cellMapping;

        this._grid = [
            [c00, c01, c02, c03, c04, c05, c06, c07, c08].map(
                (value, index) => new SudokuCell(value, 0, index)
            ),
            [c10, c11, c12, c13, c14, c15, c16, c17, c18].map(
                (value, index) => new SudokuCell(value, 1, index)
            ),
            [c20, c21, c22, c23, c24, c25, c26, c27, c28].map(
                (value, index) => new SudokuCell(value, 2, index)
            ),
            [c30, c31, c32, c33, c34, c35, c36, c37, c38].map(
                (value, index) => new SudokuCell(value, 3, index)
            ),
            [c40, c41, c42, c43, c44, c45, c46, c47, c48].map(
                (value, index) => new SudokuCell(value, 4, index)
            ),
            [c50, c51, c52, c53, c54, c55, c56, c57, c58].map(
                (value, index) => new SudokuCell(value, 5, index)
            ),
            [c60, c61, c62, c63, c64, c65, c66, c67, c68].map(
                (value, index) => new SudokuCell(value, 6, index)
            ),
            [c70, c71, c72, c73, c74, c75, c76, c77, c78].map(
                (value, index) => new SudokuCell(value, 7, index)
            ),
            [c80, c81, c82, c83, c84, c85, c86, c87, c88].map(
                (value, index) => new SudokuCell(value, 8, index)
            ),
        ];
    }

    /**
     * Return the value of a cell from *rowIndex* and *columnIndex*.
     */
    cell(rowIndex, columnIndex) {
        return this._grid[rowIndex][columnIndex];
    }

    /**
     * Return list of values from all cells in row from *rowIndex*.
     */
    cellsInRow(rowIndex) {
        return this._grid[rowIndex];
    }

    /**
     * Return list of values from all cells in column from *columnIndex*.
     */
    cellsInColumn(columnIndex) {
        return this._grid.map((row) => row[columnIndex]);
    }

    /**
     * Return list of values from all cells in block from *rowIndex* and
     * *columnIndex*.
     */
    cellsInBlock(rowIndex, columnIndex) {
        const cells = [];

        const rows = _.range(rowIndex, rowIndex + this.blockRowSize);
        const columns = _.range(
            columnIndex, columnIndex + this.blockColumnSize
        );

        rows.forEach((_rowIndex) => {
            columns.forEach((_columnIndex) => {
                cells.push(this.cell(_rowIndex, _columnIndex));
            });
        });

        return cells;
    }

    /**
     * Indicate whether the grid is solved.
     *
     * A grid is considered solved when all cells are solved, meaning when
     * all cell has a value other than zero.
     */
    isSolved() {
        // eslint-disable-next-line no-restricted-syntax
        for (const cells of this._grid) {
            // eslint-disable-next-line no-restricted-syntax
            for (const cell of cells) {
                if (!cell.isSolved()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Update the grid and return whether the grid has been modified.
     *
     * Analyse the grid for possible solved cells and compute the resulting
     * candidates for each cell. Repeat this two operations as long as solved
     * cells are found.
     */
    update() {
        let call = 0;

        do {
            this.updateSolvedCells();
            call += 1;
        } while (this.updateCandidates());

        return call > 1;
    }

    /**
     * Update all cells that can be solved and return the number of solutions
     * found.
     *
     * A cell which has a single candidate left can be updated with the value
     * of this candidate.
     */
    updateSolvedCells() {
        let solutionFound = 0;

        this._grid.forEach((cells) => {
            cells.forEach((cell) => {
                if (cell.resolve()) {
                    solutionFound += 1;
                }
            });
        });

        return solutionFound;
    }

    /**
     * Update candidates for all cells and return whether the grid has been
     * modified.
     *
     * For each 3x3 block, each cell candidates is compared with the value
     * contained in the neighbor block, row and column. If a number from the
     * cell candidates list is matching values from neighbors, it is removed
     * from the cell candidates list.
     *
     * For each cell containing a 'next' list of new candidates found while
     * applying a strategy, this list is simply replacing the old candidate
     * list.
     */
    updateCandidates() {
        let candidatesChanged = false;

        const valuesInRows = _.range(this.rowSize).map((rowIndex) =>
            this.cellsInRow(rowIndex)
                .map((cell) => cell.value())
                .filter((value) => value !== 0)
        );

        const valuesInColumns = _.range(this.columnSize).map((columnIndex) =>
            this.cellsInColumn(columnIndex)
                .map((cell) => cell.value())
                .filter((value) => value !== 0)
        );

        const rows = _.range(0, this.rowSize, this.blockRowSize);
        const columns = _.range(0, this.columnSize, this.blockColumnSize);

        rows.forEach((rowIndex) => {
            columns.forEach((columnIndex) => {
                const cells = this.cellsInBlock(rowIndex, columnIndex);

                // Get all positive values in the block
                const blockValues = cells
                    .map((cell) => cell.value())
                    .filter((value) => value !== 0);

                cells.forEach((cell) => {
                    if (cell.applyNextCandidates()) {
                        candidatesChanged = true;
                    }
                    else {
                        const updated = cell.updateCandidates(
                            valuesInRows[cell.row()],
                            valuesInColumns[cell.column()],
                            blockValues,
                        );
                        if (updated) {
                            candidatesChanged = true;
                        }
                    }
                });
            });
        });

        return candidatesChanged;
    }

    /**
     * Return the content of the grid as a cell mapping.
     *
     * The mapping is similar to the *cellsMapping* argument given to the
     * :meth:`~sudoku.grid.SudokuGrid.constructor`.
     */
    toMapping() {
        const mapping = {};

        this._grid.forEach((cells) => {
            cells.forEach((cell) => {
                mapping[`c${cell.row()}${cell.column()}`] = cell.value();
            });
        });

        return mapping;
    }
}
