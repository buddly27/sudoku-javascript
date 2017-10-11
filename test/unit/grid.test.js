/* eslint-disable object-property-newline, no-unused-vars, global-require */

import _ from "lodash";

import {SudokuGrid} from "sudoku";

jest.mock("sudoku/cell");


describe("SudokuGrid", () => {
    describe("default instance", () => {
        const grid = new SudokuGrid();

        it("should have the correct row size value", () => {
            expect(grid.rowSize).toEqual(9);
        });

        it("should have the correct column size value", () => {
            expect(grid.columnSize).toEqual(9);
        });

        it("should have the correct block row size value", () => {
            expect(grid.blockRowSize).toEqual(3);
        });

        it("should have the correct block column size value", () => {
            expect(grid.blockColumnSize).toEqual(3);
        });
    });

    describe("instance with no values", () => {
        let grid;
        let _cell;

        beforeAll(() => {
            _cell = require("sudoku/cell");

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        value: () => value,
                        isSolved: () => value !== 0,
                    }
                )
            );

            grid = new SudokuGrid();
        });

        it("should initiate all cells", () => {
            expect(_cell.SudokuCell.mock.calls)
                .toEqual(
                    [
                        [0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4],
                        [0, 0, 5], [0, 0, 6], [0, 0, 7], [0, 0, 8],
                        [0, 1, 0], [0, 1, 1], [0, 1, 2], [0, 1, 3], [0, 1, 4],
                        [0, 1, 5], [0, 1, 6], [0, 1, 7], [0, 1, 8],
                        [0, 2, 0], [0, 2, 1], [0, 2, 2], [0, 2, 3], [0, 2, 4],
                        [0, 2, 5], [0, 2, 6], [0, 2, 7], [0, 2, 8],
                        [0, 3, 0], [0, 3, 1], [0, 3, 2], [0, 3, 3], [0, 3, 4],
                        [0, 3, 5], [0, 3, 6], [0, 3, 7], [0, 3, 8],
                        [0, 4, 0], [0, 4, 1], [0, 4, 2], [0, 4, 3], [0, 4, 4],
                        [0, 4, 5], [0, 4, 6], [0, 4, 7], [0, 4, 8],
                        [0, 5, 0], [0, 5, 1], [0, 5, 2], [0, 5, 3], [0, 5, 4],
                        [0, 5, 5], [0, 5, 6], [0, 5, 7], [0, 5, 8],
                        [0, 6, 0], [0, 6, 1], [0, 6, 2], [0, 6, 3], [0, 6, 4],
                        [0, 6, 5], [0, 6, 6], [0, 6, 7], [0, 6, 8],
                        [0, 7, 0], [0, 7, 1], [0, 7, 2], [0, 7, 3], [0, 7, 4],
                        [0, 7, 5], [0, 7, 6], [0, 7, 7], [0, 7, 8],
                        [0, 8, 0], [0, 8, 1], [0, 8, 2], [0, 8, 3], [0, 8, 4],
                        [0, 8, 5], [0, 8, 6], [0, 8, 7], [0, 8, 8],
                    ]
                );
        });

        it("should have correct cell values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value()).toEqual(0);
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            });
        });

        it("should have correct cell in block values", () => {
            const rows = _.range(0, grid.rowSize, grid.blockRowSize);
            const columns = _.range(
                0, grid.columnSize, grid.blockColumnSize
            );

            rows.forEach((rowIndex) => {
                columns.forEach((columnIndex) => {
                    const values = grid.cellsInBlock(rowIndex, columnIndex).map(
                        (cell) => cell.value()
                    );
                    expect(values).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
                });
            });
        });

        it("should not be a solved grid", () => {
            expect(grid.isSolved()).toEqual(false);
        });
    });

    describe("instance with a few cell values", () => {
        let grid;
        let _cell;

        const expectedRows = [
            [0, 0, 0, 1, 0, 5, 0, 0, 0],
            [1, 4, 0, 0, 0, 0, 6, 7, 0],
            [0, 8, 0, 0, 0, 2, 4, 0, 0],
            [0, 6, 3, 0, 7, 0, 0, 1, 0],
            [9, 0, 0, 0, 0, 0, 0, 0, 3],
            [0, 1, 0, 0, 9, 0, 5, 2, 0],
            [0, 0, 7, 2, 0, 0, 0, 8, 0],
            [0, 2, 6, 0, 0, 0, 0, 3, 5],
            [0, 0, 0, 4, 0, 9, 0, 0, 0],
        ];

        const expectedColumns = [
            [0, 1, 0, 0, 9, 0, 0, 0, 0],
            [0, 4, 8, 6, 0, 1, 0, 2, 0],
            [0, 0, 0, 3, 0, 0, 7, 6, 0],
            [1, 0, 0, 0, 0, 0, 2, 0, 4],
            [0, 0, 0, 7, 0, 9, 0, 0, 0],
            [5, 0, 2, 0, 0, 0, 0, 0, 9],
            [0, 6, 4, 0, 0, 5, 0, 0, 0],
            [0, 7, 0, 1, 0, 2, 8, 3, 0],
            [0, 0, 0, 0, 3, 0, 0, 5, 0],
        ];

        const expectedBlocks = [
            [0, 0, 0, 1, 4, 0, 0, 8, 0],
            [1, 0, 5, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 6, 7, 0, 4, 0, 0],
            [0, 6, 3, 9, 0, 0, 0, 1, 0],
            [0, 7, 0, 0, 0, 0, 0, 9, 0],
            [0, 1, 0, 0, 0, 3, 5, 2, 0],
            [0, 0, 7, 0, 2, 6, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 4, 0, 9],
            [0, 8, 0, 0, 3, 5, 0, 0, 0],
        ];

        beforeAll(() => {
            _cell = require("sudoku/cell");

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        value: () => value,
                        isSolved: () => value !== 0,
                    }
                )
            );

            grid = new SudokuGrid({
                c03: 1, c05: 5,
                c10: 1, c11: 4, c16: 6, c17: 7,
                c21: 8, c25: 2, c26: 4,
                c31: 6, c32: 3, c34: 7, c37: 1,
                c40: 9, c48: 3,
                c51: 1, c54: 9, c56: 5, c57: 2,
                c62: 7, c63: 2, c67: 8,
                c71: 2, c72: 6, c77: 3, c78: 5,
                c83: 4, c85: 9,
            });
        });

        it("should initiate all cells", () => {
            expect(_cell.SudokuCell.mock.calls)
                .toEqual(
                    [
                        [0, 0, 0], [0, 0, 1], [0, 0, 2], [1, 0, 3], [0, 0, 4],
                        [5, 0, 5], [0, 0, 6], [0, 0, 7], [0, 0, 8],
                        [1, 1, 0], [4, 1, 1], [0, 1, 2], [0, 1, 3], [0, 1, 4],
                        [0, 1, 5], [6, 1, 6], [7, 1, 7], [0, 1, 8],
                        [0, 2, 0], [8, 2, 1], [0, 2, 2], [0, 2, 3], [0, 2, 4],
                        [2, 2, 5], [4, 2, 6], [0, 2, 7], [0, 2, 8],
                        [0, 3, 0], [6, 3, 1], [3, 3, 2], [0, 3, 3], [7, 3, 4],
                        [0, 3, 5], [0, 3, 6], [1, 3, 7], [0, 3, 8],
                        [9, 4, 0], [0, 4, 1], [0, 4, 2], [0, 4, 3], [0, 4, 4],
                        [0, 4, 5], [0, 4, 6], [0, 4, 7], [3, 4, 8],
                        [0, 5, 0], [1, 5, 1], [0, 5, 2], [0, 5, 3], [9, 5, 4],
                        [0, 5, 5], [5, 5, 6], [2, 5, 7], [0, 5, 8],
                        [0, 6, 0], [0, 6, 1], [7, 6, 2], [2, 6, 3], [0, 6, 4],
                        [0, 6, 5], [0, 6, 6], [8, 6, 7], [0, 6, 8],
                        [0, 7, 0], [2, 7, 1], [6, 7, 2], [0, 7, 3], [0, 7, 4],
                        [0, 7, 5], [0, 7, 6], [3, 7, 7], [5, 7, 8],
                        [0, 8, 0], [0, 8, 1], [0, 8, 2], [4, 8, 3], [0, 8, 4],
                        [9, 8, 5], [0, 8, 6], [0, 8, 7], [0, 8, 8],
                    ]
                );
        });

        it("should have correct cell values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value())
                        .toEqual(expectedRows[rowIndex][columnIndex]);
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual(expectedRows[rowIndex]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual(expectedColumns[columnIndex]);
            });
        });

        it("should have correct cell in block values", () => {
            const rows = _.range(0, grid.rowSize, grid.blockRowSize);
            const columns = _.range(
                0, grid.columnSize, grid.blockColumnSize
            );

            let index = 0;
            rows.forEach((rowIndex) => {
                columns.forEach((columnIndex) => {
                    const values = grid.cellsInBlock(rowIndex, columnIndex).map(
                        (cell) => cell.value()
                    );
                    expect(values).toEqual(expectedBlocks[index]);
                    index += 1;
                });
            });
        });

        it("should not be a solved grid", () => {
            expect(grid.isSolved()).toEqual(false);
        });
    });

    describe("instance with a all cell values", () => {
        let grid;
        let _cell;

        const expectedRows = [
            [6, 7, 2, 1, 4, 5, 3, 9, 8],
            [1, 4, 5, 9, 8, 3, 6, 7, 2],
            [3, 8, 9, 7, 6, 2, 4, 5, 1],
            [2, 6, 3, 5, 7, 4, 8, 1, 9],
            [9, 5, 8, 6, 2, 1, 7, 4, 3],
            [7, 1, 4, 3, 9, 8, 5, 2, 6],
            [5, 9, 7, 2, 3, 6, 1, 8, 4],
            [4, 2, 6, 8, 1, 7, 9, 3, 5],
            [8, 3, 1, 4, 5, 9, 2, 6, 7],
        ];

        const expectedColumns = [
            [6, 1, 3, 2, 9, 7, 5, 4, 8],
            [7, 4, 8, 6, 5, 1, 9, 2, 3],
            [2, 5, 9, 3, 8, 4, 7, 6, 1],
            [1, 9, 7, 5, 6, 3, 2, 8, 4],
            [4, 8, 6, 7, 2, 9, 3, 1, 5],
            [5, 3, 2, 4, 1, 8, 6, 7, 9],
            [3, 6, 4, 8, 7, 5, 1, 9, 2],
            [9, 7, 5, 1, 4, 2, 8, 3, 6],
            [8, 2, 1, 9, 3, 6, 4, 5, 7],

        ];

        const expectedBlocks = [
            [6, 7, 2, 1, 4, 5, 3, 8, 9],
            [1, 4, 5, 9, 8, 3, 7, 6, 2],
            [3, 9, 8, 6, 7, 2, 4, 5, 1],
            [2, 6, 3, 9, 5, 8, 7, 1, 4],
            [5, 7, 4, 6, 2, 1, 3, 9, 8],
            [8, 1, 9, 7, 4, 3, 5, 2, 6],
            [5, 9, 7, 4, 2, 6, 8, 3, 1],
            [2, 3, 6, 8, 1, 7, 4, 5, 9],
            [1, 8, 4, 9, 3, 5, 2, 6, 7],
        ];

        beforeAll(() => {
            _cell = require("sudoku/cell");

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        value: () => value,
                        isSolved: () => value !== 0,
                    }
                )
            );

            grid = new SudokuGrid({
                c00: 6, c01: 7, c02: 2, c03: 1, c04: 4, c05: 5, c06: 3, c07: 9,
                c08: 8,
                c10: 1, c11: 4, c12: 5, c13: 9, c14: 8, c15: 3, c16: 6, c17: 7,
                c18: 2,
                c20: 3, c21: 8, c22: 9, c23: 7, c24: 6, c25: 2, c26: 4, c27: 5,
                c28: 1,
                c30: 2, c31: 6, c32: 3, c33: 5, c34: 7, c35: 4, c36: 8, c37: 1,
                c38: 9,
                c40: 9, c41: 5, c42: 8, c43: 6, c44: 2, c45: 1, c46: 7, c47: 4,
                c48: 3,
                c50: 7, c51: 1, c52: 4, c53: 3, c54: 9, c55: 8, c56: 5, c57: 2,
                c58: 6,
                c60: 5, c61: 9, c62: 7, c63: 2, c64: 3, c65: 6, c66: 1, c67: 8,
                c68: 4,
                c70: 4, c71: 2, c72: 6, c73: 8, c74: 1, c75: 7, c76: 9, c77: 3,
                c78: 5,
                c80: 8, c81: 3, c82: 1, c83: 4, c84: 5, c85: 9, c86: 2, c87: 6,
                c88: 7,
            });
        });

        it("should initiate all cells", () => {
            expect(_cell.SudokuCell.mock.calls)
                .toEqual(
                    [
                        [6, 0, 0], [7, 0, 1], [2, 0, 2], [1, 0, 3], [4, 0, 4],
                        [5, 0, 5], [3, 0, 6], [9, 0, 7], [8, 0, 8],
                        [1, 1, 0], [4, 1, 1], [5, 1, 2], [9, 1, 3], [8, 1, 4],
                        [3, 1, 5], [6, 1, 6], [7, 1, 7], [2, 1, 8],
                        [3, 2, 0], [8, 2, 1], [9, 2, 2], [7, 2, 3], [6, 2, 4],
                        [2, 2, 5], [4, 2, 6], [5, 2, 7], [1, 2, 8],
                        [2, 3, 0], [6, 3, 1], [3, 3, 2], [5, 3, 3], [7, 3, 4],
                        [4, 3, 5], [8, 3, 6], [1, 3, 7], [9, 3, 8],
                        [9, 4, 0], [5, 4, 1], [8, 4, 2], [6, 4, 3], [2, 4, 4],
                        [1, 4, 5], [7, 4, 6], [4, 4, 7], [3, 4, 8],
                        [7, 5, 0], [1, 5, 1], [4, 5, 2], [3, 5, 3], [9, 5, 4],
                        [8, 5, 5], [5, 5, 6], [2, 5, 7], [6, 5, 8],
                        [5, 6, 0], [9, 6, 1], [7, 6, 2], [2, 6, 3], [3, 6, 4],
                        [6, 6, 5], [1, 6, 6], [8, 6, 7], [4, 6, 8],
                        [4, 7, 0], [2, 7, 1], [6, 7, 2], [8, 7, 3], [1, 7, 4],
                        [7, 7, 5], [9, 7, 6], [3, 7, 7], [5, 7, 8],
                        [8, 8, 0], [3, 8, 1], [1, 8, 2], [4, 8, 3], [5, 8, 4],
                        [9, 8, 5], [2, 8, 6], [6, 8, 7], [7, 8, 8],
                    ]
                );
        });

        it("should have correct cell values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value())
                        .toEqual(expectedRows[rowIndex][columnIndex]);
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual(expectedRows[rowIndex]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value()
                );
                expect(values).toEqual(expectedColumns[columnIndex]);
            });
        });

        it("should have correct cell in block values", () => {
            const rows = _.range(0, grid.rowSize, grid.blockRowSize);
            const columns = _.range(
                0, grid.columnSize, grid.blockColumnSize
            );

            let index = 0;
            rows.forEach((rowIndex) => {
                columns.forEach((columnIndex) => {
                    const values = grid.cellsInBlock(rowIndex, columnIndex).map(
                        (cell) => cell.value()
                    );
                    expect(values).toEqual(expectedBlocks[index]);
                    index += 1;
                });
            });
        });

        it("should be a solved grid", () => {
            expect(grid.isSolved()).toEqual(true);
        });
    });

    describe("update", () => {
        let updateSolvedCellsSpy;
        let updateCandidatesSpy;
        let grid;

        beforeEach(() => {
            grid = new SudokuGrid();
            updateSolvedCellsSpy = jest.fn();
            updateCandidatesSpy = jest.fn();

            grid.updateSolvedCells = updateSolvedCellsSpy;
            grid.updateCandidates = updateCandidatesSpy;
        });

        it("should not update any cell", () => {
            updateCandidatesSpy.mockReturnValue(false);

            expect(grid.update()).toEqual(false);
            expect(updateSolvedCellsSpy).toHaveBeenCalledTimes(1);
            expect(updateCandidatesSpy).toHaveBeenCalledTimes(1);
        });

        it("should update one cell", () => {
            updateCandidatesSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true);

            expect(grid.update()).toEqual(true);
            expect(updateSolvedCellsSpy).toHaveBeenCalledTimes(2);
            expect(updateCandidatesSpy).toHaveBeenCalledTimes(2);
        });

        it("should update a few cells", () => {
            updateCandidatesSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true);

            expect(grid.update()).toEqual(true);
            expect(updateSolvedCellsSpy).toHaveBeenCalledTimes(5);
            expect(updateCandidatesSpy).toHaveBeenCalledTimes(5);
        });
    });

    describe("updateSolvedCells", () => {
        let resolveSpy;
        let grid;

        beforeEach(() => {
            const _cell = require("sudoku/cell");
            resolveSpy = jest.fn();

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        resolve: resolveSpy,
                    }
                )
            );

            grid = new SudokuGrid();
        });

        it("should resolve all cells", () => {
            resolveSpy.mockReturnValue(true);
            expect(grid.updateSolvedCells()).toEqual(81);
            expect(resolveSpy).toHaveBeenCalledTimes(81);
        });

        it("should not resolve any cell", () => {
            resolveSpy.mockReturnValue(false);
            expect(grid.updateSolvedCells()).toEqual(0);
            expect(resolveSpy).toHaveBeenCalledTimes(81);
        });

        it("should resolve a few cells", () => {
            resolveSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true);

            expect(grid.updateSolvedCells()).toEqual(4);
            expect(resolveSpy).toHaveBeenCalledTimes(81);
        });
    });

    describe("updateCandidates", () => {
        let applyNextCandidatesSpy;
        let updateCandidatesSpy;
        let grid;

        beforeEach(() => {
            applyNextCandidatesSpy = jest.fn();
            updateCandidatesSpy = jest.fn();

            grid = new SudokuGrid();

            jest.spyOn(grid, "cellsInRow")
                .mockImplementation((rowIndex) =>
                    _.range(9).map((index) => (
                        {
                            value: () => 0,
                            row: () => rowIndex,
                            column: () => index,
                            applyNextCandidates: applyNextCandidatesSpy,
                            updateCandidates: updateCandidatesSpy,
                        }
                    ))
                );

            jest.spyOn(grid, "cellsInColumn")
                .mockImplementation((columnIndex) =>
                    _.range(9).map((index) => (
                        {
                            value: () => 0,
                            row: () => index,
                            column: () => columnIndex,
                            applyNextCandidates: applyNextCandidatesSpy,
                            updateCandidates: updateCandidatesSpy,
                        }
                    ))
                );

            jest.spyOn(grid, "cellsInBlock")
                .mockImplementation((blockIndex) => {
                    const cells = [];

                    _.range(3).forEach((rowIndex) =>
                        _.range(3).forEach((columnIndex) =>
                            cells.push({
                                value: () => 0,
                                row: () => rowIndex,
                                column: () => columnIndex,
                                applyNextCandidates: applyNextCandidatesSpy,
                                updateCandidates: updateCandidatesSpy,
                            })
                        )
                    );

                    return cells;
                });
        });

        it("should only apply next candidates for all cells", () => {
            applyNextCandidatesSpy.mockReturnValue(true);
            expect(grid.updateCandidates()).toEqual(true);

            expect(applyNextCandidatesSpy).toHaveBeenCalledTimes(81);
            expect(updateCandidatesSpy).toHaveBeenCalledTimes(0);
        });

        it("should only apply next candidates for a few cells", () => {
            applyNextCandidatesSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true);
            updateCandidatesSpy.mockReturnValue(false);

            expect(grid.updateCandidates()).toEqual(true);
            expect(applyNextCandidatesSpy).toHaveBeenCalledTimes(81);
            expect(updateCandidatesSpy).toHaveBeenCalledTimes(77);
        });

        it("should call 'updateCandidates' for all cells with positive results",
            () => {
                applyNextCandidatesSpy.mockReturnValue(false);
                updateCandidatesSpy.mockReturnValue(true);

                expect(grid.updateCandidates()).toEqual(true);
                expect(applyNextCandidatesSpy).toHaveBeenCalledTimes(81);
                expect(updateCandidatesSpy).toHaveBeenCalledTimes(81);
            }
        );

        it("should call 'updateCandidates' for all cells with negative results",
            () => {
                applyNextCandidatesSpy.mockReturnValue(false);
                updateCandidatesSpy.mockReturnValue(false);

                expect(grid.updateCandidates()).toEqual(false);
                expect(applyNextCandidatesSpy).toHaveBeenCalledTimes(81);
                expect(updateCandidatesSpy).toHaveBeenCalledTimes(81);
            }
        );

        it("should call 'updateCandidates' for all cells with mixed results",
            () => {
                applyNextCandidatesSpy.mockImplementation(() => false);
                updateCandidatesSpy
                    .mockReturnValue(false)
                    .mockReturnValueOnce(true)
                    .mockReturnValueOnce(true);

                expect(grid.updateCandidates()).toEqual(true);
                expect(applyNextCandidatesSpy).toHaveBeenCalledTimes(81);
                expect(updateCandidatesSpy).toHaveBeenCalledTimes(81);
            }
        );
    });

    describe("validate", () => {
        beforeAll(() => {
            const cell = require("sudoku/cell");

            cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        value: () => value,
                        identifier: `c${rowIndex}${columnIndex}`,
                    }
                )
            );
        });

        it("should not return any errors", () => {
            const grid = new SudokuGrid();
            expect(grid.validate()).toEqual({});
        });

        it("should return a two errors", () => {
            const grid = new SudokuGrid({c00: 3, c02: 3});
            expect(grid.validate()).toEqual({
                c00: grid.cell(0, 0),
                c02: grid.cell(0, 2),
            });
        });

        it("should return several errors", () => {
            const grid = new SudokuGrid({c00: 3, c02: 3, c20: 3, c28: 3});
            expect(grid.validate()).toEqual({
                c00: grid.cell(0, 0),
                c02: grid.cell(0, 2),
                c20: grid.cell(2, 0),
                c28: grid.cell(2, 8),
            });
        });
    });

    describe("toMapping", () => {
        beforeAll(() => {
            const cell = require("sudoku/cell");

            cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => (
                    {
                        value: () => value,
                        identifier: `c${rowIndex}${columnIndex}`,
                    }
                )
            );
        });

        it("should return content of empty grid as a mapping", () => {
            const grid = new SudokuGrid();

            expect(grid.toMapping()).toEqual({
                c00: 0, c01: 0, c02: 0,
                c03: 0, c04: 0, c05: 0,
                c06: 0, c07: 0, c08: 0,
                c10: 0, c11: 0, c12: 0,
                c13: 0, c14: 0, c15: 0,
                c16: 0, c17: 0, c18: 0,
                c20: 0, c21: 0, c22: 0,
                c23: 0, c24: 0, c25: 0,
                c26: 0, c27: 0, c28: 0,
                c30: 0, c31: 0, c32: 0,
                c33: 0, c34: 0, c35: 0,
                c36: 0, c37: 0, c38: 0,
                c40: 0, c41: 0, c42: 0,
                c43: 0, c44: 0, c45: 0,
                c46: 0, c47: 0, c48: 0,
                c50: 0, c51: 0, c52: 0,
                c53: 0, c54: 0, c55: 0,
                c56: 0, c57: 0, c58: 0,
                c60: 0, c61: 0, c62: 0,
                c63: 0, c64: 0, c65: 0,
                c66: 0, c67: 0, c68: 0,
                c70: 0, c71: 0, c72: 0,
                c73: 0, c74: 0, c75: 0,
                c76: 0, c77: 0, c78: 0,
                c80: 0, c81: 0, c82: 0,
                c83: 0, c84: 0, c85: 0,
                c86: 0, c87: 0, c88: 0,
            });
        });

        it("should return content of grid with initial values as a mapping",
            () => {
                const grid = new SudokuGrid({
                    c03: 1, c05: 5,
                    c10: 1, c11: 4, c16: 6, c17: 7,
                    c21: 8, c25: 2, c26: 4,
                    c31: 6, c32: 3, c34: 7, c37: 1,
                    c40: 9, c48: 3,
                    c51: 1, c54: 9, c56: 5, c57: 2,
                    c62: 7, c63: 2, c67: 8,
                    c71: 2, c72: 6, c77: 3, c78: 5,
                    c83: 4, c85: 9,
                });

                expect(grid.toMapping()).toEqual({
                    c00: 0, c01: 0, c02: 0,
                    c03: 1, c04: 0, c05: 5,
                    c06: 0, c07: 0, c08: 0,
                    c10: 1, c11: 4, c12: 0,
                    c13: 0, c14: 0, c15: 0,
                    c16: 6, c17: 7, c18: 0,
                    c20: 0, c21: 8, c22: 0,
                    c23: 0, c24: 0, c25: 2,
                    c26: 4, c27: 0, c28: 0,
                    c30: 0, c31: 6, c32: 3,
                    c33: 0, c34: 7, c35: 0,
                    c36: 0, c37: 1, c38: 0,
                    c40: 9, c41: 0, c42: 0,
                    c43: 0, c44: 0, c45: 0,
                    c46: 0, c47: 0, c48: 3,
                    c50: 0, c51: 1, c52: 0,
                    c53: 0, c54: 9, c55: 0,
                    c56: 5, c57: 2, c58: 0,
                    c60: 0, c61: 0, c62: 7,
                    c63: 2, c64: 0, c65: 0,
                    c66: 0, c67: 8, c68: 0,
                    c70: 0, c71: 2, c72: 6,
                    c73: 0, c74: 0, c75: 0,
                    c76: 0, c77: 3, c78: 5,
                    c80: 0, c81: 0, c82: 0,
                    c83: 4, c84: 0, c85: 9,
                    c86: 0, c87: 0, c88: 0,
                });
            }
        );
    });
});
