---
title: Release dev-2021-11
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-11
slug: dev-2021-11
author: Ginger Bill
date: '2021-11-02'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-11

## New Language Features

* `matrix` type
    * `matrix[Rows, Columns]Element_Type`
    * A `matrix` is a mathematical type built into Odin. It is a regular array of numbers, arranged in rows and columns
    * Multiplication between matrices and arrays
    * Component-wise operations
    * Submatrix casting square matrices
    * Submatrix casting non-square matrices
    * Column-major memory layout
    * Limited to a maximum of 16 elements
    * Supports integers, floats, and complex numbers (only)
    * Optimized for SIMD vectorization
    * Built-in procedures (Compiler Level)
        * `transpose`
        * `outer_product`
        * `hadamard_product`
        * `matrix_flatten`
        * `conj`
    * Built-in procedures (Runtime Level)
        * `determinant`
        * `adjugate`
        * `inverse`
        * `inverse_transpose`
        * `hermitian_adjoint`
        * `matrix_trace`
        * `matrix_minor`
* `odin report`
    * Reporting of Platform Specific Information
* `wasi_wasm32` support
* Improved WASM support in general

## New Packages

* `core:crypto`
* `vendor:ENet`

## Package Improvements

* Improvements to `vendor:OpenGL`
    * Set `VertexAttribPointer` related calls to use `uintptr` instead of `rawptr` for the byte offset parameter
    * Convert all functions taking `GLboolean` to `bool`
* Updates to `core:sync/sync2`
    * Generic `Futex` interface for each platform
    * `Sema` implemented with `Futex`
* Improvements to `core:mem/virtual` to make usage consistent
* Minor improvements to the SDL vendor packages
* `core:encoding/json` - add alias for `MJSON` as `Bitsquid`
* Improvements to `vendor:microui`
* Improvements to `vendor:raylib`
* Add more OOM checks within the core library
* Unify `runtime.memory_equal` and `runtime.string_eq` logic
* Add `id` to `thread.Thread`
* Add `slice.swap_between`
* Add experimental `big.Rat`

## Compiler Improvements

* `intrinsics.unaligned_store`
* `intrinsics.unaligned_load`
* `intrinsics.mem_zero_volatile`
* `offset_of_by_string`
* Heavily improve the LLVM struct type generation to improve ABI
* Simplify `map` logic and code generation
* Disallow `or_return` within `defer`
* Fix `strip-semicolon` on some machines which didn't truncate correctly
* Allow parsing for `[^]T{}` to improve error messages
* Support LLVM 11, LLVM 12, and LLVM 13 in the code
* Fix debug problems
* Improved `bit_set` semantics
