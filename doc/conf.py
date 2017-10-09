# :coding: utf-8

"""Sudoku React documentation build configuration file."""

import os
import json

# -- General ------------------------------------------------------------------

# Extensions.
extensions = [
    "sphinx.ext.extlinks",
    "lowdown",
    "champollion"
]

# The suffix of source file names.
source_suffix = ".rst"

# The master toc-tree document.
master_doc = "index"

# General information about the project.
project = u"Sudoku Javascript"
copyright = u"2017, Jeremy Retailleau"

# Version
with open(os.path.join(os.path.dirname(__file__), "..", "package.json")) as f:
    package_information = json.load(f)
    _version = package_information["version"]

version = _version
release = _version

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
exclude_patterns = ["_template"]

# -- Cross-Reference ----------------------------------------------------------

primary_domain = "js"

# -- HTML output --------------------------------------------------------------

html_theme = "sphinx_rtd_theme"

# If True, copy source rst files to output for reference.
html_copy_source = True

# -- Champollion  -------------------------------------------------------------

js_source = os.path.join(
    os.path.dirname(__file__), "..", "source", "sudoku"
)
js_module_options = ["members"]
js_class_options = ["members"]
