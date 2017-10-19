/**
 * Sudoku cell.
 */


/**
 * Represent a Sudoku Cell object.
 */
export class SudokuCell {
    /**
     * Create a Sudoku Cell with an initial *value* between 0 and 9.
     *
     * The coordinates of the cell within a grid must be indicated with the
     * *rowIndex* and *columnIndex* value.
     *
     * If the *value* is 0, the cell is considered as not solved and a list
     * of candidates from 1 to 9 is set. If the *value* is not 0, the cell
     * is considered as solved and an empty list of candidates is set.
     *
     * Example::
     *
     *     >>> const cell1 = new SudokuCell(0, 0, 0);
     *     >>> cell1.candidates;
     *     [1, 2, 3, 4, 5, 6, 7, 8, 9]
     *
     *     >>> const cell2 = new SudokuCell(4, 0, 0);
     *     >>> cell2.candidates;
     *     []
     *
     * A custom list of *candidates* can be given.
     *
     * .. warning ::
     *
     *      An Error will be raised if the custom list of candidates is
     *      incoherent with the cell value.
     */
    constructor(value, rowIndex, columnIndex, candidates = null) {
        this._identifier = `c${rowIndex}${columnIndex}`;

        this._value = value;
        this._rowIndex = rowIndex;
        this._columnIndex = columnIndex;

        if (candidates) {
            this.validateCandidates(candidates);
            this._candidates = candidates;
        }
        else {
            this._candidates = (!value) ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [];
        }

        // Next candidates awaiting for update
        this._nextCandidates = null;
    }

    /**
     * Validate *candidates* and throw an error if invalid.
     *
     * An error is raised if the candidates list is not empty while the cell
     * already has a non-zero value, or if the candidates list is empty while
     * the cell do not has a non-zero value yet.
     */
    validateCandidates(candidates) {
        if (candidates.length > 0 && this.isSolved()) {
            throw Error(
                "A non-empty list of candidates can not be set for a " +
                "solved cell."
            );
        }
        else if (candidates.length === 0 && !this.isSolved()) {
            throw Error(
                "A empty list of candidates can not be set for an " +
                "unsolved cell."
            );
        }
    }

    /** Return cell identifier. */
    get identifier() {
        return this._identifier;
    }

    /** Return row index of the cell. */
    get rowIndex() {
        return this._rowIndex;
    }

    /** Return column index of the cell. */
    get columnIndex() {
        return this._columnIndex;
    }

    /** Return value of the cell. */
    get value() {
        return this._value;
    }

    /**
     * Set a new value for the cell.
     *
     * .. warning::
     *
     *     The list of candidates will be emptied in the process.
     */
    set value(value) {
        this._value = value;
        this._candidates = [];
        this._nextCandidates = null;
    }

    /** Return list of candidate numbers of the cell. */
    get candidates() {
        return this._candidates;
    }

    /**
     * Set a new list of *candidates* to replace the current cell candidates.
     *
     * .. warning ::
     *
     *      An Error will be raised if the new list of candidates is incoherent
     *      with the cell value.
     */
    set candidates(candidates) {
        this.validateCandidates(candidates);
        this._candidates = Array.from(new Set(candidates)).sort();
    }

    /**
     * Return list of latest candidate numbers of the cell.
     *
     * Return the non applied 'next' candidates if available, otherwise
     * return the actual candidate numbers of the cell.
     */
    get latestCandidates() {
        return this._nextCandidates || this._candidates;
    }

    /**
     * Indicate whether the cell is solved.
     */
    isSolved() {
        return (this._value !== 0);
    }

    /**
     * Set a list of 'next' *candidates* to replace the current cell candidates.
     *
     * These 'next' candidates are generally found when applying a strategy to
     * resolve a sudoku grid. It does not replace the current list of candidates
     * until the method
     * :meth:`~sudoku.cell.SudokuCell.applyNextCandidates` is called.
     */
    setNextCandidates(candidates) {
        this._nextCandidates = Array.from(new Set(candidates)).sort();
    }

    /**
     * Replace cell candidates with list of 'next' *candidates* previously set.
     *
     * A list of 'next' candidates must have been previously set with the
     * :meth:`~sudoku.cell.SudokuCell.setNextCandidates` method.
     *
     * Return whether a list of 'next' candidates has been applied.
     */
    applyNextCandidates() {
        if (!this._nextCandidates) {
            return false;
        }

        this._candidates = this._nextCandidates;
        this._nextCandidates = null;
        return true;
    }

    /**
     * Compute candidates from its neighbor list of *rowValues*, *columnValues*
     * and *blockValues*.
     *
     * If a number from the candidates list is matching values from one of
     * these list, it is removed from the candidates list.
     *
     * Return whether a list of new candidates has been successfully computed.
     *
     * .. warning::
     *
     *     If the list of new candidates is bigger than the current list of
     *     candidates, it is not applied.
     */
    updateCandidates(rowValues, columnValues, blockValues) {
        const allElements = new Set(
            [...rowValues, ...columnValues, ...blockValues]
        );

        const difference = new Set(
            [...this._candidates].filter(
                (candidate) => !allElements.has(candidate)
            )
        );

        if (difference.size < this._candidates.length) {
            this._candidates = Array.from(difference).sort();
            return true;
        }
        return false;
    }

    /**
     * Attempt to resolve the cell and return whether it has been solved.
     *
     * When one number remains in the candidates list, extract this number and
     * set it as the new cell value.
     */
    resolve() {
        if (!this.isSolved() && this._candidates.length === 1) {
            this._value = this._candidates.pop();
            return true;
        }
        return false;
    }

    /**
     * Return a new cell instance cloning the current instance.
     *
     * A new list of *candidates* can be given. Otherwise the current list of
     * candidates will be passed to the cloned instance.
     */
    clone(candidates = null) {
        const _candidates = candidates || this.candidates;
        return new SudokuCell(
            this.value, this.rowIndex, this.columnIndex, _candidates
        );
    }
}
