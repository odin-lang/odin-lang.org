---
title: Release dev-2022-04
summary: https://github.com/odin-lang/Odin/releases/tag/dev-2022-04
slug: dev-2022-04
author: Ginger Bill
date: '2022-04-05'
categories:
  - release
---

https://github.com/odin-lang/Odin/releases/tag/dev-2022-04

## New Language Features

- None

## New Compiler Features

- Rework of the entire atomic intrinsics (similar to C11 in design)

  - `Atomic_Memory_Order` enum
  - `atomic_type_is_lock_free`
  - `atomic_thread_fence`
  - `atomic_signal_fence`
  - `atomic_store`
  - `atomic_store_explicit`
  - `atomic_load`
  - `atomic_load_explicit`
  - `atomic_add`
  - `atomic_add_explicit`
  - `atomic_sub`
  - `atomic_sub_explicit`
  - `atomic_and`
  - `atomic_and_explicit`
  - `atomic_nand`
  - `atomic_nand_explicit`
  - `atomic_or`
  - `atomic_or_explicit`
  - `atomic_xor`
  - `atomic_xor_explicit`
  - `atomic_exchange`
  - `atomic_exchange_explicit`
  - `atomic_compare_exchange_strong`
  - `atomic_compare_exchange_strong_explicit`
  - `atomic_compare_exchange_weak`
  - `atomic_compare_exchange_weak_explicit`

- `union #shared_nil`
  
  - This adds a feature to `union` which requires all the variants to have a `nil` value and on assign to the union, checks whether that value is `nil` or not. If the value is `nil`, the union will be `nil` (thus sharing the `nil` value)

- Improved build script for the compiler

- Numerous bug fixes

## Compiler Improvements

- Improve `-help` messages for define/config

## New Packages

- Completely redesigned `core:sync`

  - Designed from the ground up with making the zero value useful (no need to initialize nor destroy values)
  - Utilizes the abilities of modern OSes with native futex support
  - Primitives:
    - `Mutex`
    - `RW_Mutex`
    - `Recursive_Mutex`
    - `Cond`
    - `Sema`
    - `Futex`
  - Extended:
    - `Wait_Group`
    - `Barrier`
    - `Auto_Reset_Event`
    - `Ticket_Mutex`
    - `Benaphore`
    - `Recursive_Benaphore`
    - `Once`

- `core:math/ease`

## Package Improvements

- Update Thread Pool in `core:thread`
- More additions to `core:sys/windows`
- Remove `#caller_location` from certain calls in `core:container/small_array`
- `vendor:stb/easy_font` fixes/improvements
- Update `mem.nil_allocator` to match the same implementation in `runtime`
- Numerous improvements and additions to `core:strings`
- Add `nil` check on `ast.walk` in `core:odin/ast`
- Numerous bug fixes
