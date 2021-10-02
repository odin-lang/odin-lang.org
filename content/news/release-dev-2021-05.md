---
title: Release dev-2021-05 (New Backend Release)
summary: New Backend Release - https://github.com/odin-lang/Odin/releases/tag/dev-2021-05
slug: dev-2021-05
author: Ginger Bill
date: '2021-05-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-05

## Compiler Changes

* Removal of the old backend which manually produced `.ll` files and passed them to the LLVM binaries directly
  * Removes need for `llc` and `opt` binaries
* LLVM C API based backed as the main backend for all platforms and targets
  * Removes need for `-llvm-api`
* Full debug symbols support for Windows (\*nix is still experimental)
* M1 ARM64/AARCH64 Support `-target:darwin_arm64`
* `-strict-style` style as default
  * https://github.com/odin-lang/Odin/issues/871
* New Versioning System `dev-yyyy-mm:sha`
* New flags
  * `-build-mode` modes:
    * `llvm-ir`
    * `assembly`
  * `-o:<string>` flag as an alternative to `-opt:<integer>`
    * Accepted values: `mininal`, `size`, `speed`
  * `-vet-extra` for extra vet checks (many usually false positives)
  * `-microarch:<string>`
  * `-disallow-do`
  * `-default-to-nil-allocator`
* `ODIN_ROOT` environment variable to be able to change the root directory for the Odin root path
* `odin test`
  * build ands runs procedures with the attribute `@(test)` in the initial package
* `odin doc`
  * generate documentation from a .odin file, or directory of .odin files
  * `-doc-format` Generates documentation as the .odin-doc format (useful for external tooling)
* Improvements to `-vet`
* Many bug fixes


## Language Changes

* Ability to iterate on `#soa` types with a `for`-`in` loop
* `soa_zip` (generate #soa type from slices)
* `soa_unzip` (generate slices from #soa type)
* `make_soa` and `delete_soa`
* Allocator procedure signature change to support return a `[]byte` and `Allocator_Error` code
* Removal of `intrinsics.x86_mmx`
* Remove `#opaque` types
* Remove `bit_field` types
  * Prefer `bits.bitfield_extract` and `bits.bitfield_insert` procedures located in `core:math/bits`
* Replace `inline` and `no_inline` with `#force_inline` and `#force_no_inline`, respectively
* Improved `#optional_ok` logic
* New procedure attributes:
  * `@(disabled=<boolean>)`
  * `@(cold)`
  * `@(optimization_mode=<string>)`
* `f16`, `f16le`, `f16be` types
* Removal of "pure" calling convention
* Addition of "naked" calling convention (removes prologue and epilogue)
* `min(T)`/`max(T)` support where `T` is a float
* Make any `struct` comparable as long as all of its fields are comparable
* Make any comparable type a valid `map` key type
* `//+build ignore` tag
  * Useful for examples within a `package`


## Core Library Changes

### New Packages

* `core:bufio`
* `core:bytes`
* `core:c/frontend/tokenizer`
* `core:c/frontend/preprocessor`
* `core:compress`
* `core:compress/gzip`
* `core:compress/zlib`
* `core:image`
* `core:image/png`
* `core:io`
* `core:math/fixed`
* `core:path` (URI-like paths)
* `core:path/filepath` (OS paths)
* `core:slice`
* `core:sort`
* `core:text/scanner`

### Experimental Packages

* `core:sync/sync2` (will replace `core:sync` when finished)

### New Additions to `package intrinsics`

* `volatile_load`
* `volatile_store`
* `debug_trap`
* `trap`
* `alloca`
* `cpu_relax`
* `read_cycle_counter`
* `count_ones`
* `count_zeros`
* `count_trailing_zeros`
* `count_leading_zeros`
* `reverse_bits`
* `byte_swap`
* `overflow_add`
* `overflow_sub`
* `overflow_mul`
* `expect`
* `type_has_field`
* `type_proc_parameter_count`
* `type_proc_return_count`
* `type_proc_parameter_type`
* `type_proc_return_type`
* `type_polymorphic_record_parameter_count`
* `type_polymorphic_record_parameter_value`
* `type_field_index_of`
* `type_equal_proc`
* `type_hasher_proc`