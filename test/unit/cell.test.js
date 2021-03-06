/* eslint-disable no-new */

import {SudokuCell} from "sudoku/cell";


describe("SudokuCell", () => {
    describe("instance with a zero value", () => {
        const cell = new SudokuCell(0, 3, 5);

        it("should have a correct identifier", () => {
            expect(cell.identifier).toEqual("c35");
        });

        it("should have a correct null cell value", () => {
            expect(cell.value).toEqual(0);
        });

        it("should have a correct row value", () => {
            expect(cell.rowIndex).toEqual(3);
        });

        it("should have a correct column value", () => {
            expect(cell.columnIndex).toEqual(5);
        });

        it("should have a correct list of candidates", () => {
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should indicate that the cell is not solved", () => {
            expect(cell.isSolved()).toEqual(false);
        });
    });

    describe("instance with a non-zero value", () => {
        const cell = new SudokuCell(4, 1, 9);

        it("should have a correct identifier", () => {
            expect(cell.identifier).toEqual("c19");
        });

        it("should have a correct cell value", () => {
            expect(cell.value).toEqual(4);
        });

        it("should have a correct row value", () => {
            expect(cell.rowIndex).toEqual(1);
        });

        it("should have a correct column value", () => {
            expect(cell.columnIndex).toEqual(9);
        });

        it("should have an empty list of candidates", () => {
            expect(cell.candidates).toEqual([]);
        });

        it("should indicate that the cell is solved", () => {
            expect(cell.isSolved()).toEqual(true);
        });
    });

    describe("instance with a zero value and candidates", () => {
        const cell = new SudokuCell(0, 3, 5, [1, 2, 3]);

        it("should have a correct identifier", () => {
            expect(cell.identifier).toEqual("c35");
        });

        it("should have a correct null cell value", () => {
            expect(cell.value).toEqual(0);
        });

        it("should have a correct row value", () => {
            expect(cell.rowIndex).toEqual(3);
        });

        it("should have a correct column value", () => {
            expect(cell.columnIndex).toEqual(5);
        });

        it("should have a correct list of candidates", () => {
            expect(cell.candidates).toEqual([1, 2, 3]);
        });

        it("should indicate that the cell is not solved", () => {
            expect(cell.isSolved()).toEqual(false);
        });
    });

    describe("instance with a non-zero value and candidates", () => {
        it("should throw an error as this configuration is forbidden", () => {
            expect(
                () => new SudokuCell(2, 3, 5, [1, 2, 3])
            ).toThrow(
                Error(
                    "A non-empty list of candidates can not be set for a " +
                    "solved cell."
                )
            );

            try {
                new SudokuCell(2, 3, 5, [1, 2, 3]);
            }
            catch (error) {
                expect(error.identifier).toEqual("c35");
            }
        });
    });

    describe("instance with a zero value and empty list candidates", () => {
        it("should throw an error as this configuration is forbidden", () => {
            expect(
                () => new SudokuCell(0, 3, 5, [])
            ).toThrow(
                Error(
                    "A empty list of candidates can not be set for an " +
                    "unsolved cell."
                )
            );

            try {
                new SudokuCell(0, 3, 5, []);
            }
            catch (error) {
                expect(error.identifier).toEqual("c35");
            }
        });
    });

    describe("set candidates to a cell", () => {
        it("should set new candidates for cell with zero value", () => {
            const cell = new SudokuCell(0, 3, 5);
            cell.candidates = [1, 2, 3];
            expect(cell.candidates).toEqual([1, 2, 3]);
        });

        it("should set empty candidates for cell with non-zero value", () => {
            const cell = new SudokuCell(4, 3, 5);
            cell.candidates = [];
            expect(cell.candidates).toEqual([]);
        });

        it("should set candidates for cell with non-zero value", () => {
            const cell = new SudokuCell(4, 3, 5);

            expect(
                // eslint-disable-next-line no-return-assign
                () => cell.candidates = [1, 2, 3]
            ).toThrow(
                Error(
                    "A non-empty list of candidates can not be set for a " +
                    "solved cell."
                )
            );
        });

        it("should set empty candidates for cell with zero value", () => {
            const cell = new SudokuCell(0, 3, 5);

            expect(
                // eslint-disable-next-line no-return-assign
                () => cell.candidates = []
            ).toThrow(
                Error(
                    "A empty list of candidates can not be set for an " +
                    "unsolved cell."
                )
            );
        });
    });

    describe("update candidates from row, column and block values", () => {
        const cell = new SudokuCell(0, 1, 9);

        it("should not update when empty arrays are given", () => {
            expect(cell.updateCandidates([], [], [])).toEqual(false);
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should update when one matching value is found", () => {
            expect(cell.updateCandidates([1], [], [])).toEqual(true);
            expect(cell.candidates).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should update when several matching values are found", () => {
            expect(cell.updateCandidates([1, 4, 5], [2, 5], [9])).toEqual(true);
            expect(cell.candidates).toEqual([3, 6, 7, 8]);
        });
    });

    describe("update candidates from row, column and block values", () => {
        it("should not update when empty arrays are given", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.updateCandidates([], [], [])).toEqual(false);
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should update when one matching value is found", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.updateCandidates([1], [], [])).toEqual(true);
            expect(cell.candidates).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should update when several matching values are found", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.updateCandidates([1, 4, 5], [2, 5], [9])).toEqual(true);
            expect(cell.candidates).toEqual([3, 6, 7, 8]);
        });

        it("should not update when cell is already resolved", () => {
            const cell = new SudokuCell(3, 1, 9);
            expect(cell.updateCandidates([1, 4, 5], [2, 5], [9])).toEqual(false);
            expect(cell.candidates).toEqual([]);
        });

        it("should throw an error if update is incoherent", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(
                () => cell.updateCandidates([1, 4, 6], [2, 3, 5], [7, 8, 9])
            ).toThrow(
                Error(
                    "The cell 'c19' can not receive an empty list of " +
                    "candidates during the update has it does not have a " +
                    "value yet. Some neighbor cells might have incorrect " +
                    "values."
                )
            );

            try {
                cell.updateCandidates([1, 4, 6], [2, 3, 5], [7, 8, 9]);
            }
            catch (error) {
                expect(error.identifier).toEqual("c19");
            }
        });
    });

    describe("clone a cell", () => {
        const cell = new SudokuCell(0, 1, 9);
        const newCell = cell.clone();

        it("should not be the same instance", () => {
            expect(cell).not.toBe(newCell);
        });

        it("should have the same identifier", () => {
            expect(newCell.identifier).toEqual("c19");
            expect(newCell.identifier).toEqual("c19");
        });

        it("should have the same cell value", () => {
            expect(cell.value).toEqual(0);
            expect(newCell.value).toEqual(0);
        });

        it("should have the same row value", () => {
            expect(cell.rowIndex).toEqual(1);
            expect(newCell.rowIndex).toEqual(1);
        });

        it("should have the same column value", () => {
            expect(cell.columnIndex).toEqual(9);
            expect(newCell.columnIndex).toEqual(9);
        });

        it("should have the same list of candidates", () => {
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(newCell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
    });

    describe("clone a cell with initial candidates", () => {
        const cell = new SudokuCell(0, 1, 9);
        const newCell = cell.clone([1, 2, 3]);

        it("should not be the same instance", () => {
            expect(cell).not.toBe(newCell);
        });

        it("should have the same identifier", () => {
            expect(newCell.identifier).toEqual("c19");
            expect(newCell.identifier).toEqual("c19");
        });

        it("should have the same cell value", () => {
            expect(cell.value).toEqual(0);
            expect(newCell.value).toEqual(0);
        });

        it("should have the same row value", () => {
            expect(cell.rowIndex).toEqual(1);
            expect(newCell.rowIndex).toEqual(1);
        });

        it("should have the same column value", () => {
            expect(cell.columnIndex).toEqual(9);
            expect(newCell.columnIndex).toEqual(9);
        });

        it("should have a different list of candidates", () => {
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(newCell.candidates).toEqual([1, 2, 3]);
        });
    });
});
