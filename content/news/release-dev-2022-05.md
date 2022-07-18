---
title: Release dev-2022-05
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-05
slug: dev-2022-04
author: Ginger Bill
date: '2022-05-01'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-05
## New Language Features

None

## New Compiler Features

* New intrinsics:
    * `intrinsics.type_is_multi_pointer`
    * `intrinsics.type_field_type`

## Compiler Improvements

* Numerous bug fixes
* Refactored filename handling
* Error message if the output is a directory
* Packages are assumed to be directory-based unless `-file` is supplied

## New Packages

* New builtin `container_of`
* `core:compress/shoco` A short string (de)compressor
* `core:container/intrusive/list` An intrusive linked list
* `core:encoding/varint` LEB128 encode and decode
* `core:encoding/xml` An XML parser
* `core:image/netpbm` A reader/writer for the NetPBM image formats
* `core:image/qoi` A reader/writer for the QOI image format
* `core:image/tga` A writer for a common subset of the TGA format
* `core:text/i18n` An easy way to translate your software using GetText or Qt Linguist translations

## Package Improvements

* Additional D3D and win32 bindings and constants
* Unified `Sema` and `Atomic_Sema` behaviour
* Fix quaternion implementation #1644
* Updated Vulkan generator and package
* Fixed static arena assertion fail #1740
* `core:container/lru` Reduce allocations, fixes
* `core:encoding/json` Unmarshal fixes
* `core:hash/xxhash` Fixes
* `core:path/filepath` Add file stem and long-extension procedures
* `core:slice` More helpers
* `core:strings` Add Levenshtein distance
* `core:sync` Improvements
* `core:thread` New thread pool implementation
* `vendor:metal` and `vendor:darwin` numerous additions and fixes
* Quicksort minor fix