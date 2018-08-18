# :coding: utf-8

import os

from setuptools import setup


ROOT_PATH = os.path.dirname(os.path.realpath(__file__))
README_PATH = os.path.join(ROOT_PATH, "README.md")

VERSION = "0.6.0"

# Compute dependencies.
INSTALL_REQUIRES = [
    "sphinx >= 1.6.2, < 2",
    "sphinx_rtd_theme >= 0.2.0, < 1",
    "lowdown >= 0.1.0, < 2",
    "champollion >= 0.6.0, < 1"
]

setup(
    name="sudoku-javascript",
    version=VERSION,
    description="Generate Sphinx documentation for Sudoku Solver.",
    long_description=open(README_PATH).read(),
    url="https://github.com/buddly27/sudoku-javascript",
    keywords="",
    author="Jeremy Retailleau",
    install_requires=INSTALL_REQUIRES,
    tests_require=[],
    zip_safe=False
)
