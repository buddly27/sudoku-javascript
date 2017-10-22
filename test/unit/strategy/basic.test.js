/* eslint-disable object-property-newline */

import _ from "lodash";

import {
    BasicStrategy,
    HiddenSingleStrategy,
    HiddenPairStrategy,
    HiddenTripleStrategy,
    HiddenQuadStrategy,
    NakedPairStrategy,
    NakedTripleStrategy,
} from "sudoku/strategy/basic";


describe("BasicStrategy", () => {
    describe("processGrid", () => {
        const grid = jest.fn(null);
        grid.rowSize = 9;
        grid.columnSize = 9;
        grid.blockRowSize = 3;
        grid.blockColumnSize = 3;

        beforeEach(() => {
            BasicStrategy.processCells = jest.fn(null);

            grid.cellsInRow = jest.fn(() =>
                ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"]
            );
            grid.cellsInColumn = jest.fn(() =>
                ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"]
            );
            grid.cellsInBlock = jest.fn(() =>
                ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"]
            );
        });

        it("should process a grid with no result", () => {
            BasicStrategy.processCells.mockReturnValue({});
            expect(BasicStrategy.processGrid(grid)).toEqual({});
            expect(grid.cellsInRow.mock.calls)
                .toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8]]);
            expect(grid.cellsInColumn.mock.calls)
                .toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8]]);
            expect(grid.cellsInBlock.mock.calls)
                .toEqual([
                    [0, 0], [0, 3], [0, 6],
                    [3, 0], [3, 3], [3, 6],
                    [6, 0], [6, 3], [6, 6],
                ]);
            expect(BasicStrategy.processCells).toHaveBeenCalledTimes(3 * 9);
        });

        it("should process a grid with a few results", () => {
            BasicStrategy.processCells.mockReturnValue({})
                .mockReturnValueOnce({c01: "CELL1", c11: "CELL2"})
                .mockReturnValueOnce({c03: "CELL3"})
                .mockReturnValueOnce({c01: "CELL4", c31: "CELL5"})
                .mockReturnValueOnce({c50: "CELL6", c58: "CELL8"});
            expect(BasicStrategy.processGrid(grid))
                .toEqual({
                    c01: "CELL4", c03: "CELL3",
                    c11: "CELL2",
                    c31: "CELL5",
                    c50: "CELL6", c58: "CELL8",
                });
            expect(BasicStrategy.processCells.mock.calls)
                .toEqual(
                    _.range(9).map(() => [[
                        "R1", "R2", "R3",
                        "R4", "R5", "R6",
                        "R7", "R8", "R9",
                    ]])
                        .concat(
                            _.range(9).map(() => [[
                                "C1", "C2", "C3",
                                "C4", "C5", "C6",
                                "C7", "C8", "C9",
                            ]])
                        )
                        .concat(
                            _.range(9).map(() => [[
                                "B1", "B2", "B3",
                                "B4", "B5", "B6",
                                "B7", "B8", "B9",
                            ]])
                        )
                );
        });
    });

    describe("getMatchingCellsFromIntersection", () => {
        let cells = [];

        beforeEach(() => {
            cells = [
                {identifier: "c00", candidates: [], clone: jest.fn(() => "C0")},
                {identifier: "c01", candidates: [], clone: jest.fn(() => "C1")},
                {identifier: "c02", candidates: [], clone: jest.fn(() => "C2")},
                {identifier: "c03", candidates: [], clone: jest.fn(() => "C3")},
                {identifier: "c04", candidates: [], clone: jest.fn(() => "C4")},
                {identifier: "c05", candidates: [], clone: jest.fn(() => "C5")},
                {identifier: "c06", candidates: [], clone: jest.fn(() => "C6")},
                {identifier: "c07", candidates: [], clone: jest.fn(() => "C7")},
                {identifier: "c08", candidates: [], clone: jest.fn(() => "C8")},
            ];
        });

        it("should not match any candidates", () => {
            expect(
                BasicStrategy.getMatchingCellsFromIntersection(cells, [[3, 5]])
            ).toEqual({});

            expect(cells[0].clone).toHaveBeenCalledTimes(0);
            expect(cells[1].clone).toHaveBeenCalledTimes(0);
            expect(cells[2].clone).toHaveBeenCalledTimes(0);
            expect(cells[3].clone).toHaveBeenCalledTimes(0);
            expect(cells[4].clone).toHaveBeenCalledTimes(0);
            expect(cells[5].clone).toHaveBeenCalledTimes(0);
            expect(cells[6].clone).toHaveBeenCalledTimes(0);
            expect(cells[7].clone).toHaveBeenCalledTimes(0);
            expect(cells[8].clone).toHaveBeenCalledTimes(0);
        });

        it("should update a few cells", () => {
            cells[0].candidates = [5, 9];
            cells[1].candidates = [7, 8, 9];
            cells[2].candidates = [5, 9];
            cells[3].candidates = [1, 5, 3];
            cells[4].candidates = [1, 5, 3];
            cells[5].candidates = [1, 4];
            cells[6].candidates = [1, 2, 3, 5, 7];
            cells[7].candidates = [8, 7, 3];
            cells[8].candidates = [];

            expect(
                BasicStrategy.getMatchingCellsFromIntersection(
                    cells, [[2], [4]]
                )
            ).toEqual({c05: "C5", c06: "C6"});

            expect(cells[0].clone).toHaveBeenCalledTimes(0);
            expect(cells[1].clone).toHaveBeenCalledTimes(0);
            expect(cells[2].clone).toHaveBeenCalledTimes(0);
            expect(cells[3].clone).toHaveBeenCalledTimes(0);
            expect(cells[4].clone).toHaveBeenCalledTimes(0);
            expect(cells[5].clone).toHaveBeenLastCalledWith([4]);
            expect(cells[6].clone).toHaveBeenLastCalledWith([2]);
            expect(cells[7].clone).toHaveBeenCalledTimes(0);
            expect(cells[8].clone).toHaveBeenCalledTimes(0);
        });
    });

    describe("getMatchingCellsFromDifference", () => {
        let cells = [];

        beforeEach(() => {
            cells = [
                {identifier: "c00", candidates: [], clone: jest.fn(() => "C0")},
                {identifier: "c01", candidates: [], clone: jest.fn(() => "C1")},
                {identifier: "c02", candidates: [], clone: jest.fn(() => "C2")},
                {identifier: "c03", candidates: [], clone: jest.fn(() => "C3")},
                {identifier: "c04", candidates: [], clone: jest.fn(() => "C4")},
                {identifier: "c05", candidates: [], clone: jest.fn(() => "C5")},
                {identifier: "c06", candidates: [], clone: jest.fn(() => "C6")},
                {identifier: "c07", candidates: [], clone: jest.fn(() => "C7")},
                {identifier: "c08", candidates: [], clone: jest.fn(() => "C8")},
            ];
        });

        it("should not match any candidates", () => {
            expect(
                BasicStrategy.getMatchingCellsFromDifference(cells, [[3, 5]])
            ).toEqual({});

            expect(cells[0].clone).toHaveBeenCalledTimes(0);
            expect(cells[1].clone).toHaveBeenCalledTimes(0);
            expect(cells[2].clone).toHaveBeenCalledTimes(0);
            expect(cells[3].clone).toHaveBeenCalledTimes(0);
            expect(cells[4].clone).toHaveBeenCalledTimes(0);
            expect(cells[5].clone).toHaveBeenCalledTimes(0);
            expect(cells[6].clone).toHaveBeenCalledTimes(0);
            expect(cells[7].clone).toHaveBeenCalledTimes(0);
            expect(cells[8].clone).toHaveBeenCalledTimes(0);
        });

        it("should update a few cells", () => {
            cells[0].candidates = [1, 2, 3, 4];
            cells[1].candidates = [];
            cells[2].candidates = [1, 2, 9];
            cells[3].candidates = [3, 9];
            cells[4].candidates = [5, 8, 7];
            cells[5].candidates = [4, 9];
            cells[6].candidates = [3, 7];
            cells[7].candidates = [5, 8];
            cells[8].candidates = [];

            expect(
                BasicStrategy.getMatchingCellsFromDifference(
                    cells, [[1, 2], [5, 8]]
                )
            ).toEqual({c00: "C0", c02: "C2", c04: "C4"});

            expect(cells[0].clone).toHaveBeenLastCalledWith([3, 4]);
            expect(cells[1].clone).toHaveBeenCalledTimes(0);
            expect(cells[2].clone).toHaveBeenLastCalledWith([9]);
            expect(cells[3].clone).toHaveBeenCalledTimes(0);
            expect(cells[4].clone).toHaveBeenLastCalledWith([7]);
            expect(cells[5].clone).toHaveBeenCalledTimes(0);
            expect(cells[6].clone).toHaveBeenCalledTimes(0);
            expect(cells[7].clone).toHaveBeenCalledTimes(0);
            expect(cells[8].clone).toHaveBeenCalledTimes(0);
        });
    });
});

