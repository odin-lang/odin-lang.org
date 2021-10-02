---
title: Release dev-2021-08
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-08
slug: dev-2021-08
author: Ginger Bill
date: '2021-08-02'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-08

## New Language Features
* `or_else` built-in procedure for values which have an optional-ok value
* Allow `x in ptr_to_map_or_bit_set`
* Ability to add custom warnings to procedures with the attribute`@(warning=<string>)`

## Compiler Improvements
* Multithread the entire Semantic Checker stage of the compiler
    * This will decrease `odin check` times
    * Can be disabled with either `-no-threaded-checker` (disables parsing in only the semantic checker) or `-thread-count:1` (will also disable threading in parser)
* Improve error handling for parsing errors
* Replace the old big int library with libTomMath

## Packages
* Add `#no_bounds_check` to linalg procedures
* Add `slice.sort_by_cmp`
* Add `slice.min` and `slice.max`
* Add `strings.cut`
* Deprecate `sort.slice` and `sort.reverse_slice`
* Add documentation for the overview of `package fmt`

## Bug Fixes
* Fix numerous swizzle related bugs
* Fix parametric Polymorphic struct with default parapoly parameter bug

