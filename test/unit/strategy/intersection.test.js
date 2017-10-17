/* eslint-disable object-property-newline, no-unused-vars */


import _ from "lodash";

import {
    IntersectionStrategy,
    PointingStrategy,
    BoxLineReductionStrategy,
} from "sudoku/strategy/intersection";


describe("IntersectionStrategy", () => {
    describe("processGrid", () => {
        const grid = jest.fn(null);
        grid.rowSize = 9;
        grid.columnSize = 9;
        grid.blockRowSize = 3;
        grid.blockColumnSize = 3;

        let processCellsSpy;

        beforeEach(() => {
            processCellsSpy = jest.fn(null);
            IntersectionStrategy.processCells = processCellsSpy;

            grid.cellsInRow = jest.fn(() =>
                ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"]
            );
            grid.cellsInColumn = jest.fn(() =>
                ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"]
            );
            grid.cellsInBlock = jest.fn(null);
        });

        it("should process a grid with no result", () => {
            processCellsSpy.mockReturnValue({});
            expect(IntersectionStrategy.processGrid(grid)).toEqual({});
            expect(grid.cellsInRow.mock.calls)
                .toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8]]);
            expect(grid.cellsInColumn.mock.calls)
                .toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8]]);
            expect(grid.cellsInBlock.mock.calls.length).toEqual(0);
            expect(processCellsSpy.mock.calls.length).toEqual(9);
        });

        it("should process a grid with a few results", () => {
            processCellsSpy.mockReturnValue({})
                .mockReturnValueOnce({c01: "CELL1", c11: "CELL2"})
                .mockReturnValueOnce({c03: "CELL3"})
                .mockReturnValueOnce({c01: "CELL4", c31: "CELL5"})
                .mockReturnValueOnce({c50: "CELL6", c55: "CELL7", c58: "CELL8"});
            expect(IntersectionStrategy.processGrid(grid)).toEqual({
                c01: "CELL4", c03: "CELL3",
                c11: "CELL2",
                c31: "CELL5",
                c50: "CELL6", c55: "CELL7", c58: "CELL8",
            });
            expect(processCellsSpy.mock.calls).toEqual(
                _.range(9).map(() => [
                    [
                        ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"],
                        ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"],
                        ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"],
                    ],
                    [
                        ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
                        ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
                        ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
                    ],
                ]),
            );
        });
    });

    describe("cellsInIntersection", () => {
        it("should return the centered intersection cells", () => {
            const cellsInRows = _.range(3).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({rowIndex, columnIndex}))
            );

            const cellsInColumns = _.range(3, 6).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({rowIndex, columnIndex}))
            );

            const cells = IntersectionStrategy.cellsInIntersection(
                cellsInRows, cellsInColumns
            );

            expect(cells)
                .toEqual([
                    cellsInRows[0][3],
                    cellsInRows[0][4],
                    cellsInRows[0][5],
                    cellsInRows[1][3],
                    cellsInRows[1][4],
                    cellsInRows[1][5],
                    cellsInRows[2][3],
                    cellsInRows[2][4],
                    cellsInRows[2][5],
                ]);
        });

        it("should return the top-left intersection cells", () => {
            const cellsInRows = _.range(3).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({rowIndex, columnIndex}))
            );

            const cellsInColumns = _.range(3).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({rowIndex, columnIndex}))
            );

            const cells = IntersectionStrategy.cellsInIntersection(
                cellsInRows, cellsInColumns
            );

            expect(cells)
                .toEqual([
                    cellsInRows[0][0],
                    cellsInRows[0][1],
                    cellsInRows[0][2],
                    cellsInRows[1][0],
                    cellsInRows[1][1],
                    cellsInRows[1][2],
                    cellsInRows[2][0],
                    cellsInRows[2][1],
                    cellsInRows[2][2],
                ]);
        });
    });
});

