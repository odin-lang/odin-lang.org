---
title: New Package Documentation
summary: New Package Documentation pkg.odin-lang.org
slug: new-package-documentation
author: Ginger Bill
date: '2022-01-23'
categories:
  - documentation
---

## New Website

Odin is taking documentation seriously. Documentation is large part of making software easy to learn, accessible, and maintainable; programming languages are no exception.

We are proud announce the brand new documentation site for all the official library collections ([`core`](https://github.com/odin-lang/Odin/tree/master/core) and [`vendor`](https://github.com/odin-lang/Odin/tree/master/vendor)): [pkg.odin-lang.org](http://pkg.odin-lang.org/).

<img alt="pkg.odin-lang.org screenshot" src="/images/new-package-documentation-screenshot.png" style="width: 100%; margin: 0.5em auto;">

## Layout

Packages documentation has three columns:

* Left sidebar is an overview of all the packages within that library collection
* Centre is the main documentation for that package
* Right sidebar is an overview of all the declarations with in the package

Declarations are grouped into different sections: types, constants, variables, procedures, and procedure types. Each declaration displays what the declaration looks like in source, a link to the declaration in source, and a collapsible description below it.

## Documenting Odin Code

We have developed the `odin doc` documentation tool. This tool parses and checks Odin source code (including comments) and produces documentation as plain text or in the [`.odin-doc` format](https://github.com/odin-lang/Odin/blob/master/core/odin/doc-format/doc_format.odin). This results in documentation that is tightly coupled with the code that it documents. The brand new documentation site, [pkg.odin-lang.org](http://pkg.odin-lang.org/), uses a `.odin-doc` file to generate the entire documentation in a completely automated process.

`odin doc` is much simpler in design than related tools such as Python's [Docstring](https://www.python.org/dev/peps/pep-0257/) or the behemoth that is [Doxygen](https://www.doxygen.nl/index.html). The comments read by `odin doc` are not language constructs (like with Docstring), specialized comments, nor must they have a machine-only readable syntax (such as Doxygen). `odin doc` comments are just plain ol' comments---readable if `odin doc` did not exist.

The commenting convention is simple: to document any declaration (variable, constant, type, procedure, procedure group), or even a package, write a regular comment directly above/preceding the declaration, with no blank line in-between.

```odin
// next reads and returns the next Unicode character. It returns EOF at the end of the source.
// next does not update the Scanner's pos field. Use 'position(s)' to get the current position.
next :: proc(s: ^Scanner) -> rune {
```


Comments on package declarations should provide information about the general package documentation. These comments can be short, like with [`package compress`](https://pkg.odin-lang.org/core/compress/):

```odin
// package compress is a collection of utilities to aid with other compression packages
package compress
```

Package comments can also be detailed like the [`package fmt`](https://pkg.odin-lang.org/core/fmt/) overview. That package uses a convention that aids with large introductory documentation where the package comment is placed within its own file, [doc.odin](https://github.com/odin-lang/Odin/blob/master/core/fmt/doc.odin). _Please note_ that when writing package comments of any size, the first sentence of the comment will appear in the package directory listing (e.g. [`core`'s listing](https://pkg.odin-lang.org/core/)).


Regarding the [pkg.odin-lang.org](https://pkg.odin-lang.org) HTML generation, there are a few formatting rules that the tool uses:

* Subsequent lines of text are considered part of the same paragraph; a blank line must be present to separate paragraphs
* Pre-formatted (code) text must be indented relative to the surrounding comment text with a tab (`\t`)
* If a pre-formatted block is preceded with a paragraph that ends with `Example:`, the following block will be considered a code example


## Contribution and Feedback

We are really excited to share this this is brand new site with you. As always, any feedback is welcomed.

If you are interested in contributing to this project, to existing [packages](https://github.com/odin-lang/Odin/tree/master/core) and the [generation tool](https://github.com/odin-lang/pkg.odin-lang.org), both are of course open source!