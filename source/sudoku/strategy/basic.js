/**
 * Basic Strategies.
 */

import _ from "lodash";
import chain from "iter-tools/lib/chain";
import combinations from "iter-tools/lib/combinations";


/**
 * Basic Strategy.
 *
 * Base class for strategies which process together each row, column and block
 * from a sudoku grid to find 'Hidden' and 'Naked' candidates.
 */
export class BasicStrategy {
    /**
     * Process the *grid* and return the list of modified cells.
     *
     * Call the *processCells* method for the group of cells within each row,
     * column and block
     *
     * Return modified cells.
     *
     * the *processCells* method must be a function which takes a list of
     * :class:`sudoku.cell.SudokuCell` instances and return a list
     * of modified :class:`sudoku.cell.SudokuCell` instances.
     */
    static processGrid(grid) {
        const modifiedCells = [];

        // Process Rows
        _.range(grid.rowSize).forEach((rowIndex) => {
            const _modifiedCells = this.processCells(grid.cellsInRow(rowIndex));
            modifiedCells.push(..._modifiedCells);
        });

        // Process Columns
        _.range(grid.columnSize).forEach((columnIndex) => {
            const _modifiedCells = this.processCells(
                grid.cellsInColumn(columnIndex)
            );
            modifiedCells.push(..._modifiedCells);
        });

        // Process Blocks
        const rows = _.range(0, grid.rowSize, grid.blockRowSize);
        const columns = _.range(0, grid.columnSize, grid.blockColumnSize);

        rows.forEach((rowIndex) => {
            columns.forEach((columnIndex) => {
                const _modifiedCells = this.processCells(
                    grid.cellsInBlock(rowIndex, columnIndex)
                );
                modifiedCells.push(..._modifiedCells);
            });
        });

        return modifiedCells.sort();
    }

    /**
     * Update candidates from *cells* based on the intersection with
     * *hiddenCandidates*.
     *
     * *hiddenCandidates* should be a list of hidden candidates lists.
     *
     * Return a list of :class:`sudoku.cell.SudokuCell` instances
     * modified.
     *
     * The first occurrence of hidden candidates within a cell is set as its
     * 'next' candidates and will be applied next time the grid is
     * :meth:`updated <sudoku.grid.SudokuGrid.update>`.
     *
     * Example::
     *
     *     >>> const cell = new SudokuCell(0, 0, 0);
     *     >>> BasicStrategy.updateFromIntersection([cell], [[3, 4],]);
     *     [[Object]]
     *     >>> cell.setNextCandidates();
     *     >>> cell.candidates();
     *     [3, 4]
     */
    static updateFromIntersection(cells, hiddenCandidates) {
        const modifiedCells = [];

        cells.forEach((cell) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const numbers of hiddenCandidates) {
                const cellCandidates = new Set(cell.candidates());
                const intersection = new Set(
                    numbers.filter((res) => cellCandidates.has(Number(res)))
                );

                if (
                    intersection.size &&
                    !_.isEqual(intersection, cellCandidates)
                ) {
                    cell.setNextCandidates(Array.from(intersection).sort());
                    modifiedCells.push(cell);
                    break;
                }
            }
        });

        return modifiedCells;
    }

    /**
     * Update candidates from *cells* based on the difference with
     * *nakedCandidates*.
     *
     * *nakedCandidates* should be a list of naked candidates lists.
     *
     * Return a list of :class:`sudoku.cell.SudokuCell` instances modified.
     *
     * The first occurrence of numbers different than the naked candidates found
     * within a cell is set as its 'next' candidates and will be applied next
     * time the grid is :meth:`updated
     * <sudoku.grid.SudokuGrid.update>`.
     *
     * Example::
     *
     *     >>> const cell = new SudokuCell(0, 0, 0);
     *     >>> BasicStrategy.updateFromDifference([cell], [[3, 4],]);
     *     [[Object]]
     *     >>> cell.setNextCandidates();
     *     >>> cell.candidates();
     *     [1, 2, 5, 6, 7, 8, 9]
     */
    static updateFromDifference(cells, nakedCandidates) {
        const modifiedCells = [];

        cells.forEach((cell) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const numbers of nakedCandidates) {
                const _numbers = new Set(numbers);
                const difference = new Set(
                    cell.candidates()
                        .filter((res) => !_numbers.has(Number(res)))
                );

                if (
                    difference.size &&
                    !_.isEqual(difference, new Set(cell.candidates()))
                ) {
                    cell.setNextCandidates(Array.from(difference).sort());
                    modifiedCells.push(cell);
                    break;
                }
            }
        });

        return modifiedCells;
    }
}


