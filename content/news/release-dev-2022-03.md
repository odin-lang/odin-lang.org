---
title: Release dev-2022-03
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-03
slug: dev-2022-03
author: Ginger Bill
date: '2022-03-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-03

## New Language Features

* `[Enum]Type{...}` checks for missing enumerated fields in a compound literal by default
  * Opt-out with `#partial [Enum]Type{...}`
* `#sparse[Enum]Type` for non-contiguous enum fields used in an enumerated array type
  * `#partial #sparse[Enum]Type{...}` can be combined to allow for missing fields in a sparse enumerated array compound literal

## New Compiler Features

* OpenBSD support
* Objective-C Runtime Intrinsics
  * `intrinsics.objc_send`
  * `intrinsics.find_selector`
  * `intrinsics.find_class`
  * `intrinsics.register_selector` (only required when creating Objective-C classes at runtime)
  * `intrinsics.register_class` (only required when creating Objective-C classes at runtime)
* `intrinsics.constant_utf16_cstring`

## Compiler Improvements

* `//+private file` support
* Numerous bug fixes
* Removal of `context.user_data`
  * Prefer `context.user_ptr`

## New Packages

* **Native** Metal package:
  * These directly call the Objective-C message sending runtime directly and does not use a wrapper
    * Article: https://odin-lang.org/news/major-graphics-apis/
  * `vendor:darwin/Metal`
  * `vendor:darwin/QuartzCore`
  * `vendor:darwin/Foundation`
* DirectX packages
  * Article: https://odin-lang.org/news/major-graphics-apis/
  * `vendor:directx/d3d11`
  * `vendor:directx/d3d12`
  * `vendor:directx/d3d_compiler`
  * `vendor:directx/dxgi`
* `core:container/topological_sort`

## Package Improvements

* `core:mem/virtual` Linux Support
* Add `is_16_bit_from_memory` to `vendor:stb/image`
