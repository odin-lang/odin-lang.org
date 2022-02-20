---
title: Release dev-2022-02
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-02
slug: dev-2022-02
author: Ginger Bill
date: '2022-02-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-02

## New Language Features

None

## New Compiler Features

* Add `#no_type_assert` and `#type_assert` to disable implicit type assertions with `x.(T)`
* Add `ODIN_ERROR_POS_STYLE` constant and `-error-pos-style:<string>` option to allow for default or unix style error messages

## Compiler Improvements

* Correct debug information logic for procedure parameters
* General improvements to `odin doc` support the new https://pkg.odin-lang.org/
* Correct `//+private` for `odin doc`
* Make `ODIN_ENDIAN` a constant enum value rather than a string
* Rename architecture `386` to `i386`
* Improve entry code handling to support more platforms easily in the future
* Improve/simplify quaternion casting

## New Packages

* `core:container/lru`
* Rename `core:path` to `core:path/slashpath`

## Package Improvements

* `slice.stable_sort*` procedures
* Add allocator parameter to `rand.perm`
* `rand.exp_float64`
* `strings.split_lines*` procedures