/**
 * Hidden Single Strategy.
 *
 * Strategy to solve a grid by removing possibilities from one cell
 * if we identify numbers which can be only in this cell.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Hidden_Candidates
 *
 */
export class HiddenSingleStrategy extends BasicStrategy {
    static identifier = "Hidden Single Strategy";

    static processCells(cells) {
        const candidatesList = cells.map((cell) => cell.candidates());

        // Count number of single number in all cells
        const c1 = _.countBy(Array.from(chain(...candidatesList)));

        // Filter single numbers that must remain the sole candidates
        // within their respective cells.
        const hiddenCandidates = Object.keys(c1)
            .filter((single) => c1[single] === 1)
            .map((single) => [Number(single)])
            .sort();

        return this.updateFromIntersection(cells, hiddenCandidates);
    }
}


/**
 * Hidden Pair Strategy.
 *
 * Strategy to solve a grid by removing possibilities from two cells
 * if we identify numbers which can be only in those two cells.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Hidden_Candidates
 *
 */
export class HiddenPairStrategy extends BasicStrategy {
    static identifier = "Hidden Pair Strategy";

    static processCells(cells) {
        const candidatesList = cells.map((cell) => cell.candidates());
        const candidatesPairList = candidatesList.map(
            (candidates) => Array
                .from(combinations(candidates, 2))
                .map((pairCandidates) => pairCandidates.sort().join(","))
        );

        // Count number of single number in all cells
        const c1 = _.countBy(Array.from(chain(...candidatesList)));

        // Count number of paired number in all cells
        const c2 = _.countBy(Array.from(chain(...candidatesPairList)));

        // Filter pair numbers that must remain the sole candidates
        // within their respective cells.
        const hiddenCandidates = Object.keys(c2)
            .filter(
                (pair) => {
                    if (c2[pair] !== 2) {
                        return false;
                    }
                    const [number1, number2] = pair.split(",");
                    return (c1[number1] === 2 && c1[number2] === 2);
                }
            )
            .map((pair) => pair.split(",").map(Number))
            .sort();

        return this.updateFromIntersection(cells, hiddenCandidates);
    }
}


/**
 * Hidden Triple Strategy.
 *
 * Strategy to solve a grid by removing possibilities from three cells
 * if we identify numbers which can be only in those three cells.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Hidden_Candidates
 *
 */
export class HiddenTripleStrategy extends BasicStrategy {
    static identifier = "Hidden Triple Strategy";

    static processCells(cells) {
        const hiddenCandidates = [];

        const candidatesList = cells.map((cell) => cell.candidates());
        const _candidates = new Set(Array.from(chain(...candidatesList)));
        const candidatesTripleList = Array.from(combinations(_candidates, 3));

        candidatesTripleList.forEach((triple) => {
            const tripleSet = new Set(triple);
            const matchedCandidates = candidatesList
                .map((candidates) => new Set(
                    candidates.filter((number) => tripleSet.has(number))
                ))
                .filter((candidates) => candidates.size > 0);

            if (
                matchedCandidates.length === 3 &&
                matchedCandidates.filter(
                    (candidates) => candidates.size >= 2
                ).length === 3
            ) {
                hiddenCandidates.push(Array.from(tripleSet).sort());
            }
        });

        return this.updateFromIntersection(cells, hiddenCandidates);
    }
}


/**
 * Hidden Quad Strategy.
 *
 * Strategy to solve a grid by removing possibilities from four cells
 * if we identify numbers which can be only in those four cells.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Hidden_Candidates
 *
 */
export class HiddenQuadStrategy extends BasicStrategy {
    static identifier = "Hidden Quad Strategy";

