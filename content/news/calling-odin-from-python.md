---
title: Calling Odin from Python
summary: Calling Odin from Python with ctypes
slug: calling-odin-from-python
author: Ginger Bill
date: '2022-07-18'
categories:
  - c
  - python
  - odin
  - foreign
  - binding
---

Making a dynamic/shared library with Odin is really simple, especially to be called from Python using [`ctypes`](https://docs.python.org/3/library/ctypes.html).

```odin
// example/foo.odin
package example

@export
add :: proc "c" (a, b: i32) -> i32 {
	return a + b
}
```

The above code will produce a procedure named `add` that takes two parameters of type `i32` and returns an `i32`.

To compile this to a dynamic library, it is as simple as:

```
odin build example -build-mode:dll
```

This will produce a `.dll` on Windows or a `.so` on \*nix systems.

Fire up Python and see if you can call your newly created Odin procedure!

```python
import ctypes
from ctypes import c_int32

lib = ctypes.CDLL("example.dll")

lib.add.restype = c_int32
lib.add.argtypes = [c_int32, c_int32]

print(lib.add(123, 456)) # 579
```