## Sudoku Javascript

[![CircleCI](https://circleci.com/gh/buddly27/sudoku-javascript.svg?style=shield)](https://circleci.com/gh/buddly27/sudoku-javascript)

[![codecov](https://codecov.io/gh/buddly27/sudoku-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/buddly27/sudoku-javascript)

[![Documentation Status](https://readthedocs.org/projects/sudoku-javascript/badge/?version=stable)](http://sudoku-javascript.readthedocs.io/en/stable)

This library is attempting to solve 9x9 Sudoku grids based on built-in
strategies. It records the modified cells and keep track of the strategies
used in order to be used for didactic purposes.

It is inspired from the excellent [Sudoku Wiki](<http://www.sudokuwiki.org/>)
solver.

```javascript
import {SudokuGrid, SudokuSolver} from "sudoku-javascript";

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
solver.resolve(grid);
```

## Documentation

Full documentation, including installation and setup guides, can be found at

http://sudoku-javascript.readthedocs.io/en/stable
