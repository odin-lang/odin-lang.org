---
title: Release dev-2022-07
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-07
slug: dev-2022-04
author: Ginger Bill
date: '2022-07-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-07

## New Language Features
* Add builtin `shrink` for dynamic maps and arrays

## New Compiler Features

## Compiler Improvements
* Fix `odin test` runner.
* Use `memmove` if possible when emitting store over a certain size

## New Packages
* `core:slice/heap` - A max heap implementation

## Package Improvements
* Tighter allocation of Arena allocator
* Remove `simd_rem`; Disallow `simd_dev` for integers
* Remove `strings` dependency from `core:sys/windows`
* Additional Win32 bindings
* Add new verbs and qualifiers to `core:fmt`
* Support utf-16 printing with `[]u16` and `[^]u16`
* Add `strings.prefix_length` and `slice.prefix_length`
* Add `runtime.dll_forward_reason` for Windows