describe("HiddenSingleStrategy", () => {
    it("should have the proper identifier", () => {
        expect(HiddenSingleStrategy.identifier)
            .toEqual("Hidden Single Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromIntersectionSpy;

        beforeEach(() => {
            getMatchingCellsFromIntersectionSpy = jest
                .spyOn(HiddenSingleStrategy, "getMatchingCellsFromIntersection")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not match any candidates", () => {
            HiddenSingleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find one hidden single candidate", () => {
            cells[0].candidates = [1, 4, 5, 6, 9];
            cells[1].candidates = [4, 5, 9];
            cells[2].candidates = [4, 9];
            cells[3].candidates = [1, 5];
            cells[4].candidates = [4, 9];
            cells[5].candidates = [];
            cells[6].candidates = [];
            cells[7].candidates = [];
            cells[8].candidates = [];

            HiddenSingleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[6]]);
        });

        it("should find two hidden single candidates", () => {
            cells[0].candidates = [5, 9];
            cells[1].candidates = [7, 8, 9];
            cells[2].candidates = [5, 9];
            cells[3].candidates = [1, 5, 3];
            cells[4].candidates = [1, 5, 3];
            cells[5].candidates = [1, 4];
            cells[6].candidates = [1, 2, 3, 5, 7];
            cells[7].candidates = [8, 7, 3];
            cells[8].candidates = [];

            HiddenSingleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[2], [4]]);
        });

        it("should find two other hidden single candidates", () => {
            cells[0].candidates = [1, 4];
            cells[1].candidates = [1, 2, 7];
            cells[2].candidates = [4, 7, 8];
            cells[3].candidates = [4, 7];
            cells[4].candidates = [2, 3, 9];
            cells[5].candidates = [];
            cells[6].candidates = [4, 7, 3];
            cells[7].candidates = [];
            cells[8].candidates = [2, 3, 4, 7];

            HiddenSingleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[8], [9]]);
        });
    });
});

