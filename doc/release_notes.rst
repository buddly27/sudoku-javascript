.. _release/release_notes:

*************
Release Notes
*************

.. release:: 0.6.3
    :date: 2018-08-18

    .. change:: fixed

        Add missing dates to release notes.

.. release:: 0.6.2
    :date: 2018-08-18

    .. change:: fixed

        Ensured that built library is published in the :term:`NPM` index.

.. release:: 0.6.1
    :date: 2018-08-18

    .. change:: fixed

        Changed lodash dependency to 4.17.5 due to vulnerability issues.

.. release:: 0.6.0
    :date: 2018-08-18

    .. change:: changed

        Changed README to `Markdown <https://en.wikipedia.org/wiki/Markdown>`_
        in order to have it displayed on the :term:`NPM` profile page.

        .. seealso:: https://www.npmjs.com/package/sudoku-javascript

    .. change:: changed

        Changed licensing to use the `MIT License
        <https://en.wikipedia.org/wiki/MIT_License>`_.

.. release:: 0.5.0
    :date: 2017-10-28

    .. change:: changed

        Changed :meth:`sudoku.grid.SudokuGrid.update` to return the number of
        solved cells instead of whether any candidates have been modified.

    .. change:: changed

        Changed :meth:`sudoku.cell.SudokuCell.updateCandidates` to return
        directly with 'false' if the cell is already solved.

    .. change:: new

        Added :func:`sudoku.cell.SudokuCellError` and use it instead of the
        generic error class for :class:`~sudoku.cell.SudokuCell` in order to
        include the cell identifier when an error is thrown.

    .. change:: changed

        Changed :class:`~sudoku.cell.SudokuCell` to throw
        :func:`~sudoku.cell.SudokuCellError` when an incoherent list of
        candidates is provided to a cell.

    .. change:: changed

        Changed :meth:`sudoku.cell.SudokuCell.updateCandidates` to throw
        :func:`~sudoku.cell.SudokuCellError` when it attempts to set an
        incoherent list of candidates to a cell.

        .. code-block:: js

            const cell = new SudokuCell(0, 1, 9)

            // This would result to an empty candidate list, whereas the cell
            // does not have a value yet...
            cell.updateCandidates([1, 4, 6], [2, 3, 5], [7, 8, 9])

.. release:: 0.4.0
    :date: 2017-10-24

    .. change:: changed

        Renamed :func:`sudoku.grid.SudokuGrid.toMapping` to
        :func:`sudoku.grid.SudokuGrid.toValueMapping` for clarity.

    .. change:: new

        Added :func:`sudoku.grid.SudokuGrid.toCandidateMapping` to return a
        mapping of all candidates per cell identifier.

.. release:: 0.3.2
    :date: 2017-10-22

    .. change:: fixed

        Fix package version.

.. release:: 0.3.1
    :date: 2017-10-21

    .. change:: fixed

        Updated :ref:`tutorial`.

.. release:: 0.3.0
    :date: 2017-10-21

    .. change:: changed

        Changed the logic which leads to the modification of cell candidate
        numbers when a strategy have been successfully applied:

        Instead of storing new candidate numbers in a 'next' buffer list
        attribute within the :class:`~sudoku.cell.SudokuCell` instance and
        updating the cell candidates list only when
        :meth:`sudoku.grid.SudokuGrid.updateCandidates` is called, each
        strategy's 'processGrid' method should return a mapping of
        :meth:`cloned instances <sudoku.cell.SudokuCell.clone>` which contain
        the updated candidates.

        Changed :meth:`sudoku.solver.SudokuSolver.resolve` so to take care of
        the update of each cell candidates.

    .. change:: new

        Added optional argument to set initial candidates to a
        :class:`~sudoku.cell.SudokuCell`.

    .. change:: new

        Added optional argument to set initial candidates for each
        :class:`~sudoku.cell.SudokuCell` instance within a
        :class:`~sudoku.grid.SudokuGrid` instance.

    .. change:: new

        Added :meth:`sudoku.cell.SudokuCell.validateCandidates` to throw
        an error when the list of candidate numbers set to a
        :class:`~sudoku.cell.SudokuCell` is incoherent with its value.

    .. change:: new

        Added :meth:`sudoku.grid.SudokuGrid.cellFromId` to retrieve a specific
        :class:`~sudoku.cell.SudokuCell` instance from a
        :class:`~sudoku.grid.SudokuGrid` using its identifier::

            >>> const grid = new SudokuGrid({c36: 7})
            >>> const cell = grid.cellFromId("c36")
            >>> cell.value
            7

    .. change:: fixed

        The assumption that setting a new value to a cell should automatically
        empty the candidate list was incorrect as a value of zero should bring
        back a list of possible candidate numbers, which is impossible to
        guess from the scope of the cell as it should be computed relatively to
        the entire grid (see :meth:`sudoku.grid.SudokuGrid.updateCandidates`).

        Therefore, the setter to manually change the value of a
        :class:`~sudoku.cell.SudokuCell` has been removed in favor of a setter
        to manually change its candidate numbers. It is safer to rely on a
        candidates setter and on the :meth:`sudoku.cell.SudokuCell.resolve`
        method to update a cell value::

            >>> cell = new SudokuCell(0, 0, 0)
            >>> cell.candidates = [3]
            >>> cell.resolve()
            >>> cell.value
            3

.. release:: 0.2.0
    :date: 2017-10-15

    .. change:: new

        Added setter to manually change the value of a
        :class:`~sudoku.cell.SudokuCell` and empty its list of candidates.

.. release:: 0.1.0
    :date: 2017-10-12

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
