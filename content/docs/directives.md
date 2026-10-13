---
title: Directives
summary: The directives which extend the core behaviour of Odin.
weight: 11
---

Directives are a way of extending the core behaviour of the Odin programming language. They have the form `#directive_name`.

## Record memory layout

### `#packed`

This tag can be applied to a struct. Removes padding between fields that's normally inserted to ensure all fields meet their type's alignment requirements. Fields remain in source order.

This is useful where the structure is unlikely to be correctly aligned (the insertion rules for padding assume it **_is_**), or if the space-savings are more important or useful than the access speed of the fields.

Accessing a field in a packed struct may require copying the field out of the struct into a temporary location, or using a machine instruction that doesn't assume the pointer address is correctly aligned, in order to be performant or avoid crashing on some systems. (See `intrinsics.unaligned_load`.)
```odin
struct #packed {x: u8, y: i32, z: u16, w: u8}
```

### `#raw_union`

This tag can be applied to a struct. The struct's fields will share the same memory, which serves the same functionality as `union`s in C. Useful when writing bindings especially.
```odin
struct #raw_union {u: u32, i: i32, f: f32}
```

### `#align`
This tag can be applied to a `struct` or `union`. When `#align` is passed an integer `N` (as in `#align N`), it specifies that the `struct` will be aligned to `N` bytes. The `struct`'s fields will remain in source-order.
```odin
Foo :: struct #align(4) {
	b: bool,
}
Bar :: union #align(4) {
	i32,
	u8,
}
```

### `#no_nil`
This tag can be applied to a union to not allow nil values.
```odin
A :: union {int, bool}
B :: union #no_nil {int, bool}
```
```odin
// Possible states of A:
{} // nil
{int}
{bool}

// Possible states of B:
{int} // default state
{bool}
```

### `#row_major` and `#column_major`

