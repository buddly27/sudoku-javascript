/**
 * Intersection Removal Strategies.
 */

import _ from "lodash";
import chain from "iter-tools/lib/chain";


/**
 * Intersection Strategy.
 *
 * Base class for Intersection Removal strategies.
 */
export class IntersectionStrategy {
    /**
     * Process the *grid* and return the list of modified cells.
     *
     * Call *processCells* method for each group of cells in row and column
     * intersecting with each block.
     *
     * Return modified cells.
     *
     * the *processCells* method must be a function which takes two collections
     * of :class:`sudoku.cell.SudokuCell` instances lists, for rows and columns
     * intersections.
     */
    static processGrid(grid) {
        const modifiedCells = [];

        // Gather all cells per row
        const cellsPerRows = _.range(grid.rowSize).map(
            (rowIndex) => grid.cellsInRow(rowIndex)
        );

        // Gather all cells per columns
        const cellsPerColumns = _.range(grid.columnSize).map(
            (columnIndex) => grid.cellsInColumn(columnIndex)
        );

        // Process rows and columns for each blocks
        const rows = _.range(0, grid.rowSize, grid.blockRowSize);
        const columns = _.range(0, grid.columnSize, grid.blockColumnSize);

        rows.forEach((rowIndex) => {
            columns.forEach((columnIndex) => {
                const _modifiedCells = this.processCells(
                    cellsPerRows.slice(rowIndex, rowIndex + grid.blockRowSize),
                    cellsPerColumns.slice(
                        columnIndex, columnIndex + grid.blockColumnSize
                    ),
                );
                modifiedCells.push(..._modifiedCells);
            });
        });

        return modifiedCells.sort();
    }

    /**
     * Return all cells from the intersection of rows and columns.
     *
     * *cellsInRows* and *cellsInColumns* are lists of
     * :class:`sudoku.cell.SudokuCell` instances.
     *
     * Return a list of :class:`sudoku.cell.SudokuCell` instances.
     */
    static cellsInIntersection(cellsInRows, cellsInColumns) {
        const cells = [];

        cellsInRows.forEach((rowCells) => {
            cellsInColumns.forEach((columnCells) => {
                rowCells.forEach((rowCell) => {
                    columnCells.forEach((columnCell) => {
                        if (
                            rowCell.row() === columnCell.row() &&
                            rowCell.column() === columnCell.column()
                        ) {
                            cells.push(rowCell);
                        }
                    });
                });
            });
        });

        return cells;
    }
}


/**
 * Pointing Strategy.
 *
 * Strategy to identify the single pair or triple candidates within one block
 * which are aligned and makes their other occurrences in the entire row or
 * column impossible.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Intersection_Removal
 */
export class PointingStrategy extends IntersectionStrategy {
    static identifier = "Pointing Strategy";

    static processCells(cellsInRows, cellsInColumns) {
        const cells = this.cellsInIntersection(cellsInRows, cellsInColumns);

        // Count all candidates within the bloc at the intersection of the
        // rows and columns, per row and per column and globally
        const counters = this.getBlockCounters(cells);

        // Map all non block cells per row and column
        const mapping = this.getNonBlockCellsMapping(
            cells, cellsInRows, cellsInColumns
        );

        // Get all matching candidates per row and column
        const matched = this.getMatchingCandidates(counters);

        // Try to remove numbers matching cell candidates in block from each
        // remaining rows or columns

        const modifiedCells = [];

        matched.row.forEach(([rowIndex, number]) => {
            mapping.row[rowIndex].forEach((cell) => {
                const candidates = cell.latestCandidates();

                if (candidates.includes(number)) {
                    cell.setNextCandidates(
                        candidates.filter((candidate) => candidate !== number)
                    );
                    modifiedCells.push(cell);
                }
            });
        });

        matched.column.forEach(([columnIndex, number]) => {
            mapping.column[columnIndex].forEach((cell) => {
                const candidates = cell.latestCandidates();

                if (candidates.includes(number)) {
                    cell.setNextCandidates(
                        candidates.filter((candidate) => candidate !== number)
                    );
                    modifiedCells.push(cell);
                }
            });
        });

        return modifiedCells;
    }

