---
title: Release dev-2021-09
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-09
slug: dev-2021-09
author: Ginger Bill
date: '2021-09-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-09

## New Language Features
* `or_return` atom expression (suffix) 
    * extremely useful for early returning with multiple return values
    * `x, err = foo(); if err != nil { return }` can now becomes `x = foo() or_return;`
* `or_else` as a binary (infix) operator
* Multi-Pointers `[^]T` 
    * A way to describe foreign (C-like) pointers which act like arrays (pointers that map to multiple items)
    * The main purpose of this type is to aid with foreign code and act as a way to auto-document functionality and allow for easier transition to Odin code, especially converting pointers to slices.
* Allow `len` and `cap` to return `uint` if a type is `uint` to aid people wanting to use unsigned integers
* Unify semantics of the built-in `swizzle` procedure with the selector expression semantics e.g. `.xyz`
* Define where `#bounds_check` and `#no_bounds_check` can be applied
    * May only be applied to one of the following statements: `{}`, `if`, `when`, `for`, `switch`, `return`, `defer`,  assignment, variable declaration
    * May only be applied to a variable declaration, and not a constant value declaration

## Packages
* `core:math/big` (big integer support)
* `core:encoding/hxa` (reader and writer)
* `core:c/libc` - (mostly) projected all of C11's standard library to Odin, as defined by the C11 specification: N1570, or ISO/IEC 9899:2011.
* Remove `core:encoding/cel`
* The new `vendor` library collection
* `vendor:sdl2`
    * Full bindings to the SDL2 library
    * Ships with DLLs and Libs for Microsoft Windows
    * Bundled with `gamecontrollerdb.txt`
* `vendor:sdl2/image`
* `vendor:sdl2/mixer`
* `vendor:sdl2/net`
* `vendor:sdl2/ttf`
* `vendor:OpenGL`
* `vendor:vulkan`
* `vendor:glfw`
* `vendor:portmidi`

## Compiler Improvements
* Unify multithreading logic through the compiler
* Remove numerous possible race conditions
* Disallow `using` on enum declarations in favour of implicit selector expressions: `.A`
* Simplify data structures within the compiler for better memory reuse
* Correct `DllMain` behaviour
* Delete a lot of dead code

## General Changes
* Prefer `..=` over `..`  in the core library
* Add `Allocator_Error.Mode_Not_Implemented`
* Allow `+` in import paths
* Add `#any_int` directive to replace `auto_cast` uses on parameters
* Add `map_insert` which returns the pointer to the inserted value (assuming no resizes happen in the mean time)