These tags can be applied to a [`matrix`](/docs/overview/#matrix-type) type to specify its internal storage layout. Matrices are column-major by default; `#column_major` is the same as having no tag.
```odin
a: #row_major matrix[2, 3]f32    // internally [2][3]f32
b: #column_major matrix[2, 3]f32 // internally [3][2]f32, the same as `matrix[2, 3]f32`
```

## Struct fields

### `#subtype`

This tag can be applied to a struct field to allow the struct to be used as a subtype of the field's type, like `using`, but without bringing the field's own fields into the struct's namespace. See [subtype polymorphism](/docs/overview/#subtype-polymorphism).
```odin
Frog :: struct {
	#subtype entity: Entity,
	ribbit_volume: f32,
}
```

## Control statements

### `#partial`

By default all `case`s of an `enum` or union have to be covered in a `switch` statement. The reason for this requirement is because it makes accidental bugs less likely. However, the `#partial` tag allows you to not have to write out `case`s that you don't need to handle:
```odin
Foo :: enum {
	A,
	B,
	C,
}

test :: proc() {
	bar := Foo.A

	// All cases required, removing any would result in an error
	switch bar {
	case .A:
	case .B:
	case .C:
	}

	// Partially state wanted cases
	#partial switch bar {
	case .A:
	case .B:
	}
}
```

The `#partial` directive can also be used to initialize an [enumerated array](/docs/overview/#enumerated-array).

## Procedure parameters

### `#no_alias`

This tag can be applied to a procedure parameter that is a pointer. This is a hint to the compiler that this parameter will not alias other parameters. This is equivalent to C's `__restrict`.

```odin
foo :: proc(#no_alias a, b: ^int) {}
```

### `#any_int`

`#any_int` enables implicit casts to a procedure's integer type at the call site. A parameter with `#any_int` must be an integer.

```odin
foo :: proc(#any_int a: int) {}
x : i32
foo(x) // This is now allowed without an explicit cast
```

### `#no_broadcast`

`#no_broadcast` disables the implicit broadcasting of a scalar value to every element of an array-like parameter type, which is otherwise allowed by [array programming](/docs/overview/#array-programming). This prevents mistakes such as accidentally passing a single element where a whole array was expected.

```odin
fill :: proc(#no_broadcast value: [4]f32) {}
fill(1)            // error: cannot broadcast `1` to `[4]f32`
fill({1, 1, 1, 1}) // ok
```

### `#const`

`#const` requires the argument passed to a parameter to be a compile-time constant, while (unlike a `$` parameter) not making the procedure polymorphic. This is primarily used for foreign bindings to LLVM intrinsics which require immediate operands.

```odin
@(default_calling_convention="none")
foreign _ {
	@(link_name="llvm.x86.avx.round.ps.256")
	round_ps256 :: proc(a: #simd[8]f32, #const mode: u32) -> #simd[8]f32 ---
}
```

### `#no_capture`

`#no_capture` is reserved for stating that a pointer-like parameter is not captured (stored) beyond the procedure call. It is currently implied for all variadic parameters, and has no other effect.

### `#caller_location`

`#caller_location` sets a parameter's default value to the location of the code calling the procedure. The location value has the type [`Source_Code_Location`](https://pkg.odin-lang.org/base/runtime/#Source_Code_Location). `#caller_location` may only be used as a default value for procedure parameters.

```odin
package example_caller_location

import "core:fmt"

print_caller_location :: proc(loc := #caller_location) {
	fmt.println(loc)
	fmt.println(#procedure, "called by", loc.procedure)
}

main :: proc() {
	print_caller_location()
	// C:/some/dir/example_caller_location.odin(11:2)
	// print_caller_location called by main
}
```

### `#caller_expression` or `#caller_expression(<param>)`

`#caller_expression` gives a procedure the entire call expression or the expression used to create a parameter. `#caller_expression` may only be used as a default value for procedure parameters.

```odin
package example_caller_expression

import "core:fmt"

entire_expression :: proc(greeting: string, count: int, expr := #caller_expression) {
	fmt.println(expr)
}

param_expression :: proc(greeting: string, count: int, count_expr := #caller_expression(count)) {
	fmt.println(count_expr)
}

main :: proc() {
	entire_expression("Hellope!", 1 + 1)
	// entire_expression("Hellope!", 1 + 1)
	param_expression("Yo", 2 + 2)
	// 2 + 2
}
```

### `#c_vararg`
Used to interface with vararg functions in foreign procedures.
```odin
foreign foo {
	bar :: proc(n: int, #c_vararg args: ..any) ---
}
```

### `#by_ptr`
Used to interface with const reference parameters in foreign procedures.
The parameter is passed by pointer internally.
```odin
foreign foo {
	bar :: proc(#by_ptr p: T) ---
}
```
to represent
```c
void bar(const T*)
```

### `#optional_ok`

Allows skipping the last return parameter, which needs to be a `bool`
```odin
import "core:fmt"

foo :: proc(x: int) -> (value: int, ok: bool) #optional_ok {
	return x + 1, true
}

main :: proc() {
	for x := 0; x < 11; x = foo(x) {
		fmt.printf("v: %v\n", x)
	}
}
```

### `#optional_allocator_error`

Allows skipping the last return parameter, which needs to be a `runtime.Allocator_Error`
```odin
import "base:runtime"
import "core:strings"
import "core:fmt"

add_greetings :: proc(name: string) -> (string, runtime.Allocator_Error) #optional_allocator_error {
	result, err := strings.join({"Hello", name}, ", ")
	return result, err
}

main :: proc() {
	msg := add_greetings("Bill")
	fmt.println(msg)
}
```

## Expressions

### `#type`

This tag doesn't serve a functional purpose in the compiler; it is for telling someone reading the code that the expression is a type. The main case is for showing that a procedure signature without a body is a type and not just missing its body, for example:
```odin
foo :: #type proc(foo: string)

bar :: struct {
	gin: foo,
}
```

### `#sparse`

This directive may be used to create a sparse [enumerated array](/docs/overview/#enumerated-array).
This is necessary when the enumerated values are not contiguous.

```odin
Key :: enum {
	Bronze =  1,
	Silver =  5,
	Gold   = 10,
}

Key_Descriptions :: #sparse[Key]string {
	.Bronze = "a blocky bronze key",
	.Silver = "a shiny silver key",
	.Gold   = "a glittering gold key",
}
```

### `#force_inline` and `#force_no_inline`

Specify whether a procedure literal or call will be forced to inline (`#force_inline`) or forced to never inline `#force_no_inline`. This is **not** a suggestion to the compiler. If the compiler cannot inline the procedure, it will (currently) silently ignore the directive.

This is enabled for all optimization levels except `-o:none` which has all inlining disabled.

### `#must_tail`

Explicitly state that a procedure call must be optimized as a tail call. If the call cannot be compiled as a tail call, it is a compile error.

* The called procedure must have the same type as the procedure it is called within.
* The called procedure must not use the `"odin"` calling convention; e.g. use `"contextless"`, `"c"`, or `"preserve/none"` (which minimizes the cost of each call).
* On WebAssembly targets, the `tail-call` target feature is required, e.g. `-target-features:tail-call`.

```odin
count_down :: proc "contextless" (n: int) -> int {
	if n == 0 {
		return 0
	}
	return #must_tail count_down(n-1)
}
```

## Statements

### `#bounds_check` and `#no_bounds_check`

The `#bounds_check` and `#no_bounds_check` flags control Odin's built-in bounds checking of arrays and slices. Any statement, block, or function with one of these flags will have their bounds checking turned on or off, depending on the flag provided. Valid uses of these flags include:
```odin
proc_without_bounds_check :: proc() #no_bounds_check {
	#bounds_check {
		#no_bounds_check fmt.println(os.args[1])
	}
}
```

By default, the Odin compiler has bounds checking enabled program-wide where applicable, and it may be turned off by passing the `-no-bounds-check` build flag.

### `#type_assert` and `#no_type_assert`

`#no_type_assert` will bypass the underlying call to `runtime.type_assertion_check` when placed at the head of a statement or block which would normally do a type assert, such as the resolution of a `union` or an `any` into its true type.
`#type_assert` will re-enable type assertions, if they were turned off in an outer scope.

```odin
Number :: union {
	int,
	f64,
}

proc_without_type_assertions :: proc(a: any, b: Number, m: Maybe(int)) -> int #no_type_assert {
	c := 0
	#type_assert {
		// These statements will assert that the assumptions about the types of
		// the underlying values are correct, because we have overriden the
		// outer scope's `#no_type_assert` status.
		c += a.(int)
		c += m.(int) // A `Maybe` can only be its type or the nil type.
	}
	return c + b.(int) // This will not assert that `b` is an int.
}
```

By default, the Odin compiler has type assertions enabled program-wide where applicable, and they may be turned off by passing the `-no-type-assert` build flag.
Note that `-disable-assert` does not also turn off type assertions; `-no-type-assert` must be passed explicitly.

## Built-in directives

### `#assert(<boolean>)`

Unlike `assert`, `#assert` runs at compile-time. `#assert` breaks compilation if the given bool expression is false, and thus `#assert` is useful for catching bugs before they ever even reach run-time. It also has no run-time cost.
```odin
#assert(SOME_CONST_CONDITION)
```

### `#panic(<string>)`

Panic runs at compile-time. It is functionally equivalent to an `#assert` with a `false` condition, but `#panic` has an error message string parameter.
```odin
#panic(message)
```

### `#config(<identifier>, default)`

Checks if an identifier is defined through the command line, or gives a default value instead.

Values can be set with the `-define:NAME=VALUE` command line flag.

### `#defined`

Checks if an identifier is defined. This may only be used within a procedure's body.

```odin
n: int
when #defined(n) { fmt.println("true") }
if #defined(int) { fmt.println("true") }
when #defined(nonexistent_proc) == false { fmt.println("proc was not defined") }
```

### `#file`, `#directory`, `#line`, `#procedure`

Return the current file path, directory, line number, or procedure name, respectively. Used like a constant value. `file_name :: #file`

### `#exists(<string-path>)`

Returns `true` or `false` if the file at the given path exists. If the path is relative, it is accessed relative to the Odin source file that references it.

```odin
config_exists :: #exists("config.ini")
```

### `#branch_location`

When used within a [`defer`](/docs/overview/#defer-statement) statement, this directive returns a [`runtime.Source_Code_Location`](https://pkg.odin-lang.org/base/runtime/#Source_Code_Location) of the point at which the control flow triggered execution of the `defer`. This may be a `return` statement or the end of a scope.
```odin
package main

import "base:runtime"
import "core:fmt"

find_exit :: proc(v: bool, exit: ^runtime.Source_Code_Location) {
	defer {
		exit ^= #branch_location
	}
	if v == true {
		return
	} else {
		return
	}
}

main :: proc() {
	result_true:  runtime.Source_Code_Location
	result_false: runtime.Source_Code_Location

	find_exit(true,  &result_true)
	find_exit(false, &result_false)

	fmt.println(result_true)  // prints line 11
	fmt.println(result_false) // prints line 13
}
```

### `#location()` or `#location(<entity>)`

Returns a [`runtime.Source_Code_Location`](https://pkg.odin-lang.org/base/runtime/#Source_Code_Location). Can be called with no parameters for current location, or with a parameter for the location of the variable/proc declaration.
```odin
foo :: proc() {}

main :: proc() {
	n: int
	fmt.println(#location())
	fmt.println(#location(foo))
	fmt.println(#location(n))
}
```

### `#load(<string-path>)` or `#load(<string-path>, <type>)`

Returns a `[]u8` of the file contents at compile time. This means that the loaded data is baked into your program. Optionally, you can provide a type name as second argument; interpreting the data as being of that type.
```odin
foo := #load("path/to/file")
bar := #load("path/to/file", string)
fmt.println(bar)

// If a file's size is not a multiple of the `size_of(type)`, then any remainder is ignored.
baz := #load("path/to/file", []f32)
```

`#load` also works with `or_else` to provide default content when the file wasn't found
```odin
foo := #load("path/to/file", string) or_else "Hellope"
fmt.println(foo)
```

### `#hash(<string-text>, <string-hash>)`

Returns a constant integer of the hash of a string literal at compile time.

Available hashes:
- `"adler32"`
- `"crc32"`
- `"crc64"`
- `"fnv32"`
- `"fnv64"`
- `"fnv32a"`
- `"fnv64a"`
- `"murmur32"`
- `"murmur64"`

```odin
hash :: #hash("interesting-string", "fnv32a")
```

### `#load_hash(<string-path>, <string-hash>)`

Returns a constant integer of the hash of a file's contents at compile time.

This procedure has the same list of available hashes as [`#hash`](#hashstring-text-string-hash).

```odin
hash :: #load_hash("path/to/file", "crc32")
```

### `#load_directory(<string-path>)`

Loads all files within a directory, at compile time. All the data of those files will be baked into your program. Returns `[]Load_Directory_File`, where `Load_Directory_File` looks like so:

```odin
Load_Directory_File :: struct {
	name: string,
	data: []byte, // immutable data
}
```
`name` is the name of the file and `data` is the contents of the file.