    /**
     * Return candidate counters for intersection block of rows and columns.
     *
     * Count the occurrence of each cell candidate for the entire block and for
     * each row and column within the intersection.
     *
     * *cells* must be a list of :class:`sudoku.cell.SudokuCell` instances.
     *
     * Example::
     *
     *     >>> getBlocCounters(cells);
     *     {
     *         global: {'4': 5, '1': 4, '8': 3, '9': 3, '2': 2, '3': 2},
     *         row: {
     *             0: {'8': 2, '4': 2, '2': 1},
     *             1: {'1': 3, '9': 3, '3': 2, '4': 2, '2': 1},
     *             2: {'8': 1, '1': 1, '4': 1},
     *         },
     *         column: {
     *             0: {'1': 1, '3': 1, '9': 1},
     *             1: {'4': 3, '8': 2, '1': 2, '9': 1},
     *             2: {'2': 2, '4': 2, '1': 1, '3': 1, '8': 1, '9': 1},
     *         },
     *     }
     */
    static getBlockCounters(cells) {
        const counters = {global: {}, row: {}, column: {}};
        const sum = (result, source) => {
            const _result = result || 0;
            return _result + source;
        };

        cells.forEach((cell) => {
            const counter = _.countBy(cell.candidates());

            if (!counters.row[cell.row()]) {
                counters.row[cell.row()] = {};
            }
            if (!counters.column[cell.column()]) {
                counters.column[cell.column()] = {};
            }

            _.mergeWith(counters.row[cell.row()], counter, sum);
            _.mergeWith(counters.column[cell.column()], counter, sum);
            _.mergeWith(counters.global, counter, sum);
        });

        return counters;
    }

    /**
     * Return mapping of cells per row and column indices.
     *
     * *cellsInBlock* is a list of all :class:`sudoku.cell.SudokuCell` instances
     * within the block.
     *
     * *cellsInRows* is a list of :class:`sudoku.cell.SudokuCell` instances
     * lists for each row which has an intersection with the block.
     *
     * *cellsInColumns* is a list of
     * :class:`sudoku.cell.SudokuCell` instances lists for
     * each column which has an intersection with the block.
     *
     * Example::
     *
     *     >>> getNonBlockCellsMapping(
     *     ...     cellsInBlock, cellsInRows, cellsInColumns
     *     ... );
     *     {
     *         row: {
     *             0: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             1: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             2: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             6: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             7: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             8: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *         },
     *         column: {
     *             3: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             4: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             5: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             6: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             7: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             8: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *         },
     *     }
     */
    static getNonBlockCellsMapping(cellsInBlock, cellsInRows, cellsInColumns) {
        const mapping = {row: {}, column: {}};

        // Get all rows and columns within block
        const blockRows = new Set(cellsInBlock.map((cell) => cell.row()));
        const blockColumns = new Set(cellsInBlock.map((cell) => cell.column()));

        // Map all cells per row
        cellsInRows.forEach((_cells) => {
            _cells.forEach((cell) => {
                if (!blockColumns.has(cell.column())) {
                    if (!mapping.row[cell.row()]) {
                        mapping.row[cell.row()] = [];
                    }
                    mapping.row[cell.row()].push(cell);
                }
            });
        });

        // Map all cells per column
        cellsInColumns.forEach((_cells) => {
            _cells.forEach((cell) => {
                if (!blockRows.has(cell.row())) {
                    if (!mapping.column[cell.column()]) {
                        mapping.column[cell.column()] = [];
                    }
                    mapping.column[cell.column()].push(cell);
                }
            });
        });

        return mapping;
    }

    /**
     * Return list of matching cell candidates per row and column.
     *
     * *counters* is a mapping of candidate counters for intersection block of
     * rows and columns, such as the one returned by
     * :meth:`sudoku.strategy.intersection.PointingStrategy.getBlockCounters`
     *
     * Each candidate is organised by tuple where the first element is the
     * row or column index and the second is the candidate number.
     *
     * Example::
     *
     *     >>> getMatchingCandidates(counters)
     *     {
     *         row: [
     *             [1, 3], [1, 9]
     *         ],
     *         column: [
     *             [8, 2]
     *         ],
     *     }
     */
    static getMatchingCandidates(counters) {
        const matchedCandidates = {row: [], column: []};

        Object.keys(counters.row).forEach((rowIndex) => {
            const counter = counters.row[rowIndex];
            const numbers = Object.keys(counter)
                .filter((number) => [2, 3].includes(counters.global[number]))
                .filter((number) =>
                    counter[number] === counters.global[number]
                );

            numbers.forEach((number) => {
                matchedCandidates.row.push(
                    [Number(rowIndex), Number(number)]
                );
            });
        });

        Object.keys(counters.column).forEach((columnIndex) => {
            const counter = counters.column[columnIndex];
            const numbers = Object.keys(counter)
                .filter((number) => [2, 3].includes(counters.global[number]))
                .filter((number) =>
                    counter[number] === counters.global[number]
                );

            numbers.forEach((number) => {
                matchedCandidates.column.push(
                    [Number(columnIndex), Number(number)]
                );
            });
        });

        return matchedCandidates;
    }
}

