---
title: Release dev-2022-06
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-06
slug: dev-2022-04
author: Ginger Bill
date: '2022-06-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-06

## New Language Features

* Generic `#simd` type and intrinsics
  * Supports array programming semantics (operators)
  * New generic intrinsics
  * Platform specific intrinsics for the x86 family:
    * `sse`, `sse2`, `sse41`, `sse42`, `ssse3`
    * `cmpxchg16b`, `fxsr`, `lzcnt`, `pclmulqdq`, `popcnt`, `sha`
  * [PR #1807](https://github.com/odin-lang/Odin/pull/1807)

* Merge functionality of `#maybe` with standard `union` functionality
  * `Maybe :: union($T: typeid) {T}` No need for `#maybe` any more

* Deprecation of `a..b` range syntax to prefer `a..=b`

## New Compiler Features

* New intrinsics:
  * `non_temporal_load`
  * `non_temporal_store`
  * `fused_mul_add`

* Generic `#simd` intrinsics:
  * `simd_add`
  * `simd_sub`
  * `simd_mul`
  * `simd_div`
  * `simd_shl`
  * `simd_shr`
  * `simd_shl_masked`
  * `simd_shr_masked`
  * `simd_add_sat`
  * `simd_sub_sat`
  * `simd_and`
  * `simd_or`
  * `simd_xor`
  * `simd_and_not`
  * `simd_neg`
  * `simd_abs`
  * `simd_min`
  * `simd_max`
  * `simd_clamp`
  * `simd_lanes_eq`
  * `simd_lanes_ne`
  * `simd_lanes_lt`
  * `simd_lanes_le`
  * `simd_lanes_gt`
  * `simd_lanes_ge`
  * `simd_extract`
  * `simd_replace`
  * `simd_reduce_add_ordered`
  * `simd_reduce_mul_ordered`
  * `simd_reduce_min`
  * `simd_reduce_max`
  * `simd_reduce_and`
  * `simd_reduce_or`
  * `simd_reduce_xor`
  * `simd_shuffle`
  * `simd_select`
  * `simd_ceil`
  * `simd_floor`
  * `simd_trunc`
  * `simd_nearest`
  * `simd_to_bits`
  * `simd_lanes_reverse`
  * `simd_lanes_rotate_left`
  * `simd_lanes_rotate_right`

* Platform specific intrinsics:
  * `x86_cpuid`
  * `x86_xgetbv`

* `@(priority_index=<int>)` for `foreign import`
  * Force certain things to be linked before others
  * Required for the deterministic link order of foreign imports

## Compiler Improvements

* Allow `transmute` on constant expressions
* Heavily improved support for `js_wasm32` target
  * Basic DOM UI procedures
  * Event system including listeners
  * Page Allocator
* Compiler flag error message improvements
* Improved ternary-if type inference
* Improved -vet shadowing with ternary-if expressions
* Allow `import _ "foo"` to allow for `@(init)` procedures without producing an import name
* Correct `@(require_results)` on parapoly procedures

## New Packages

* `core:simd`
* `core:simd/x86`
* `core:encoding/endian`
* `vendor:ggpo`
* `vendor:openexr`

## Package Improvements

* Unify `raw_data` in `core:mem` with `core:runtime`
  * Make `raw_data` return `[^]T` types
* `core:image` generic interface improvements
  * `image.which`
  * Generic loader
* Add `#optional_ok` to `dynlib.symbol_address`
* Add `mem.DEFAULT_PAGE_SIZE`
* Add `rand.init_as_system` to allow for system-level based random number generation
* Numerous minor fixes to `core:` packages
* Interface cleans up to numerous packages keeping platform specific code private
