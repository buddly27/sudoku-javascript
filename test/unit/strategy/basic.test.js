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

        let processCellsSpy;

        beforeEach(() => {
            processCellsSpy = jest.fn(null);
            BasicStrategy.processCells = processCellsSpy;

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
            processCellsSpy.mockReturnValue({});
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
            expect(processCellsSpy).toHaveBeenCalledTimes(3 * 9);
        });

        it("should process a grid with a few results", () => {
            processCellsSpy.mockReturnValue({})
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
            expect(processCellsSpy.mock.calls)
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

    describe("updateFromIntersection", () => {
        let cells = [];

        beforeEach(() => {
            cells = [
                {identifier: "c00", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c01", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c02", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c03", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c04", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c05", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c06", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c07", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c08", candidates: [], setNextCandidates: jest.fn(null)},
            ];
        });

        it("should not match any candidates", () => {
            expect(BasicStrategy.updateFromIntersection(cells, [[3, 5]]))
                .toEqual({});

            expect(cells[0].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[1].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[2].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[3].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[4].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[5].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[6].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[7].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[8].setNextCandidates).toHaveBeenCalledTimes(0);
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

            expect(BasicStrategy.updateFromIntersection(cells, [[2], [4]]))
                .toEqual({
                    c05: cells[5],
                    c06: cells[6],
                });

            expect(cells[0].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[1].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[2].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[3].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[4].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[5].setNextCandidates).toHaveBeenLastCalledWith([4]);
            expect(cells[6].setNextCandidates).toHaveBeenLastCalledWith([2]);
            expect(cells[7].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[8].setNextCandidates).toHaveBeenCalledTimes(0);
        });
    });

    describe("updateFromDifference", () => {
        let cells = [];

        beforeEach(() => {
            cells = [
                {identifier: "c00", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c01", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c02", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c03", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c04", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c05", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c06", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c07", candidates: [], setNextCandidates: jest.fn(null)},
                {identifier: "c08", candidates: [], setNextCandidates: jest.fn(null)},
            ];
        });

        it("should not match any candidates", () => {
            expect(BasicStrategy.updateFromDifference(cells, [[3, 5]]))
                .toEqual({});

            expect(cells[0].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[1].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[2].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[3].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[4].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[5].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[6].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[7].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[8].setNextCandidates).toHaveBeenCalledTimes(0);
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

            expect(BasicStrategy.updateFromDifference(cells, [[1, 2], [5, 8]]))
                .toEqual({
                    c00: cells[0],
                    c02: cells[2],
                    c04: cells[4],
                });

            expect(cells[0].setNextCandidates).toHaveBeenLastCalledWith([3, 4]);
            expect(cells[1].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[2].setNextCandidates).toHaveBeenLastCalledWith([9]);
            expect(cells[3].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[4].setNextCandidates).toHaveBeenLastCalledWith([7]);
            expect(cells[5].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[6].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[7].setNextCandidates).toHaveBeenCalledTimes(0);
            expect(cells[8].setNextCandidates).toHaveBeenCalledTimes(0);
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
        let updateFromIntersectionSpy;

        beforeEach(() => {
            updateFromIntersectionSpy = jest
                .spyOn(HiddenSingleStrategy, "updateFromIntersection")
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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
        let updateFromIntersectionSpy;

        beforeEach(() => {
            updateFromIntersectionSpy = jest
                .spyOn(HiddenPairStrategy, "updateFromIntersection")
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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
        let updateFromIntersectionSpy;

        beforeEach(() => {
            updateFromIntersectionSpy = jest
                .spyOn(HiddenTripleStrategy, "updateFromIntersection")
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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
        let updateFromIntersectionSpy;

        beforeEach(() => {
            updateFromIntersectionSpy = jest
                .spyOn(HiddenQuadStrategy, "updateFromIntersection")
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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

            expect(updateFromIntersectionSpy)
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
        let updateFromDifferenceSpy;

        beforeEach(() => {
            updateFromDifferenceSpy = jest
                .spyOn(NakedPairStrategy, "updateFromDifference")
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

            expect(updateFromDifferenceSpy)
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

            expect(updateFromDifferenceSpy)
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

            expect(updateFromDifferenceSpy)
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
        let updateFromDifferenceSpy;

        beforeEach(() => {
            updateFromDifferenceSpy = jest
                .spyOn(NakedTripleStrategy, "updateFromDifference")
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

            expect(updateFromDifferenceSpy)
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

            expect(updateFromDifferenceSpy)
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

            expect(updateFromDifferenceSpy)
                .toHaveBeenLastCalledWith(cells, [[1, 2, 6]]);
        });
    });
});
