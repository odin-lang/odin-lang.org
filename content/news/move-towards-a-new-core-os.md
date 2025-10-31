---
title: Moving Towards a New "core:os"
summary: The rationale and transition period to moving to the new "core:os"
slug: moving-towards-a-new-core-os
author: Ginger Bill
date: '2025-10-31'
categories:
  - packages
  - apis
---

Odin has been designed to be a pragmatic and evolutionary language, and as such, most people have come to appreciate the results of that, especially stability of language features. Odin rarely experiences breaking changes, however we have some technical debt to pay.

Packages `base:runtime` and `core:os` are the oldest packages in the core library of Odin, as they were used in bootstrapping the language and the rest of the packages. Over time they became an amalgamation of ideas, added as and when things were needed. `base:runtime` has already been cleaned up, but `core:os`'s general API was poorly designed and inconsistent across platforms. Certain procedures were available only on specific platforms _and_ other procedures, while available on all platforms, didn't have a unified signature across them. Constants and errors messages were all platform-specific, leading to less than ideal cross-platform behaviour.

Over the past couple of years, we have been redesigning the entirety of `core:os` (which at the time of writing is `core:os/os2`) to be in keeping with the standards of the core library. We have learnt a lot over the years in terms of library and API design for Odin, and we want to incorporate those lessons into one of its most foundational packages.

## Transition Period

There will be numerous breaking changes for `core:os`, but we have promised to give notice well in advance of when this will happen and how we plan to transition. This article is that notice.

We are expecting to transition to the new design of `core:os` early next year (Q1 2026).

**Note:** `core:os/os2` is already available to use today. When the transition happens, this will become `core:os`, and `core:os/os2` will be no more.

## New Design

The new package has changed many aspects of how you interact with `core:os`; an overview:

* All procedures that returned allocated memory will require an explicit allocator to be passed
  * If you want to emulate the current functionality, it is recommended that you pass `context.allocator` or `context.temp_allocator` where needed
* Most procedures now return an `os.Error` rather than a trivial `bool` or `Errno` where appropriate
* File handling now uses `^os.File` instead of a raw file handle (`os.Handle`)
  * Allowing for a more generic interface which can be easily overridden/intercepted where needed
* New APIs handling paths and processes
* New and improved directory walker
* Consistent API across all platforms/OSes
* And many more quality of life improvements!

## Rationale Behind Design Choices

### Why `^os.File`

The old API used raw file handles (`os.Handle`) for all of its file operations. This was fine for most operations, it can however be quite restrictive when doing something more complicated, or you need the ability to override/intercept behaviour.

In languages such as C, it is common to have the standard "file" type (e.g. [`FILE`](https://wikipedia.org/wiki/C_file_input/output) in C) act like a generic stream interface with fstat-like support. This ability to override the generic interface allows for more streamlined file buffering (which was previously done with an explicit wrapper such as [`bufio.Writer`](https://pkg.odin-lang.org/core/bufio/#Writer)/[`bufio.Reader`](https://pkg.odin-lang.org/core/bufio/#Reader)), and also to intercept code that was written for a file handle (now `^os.File`) instead of an [`io.Stream`](https://pkg.odin-lang.org/core/io/#Stream).

A lot of Odin's design has centred around allowing the programmer to intercept third party code. As `core:os` is such a foundational package, we believe it should mirror this design principle.

**Note:** Odin's [implicit `context` system](https://odin-lang.org/docs/overview/#implicit-context-system) is a brilliant example of this interception ability built directly into the language.


### Why Explicit Allocators

We wanted to clarify the distinctions between user-level and OS-level allocations. Requiring an explicit allocator makes it very clear who and what is allocating where.

The internal design of the new `core:os` uses its own set of custom allocators which are not meant to be used by the rest of the user code. They are not overridable (unfortunately), and just as operating systems perform a lot of internal allocations already, this is an extension of that. This allows allocators to minimize memory usage, too.

A basic example of this is `^os.File` (a pointer to extra information) allocated using the internal allocators rather than any user-provided allocator, which are logically also freed using those internal allocators.

Other packages in the core library will keep their existing allocator idiom, such as `allocator := context.allocator`, as those APIs are purely in the user-level domain. `core:os` is being treated differently because it is a fundamentally different kind of package to the rest of the core library.


## Some Examples of the Changes

```odin
// Old API
data, ok := os.read_entire_file("path/to/file.txt")

// New API
data, err := os.read_entire_file("path/to/file.txt", context.allocator)
```

```
// Old API
fd: os.Handle

// New API
f: ^os.File

```

```odin
// Old API
err: os.Errno // just an integer

// New API
err: os.Error // a union of enums
```

```odin
// Removed procedures
get_last_error // not needed since `os.Error` exists
get_page_size
get_std_handle

// Removed OS specific procedures
get_windows_version // etc
is_windows_* // etc
```