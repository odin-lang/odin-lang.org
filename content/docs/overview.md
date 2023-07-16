---
title: Overview
summary: An overview of the Odin programming language and its features.
weight: 2
---

## Introduction

This article is a basic tutorial for the programming language _Odin_. This tutorial assumes a basic knowledge of programming concepts such as variables, statements, and types. It is recommended to read the [Getting started with Odin](https://github.com/odin-lang/Odin/wiki#getting-started-with-odin) guide.

## Hellope!

To begin this tour, let us start with a modified version of the famous "hello world" program:

```odin
package main

import "core:fmt"

main :: proc() {
	fmt.println("Hellope!")
}
```
Save this code to a `.odin` file, then compile and run it using `odin run <dir>`. For the current directory:
```txt
odin run .
```
The `run` command compiles the `.odin` file to an executable and then runs that executable after compilation. If you do not wish to run the executable after compilation, the `build` command can be used.
```txt
odin build <dir>
```

Odin thinks in terms of directory-based packages. To tell it to treat a single file as a standalone package, add `-file`, like so:
```txt
odin run hellope.odin -file
```

## Lexical elements and literals
### Comments
Comments can be anywhere outside of a string or character literal. Single line comments begin with `//`:
```odin
// A comment

my_integer_variable: int // A comment for documentation
```

Multi-line comments begin with `/*` and end with `*/`. Multi-line comments can be also be nested (unlike in C):
```odin
/*
	You can have any text or code here and
	have it be commented.
	/*
		NOTE: comments can be nested!
	*/
*/
```

Comments are parsed as tokens within the compiler. This is to allow for future work on automatic documentation tools.


### String and character literals
String literals are enclosed in double quotes and character literals in single quotes. Special characters are escaped with a backslash `\`.
```odin
"This is a string"
'A'
'\n' // newline character
"C:\\Windows\\notepad.exe"
```

Raw string literals are enclosed in single back ticks.

```odin
`C:\Windows\notepad.exe`
```

The length of a string can be found using the built-in [`len`](https://pkg.odin-lang.org/core/builtin/#len) proc:
```odin
len("Foo")
len(some_string)
```

If the string passed to [`len`](https://pkg.odin-lang.org/core/builtin/#len) is a compile-time constant, the value from [`len`](https://pkg.odin-lang.org/core/builtin/#len) will be a compile-time constant.

#### Escape Characters
* `\a` - bell (BEL)
* `\b` - backspace (BS)
* `\e` - escape (ESC)
* `\f` - form feed (FF)
* `\n` - newline
* `\r` - carriage return
* `\t` - tab
* `\v` - vertical tab (VT)
* `\\` - backslash
* `\"` - double quote (if needed)
* `\'` - single quote (if needed)
* `\NN`- octal 4 bit character (2 digits)
* `\xNN` - hexadecimal 8 bit character (2 digits)
* `\uNNNN` - hexadecimal 16-bit Unicode character UTF-8 encoded (4 digits)
* `\UNNNNNNNN` - hexadecimal 32-bit Unicode character UTF-8 encoded (8 digits)

### Numbers
Numerical literals are written similar to most other programming languages. A useful feature in Odin is that underscores are allowed for better readability: `1_000_000_000` (one billion). A number that contains a dot is a floating point literal: `1.0e9` (one billion). If a number literal is suffixed with `i`, it is an imaginary number literal: `2i` (2 multiply the square root of -1).

Binary literals are prefixed with `0b`, octal literals with `0o`, and hexadecimal literals with `0x`. A leading zero does not produce an octal constant (unlike C).

In Odin, if a number constant can be represented by a type without precision loss, it will automatically convert to that type.
```odin
x: int = 1.0 // A float literal but it can be represented by an integer without precision loss
```

Constant literals are "untyped" which means that they can implicitly convert to a type.
```odin
x: int // `x` is typed of type `int`
x = 1 // `1` is an untyped integer literal which can implicitly convert to `int`
```

## Variable declarations
A variable declaration declares a new variable for the current scope.
```odin
x: int // declares x to have type `int`
y, z: int // declares y and z to have type `int`
```

Variables are initialized to zero by default unless specified otherwise.

## Assignment statements

The assignment statement assigns a new value to a variable/location:
```odin
x: int = 123 // declares a new variable `x` with type `int` and assigns a value to it
x = 637 // assigns a new value to `x`
```
`=` is the assignment operator.

You can assign multiple variables with it:
```odin
x, y := 1, "hello" // declares `x` and `y` and infers the types from the assignments
y, x = "bye", 5
```

**Note:** `:=` is two tokens, `:` and `=`. The following are all equivalent:
```odin
x: int = 123
x:     = 123 // default type for an integer literal is `int`
x := 123
```

## Constant declarations
Constants are entities (symbols) which have an assigned value. The constant's value cannot be changed. The constant's value must be able to be evaluated at compile time:
```odin
x :: "what" // constant `x` has the untyped string value "what"
```
Constants can be explicitly typed like a variable declaration:
```odin
y : int : 123
z :: y + 7 // constant computations are possible
```

For more information regarding value declarations in general, please see the [Odin FAQ](/docs/faq) and Ginger Bill's article [On the Aesthetics of the Syntax of Declarations](https://www.gingerbill.org/article/2018/03/12/on-the-aesthetics-of-the-syntax-of-declarations/).


## Packages

Odin programs consist of packages. A package is a directory of Odin code files, all of which have the same package declaration at the top. Execution starts in the package's `main` procedure.

### `import` statement

The following program imports the the `fmt` and `os` packages from the `core` library collection.

```odin
package main

import "core:fmt"
import "core:os"

main :: proc() {
}
```

The `core:` prefix is used to state where the import is meant to look; this is called a library collection. If no prefix is present, the import will look relative to the current file.


**Note**: By convention, the package name is the same as the last element in the import path. `"core:fmt"` package comprises of files that begin with the statement `package fmt`. However, this is not enforced by the compiler, which means the default name for the import name will be determined by the last element in the import path if possible.

A different import name can be used over the default package name:
```odin
import "core:fmt"
import foo "core:fmt" // reference a package by a different name
```

### Exported names

All declarations in a package are exported by default.

The `private` attribute can be applied to an entity to prevent it from being exported from a package.
```odin
@(private)
my_variable: int // cannot be accessed outside this package.
```

You may also make an entity private to _the file_ instead of the package.
```odin
@(private="file")
my_variable: int // cannot be accessed outside this file.
```
`@(private)` is equivalent to `@(private="package")`.

### Authoring a package

A package is a directory of Odin code files, all of which have the same package declaration at the top, e.g. `package main`. Each .odin file _must_ have the same package name. A directory cannot contain more than 1 package.

### Organizing packages

Packages may be thematically organized by placing them in subdirectories of another package. For example: `core:image/png` and `core:image/tga`, as subdirectories of `core:image`. 
Nesting these packages is a helpful taxonomy. It does not imply a dependency: `core:foo/bar` does not need to import `core:foo` and reference anything from it.

## Control flow statements

### `for` statement
Odin has only one loop statement, the `for` loop.

#### Basic for loop

A basic `for` loop has three components separated by semicolons:

* The initial statement: executed before the first iteration
* The condition expression: evaluated before every iteration
* The post statement: executed at the end of every iteration

The loop will stop executing when the condition is evaluated to `false`.

```odin
for i := 0; i < 10; i += 1 {
	fmt.println(i)
}
```

**Note:** Unlike other languages like C, there are no parentheses `( )` surrounding the three components. Braces `{ }` or a `do` are always required.
```odin
for i := 0; i < 10; i += 1 { }
for i := 0; i < 10; i += 1 do single_statement()
```

The initial and post statements are optional:
```odin
i := 0
for ; i < 10; {
	i += 1
}
```
These semicolons can be dropped. This `for` loop is equivalent to C's `while` loop:
```odin
i := 0
for i < 10 {
	i += 1
}
```

If the condition is omitted, this produces an infinite loop:
```odin
for {
}
```

#### Range-based for loop
The basic for loop
```odin
for i := 0; i < 10; i += 1 {
	fmt.println(i)
}
```
can also be written
```odin
for i in 0..<10 {
	fmt.println(i)
}
// or
for i in 0..=9 {
	fmt.println(i)
}
```
where `a..=b` denotes a closed interval `[a,b]`, i.e. the upper limit is *inclusive*, and `a..<b` denotes a half-open interval `[a,b]`, i.e. the upper limit is *exclusive*.

Certain built-in types can be iterated over:
```odin
for character in some_string {
	fmt.println(character)
}
for value in some_array {
	fmt.println(value)
}
for value in some_slice {
	fmt.println(value)
}
for value in some_dynamic_array {
	fmt.println(value)
}
for key in some_map {
	fmt.println(key)
}
```

Alternatively a second index value can be added:
```odin
for character, index in some_string {
	fmt.println(index, character)
}
for value, index in some_array {
	fmt.println(index, value)
}
for value, index in some_slice {
	fmt.println(index, value)
}
for value, index in some_dynamic_array {
	fmt.println(index, value)
}
for key, value in some_map {
	fmt.println(key, value)
}
```
The iterated values are *copies* and cannot be written to. The following idiom is useful for iterating over a container in a by-reference manner:
```odin
for _, i in some_slice {
	some_slice[i] = something
}
```

**Note:** When iterating across a string, the characters will be `rune`s and not bytes. `for in` assumes the string is encoded as UTF-8.

#### `for` reverse iteration

Recently a special directive was added which allows to `#reverse` the above mentioned range based iteration. 

```odin
array := [?]int { 10, 20, 30, 40, 50 }

#reverse for x in array {
	fmt.println(x) // 50 40 30 20 10
}
```

### `if` statement

Odin's `if` statements do not need to be surrounded by parentheses `( )` but braces `{ }` or `do` are required.

```odin
if x >= 0 {
	fmt.println("x is positive")
}
```
Like `for`, the `if` statement can start with an initial statement to execute before the condition. Variables declared by the initial statement are only in the scope of that `if` statement.

```odin
if x := foo(); x < 0 {
	fmt.println("x is negative")
}
```

Variables declared inside an `if` initial statement are also available to any of the `else` blocks:
```odin
if x := foo(); x < 0 {
	fmt.println("x is negative")
} else if x == 0 {
	fmt.println("x is zero")
} else {
	fmt.println("x is positive")
}
```

### `switch` statement
A switch statement is another way to write a sequence of if-else statements. In Odin, the default case is denoted as a case without any expression.

```odin
package main

import "core:fmt"
import "core:os"

main :: proc() {
	switch arch := ODIN_ARCH; arch {
	case .i386, .wasm32:
		fmt.println("32 bit")
	case .amd64, .wasm64, .arm64:
		fmt.println("64 bit")
	case .Unknown:
		fmt.println("Unknown architecture")
	}
}
```
Odin's `switch` is like the one in C or C++, except that Odin only runs the selected case. This means that a `break` statement is not needed at the end of each case. Another important difference is that the case values need not be integers nor constants.

To achieve a C-like fall through into the next case block, the keyword [`fallthrough`](#fallthrough-statement) can be used.


Switch cases are evaluated from top to bottom, stopping when a case succeeds. For example:
```odin
switch i {
case 0:
case foo():
}
```
`foo()` does not get called if `i==0`. If all the case values are constants, the compiler may optimize the switch statement into a jump table (like C).


A `switch` statement without a condition is the same as `switch true`. This can be used to write a clean and long if-else chain and have the ability to [`break`](#fallthrough-statement) if needed
```odin
switch {
case x < 0:
	fmt.println("x is negative")
case x == 0:
	fmt.println("x is zero")
case:
	fmt.println("x is positive")
}
```

A `switch` statement can also use ranges like a range-based loop:
```odin
switch c {
case 'A'..'Z', 'a'..'z', '0'..'9':
	fmt.println("c is alphanumeric")
}

switch x {
case 0..<10:
	fmt.println("units")
case 10..<13:
	fmt.println("pre-teens")
case 13..<20:
	fmt.println("teens")
case 20..<30:
	fmt.println("twenties")
}
```


#### `#partial switch`

With `enum` values:
```odin
Foo :: enum {
	A,
	B,
	C,
	D,
}

f := Foo.A
switch f {
case .A: fmt.println("A")
case .B: fmt.println("B")
case .C: fmt.println("C")
case .D: fmt.println("D")
case:    fmt.println("?")
}

#partial switch f {
case .A: fmt.println("A")
case .D: fmt.println("D")
}
```

With `union` types (see [Type switch statement](#type-switch-statement))
```odin
Foo :: union {int, bool}
f: Foo = 123
switch in f {
case int:  fmt.println("int")
case bool: fmt.println("bool")
case:
}

#partial switch in f {
case bool: fmt.println("bool")
}
```



### `defer` statement
A defer statement defers the execution of a statement until the end of the scope it is in.

The following will print `4` then `234`:
```odin
package main

import "core:fmt"

main :: proc() {
	x := 123
	defer fmt.println(x)
	{
		defer x = 4
		x = 2
	}
	fmt.println(x)

	x = 234
}
```

You can defer an entire block too:
```odin
{
	defer {
		foo()
		bar()
	}
	defer if cond {
		bar()
	}
}
```

Defer statements are executed in the reverse order that they were declared:
```odin
defer fmt.println("1")
defer fmt.println("2")
defer fmt.println("3")
```
Will print `3`, `2`, and then `1`.

A real world use case for `defer` may be something like the following:
```odin
f, err := os.open("my_file.txt")
if err != os.ERROR_NONE {
	// handle error
}
defer os.close(f)
// rest of code
```
In this case, it acts akin to an explicit C++ destructor however, the error handling is basic control flow.

**Note:** The `defer` construct in Odin differs from Go's `defer`, which is function-exit and relies on a closure stack system.

### `when` statement
The `when` statement is almost identical to the `if` statement but with some differences:

* Each condition must be a constant expression as a `when` statement is evaluated at compile time.
* The statements within a branch do not create a new scope
* The compiler checks the semantics and code __only__ for statements that belong to the first condition that is `true`
* An initial statement is not allowed in a `when` statement
* `when` statements are allowed at file scope

Example:
```odin
when ODIN_ARCH == .i386 {
	fmt.println("32 bit")
} else when ODIN_ARCH == .amd64 {
	fmt.println("64 bit")
} else {
	fmt.println("Unsupported architecture")
}
```

The `when` statement is very useful for writing platform specific code. This is akin to the `#if` construct in C's preprocessor. However, in Odin, it is type checked.

### Branch statements
#### `break` statement
A for loop or a switch statement can be left prematurely with a `break` statement. It leaves the innermost construct, unless a label of a construct is given:
```odin
for cond {
	switch {
	case:
		if cond {
			break // break out of the `switch` statement
		}
	}

	break; // break out of the `for` statement
}

loop: for cond1 {
	for cond2 {
		break loop // leaves both loops
	}
}
```

#### `continue` statement
As in many programming languages, a `continue` statement starts the next iteration of a loop prematurely:
```odin
for cond {
	if get_foo() {
		continue
	}
	fmt.println("Hellope")
}
```

#### `fallthrough` statement
Odin's `switch` is like the one in C or C++, except that Odin only runs the selected case. This means that a `break` statement is not needed at the end of each case. Another important difference is that the case values need not be integers nor constants.

`fallthrough` can be used to explicitly fall through into the next case block:
```odin
switch i {
case 0:
	foo()
	fallthrough
case 1:
	bar()
}
```

## Procedures
In Odin, a procedure is something that can do work, which some languages call _functions_ or _methods_. A procedure literal in Odin is defined with the `proc` keyword:

```odin
fibonacci :: proc(n: int) -> int {
	switch {
	case n < 1:
		return 0
	case n == 1:
		return 1
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

fmt.println(fibonacci(3)) // 2
```

For more information regarding value declarations in general, please see the [Odin FAQ](/docs/faq).

### Parameters
Procedures can take zero or many parameters. The following example is a basic procedure that multiplies two integers together:
```odin
multiply :: proc(x: int, y: int) -> int {
	return x * y
}
fmt.println(multiply(137, 432))
```

When two or more consecutive parameters share a type, you can omit the other types from previous names, like with variable declarations. In this example: `x: int, y: int` can be shortened to `x, y: int`, for example:
```odin
multiply :: proc(x, y: int) -> int {
	return x * y
}
fmt.println(multiply(137, 432))
```

Continuing the C family tradition, everything in Odin is passed by value (rather than by reference, e.g. FORTRAN, Java, etc). However, Odin differs from the C/C++ tradition in that all procedure parameters in Odin are immutable values. This allows for numerous optimizations with the Odin [calling conventions](#calling-conventions) (`"odin"` and `"contextless"`) which would not be possible with the original C tradition of always passing a copy of the thing that has been passed.

Passing a pointer value makes a copy of the pointer, not the data it points to. Slices, dynamic arrays, and maps behave like pointers in this case (Internally they are structures that contain values, which include pointers, and the "structure" is passed by value).

To mutate the procedure parameter (like in C), an explicit copy is required. This can be done through shadowing the variable declaration:

```odin
foo :: proc(x: int) {
	x := x // explicit mutation
	for x > 0 {
		fmt.println(x)
		x -= 1
	}
}
```

Procedures can be variadic, taking a varying number of arguments:

```odin
sum :: proc(nums: ..int) -> (result: int) {
	for n in nums {
		result += n
	}
	return
}
fmt.println(sum())              // 0
fmt.println(sum(1, 2))          // 3
fmt.println(sum(1, 2, 3, 4, 5)) // 15

odds := []int{1, 3, 5}
fmt.println(sum(..odds))        // 9, passing a slice as varargs
```

### Multiple results
A procedure in Odin can return any number of results. For example:
```odin
swap :: proc(x, y: int) -> (int, int) {
	return y, x
}
a, b := swap(1, 2)
fmt.println(a, b) // 2 1
```

### Named results
Return values in Odin may be named. If so, they are treated as variables defined at the top of the procedure, like input parameters. A `return` statement without arguments returns the named return value. "Naked" return statements should only be used in short procedures as it reduces clarity when reading.

```odin
do_math :: proc(input: int) -> (x, y: int) {
	x = 2*input + 1
	y = 3*input / 5
	return x, y
}
do_math_with_naked_return :: proc(input: int) -> (x, y: int) {
	x = 2*input + 1
	y = 3*input / 5
	return
}
```

### Named arguments
When calling a procedure, it is not clear in which order parameters might appear. Therefore, the arguments can be named, like a struct literal, to make it clear which argument a parameter is for:
```odin
create_window :: proc(title: string, x, y: int, width, height: int, monitor: ^Monitor) -> (^Window, Window_Error) {...}

window, err := create_window(title="Hellope Title", monitor=nil, width=854, height=480, x=0, y=0)
```

As of the `dev-2023-07` release, mixing named and positional arguments is allowed. This is often useful when a procedure has a lot of arguments *or* you want to customize [default values](#default-values). 

***Positional*** arguments are not allowed after ***named*** arguments.

```odin
foo :: proc(value: int, name: string, x: bool, y: f32, z := 0) { }
foo(134, "hellope", x=true, y=4.5)
```

### Default values
The `create_window` procedure may be easier to use if default values are provided, which will be used if they are not specified:
```odin
create_window :: proc(title: string, x := 0, y := 0, width := 854, height := 480, monitor: ^Monitor = nil) -> (^Window, Window_Error) {...}

window1, err1 := create_window("Title1")
window2, err2 := create_window(title="Title1", width=640, height=360)
```

**Note:** These default values must be compile time known values, such as a constant value or `nil` (if the type supports it).

### Explicit procedure overloading
Unlike other languages, Odin provides the ability to explicitly overload procedures:
```odin
bool_to_string :: proc(b: bool) -> string {...}
int_to_string  :: proc(i: int)  -> string {...}

to_string :: proc{bool_to_string, int_to_string}
```

#### Rationale behind explicit overloading

The design goals of Odin were explicitness and simplicity. Implicit procedure overloading complicates the scoping system. In C++, you cannot nest procedures within procedures, so all procedure look-ups are done at the global scope. In Odin, procedures can be nested within procedures and, as a result, determining which procedure should be used, in the case of implicit overloading, is complex.

Explicit overloading has many advantages:

* Explicitness of what is overloaded
* Able to refer to the specific procedure if needed
* Clear which scope the entity name belongs to
* Ability to specialize parametric polymorphic procedures if necessary, which have the same parameter but different bounds (see [`where` clauses](#where-clauses))

```odin
foo :: proc{
	foo_bar,
	foo_baz,
	foo_baz2,
	another_thing_entirely,
}
```


## Basic types
Odin's basic types are:
```odin
bool b8 b16 b32 b64 // booleans

// integers
int  i8 i16 i32 i64 i128
uint u8 u16 u32 u64 u128 uintptr

// endian specific integers
i16le i32le i64le i128le u16le u32le u64le u128le // little endian
i16be i32be i64be i128be u16be u32be u64be u128be // big endian

f16 f32 f64 // floating point numbers

// endian specific floating point numbers
f16le f32le f64le // little endian
f16be f32be f64be // big endian

complex32 complex64 complex128 // complex numbers

quaternion64 quaternion128 quaternion256 // quaternion numbers

rune // signed 32 bit integer
	 // represents a Unicode code point
	 // is a distinct type to `i32`

// strings
string cstring

// raw pointer type
rawptr

// runtime type information specific type
typeid
any
```

The `int`, `uint`, and `uintptr` types are pointer sized. When you need an integer value, you should default to using `int` unless you have a specific reason to use a sized or unsigned integer type

**Note:** The Odin `string` type stores the pointer to the data and the length of the string. `cstring` is used to interface with foreign libraries written in/for C that use zero-terminated strings.

### Zero values
Variables declared without an explicit initial value are given their _zero_ value.

The zero value is:

* `0` for numeric and rune types
* `false` for boolean types
* `""` (the empty string) for strings
* `nil` for pointer, typeid, and any types.

The expression `{}` can be used for all types to act as a zero type. This is not recommended as it is not clear and if a type has a specific zero value shown above, please prefer that.


### Type conversion

The expression `T(v)` converts the value `v` to the type `T`.
```odin
i: int = 123
f: f64 = f64(i)
u: u32 = u32(f)
```
or with type inference:
```odin
i := 123
f := f64(i)
u := u32(f)
```

Unlike C, assignments between values of a different type require an explicit conversion.

#### Cast operator
The `cast` operator can also be used to do the same thing:
```odin
i := 123
f := cast(f64)i
u := cast(u32)f
```
This is useful is some contexts but has the same semantic meaning.

#### Transmute operator
The `transmute` operator is a bit cast conversion between two types of the same size:
```odin
f := f32(123)
u := transmute(u32)f
```

This is akin to doing the following pointer cast manipulations:
```odin
f := f32(123)
u := (^u32)(&f)^
```
However, `transmute` does not require taking the address of the value in question, which may not be possible for many expressions.

### Untyped types
In the Odin type system, certain expressions will have an "untyped" type. An untyped type can implicitly convert to a "typed" type.
```odin
I :: 42        // untyped integer, will implicitly convert to int, uint and its sized variants
S :: "Hellope" // untyped string,  will implicitly convert to string and cstring
B :: true      // untyped boolean, will implicitly convert to bool, b8, b16, etc.
```

### Auto cast operation
The `auto_cast` operator automatically casts an expression to the destination's type if possible:
```odin
x: f32 = 123
y: int = auto_cast x
```
**Note:** This operation is only recommended to be used for prototyping and quick tests. Please do not abuse it.

### Built-in constants, values, and procedures

There are a few built-in constants and values in Odin which have different uses:

```odin
false // untyped boolean constant equivalent to the expression 0!=0
true  // untyped boolean constant equivalent to the expression 0==0
nil   // untyped nil value used for certain values
---   // untyped undefined value used to explicitly not initialize a variable
```

`---` is useful if you want to explicitly not initialize a variable with any default value:
```odin
x: int // initialized with its zero value
y: int = --- // uses uninitialized memory
```
This is the default behaviour in C, whilst the default behaviour in Odin is to zero the memory.

#### Built-in procedures

For the full list of builtin-procedures, see the documentation for [package builtin](https://pkg.odin-lang.org/core/builtin/).

There are two kinds of built-in procedures in Odin:

* Compiler defined
* Core library defined

### `string` type
As previously mentioned the odin `string` type is just a `rawptr` + `len`.

The `core:strings` library was created to help dealing with string cloning, conversion of `string`<->`cstring` and other calls you find in standard libraries.

All procedures are [documented](https://pkg.odin-lang.org/core/strings/) and can be easily understood with code examples.

#### `string` iteration

Iterating a `string` can be done in two ways - by runes or by bytes.

```odin
// by runes
x := "ABC"
for codepoint, index in x {
	fmt.println(index, codepoint)
	// 0 A
	// 1 B
	// 2 C
}

// by bytes - string length is in bytes
for index in 0..<len(x) {
	fmt.println(index, x[index])
	// 0 A
	// 1 B
	// 2 C
}
```

Iteration through runes is preferred since odin strings are ***UTF8***. Most core library procedures will be addressed by `*_byte` if they do input/output an index in *byte*.

#### `string` format printing

The `core:fmt` library supports printing strings from byte arrays in structs, when additional tag information is supplied. 

```odin
Foo :: struct {
	a: [L]u8 `fmt:"s"`, // whole buffer is a string
	b: [N]u8 `fmt:"s,0"`, // 0 terminated string
	c: [M]u8 `fmt:"q,n"`, // string with length determined by n, and use %q rather than %s
	n: int `fmt:"-"`, // ignore this from formatting
}
```

### `cstring` type
The `cstring` type is a c-style string value, which is zero-terminated. It is equivalent to `char const *` in C. Its primary purpose is for easy interfacing with C. Please see the [foreign system](#foreign-system) for more information.

A `cstring` is easily convertible to an Odin `string`. However, to convert a `string` to a `cstring`, it requires allocations if the value is not constant.

```odin
str:  string  = "Hellope"
cstr: cstring = "Hellope" // constant literal
cstr2 := string(cstr)     // O(n) conversion as it requires search from the zero-terminator
nstr  := len(str)  // O(1)
ncstr := len(cstr) // O(n)
```

### `string` type conversions

Here is a short list of possible type conversions - including whether they *copy* or *alias*. This is important to understand since ***Odin*** gives you the possibility to keep *allocations* to a low degree.

If some cases are missing please let us know.

Legend:
* ***copy*** = get a freshly allocated copy of the 'from' data
* ***alias*** = reuse the 'from' data, without allocation
* ***stream*** = get individual values from the string, without allocation
* ***st*** = the input string 

#### From `string` to X
| To | Action | Code |
| --- | --- | --- | 
| `[]u8` | alias | `transmute([]u8)st` |
| `string` | copy | `strings.clone(st)` |
| `cstring` | copy | `strings.clone_to_cstring(st)` |
| `cstring` | alias | `strings.unsafe_string_to_cstring(st)` |
| `[]rune` | stream | `for rune in st { ... }` |
| `[]rune` | copy | `utf8.string_to_runes(st)` |
| `[^]u8` | alias | `raw_data(st)`  |

#### From `cstring` to X
| To | Action | Code |
| --- | --- | --- | 
| `string` | alias | `string(st)` |
| `[^]u8` | alias | `transmute([^]u8)st` |

#### From a ***string literal*** to X
| To | Action | Code |
| --- | --- | --- | 
| `string` | alias | `string(st)` or `newstr: string = st` |
| `cstring` | alias | `cstring(st)` or `newstr: cstring = st` |

#### From `[]u8` to X
| To | Action | Code |
| --- | --- | --- | 
| `string` | alias | `transmute(string)st` |
| `string` | alias | `string(st)` unless a slice literal |
| `[^]u8` | alias | `raw_data(st)` |

#### From `[]rune` to `string`
| Action | Code |
| --- | --- | 
| copy | `utf8.runes_to_string(st)` |

#### From `[^]u8` to `cstring`
| Action | Code |
| --- | --- | 
| alias | `cstring(st)` |

#### From `[^]u8` and length `int` to `string`
| Action | Code |
| --- | --- | 
| alias | `strings.string_from_ptr(ptr, length)` | 


## Operators


Operators combine operands into expressions. For binary operations, operand types must be identical or implicitly convertible unless the operation involves shifts or untyped constants.


### Arithmetic operators

Unary:

```txt
+                           is 0 + x
-    negation               is 0 - x
~    bitwise complement     is m ~ x where m = "all bits set to 1" for unsigned x
                                     and m = -1 for signed x
```

Binary:

```txt
+       sum                        integers, enums, floats, complex values, quaternions, arrays of numeric types, matrices, constant strings
-       subtraction                integers, enums, floats, complex values, quaternions, arrays of numeric types, matrices
*       multiplication             integers, floats, complex values, quaternions, arrays of numeric types, matrices
/       division                   integers, floats, complex values, quaternions, arrays of numeric types
%       modulo (truncated)         integers
%%      remainder (floored)        integers

|       bitwise or                 integers, enums
~       bitwise xor                integers, enums
&       bitwise and                integers, enums
&~      bitwise and-not            integers, enums
<<      left shift                 integer << integer >= 0
>>      right shift                integer >> integer >= 0
```

Except for shift operations, if one operand is an untyped constant and the other operand is not, the constant is implicitly converted to the type of the other operand (if possible).

The right operand in a shift expression must have an unsigned integer type or be an untyped constant representable by a typed unsigned integer. If the left operand of a non-constant shift expression is an untyped constant, it is first implicitly converted to the type it would assume if the shift expression were replaced solely by the left operand alone (with type inference and hinting rules applied).

### Comparison operators

```txt
==      equal
!=      not equal
<       less
<=      less or equal
>       greater
>=      greater or equal
&&      short-circuiting logical and
||      short-circuiting logical or
```

In any comparison, the first operand must be assignable to the type of the second, or vice versa.

The equality operators `==` and `!=` apply to operands that are _comparable_. The ordering operators `<`, `<=`, `>`, and `>=` apply to operands that are _ordered_. These terms and the result of the comparisons are defined as follows:

* Boolean values are comparable.
* Integers values are comparable and ordered.
* Floating-point values are comparable and ordered, defined by the IEEE-754 standard.
* Complex values are comparable.
* Quaternion values are comparable.
* Rune values are comparable and ordered.
* String values are comparable and ordered, lexically byte-wise.
* Matrix values are comparable.
* Pointer values are comparable and ordered.
* Multi-pointer values are comparable and ordered.
* Soa-pointer values are comparable.
* Enum values are comparable and ordered.
* Bit-set values are comparable.
* Struct values are comparable if all their fields are comparable.
* Union values are comparable if all their variants are comparable.
* Array and enumerated array values are comparable if values of the element type are comparable.
* `typeid` is comparable.
* Simd vectors are comparable.

Bit-set values use different logic compared to integers when comparison operators are used: please see the section of [bit sets](/docs/overview/#bit-sets)

### Logical operators

Logical operators apply to boolean values. The right operand is evaluated conditionally

```txt
&&      conditional AND    a && b  is "b if a else false"
||      conditional OR     a || b  is "true if a else b"
!       NOT                !a      is "not a"
```

### Address operator
For an operand `x` of type `T`, the address operation `&x` generates a pointer of `^T` to `x`. The operand must be _addressable_, meaning that either a variable, pointer indirection, or slice/dynamic array indexing operator; or a field selector of an addressable struct operand; or an array index operation of an addressable array; or a type assertion of an addressable union or `any`; or a compound literal value.

For an operand `x` of pointer type `^T`, the pointer indirection `x^` denotes the variable of type `T` pointed to by `x`. If `x` is an invalid address, such as `nil`, an attempt to evaluate `x^` will cause a runtime panic.

```odin
&x
&a[foo(123)]
&Foo{1, 2}

p^
pproc(a)^

x: ^int = nil
x^      // causes a runtime panic
```

### Ternary Operators

```odin
x if cond else y    // ternary runtime conditional expression
x when cond else y  // ternary compile-time conditional expression
cond ? x : y        // ternary runtime conditional expression, equivalent to "x if cond else y"
```

### Other operators

* `or_else`
	* see section on [`or_else`](/docs/overview/#or_else-expression)
* `or_return`
	* see section on [`or_return`](/docs/overview/#or_return-operator)
* `in` - set membership (`e in A`, `A` contains element `e`)
	* Used for `bit_set` types and `map` types
* `not_in` - not set membership (`e not_in A`, `A` does not contain `e`)
	* Used for `bit_set` types and `map` types
* `..=` - inclusive range
* `..<` - half open range

The range operations `..=` and `..<` are only possible within certain contexts:

```odin
for x in a..<b {}
for x in a..=b {}

switch x {
case a..<b:
case c..=d:
}

bit_set[a..<b]
bit_set[a..=b]
```

`in` and `not_in` are not allowed in within a for loop condition without ambiguity:
```odin
for x in y {}    // range loop
for (x in y) {}  // condition-only for-loop (while-loop in some other languages)
```

### Operator precedence

Unary operators have the highest precedence.

There are seven precedence levels for binary (and ternary) operators.

```txt
Precedence    Operator
     7           *   /   %   %%   &   &~  <<   >>
     6           +   -   |   ~    in  not_in
     5           ==  !=  <   >    <=  >=
     4           &&
     3           ||
     2           ..=    ..<
     1           or_else     ?    if  when

```

Binary operators of the same precedence associate from left to right. For instance `x / y * z` is the same as `(x / y) * z`.

### Integer operators

For two integers values `x` and `y`, the integer quotient `q = x/y` and remainder `r = x%y` satisfies the following relationships:
```txt
x = q*y + r   and |r| < |y|
```

with `x/y` truncated towards zero ([truncated division](https://wikipedia.org/wiki/Modulo_operation)).


For two integers values `x` and `y`, the integer quotient `q = x/y` and remainder `r = x%%y` satisfies the following relationships:
```txt
r = x - y*floor(x/y)
```

The exception to these rules are when the dividend `x` is the most non-negative value for the integer type of `x`, and the quotient `q = x/-1` is equal to `x` (and `r or m = 0`) due to two's complement integer overflow.

If the divisor is a constant, it must not be zero. If the divisor is zero at runtime, a runtime panic occurs.

The shift operators shift the left operand by the shift count specified by the right operand, which must be non-negative. The shift operators implement arithmetic shifts if the left operand is a signed integer and logical shifts if the left operand is an unsigned integer. There is not an upper limit on the shift count. Shifts behave as if the left operand is shifted `n` times by `1` for a shift count of `n`. Therefore, `x<<1` is the same as `x*2` and `x>>1` is the same as `x/2` but truncated towards negative infinity.

```odin
// These are equivalent:
x << y
x << y if y < 8*size_of(x) else 0

x >> y
x >> y if y < 8*size_of(x) else 0
```


### Integer overflow

For unsigned integers, the operations `+`, `-`, `*`, and `<<` are computed modulo 2<sup>n</sup>, where _n_ is the bit width of the unsigned integer's type. In a sense, these unsigned integer operations discard the high bits upon overflow, and programs may rely on "wrap around".

For signed integers, the operations `+`, `-`, `*`, `/`, and `<<` may legally overflow and the resulting value exists and is deterministically defined by the signed integer representation. Overflow __does not__ cause a runtime panic. A compiler may not optimize code under the assumption that overflow does not occur. For instance, `x < x+1` may not be assumed to be always true.

### Floating-point operators

For floating-point, complex numbers, quaternions, and other floating-point embedded types:

* `+x` is the same as `x`
* `-x` is the negation of `x`

The result of a floating-point related division by zero is not specified beyond the IEEE-754 standard; a runtime panic will occur.

An implementation may combine multiple floating-point operations into a single fused operation, and produce a result that differs from the value obtained by executing and rounding the instructions individually.

## Advanced types
### Type alias
You can alias a named type with another name:
```odin
My_Int :: int
#assert(My_Int == int)
```

### Distinct types
A distinct type allows for the creation of a new type with the same underlying semantics.
```odin
My_Int :: distinct int
#assert(My_Int != int)
```

Aggregate types (struct, enum, union) will always be distinct even when named.
```odin
Foo :: struct {}
#assert(Foo != struct{})
```


### Fixed arrays
An array is a simplified fixed length container. Each element in an array has the same type. An array's index can be any integer, character, or enumeration type.

An array can be constructed like the following:
```odin
x := [5]int{1, 2, 3, 4, 5}
for i in 0..=4 {
	fmt.println(x[i])
}
```
The notation `x[i]` is used to access the i-th element of `x`; and 0-index based (like C).

The above array can also be constructed with a question mark (`?`) to automatically infer its length:

```odin
x := [?]int{1, 2, 3, 4, 5}
```

The built-in [`len`](https://pkg.odin-lang.org/core/builtin/#len) proc returns the array's length.
```odin
x: [5]int
#assert(len(x) == 5)
```

Array access is always bounds checked (at compile-time and at runtime). This can be disabled and enabled at a per block level with the `#no_bounds_check` and `#bounds_check` directives, respectively:

```odin
#no_bounds_check {
	x[n] = 123 // n could be in or out of range of valid indices
}
```

`#no_bounds_check` can be used to improve performance when the bounds are known to not exceed.

#### Array programming
Odin's fixed length arrays support [array programming](https://en.wikipedia.org/wiki/Array_programming).

Example:
```odin
Vector3 :: [3]f32
a := Vector3{1, 4, 9}
b := Vector3{2, 4, 8}
c := a + b  // {3, 8, 17}
d := a * b  // {2, 16, 72}
e := c != d // true
```

**n.b.** Odin also supports [`matrix` types](/docs/overview/#matrix-type).

##### Swizzle Operations

```odin
a := [3]f32{10, 20, 30}
b := swizzle(a, 2, 1, 0)
assert(b == [3]f32{30, 20, 10})

c := swizzle(a, 0, 0)
assert(c == [2]f32{10, 10})
assert(c == 10) // assert all elements == 10
```
Builtin implicit swizzle fields are available on any array with length <= 4 as `xyzw` and `rgba`.
```odin
Vector3 :: distinct [3]f32
a := Vector3{1, 2, 3}
b := Vector3{5, 6, 7}
c := (a * b)/2 + 1
d := c.x + c.y + c.z
fmt.printf("%.1f\n", d) // 22.0

cross :: proc(a, b: Vector3) -> Vector3 {
	i := swizzle(a, 1, 2, 0) * swizzle(b, 2, 0, 1)
	j := swizzle(a, 2, 0, 1) * swizzle(b, 1, 2, 0)
	return i - j
}

cross_shorter :: proc(a, b: Vector3) -> Vector3 {
	i := a.yzx * b.zxy
	j := a.zxy * b.yzx
	return i - j
}

blah :: proc(a: Vector3) -> f32 {
	return a.x + a.y + a.z
}

x := cross(a, b)
fmt.println(x)
fmt.println(blah(x))
```

### Slices

Slices look similar to arrays however, their length is not known at compile time. The type `[]T` is a slice with elements of type `T`. In practice, slices are much more common than arrays.

A slice is formed by specifying two indices, a low and high bound, separated by a colon:
```odin
a[low : high]
```

This selects a half-open range which includes the lower element, but excludes the higher element.

```odin
fibonaccis := [6]int{0, 1, 1, 2, 3, 5}
s: []int = fibonaccis[1:4] // creates a slice which includes elements 1 through 3
fmt.println(s) // 1, 1, 2
```


Slices are like references to arrays; they do not store any data, rather they describe a section, or slice, of underlying data.

Internally, a slice stores a pointer to the data and an integer to store the length of the slice.

The built-in [`len`](https://pkg.odin-lang.org/core/builtin/#len) proc returns the array's length.
```odin
x: []int = ...
length_of_x := len(x)
```

#### Slice literals
A slice literal is like an array literal without the length.
This is an array literal:
```odin
[3]int{1, 6, 3}
```
This is a slice literal which creates the same array as above, and then creates a slice that references it:
```odin
[]int{1, 6, 3}
```

#### Slice shorthand
For the array:
```odin
a: [6]int
```
these slice expressions are equivalent:
```odin
a[0:6]
a[:6]
a[0:]
a[:]
```
When grabbing a chunk of a slice:
```odin
a[offset:offset+length]
```
can also be written:
```odin
a[offset:][:length]
```

#### Nil slices
The zero value of a slice is `nil`. A nil slice has a length of 0 and does not point to any underlying memory. Slices can be compared against `nil` and nothing else.
```odin
s: []int
if s == nil {
	fmt.println("s is nil!")
}
```

#### Sort slices
A slice literal can be sorted in ascending order as follows:
```odin
s := []int{1, 6, 3, 5 ,7, 3, 0}
slice.sort(s)
```
or in descending order
```odin
r := []int{1, 6, 3, 5 ,7, 3, 0}
slice.reverse_sort(r)
```


### Dynamic arrays
Dynamic arrays are similar to slices, but their lengths may change during runtime. Dynamic arrays are resizeable and they are allocated using the current [context](#implicit-context-system)'s allocator.

```odin
x: [dynamic]int
```

Along with the built-in proc [`len`](https://pkg.odin-lang.org/core/builtin/#len), dynamic arrays also have [`cap`](https://pkg.odin-lang.org/core/builtin/#cap) which can used to determine the dynamic array's current underlying capacity.

#### Appending to a dynamic array

It is common to append new elements to a dynamic array; this can be done using the built-in [`append`](http://pkg.odin-lang.org/core/builtin/#append) proc.
```odin
x: [dynamic]int
append(&x, 123)
append(&x, 4, 1, 74, 3) // append multiple values at once

y: [dynamic]int
append(&y, ..x[:]) // append a slice
```

#### Inject / Assign to a dynamic array

Injecting into a specific index can be done with `inject`. It will move other elements upwards when inserted below other elements.

Assign a type at a specific index can be done with `assign`. It's the same as doing `x[index] = 10`. 

Both of these procedures will resize the dynamic array `len` to the wanted index. This can be seen in the example below.

```odin
x := make([dynamic]int, 0, 16)
inject_at(&x, 0, 10)
inject_at(&x, 3, 10) // resizes till length
fmt.eprintln(x[:], len(x), cap(x)) // [10, 0, 0, 10] 4 16
assign_at(&x, 3, 20)
assign_at(&x, 4, 30)
fmt.eprintln(x[:], len(x), cap(x)) // [10, 0, 0, 20, 30] 5, 16
assign_at(&x, 5, 40, 50, 60)
fmt.eprintln(x[:], len(x), cap(x)) // [10, 0, 0, 20, 30, 40, 50, 60] 8 16
```

#### Removing from a dynamic array

Removing from a dynamic array can be done in several ways using the built-in procedures:

* [`pop`](https://pkg.odin-lang.org/core/builtin/#pop) pops the last element of the array
* [`unordered_remove`](https://pkg.odin-lang.org/core/builtin/#unordered_remove) removes an element at a specific index. *Unordered* means it is `O(1)`, since it swaps the last element to the removed location - making the array be *sorted* differently.
* [`ordered_remove`](https://pkg.odin-lang.org/core/builtin/#ordered_remove) removes an element at a specific index. *Ordered* means it will move all elements after the index downwards with a `copy` - ensuring elements remain in the same order.

```odin
x: [dynamic]int
append(&x, 1, 2, 3, 4, 5) // [1, 2, 3, 4, 5]
pop(&x) // [1, 2, 3, 4]
ordered_remove(&x, 0) // [2, 3, 4]
unordered_remove(&x, 0) // [4, 3]
```

Other variants can be found in the [built-in procedures](https://pkg.odin-lang.org/core/builtin) documentation.

#### Slice & Sort a dynamic array
Although dynamic arrays and slices are different concepts, dynamic arrays can be 'sliced'
and sorted as follows:
```odin
s: [dynamic]int
append(&s, 1, 6, 3, 5, 7, 3, 0) // [1, 6, 3, 5, 7, 3, 0]
slice.sort(s[:]) // [0, 1, 3, 3, 5, 6, 7]
```

#### Making and deleting slices and dynamic arrays
Slices and dynamic arrays can be explicitly allocated with the built-in [`make`](http://pkg.odin-lang.org/core/builtin/#make) proc.

```odin
a := make([]int, 6)           // len(a) == 6
b := make([dynamic]int, 6)    // len(b) == 6, cap(b) == 6
c := make([dynamic]int, 0, 6) // len(c) == 0, cap(c) == 6
d := []int{1, 2, 3}           // a slice literal, for comparison

// with an explicit allocator:
e := make([]int, 6, context.allocator)
f := make([dynamic]int, 0, 6, context.allocator)
```

Slices and dynamic arrays can be deleted with the built-in [`delete`](http://pkg.odin-lang.org/core/builtin/#delete) proc.

```odin
delete(a)
delete(b)
delete(c)
// delete(d)                  // no need to clean up slice literals
delete(e)                     // slices are always deleted from context.allocator
delete(f)                     // dynamic arrays remember their allocator
```

**Note:** There is no automatic memory management in Odin.

#### Clearing a dynamic array

Instead of deleting the array you often want to simply [clear](https://pkg.odin-lang.org/core/builtin/#clear) the dynamic array. This will set the length `len()` to be `0`, while the capacity `cap` remains the same.

```odin
x: [dynamic]int
append(&x, 1, 2, 3, 4, 5) // [1, 2, 3, 4, 5]
fmt.println(len(x)) // 5
clear(&x) // []
fmt.println(len(x)) // 0
```

#### Resize / Reserve with a dynamic array

Often enough we also want to resize or reserve a specific amount for a dynamic array. It's important to understand the difference between the two operations.

* [resize](https://pkg.odin-lang.org/core/builtin/#resize) will try to resize memory of a passed dynamic array to the requested element count (setting the `len`, and possibly `cap`).
* [reserve](https://pkg.odin-lang.org/core/builtin/#reserve) will try to reserve memory of a passed dynamic array to the requested element count (setting the `cap`).
* [shrink](https://pkg.odin-lang.org/core/builtin/#shrink) will shrink the capacity of a dynamic array down to the current length, or the given capacity.

```odin
x: [dynamic]int
fmt.println(len(x), cap(x)) // 0, 0
append(&x, 1, 2, 3) // [1, 2, 3]
fmt.println(len(x), cap(x)) // 3, 8
resize(&x, 5) 
fmt.println(x[:]) // [1, 2, 3, 0, 0] other values are zero'd memory
fmt.println(len(x), cap(x)) // 5, 8
reserve(&x, 32)
fmt.println(len(x), cap(x)) // 5, 32
shrink(&x)
fmt.println(len(x), cap(x)) // 5, 5
```

#### `Small_Array(N, T)` container dynamic array

The `core` library also contains a container dynamic array [Small_Array(N, T)](https://github.com/odin-lang/Odin/blob/master/core/container/small_array/small_array.odin). It implements most dynamic array procedures while being able to remain on the stack.

Short Example:
```odin
import sa "core:container/small_array"

x: sa.Small_Array(8, int)
fmt.println(sa.len(x), sa.cap(x)) // 0, 8
sa.append(&x, 1, 2, 3) 
fmt.println(sa.len(x), sa.cap(x)) // 3, 8
fmt.println(sa.slice(&x)) // [1, 2, 3]
```

### Enumerations
Enumeration types define a new type whose values consist of the ones specified. The values are ordered, for example:
```odin
Direction :: enum{North, East, South, West}
```
The following holds:
```odin
int(Direction.North) == 0
int(Direction.East)  == 1
int(Direction.South) == 2
int(Direction.West)  == 3
```
Enum fields can be assigned an explicit value:
```odin
Foo :: enum {
	A,
	B = 4, // Holes are valid
	C = 7,
	D = 1337,
}
```

If an enumeration requires a specific size, a backing integer type can be specified. By default, `int` is used as the backing type for an enumeration.
```odin
Foo :: enum u8 {A, B, C} // Foo will only be 8 bits
```

#### Implicit Selector Expression

An *implicit selector expression* is an abbreviated way to access a member of an enumeration, in a context where type inference can determine the implied type. It has the following form:

```odin
.member_name
```
For example:
```odin
Foo :: enum{A, B, C}
f: Foo
f = Foo.A
f = .A

switch f {
case .A:
	fmt.println("foo")
case .B:
	fmt.println("bar")
case .C:
	fmt.println("baz")
}
```

[`using`](#using-statement) can also be used with an enumeration to bring the fields into the current scope:
```odin
main :: proc() {
	Foo :: enum {A, B, C}
	using Foo
	a := A

	using Bar :: enum {X, Y, Z}
	x := X
}
```

**Note:** Implicit selector expression is preferred to [`using`](#using-statement) an enumeration as `using` does pollute the current scope.

#### Iterating an Enumeration

Enums can be trivially `for` looped in odin. This way we can loop through the entire `enum` and do things like printing or inserting into an *Enumerated Array*.

```odin
Direction :: enum{North, East, South, West}

for direction, index in Direction {
	fmt.println(index, direction) 
	// 0 North
	// 1 East
	// 2 South
	// 3 West
}
```

### Enumerated Array

`Enumerated Arrays` allow the use of an `Enum` to be used as indices to a fixed `array`. 

We'll extend the `Direction` enum used previously to add direction vectors.

```odin
Direction :: enum{North, East, South, West}

Direction_Vectors :: [Direction][2]int {
	.North = {  0, -1 },
	.East = { +1,  0 },
	.South = {  0, +1 },
	.West = { -1,  0 },
}

assert(Direction_Vectors[.North] == { 0, -1 })
assert(Direction_Vectors[.East] == { 1, 0 })
assert(Direction_Vectors[cast(Direction) 2] == { 0, 1 })
```

The `#partial` directive can be used to initialize an enumerated array *partially*.

```odin
arr: [enum {A, B, C}]int
arr = #partial { // without partial the compiler would complain
	.A = 42,
}
fmt.println(arr) // [.A = 42, .B = 0, .C = 0]
```

### Bit sets
The `bit_set` type models the mathematical notion of a set. A bit_set's element type can be either an enumeration or a range:
```odin
Direction :: enum{North, East, South, West}

Direction_Set :: bit_set[Direction]

Char_Set :: bit_set['A'..='Z']

Number_Set :: bit_set[0..<10] // bit_set[0..=9]
```

Bit sets are implemented as bit vectors internally for high performance. The zero value of a bit set is either `nil` or `{}`.

```odin
x: Char_Set
x = {'A', 'B', 'Y'}
y: Direction_Set
y = {.North, .West}
```

Bit sets support the following operations:

* `A + B` - union of two sets (equivalent to `A | B`)
* `A - B` - difference of two sets (A without B's elements) (equivalent to `A &~ B`)
* `A & B` - intersection of two sets
* `A | B` - union of two sets (equivalent to `A + B`)
* `A &~ B` - difference of two sets (A without B's elements)  (equivalent to `A - B`)
* `A ~ B` - symmetric difference (Elements that are in A and B but not both)
* `A == B` - set equality
* `A != B` - set inequality
* `A <= B` - subset relation (A is a subset of B or equal to B)
* `A < B` - strict subset relation (A is a proper subset of B)
* `A >= B` - superset relation (A is a superset of B or equal to B)
* `A > B` - strict superset relation (A is a proper superset of B)
* `e in A` - set membership (A contains element e)
* `e not_in A` - A does not contain element e
* `incl(&A, elem)` - same as `A += {elem}`
* `excl(&A, elem)` - same as `A -= {elem}`


Bit sets are often used to denote flags. This is much cleaner than defining integer constants that need to be bitwise or-ed together.

If a bit set requires a specific size, the underlying integer type can be specified:
```odin
Char_Set :: bit_set['A'..'Z'; u64];
#assert(size_of(Char_Set) == size_of(u64))
```

To get the number of elements set, its cardinality, of a bit_set, use the built-in card procedure:
```odin
x: Direction_Set
x = {.North, .West}
count := card(x)
assert(count == 2)
```


### Pointers
Odin has pointers. A pointer is a memory address of a value. The type `^T` is a pointer to a `T` value. Its zero value is `nil`.
```odin
p: ^int
```
The `&` operator takes the address of its operand (if possible):
```odin
i := 123;
p := &i;
```

The `^` operator dereferences the pointer's underlying value:
```odin
fmt.println(p^) // read  i through the pointer p
p^ = 1337;       // write i through the pointer p
```

**Note:** C programmers may be used to using `*` to denote pointers. In Odin, the `^` syntax is borrowed from Pascal. This is to keep the convention of the type on the left and its usage on the right:
```odin
p: ^int // ^ on the left
x := p^; // ^ on the right
```

**Note:** Unlike C, Odin has no pointer arithmetic. If you need a form of pointer arithmetic, please use the `ptr_offset` and `ptr_sub` procedures in the `"core:mem"` package.

### Structs
A `struct` is a record type in Odin. It is a collection of fields. Struct fields are accessed by using a dot:
```odin
Vector2 :: struct {
	x: f32,
	y: f32,
}
v := Vector2{1, 2}
v.x = 4
fmt.println(v.x)
```

Struct fields can be accessed through a struct pointer:
```odin
v := Vector2{1, 2}
p := &v
p.x = 1335
fmt.println(v)
```

We could write `p^.x`, however, it is to nice abstract the ability to not explicitly dereference the pointer. This is very useful when refactoring code to use a pointer rather than a value, and vice versa.

#### Struct literals
A struct literal can be denoted by providing the struct's type followed by `{}`. A struct literal must either provide all the arguments or none:
```odin
Vector3 :: struct {
	x, y, z: f32,
}
v: Vector3
v = Vector3{} // Zero value
v = Vector3{1, 4, 9}
```
You can list just a subset of the fields if you specify the field by name (the order of the named fields does not matter):
```odin
v := Vector3{z=1, y=2}
assert(v.x == 0)
assert(v.y == 2)
assert(v.z == 1)
```

#### Struct tags
Structs can be tagged with different memory layout and alignment requirements:
```odin
struct #align 4 {...} // align to 4 bytes
struct #packed {...} // remove padding between fields
struct #raw_union {...} // all fields share the same offset (0). This is the same as C's union
```

### Unions
A `union` in Odin is a discriminated union, also known as a tagged union or sum type. The zero value of a union is `nil`.
```odin
Value :: union {
	bool,
	i32,
	f32,
	string,
}
v: Value
v = "Hellope"

// type assert that `v` is a `string` and panic otherwise
s1 := v.(string)

// type assert but with an explicit boolean check. This will not panic
s2, ok := v.(string)
```

#### Type switch statement
A type switch is a construct that allows several type assertions in series. A type switch is like a regular switch statement, but the cases are types (not values). For a union, the only case types allowed are that of the union.
```odin
value: Value = ...
switch v in value {
case string:
	#assert(type_of(v) == string)

case bool:
	#assert(type_of(v) == bool)

case i32, f32:
	// This case allows for multiple types, therefore we cannot know which type to use
	// `v` remains the original union value.
	#assert(type_of(v) == Value)
case:
	// Default case
	// In this case, it is `nil`
}
```

#### Union tags

The `#no_nil` tag can be applied to the union type to state that it does not have a `nil` value, and the first variant is its default type:

```odin
Value :: union #no_nil {bool, string}
v: Value
_, ok := v.(bool)
assert(ok)
```

This is useful in very limited cases, and if it is added, there must be at least two variants.

Unions also have the `#align` tag, like structures:

```odin
union #align 4 {...} // align to 4 bytes
```

### Maps
A `map` maps keys to values. The zero value of a map is `nil`. A `nil` map has no keys. The built-in [`make`](http://pkg.odin-lang.org/core/builtin/#make) proc returns an initialized map using the current [context](#implicit-context-system), and [`delete`](http://pkg.odin-lang.org/core/builtin/#delete) can be used to delete a map.

```odin
m := make(map[string]int)
defer delete(m)
m["Bob"] = 2
fmt.println(m["Bob"])
```

To insert or update an element of a map:
```odin
m[key] = elem
```
To retrieve an element:
```odin
elem = m[key]
```

To remove an element:
```odin
delete_key(&m, key)
```

If an element of a key does not exist, the zero value of the element will be returned. Checking to see if an element exists can be done in two ways:
```odin
elem, ok := m[key] // `ok` is true if the element for that key exists
```
or
```odin
ok := key in m // `ok` is true if the element for that key exists
```

The first approach is called the "comma ok idiom".

You can also initialize maps with map literals:
```odin
m := map[string]int{
	"Bob" = 2,
	"Chloe" = 5,
}
```

Modifying existing map slots needs to be done in two steps. Hovewer assigning to a struct field is prohibited.

```odin
Test :: struct {
	x: int,
	y: int,
}

m := map[string]Test{
	"Bob" = { 0, 0 },
	"Chloe" = { 1, 1 },
}

value, ok := &m["Bob"]
if ok {
	value^ = { 2, 2 }
}

fmt.println(m["Bob"]) // { 2, 2 }
m["Bob"] = { 3, 3 }
fmt.println(m["Bob"]) // { 3, 3 }
m["Chloe"].x = 0 // PROHIBITED
```

#### Map Container Calls

The built-in map also supports all the standard container calls that can be found with the [dynamic array](#dynamic-arrays). 

Short:
* `len(some_map)` returns the amount of slots used up
* `cap(some_map)` returns the capacity of the map - the map will reallocate when exceeded
* `clear(&some_map)` clears the entire map - dynamically allocated content needs to be freed manually
* `reserve(&some_map, capacity)` reserves the requested element count
* `shrink(&some_map)` shrink the capacity down to the current length

### Procedure type
A procedure type is internally a pointer to a procedure in memory. `nil` is the zero value a procedure type.

Examples:
```odin
proc(x: int) -> bool
proc(c: proc(x: int) -> bool) -> (i32, f32)
```

Or you can assign them to a variable:
```odin
Callback :: proc() -> int 
a: Callback // nil 
assert(a == nil)
a = proc() -> int { return 0 }
fmt.println(a()) // 0
a = proc() -> int { return 100 }
fmt.println(a()) // 100
```

#### Calling conventions
Odin supports the following calling conventions:

* **odin** - default convention used for an Odin **proc**. It is the same as **cdecl** but passes an implicit `context` pointer on each call. (**Note:** This is subject to change)
* **contextless** - This is the same as **odin** but without the implicit `context` pointer.
* **stdcall** or **std** -- This is the stdcall convention as specified by Microsoft.
* **cdecl** or **c** -- This is the default calling convention generated of a procedure in C.
* **fastcall** or **fast** - This is a compiler dependent calling convention.
* **none** - This is a compiler dependent calling convention which will do nothing to parameters.

Most calling conventions exist only to interface with foreign Windows code.

The default calling convention is **odin**, unless it is within a `foreign` block, where it is then **cdecl**.

A procedure type with a different calling convention can be declared like the following:
```odin
proc "c" (n: i32, data: rawptr)
proc "contextless" (s: []int)
```

Procedure types are only compatible with the procedures that have the same calling convention and parameter types.

When binding to C libraries you'll often end up using `proc "c"` and also set the current context. For this you'll need to [explicity set the context](#explicit-context-definition).

### 'typeid' type
A `typeid` is a unique identifier for an Odin type. This construct is used by the `any` type to denote what the underlying data's type is.
```odin
a := typeid_of(bool)
i: int = 123
b := typeid_of(type_of(i))
```

A `typeid` can be mapped to relevant type information which can be used in applications such as printing types and editing data:
```odin
import "core:runtime"

main :: proc() {
	u := u8(123)
	id := typeid_of(type_of(u))
	info: ^runtime.Type_Info
	info = type_info_of(id)
}
```


### 'any' Type
An `any` type can reference any data type. Internally it contains a pointer to the underlying data and its relevant `typeid`. This is a very useful construct in order to have a runtime type safe printing procedure.

**Note:** The `any` value is only valid for as long as the underlying data is still valid. Passing a literal to an `any` will allocate the literal in the current stack frame.

**Note:** It is highly recommended that you **do not** use this unless you know what you are doing. Its primary use is for printing procedures.

### Multi Pointers

Multi-Pointers in Odin are a way to describe [`foreign`](#foreign-system) (C-like) pointers which act like arrays (pointers that map to multiple items). The type `[^]T` is a multi-pointer to T value(s). Its zero value is `nil`.

```odin
p: [^]int
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

Interacting with Multi-Pointers is easiest using the builtin `raw_data()` call which can return a Multi-Pointer.
```odin
a: [^]int
fmt.println(a) // <nil>
b := [?]int { 10, 20, 30 }
a = raw_data(b[:]) 
fmt.println(a, a[1], b) // 0x7FFCBE9FE688 20 [10, 20, 30]
``` 

**Note:** The name of mutli-pointers may be subject to change.

### SOA Data Types

_Array of Structures (AoS)_, _Structure of Arrays (SoA)_, and _Array of Structures of Arrays (AoSoA)_ refer to differing ways to arrange a sequence of data records in memory, with regard to interleaving. These are of interest in SIMD and SIMT programming.

#### SOA Struct Arrays

```odin
Vector3 :: struct {x, y, z: f32}

N :: 2
v_aos: [N]Vector3
v_aos[0].x = 1
v_aos[0].y = 4
v_aos[0].z = 9

fmt.println(len(v_aos))
fmt.println(v_aos[0])
fmt.println(v_aos[0].x)
fmt.println(&v_aos[0].x)

v_aos[1] = {0, 3, 4}
v_aos[1].x = 2
fmt.println(v_aos[1])
fmt.println(v_aos)

v_soa: #soa[N]Vector3

v_soa[0].x = 1
v_soa[0].y = 4
v_soa[0].z = 9


// Same syntax as AOS and treat as if it was an array
fmt.println(len(v_soa))
fmt.println(v_soa[0])
fmt.println(v_soa[0].x)
fmt.println(&v_soa[0].x)
v_soa[1] = {0, 3, 4}
v_soa[1].x = 2
fmt.println(v_soa[1])

// Can use SOA syntax if necessary
v_soa.x[0] = 1
v_soa.y[0] = 4
v_soa.z[0] = 9
fmt.println(v_soa.x[0])

// Same pointer addresses with both syntaxes
assert(&v_soa[0].x == &v_soa.x[0])


// Same fmt printing
fmt.println(v_aos)
fmt.println(v_soa)
```

Works with arrays of length <= 4 which have the implicit fields xyzw/rgba

```odin
Vector3 :: distinct [3]f32

N :: 2
v_aos: [N]Vector3
v_aos[0].x = 1
v_aos[0].y = 4
v_aos[0].z = 9

v_soa: #soa[N]Vector3

v_soa[0].x = 1
v_soa[0].y = 4
v_soa[0].z = 9
```

#### SOA Struct Slices and Dynamic Arrays

Fixed-length SOA types can be sliced to produce SOA slices.

```odin
Vector3 :: struct {x: i8, y: i16, z: f32};

N :: 3
v: #soa[N]Vector3
v[0].x = 1
v[0].y = 4
v[0].z = 9

s: #soa[]Vector3
s = v[:]
assert(len(s) == N)
fmt.println(s)
fmt.println(s[0].x)

a := s[1:2]
assert(len(a) == 1)
fmt.println(a)
```

To be complete with SOA slices, Odin also supports SOA dynamic arrays.

```odin
d: #soa[dynamic]Vector3;

append_soa(&d, Vector3{1, 2, 3}, Vector3{4, 5, 9}, Vector3{-4, -4, 3})
fmt.println(d)
fmt.println(len(d))
fmt.println(cap(d))
fmt.println(d[:])
```

#### `soa_zip` and `soa_unzip`

SOA is not just useful for high performance scenarios but also for everyday tasks which are normally only achieveable in higher level languages. [`soa_zip`](http://pkg.odin-lang.org/core/builtin/#soa_zip) is a built-in procedure which allows the user to treat multiple slices as if they are part of the same data structures, utilizing the power of SOA.

```odin
x := []i32{1, 3, 9}
y := []f32{2, 4, 16}
z := []b32{true, false, true}

// produce an #soa slice with the normal slices passed
s := soa_zip(a=x, b=y, c=z)

// iterate over the #soa slice
for v, i in s {
	fmt.println(v, i) // exactly the same as s[i]
	// NOTE: 'v' is NOT a temporary value but has a specialized addressing mode
	// which means that when accessing v.a etc, it does the correct transformation
	// internally:
	//         s[i].a === s.a[i]
	fmt.println(v.a, v.b, v.c)
}
```

[`soa_unzip`](http://pkg.odin-lang.org/core/builtin/#soa_unzip) is a built-in procedure which allows the user to recover the slices from an `#soa` slice.

```odin
// Recover the slices from the #soa slice
a, b, c := soa_unzip(s)
fmt.println(a, b, c)
```

### `matrix` type

A `matrix` is a [mathematical type](https://wikipedia.org/wiki/Matrix_(mathematics)) built into Odin. It is a regular array of numbers, arranged in rows and columns.

The following represents a matrix that has 2 rows and 3 columns:
```odin
m: matrix[2, 3]f32

m = matrix[2, 3]f32{
	1, 9, -13,
	20, 5, -6,
}
```

Element types of integers, float, and complex numbers are supported by matrices. There is no support for booleans, quaternions, or any compound type.
		
Indexing a matrix can be used with the matrix indexing syntax. This mirrors othe type usages: type on the left, usage on the right.
		
```odin
elem := m[1, 2] // row 1, column 2
```

Scalars act as if they are scaled identity matrices and can be assigned to matrices as them

```odin
b := matrix[2, 2]f32{}
f := f32(3)
b = f

fmt.println("b", b)
fmt.println("b == f", b == f)
```

Matrices support multiplication between matrices:
```odin
a := matrix[2, 3]f32{
	2, 3, 1,
	4, 5, 0,
}

b := matrix[3, 2]f32{
	1, 2,
	3, 4,
	5, 6,
}

fmt.println("a", a)
fmt.println("b", b)

c := a * b
#assert(type_of(c) == matrix[2, 2]f32)
fmt.tprintln("c = a * b", c)		
```

Matrices support multiplication between matrices and arrays:
```odin
m := matrix[4, 4]f32{
	1, 2, 3, 4, 
	5, 5, 4, 2, 
	0, 1, 3, 0, 
	0, 1, 4, 1,
}

v := [4]f32{1, 5, 4, 3}

// treating 'v' as a column vector
fmt.println("m * v", m * v)

// treating 'v' as a row vector
fmt.println("v * m", v * m)

// Support with non-square matrices
s := matrix[2, 4]f32{ // [4][2]f32
	2, 4, 3, 1, 
	7, 8, 6, 5, 
}

w := [2]f32{1, 2}
r: [4]f32 = w * s
fmt.println("r", r)
```

Component-wise operations:
```odin
// if the element type supports it
// Not support for '/', '%', or '%%' operations

a := matrix[2, 2]i32{
	1, 2,
	3, 4,
}

b := matrix[2, 2]i32{
	-5,  1,
	 9, -7,
}

c0 := a + b
c1 := a - b
c2 := a & b
c3 := a | b
c4 := a ~ b
c5 := a &~ b

// component-wise multiplication
// since a * b would be a standard matrix multiplication
c6 := hadamard_product(a, b) 

fmt.println("a + b",  c0)
fmt.println("a - b",  c1)
fmt.println("a & b",  c2)
fmt.println("a | b",  c3)
fmt.println("a ~ b",  c4)
fmt.println("a &~ b", c5)
fmt.println("hadamard_product(a, b)", c6)
```

#### Submatrix Casting
##### Submatrix casting square matrices
Casting a square matrix to another square matrix with same element type is supported. 

* If the cast is to a smaller matrix type, the top-left submatrix is taken.
* If the cast is to a larger matrix type, the matrix is extended with zeros everywhere and ones in the diagonal for the unfilled elements of the extended matrix.

```odin
mat2 :: distinct matrix[2, 2]f32
mat4 :: distinct matrix[4, 4]f32

m2 := mat2{
	1, 3,
	2, 4,
}

m4 := mat4(m2)
assert(m4[2, 2] == 1)
assert(m4[3, 3] == 1)
fmt.printf("m2 %#v\n", m2)
fmt.println("m4", m4)
fmt.println("mat2(m4)", mat2(m4))
assert(mat2(m4) == m2)

b4 := mat4{
	1, 2, 0, 0,
	3, 4, 0, 0,
	5, 0, 6, 0,
	0, 7, 0, 8,
}
fmt.println("b4", matrix_flatten(b4))
```
##### Casting non-square matrices

Casting a matrix to another matrix is allowed as long as they share the same element type and the number of elements (rows\*columns). Matrices in Odin are stored in column-major order, which means the casts will preserve this element order.

```odin
mat2x4 :: distinct matrix[2, 4]f32
mat4x2 :: distinct matrix[4, 2]f32

x := mat2x4{
	1, 3, 5, 7, 
	2, 4, 6, 8,
}

y := mat4x2(x)
fmt.println("x", x)
fmt.println("y", y)
```

#### Technical Information of `matrix` Types

The internal representation of a matrix in Odin is stored in column-major format
e.g. `matrix[2, 3]f32` is internally `[3][2]f32` (with a different alignment requirement).

Column-major is used in order to utilize (SIMD) vector instructions effectively on modern hardware, if possible.

Unlike normal arrays, matrices try to maximize alignment to allow for the (SIMD) vectorization properties whilst keeping zero padding (either between columns or at the end of the type).

Zero padding is a compromise for use with third-party libraries, instead of optimizing for performance. Padding between columns was not taken even if that would have allowed each column to be loaded individually into a SIMD register with the correct alignment properties. 

Currently, matrices are limited to a maximum of 16 elements (rows\*columns), and a minimum of 1 element. This is because matrices are stored as values (not a reference type), and thus operations on them will be stored on the stack. Restricting the maximum element count minimizes the possibility of stack overflows.

Built-in Procedures (Compiler Level):

* `transpose(m)`
	transposes a matrix
* `outer_product(a, b)`
	takes two array-like data types and returns the outer product
	of the values in a matrix
* `hadamard_product(a, b)`
	component-wise multiplication of two matrices of the same type
* `matrix_flatten(m)`
	* converts the matrix into a flatten array of elements in column-major order.
* `conj(x)`
	* conjugates the elements of a matrix for complex element types only

Built-in Procedures (Runtime Level) (all square matrix procedures):

* `determinant(m)`
* `adjugate(m)`
* `inverse(m)`
* `inverse_transpose(m)`
* `hermitian_adjoint(m)`
* `matrix_trace(m)`
* `matrix_minor(m)`

## `raw_data` procedure

[raw_data](https://pkg.odin-lang.org/core/builtin/#raw_data) is a built-in procedure which returns the underlying data of a built-in data type as a [Multi-Pointer](#multi-pointers).

```odin
raw_data([]$E)         -> [^]E    // slices
raw_data([dynamic]$E)  -> [^]E    // dynamic arrays
raw_data(^[$N]$E)      -> [^]E    // fixed array and enumerated arrays 
raw_data(^#simd[$N]$E) -> [^]E    // simd vectors 
raw_data(string)       -> [^]byte // 	
```

## `using` statement
`using` can be used to bring entities declared in a scope/namespace into the current scope. This can be applied to import names, struct fields, procedure fields, and struct values.

```odin
import "foo"
bar :: proc() {
	// imports all the exported entities from the `foo` package into this scope
	using foo
}
```

### Using statement with structs
Let's take a very simple entity struct:
```odin
Vector3 :: struct{x, y, z: f32}
Entity :: struct {
	position: Vector3,
	orientation: quaternion128,
}
```
It can be used like this:
```odin
foo :: proc(entity: ^Entity) {
	fmt.println(entity.position.x, entity.position.y, entity.position.z)
}
```

The entity members can be brought into the procedure scope by `using` it:
```odin
foo :: proc(entity: ^Entity) {
	using entity
	fmt.println(position.x, position.y, position.z)
}
```
The `using` can be applied to the parameter directly:
```odin
foo :: proc(using entity: ^Entity) {
	fmt.println(position.x, position.y, position.z)
}
```
It can also be applied to sub-fields:
```odin
foo :: proc(entity: ^Entity) {
	using entity.position
	fmt.println(x, y, z)
}
```

We can also apply the `using` statement to the struct fields directly, making all the fields of `position` appear as if they are on `Entity` itself:
```odin
Entity :: struct {
	using position: Vector3,
	orientation: quaternion128,
}
foo :: proc(entity: ^Entity) {
	fmt.println(entity.x, entity.y, entity.z)
}
```

### Subtype polymorphism
It is possible to get subtype polymorphism, similar to inheritance-like functionality in C++, but without the requirement of vtables or unknown struct layout:
```odin
foo :: proc(entity: Entity) {
	fmt.println(entity.x, entity.y, entity.z)
}

Frog :: struct {
	ribbit_volume: f32,
	using entity: Entity,
}

frog: Frog
// Both work
frog.x = 123
foo(frog)
```

**Note:** `using` can be applied to arbitrarily many things, which allows the ability to have multiple subtype polymorphism (but also its issues).

**Note:** `using`'d fields can still be referred by name.

## `or_else` expression

`or_else` is an infix binary operator that allows the user to define default values for certain expressions with optional-ok semantics.

```odin
m: map[string]int
i: int
ok: bool

if i, ok = m["hellope"]; !ok {
	i = 123
}
// The above can be mapped to 'or_else'
i = m["hellope"] or_else 123

assert(i == 123)
```

`or_else` can be used with type assertions too, as they have optional-ok semantics.

```odin
v: union{int, f64}
i: int
i = v.(int) or_else 123
i = v.? or_else 123 // Type inference magic
assert(i == 123)

m: Maybe(int)
i = m.? or_else 456
assert(i == 456)
```

## `or_return` operator

The concept of `or_return` will work by popping off the end value in a multiple valued expression and checking whether it was not `nil` or `false`, and if so, set the end return value to value if possible. If the procedure only has one return value, it will do a simple return. If the procedure had multiple return values, `or_return` will require that all parameters be named so that the end value could be assigned to by name and then an empty return could be called. 

```odin
Error :: enum {
	None,
	Something_Bad,
	Something_Worse,
	The_Worst,
	Your_Mum,
};

caller_1 :: proc() -> Error {
	return .None
}

caller_2 :: proc() -> (int, Error) {
	return 123, .None
}
caller_3 :: proc() -> (int, int, Error) {
	return 123, 345, .None
}

foo_1 :: proc() -> Error {
	// This can be a common idiom in many code bases
	n0, err := caller_2()
	if err != nil {
		return err
	}

	// The above idiom can be transformed into the following
	n1 := caller_2() or_return


	// And if the expression is 1-valued, it can be used like this
	caller_1() or_return
	// which is functionally equivalent to
	if err1 := caller_1(); err1 != nil {
		return err1
	}

	// Multiple return values still work with 'or_return' as it only
	// pops off the end value in the multi-valued expression
	n0, n1 = caller_3() or_return

	return .None
}
foo_2 :: proc() -> (n: int, err: Error) {
	// It is more common that your procedure returns multiple values
	// If 'or_return' is used within a procedure that returns multiple 
	// values (2+), then all the returned values must be named 
	// so that a bare 'return' statement can be used

	// This can be a common idiom in many code bases
	x: int
	x, err = caller_2()
	if err != nil {
		return
	}

	// The above idiom can be transformed into the following
	y := caller_2() or_return
	_ = y

	// And if the expression is 1-valued, it can be used like this
	caller_1() or_return

	// which is functionally equivalent to
	if err1 := caller_1(); err1 != nil {
		err = err1
		return
	}

	// If using a non-bare 'return' statement is required, setting the return values
	// using the normal idiom is a better choice and clearer to read.
	if z, zerr := caller_2(); zerr != nil {
		return -345 * z, zerr
	}

	// If the other return values need to be set depending on what the end value is,
	// the 'defer if' idiom is can be used
	defer if err != nil {
		n = -1
	}

	n = 123
	return
}
```

## Conditional compilation

A couple of ways are provided for doing this, and each of them have their uses.

### File suffixes

Often, you want to separate multiple implementations of a package based on the OS or the architecture.

Your .odin files can have a magic suffix that will cause the compiler to either include or exclude them based on the target platform or architecture, or both.

For example, `foobar_windows.odin` would only be compiled on Windows, `foobar_linux.odin` only on Linux, and `foobar_windows_amd64.odin` only on Windows AMD64.

### `when` statements

Sometimes you only want to include a small number of statements or declarations for compilation, if a certain compile-time expression evaluates
to `true`.
This expression can be any compile-time-known expression which results in a value of type `bool`.

The compiler provides a set of builtin constants which are available in all files in a compilation, and which can be used in a `when` condition.
Here is a comprehensive list of them:

| Name                                | Description                                                                                                                                                                             |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ODIN_VERSION`                      | A string that represents the Odin compiler version being used. (e.g: `dev-2023-04`)                                                                                                     |
| `ODIN_OS`,     `ODIN_OS_STRING`     | An enum value, or string, respectively, indicating what the target operating system is.                                                                                                 |
| `ODIN_ENDIAN`, `ODIN_ENDIAN_STRING` | An enum value, or string, respectively, indicating what the endianness of the target is.                                                                                                |
| `ODIN_ARCH`,   `ODIN_ARCH_STRING`   | An enum value, or string, respectively, indicating what the CPU architecture of the target is.                                                                                          |
| `ODIN_DEBUG`                        | `true` if `-debug` command line switch is passed, which enables debug info generation.                                                                                                  |
| `ODIN_DISABLE_ASSERT`               | `true` if `-disable-assert` command line switch is passed, which removes all calls to `assert` from the compilation.                                                                    |
| `ODIN_BUILD_MODE`                   | An enum value indicating what type of compiled output the user desires. (`.Executable`, `.Dynamic`, `.Object`, `.Assembly`, or `.LLVM_IR`.)                                             |
| `ODIN_ERROR_POS_STYLE`              | An enum value indicating what style is being used to print the source location of compile errors and warnings. (`Default`, `Unix`.)                                                     |
| `ODIN_DEFAULT_TO_NIL_ALLOCATOR`     | `true` if `-default-to-nil-allocator` command lines switch is passed, which sets the initial allocator to an allocator that does nothing.                                               |
| `ODIN_NO_DYNAMIC_LITERALS`          | `true` if `-no-dynamic-literals` command line switch is passed, which prohibit dynamic array or map literals.                                                                           |
| `ODIN_NO_CRT`                       | `true` if `-no-crt` command line switch is passed, which inhibits linking with the C Runtime Library, a.k.a. LibC.                                                                      |
| `ODIN_USE_SEPARATE_MODULES`         | `true` if `-use-separate-modules` command line switch is passed, which builds each package into its own object file, and then links them together, instead of performing a unity build. |
| `ODIN_TEST`                         | `true` if the code is being compiled via an invocation of `odin test`.                                                                                                                  |
| `ODIN_NO_ENTRY_POINT`               | `true` if `-no-entry-point` command line switch is passed, which makes the declaration of a `main` procedure optional.                                                                  |
| `ODIN_FOREIGN_ERROR_PROCEDURES`     | `true` if `-foreign-error-procedures` command line switch is passed, which inhibits generation of runtime error procedures, so that they can be in a separate compilation unit.         |
| `ODIN_DISALLOW_RTTI`                | `true` if `-disallow-rtti` command line switch is passed, which inhibits generation of full Runtime Type Information.                                                                   |
| `ODIN_ROOT`                         | Path to the folder containing the Odin compiler executable.                                                                                                                             |
| `ODIN_BUILD_PROJECT_NAME`           | Name of the folder that contains the entry point.                                                                                                                                       |
| `ODIN_VENDOR`                       | String which identifies the compiler being used. The official compiler sets this to `"odin"`.                                                                                           |
| `ODIN_VALGRIND_SUPPORT`             | `true` if Valgrind integration is supported on the target.                                                                                                                              |

What follows is an example of when you might use this approach.
It sets the initial allocator to one that tracks memory leaks and incorrect frees when the user has asked for debug information to be emitted.
```odin
package main

import "core:fmt"
import "core:mem"

main :: proc() {
	when ODIN_DEBUG {
		track: mem.Tracking_Allocator
		mem.tracking_allocator_init(&track, context.allocator)
		context.allocator = mem.tracking_allocator(&track)

		defer {
			if len(track.allocation_map) > 0 {
				fmt.eprintf("=== %v allocations not freed: ===\n", len(track.allocation_map))
				for _, entry in track.allocation_map {
					fmt.eprintf("- %v bytes @ %v\n", entry.size, entry.location)
				}
			}
			if len(track.bad_free_array) > 0 {
				fmt.eprintf("=== %v incorrect frees: ===\n", len(track.bad_free_array))
				for entry in track.bad_free_array {
					fmt.eprintf("- %p @ %v\n", entry.memory, entry.location)
				}
			}
			mem.tracking_allocator_destroy(&track)
		}
	}
	
	
	do_stuff()
}
```

### Command-line defines

Sometimes you want to do something conditionally based on some compile-time parameters of some sort, but globally, across the entire project.
This is how you define those.

You may define a constant using the `-define` command line switch. e.g: `-define:FOO=true`.
You can then fetch its value as a constant in your code like this:
```odin
FOO :: #config(FOO, false) // defines FOO as a constant with the default value of false
BAR :: #config(BAR_DEBUG, true) // name can be different compared to the constant 

when FOO {
	// only evaluated when FOO is true
} else {
	// only evaluate when FOO is false
}
```
The value for a command line define may be an integer, boolean, or string. Currently, no other types are supported.

You can read up further on [Built-in procedures](#configidentifer-default) here.

### Build tags

This feature allows you to cover more edge-case situations where you want some code to be compiled on several platforms.

However, overly-liberal use of this feature can make it hard to reason about what code is included or not, based on the target platform or architecture.
[File Suffixes](#File-Suffixes) are typically a nicer approach if they cover what you need.

For the sake of demonstration, let's take POSIX: You could use `foobar_unix.odin`, which has no special meaning to the compiler at all, and use a tag in the file itself.

Here's an example of a file that will only be included on Linux or Darwin:
```odin
//+build linux, darwin
package foobar
```


## Implicit context system
In each scope, there is an implicit value named `context`. This `context` variable is local to each scope and is implicitly passed by pointer to any procedure call in that scope (if the procedure has the Odin calling convention).

The main purpose of the implicit `context` system is for the ability to intercept third-party code and libraries and modify their functionality. One such case is modifying how a library allocates something or logs something. In C, this was usually achieved with the library defining macros which could be overridden so that the user could define what he wanted. However, not many libraries supported this in many languages by default which meant intercepting third-party code to see what it does and to change how it does it was not possible.


```odin
main :: proc() {
	c := context // copy the current scope's context

	context.user_index = 456
	{
		context.allocator = my_custom_allocator()
		context.user_index = 123
		supertramp() // the `context` for this scope is implicitly passed to `supertramp`
	}

	// `context` value is local to the scope it is in
	assert(context.user_index == 456)
}

supertramp :: proc() {
	c := context // this `context` is the same as the parent procedure that it was called from
	// From this example, context.user_index == 123
	// A context.allocator is assigned to the return value of `my_custom_allocator()`

	// The memory management procedure uses the `context.allocator` by default unless explicitly specified otherwise
	ptr := new(int)
	free(ptr)
}
```

By default, the `context` value has default values for its parameters which is decided in the package runtime. These defaults are compiler specific.

To see what the implicit `context` value contains, please see the definition of the `Context` struct in [package runtime](https://github.com/odin-lang/Odin/blob/master/core/runtime/core.odin).

### Allocators
Odin is a manual memory management based language. This means that Odin programmers must manage their own memory, allocations, and tracking. To aid with memory management, Odin has huge support for custom allocators, especially through the implicit `context` system.

The built-in types of dynamic arrays and `map` both contain a custom allocator. This allocator can be either manually set or the allocator from the current `context` will be assigned to the data type.

All allocations in Odin are preferably done through allocators. The core library of Odin takes advantage of allocators through the implicit `context` system. The following call:

```odin
ptr := new(int)
```

is equivalent to this:

```odin
ptr := new(int, context.allocator)
```

The allocator from the `context` is implicitly assigned as a default parameter to the built-in procedure [`new`](http://pkg.odin-lang.org/core/builtin/#new).

The implicit `context` stores two different forms of allocators: `context.allocator` and `context.temp_allocator`. Both can be reassigned to any kind of allocator. However, these allocators are to be treated slightly differently.

* `context.allocator` is for "general" allocations, for the subsystem it is used within.
* `context.temp_allocator` is for temporary and short lived allocations, which are to be freed once per cycle/frame/etc.


By default, the `context.allocator` is an OS heap allocator and the `context.temp_allocator` is assigned to a scratch allocator (a growing arena based allocator). `free_all(context.temp_allocator)` must be called to clear the contents of the temporary allocator's internal arena. 


The following procedures are built-in (and also available in `package mem` with enforced allocator errors) and are encouraged for managing memory:

* [`new`](http://pkg.odin-lang.org/core/builtin/#new) - allocates a value of the type given. The result value is a pointer to the type given.

```odin
ptr := new(int)
ptr^ = 123
x: int = ptr^
```

* [`new_clone`](http://pkg.odin-lang.org/core/builtin/#new) - allocates a clone of the value passed to it. The resulting value of the type will be a pointer to the type of the value passed.

```odin
x: int = 123
ptr: ^int
ptr = new_clone(x)
assert(ptr^ == 123)
```

* [`make`](http://pkg.odin-lang.org/core/builtin/#make) - allocates memory for a backing data structure of either a [slice](#slices), [dynamic array](#dynamic-arrays), or [map](#maps).

```odin
slice := make([]int, 65)

dynamic_array_zero_length := make([dynamic]int)
dynamic_array_with_length := make([dynamic]int, 32)
dynamic_array_with_length_and_capacity := make([dynamic]int, 16, 64)

made_map := make(map[string]int)
made_map_with_reservation := make(map[string]int, 64)
```

* [`free`](http://pkg.odin-lang.org/core/builtin/#free) - frees the memory at the pointer given. **Note:** only free memory with the allocator it was allocated with.

```odin
ptr := new(int)
free(ptr)
```

* [`free_all`](http://pkg.odin-lang.org/core/builtin/#free_all) - frees all the memory of the context's allocator (or given allocator). **Note:** not all allocators support this procedure.

```odin
free_all()
free_all(context.temp_allocator)
free_all(my_allocator)
```

* [`delete`](http://pkg.odin-lang.org/core/builtin/#delete) - deletes the backing memory of a value allocated with make or a string that was allocated through an allocator.

```odin
delete(my_slice)
delete(my_dynamic_array)
delete(my_map)
delete(my_string)
delete(my_cstring)
```

To see more uses of allocators and allocation-related procedures, please see [`package mem`](https://github.com/odin-lang/Odin/tree/master/core/mem) in the core library.

For more information regarding memory allocation strategies in general, please see [Ginger Bill's Memory Allocation Strategy](https://www.gingerbill.org/series/memory-allocation-strategies/) series.

#### Explicit `context` Definition
Procedures which do not use the `"odin"` calling convention must explicitly assign the `context` if something within its body requires it.

```odin
explicit_context_definition :: proc "c" () {
	// Try commenting the following statement out below
	context = runtime.default_context()

	fmt.println("\n#explicit context definition")
	dummy_procedure()
}

dummy_procedure :: proc() {
	fmt.println("dummy_procedure")
}
```

Here is another example of setting an error callback for `vendor:glfw`:
```odin
error_callback :: proc "c" (code: i32, desc: cstring) {
	context = runtime.default_context() // set the current context
	fmt.println(desc, code) // fmt.* calls use the odin calling convention
}
glfw.SetErrorCallback(error_callback)
```

### Logging System

As part of the implicit `context` system, there is a built-in logging system.

To see more uses of loggers, please see [`package log`](https://github.com/odin-lang/Odin/tree/master/core/log) in the core library.

## Foreign system
It is sometimes necessary to interface with foreign code, such as a C library. In Odin, this is achieved through the `foreign` system. You can "import" a library into the code using the same semantics as a normal import declaration:
```odin
foreign import kernel32 "system:kernel32.lib"
```
This `foreign import` declaration will create a "foreign import name" which can then be used to associate entities within a foreign block.

```odin
foreign import kernel32 "system:kernel32.lib"
foreign kernel32 {
	ExitProcess :: proc "stdcall" (exit_code:  u32) ---
}
```

If a library exports global variables, you can import those into Odin as well.

```odin
foreign lib {
	x: i32
}
```

Foreign procedure declarations have the **cdecl**/**c** calling convention by default unless specified otherwise. Due to foreign procedures not having a body declared within this code, you need to append the `---` symbol to the end to distinguish it as a procedure literal without a body and not a procedure type.

The attributes system can be used to change specific properties of entities declared within a block:
```odin
@(default_calling_convention = "std")
foreign kernel32 {
	@(link_name="GetLastError") get_last_error :: proc() -> i32 ---
}
```

Available attributes for foreign blocks:

`default_calling_convention=<string>` default calling convention for procedures declared within this foreign block  
`link_prefix=<string>` prefix that needs to be appended to the linkage names of the entities except where the link name has been explicitly overridden  

## Using a `vendor` library

As described in the [Foreign System](#foreign-system) we often want to use existing `C` libraries. Odin has a wide collection of maintained [bindings and ports](https://github.com/odin-lang/Odin/tree/master/vendor).

**Note:** Case notation should remain the same as the original authors intended - to make porting code easier.

Let's run through how we could use the `vendor:glfw` library. The code will be based on their [Quick Guide](https://www.glfw.org/docs/latest/quick_guide.html) but we will simplify it to only show using `glfw` though.

```odin
package main

import "core:fmt"
import "core:runtime"
import "vendor:glfw"

error_callback :: proc "c" (code: i32, desc: cstring) {
	context = runtime.default_context()
	fmt.println(desc, code)
}

key_callback :: proc "c" (window: glfw.WindowHandle, key, scancode, action, mods: i32) {
	if key == glfw.KEY_ESCAPE && action == glfw.PRESS {
		glfw.SetWindowShouldClose(window, glfw.TRUE)
	}
}

main :: proc() {
	glfw.SetErrorCallback(error_callback)

	if glfw.Init() == 0 {
		panic("EXIT_FAILURE")
	}
	defer glfw.Terminate()

	glfw.WindowHint(glfw.CONTEXT_VERSION_MAJOR, 2)
	glfw.WindowHint(glfw.CONTEXT_VERSION_MINOR, 0)

	window := glfw.CreateWindow(640, 480, "Simple example", nil, nil)
	if window == nil {
		panic("EXIT_FAILURE")
	}	
	defer glfw.DestroyWindow(window)

	glfw.SetKeyCallback(window, key_callback)

	glfw.MakeContextCurrent(window)
	// ...
	glfw.SwapInterval(1)
	// ...

	for !glfw.WindowShouldClose(window) {
		// ...

		glfw.SwapBuffers(window)
		glfw.PollEvents()
	}
}
```

As we can see there is little difference to how someone would use `vendor:glfw` in this case. It's not always perfect but often good enough to port existing code quickly.

## Parametric polymorphism
Parametric polymorphism, commonly referred to as "generics", allow the user to create a procedure or data that can be written _generically_ so it can handle values in the same manner.

**Note:** Within the Odin code base and documentation, the nickname "parapoly" is usually used.

### Explicit parametric polymorphism
Explicit parametric polymorphism means that the types of the parameters of a `proc` or of the data fields of a `struct` (when intended to potentially be used with multiple possible types) must be explicitly provided. This is similar to how C++ allows the use of `template`s to fill out the body of a procedure or data structure with the types that are given at compile-time as input to the `template` parameters, but in Odin explicit parametric polymorphism is safer and cleaner to work with. 

#### Procedures using explicit parametric polymorphism (parapoly)
As a reminder, all parameters passed into a function are immutable in the sense that they can't have their value changed using `=` directly. A useful idiom is `var := var`, which expresses a variable shadowing itself. When used at the top of a procedure the compiler understands the use case of enabling local modification of the otherwise immutable parameter variable, and won't complain about the shadowing when you compile with `-vet`.

```odin
sin_tau :: proc(angle_in_cycles: f64) -> f64 {
    angle_in_cycles := angle_in_cycles   // Allows `angle_in_cycles` to have its value changed
    
    TAU :: 2 * math.PI
    angle_in_cycles *= TAU
    return math.sin(angle_in_cycles)
}
assert(math.abs(sin_tau(0.25) - 1) <= 0.001)   // sin_tau(0.25) is approximately 1
assert(math.abs(sin_tau(0.75) - -1) <= 0.001)  // sin_tau(0.75) is approximately -1
```

However, to specify that a parameter must be a **compile-time** constant, which is not the same thing as an immutable parameter, and may sometimes be necessary (e.g. for parapoly) or desirable (e.g. to enforce compile-time computation), the parameter's name must be prefixed with a dollar sign `$`. The following example takes two compile-time constant parameters and then uses them to initialize an array of known length:
```odin
make_f32_array :: #force_inline proc($N: int, $val: f32) -> (res: [N]f32) {
	for _, i in res {
		res[i] = val*val
	}
	return
}

array := make_f32_array(3, 2)
```

Types can also be explicitly passed by specifying that the `typeid` parameter is constant:
```odin
my_new :: proc($T: typeid) -> ^T {
	return (^T)(alloc(size_of(T), align_of(T)))
}

ptr := my_new(int)
```

#### Data types using explicit parametric polymorphism (parapoly)
Structures and unions may have polymorphic parameters and the syntax for doing so is similar to procedure call syntax.
**Parapoly struct:**
```odin
Table_Slot :: struct($Key, $Value: typeid) {
	occupied: bool,
	hash:    u32,
	key:     Key,
	value:   Value,
}
slot: Table_Slot(string, int)
```
**Parapoly union:**
```odin
Error :: enum {Foo0, Foo1, Foo2}
Param_Union :: union($T: typeid) #no_nil {T, Error}
r: Param_Union(int)
r = 123
r = Error.Foo0
```
The `$` prefix is optional for record data types as all parameters must be "constant".

### Implicit parametric polymorphism
Implicit implies that the type of a parameter is inferred from its input. In this case, the dollar sign `$` can be placed on the type.

**Note:** Within the Odin code base and documentation, the name "polymorphic name" is usually used.

#### Procedures using implicit parametric polymorphism (parapoly)
```odin
foo :: proc($N: $I, $T: typeid) -> (res: [N]T) {
	// `N` is the constant value passed
	// `I` is the type of N
	// `T` is the type passed
	fmt.printf("Generating an array of type %v from the value %v of type %v\n",
			   typeid_of(type_of(res)), N, typeid_of(I))
	for i in 0..<N {
		res[i] = i*i
	}
	return
}

T :: int
array := foo(4, T)
for v, i in array {
	assert(v == T(i*i))
}
```

#### Specialization
In some cases, you may want to specify that a type must be a specialization of a certain type.

```odin
// Only allow types that are specializations of a (polymorphic) slice
make_slice :: proc($T: typeid/[]$E, len: int) -> T {
	return make(T, len)
}
```

```odin
Table_Slot :: struct($Key, $Value: typeid) {
	occupied: bool,
	hash:     u32,
	key:      Key,
	value:    Value,
}
Table :: struct($Key, $Value: typeid) {
	count:     int,
	allocator: mem.Allocator,
	slots:     []Table_Slot(Key, Value),
}

// Only allow types that are specializations of `Table`
allocate :: proc(table: ^$T/Table, capacity: int) {
	...
}

// find :: proc(table: ^$T/Table, key: T.Key) -> (T.Value, bool) {
find :: proc(table: ^Table($Key, $Value), key: Key) -> (Value, bool) {
	...
}
```

### `where` clauses
A bound on polymorphic parameters to a procedure or record can be expressed using a `where` clause immediately before opening `{`, rather than at the type's or constant's first mention. Additionally, `where` clauses can apply bounds to arbitrary types, rather than just polymorphic type parameters.

Some cases that a `where` clause may be useful:

* Sanity checks for parameters:

```odin
simple_sanity_check :: proc(x: [2]int)
	where len(x) > 1,
		  type_of(x) == [2]int {
	fmt.println(x)
}
```

* Parameter polymorphism checks for procedures:

```odin
cross_2d :: proc(a, b: $T/[2]$E) -> E
	where intrinsics.type_is_numeric(E) {
	return a.x*b.y - a.y*b.x
}
cross_3d :: proc(a, b: $T/[3]$E) -> T
	where intrinsics.type_is_numeric(E) {
	x := a.y*b.z - a.z*b.y
	y := a.z*b.x - a.x*b.z
	z := a.x*b.y - a.y*b.x
	return T{x, y, z}
}

a := [2]int{1, 2}
b := [2]int{5, -3}
fmt.println(cross_2d(a, b))

x := [3]f32{1, 4, 9}
y := [3]f32{-5, 0, 3}
fmt.println(cross_3d(x, y))

// Failure case
// i := [2]bool{true, false}
// j := [2]bool{false, true}
// fmt.println(cross_2d(i, j))
```

* Solving disambiguations with polymorphic procedures in a procedure grouping:

```odin
foo :: proc(x: [$N]int) -> bool
	where N > 2 {
	fmt.println(#procedure, "was called with the parameter", x)
	return true
}

bar :: proc(x: [$N]int) -> bool
	where 0 < N,
		  N <= 2 {
	fmt.println(#procedure, "was called with the parameter", x)
	return false
}

baz :: proc{foo, bar}

x := [3]int{1, 2, 3}
y := [2]int{4, 9}
ok_x := baz(x)
ok_y := baz(y)
assert(ok_x == true)
assert(ok_y == false)
```

* Restrictions on parametric polymorphic parameters for record types:

```odin
Foo :: struct($T: typeid, $N: int)
	where intrinsics.type_is_integer(T),
	      N > 2 {
	x: [N]T,
	y: [N-2]T,
}

T :: i32
N :: 5
f: Foo(T, N)
#assert(size_of(f) == (N+N-2)*size_of(T))
```

## `->` operator (selector call expressions)

The `->` operator is called the selector call expression operator and is extremely useful for call procedures stored in vtables. [Component Objective Model (COM)](https://docs.microsoft.com/en-us/windows/win32/com/component-object-model--com--portal) APIs is a great example of where this kind of thing is extremely useful (such as the [Direct3D11 package](https://pkg.odin-lang.org/vendor/directx/d3d11/)).

```odin
x->y(123)
// is equivalent to
x.y(x, 123)
```

As the `->` operator is effectively syntactic sugar, all of the same semantics still apply, meaning subtyping through `using` will still work as expected to allow for the emulation of type hierarchies.


## Attributes

Attributes modify the compilation details or behaviour of declarations.

### General attributes

#### `@(private)`

Prevents a top level element from being exported with the package.
```odin
@(private)
my_variable: int; // cannot be accessed outside this package.
@private // parenthesis can be dropped on no arguments  
my_other_variable: int
```

You may also make an entity private to _the file_ instead of the package.
```odin
@(private="file")
my_variable: int; // cannot be accessed outside this file.
```
`@(private)` is equivalent to `@(private="package")`.

Using `//+private` in a file at the package declaration will automatically add `@(private)` to everything in the file
```odin
//+private
package foo
```

And `//+private file` will be equivalent to automatically adding `@(private="file")` to each declaration. This means that to remove the private-to-file association, you must apply a private-to-package attribute `@(private)` to the declaration.

#### `@(require)`

Requires that the declaration is added to the final compilation and not optimized out.


### Linking and foreign attributes

#### `@(link_name=<string>)`

This attribute can be attached to variable and procedure declarations inside a `foreign` block. This specifies what the variable/proc is called in the library.
Example:
```odin
foreign foo {
    @(link_name = "bar")
    testbar :: proc(baz: int) ---
}
```

#### `@(link_prefix=<string>)`

This attribute can be attached to a `foreign` block to specify a prefix to all names. So if functions are prefixed with `ltb_` in the library is you can attach this and not specify that on the procedure on the Odin side. Example:
```odin
@(link_prefix = "ltb_")
foreign foo {
    testbar :: proc(baz: int) --- // This now refers to ltb_testbar
}
```

#### `@export` or `@(export=true/false)`

Exports a variable or procedure symbol, useful for producing DLLs.

#### `@(linkage=<string>)`

Allows the ability to specify the specific linkage of a declaration. Allow linkage kinds: `"internal"`, `"strong"`, `"weak"`, and `"link_once"`.

#### `@(default_calling_convention=<string>)`

This attribute can be attached to a `foreign` block to specify the default calling convention for all procedures in the block. Example:
```odin
@(default_calling_convention = "std")
foreign kernel32 {
    @(link_name="LoadLibraryA") load_library_a  :: proc(c_str: ^u8) -> Hmodule ---
}
```

#### `@(link_section=<string>)`

Specify the link section for a global variable.

```odin
@(link_section=".foo")
my_global: i32
```

#### `@(extra_linker_flags=<string>)`

Provide additional linker flags to a `foreign import` declaration.

```odin
@(extra_linker_flags="/NODEFAULTLIB:libcmt")
foreign import lib {
    "windows/raylib.lib",
    "system:Winmm.lib",
    "system:Gdi32.lib",
    "system:User32.lib",
    "system:Shell32.lib",
}
```


### Procedure attributes

#### `(deferred_*=<proc>)`

* `(deferred_in=<proc>)`
* `(deferred_out=<proc>)`
* `(deferred_in_out=<proc>)`
* `(deferred_none=<proc>)`

These attributes can be attached to a procedure `X` which will be called at the end of the calling scope for `X`s caller.
`deferred_in` will receive the same parameters as the called proc. `deferred_out` will receive the result of the called proc. `deferred_in_out` will receive both. `deferred_none` will receive no parameters.
```odin
baz :: proc() {
    fmt.println("In baz")
}

@(deferred_none=baz)
bar :: proc() {
    fmt.println("In bar")
}

foo :: proc() {
    fmt.println("Entered foo")
    bar()
    fmt.println("Leaving foo")
}
// Prints:
// Entered foo
// In bar
// Leaving foo
// In baz
```

#### `@(deprecated=<string>)`

Mark a procedure as deprecated. Running `odin build/run/check` will print out the message for each usage of the deprecated proc.
```odin
@(deprecated="'foo' deprecated, use 'bar' instead")
foo :: proc() {
    ...
}
```

#### `@(require_results)`

Ensures procedure return values are acknowledged, meaning that in any scope where a procedure `p` having procedure attribute `@(require_results)` is called, the scope must explicitly handle the return values of procedure `p` in some way, such as by storing the return values of `p` in variables or explicitly dropping the values by setting `_` equal them.
```odin
@(require_results)
foo :: proc() -> bool {
    return true
}

main :: proc() {
    foo() // won't compile
    _ = foo() // Ok
}
```

#### `@(warning=<string>)`

Produces a warning when a procedure is called.

#### `@(disabled=<boolean>)`

If the provided boolean is set, the procedure will not be used when called.

#### `@(init)`

This attribute may be applied to any procedure that neither takes any parameters nor returns any values. All suitable procedures marked in this way by `@(init)` will then be called at the start of the program before `main` is called. The exact order in which all such intialization functions are called is deterministic and hence reliable. The order is determined by a topological sort of the import graph and then in alphabetical file order within the package and then top down within the file.

#### `@(cold)`

A hint to the compiler that this procedure is rarely called, and thus "cold".

#### `@(optimization_mode=<string>)`

Set the optimization mode of a procedure. Valid modes are `"none"`, `"minimal"`, `"size"`, and `"speed"`.

```odin
@(optimization_mode="speed")
skip_whitespace :: proc(t: ^Tokenizer) {
    for {
        switch t.ch {
        case ' ', '\t', '\r', '\n':
            advance_rune(t)
        case:
            return
        }
    }
}
```

### Variable attributes

#### `@(static)`

This attribute can be applied to a variable to have it keep its state even when going out of scope.
This is the same behavior as a `static` local variable in C.
```odin
test :: proc() -> int {
    @(static) foo := 0
    foo += 1
    return foo
}

main :: proc() {
    fmt.println(test()) // prints 1
    fmt.println(test()) // prints 2
    fmt.println(test()) // prints 3
}
```

#### `@(thread_local)`

Can be applied to a variable at file scope
```odin
@(thread_local) foo: int
```

### Specialized attributes

* **@(builtin)**
Marks builtin procs in Odin's "core:runtime" package. Cannot be used in user code.

* **@(objc_name=\<string\>)**
* **@(objc_type=\<type\>)**
* **@(objc_is_class_method=\<boolean\>)**

* **@(require_target_feature=\<string\>)**
* **@(enable_target_feature=\<string\>)**


## Directives

Directives are a way of extending the core behaviour of the Odin programming language. They have the form `#directive_name`.

### Record memory layout

#### `#packed`

This tag can be applied to a struct. Removes padding between fields that's normally inserted to ensure all fields meet their type's alignment requirements. Fields remain in source order.

This is useful where the structure is unlikely to be correctly aligned (the insertion rules for padding assume it **_is_**), or if the space-savings are more important or useful than the access speed of the fields.

Accessing a field in a packed struct may require copying the field out of the struct into a temporary location, or using a machine instruction that doesn't assume the pointer address is correctly aligned, in order to be performant or avoid crashing on some systems. (See `intrinsics.unaligned_load`.)
```odin
struct #packed {x: u8, y: i32, z: u16, w: u8}
```

#### `#raw_union`

This tag can be applied to a struct. Struct's fields will share the same memory space which serves the same functionality as `union`s in C language. Useful when writing bindings especially.
```odin
struct #raw_union {u: u32, i: i32, f: f32}
```

#### `#align`
This tag can be applied to a `struct` or `union`. When `#align` is passed an integer `N` (as in `#align N`), it specifies that the `struct` will be aligned to `N` bytes. The `struct`'s fields will remain in source-order.
```odin
Foo :: struct #align 4 {
    b: bool,
}
Bar :: union #align 4 {
    i32,
    u8,
}
```

#### `#no_nil`
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


### Control statements

#### `#partial`

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

The `#partial` directive can also be used to initialize an [enumerated array](#enumeration-array).

### Procedure parameters

#### `#no_alias`

This tag can be applied to a procedure parameter that is a pointer. This is a hint to the compiler that this parameter will not alias other parameters. This is equivalent to C's `__restrict`.

```odin
foo :: proc(#no_alias a, b: ^int) {}
```

#### `#any_int`

This tag can be applied to a procedure parameter that is an integer. This allows implicit casts to the procedures integer type at
the call site.

```odin
foo :: proc(#any_int a: int) {}
x : i32
foo(x) // This is now allowed without an explicit cast
```

#### `#caller_location`

This tag is used as a function's parameter value. In the following function signature,
```odin
alloc :: proc(size: int, alignment: int = DEFAULT_ALIGNMENT, loc := #caller_location) -> rawptr
```

`loc` is a variable of type `Source_Code_Location` (see `core/runtime/core.odin`) that is automatically filled with the location of the line of code calling the function (in this case, the line of code calling `alloc`).

#### `#c_vararg`
Used to interface with vararg functions in foreign procedures.
```odin
foreign foo {
    bar :: proc(n: int, #c_vararg args: ..any) ---
}
```

#### `#by_ptr`
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

#### `#optional_ok`

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

### Expressions

#### `#type`

This tag doesn't serve a functional purpose in the compiler, this is for telling someone reading the code that the expression is a type. The main case is for showing that a procedure signature without a body is a type and not just missing its body, for example:
```odin
foo :: #type proc(foo: string)

bar :: struct {
    gin: foo,
}
```

### Statements

#### `#bounds_check` and `#no_bounds_check`

The `#bounds_check` and `#no_bounds_check` flags control Odin's built-in bounds checking of arrays and slices. Any statement, block, or function with one of these flags will have their bounds checking turned on or off, depending on the flag provided. Valid uses of these flags include:
```odin
proc_without_bounds_check :: proc() #no_bounds_check {
    #bounds_check {
        #no_bounds_check fmt.println(os.args[1])
    }
}
```

### Built-in procedures

#### `#assert(<boolean>)`

Unlike `assert`, `#assert` runs at compile-time. `#assert` breaks compilation if the given bool expression is false, and thus `#assert` is useful for catching bugs before they ever even reach run-time. It also has no run-time cost.
```odin
#assert(SOME_CONST_CONDITION)
```

#### `#panic(<string>)`

Panic runs at compile-time. It is functionally equivalent to an `#assert` with a `false` condition, but `#panic` has an error message string parameter.
```odin
#panic(message)
```

#### `#config(<identifer>, default)`

Checks if an identifier is defined through the command line, or gives a default value instead.

Values can be set with the `-define:NAME=VALUE` command line flag.

#### `#defined`

Checks if an identifier is defined. This may only be used within a procedure's body.

```odin
n: int
when #defined(n) { fmt.println("true") }
if #defined(int) { fmt.println("true") }
when #defined(nonexistent_proc) == false { fmt.println("proc was not defined") }
```

#### `#file`, `#line`, `#procedure`

Return the current file path, line number, or procedure name, respectively. Used like a constant value. `file_name :: #file`

#### `#location()` or `#location(<entity>)`

Returns a `runtime.Source_Code_Location` (see `core/runtime/core.odin`). Can be called with no parameters for current location, or with a parameter for the location of the variable/proc declaration.
```odin
foo :: proc() {}

main :: proc() {
    n: int
    fmt.println(#location())
    fmt.println(#location(foo))
    fmt.println(#location(n))
}
```

#### `#load(<string-path>)` or `#load(<string-path>, <type>)`

Returns a `[]u8` of file contents at compile time, or optionally as another type.
```odin
foo := #load("path/to/file")
bar := #load("path/to/file", string)
fmt.println(bar)

If a file's size is not a multiple of the `size_of(type)`, then any remainder is ignored.
baz := #load("path/to/file", []f32)
```

#### `#load_or(<string-path>, default)`

Returns a `[]u8` of file contents at compile time, otherwise default content when the file wasn't found.
```odin
foo := #load_or("path/to/file", []u8 { 104, 105 })
fmt.println(string(foo))
```

#### `#load_hash(<string-path>, <string-hash>)`

Returns a constant integer of the hash of a file's contents at compile time. Available hashes:  `"adler32"`, `"crc32"`, `"crc64"`, `"fnv32"`, `"fnv64"`, `"fnv32a"`, `"fnv64a"`, `"murmur32"`, or `"murmur64"`.

```odin
hash :: #load_hash("path/to/file", "crc32")
```


## Useful idioms

The following are useful idioms which are emergent from the semantics of the language.

### Basic idioms

#### Ternary operator

The following two snippets are identical:
```odin
bar := condition ? 1 : 42
```
```odin
bar := 1 if condition else 42
```

You can also use ternary expressions with constants at compile-time:
```odin
DEBUG_LOG_SIZE :: 1024 when ODIN_DEBUG else 0
```

#### If-statements with initialization

```odin
if str, ok := value.(string); ok {
	...
} else {
   ...
}
```

#### Iterating through slices of structs by value or by reference
```odin
Foo :: struct {
	f: f32,
	i: i32,
}

foos := make([]Foo, num)

// By-value basic ranged-based loop, with implicit indexing
for v, j in foos {
	using v
	fmt.println(j, v, f, i)
}

// Alternative range-based loop, with explicit indexing
for _, j in foos {
	using foo := foos[j] // copy
	fmt.println(j, foo, f, i)
}

// By-reference range-based explicit indexing loop
for _, j in foos {
	using foo := &foos[j] // "reference", changes to `f` or `i` are visible outside this scope
	fmt.println(j, foo, f, i)
}


// By-reference range-based through pointer
for &v, j in foos {
	using v // v is now a variable reference as `foos` was passed by pointer
	fmt.println(j, foo, f, i)
}
```

#### 'defer if'
```odin
cond := true

defer if cond {
	fmt.println("Hello World") // "Hello world" last
}

fmt.println("Hellope") // "Hellope" first
```

#### 'Maybe(T)'
`Maybe(T)` is a union which *either* returns a type `T` or `nil`. In other languages this is often seen as `Option(T)`, `Result(T)`, etc. 

Odin has multiple return values, so `Maybe(T)` is used less frequently or rarely in the `core` library. Instead of doing `-> Maybe(int)` you could transform it to `-> (int, bool)`.

```odin
halve :: proc(n: int) -> Maybe(int) {
	if n % 2 != 0 do return nil
	return n / 2
}

half, ok := halve(2).?
if ok do fmt.println(half)       // 1
half, ok = halve(3).?
if !ok do fmt.println("3/2 isn't an int")

n := halve(4).? or_else 0
fmt.println(n)                   // 2
```

### Advanced idioms

Subtype polymorphism with run-time type-safe down-casting:
```odin
Entity :: struct {
	id:   u64,
	name: string,

	variant: union{^Frog},
}

Frog :: struct {
	using entity: Entity,
	volume: f32,
	jump_height: i32,
}


new_entity :: proc($T: typeid) -> ^T {
	e := new(T)
	e.variant = e
	return e
}

entity: ^Entity = new_entity(Frog)
switch e in entity.variant {
case ^Frog:
	fmt.println("Ribbit:", e.volume)
}
```

## Implicit Type Conversions

Odin is a strongly and `distinct`ly typed language by default. It has very few implicit type conversions compared to many other languages.

* `^T` -> `rawptr`
* `[^]T` -> `rawptr`
* `[^]T` <-> `^T`
* All types to `any` (must be specialized/non-polymorphic)
* Any of its variants to the `union`
* `fN` -> `complex2N` (e.g. `f32` -> `complex64`)
* `fN` -> `quaternion4N`  (e.g. `f32` -> `quaternion128`)
* `complex2N` -> `quaternion4N` (e.g. `complex64` -> `quaternion128`)
* `T` -> `[N]T`
* `T` -> `matrix[R, C]T`
* `T` -> `#simd[N]T`
* `distinct proc` <-> `proc` (same base types)
* `distinct matrix` <-> `matrix` (same base types)
* Subtypes through `using`
* Untyped integers -> all numeric related types that can represent them without truncation
* Untyped floats   -> all numeric related types that can represent them without truncation
* Untyped booleans -> all boolean related types
* Untyped rune     -> all rune types
* Untyped strings  -> all string types

## Extra Information
More details can be found on the [Github wiki for Odin](https://github.com/odin-lang/Odin/wiki).
Some of this information includes:

- [Compiler Flags](https://github.com/odin-lang/Odin/wiki/Compiler-Flags)
- [Built in Procedures](https://github.com/odin-lang/Odin/wiki/Built-in-Procedures)
- [Keywords and Operators](https://github.com/odin-lang/Odin/wiki/Keywords-and-Operators)
- ...and more

## What to do if you get stuck

If you are unable to find the information you need on this overview page, the [FAQ](https://odin-lang.org/docs/faq/), the [wiki](https://github.com/odin-lang/Odin/wiki), the [example repository](https://github.com/odin-lang/examples) (which contains demos for using the vendor libs, e.g. [Tetris in raylib](https://github.com/odin-lang/examples/blob/master/raylib/tetroid/raylib_tetroid.odin)), or the [package documentation](https://pkg.odin-lang.org/), then you will likely find it very helpful to explore your Odin source code directory, especially the files contained in the following five subdirectories: `examples\demo`, `tests`, `core`, `vendor`, and `misc\old_demos`.  

The following list describes why each of these may be useful:

- The `examples\demo\demo.odin` file contains ~2500 lines of Odin code that demonstrate many of Odin's language features and provide commentary on some of them. This file contains many examples that cannot be found anywhere in the Overview nor in the other documentation.
- The `tests` folder provides unit tests for many of Odin's features and libraries, whereby reading these files you can gain a more nuanced view of exactly how things are intended or expected to behave. Tests are essentially automatically verified documentation. Tests often cover details that normal documentation doesn't even mention. Tests are also guaranteed to be up-to-date (if regularly run), unlike more informal documentation.
- The `core` and `vendor` folders contain the bindings and implementation code for Odin's standard library and various multimedia libraries respectively. **Even if you don't understand the implementation of something, reading the code can still greatly improve your chances of guessing what exactly it really does.** Odin is a straightforward and legible language with relatively little magic compared to other modern languages. Reading source code can enable you to work around missing documentation much more effectively. This is a very useful thing to keep in mind for working with any under-development language or library effectively.
- `misc\old_demos` may contain examples that are different from the main up-to-date `demo.odin` file contained in `examples\demo`. This may provide additional context for Odin's design and features. The other resources are probably better though.

Try doing a text search in one or more of these subdirectories for what you are looking for. Make sure the search is a proper full text search too, such as what `grep` (a popular 3rd party file search program) provides. Be careful that you specify your search correctly, especially if you use *regex*. Some default searches on some operating systems may miss content that exists in some files by not searching the actual file contents completely or at all, which can be misleading.

Odin's documentation may be sparse at times, but this sparsity can be worked around effectively by using the above listed resources. *Don't forget they exist.*

When working with any system that is still under-development these kinds of techniques are essential for maximizing your effectiveness. Many (perhaps most) real world companies, especially in intense industries such as game development and multimedia often don't have complete documentation and changes can happen rapidly. 

Self-sufficiency in such a context requires a willlingness to explore these kinds of resources proactively, rather than waiting for documentation that may be slow to come or may not fully cover what things actually do precisely enough.

Don't be afraid to simply experiment and try to deduce what something is really doing or what features may exist. You may be surprised how much you can still accomplish with just a little bit of patience and thoughtfulness!

Furthermore, even if Odin doesn't yet have a feature or library that you need, the fact that Odin has bindings to C's standard library (which are available in [the libc package](https://pkg.odin-lang.org/core/c/libc/) via `import "core:c/libc"`) means that any algorithms, example code, documentation, or books originally written for C can also be used to accomplish what you need in Odin. You can then optionally write Odin wrappers around that code to bridge the idiomatic gap better or else just use the C-like code directly. You can also bind to code from any libraries or languages that `foreign` can bind to (see [the foreign section](https://odin-lang.org/docs/overview/#foreign-system) for more info).

Thus, when necessity calls for it, **the entire literature and community of C is still (in effect) available to you in Odin as well**. So, any time you are tempted to think "I can't implement this in Odin yet because there's not enough documentation" remind yourself that all (or almost all) of C is still available to you, but through a cleaner namespaced interface. Odin is also similar to C anyway, so direct translations of C to Odin (without even using the `libc` bindings) may still be relatively easy. In effect, any tutorial or book on C can also be thought of as an Odin resource too in that sense!

You can also make your experience navigating Odin code easier by installing a [syntax highlighter](https://en.wikipedia.org/wiki/Syntax_highlighting) and/or a [language server](https://en.wikipedia.org/wiki/Language_Server_Protocol), which do exist for some editors (e.g. VS Code, Vim, Sublime Text, and Emacs) and work well enough to make using Odin comfortable. See [the list of text editors that have support for Odin code](https://github.com/odin-lang/Odin/wiki/Odin-Libs#editor-support) for known examples.

Finally, you can ask for information from [the Odin community on Discord](https://discord.com/invite/sVBPHEv) or elsewhere. There is also [an old Handmade Network forum](https://odin.handmade.network/forums) that is no longer in use and doesn't have many threads, but may still have a small amount of useful info on it.

There's a collection of other [libraries created by the Odin community](https://github.com/odin-lang/Odin/wiki/Odin-Libs) that may also be helpful.

Good luck and have fun!
