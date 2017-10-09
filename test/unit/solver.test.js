/* eslint-disable no-unused-vars, global-require */

import {SudokuSolver} from "sudoku";

jest.mock("sudoku/strategy");


describe("SudokuSolver", () => {
    const grid = jest.fn();
    let strategies;

    let solver;

    describe("applyStrategiesUntilFirstResult", () => {
        beforeEach(() => {
            strategies = [
                {identifier: "test1", processGrid: jest.fn()},
                {identifier: "test2", processGrid: jest.fn()},
                {identifier: "test3", processGrid: jest.fn()},
                {identifier: "test4", processGrid: jest.fn()},
            ];

            solver = new SudokuSolver();
            solver.strategies = strategies;
        });

        it("should apply the first strategy", () => {
            strategies[0].processGrid.mockReturnValue([[], []]);

            solver.applyStrategiesUntilFirstResult(grid);
            expect(strategies[0].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[1].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[2].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test1"]);
        });

        it("should apply the third strategy", () => {
            strategies[0].processGrid.mockReturnValue([]);
            strategies[1].processGrid.mockReturnValue([]);
            strategies[2].processGrid.mockReturnValue([[], []]);

            solver.applyStrategiesUntilFirstResult(grid);
            expect(strategies[0].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[1].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[2].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test3"]);
        });

        it("should apply a strategy already used", () => {
            strategies[0].processGrid.mockReturnValue([[], []]);
            solver.strategiesUsed = ["test1"];
            solver.applyStrategiesUntilFirstResult(grid);
            expect(solver.strategiesUsed).toEqual(["test1"]);
        });

        it("should skip a strategy without a 'processGrid' method", () => {
            delete strategies[0].processGrid;
            strategies[1].processGrid.mockReturnValue([[], []]);

            solver.applyStrategiesUntilFirstResult(grid);
            expect(strategies[1].processGrid).toHaveBeenLastCalledWith(grid);
            expect(strategies[2].processGrid).toHaveBeenCalledTimes(0);
            expect(strategies[3].processGrid).toHaveBeenCalledTimes(0);
            expect(solver.strategiesUsed).toEqual(["test2"]);
        });
    });

    describe("process", () => {
        let updateSpy;
        let isSolvedSpy;
        let applyStrategiesUntilFirstResultSpy;

        beforeEach(() => {
            updateSpy = jest.fn();
            isSolvedSpy = jest.fn();
            applyStrategiesUntilFirstResultSpy = jest.fn();

            grid.update = updateSpy;
            grid.isSolved = isSolvedSpy;

            solver = new SudokuSolver();
            solver.applyStrategiesUntilFirstResult =
                applyStrategiesUntilFirstResultSpy;
        });

        it("should resolve the grid as long as 'update' is true", () => {
            isSolvedSpy.mockReturnValue(false);
            updateSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true);

            expect(solver.resolve(grid)).toEqual(false);
            expect(applyStrategiesUntilFirstResultSpy.mock.calls)
                .toEqual([[grid], [grid], [grid], [grid]]);
            expect(isSolvedSpy).toHaveBeenCalledTimes(4);
            expect(updateSpy).toHaveBeenCalledTimes(5);
        });

        it("should stop resolving the grid when it is solved", () => {
            isSolvedSpy
                .mockReturnValue(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false);

            updateSpy
                .mockReturnValue(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true);

            expect(solver.resolve(grid)).toEqual(true);
            expect(applyStrategiesUntilFirstResultSpy.mock.calls)
                .toEqual([[grid], [grid]]);
            expect(isSolvedSpy).toHaveBeenCalledTimes(3);
            expect(updateSpy).toHaveBeenCalledTimes(3);
        });
    });
});