describe("HiddenPairStrategy", () => {
    it("should have the proper identifier", () => {
        expect(HiddenPairStrategy.identifier)
            .toEqual("Hidden Pair Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromIntersectionSpy;

        beforeEach(() => {
            getMatchingCellsFromIntersectionSpy = jest
                .spyOn(HiddenPairStrategy, "getMatchingCellsFromIntersection")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not match any candidates", () => {
            HiddenPairStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find one hidden pair candidate", () => {
            cells[0].candidates = [7, 8, 6];
            cells[1].candidates = [2, 6];
            cells[2].candidates = [];
            cells[3].candidates = [2, 7];
            cells[4].candidates = [1, 9, 6];
            cells[5].candidates = [1, 9];
            cells[6].candidates = [];
            cells[7].candidates = [2, 7, 8];
            cells[8].candidates = [];

            HiddenPairStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[1, 9]]);
        });

        it("should find one other hidden pair candidate", () => {
            cells[0].candidates = [2, 3, 4, 5, 7, 8, 9];
            cells[1].candidates = [1, 2, 3, 4, 5, 7, 8];
            cells[2].candidates = [];
            cells[3].candidates = [3, 8, 9];
            cells[4].candidates = [5, 8, 9];
            cells[5].candidates = [];
            cells[6].candidates = [];
            cells[7].candidates = [1, 5, 8];
            cells[8].candidates = [1, 2, 5, 8];

            HiddenPairStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[4, 7]]);
        });

        it("should find two hidden pair candidates", () => {
            cells[0].candidates = [1, 4];
            cells[1].candidates = [];
            cells[2].candidates = [1, 7];
            cells[3].candidates = [4, 7, 8, 9];
            cells[4].candidates = [4, 7];
            cells[5].candidates = [5, 8, 9];
            cells[6].candidates = [];
            cells[7].candidates = [2, 7, 3];
            cells[8].candidates = [2, 3, 4, 7];

            HiddenPairStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[2, 3], [8, 9]]);
        });

        it("should find two other hidden pair candidates", () => {
            cells[0].candidates = [];
            cells[1].candidates = [4, 6, 9, 5];
            cells[2].candidates = [2, 4, 8, 9];
            cells[3].candidates = [1, 3, 4, 9];
            cells[4].candidates = [4, 5];
            cells[5].candidates = [2, 6, 8, 9];
            cells[6].candidates = [];
            cells[7].candidates = [];
            cells[8].candidates = [1, 3, 5];

            HiddenPairStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[1, 3], [2, 8]]);
        });
    });
});