    static processCells(cells) {
        const hiddenCandidates = [];

        const candidatesList = cells.map((cell) => cell.candidates());
        const _candidates = new Set(Array.from(chain(...candidatesList)));
        const candidatesQuadList = Array.from(combinations(_candidates, 4));

        candidatesQuadList.forEach((quad) => {
            const quadSet = new Set(quad);
            const matchedCandidates = candidatesList
                .map((candidates) => new Set(
                    candidates.filter((number) => quadSet.has(number))
                ))
                .filter((candidates) => candidates.size > 0);

            if (
                matchedCandidates.length === 4 &&
                matchedCandidates.filter(
                    (candidates) => candidates.size >= 2
                ).length === 4
            ) {
                hiddenCandidates.push(Array.from(quadSet).sort());
            }
        });

        return this.updateFromIntersection(cells, hiddenCandidates);
    }
}


/**
 * Naked Pair Strategy.
 *
 * Strategy to solve a grid by removing two possible numbers from all cells
 * when we identify two cells which can only contains those numbers.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Naked_Candidates
 *
 */
export class NakedPairStrategy extends BasicStrategy {
    static identifier = "Naked Pair Strategy";

    static processCells(cells) {
        const candidatesList = cells.map((cell) => cell.candidates());
        const candidatesPairList = candidatesList
            .filter((candidates) => candidates.length === 2)
            .map((pairCandidates) => pairCandidates.sort().join(","));

        // Count number of single number in all cells
        const c1 = _.countBy(Array.from(chain(...candidatesList)));

        // Count number of paired number in all cells
        const c2 = _.countBy(Array.from(candidatesPairList));

        const nakedCandidates = Object.keys(c2)
            .filter(
                (pair) => {
                    const [number1, number2] = pair.split(",");
                    return (
                        c2[pair] === 2 &&
                        (c1[number1] !== 2 && c1[number2] !== 2)
                    );
                }
            )
            .map((pair) => pair.split(",").map(Number))
            .sort();

        return this.updateFromDifference(cells, nakedCandidates);
    }
}


/**
 * Naked Triple Strategy.
 *
 * Strategy to solve a grid by removing three possible numbers from all cells
 * when we identify three cells which can only contains those numbers.
 *
 * .. note::
 *
 *     http://www.sudokuwiki.org/Naked_Candidates
 *
 */
export class NakedTripleStrategy extends BasicStrategy {
    static identifier = "Naked Triple Strategy";

    static processCells(cells) {
        const nakedCandidates = [];

        const candidatesList = cells.map((cell) => cell.candidates());
        const _candidatesList = candidatesList.filter(
            (candidates) => [2, 3].includes(candidates.length)
        );

        // Count number of single number in all cells
        const c1 = _.countBy(Array.from(chain(...candidatesList)));

        if (_candidatesList.length >= 3) {
            const _candidates = new Set(Array.from(chain(..._candidatesList)));
            const candidatesTripleList = Array.from(
                combinations(_candidates, 3)
            );

            candidatesTripleList.forEach((triple) => {
                const tripleSet = new Set(triple);

                // Filter all cells containing only the triple candidates
                const matchedCandidates = _candidatesList
                    .filter((candidates) => {
                        const intersection = new Set(
                            candidates.filter((number) => tripleSet.has(number))
                        );
                        return intersection.size === candidates.length;
                    });

                // Ensure that only three cells are kept
                if (matchedCandidates.length === 3) {
                    const c = _.countBy(Array.from(chain(...matchedCandidates)));


                    // All remaining cells candidates must appears 2 or 3 times
                    const matchedTriple = Object.values(c)
                        .filter((count) => ![2, 3].includes(count))
                        .length === 0;

                    // Check if candidates appear in other cell
                    const needUpdating = Object.keys(c)
                        .filter((number) => c1[number] !== c[number])
                        .length !== 0;

                    if (matchedTriple && needUpdating) {
                        nakedCandidates.push(Array.from(tripleSet).sort());
                    }
                }
            });
        }

        return this.updateFromDifference(cells, nakedCandidates);
    }
}
