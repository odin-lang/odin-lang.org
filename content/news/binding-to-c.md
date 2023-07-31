---
title: Binding to C
summary: Using Odin to bind to C and other foreign languages
slug: binding-to-c
author: Ginger Bill
date: '2022-07-17'
categories:
  - c
  - odin
  - foreign
  - binding
---


## Binding to C

Odin makes it fairly easy to bind to C code (but not C++ code, unless wrapped) that is compiled as a local static or dynamic/shared library, or to a system library.


This is primarily done in two parts, first by using `foreign import` to create an import name and link to the library file, and `foreign` blocks to link to declare individual exported functions and variables.

**Note:** Any language that supports C ABI is able to be used with the `foreign` in Odin.

### Example
Make a file called `foo.c` containing the following:
foo.c:
```cpp
int foo_add_int(int a, int b) {
    return a + b;
}

double foo_add_double(double a, double b) {
    return a + b;
}
```
then, depending on your platform:
```
gcc -c foo.c
ar rcs foo.a foo.o
```
```
cl -TC -c foo.c
lib -nologo foo.obj -out:foo.lib
```
And finally, to use it in Odin, you could do:
```odin
import "core:fmt"
import "core:c"

when ODIN_OS == .Windows do foreign import foo "foo.lib"
when ODIN_OS == .Linux   do foreign import foo "foo.a"

foreign foo {
    foo_add_int    :: proc(a, b: c.int)    -> c.int ---
    foo_add_double :: proc(a, b: c.double) -> c.double ---
}

main :: proc() {
    fmt.println(foo_add_int(2, 2))
    fmt.println(foo_add_double(2.71828, 3.14159))
}
```

