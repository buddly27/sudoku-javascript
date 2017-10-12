.. _release/release_notes:

*************
Release Notes
*************

.. release:: 0.1.0

    .. change:: new

        Added :class:`~sudoku.strategy.intersection.BoxLineReductionStrategy`
        to identify when a candidate number appears two or three time within the
        row or column of a block and remove it from other cells of the block.

    .. change:: new

        Added :class:`~sudoku.strategy.intersection.PointingStrategy` to
        identify when a candidate number appears two or three time within the
        row or column of a block and remove it from other cells in the rest
        of the row or column.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.NakedTripleStrategy` to identify
        when three candidate numbers can only be in three specific cells from a
        row, a column or a block and remove these candidates from other cells.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.NakedPairStrategy` to identify when
        two candidate numbers can only be in two specific cells from a row, a
        column or a block and remove these candidates from other cells.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.HiddenQuadStrategy` to identify
        when four cells from a row, a column or a block can only contain four
        specific candidate numbers and remove other candidate numbers from
        those cells.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.HiddenTripleStrategy` to identify
        when three cells from a row, a column or a block can only contain three
        specific candidate numbers and remove other candidate numbers from
        those cells.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.HiddenPairStrategy` to identify
        when two cells from a row, a column or a block can only contain two
        specific candidate numbers and remove other candidate numbers from
        those cells.

    .. change:: new

        Added :class:`~sudoku.strategy.basic.HiddenSingleStrategy` to identify
        when a cell from a row, a column or a block can only contain a specific
        candidate number and remove other candidate numbers from this cell.

    .. change:: new

        Initial release including a :class:`~sudoku.solver.SudokuSolver` which
        can apply strategies to resolve :class:`~sudoku.cell.SudokuCell`
        within a :class:`~sudoku.grid.SudokuGrid`.
