/* eslint-disable object-property-newline, no-unused-vars, global-require */

import {SudokuSolver} from "sudoku";

jest.mock("sudoku/strategy");


describe("SudokuSolver", () => {
    const grid = jest.fn(null);
    let strategies;

    let solver;

    describe("resolve", () => {
        beforeEach(() => {
            grid.update = jest.fn(null);
            grid.isSolved = jest.fn(null);
            grid.cellFromId = jest.fn((identifier) => ({candidates: []}));

            solver = new SudokuSolver();
            solver.applyStrategiesUntilFirstResult = jest.fn(null)
                .mockReturnValue({})
                .mockReturnValueOnce({c10: "CELL", c11: "CELL"})
                .mockReturnValueOnce({c30: "CELL"})
                .mockReturnValueOnce({c10: "CELL", c18: "CELL"})
                .mockReturnValueOnce({c65: "CELL", c66: "CELL"});
        });

        it("should resolve the grid as long as solutions are found", () => {
            grid.isSolved.mockReturnValue(false);

            expect(solver.resolve(grid)).toEqual(false);
            expect(solver.applyStrategiesUntilFirstResult.mock.calls)
                .toEqual([[grid], [grid], [grid], [grid], [grid]]);
            expect(grid.isSolved).toHaveBeenCalledTimes(5);
            expect(grid.update).toHaveBeenCalledTimes(5);
        });

        it("should stop resolving the grid when it is solved", () => {
            grid.isSolved
                .mockReturnValue(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false);

            expect(solver.resolve(grid)).toEqual(true);
            expect(solver.applyStrategiesUntilFirstResult.mock.calls)
                .toEqual([[grid], [grid]]);
            expect(grid.isSolved).toHaveBeenCalledTimes(3);
            expect(grid.update).toHaveBeenCalledTimes(3);
        });
    });

    describe("applyStrategiesUntilFirstResult", () => {
        let cells = [];

        beforeEach(() => {
            strategies = [
                {identifier: "test1", processGrid: jest.fn(null)},
                {identifier: "test2", processGrid: jest.fn(null)},
                {identifier: "test3", processGrid: jest.fn(null)},
                {identifier: "test4", processGrid: jest.fn(null)},
            ];

            solver = new SudokuSolver();
            solver._strategies = strategies;

            cells = [
                {identifier: "c10"},
                {identifier: "c11"},
            ];
        });

        it("should apply the first strategy", () => {
            strategies[0].processGrid.mockReturnValue(cells);

            expect(solver.applyStrategiesUntilFirstResult(grid))
                .toEqual([cells[0], cells[1]]);
            expect(strategies[0].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[1].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[2].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test1"]);
        });

        it("should apply the third strategy", () => {
            strategies[0].processGrid.mockReturnValue([]);
            strategies[1].processGrid.mockReturnValue([]);
            strategies[2].processGrid.mockReturnValue(cells);

            expect(solver.applyStrategiesUntilFirstResult(grid))
                .toEqual([cells[0], cells[1]]);
            expect(strategies[0].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[1].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[2].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test3"]);
        });

        it("should apply a strategy already used", () => {
            strategies[0].processGrid.mockReturnValue(cells);
            solver._strategiesUsed = ["test1"];
            expect(solver.applyStrategiesUntilFirstResult(grid))
                .toEqual([cells[0], cells[1]]);
            expect(solver.strategiesUsed).toEqual(["test1"]);
        });

        it("should skip a strategy without a 'processGrid' method", () => {
            delete strategies[0].processGrid;
            strategies[1].processGrid.mockReturnValue(cells);

            expect(solver.applyStrategiesUntilFirstResult(grid))
                .toEqual([cells[0], cells[1]]);
            expect(strategies[1].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[2].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test2"]);
        });
    });
});