Note that the procedure declaration has to end in `---` inside the `foreign` block to denote that the body is found elsewhere. This is to prevent a parsing ambiguity with procedure variables and types. See the [Attributes and Directives sections](https://odin-lang.org/docs/overview/#attributes) for more information.

### Foreign blocks

Odin supports multiple ways of making binding to C easier.

By default, the foreign block links to a function of the same name as the name you specify inside the `foreign` block. This can be explicitly changed by using the `@(link_name=<string>)` and `@(link_prefix=<string>)` [attributes](https://odin-lang.org/docs/overview/#linking-and-foreign-attributes). The following are all equivalent:

```odin
foreign foo {
    foo_add_int    :: proc(a, b: c.int)    -> c.int ---
    foo_add_double :: proc(a, b: c.double) -> c.double ---
}
```
```odin
foreign foo {
    @(link_name="foo_add_int")
    add_int :: proc(a, b: c.int) -> c.int ---

    @(link_name="foo_add_double")
    add_double :: proc(a, b: c.double) -> c.double ---
}
```
```odin
@(link_prefix="foo_");
foreign foo {
    add_int    :: proc(a, b: c.int)    -> c.int ---
    add_double :: proc(a, b: c.double) -> c.double ---
}
```

### Static vs shared libraries

Static libraries work the same in on every platform: you specify the relative paths of the library file in the .odin file you are importing it to.

Dynamic/shared libraries are slightly different depending on which operating system you are using:

 - In Windows you link to an import lib (.lib) relative to the file you're importing from, and the user have to make sure the corresponding .dll is visible to the exectutable.
 - In Linux you link directly to the shared object (.so) that is visible to the executable.

Note that for local libraries and for system libraries in Windows you need to specify the full filename, including file extension. For system libraries in Linux you can omit the extension, and it will link to the appropriate library file available in the system library search paths.

To summarize, if the current file is `/path/to/file/foo.odin`
```odin
foreign import foo "foo.a"          // static lib in linux, links to /path/to/file/foo.a
foreign import foo "foo.so"         // shared lib in linux links to /path/to/executable/foo.so
foreign import foo "foo.lib"        // static/import library in windows, links to /path/to/file/foo.lib
foreign import foo "system:foo"     // system library (static or shared) in linux. Links to /usr/lib/libfoo.a
foreign import foo "system:foo.lib" // system library (static or import) in windows. Links to foo.lib
```

### Calling conventions

C supports a plethora of calling conventions, most of them for Windows. Procedure calling conventions are added after the `proc` in the signature:

```odin
foo :: proc "c" () {}
bar :: proc "stdcall" () {}
bar :: proc "system" () {} // "stdcall" on Windows, "c" on *nix systems
```
Procedure declarations in `foreign` blocks default to the "c" calling convention, but this can be changed by adding the `@(default_calling_convention=<string>)` attribute prior to the `foreign` block.

```odin
@(default_calling_convention="std")
foreign lib {
    ...
}
```

Possible calling conventions are:
- `"odin"`
- `"contextless"`
- `"c", "cdecl"`
- `"std"`, `"stdcall"`
- `"fast"`, `"fastcall"`
- `"system"` (system OS default, e.g. `"stdcall"` on Windows, `"c"` on \*nix systems)

### Types

C types don't map directly to Odin types typically, even if they both have types with the same name!
There's a package in the core library ([`core:c`](https://github.com/odin-lang/Odin/blob/master/core/c/c.odin)) that you can import to get some Odin equivalents of some of the basic C types.

**Please note** that `int` in Odin is register-wide (e.g. 64-bit on a 64-bit architecture) and NOT equivalent to C's `int`, please use `c.int` from `core:c` if you require that specific type.

Some types don't fit in this file, though. There are four big ones: strings, structs, unions, and pointers.

#### Strings

C strings are pointers to the first byte in an array of bytes, who's last byte is zero, or `NUL`. (a.k.a "the null terminator.)
The Odin equivalent to this is `cstring`, which is just a `^u8` internally (`char const *`).

To work with C strings in Odin, it's highly recommended that you use this type, and, as required, convert them to `string` with a cast: `string(my_cstring)` or `cast(string) my_cstring`, which creates a string that just points to the `cstring`'s data. No allocation or copy is performed.
Despite being just a cast, this takes `O(N)` time as it will scan the memory, looking for the null terminator, in order to determine the length of the string, since Odin strings keep track of the length.

To go the other way, you may import `core:strings` and use `strings.clone_to_cstring(my_string)`, which makes a copy of the underlying string, and puts a null terminator on the end.
The returned `cstring` is allocated and so therefore should be freed once you no longer need it.

Rather than a dynamic allocation, you might alternatively want to use `strings.clone_to_cstring(my_string, context.temp_allocator)` to use temporary storage instead.

#### Structs

Odin structs with fields that are the same size as their C equivalents, (see [`core:c`](https://github.com/odin-lang/Odin/blob/master/core/c/c.odin)) Odin structs have the same layout as the equivalent C struct. *Please note* that structs initialized from C may not have their padding between fields zeroed unlike Odin. Please take this into consideration when interfacing with foreign code in general.

Packed structs in Odin work the same as C with compiler extensions, with the `#packed` tag:
```odin
S :: struct #packed { x: i64, y: u8 }
#assert(size_of(S) == 9)
```

#### Unions

`union`s in Odin do not have a compatible data layout to their equivalent C union.
You may still declare such a union however by using a struct with the `#raw_union` tag.

#### Pointers

C's pointers allow for both arithmetic and indexing. Odin has done away for the need for both by providing a much richer type system through actual array types (fixed-arrays, slices, dynamic arrays, etc) and a feature specifically added for interfacing with foreign languages such as C: [multi-pointers](/docs/overview/#multi-pointers).

Normal pointers in Odin effectively assume to be pointing to a value at an address. Its zero value is `nil`. These normal pointer types can only be deferenced, and do not support arithmetic nor indexing. For the Odin-like equivalent, that is where multi-pointers come in.

The equivalent to C's `void *` is `rawptr` in Odin.

Multi-Pointers in Odin are a way to describe foreign (C-like) pointers which act like arrays (pointers that map to multiple items). The type `[^]T` is a multi-pointer to `T` value(s). Its zero value is `nil`.

```odin
p: [^]f32
```

What multi-pointers support:

* Index (without any bounds checking)
* Slicing (bounds checking on if both the low and high operands are given)
* Implicit conversions between `^T` and `[^]T`
* Implicit conversion to `rawptr` (like all pointers)

What multi-pointers DO NOT SUPPORT:

* Dereferencing (which makes it closer to a slim-slice than a pointer)

The main purpose of this type is to aid with `foreign` code and act as a way to auto-document functionality and allow for easier transition to Odin code, especially converting pointers into slices.

The following are the rules for indexing and slicing for multi-pointers, and what type they produce depending on the operands given:

```odin
x: [^]T = ...

x[i]   -> T
x[:]   -> [^]T
x[i:]  -> [^]T
x[:n]  -> []T
x[i:n] -> []T
```


### Learning More

If you want to learn more about how to structure your bindings for foreign code, it is highly recommended to read through the source code many of the packages within the `vendor` library collection:

* Documentation: <https://pkg.odin-lang.org/vendor/>
* Source Code: <https://github.com/odin-lang/Odin/tree/master/vendor>
