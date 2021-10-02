---
title: Release dev-2021-07
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2021-07
slug: dev-2021-07
author: Ginger Bill
date: '2021-07-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2021-07

## New Language Features
* Swizzling syntax for arrays len <= 4 (GLSL-like behaviour)
  * e.g. `v.xyz`, `v.zyx`, `v.xxx`
  * e.g. `v.rgb`, `v.bgr`, `v.rrr`
* Optional Ok Pointer addressing mode:
  * `ptr, ok := &m[v];`
  * `ptr, ok := &v.(T);`
* Disallow `defer`s in a scope which terminates with a diverging procedure `-> !`
* Compound literals for `struct #raw_union` types
* Allow alternative syntax for `offset_of`:
  * `offset_of(Struct_Type, field)` (current syntax)
  * `offset_of(value.field)` (new alternative syntax)

## Compiler Improvements
* Performance optimizations for `switch` statements (normal and type)
* Performance optimizations for array programming

## Packages
* Remove `context.thread_id`
* Improve documentation for the Odin binary doc-format spec
* Improvements to `reflect`
* Add `intrinsics.type_is_endian_platform`
* Add `bufio.Scanner`
* Add `bufio.Lookahead_Reader`
* Many improvements to `png`
* Many improvements to `gzip`
* Many improvements to `zlib`
* Huge performance improvements to hashing procedures:
  * `hash.crc32`
  * `hash.adler32`

## Bug Fixes
* Fix `filepath` bug leak
* Improve linalg.transpose return type behaviour
* Fix 128-bit integer to float cast by explicitly calling the procedure (was an LLVM bug)
* Fix `-lld` on Windows
* FIx double evaluation buf with selector call expressions `x->y(z)->w(a)`
* Fix semicolon insertion rule for `---`

