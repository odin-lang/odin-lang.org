---
title: Release dev-2021-06
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-06
slug: dev-2021-06
author: Ginger Bill
date: '2021-06-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-06

## New Language Features
* Allow unions to be comparable if all the variants are comparable
* Comparable unions allowed as map keys
* Improve implicit selector expression inference rules with unions
* Unified `cond ? x : y` and `x if cond else y` logic
* Improve type inference system to allow `&{}` alongside `&T{}` in some cases
* Change `for in x..y` behaviour to prevent the possibility of overflowing on maximum integer size and causing an infinite loop
* Allow `..=` alongside `..` as a "full range" operator (`..=` will probably replace `..` for ranges)
* Remove `@(static)` for global variables
* Add `@(link_section=<string>)` for global variables
* Add intrinsics: `mem_zero`, `mem_copy`, `mem_copy_non_overlapping`, `sqrt`, `ptr_offset`, `ptr_sub`

## Compiler Improvements
* Tokenize `++` and `--` as tokens but disallow them in the parser, and give better error messages for they are used as operators/statements
* Add `-verbose-errors`
* Improved parsing error messages
* *EXPERIMENTAL* `-use-separate-modules` support  (useful for speeding up code generation in development builds)
* Correct SysV ABI edge cases
* Array arithmetic code generation improvements for small arrays

## Packages
* package core:odin/printer
* package core:odin/format
* package core:odin/doc-format
* package core:math improvements for `f16`
* package core:image/png fixes
* Added `test.fail_now`
* Add `soa_zip` and `soa_unzip` to demo

## Fixes
* Numerous bug fixes