describe("HiddenTripleStrategy", () => {
    it("should have the proper identifier", () => {
        expect(HiddenTripleStrategy.identifier)
            .toEqual("Hidden Triple Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromIntersectionSpy;

        beforeEach(() => {
            getMatchingCellsFromIntersectionSpy = jest
                .spyOn(HiddenTripleStrategy, "getMatchingCellsFromIntersection")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not update solved grid", () => {
            HiddenTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find a hidden triple candidate", () => {
            cells[0].candidates = [1, 7, 8];
            cells[1].candidates = [];
            cells[2].candidates = [7, 8];
            cells[3].candidates = [7, 6];
            cells[4].candidates = [4, 5];
            cells[5].candidates = [];
            cells[6].candidates = [1, 6];
            cells[7].candidates = [1, 2, 4, 5];
            cells[8].candidates = [2, 5, 6];

            HiddenTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[2, 4, 5]]);
        });

        it("should find another hidden triple candidate", () => {
            cells[0].candidates = [1, 4];
            cells[1].candidates = [1, 3, 7];
            cells[2].candidates = [1, 3, 4, 7];
            cells[3].candidates = [1, 2, 4, 5, 6, 7, 8];
            cells[4].candidates = [1, 3, 4, 7, 8];
            cells[5].candidates = [1, 2, 4, 5, 6, 8];
            cells[6].candidates = [];
            cells[7].candidates = [1, 2, 3, 4, 6, 8];
            cells[8].candidates = [1, 3, 4];

            HiddenTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[2, 5, 6]]);
        });
    });
});

describe("HiddenQuadStrategy", () => {
    it("should have the proper identifier", () => {
        expect(HiddenQuadStrategy.identifier)
            .toEqual("Hidden Quad Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromIntersectionSpy;

        beforeEach(() => {
            getMatchingCellsFromIntersectionSpy = jest
                .spyOn(HiddenQuadStrategy, "getMatchingCellsFromIntersection")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not update solved grid", () => {
            HiddenQuadStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find a hidden quad candidate", () => {
            cells[0].candidates = [1, 9];
            cells[1].candidates = [1, 8];
            cells[2].candidates = [1, 6, 8];
            cells[3].candidates = [2, 9];
            cells[4].candidates = [3, 4, 7];
            cells[5].candidates = [4, 7];
            cells[6].candidates = [3, 5, 6, 7];
            cells[7].candidates = [4, 5, 6, 7];
            cells[8].candidates = [2, 6];

            HiddenQuadStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[3, 4, 5, 7]]);
        });

        it("should find another hidden quad candidate", () => {
            cells[0].candidates = [1, 3, 4, 6, 7, 8, 9];
            cells[1].candidates = [3, 7, 8];
            cells[2].candidates = [3, 4, 6, 7, 8, 9];
            cells[3].candidates = [2, 3, 7, 8];
            cells[4].candidates = [2, 3, 5, 7, 8];
            cells[5].candidates = [2, 3, 5, 7, 8];
            cells[6].candidates = [1, 3, 4, 7, 8, 9];
            cells[7].candidates = [3, 5, 7, 8];
            cells[8].candidates = [3, 4, 5, 7, 8, 9];

            HiddenQuadStrategy.processCells(cells);

            expect(getMatchingCellsFromIntersectionSpy)
                .toHaveBeenLastCalledWith(cells, [[1, 4, 6, 9]]);
        });
    });
});

