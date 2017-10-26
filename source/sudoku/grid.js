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
     * *cellMapping* could be a mapping containing values of each cell
     * between 0 and 9 (0 means that the cell is not filled). The grid contains
     * 81 cells with 81 corresponding cell identifier properties that specify
     * the position of the cell in the grid. The first number and the second
     * number of the property name indicate respectfully the row index and the
     * column index. 'c00' indicates the cell in the top left corner and 'c88'
     * the cell in the bottom right corner.
     *
     * By default, each cell is initiated to 0.
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
     *
     * *candidatesMapping* could be a mapping containing candidate numbers of
     * each cell, following the same identification logic as the *cellMapping*.
     *
     * By default, the candidate numbers of each cell are generated according to
     * the initial value of the cell.
     *
     * Example::
     *
     *     >>> grid = new SudokuGrid(
     *     ...     {
     *     ...         c00: 3,
     *     ...         c10: 9, c11: 7, c13: 2, c14: 1,
     *     ...         c20: 6, c23: 5, c24: 8, c25: 3,
     *     ...         c30: 2, c36: 9,
     *     ...         c40: 5, c43: 6, c44: 2, c45: 1, c48: 3,
     *     ...         c52: 8, c58: 5,
     *     ...         c63: 4, c64: 3, c65: 5, c68: 2,
     *     ...         c74: 9, c77: 5, c78: 6,
     *     ...         c88: 1,
     *     ...     },
     *     ...     {
     *     ...         c01: [1, 2, 4, 5, 8], c02: [1, 2, 4, 5], c03: [2, 7, 9],
     *     ...         c04: [4, 6, 7], c05: [2, 4, 6, 7, 9],
     *     ...         c06: [1, 2, 4, 5, 6, 7, 8], c07: [1, 2, 4, 6, 7, 8, 9],
     *     ...         c08: [4, 7, 8, 9],
     *     ...         c12: [2, 4, 5], c15: [2, 4, 6], c16: [2, 3, 4, 5, 6, 8],
     *     ...         c17: [2, 3, 4, 6, 8], c18: [4, 8],
     *     ...         c21: [1, 2, 4], c22: [1, 2, 4], c26: [1, 2, 4, 7],
     *     ...         c27: [1, 2, 4, 7, 9], c28: [4, 7, 9],
     *     ...         c31: [1, 3, 4, 6], c32: [1, 3, 4, 6, 7], c33: [3, 7, 8],
     *     ...         c34: [4, 5, 7], c35: [4, 7, 8], c37: [1, 4, 6, 7, 8],
     *     ...         c38: [4, 7, 8],
     *     ...         c41: [4, 9], c42: [4, 7, 9], c46: [4, 7, 8], c47: [4, 7, 8],
     *     ...         c50: [1, 4, 7], c51: [1, 3, 4, 6, 9], c53: [3, 7, 9],
     *     ...         c54: [4, 7], c55: [4, 7, 9], c56: [1, 2, 4, 6, 7],
     *     ...         c57: [1, 2, 4, 6, 7],
     *     ...         c60: [1, 7, 8], c61: [1, 6, 8, 9], c62: [1, 6, 7, 9],
     *     ...         c66: [7, 8], c67: [7, 8, 9],
     *     ...         c70: [1, 4, 7, 8], c71: [1, 2, 3, 4, 8],
     *     ...         c72: [1, 2, 3, 4, 7], c73: [1, 2, 7, 8], c75: [2, 7, 8],
     *     ...         c76: [3, 4, 7, 8],
     *     ...         c80: [4, 7, 8], c81: [2, 3, 4, 5, 6, 8, 9],
     *     ...         c82: [2, 3, 4, 5, 6, 7, 9], c83: [2, 7, 8], c84: [6, 7],
     *     ...         c85: [2, 6, 7, 8], c86: [3, 4, 7, 8, 9],
     *     ...         c87: [3, 4, 7, 8, 9],
     *     ...     }
     *     ... );
     *
     * .. warning ::
     *
     *      An Error will be raised if the custom list of candidates given to
     *      a cell is incoherent with its value.
     */
    constructor(cellMapping = {}, candidatesMapping = {}) {
        this._blockRowSize = 3;
        this._blockColumnSize = 3;
        this._rowSize = this._blockRowSize * 3;
        this._columnSize = this._blockColumnSize * 3;

        const gridIdentifiers = [
            ["c00", "c01", "c02", "c03", "c04", "c05", "c06", "c07", "c08"],
            ["c10", "c11", "c12", "c13", "c14", "c15", "c16", "c17", "c18"],
            ["c20", "c21", "c22", "c23", "c24", "c25", "c26", "c27", "c28"],
            ["c30", "c31", "c32", "c33", "c34", "c35", "c36", "c37", "c38"],
            ["c40", "c41", "c42", "c43", "c44", "c45", "c46", "c47", "c48"],
            ["c50", "c51", "c52", "c53", "c54", "c55", "c56", "c57", "c58"],
            ["c60", "c61", "c62", "c63", "c64", "c65", "c66", "c67", "c68"],
            ["c70", "c71", "c72", "c73", "c74", "c75", "c76", "c77", "c78"],
            ["c80", "c81", "c82", "c83", "c84", "c85", "c86", "c87", "c88"],
        ];

        this._grid = gridIdentifiers.map((rowIdentifiers, rowIndex) =>
            rowIdentifiers.map((identifier, columnIndex) =>
                new SudokuCell(
                    cellMapping[identifier] || 0, rowIndex, columnIndex,
                    candidatesMapping[identifier]
                )
            )
        );
    }

    /** Return the number of rows. */
    get rowSize() {
        return this._rowSize;
    }

    /** Return the number of columns. */
    get columnSize() {
        return this._columnSize;
    }

    /** Return the number of rows within each block. */
    get blockRowSize() {
        return this._blockRowSize;
    }

    /** Return the number of columns within each block. */
    get blockColumnSize() {
        return this._blockColumnSize;
    }

    /**
     * Return the value of a cell from *rowIndex* and *columnIndex*.
     */
    cell(rowIndex, columnIndex) {
        return this._grid[rowIndex][columnIndex];
    }

    /**
     * Return the cell from its *identifier*.
     *
     * Throw an error if the identifier is incorrect.
     */
    cellFromId(identifier) {
        const matched = /^c(\d)(\d)$/.exec(identifier);
        if (!matched) {
            throw Error(
                `Impossible to find the cell identified as '${identifier}'`
            );
        }

        return this._grid[Number(matched[1])][Number(matched[2])];
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
     * Update the grid and return the number of solutions found.
     *
     * Analyse the grid for possible solved cells and compute the resulting
     * candidates for each cell. Repeat this two operations as long as new
     * candidates are found.
     */
    update() {
        let solutionFound = 0;

        do {
            solutionFound += this.updateSolvedCells();
        } while (this.updateCandidates());

        return solutionFound;
    }

    /**
     * Attempt to resolve all cells in the grid and return the number of
     * solutions found.
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
     */
    updateCandidates() {
        let candidatesChanged = false;

        // Get all positive values from all rows
        const valuesInRows = _.range(this.rowSize).map((rowIndex) =>
            this.cellsInRow(rowIndex)
                .map((cell) => cell.value)
                .filter((value) => value !== 0)
        );

        // Get all positive values from all columns
        const valuesInColumns = _.range(this.columnSize).map((columnIndex) =>
            this.cellsInColumn(columnIndex)
                .map((cell) => cell.value)
                .filter((value) => value !== 0)
        );

        const rows = _.range(0, this.rowSize, this.blockRowSize);
        const columns = _.range(0, this.columnSize, this.blockColumnSize);

        rows.forEach((rowIndex) => {
            columns.forEach((columnIndex) => {
                const cells = this.cellsInBlock(rowIndex, columnIndex);

                // Get all positive values in the block
                const blockValues = cells
                    .map((cell) => cell.value)
                    .filter((value) => value !== 0);

                cells.forEach((cell) => {
                    const updated = cell.updateCandidates(
                        valuesInRows[cell.rowIndex],
                        valuesInColumns[cell.columnIndex],
                        blockValues,
                    );
                    if (updated) {
                        candidatesChanged = true;
                    }
                });
            });
        });

        return candidatesChanged;
    }

    /**
     * Validate the grid and return potential errors.
     *
     * Errors are returned in the form of an object mapping each cell identifier
     * with a :class:`sudoku.cell.SudokuCell` instance::
     *
     *     >>> grid.validate()
     *     {
     *         "c42": [SudokuCell],
     *         "c47": [SudokuCell],
     *     }
     *
     * A valid grid would return an empty object.
     */
    validate() {
        const errors = {};

        _.range(this.rowSize).forEach((rowIndex) => {
            const cells = this.cellsInRow(rowIndex);
            const counter = _.countBy(cells.map((cell) => cell.value));

            cells.forEach((cell) => {
                if (cell.value !== 0 && counter[cell.value] > 1) {
                    errors[cell.identifier] = cell;
                }
            });
        });

        _.range(this.columnSize).forEach((columnIndex) => {
            const cells = this.cellsInColumn(columnIndex);
            const counter = _.countBy(cells.map((cell) => cell.value));

            cells.forEach((cell) => {
                if (cell.value !== 0 && counter[cell.value] > 1) {
                    errors[cell.identifier] = cell;
                }
            });
        });

        const rows = _.range(0, this.rowSize, this.blockRowSize);
        const columns = _.range(0, this.columnSize, this.blockColumnSize);

        rows.forEach((rowIndex) => {
            columns.forEach((columnIndex) => {
                const cells = this.cellsInBlock(rowIndex, columnIndex);
                const counter = _.countBy(cells.map((cell) => cell.value));

                cells.forEach((cell) => {
                    if (cell.value !== 0 && counter[cell.value] > 1) {
                        errors[cell.identifier] = cell;
                    }
                });
            });
        });

        return errors;
    }

    /**
     * Return all cell values of the grid as a cell mapping.
     *
     * The mapping is similar to the *cellsMapping* argument given to the
     * :meth:`~sudoku.grid.SudokuGrid.constructor`.
     */
    toValueMapping() {
        const mapping = {};

        this._grid.forEach((cells) => {
            cells.forEach((cell) => {
                mapping[cell.identifier] = cell.value;
            });
        });

        return mapping;
    }

    /**
     * Return all cell candidates of the grid as a cell mapping.
     *
     * The mapping is similar to the *candidatesMapping* argument given to the
     * :meth:`~sudoku.grid.SudokuGrid.constructor`.
     */
    toCandidateMapping() {
        const mapping = {};

        this._grid.forEach((cells) => {
            cells.forEach((cell) => {
                mapping[cell.identifier] = cell.candidates;
            });
        });

        return mapping;
    }
}