/**
 * Box Line Reduction Strategy.
 *
 * This strategy involves careful comparison of rows and columns against the
 * content of the blocks. All numbers found grouped in a row or a column in just
 * one bloc will invalidate those numbers from the rest of the block.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Intersection_Removal
 */
export class BoxLineReductionStrategy extends IntersectionStrategy {
    static identifier = "Box Line Reduction Strategy";

    static processCells(cellsInRows, cellsInColumns) {
        const cells = this.cellsInIntersection(cellsInRows, cellsInColumns);

        // Count all candidates per row and per column
        const counters = this.getCounters(cellsInRows, cellsInColumns);

        // Map all cells per row and column
        const mapping = this.getCellsMapping(cells);

        // Get all matching candidates per row and column
        const matched = this.getMatchingCandidates(mapping, counters);

        // Try to remove numbers matched from the rest of the block

        const modifiedCells = [];

        matched.row.forEach(([rowIndex, number]) => {
            Object.keys(mapping.row).forEach((blockIndex) => {
                if (rowIndex !== Number(blockIndex)) {
                    mapping.row[blockIndex].forEach((cell) => {
                        const candidates = cell.latestCandidates();
                        if (candidates.includes(number)) {
                            cell.setNextCandidates(
                                candidates.filter(
                                    (candidate) => candidate !== number
                                )
                            );
                            modifiedCells.push(cell);
                        }
                    });
                }
            });
        });

        matched.column.forEach(([columnIndex, number]) => {
            Object.keys(mapping.column).forEach((blockIndex) => {
                if (columnIndex !== Number(blockIndex)) {
                    mapping.column[blockIndex].forEach((cell) => {
                        const candidates = cell.latestCandidates();
                        if (candidates.includes(number)) {
                            cell.setNextCandidates(
                                candidates.filter(
                                    (candidate) => candidate !== number
                                )
                            );
                            modifiedCells.push(cell);
                        }
                    });
                }
            });
        });

        return modifiedCells;
    }

    /**
     * Return candidate counters for rows and columns.
     *
     * Count the occurrence of each cell candidate for each row and column.
     *
     * *cellsInRows* is a list of :class:`sudoku.cell.SudokuCell` instances
     * lists for each row.
     *
     * *cellsInColumns* is a list of :class:`sudoku.cell.SudokuCell` instances
     * lists for each column.
     *
     * Example::
     *
     *     >>> getCounters(cellsInRows, cellsInColumns);
     *     {
     *         row: {
     *              0: {'1': 2, '2': 3, '3': 3, '6': 2, '7': 2, '8': 3},
     *              1: {'2': 2, '3': 4, '4': 4, '5': 2, '8': 4, '9': 3},
     *              2: {'1': 2, '4': 3, '6': 2, '7': 2, '8': 3, '9': 4},
     *              3: {'7': 1, '8': 1, '9': 1},
     *              4: {'5': 1, '6': 1, '8': 1, '9': 1},
     *              5: {'5': 1, '6': 2, '7': 2, '8': 3},
     *              6: {'1': 2, '2': 2, '3': 1, '4': 2, '6': 2, '9': 3},
     *              7: {'2': 2, '3': 1, '4': 2, '6': 2, '8': 3},
     *              8: {'1': 1, '2': 1},
     *         },
     *         column: {
     *              0: {'1': 2, '2': 4, '6': 3, '7': 2, '8': 4, '9': 3},
     *              1: {'2': 3, '4': 3, '7': 3, '8': 4, '9': 2},
     *              2: {'1': 3, '3': 2, '4': 4, '5': 2, '6': 4, '8': 6, '9': 4},
     *              3: {'1': 2, '3': 1, '4': 1, '6': 2, '8': 1},
     *              4: {'3': 1, '4': 1, '5': 1, '8': 1},
     *              5: {'3': 2, '4': 2, '5': 1, '7': 2},
     *              6: {'2': 2, '3': 2, '6': 2, '9': 2},
     *              7: {'2': 1, '3': 1, '8': 2, '9': 1},
     *              8: {},
     *         },
     *     }
     */
    static getCounters(cellsInRows, cellsInColumns) {
        const counters = {row: {}, column: {}};
        const sum = (result, source) => {
            const _result = result || 0;
            return _result + source;
        };

        // Keep track of the visited cells to prevent counting then twice
        const visitedCells = [];

        cellsInRows.concat(cellsInColumns)
            .forEach((cells) => {
                cells.forEach((cell) => {
                    const id = `${cell.row()}-${cell.column()}`;

                    if (!visitedCells.includes(id)) {
                        const counter = _.countBy(cell.candidates());
                        const row = cell.row();
                        const column = cell.column();

                        if (!counters.row[row]) {
                            counters.row[row] = {};
                        }
                        if (!counters.column[column]) {
                            counters.column[column] = {};
                        }

                        _.mergeWith(counters.row[row], counter, sum);
                        _.mergeWith(counters.column[column], counter, sum);

                        visitedCells.push(id);
                    }
                });
            });

        return counters;
    }

