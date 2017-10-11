/* eslint-disable object-property-newline */

import {SudokuSolver, SudokuGrid} from "sudoku";


describe("Sudoku Solver", () => {
    it("should solve the grid without requiring any strategy", () => {
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

        const solver = new SudokuSolver();
        const resolvedCellMapping = solver.resolve(grid);

        expect(resolvedCellMapping).toEqual({});

        expect(grid.isSolved()).toEqual(true);
        expect(grid.toMapping()).toEqual({
            c00: 6, c01: 7, c02: 2,
            c03: 1, c04: 4, c05: 5,
            c06: 3, c07: 9, c08: 8,
            c10: 1, c11: 4, c12: 5,
            c13: 9, c14: 8, c15: 3,
            c16: 6, c17: 7, c18: 2,
            c20: 3, c21: 8, c22: 9,
            c23: 7, c24: 6, c25: 2,
            c26: 4, c27: 5, c28: 1,
            c30: 2, c31: 6, c32: 3,
            c33: 5, c34: 7, c35: 4,
            c36: 8, c37: 1, c38: 9,
            c40: 9, c41: 5, c42: 8,
            c43: 6, c44: 2, c45: 1,
            c46: 7, c47: 4, c48: 3,
            c50: 7, c51: 1, c52: 4,
            c53: 3, c54: 9, c55: 8,
            c56: 5, c57: 2, c58: 6,
            c60: 5, c61: 9, c62: 7,
            c63: 2, c64: 3, c65: 6,
            c66: 1, c67: 8, c68: 4,
            c70: 4, c71: 2, c72: 6,
            c73: 8, c74: 1, c75: 7,
            c76: 9, c77: 3, c78: 5,
            c80: 8, c81: 3, c82: 1,
            c83: 4, c84: 5, c85: 9,
            c86: 2, c87: 6, c88: 7,
        });

        expect(solver.strategiesUsed).toEqual([]);
    });

    it("should solve the grid with hidden single strategy only", () => {
        const grid = new SudokuGrid({
            c05: 4, c07: 2, c08: 8,
            c10: 4, c12: 6, c18: 5,
            c20: 1, c24: 3, c26: 6,
            c33: 3, c35: 1,
            c41: 8, c42: 7, c46: 1, c47: 4,
            c53: 7, c55: 9,
            c62: 2, c64: 1, c68: 3,
            c70: 9, c76: 5, c78: 7,
            c80: 6, c81: 7, c83: 4,
        });

        const solver = new SudokuSolver();
        const resolvedCellMapping = solver.resolve(grid);

        expect(Object.keys(resolvedCellMapping).sort()).toEqual([
            "c00", "c02", "c03", "c04",
            "c14", "c17", "c22", "c27", "c28",
            "c32", "c34", "c37",
            "c40", "c45", "c48",
            "c57",
            "c60", "c65", "c66",
            "c75",
            "c84", "c86", "c88",
        ]);

        expect(grid.isSolved()).toEqual(true);
        expect(grid.toMapping()).toEqual({
            c00: 7, c01: 3, c02: 5,
            c03: 1, c04: 6, c05: 4,
            c06: 9, c07: 2, c08: 8,
            c10: 4, c11: 2, c12: 6,
            c13: 9, c14: 7, c15: 8,
            c16: 3, c17: 1, c18: 5,
            c20: 1, c21: 9, c22: 8,
            c23: 5, c24: 3, c25: 2,
            c26: 6, c27: 7, c28: 4,
            c30: 2, c31: 4, c32: 9,
            c33: 3, c34: 8, c35: 1,
            c36: 7, c37: 5, c38: 6,
            c40: 3, c41: 8, c42: 7,
            c43: 2, c44: 5, c45: 6,
            c46: 1, c47: 4, c48: 9,
            c50: 5, c51: 6, c52: 1,
            c53: 7, c54: 4, c55: 9,
            c56: 8, c57: 3, c58: 2,
            c60: 8, c61: 5, c62: 2,
            c63: 6, c64: 1, c65: 7,
            c66: 4, c67: 9, c68: 3,
            c70: 9, c71: 1, c72: 4,
            c73: 8, c74: 2, c75: 3,
            c76: 5, c77: 6, c78: 7,
            c80: 6, c81: 7, c82: 3,
            c83: 4, c84: 9, c85: 5,
            c86: 2, c87: 8, c88: 1,
        });

        expect(solver.strategiesUsed).toEqual(["Hidden Single Strategy"]);
    });

    it("should solve the grid with three strategies", () => {
        const grid = new SudokuGrid({
            c00: 3,
            c10: 9, c11: 7, c14: 1,
            c20: 6, c23: 5, c24: 8, c25: 3,
            c30: 2, c36: 9,
            c40: 5, c43: 6, c44: 2, c45: 1, c48: 3,
            c52: 8, c58: 5,
            c63: 4, c64: 3, c65: 5, c68: 2,
            c74: 9, c77: 5, c78: 6,
            c88: 1,
        });

        const solver = new SudokuSolver();
        const resolvedCellMapping = solver.resolve(grid);

        expect(Object.keys(resolvedCellMapping).sort()).toEqual([
            "c01", "c02", "c06", "c07", "c08",
            "c12", "c15", "c16", "c17", "c18",
            "c26",
            "c31", "c34", "c37",
            "c41", "c42",
            "c51", "c54", "c56", "c57",
            "c61", "c62",
            "c73",
            "c81", "c83",
        ]);

        expect(grid.isSolved()).toEqual(true);
        expect(grid.toMapping()).toEqual({
            c00: 3, c01: 8, c02: 1,
            c03: 9, c04: 7, c05: 6,
            c06: 5, c07: 2, c08: 4,
            c10: 9, c11: 7, c12: 5,
            c13: 2, c14: 1, c15: 4,
            c16: 6, c17: 3, c18: 8,
            c20: 6, c21: 4, c22: 2,
            c23: 5, c24: 8, c25: 3,
            c26: 1, c27: 7, c28: 9,
            c30: 2, c31: 6, c32: 4,
            c33: 3, c34: 5, c35: 8,
            c36: 9, c37: 1, c38: 7,
            c40: 5, c41: 9, c42: 7,
            c43: 6, c44: 2, c45: 1,
            c46: 4, c47: 8, c48: 3,
            c50: 1, c51: 3, c52: 8,
            c53: 7, c54: 4, c55: 9,
            c56: 2, c57: 6, c58: 5,
            c60: 8, c61: 1, c62: 6,
            c63: 4, c64: 3, c65: 5,
            c66: 7, c67: 9, c68: 2,
            c70: 4, c71: 2, c72: 3,
            c73: 1, c74: 9, c75: 7,
            c76: 8, c77: 5, c78: 6,
            c80: 7, c81: 5, c82: 9,
            c83: 8, c84: 6, c85: 2,
            c86: 3, c87: 4, c88: 1,
        });

        expect(solver.strategiesUsed).toEqual([
            "Hidden Single Strategy",
            "Hidden Triple Strategy",
            "Hidden Pair Strategy",
        ]);
    });
});
