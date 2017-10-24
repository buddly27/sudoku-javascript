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

        it("should get a cell from its identifier", () => {
            expect(grid.cellFromId("c53")).toBe(grid.cell(5, 3));
        });

        it("should throw an error when cell identifier is incorrect", () => {
            expect(
                () => grid.cellFromId("23")
            ).toThrow(
                Error("Impossible to find the cell identified as '23'")
            );

            expect(
                () => grid.cellFromId("rr")
            ).toThrow(
                Error("Impossible to find the cell identified as 'rr'")
            );

            expect(
                () => grid.cellFromId("c124")
            ).toThrow(
                Error("Impossible to find the cell identified as 'c124'")
            );
        });
    });

    describe("instance with no values", () => {
        let grid;
        let _cell;

        beforeAll(() => {
            _cell = require("sudoku/cell");

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex, candidates = null) => ({
                    value, candidates, isSolved: () => value !== 0,
                })
            );

            grid = new SudokuGrid();
        });

        it("should initiate all cells", () => {
            expect(_cell.SudokuCell.mock.calls)
                .toEqual(
                    [
                        [0, 0, 0, undefined], [0, 0, 1, undefined],
                        [0, 0, 2, undefined], [0, 0, 3, undefined],
                        [0, 0, 4, undefined], [0, 0, 5, undefined],
                        [0, 0, 6, undefined], [0, 0, 7, undefined],
                        [0, 0, 8, undefined],
                        [0, 1, 0, undefined], [0, 1, 1, undefined],
                        [0, 1, 2, undefined], [0, 1, 3, undefined],
                        [0, 1, 4, undefined], [0, 1, 5, undefined],
                        [0, 1, 6, undefined], [0, 1, 7, undefined],
                        [0, 1, 8, undefined],
                        [0, 2, 0, undefined], [0, 2, 1, undefined],
                        [0, 2, 2, undefined], [0, 2, 3, undefined],
                        [0, 2, 4, undefined], [0, 2, 5, undefined],
                        [0, 2, 6, undefined], [0, 2, 7, undefined],
                        [0, 2, 8, undefined],
                        [0, 3, 0, undefined], [0, 3, 1, undefined],
                        [0, 3, 2, undefined], [0, 3, 3, undefined],
                        [0, 3, 4, undefined], [0, 3, 5, undefined],
                        [0, 3, 6, undefined], [0, 3, 7, undefined],
                        [0, 3, 8, undefined],
                        [0, 4, 0, undefined], [0, 4, 1, undefined],
                        [0, 4, 2, undefined], [0, 4, 3, undefined],
                        [0, 4, 4, undefined], [0, 4, 5, undefined],
                        [0, 4, 6, undefined], [0, 4, 7, undefined],
                        [0, 4, 8, undefined],
                        [0, 5, 0, undefined], [0, 5, 1, undefined],
                        [0, 5, 2, undefined], [0, 5, 3, undefined],
                        [0, 5, 4, undefined], [0, 5, 5, undefined],
                        [0, 5, 6, undefined], [0, 5, 7, undefined],
                        [0, 5, 8, undefined],
                        [0, 6, 0, undefined], [0, 6, 1, undefined],
                        [0, 6, 2, undefined], [0, 6, 3, undefined],
                        [0, 6, 4, undefined], [0, 6, 5, undefined],
                        [0, 6, 6, undefined], [0, 6, 7, undefined],
                        [0, 6, 8, undefined],
                        [0, 7, 0, undefined], [0, 7, 1, undefined],
                        [0, 7, 2, undefined], [0, 7, 3, undefined],
                        [0, 7, 4, undefined], [0, 7, 5, undefined],
                        [0, 7, 6, undefined], [0, 7, 7, undefined],
                        [0, 7, 8, undefined],
                        [0, 8, 0, undefined], [0, 8, 1, undefined],
                        [0, 8, 2, undefined], [0, 8, 3, undefined],
                        [0, 8, 4, undefined], [0, 8, 5, undefined],
                        [0, 8, 6, undefined], [0, 8, 7, undefined],
                        [0, 8, 8, undefined],
                    ]
                );
        });

        it("should have correct cell values and candidates", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value).toEqual(0);
                    expect(cell.candidates).toEqual(null);
                });
            });
        });

        it("should get the correct cell from its identifier", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cellFromId(`c${rowIndex}${columnIndex}`);
                    expect(cell).toBe(grid.cell(rowIndex, columnIndex));
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value
                );
                expect(values).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value
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
                        (cell) => cell.value
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
                (value, rowIndex, columnIndex, candidates = null) => ({
                    value, candidates, isSolved: () => value !== 0,
                })
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
                        [0, 0, 0, undefined], [0, 0, 1, undefined],
                        [0, 0, 2, undefined], [1, 0, 3, undefined],
                        [0, 0, 4, undefined], [5, 0, 5, undefined],
                        [0, 0, 6, undefined], [0, 0, 7, undefined],
                        [0, 0, 8, undefined],
                        [1, 1, 0, undefined], [4, 1, 1, undefined],
                        [0, 1, 2, undefined], [0, 1, 3, undefined],
                        [0, 1, 4, undefined], [0, 1, 5, undefined],
                        [6, 1, 6, undefined], [7, 1, 7, undefined],
                        [0, 1, 8, undefined],
                        [0, 2, 0, undefined], [8, 2, 1, undefined],
                        [0, 2, 2, undefined], [0, 2, 3, undefined],
                        [0, 2, 4, undefined], [2, 2, 5, undefined],
                        [4, 2, 6, undefined], [0, 2, 7, undefined],
                        [0, 2, 8, undefined],
                        [0, 3, 0, undefined], [6, 3, 1, undefined],
                        [3, 3, 2, undefined], [0, 3, 3, undefined],
                        [7, 3, 4, undefined], [0, 3, 5, undefined],
                        [0, 3, 6, undefined], [1, 3, 7, undefined],
                        [0, 3, 8, undefined],
                        [9, 4, 0, undefined], [0, 4, 1, undefined],
                        [0, 4, 2, undefined], [0, 4, 3, undefined],
                        [0, 4, 4, undefined], [0, 4, 5, undefined],
                        [0, 4, 6, undefined], [0, 4, 7, undefined],
                        [3, 4, 8, undefined],
                        [0, 5, 0, undefined], [1, 5, 1, undefined],
                        [0, 5, 2, undefined], [0, 5, 3, undefined],
                        [9, 5, 4, undefined], [0, 5, 5, undefined],
                        [5, 5, 6, undefined], [2, 5, 7, undefined],
                        [0, 5, 8, undefined],
                        [0, 6, 0, undefined], [0, 6, 1, undefined],
                        [7, 6, 2, undefined], [2, 6, 3, undefined],
                        [0, 6, 4, undefined], [0, 6, 5, undefined],
                        [0, 6, 6, undefined], [8, 6, 7, undefined],
                        [0, 6, 8, undefined],
                        [0, 7, 0, undefined], [2, 7, 1, undefined],
                        [6, 7, 2, undefined], [0, 7, 3, undefined],
                        [0, 7, 4, undefined], [0, 7, 5, undefined],
                        [0, 7, 6, undefined], [3, 7, 7, undefined],
                        [5, 7, 8, undefined],
                        [0, 8, 0, undefined], [0, 8, 1, undefined],
                        [0, 8, 2, undefined], [4, 8, 3, undefined],
                        [0, 8, 4, undefined], [9, 8, 5, undefined],
                        [0, 8, 6, undefined], [0, 8, 7, undefined],
                        [0, 8, 8, undefined],
                    ]
                );
        });

        it("should have correct cell values and candidates", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value)
                        .toEqual(expectedRows[rowIndex][columnIndex]);
                    expect(cell.candidates).toEqual(null);
                });
            });
        });

        it("should get the correct cell from its identifier", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cellFromId(`c${rowIndex}${columnIndex}`);
                    expect(cell).toBe(grid.cell(rowIndex, columnIndex));
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value
                );
                expect(values).toEqual(expectedRows[rowIndex]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value
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
                        (cell) => cell.value
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
                (value, rowIndex, columnIndex, candidates = null) => ({
                    value, candidates, isSolved: () => value !== 0,
                })
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
                        [6, 0, 0, undefined], [7, 0, 1, undefined],
                        [2, 0, 2, undefined], [1, 0, 3, undefined],
                        [4, 0, 4, undefined], [5, 0, 5, undefined],
                        [3, 0, 6, undefined], [9, 0, 7, undefined],
                        [8, 0, 8, undefined],
                        [1, 1, 0, undefined], [4, 1, 1, undefined],
                        [5, 1, 2, undefined], [9, 1, 3, undefined],
                        [8, 1, 4, undefined], [3, 1, 5, undefined],
                        [6, 1, 6, undefined], [7, 1, 7, undefined],
                        [2, 1, 8, undefined],
                        [3, 2, 0, undefined], [8, 2, 1, undefined],
                        [9, 2, 2, undefined], [7, 2, 3, undefined],
                        [6, 2, 4, undefined], [2, 2, 5, undefined],
                        [4, 2, 6, undefined], [5, 2, 7, undefined],
                        [1, 2, 8, undefined],
                        [2, 3, 0, undefined], [6, 3, 1, undefined],
                        [3, 3, 2, undefined], [5, 3, 3, undefined],
                        [7, 3, 4, undefined], [4, 3, 5, undefined],
                        [8, 3, 6, undefined], [1, 3, 7, undefined],
                        [9, 3, 8, undefined],
                        [9, 4, 0, undefined], [5, 4, 1, undefined],
                        [8, 4, 2, undefined], [6, 4, 3, undefined],
                        [2, 4, 4, undefined], [1, 4, 5, undefined],
                        [7, 4, 6, undefined], [4, 4, 7, undefined],
                        [3, 4, 8, undefined],
                        [7, 5, 0, undefined], [1, 5, 1, undefined],
                        [4, 5, 2, undefined], [3, 5, 3, undefined],
                        [9, 5, 4, undefined], [8, 5, 5, undefined],
                        [5, 5, 6, undefined], [2, 5, 7, undefined],
                        [6, 5, 8, undefined],
                        [5, 6, 0, undefined], [9, 6, 1, undefined],
                        [7, 6, 2, undefined], [2, 6, 3, undefined],
                        [3, 6, 4, undefined], [6, 6, 5, undefined],
                        [1, 6, 6, undefined], [8, 6, 7, undefined],
                        [4, 6, 8, undefined],
                        [4, 7, 0, undefined], [2, 7, 1, undefined],
                        [6, 7, 2, undefined], [8, 7, 3, undefined],
                        [1, 7, 4, undefined], [7, 7, 5, undefined],
                        [9, 7, 6, undefined], [3, 7, 7, undefined],
                        [5, 7, 8, undefined],
                        [8, 8, 0, undefined], [3, 8, 1, undefined],
                        [1, 8, 2, undefined], [4, 8, 3, undefined],
                        [5, 8, 4, undefined], [9, 8, 5, undefined],
                        [2, 8, 6, undefined], [6, 8, 7, undefined],
                        [7, 8, 8, undefined],
                    ]
                );
        });

        it("should have correct cell values and candidates", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cell(rowIndex, columnIndex);
                    expect(cell.value)
                        .toEqual(expectedRows[rowIndex][columnIndex]);
                    expect(cell.candidates).toEqual(null);
                });
            });
        });

        it("should get the correct cell from its identifier", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                _.range(grid.columnSize).forEach((columnIndex) => {
                    const cell = grid.cellFromId(`c${rowIndex}${columnIndex}`);
                    expect(cell).toBe(grid.cell(rowIndex, columnIndex));
                });
            });
        });

        it("should have correct cell in row values", () => {
            _.range(grid.rowSize).forEach((rowIndex) => {
                const values = grid.cellsInRow(rowIndex).map(
                    (cell) => cell.value
                );
                expect(values).toEqual(expectedRows[rowIndex]);
            });
        });

        it("should have correct cell in column values", () => {
            _.range(grid.columnSize).forEach((columnIndex) => {
                const values = grid.cellsInColumn(columnIndex).map(
                    (cell) => cell.value
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
                        (cell) => cell.value
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

    describe("instance with initial candidates", () => {
        let grid;
        let _cell;

        beforeAll(() => {
            _cell = require("sudoku/cell");

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex, candidates = null) => ({
                    value, candidates, isSolved: () => value !== 0,
                })
            );

            grid = new SudokuGrid(
                {
                    c00: 3,
                    c10: 9, c11: 7, c13: 2, c14: 1,
                    c20: 6, c23: 5, c24: 8, c25: 3,
                    c30: 2, c36: 9,
                    c40: 5, c43: 6, c44: 2, c45: 1, c48: 3,
                    c52: 8, c58: 5,
                    c63: 4, c64: 3, c65: 5, c68: 2,
                    c74: 9, c77: 5, c78: 6,
                    c88: 1,
                },
                {
                    c01: [1, 2, 4, 5, 8], c02: [1, 2, 4, 5], c03: [2, 7, 9],
                    c04: [4, 6, 7], c05: [2, 4, 6, 7, 9],
                    c06: [1, 2, 4, 5, 6, 7, 8], c07: [1, 2, 4, 6, 7, 8, 9],
                    c08: [4, 7, 8, 9],
                    c12: [2, 4, 5], c15: [2, 4, 6], c16: [2, 3, 4, 5, 6, 8],
                    c17: [2, 3, 4, 6, 8], c18: [4, 8],
                    c21: [1, 2, 4], c22: [1, 2, 4], c26: [1, 2, 4, 7],
                    c27: [1, 2, 4, 7, 9], c28: [4, 7, 9],
                    c31: [1, 3, 4, 6], c32: [1, 3, 4, 6, 7], c33: [3, 7, 8],
                    c34: [4, 5, 7], c35: [4, 7, 8], c37: [1, 4, 6, 7, 8],
                    c38: [4, 7, 8],
                    c41: [4, 9], c42: [4, 7, 9], c46: [4, 7, 8], c47: [4, 7, 8],
                    c50: [1, 4, 7], c51: [1, 3, 4, 6, 9], c53: [3, 7, 9],
                    c54: [4, 7], c55: [4, 7, 9], c56: [1, 2, 4, 6, 7],
                    c57: [1, 2, 4, 6, 7],
                    c60: [1, 7, 8], c61: [1, 6, 8, 9], c62: [1, 6, 7, 9],
                    c66: [7, 8], c67: [7, 8, 9],
                    c70: [1, 4, 7, 8], c71: [1, 2, 3, 4, 8],
                    c72: [1, 2, 3, 4, 7], c73: [1, 2, 7, 8], c75: [2, 7, 8],
                    c76: [3, 4, 7, 8],
                    c80: [4, 7, 8], c81: [2, 3, 4, 5, 6, 8, 9],
                    c82: [2, 3, 4, 5, 6, 7, 9], c83: [2, 7, 8], c84: [6, 7],
                    c85: [2, 6, 7, 8], c86: [3, 4, 7, 8, 9],
                    c87: [3, 4, 7, 8, 9],
                }
            );
        });

        it("should initiate all cells", () => {
            expect(_cell.SudokuCell.mock.calls)
                .toEqual(
                    [
                        [3, 0, 0, undefined],
                        [0, 0, 1, [1, 2, 4, 5, 8]],
                        [0, 0, 2, [1, 2, 4, 5]],
                        [0, 0, 3, [2, 7, 9]],
                        [0, 0, 4, [4, 6, 7]],
                        [0, 0, 5, [2, 4, 6, 7, 9]],
                        [0, 0, 6, [1, 2, 4, 5, 6, 7, 8]],
                        [0, 0, 7, [1, 2, 4, 6, 7, 8, 9]],
                        [0, 0, 8, [4, 7, 8, 9]],
                        [9, 1, 0, undefined],
                        [7, 1, 1, undefined],
                        [0, 1, 2, [2, 4, 5]],
                        [2, 1, 3, undefined],
                        [1, 1, 4, undefined],
                        [0, 1, 5, [2, 4, 6]],
                        [0, 1, 6, [2, 3, 4, 5, 6, 8]],
                        [0, 1, 7, [2, 3, 4, 6, 8]],
                        [0, 1, 8, [4, 8]],
                        [6, 2, 0, undefined],
                        [0, 2, 1, [1, 2, 4]],
                        [0, 2, 2, [1, 2, 4]],
                        [5, 2, 3, undefined],
                        [8, 2, 4, undefined],
                        [3, 2, 5, undefined],
                        [0, 2, 6, [1, 2, 4, 7]],
                        [0, 2, 7, [1, 2, 4, 7, 9]],
                        [0, 2, 8, [4, 7, 9]],
                        [2, 3, 0, undefined],
                        [0, 3, 1, [1, 3, 4, 6]],
                        [0, 3, 2, [1, 3, 4, 6, 7]],
                        [0, 3, 3, [3, 7, 8]],
                        [0, 3, 4, [4, 5, 7]],
                        [0, 3, 5, [4, 7, 8]],
                        [9, 3, 6, undefined],
                        [0, 3, 7, [1, 4, 6, 7, 8]],
                        [0, 3, 8, [4, 7, 8]],
                        [5, 4, 0, undefined],
                        [0, 4, 1, [4, 9]],
                        [0, 4, 2, [4, 7, 9]],
                        [6, 4, 3, undefined],
                        [2, 4, 4, undefined],
                        [1, 4, 5, undefined],
                        [0, 4, 6, [4, 7, 8]],
                        [0, 4, 7, [4, 7, 8]],
                        [3, 4, 8, undefined],
                        [0, 5, 0, [1, 4, 7]],
                        [0, 5, 1, [1, 3, 4, 6, 9]],
                        [8, 5, 2, undefined],
                        [0, 5, 3, [3, 7, 9]],
                        [0, 5, 4, [4, 7]],
                        [0, 5, 5, [4, 7, 9]],
                        [0, 5, 6, [1, 2, 4, 6, 7]],
                        [0, 5, 7, [1, 2, 4, 6, 7]],
                        [5, 5, 8, undefined],
                        [0, 6, 0, [1, 7, 8]],
                        [0, 6, 1, [1, 6, 8, 9]],
                        [0, 6, 2, [1, 6, 7, 9]],
                        [4, 6, 3, undefined],
                        [3, 6, 4, undefined],
                        [5, 6, 5, undefined],
                        [0, 6, 6, [7, 8]],
                        [0, 6, 7, [7, 8, 9]],
                        [2, 6, 8, undefined],
                        [0, 7, 0, [1, 4, 7, 8]],
                        [0, 7, 1, [1, 2, 3, 4, 8]],
                        [0, 7, 2, [1, 2, 3, 4, 7]],
                        [0, 7, 3, [1, 2, 7, 8]],
                        [9, 7, 4, undefined],
                        [0, 7, 5, [2, 7, 8]],
                        [0, 7, 6, [3, 4, 7, 8]],
                        [5, 7, 7, undefined],
                        [6, 7, 8, undefined],
                        [0, 8, 0, [4, 7, 8]],
                        [0, 8, 1, [2, 3, 4, 5, 6, 8, 9]],
                        [0, 8, 2, [2, 3, 4, 5, 6, 7, 9]],
                        [0, 8, 3, [2, 7, 8]],
                        [0, 8, 4, [6, 7]],
                        [0, 8, 5, [2, 6, 7, 8]],
                        [0, 8, 6, [3, 4, 7, 8, 9]],
                        [0, 8, 7, [3, 4, 7, 8, 9]],
                        [1, 8, 8, undefined],
                    ]
                );
        });
    });

    describe("update", () => {
        let updateSolvedCellsSpy;
        let updateCandidatesSpy;
        let grid;

        beforeEach(() => {
            grid = new SudokuGrid();
            updateSolvedCellsSpy = jest.fn(null);
            updateCandidatesSpy = jest.fn(null);

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
            resolveSpy = jest.fn(null);

            _cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex) => ({resolve: resolveSpy})
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
        let grid;
        let updateCandidatesSpy;

        beforeEach(() => {
            updateCandidatesSpy = jest.fn(null);

            grid = new SudokuGrid();

            jest.spyOn(grid, "cellsInRow")
                .mockImplementation((rowIndex) =>
                    _.range(9).map((columnIndex) => ({
                        rowIndex, columnIndex,
                        value: 0, updateCandidates: updateCandidatesSpy,
                    }))
                );

            jest.spyOn(grid, "cellsInColumn")
                .mockImplementation((columnIndex) =>
                    _.range(9).map((rowIndex) => ({
                        rowIndex, columnIndex,
                        value: 0, updateCandidates: updateCandidatesSpy,
                    }))
                );

            jest.spyOn(grid, "cellsInBlock")
                .mockImplementation((blockIndex) => {
                    const cells = [];

                    _.range(3).forEach((rowIndex) =>
                        _.range(3).forEach((columnIndex) =>
                            cells.push({
                                rowIndex, columnIndex,
                                value: 0, updateCandidates: updateCandidatesSpy,
                            })
                        )
                    );

                    return cells;
                });
        });

        it("should call 'updateCandidates' for all cells with positive results",
            () => {
                updateCandidatesSpy.mockReturnValue(true);

                expect(grid.updateCandidates()).toEqual(true);
                expect(updateCandidatesSpy).toHaveBeenCalledTimes(81);
            }
        );

        it("should call 'updateCandidates' for all cells with negative results",
            () => {
                updateCandidatesSpy.mockReturnValue(false);

                expect(grid.updateCandidates()).toEqual(false);
                expect(updateCandidatesSpy).toHaveBeenCalledTimes(81);
            }
        );

        it("should call 'updateCandidates' for all cells with mixed results",
            () => {
                updateCandidatesSpy
                    .mockReturnValue(false)
                    .mockReturnValueOnce(true)
                    .mockReturnValueOnce(true);

                expect(grid.updateCandidates()).toEqual(true);
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
                        value,
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

    describe("toValueMapping", () => {
        beforeAll(() => {
            const cell = require("sudoku/cell");

            cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex, candidates) => (
                    {
                        value, candidates,
                        identifier: `c${rowIndex}${columnIndex}`,
                    }
                )
            );
        });

        it("should return content of empty grid as a mapping", () => {
            const grid = new SudokuGrid();

            expect(grid.toValueMapping()).toEqual({
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

                expect(grid.toValueMapping()).toEqual({
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

    describe("toCandidateMapping", () => {
        beforeAll(() => {
            const cell = require("sudoku/cell");

            cell.SudokuCell = jest.fn(
                (value, rowIndex, columnIndex, candidates) => {
                    let _candidates = candidates;

                    if (!candidates) {
                        _candidates = (value) ?
                            [] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    }

                    return {
                        value,
                        candidates: _candidates,
                        identifier: `c${rowIndex}${columnIndex}`,
                    };
                }
            );
        });

        it("should return content of empty grid as a mapping", () => {
            const grid = new SudokuGrid();

            expect(grid.toCandidateMapping()).toEqual({
                c00: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c01: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c02: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c03: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c04: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c05: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c06: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c07: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c08: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c10: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c11: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c12: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c13: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c14: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c15: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c16: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c17: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c18: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c20: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c21: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c22: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c23: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c24: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c25: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c26: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c27: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c28: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c30: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c31: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c32: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c33: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c34: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c35: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c36: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c37: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c38: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c40: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c41: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c42: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c43: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c44: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c45: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c46: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c47: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c48: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c50: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c51: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c52: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c53: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c54: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c55: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c56: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c57: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c58: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c60: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c61: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c62: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c63: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c64: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c65: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c66: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c67: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c68: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c70: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c71: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c72: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c73: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c74: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c75: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c76: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c77: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c78: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c80: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c81: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c82: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c83: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c84: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c85: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c86: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c87: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                c88: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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

                expect(grid.toCandidateMapping()).toEqual({
                    c00: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c01: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c02: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c03: [],
                    c04: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c05: [],
                    c06: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c07: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c08: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c10: [],
                    c11: [],
                    c12: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c13: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c14: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c15: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c16: [],
                    c17: [],
                    c18: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c20: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c21: [],
                    c22: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c23: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c24: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c25: [],
                    c26: [],
                    c27: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c28: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c30: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c31: [],
                    c32: [],
                    c33: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c34: [],
                    c35: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c36: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c37: [],
                    c38: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c40: [],
                    c41: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c42: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c43: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c44: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c45: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c46: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c47: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c48: [],
                    c50: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c51: [],
                    c52: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c53: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c54: [],
                    c55: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c56: [],
                    c57: [],
                    c58: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c60: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c61: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c62: [],
                    c63: [],
                    c64: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c65: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c66: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c67: [],
                    c68: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c70: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c71: [],
                    c72: [],
                    c73: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c74: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c75: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c76: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c77: [],
                    c78: [],
                    c80: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c81: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c82: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c83: [],
                    c84: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c85: [],
                    c86: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c87: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    c88: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                });
            }
        );

        it("should return content of grid with initial candidates as a mapping",
            () => {
                const grid = new SudokuGrid(
                    {
                        c00: 3,
                        c10: 9, c11: 7, c13: 2, c14: 1,
                        c20: 6, c23: 5, c24: 8, c25: 3,
                        c30: 2, c36: 9,
                        c40: 5, c43: 6, c44: 2, c45: 1, c48: 3,
                        c52: 8, c58: 5,
                        c63: 4, c64: 3, c65: 5, c68: 2,
                        c74: 9, c77: 5, c78: 6,
                        c88: 1,
                    },
                    {
                        c01: [1, 2, 4, 5, 8], c02: [1, 2, 4, 5], c03: [2, 7, 9],
                        c04: [4, 6, 7], c05: [2, 4, 6, 7, 9],
                        c06: [1, 2, 4, 5, 6, 7, 8], c07: [1, 2, 4, 6, 7, 8, 9],
                        c08: [4, 7, 8, 9],
                        c12: [2, 4, 5], c15: [2, 4, 6], c16: [2, 3, 4, 5, 6, 8],
                        c17: [2, 3, 4, 6, 8], c18: [4, 8],
                        c21: [1, 2, 4], c22: [1, 2, 4], c26: [1, 2, 4, 7],
                        c27: [1, 2, 4, 7, 9], c28: [4, 7, 9],
                        c31: [1, 3, 4, 6], c32: [1, 3, 4, 6, 7], c33: [3, 7, 8],
                        c34: [4, 5, 7], c35: [4, 7, 8], c37: [1, 4, 6, 7, 8],
                        c38: [4, 7, 8],
                        c41: [4, 9], c42: [4, 7, 9], c46: [4, 7, 8], c47: [4, 7, 8],
                        c50: [1, 4, 7], c51: [1, 3, 4, 6, 9], c53: [3, 7, 9],
                        c54: [4, 7], c55: [4, 7, 9], c56: [1, 2, 4, 6, 7],
                        c57: [1, 2, 4, 6, 7],
                        c60: [1, 7, 8], c61: [1, 6, 8, 9], c62: [1, 6, 7, 9],
                        c66: [7, 8], c67: [7, 8, 9],
                        c70: [1, 4, 7, 8], c71: [1, 2, 3, 4, 8],
                        c72: [1, 2, 3, 4, 7], c73: [1, 2, 7, 8], c75: [2, 7, 8],
                        c76: [3, 4, 7, 8],
                        c80: [4, 7, 8], c81: [2, 3, 4, 5, 6, 8, 9],
                        c82: [2, 3, 4, 5, 6, 7, 9], c83: [2, 7, 8], c84: [6, 7],
                        c85: [2, 6, 7, 8], c86: [3, 4, 7, 8, 9],
                        c87: [3, 4, 7, 8, 9],
                    }
                );

                expect(grid.toCandidateMapping()).toEqual({
                    c00: [],
                    c01: [1, 2, 4, 5, 8],
                    c02: [1, 2, 4, 5],
                    c03: [2, 7, 9],
                    c04: [4, 6, 7],
                    c05: [2, 4, 6, 7, 9],
                    c06: [1, 2, 4, 5, 6, 7, 8],
                    c07: [1, 2, 4, 6, 7, 8, 9],
                    c08: [4, 7, 8, 9],
                    c10: [],
                    c11: [],
                    c12: [2, 4, 5],
                    c13: [],
                    c14: [],
                    c15: [2, 4, 6],
                    c16: [2, 3, 4, 5, 6, 8],
                    c17: [2, 3, 4, 6, 8],
                    c18: [4, 8],
                    c20: [],
                    c21: [1, 2, 4],
                    c22: [1, 2, 4],
                    c23: [],
                    c24: [],
                    c25: [],
                    c26: [1, 2, 4, 7],
                    c27: [1, 2, 4, 7, 9],
                    c28: [4, 7, 9],
                    c30: [],
                    c31: [1, 3, 4, 6],
                    c32: [1, 3, 4, 6, 7],
                    c33: [3, 7, 8],
                    c34: [4, 5, 7],
                    c35: [4, 7, 8],
                    c36: [],
                    c37: [1, 4, 6, 7, 8],
                    c38: [4, 7, 8],
                    c40: [],
                    c41: [4, 9],
                    c42: [4, 7, 9],
                    c43: [],
                    c44: [],
                    c45: [],
                    c46: [4, 7, 8],
                    c47: [4, 7, 8],
                    c48: [],
                    c50: [1, 4, 7],
                    c51: [1, 3, 4, 6, 9],
                    c52: [],
                    c53: [3, 7, 9],
                    c54: [4, 7],
                    c55: [4, 7, 9],
                    c56: [1, 2, 4, 6, 7],
                    c57: [1, 2, 4, 6, 7],
                    c58: [],
                    c60: [1, 7, 8],
                    c61: [1, 6, 8, 9],
                    c62: [1, 6, 7, 9],
                    c63: [],
                    c64: [],
                    c65: [],
                    c66: [7, 8],
                    c67: [7, 8, 9],
                    c68: [],
                    c70: [1, 4, 7, 8],
                    c71: [1, 2, 3, 4, 8],
                    c72: [1, 2, 3, 4, 7],
                    c73: [1, 2, 7, 8],
                    c74: [],
                    c75: [2, 7, 8],
                    c76: [3, 4, 7, 8],
                    c77: [],
                    c78: [],
                    c80: [4, 7, 8],
                    c81: [2, 3, 4, 5, 6, 8, 9],
                    c82: [2, 3, 4, 5, 6, 7, 9],
                    c83: [2, 7, 8],
                    c84: [6, 7],
                    c85: [2, 6, 7, 8],
                    c86: [3, 4, 7, 8, 9],
                    c87: [3, 4, 7, 8, 9],
                    c88: [],
                });
            }
        );
    });
});