    /**
     * Return mapping of cells per row and column indices.
     *
     * *cells* must be a list of :class:`sudoku.cell.SudokuCell` instances.
     *
     * Example::
     *
     *     >>> getCellsMapping(cells);
     *     {
     *         row: {
     *             0: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             1: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             2: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             6: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             7: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             8: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *         },
     *         column: {
     *             3: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             4: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             5: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             6: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             7: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *             8: [[SudokuCell], [SudokuCell], [SudokuCell]],
     *         },
     *     }
     */
    static getCellsMapping(cells) {
        const mapping = {row: {}, column: {}};

        cells.forEach((cell) => {
            if (!mapping.row[cell.row()]) {
                mapping.row[cell.row()] = [];
            }
            mapping.row[cell.row()].push(cell);

            if (!mapping.column[cell.column()]) {
                mapping.column[cell.column()] = [];
            }
            mapping.column[cell.column()].push(cell);
        });

        return mapping;
    }

    /**
     * Return list of matching cell candidates per row and column.
     *
     * *mapping* is a mapping of block cells per row and column indices.
     *
     * *counters* is a mapping of candidate counters for rows and columns, such
     * as the one returned by
     * :meth:`sudoku.strategy.intersection.BoxLineReductionStrategy.getCounters`
     *
     * Each candidate is organised by tuple where the first element is the
     * row or column index and the second is the candidate number.
     *
     * Example::
     *
     *     >>> getMatchingCandidates(counters)
     *     {
     *         row: [
     *             [0, 2], [1, 6]
     *         ],
     *         column: [
     *             [4, 9]
     *         ],
     *     }
     */
    static getMatchingCandidates(mapping, counters) {
        const matchedCandidates = {row: [], column: []};

        Object.keys(mapping.row).forEach((rowIndex) => {
            const candidatesList = mapping.row[rowIndex]
                .map((cell) => cell.candidates());
            const counter = _.countBy(Array.from(chain(...candidatesList)));

            const numbers = Object.keys(counter)
                .filter((number) => [2, 3].includes(counter[number]))
                .filter((number) =>
                    counter[number] === counters.row[rowIndex][number]
                );

            numbers.forEach((number) => {
                matchedCandidates.row.push(
                    [Number(rowIndex), Number(number)]
                );
            });
        });

        Object.keys(mapping.column).forEach((columnIndex) => {
            const candidatesList = mapping.column[columnIndex]
                .map((cell) => cell.candidates());
            const counter = _.countBy(Array.from(chain(...candidatesList)));

            const numbers = Object.keys(counter)
                .filter((number) => [2, 3].includes(counter[number]))
                .filter((number) =>
                    counter[number] === counters.column[columnIndex][number]
                );

            numbers.forEach((number) => {
                matchedCandidates.column.push(
                    [Number(columnIndex), Number(number)]
                );
            });
        });

        return matchedCandidates;
    }
}
