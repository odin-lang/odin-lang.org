---
title: Release dev-2021-10
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-10
slug: dev-2021-10
author: Ginger Bill
date: '2021-10-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-10

## New Language Features
* Semicolons are now fully optional (non-breaking change)
    * https://odin-lang.org/news/optional-semicolons/
* `#load_or(path_string, default_byte_slice)`

## New Packages
* `vendor:raylib`
    * Including `vendor:raylib/easings.odin`
* `vendor:microui`
    * Odin native source port 
* `vendor:stb/image`
    * Includes: `stb_image.h`, `stb_image_resize.odin`, `stb_image_write.odin`
* `vendor:stb/easy_font`
* `vendor:stb/vorbus`
* `vendor:stb/truetype`
* `core:hash/xxhash`
* `core:mem/virtual` (still experimental and work in progress)

## Package Improvements
* Improvements and additions to `core:encoding/json`
    * Support `json.unmarshal`
        * Writing to `[]byte`, `strings.Builder`, and `io.Writer`
    * Support three different dialects of JSON: JSON (strict), [JSON5](https://json5.org/), [MSJON](https://bitsquid.blogspot.com/2009/10/simplified-json-notation.html) (Bitsquid flavour)
* Minor corrections to `vendor:sdl2`
* Improvements to `vendor:vulkan` to use `[^]` where appropriate
* Improvements to `core:math/big`
* Additions to `core:reflect`
    * `reflect.equal`, `reflect.not_equal`
    * `reflect.any_base`, `reflect.any_core`
    * `reflect.set_union_value`
* Changes to `core:io` 
    * Optional `n_read`/`n_written` parameters (useful for building utility procedures)
    * Move `strings.write_quoted_*` to `io.write_quoted_*`
* Numerous tests for the the png, gzip, zlib, et al packages
* Add `bits.log2`
* Add `i128` and `u128` parsers to `core:strconv`
* Correct `append_soa` for `#soa[dynamic][N]T`

## Compiler Improvements
* Update Windows to LLVM 12.0.1
* `odin strip-semicolon` utility tool to remove unnecessary semicolons
* `-strict-style`
* `-strict-style-init-only`
* `intrinsics.prefetch_*` procedures
* Fix slice indices endianness
* General dead code culling in the compiler
* Simplify parsing for directives
* Correct `f64` <-> `u128`/`i128` code generation
* Make `map` internals more robust when using `mem.nil_allocator()`
* Fix `[^]u8` to `cstring` conversion
* Allow `[^]T` to `uintptr` conversion