describe("PointingStrategy", () => {
    it("should have the proper identifier", () => {
        expect(PointingStrategy.identifier)
            .toEqual("Pointing Strategy");
    });

    describe("processCells", () => {
        let cellsInRows = [];
        let cellsInColumns = [];

        let cellsInIntersectionSpy;
        let getBlockCountersSpy;
        let getNonBlockCellsMappingSpy;
        let getMatchingCandidatesSpy;

        beforeEach(() => {
            cellsInRows = _.range(3).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${rowIndex}${columnIndex}`,
                    candidates: [],
                    latestCandidates: [],
                    setNextCandidates: jest.fn(null),
                })),
            );

            cellsInColumns = _.range(3).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${columnIndex}${rowIndex}`,
                    candidates: [],
                    latestCandidates: [],
                    setNextCandidates: jest.fn(null),
                })),
            );

            cellsInIntersectionSpy = jest.spyOn(
                PointingStrategy, "cellsInIntersection"
            );
            getBlockCountersSpy = jest.spyOn(
                PointingStrategy, "getBlockCounters"
            );
            getNonBlockCellsMappingSpy = jest.spyOn(
                PointingStrategy, "getNonBlockCellsMapping"
            );
            getMatchingCandidatesSpy = jest.spyOn(
                PointingStrategy, "getMatchingCandidates"
            );
        });

        it("should not match any candidates", () => {
            expect(PointingStrategy.processCells(cellsInRows, cellsInColumns))
                .toEqual({});

            expect(cellsInIntersectionSpy)
                .toHaveBeenLastCalledWith(cellsInRows, cellsInColumns);
            expect(getBlockCountersSpy)
                .toHaveBeenLastCalledWith([
                    cellsInRows[0][0],
                    cellsInRows[0][1],
                    cellsInRows[0][2],
                    cellsInRows[1][0],
                    cellsInRows[1][1],
                    cellsInRows[1][2],
                    cellsInRows[2][0],
                    cellsInRows[2][1],
                    cellsInRows[2][2],
                ]);
            expect(getNonBlockCellsMappingSpy)
                .toHaveBeenLastCalledWith(
                    [
                        cellsInRows[0][0],
                        cellsInRows[0][1],
                        cellsInRows[0][2],
                        cellsInRows[1][0],
                        cellsInRows[1][1],
                        cellsInRows[1][2],
                        cellsInRows[2][0],
                        cellsInRows[2][1],
                        cellsInRows[2][2],
                    ],
                    cellsInRows,
                    cellsInColumns,
                );
            expect(getMatchingCandidatesSpy)
                .toHaveBeenLastCalledWith({
                    global: {},
                    row: {0: {}, 1: {}, 2: {}},
                    column: {0: {}, 1: {}, 2: {}},
                });
        });

        it("should updates matching candidates in rows", () => {
            const rowsCandidates = [
                [
                    [], [4, 8], [2, 4, 8],
                    [2, 4, 5, 8], [], [],
                    [], [2, 4, 5], [],
                ],
                [
                    [1, 3, 9], [1, 4, 9], [1, 2, 3, 4, 9],
                    [2, 3, 4, 5, 6], [2, 3, 4, 5], [3, 6],
                    [1, 2, 5, 7], [], [5, 7],
                ],
                [
                    [], [1, 4, 8], [],
                    [], [2, 3, 4, 8], [3, 6, 8],
                    [1, 2], [2, 4, 6], [4, 6],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = rowsCandidates[row][column];
                    cellsInRows[row][column].candidates = candidates;
                    cellsInRows[row][column].latestCandidates = candidates;
                }),
            );

            const columnsCandidates = [
                [
                    [], [1, 3, 9], [],
                    [], [1, 8, 9], [],
                    [3, 8, 9], [1, 8, 9], [],
                ],
                [
                    [4, 8], [1, 4, 9], [1, 4, 8],
                    [], [], [],
                    [], [1, 4, 8, 9], [],
                ],
                [
                    [2, 4, 8], [1, 2, 3, 4, 9], [],
                    [6, 9], [1, 6, 8, 9], [1, 8, 9],
                    [], [1, 4, 8, 9], [3, 4, 8, 9],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = columnsCandidates[row][column];
                    cellsInColumns[row][column].candidates = candidates;
                    cellsInColumns[row][column].latestCandidates = candidates;
                }),
            );

            expect(PointingStrategy.processCells(cellsInRows, cellsInColumns))
                .toEqual({
                    c13: cellsInRows[1][3],
                    c14: cellsInRows[1][4],
                    c15: cellsInRows[1][5],
                });

            expect(getMatchingCandidatesSpy)
                .toHaveBeenLastCalledWith({
                    global: {1: 4, 2: 2, 3: 2, 4: 5, 8: 3, 9: 3},
                    row: {
                        0: {2: 1, 4: 2, 8: 2},
                        1: {1: 3, 2: 1, 3: 2, 4: 2, 9: 3},
                        2: {1: 1, 4: 1, 8: 1},
                    },
                    column: {
                        0: {1: 1, 3: 1, 9: 1},
                        1: {1: 2, 4: 3, 8: 2, 9: 1},
                        2: {1: 1, 2: 2, 3: 1, 4: 2, 8: 1, 9: 1},
                    },
                });

            expect(cellsInRows[1][3].setNextCandidates)
                .toHaveBeenLastCalledWith([2, 4, 5, 6]);
            expect(cellsInRows[1][4].setNextCandidates)
                .toHaveBeenLastCalledWith([2, 4, 5]);
            expect(cellsInRows[1][5].setNextCandidates)
                .toHaveBeenLastCalledWith([6]);
        });

        it("should updates matching candidates in columns", () => {
            const rowsCandidates = [
                [
                    [], [2, 7, 8], [1, 8],
                    [1, 6], [], [3, 7],
                    [2, 3, 6], [2, 3, 8], [],
                ],
                [
                    [2, 8, 9], [], [4, 8, 9],
                    [3, 4, 8], [3, 4, 5, 8], [3, 4, 5],
                    [2, 3, 9], [], [],
                ],
                [
                    [], [4, 7, 8, 9], [1, 4, 8, 9],
                    [1, 6], [], [4, 7],
                    [6, 9], [8, 9], [],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = rowsCandidates[row][column];
                    cellsInRows[row][column].candidates = candidates;
                    cellsInRows[row][column].latestCandidates = candidates;
                }),
            );

            const columnsCandidates = [
                [
                    [], [2, 8, 9], [],
                    [7, 8, 9], [], [6, 7, 8],
                    [1, 2, 6, 9], [2, 6, 8], [1, 2],
                ],
                [
                    [2, 7, 8], [], [4, 7, 8, 9],
                    [], [], [7, 8],
                    [2, 4, 9], [2, 4, 8], [],
                ],
                [
                    [1, 8], [4, 8, 9], [1, 4, 8, 9],
                    [], [5, 6, 8, 9], [5, 6, 8],
                    [1, 3, 4, 6, 9], [3, 4, 6, 8], [],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = columnsCandidates[row][column];
                    cellsInColumns[row][column].candidates = candidates;
                    cellsInColumns[row][column].latestCandidates = candidates;
                }),
            );

            expect(PointingStrategy.processCells(cellsInRows, cellsInColumns))
                .toEqual({
                    c15: cellsInColumns[1][5],
                    c26: cellsInColumns[2][6],
                });

            expect(getMatchingCandidatesSpy)
                .toHaveBeenLastCalledWith({
                    global: {1: 2, 2: 2, 4: 3, 7: 2, 8: 6, 9: 4},
                    row: {
                        0: {1: 1, 2: 1, 7: 1, 8: 2},
                        1: {2: 1, 4: 1, 8: 2, 9: 2},
                        2: {1: 1, 4: 2, 7: 1, 8: 2, 9: 2},
                    },
                    column: {
                        0: {2: 1, 8: 1, 9: 1},
                        1: {2: 1, 4: 1, 7: 2, 8: 2, 9: 1},
                        2: {1: 2, 4: 2, 8: 3, 9: 2},
                    },
                });

            expect(cellsInColumns[1][5].setNextCandidates)
                .toHaveBeenLastCalledWith([8]);
            expect(cellsInColumns[2][6].setNextCandidates)
                .toHaveBeenLastCalledWith([3, 4, 6, 9]);
        });
    });

    describe("getBlockCounters", () => {
        let cellsInBlock;

        beforeEach(() => {
            cellsInBlock = [];

            _.range(3).forEach((rowIndex) =>
                _.range(3).forEach((columnIndex) => (
                    cellsInBlock.push({rowIndex, columnIndex, candidates: []})
                )),
            );
        });

        it("should return the counters from all cells", () => {
            cellsInBlock[0].candidates = [];
            cellsInBlock[1].candidates = [8, 4];
            cellsInBlock[2].candidates = [8, 2, 4];
            cellsInBlock[3].candidates = [1, 3, 9];
            cellsInBlock[4].candidates = [1, 4, 9];
            cellsInBlock[5].candidates = [1, 2, 3, 4, 9];
            cellsInBlock[6].candidates = [];
            cellsInBlock[7].candidates = [8, 1, 4];
            cellsInBlock[8].candidates = [];

            const expected = {
                global: {1: 4, 2: 2, 3: 2, 4: 5, 8: 3, 9: 3},
                row: {
                    0: {8: 2, 4: 2, 2: 1},
                    1: {1: 3, 9: 3, 3: 2, 4: 2, 2: 1},
                    2: {8: 1, 1: 1, 4: 1},
                },
                column: {
                    0: {1: 1, 3: 1, 9: 1},
                    1: {4: 3, 8: 2, 1: 2, 9: 1},
                    2: {2: 2, 4: 2, 1: 1, 3: 1, 8: 1, 9: 1},
                },
            };
            expect(PointingStrategy.getBlockCounters(cellsInBlock))
                .toEqual(expected);
        });
    });

    describe("getNonBlockCellsMapping", () => {
        it("should return the mapping per row and column indices", () => {
            const cellsInBlock = [
                {rowIndex: 3, columnIndex: 0},
                {rowIndex: 3, columnIndex: 1},
                {rowIndex: 3, columnIndex: 2},
                {rowIndex: 4, columnIndex: 0},
                {rowIndex: 4, columnIndex: 1},
                {rowIndex: 4, columnIndex: 2},
                {rowIndex: 5, columnIndex: 0},
                {rowIndex: 5, columnIndex: 1},
                {rowIndex: 5, columnIndex: 2},
            ];

            const cellsInRows = _.range(3, 6).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({rowIndex, columnIndex}))
            );

            const cellsInColumns = _.range(3).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({rowIndex, columnIndex}))
            );

            const expected = {
                row: {
                    3: cellsInRows[0].slice(3),
                    4: cellsInRows[1].slice(3),
                    5: cellsInRows[2].slice(3),
                },
                column: {
                    0: cellsInColumns[0].slice(0, 3)
                        .concat(cellsInColumns[0].slice(6)),
                    1: cellsInColumns[1].slice(0, 3)
                        .concat(cellsInColumns[1].slice(6)),
                    2: cellsInColumns[2].slice(0, 3)
                        .concat(cellsInColumns[2].slice(6)),
                },
            };

            const mapping = PointingStrategy.getNonBlockCellsMapping(
                cellsInBlock, cellsInRows, cellsInColumns
            );

            expect(mapping).toEqual(expected);
        });
    });

    describe("getMatchingCandidates", () => {
        it("should return list of candidates per row and column", () => {
            const counters = {
                global: {2: 2, 3: 4, 4: 2, 7: 6, 8: 6, 9: 2},
                row: {
                    6: {2: 2, 3: 1, 7: 2, 8: 2, 9: 1},
                    7: {3: 1, 7: 1, 8: 1},
                    8: {3: 2, 4: 2, 7: 3, 8: 3, 9: 1},
                },
                column: {
                    3: {3: 2, 4: 1, 7: 2, 8: 2},
                    4: {2: 1, 7: 2, 8: 2, 9: 2},
                    5: {2: 1, 3: 2, 4: 1, 7: 2, 8: 2},
                },
            };

            expect(PointingStrategy.getMatchingCandidates(counters))
                .toEqual({row: [[6, 2], [8, 4]], column: [[4, 9]]});
        });
    });
});

