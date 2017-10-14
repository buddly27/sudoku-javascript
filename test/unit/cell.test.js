import {SudokuCell} from "sudoku/cell";


describe("SudokuCell", () => {
    describe("instance with a zero value", () => {
        const cell = new SudokuCell(0, 3, 5);

        it("should have a correct null cell value", () => {
            expect(cell.value).toEqual(0);
        });

        it("should have a correct row value", () => {
            expect(cell.row).toEqual(3);
        });

        it("should have a correct column value", () => {
            expect(cell.column).toEqual(5);
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

        it("should have a correct cell value", () => {
            expect(cell.value).toEqual(4);
        });

        it("should have a correct row value", () => {
            expect(cell.row).toEqual(1);
        });

        it("should have a correct column value", () => {
            expect(cell.column).toEqual(9);
        });

        it("should have an empty list of candidates", () => {
            expect(cell.candidates).toEqual([]);
        });

        it("should indicate that the cell is solved", () => {
            expect(cell.isSolved()).toEqual(true);
        });
    });

    describe("set a new value", () => {
        const cell = new SudokuCell(0, 3, 5);

        it("should set new cell value and modify candidates", () => {
            cell.value = 4;
            expect(cell.value).toEqual(4);
        });
    });

    describe("set and apply next candidates", () => {
        it("should apply a list of non existing next candidates", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(cell.applyNextCandidates()).toEqual(false);
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("should set and apply a list of next candidates", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.latestCandidates)
                .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            cell.setNextCandidates([8, 2, 2, 1, 5, 7]);
            expect(cell.latestCandidates)
                .toEqual([1, 2, 5, 7, 8]);
            expect(cell.candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(cell.applyNextCandidates()).toEqual(true);
            expect(cell.candidates).toEqual([1, 2, 5, 7, 8]);
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

    describe("resolve", () => {
        it("should not solve a cell with many candidates are left", () => {
            const cell = new SudokuCell(0, 1, 9);
            expect(cell.resolve()).toEqual(false);
            expect(cell.isSolved()).toEqual(false);
            expect(cell.value).toEqual(0);
        });

        it("should not solve a cell with no candidates left", () => {
            const cell = new SudokuCell(4, 1, 9);
            expect(cell.resolve()).toEqual(false);
            expect(cell.isSolved()).toEqual(true);
            expect(cell.value).toEqual(4);
        });

        it("should solve a cell with only one candidate left", () => {
            const cell = new SudokuCell(0, 1, 9);
            cell.setNextCandidates([8]);
            cell.applyNextCandidates();
            expect(cell.resolve()).toEqual(true);
            expect(cell.isSolved()).toEqual(true);
            expect(cell.value).toEqual(8);
        });
    });
});
