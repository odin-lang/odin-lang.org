---
title: Release dev-2022-01
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-01
slug: dev-2022-01
author: Ginger Bill
date: '2022-01-02'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-01

## New Language Features

None

## New Compiler Features

None

## Compiler Improvements

* Correct `odin doc` default parameter value `init_string` generation
* Improve debug symbol retention with `-debug -o:minimal`
* Disallow `@(static)` and `@(thread_local)` within `defer` statements
* Improvements for Darwin ARM64 support
* Improved float to quaternion conversion support
* Improved global `when` handling

## New Packages

* Replace `core:container` with new packages
* `core:container/bit_array`
* `core:container/priority_queue`
* `core:container/queue`
* `core:container/small_array`

## Package Improvements

* Improvements to `core:math/big`
* Improvements to `core:odin/parser`
* Make `strconv` more robust
* Fix typo in `core:json/encoding` from `unmarshall` to `unmarshal`
* Remove the extra hidden `0` terminator from `strings.clone` and `bytes.clone` which was there for very old legacy reasons, prefer `strings.clone_to_cstring` when that behaviour is needed
* Fix `strings.fields_proc` and `strings.index_any`
* Fix `math.prod`
* Add `hash.djbx33a`
* Add `sort.map_entries_by_key` and `sort.map_entries_by_value`