describe("NakedPairStrategy", () => {
    it("should have the proper identifier", () => {
        expect(NakedPairStrategy.identifier)
            .toEqual("Naked Pair Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromDifferenceSpy;

        beforeEach(() => {
            getMatchingCellsFromDifferenceSpy = jest
                .spyOn(NakedPairStrategy, "getMatchingCellsFromDifference")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not match any candidates", () => {
            NakedPairStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find one naked pair candidate", () => {
            cells[0].candidates = [5, 8, 9];
            cells[1].candidates = [8, 9];
            cells[2].candidates = [];
            cells[3].candidates = [1, 2, 4, 8, 9];
            cells[4].candidates = [1, 2, 4, 8, 9];
            cells[5].candidates = [8, 9];
            cells[6].candidates = [4, 5, 6, 8, 9];
            cells[7].candidates = [3, 4, 6, 8, 9];
            cells[8].candidates = [3, 5, 8, 9];

            NakedPairStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, [[8, 9]]);
        });

        it("should find one other naked pair candidate", () => {
            cells[0].candidates = [1, 6, 7, 9];
            cells[1].candidates = [1, 6, 7, 8];
            cells[2].candidates = [];
            cells[3].candidates = [1, 6, 7, 8, 9];
            cells[4].candidates = [];
            cells[5].candidates = [6, 7];
            cells[6].candidates = [6, 7];
            cells[7].candidates = [];
            cells[8].candidates = [];

            NakedPairStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, [[6, 7]]);
        });
    });
});

describe("NakedTripleStrategy", () => {
    it("should have the proper identifier", () => {
        expect(NakedTripleStrategy.identifier)
            .toEqual("Naked Triple Strategy");
    });

    describe("processCells", () => {
        let cells = [];
        let getMatchingCellsFromDifferenceSpy;

        beforeEach(() => {
            getMatchingCellsFromDifferenceSpy = jest
                .spyOn(NakedTripleStrategy, "getMatchingCellsFromDifference")
                .mockImplementation(() => {});

            cells = [
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
                {candidates: []},
            ];
        });

        it("should not match any candidates", () => {
            NakedTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, []);
        });

        it("should find one naked triple candidate", () => {
            cells[0].candidates = [1, 6, 7];
            cells[1].candidates = [3, 9];
            cells[2].candidates = [];
            cells[3].candidates = [6, 9];
            cells[4].candidates = [3, 6, 9];
            cells[5].candidates = [];
            cells[6].candidates = [];
            cells[7].candidates = [];
            cells[8].candidates = [1, 7];

            NakedTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, [[3, 6, 9]]);
        });

        it("should find another naked triple candidate", () => {
            cells[0].candidates = [1, 2, 4, 5, 6];
            cells[1].candidates = [1, 2, 6];
            cells[2].candidates = [1, 2, 5, 6, 8];
            cells[3].candidates = [1, 2, 4, 7];
            cells[4].candidates = [1, 2, 3, 7, 9];
            cells[5].candidates = [1, 2, 3, 7, 8, 9];
            cells[6].candidates = [1, 2, 6];
            cells[7].candidates = [1, 2, 6];
            cells[8].candidates = [1, 2, 6, 8];

            NakedTripleStrategy.processCells(cells);

            expect(getMatchingCellsFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, [[1, 2, 6]]);
        });
    });
});
