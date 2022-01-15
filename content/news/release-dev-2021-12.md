---
title: Release dev-2021-12
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-12
slug: dev-2021-12
author: Ginger Bill
date: '2021-12-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-12

## New Language Features

* Allow casting from floats to complex numbers and quaternions
* `@(linkage=<string>)` for procedures and variables
* `@(require)` for procedures
* `#load_hash(<filepath>, <string-hash-kind>)`
* `-target:js_wasm32` target (custom Web JavaScript runtime to run Odin executables)

## New Compiler Features

* Add `ODIN_NO_CRT` global boolean constant
* Add `ODIN_BUILD_MODE` global string constant
* Allow compilation of assembly files on Windows through `nasm.exe` in conjunction with the `foreign import` system (`.asm`, `.s`, `.S` files)
* `-extra-assembler-flags:<string>`
* `-timings-export:<string>`

## Compiler Improvements

* Improve matrix related operations
* Correctly support `-default-to-nil-allocator` for all platforms
* `-no-crt` improvements on Windows
* General wasm32 improvements
* Internal compiler (not language) improvements to data structures
* Improve compilation passes on LLVM 12.0.1 and LLVM 13.0.0 (compiler still defaults to LLVM 11.1.0)
* Correct `x in ptr` logic
* Numerous bug fixes

## New Packages

* `vendor:raylib` version 4.0
* `core:math/linalg/glsl` - GLSL-like mathematics types and operations
* `core:math/linalg/hlsl` - HLSL-like mathematics types and operations

## Package Improvements

* Make `math` procedures `contextless`
* Add `asinh `, `acosh`, `atanh`
* Represent matrices in `fmt` as expected
* Make runtime builtin matrix procedures `contextless`
* `package runtime` linkage improvements
* `linalg.matrix4_look_at_from_fru`
* Implement `math.ldexp` and `math.frexp` in native Odin
* Add `log1p`, `erf`, `erfc`, `ilogb`, `logb` `nextafter`, `gamma`, `lgamma`, `signbit`to `core:math`
* Add support for darwin to `core:c/libc`
* Add numerous new `core:crypto` packages
* Add `os.read_at_least` and `os.read_full` utility procedures
* Correct reading from a console on Windows