describe("BoxLineReductionStrategy", () => {
    it("should have the proper identifier", () => {
        expect(BoxLineReductionStrategy.identifier)
            .toEqual("Box Line Reduction Strategy");
    });

    describe("processCells", () => {
        let cellsInRows = [];
        let cellsInColumns = [];

        let cellsInIntersectionSpy;
        let getCountersSpy;
        let getCellsMappingSpy;
        let getMatchingCandidatesSpy;

        beforeEach(() => {
            cellsInRows = _.range(3).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${rowIndex}${columnIndex}`,
                    candidates: [],
                    latestCandidates: [],
                    setNextCandidates: jest.fn(null),
                }))
            );

            cellsInColumns = _.range(3).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${rowIndex}${columnIndex}`,
                    candidates: [],
                    latestCandidates: [],
                    setNextCandidates: jest.fn(null),
                }))
            );

            cellsInIntersectionSpy = jest.spyOn(
                BoxLineReductionStrategy, "cellsInIntersection"
            );
            getCountersSpy = jest.spyOn(
                BoxLineReductionStrategy, "getCounters"
            );
            getCellsMappingSpy = jest.spyOn(
                BoxLineReductionStrategy, "getCellsMapping"
            );
            getMatchingCandidatesSpy = jest.spyOn(
                BoxLineReductionStrategy, "getMatchingCandidates"
            );
        });

        it("should not match any candidates", () => {
            expect(
                BoxLineReductionStrategy
                    .processCells(cellsInRows, cellsInColumns)
            ).toEqual({});

            expect(cellsInIntersectionSpy)
                .toHaveBeenLastCalledWith(cellsInRows, cellsInColumns);
            expect(getCountersSpy)
                .toHaveBeenLastCalledWith(cellsInRows, cellsInColumns);
            expect(getCellsMappingSpy)
                .toHaveBeenLastCalledWith([
                    cellsInRows[0][0],
                    cellsInRows[0][1],
                    cellsInRows[0][2],
                    cellsInRows[1][0],
                    cellsInRows[1][1],
                    cellsInRows[1][2],
                    cellsInRows[2][0],
                    cellsInRows[2][1],
                    cellsInRows[2][2],
                ]);
            expect(getMatchingCandidatesSpy)
                .toHaveBeenLastCalledWith(
                    {
                        row: {
                            0: [
                                cellsInRows[0][0],
                                cellsInRows[0][1],
                                cellsInRows[0][2],
                            ],
                            1: [
                                cellsInRows[1][0],
                                cellsInRows[1][1],
                                cellsInRows[1][2],
                            ],
                            2: [
                                cellsInRows[2][0],
                                cellsInRows[2][1],
                                cellsInRows[2][2],
                            ],
                        },
                        column: {
                            0: [
                                cellsInRows[0][0],
                                cellsInRows[1][0],
                                cellsInRows[2][0],
                            ],
                            1: [
                                cellsInRows[0][1],
                                cellsInRows[1][1],
                                cellsInRows[2][1],
                            ],
                            2: [
                                cellsInRows[0][2],
                                cellsInRows[1][2],
                                cellsInRows[2][2],
                            ],
                        },
                    },
                    {
                        row: {
                            0: {}, 1: {}, 2: {},
                            3: {}, 4: {}, 5: {},
                            6: {}, 7: {}, 8: {},
                        },
                        column: {
                            0: {}, 1: {}, 2: {},
                            3: {}, 4: {}, 5: {},
                            6: {}, 7: {}, 8: {},
                        },
                    }
                );
        });

        it("should updates matching candidates in rows", () => {
            const rowsCandidates = [
                [
                    [2, 4, 5], [2, 4, 5, 9], [],
                    [4, 5], [], [],
                    [], [4, 9], [],
                ],
                [
                    [], [2, 3, 4, 5, 6], [3, 4, 5, 6],
                    [3, 4, 5], [], [2, 3, 5],
                    [1, 2, 4, 7], [4, 7], [1, 4, 5, 7],
                ],
                [
                    [2, 3, 4, 5], [2, 3, 4, 5, 9], [],
                    [], [], [2, 3, 5],
                    [2, 4], [], [4, 5, 9],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = rowsCandidates[row][column];
                    cellsInRows[row][column].candidates = candidates;
                    cellsInRows[row][column].latestCandidates = candidates;
                }),
            );

            const columnsCandidates = [
                [
                    [2, 4, 5], [], [2, 3, 4, 5],
                    [1, 2, 5, 7], [1, 3, 4, 7], [1, 2, 4, 7],
                    [], [1, 4, 5, 7], [],
                ],
                [
                    [2, 4, 5, 9], [2, 3, 4, 5, 6], [2, 3, 4, 5, 9],
                    [1, 2, 5, 6, 7], [1, 3, 4, 7], [1, 2, 4, 7, 8],
                    [1, 5, 7, 8], [1, 4, 5, 7], [3, 7, 8],
                ],
                [
                    [], [3, 4, 5, 6], [],
                    [5, 6], [], [4, 8],
                    [5, 8], [], [3, 8],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = columnsCandidates[row][column];
                    cellsInColumns[row][column].candidates = candidates;
                    cellsInColumns[row][column].latestCandidates = candidates;
                }),
            );

            expect(
                BoxLineReductionStrategy
                    .processCells(cellsInRows, cellsInColumns)
            ).toEqual({
                c11: cellsInRows[1][1],
                c20: cellsInRows[2][0],
                c21: cellsInRows[2][1],
            });

            expect(cellsInRows[1][1].setNextCandidates)
                .toHaveBeenLastCalledWith([3, 4, 5, 6]);
            expect(cellsInRows[2][0].setNextCandidates)
                .toHaveBeenLastCalledWith([3, 4, 5]);
            expect(cellsInRows[2][1].setNextCandidates)
                .toHaveBeenLastCalledWith([3, 4, 5, 9]);
        });

        it("should updates matching candidates in columns", () => {
            const rowsCandidates = [
                [
                    [], [4, 9], [],
                    [4, 5], [], [],
                    [2, 4, 5], [2, 4, 5, 9], [],
                ],
                [
                    [1, 2, 4, 7], [4, 7], [1, 4, 5, 7],
                    [3, 4, 5], [], [2, 3, 5],
                    [], [3, 4, 5, 6], [3, 4, 5, 6],
                ],
                [
                    [2, 4], [], [4, 5, 9],
                    [], [], [2, 3, 5],
                    [3, 4, 5], [3, 4, 5, 9], [],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = rowsCandidates[row][column];
                    cellsInRows[row][column].candidates = candidates;
                    cellsInRows[row][column].latestCandidates = candidates;
                }),
            );

            const columnsCandidates = [
                [
                    [], [1, 2, 4, 7], [2, 4],
                    [], [1, 4, 7], [],
                    [4, 7], [], [],
                ],
                [
                    [4, 9], [4, 7], [],
                    [7, 9], [], [],
                    [], [], [],
                ],
                [
                    [], [1, 4, 5, 7], [4, 5, 9],
                    [1, 7, 9], [], [1, 4, 7],
                    [4, 7, 8], [], [7, 8],
                ],
            ];

            _.range(3).forEach((row) =>
                _.range(9).forEach((column) => {
                    const candidates = columnsCandidates[row][column];
                    cellsInColumns[row][column].candidates = candidates;
                    cellsInColumns[row][column].latestCandidates = candidates;
                }),
            );

            expect(
                BoxLineReductionStrategy
                    .processCells(cellsInRows, cellsInColumns)
            ).toEqual({
                c10: cellsInRows[1][0],
                c20: cellsInRows[2][0],
                c12: cellsInRows[1][2],
                c22: cellsInRows[2][2],
            });

            expect(cellsInRows[1][0].setNextCandidates)
                .toHaveBeenLastCalledWith([1, 2, 7]);
            expect(cellsInRows[2][0].setNextCandidates)
                .toHaveBeenLastCalledWith([2]);
            expect(cellsInRows[1][2].setNextCandidates)
                .toHaveBeenLastCalledWith([1, 5, 7]);
            expect(cellsInRows[2][2].setNextCandidates)
                .toHaveBeenLastCalledWith([5, 9]);
        });
    });

    describe("getCounters", () => {
        let cellsInRows = [];
        let cellsInColumns = [];

        beforeEach(() => {
            cellsInRows = _.range(3).map((rowIndex) =>
                _.range(9).map((columnIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${rowIndex}${columnIndex}`,
                    candidates: [],
                    setNextCandidates: jest.fn(null),
                }))
            );

            cellsInColumns = _.range(3).map((columnIndex) =>
                _.range(9).map((rowIndex) => ({
                    rowIndex, columnIndex,
                    identifier: `c${rowIndex}${columnIndex}`,
                    candidates: [],
                }))
            );
        });

        it("should return counters from all cells in row and column", () => {
            cellsInRows[0][0].candidates = [];
            cellsInRows[0][1].candidates = [2, 7, 8];
            cellsInRows[0][2].candidates = [1, 8];
            cellsInRows[0][3].candidates = [1, 6];
            cellsInRows[0][4].candidates = [];
            cellsInRows[0][5].candidates = [3, 7];
            cellsInRows[0][6].candidates = [2, 3, 6];
            cellsInRows[0][7].candidates = [2, 3, 8];
            cellsInRows[0][8].candidates = [];

            cellsInRows[1][0].candidates = [2, 8, 9];
            cellsInRows[1][1].candidates = [];
            cellsInRows[1][2].candidates = [4, 8, 9];
            cellsInRows[1][3].candidates = [3, 4, 8];
            cellsInRows[1][4].candidates = [3, 4, 5, 8];
            cellsInRows[1][5].candidates = [3, 4, 5];
            cellsInRows[1][6].candidates = [2, 3, 9];
            cellsInRows[1][7].candidates = [];
            cellsInRows[1][8].candidates = [];

            cellsInRows[2][0].candidates = [];
            cellsInRows[2][1].candidates = [4, 7, 8, 9];
            cellsInRows[2][2].candidates = [1, 4, 8, 9];
            cellsInRows[2][3].candidates = [1, 6];
            cellsInRows[2][4].candidates = [];
            cellsInRows[2][5].candidates = [4, 7];
            cellsInRows[2][6].candidates = [6, 9];
            cellsInRows[2][7].candidates = [8, 9];
            cellsInRows[2][8].candidates = [];

            cellsInColumns[0][0].candidates = [];
            cellsInColumns[0][1].candidates = [2, 8, 9];
            cellsInColumns[0][2].candidates = [];
            cellsInColumns[0][3].candidates = [7, 8, 9];
            cellsInColumns[0][4].candidates = [];
            cellsInColumns[0][5].candidates = [6, 7, 8];
            cellsInColumns[0][6].candidates = [1, 2, 6, 9];
            cellsInColumns[0][7].candidates = [2, 6, 8];
            cellsInColumns[0][8].candidates = [1, 2];

            cellsInColumns[1][0].candidates = [2, 7, 8];
            cellsInColumns[1][1].candidates = [];
            cellsInColumns[1][2].candidates = [4, 7, 8, 9];
            cellsInColumns[1][3].candidates = [];
            cellsInColumns[1][4].candidates = [];
            cellsInColumns[1][5].candidates = [7, 8];
            cellsInColumns[1][6].candidates = [2, 4, 9];
            cellsInColumns[1][7].candidates = [2, 4, 8];
            cellsInColumns[1][8].candidates = [];

            cellsInColumns[2][0].candidates = [1, 8];
            cellsInColumns[2][1].candidates = [4, 8, 9];
            cellsInColumns[2][2].candidates = [1, 4, 8, 9];
            cellsInColumns[2][3].candidates = [];
            cellsInColumns[2][4].candidates = [5, 6, 8, 9];
            cellsInColumns[2][5].candidates = [5, 6, 8];
            cellsInColumns[2][6].candidates = [1, 3, 4, 6, 9];
            cellsInColumns[2][7].candidates = [3, 4, 6, 8];
            cellsInColumns[2][8].candidates = [];

            const expected = {
                row: {
                    0: {1: 2, 2: 3, 3: 3, 6: 2, 7: 2, 8: 3},
                    1: {2: 2, 3: 4, 4: 4, 5: 2, 8: 4, 9: 3},
                    2: {1: 2, 4: 3, 6: 2, 7: 2, 8: 3, 9: 4},
                    3: {7: 1, 8: 1, 9: 1},
                    4: {5: 1, 6: 1, 8: 1, 9: 1},
                    5: {5: 1, 6: 2, 7: 2, 8: 3},
                    6: {1: 2, 2: 2, 3: 1, 4: 2, 6: 2, 9: 3},
                    7: {2: 2, 3: 1, 4: 2, 6: 2, 8: 3},
                    8: {1: 1, 2: 1},
                },
                column: {
                    0: {1: 2, 2: 4, 6: 3, 7: 2, 8: 4, 9: 3},
                    1: {2: 3, 4: 3, 7: 3, 8: 4, 9: 2},
                    2: {1: 3, 3: 2, 4: 4, 5: 2, 6: 4, 8: 6, 9: 4},
                    3: {1: 2, 3: 1, 4: 1, 6: 2, 8: 1},
                    4: {3: 1, 4: 1, 5: 1, 8: 1},
                    5: {3: 2, 4: 2, 5: 1, 7: 2},
                    6: {2: 2, 3: 2, 6: 2, 9: 2},
                    7: {2: 1, 3: 1, 8: 2, 9: 1},
                    8: {},
                },
            };
            expect(
                BoxLineReductionStrategy
                    .getCounters(cellsInRows, cellsInColumns)
            ).toEqual(expected);
        });
    });

    describe("getCellsMapping", () => {
        it("should return the mapping per row and column indices", () => {
            const cellsInBlock = [
                {rowIndex: 3, columnIndex: 0},
                {rowIndex: 3, columnIndex: 1},
                {rowIndex: 3, columnIndex: 2},
                {rowIndex: 4, columnIndex: 0},
                {rowIndex: 4, columnIndex: 1},
                {rowIndex: 4, columnIndex: 2},
                {rowIndex: 5, columnIndex: 0},
                {rowIndex: 5, columnIndex: 1},
                {rowIndex: 5, columnIndex: 2},
            ];

            const expected = {
                column: {
                    0: [cellsInBlock[0], cellsInBlock[3], cellsInBlock[6]],
                    1: [cellsInBlock[1], cellsInBlock[4], cellsInBlock[7]],
                    2: [cellsInBlock[2], cellsInBlock[5], cellsInBlock[8]],
                },
                row: {
                    3: [cellsInBlock[0], cellsInBlock[1], cellsInBlock[2]],
                    4: [cellsInBlock[3], cellsInBlock[4], cellsInBlock[5]],
                    5: [cellsInBlock[6], cellsInBlock[7], cellsInBlock[8]],
                },
            };

            const mapping = BoxLineReductionStrategy.getCellsMapping(
                cellsInBlock
            );

            expect(mapping).toEqual(expected);
        });
    });

    describe("getMatchingCandidates", () => {
        let cellsInBlock;

        beforeEach(() => {
            cellsInBlock = [];

            _.range(3, 6).forEach((row) =>
                _.range(3).forEach((column) => (
                    cellsInBlock.push({row, column, candidates: []})
                )),
            );
        });

        it("should return list of candidates per row and column", () => {
            cellsInBlock[0].candidates = [2, 4, 5];
            cellsInBlock[1].candidates = [];
            cellsInBlock[2].candidates = [2, 3, 4, 5];
            cellsInBlock[3].candidates = [9, 2, 4, 5];
            cellsInBlock[4].candidates = [2, 3, 4, 5, 6];
            cellsInBlock[5].candidates = [9, 2, 3, 4, 5];
            cellsInBlock[6].candidates = [];
            cellsInBlock[7].candidates = [3, 4, 5, 6];
            cellsInBlock[8].candidates = [];

            const counters = {
                row: {
                    0: {2: 2, 4: 4, 5: 3, 9: 2},
                    1: {1: 2, 2: 3, 3: 4, 4: 6, 5: 5, 6: 2, 7: 3},
                    2: {2: 4, 3: 3, 4: 4, 5: 4, 9: 2},
                },
                column: {
                    3: {1: 4, 2: 4, 3: 2, 4: 5, 5: 4, 7: 4},
                    4: {1: 5, 2: 5, 3: 4, 4: 6, 5: 6, 6: 2, 7: 6, 8: 3, 9: 2},
                    5: {3: 2, 4: 2, 5: 3, 6: 2, 8: 3},
                },
            };

            const mapping = {
                row: {
                    0: [cellsInBlock[0], cellsInBlock[3], cellsInBlock[6]],
                    1: [cellsInBlock[1], cellsInBlock[4], cellsInBlock[7]],
                    2: [cellsInBlock[2], cellsInBlock[5], cellsInBlock[8]],
                },
                column: {
                    3: [cellsInBlock[0], cellsInBlock[1], cellsInBlock[2]],
                    4: [cellsInBlock[3], cellsInBlock[4], cellsInBlock[5]],
                    5: [cellsInBlock[6], cellsInBlock[7], cellsInBlock[8]],
                },
            };

            expect(
                BoxLineReductionStrategy
                    .getMatchingCandidates(mapping, counters)
            ).toEqual({row: [[0, 2], [1, 6]], column: [[4, 9]]});
        });
    });
});
