---
title: "Frequently Asked Questions"
linktitle: FAQ
summary: Answers to commonly asked questions about Odin.
weight: 9
---

## General

### What is the history of the project?
The project started one evening in late July 2016 when Ginger Bill was annoyed with programming in C++. The language began as a Pascal clone (with `begin` and `end` and more) but changed quite quickly to become something else.

Bill originally tried to create a preprocessor for C to augment and add new capabilities to the language. However, he found this endeavour a dead-end. That evening was the point at which Bill decided to create an entirely new language from scratch instead of trying to augment C.

### What have been the major influences in the language's design?
The language borrows heavily from (in order of philosophy and impact): [Pascal](https://wikipedia.org/wiki/Pascal_(programming_language)), [C](https://wikipedia.org/wiki/C_(programming_language)), [Go](https://en.wikipedia.org/wiki/Go_(programming_language)), [Oberon-2](https://en.wikipedia.org/wiki/Oberon-2), [Newsqueak](https://en.wikipedia.org/wiki/Newsqueak), [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language).

[Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth) and [Rob Pike](https://en.wikipedia.org/wiki/Rob_Pike) have been the programming language design idols throughout this project.

### How is Odin licensed?
The Odin compiler and the library are under the [zlib license](https://github.com/odin-lang/Odin/blob/master/LICENSE).

### Does Odin have any third-party library?
Check out a few selected libraries at https://github.com/odin-lang/Odin/wiki/Odin-Libs.

### What are the guiding principles behind the design of Odin?

* Simplicity and readability
* Minimal: there ought to be one way to write something
* Striving for orthogonality
* Programs are about transforming data into other forms of data
    * Code is about expressing algorithms---not the type system
* There is embedded knowledge and wisdom in older programming languages
* The entire language specification should be possible to be memorized by a mere mortal

### What does Odin offer over other languages?

A quick overview of features (in no particular order):

* Full UTF-8 Support
* Custom allocators that are simple to use:
    * Memory arenas/regions, pools, stacks, etc. which can be easily added
* [Context system](#context-system) for allocations, logging, and thread data
* Built-in types and procedures that take advantage of the context system:
    * `new(type)`, and `make` use the context's allocator (unless explicitly given)
    * Dynamic arrays and hash maps (`[dynamic]int` and `map[string]int`)
* Array programming
    * `a, b: [4]f32; c := a * b`
    * `i := a.x * b.y`
    * `v := swizzle(a, 1, 2, 0)`
* [Explicit procedure overloading](#why-does-odin-have-explicit-procedure-overloading-but-not-implicit-procedure-overloading)
* Introspection on all types
* High control over memory layout
    * Alignment
    * Field offsets
    * Endianness
    * Data sizes
* Endian specific integer types (useful for specific data formats)
    * `u32le`
    * `u64be`
* Decent [package](#packages) system and file handling
* No _bad_ preprocessor
* Type inference
    * `x: int = 1`
    * `x := 1 // x is deduced to be an int`
* `using`
    * making everything a namespace (similar to Pascal's `with` but on steroids)
    * Ability to have [subtype polymorphism](#is-odin-an-object-oriented-language)
* Multiple return values
* Clean, consistent, and fast to parse syntax
* No need for procedure prototypes
* [`defer` statements](/docs/overview/#defer-statement)
    * defer a statement until the end of scope (akin to D's `scope(exit)`)
* Nested procedures and types
* Tagged unions and untagged unions
* Ranged `for` loops
* [Labelled branches](/docs/overview/#branch-statements)
    * `break label_name`
* `break` by default in `switch` statements
    * Explicit `fallthrough`
* "Raw" strings
    * ``` x := `what "the" string?` ```
* `cstring` for legacy use
* [Parametric polymorphism](/docs/overview/#parametric-polymorphism) ("generics")
* [Foreign system](/docs/overview/#foreign-system)
* Compile time [`when` statements](/docs/overview/#when-statement)
* Bounds checking which is togglable at the statement level:
    * `#no_bounds_check` `#bounds_check`
* `i128` and `u128` support

And lots more!


## Design
### Why does Odin not have feature X?

Odin was designed with the ideas of simplicity, clarity, speed of compilation, orthogonality of concepts, and for high performance. Feature X may be missing because it does not meet these basic ideas.

If you honestly believe that Odin is missing feature X, please investigate what features Odin does have and you may be able to find intriguing ways to solve your problem in the lack of feature X.

### Why does Odin not have exceptions?
Coupling exceptions to a control structure, as in the try-catch-finally idiom, complicates the understanding of the program.

Odin uses plain error handling through the use of multiple return values. It is clear which procedure the error value is from compared to a `try-catch` approach which is akin to the [COMEFROM](https://en.wikipedia.org/wiki/COMEFROM) statement.

Please see gingerBill's article for more information: [Exceptions — And Why Odin Will Never Have Them](https://www.gingerbill.org/article/2018/09/05/exceptions-and-why-odin-will-never-have-them/).

### Is Odin "just" a language for game development?

**No.** It is a common misconception that Odin is "just" for game development ("gamedev") due to the numerous [vendor](https://pkg.odin-lang.org/vendor/) packages that could be used in the aid of the development of a game. However, gamedev is pretty much the most wide domain possible where you will do virtually every area of programming possible.

Odin is a general purpose language; is capable of being used in numerous different areas from application development, servers, graphics, games, kernels, CLI/TUIs, etc.

There are many aspects of Odin which do make working with 2D and 3D related operations (which are common in gamedev) much nicer than other languages, especially Odin's [array programming](https://odin-lang.org/docs/overview/#array-programming), [swizzling](https://odin-lang.org/docs/overview/#swizzle-operations), [`#soa` data types](https://odin-lang.org/docs/overview/#soa-data-types), quaternions and matrices, and so much more niceties which other languages do not offer out-of-the-box.


## Types
### Is Odin an object oriented language?
No. Data structures are just data.

Subtype polymorphism is possible through the use of `using` but Odin does not offer methods.
```odin
Base :: struct {...}
Derived :: struct {
    using base: Base,
    name: string,
}
Derived_By_Ptr :: struct {
    name: string,
    // `using` can be applied anywhere and even to a pointer.
    // This allows for a huge amount of control over the memory
    // layout of the data structure.
    using base: ^Base,
}
```

This idiom allows the user to create a virtual procedure table if they do wish, akin to C, but in a nicer way by having more control over the memory layout and field access.

### Why does Odin not have Uniform Function Call Syntax (UFCS)?
The main reason is that it does not make any sense in Odin.

It is not "uniform" as Odin does not have the concept of a method. Odin also has the concept of import names for packages: this means procedures are declared within different scopes, meaning it would not make any sense syntactically.

One of Odin's goals is simplicity and striving to only offer one way to do things, to improve clarity. `x.f(y)` meaning `f(x, y)` is ambiguous as `x` may have a field called `f`. It is not at all clear what this means.

Very early on during Odin's development (circa. 2017), infix and suffix syntax for procedure calls was experimented with, but they were soon removed as it was found in practice that they were virtually never used nor did they actually aid with code clarity either.

One of the main reasons people want UFCS is to allow for "dot-autocomplete" in many IDEs, allowing the ability to show a list available procedures, dependent on the context. It is entirely possible to have this with normal procedure call syntax but most IDEs just do not do it for whatever reason.

### Why does Odin have explicit procedure overloading but not implicit procedure overloading?
The design goals of Odin were explicitness and simplicity. Implicit procedure overloading complicates the scoping system. In C++, you cannot nest procedures within procedures so all procedure look-ups are done at the global scope. In Odin, procedures can be nested within procedures and as a result, determining which procedure should be used, in the case of implicit overloading, is complex.

Explicit overloading has many advantages:

* Explicitness of what is overloaded
* Able to refer to the specific procedure if needed
* Clear which scope the entity name belongs to

```odin
foo :: proc{
    foo_bar,
    foo_baz,
    foo_baz2,
    another_thing_entirely,
}
```

### Why does Odin not have operator overloading?
The design goals of Odin were explicitness and simplicity.  Operator overloading is very easily abused and can be used to do many magical things. A procedure is clearer and more explicit.

Array programming is available in Odin; this removes some of the need for operator overloading when creating mathematical libraries.

### What does `distinct` do?
`distinct` makes a type declaration distinct from its base type.

```odin
Int_Alias :: int
#assert(Int_Alias == int)

My_Int :: distinct int
#assert(My_Int != int)
```

### What is the type of `x` in `x := 123`?
`123` is an untyped integer literal: if the type has not been specified in the declaration, the default type for the "untyped" type will be chosen. In this case, `x` will be of type `int`.

| Untyped type | Default Type    |
|--------------|-----------------|
| boolean      | `bool`          |
| integer      | `int`           |
| float        | `f64`           |
| complex      | `complex128`    |
| quaternion   | `quaternion256` |
| rune         | `rune`          |
| string       | `string`        |
| nil          | *               |
| undef        | *               |
| type (not first class) | *     |

\* if there is no default type for the untyped type, the type of the value cannot be inferred and this will cause an error.

### What is the size of `int`?
`size_of(int) = size_of(uint) >= size_of(uintptr) = size_of(rawptr)`. For portability, code that relies on a particular size of value should use an explicitly sized type, like `i64`. `int` and `uint` are guaranteed to be big enough to represent a pointer; however, please use `uintptr` to represent a pointer.

Floating-point types and complex types are always sized, because the programmer should be aware of precision.

### Which of `f32` and `f64` should I prefer for floating-point mathematics?
The choice is dependent on the purpose of the program. The default floating point type is `f64` so if in doubt, prefer `f64`.

### What is `rune`?
A `rune` is a basic type that is used to represent individual Unicode code points. It is equivalent to an `i32` internally but they are not the same type.

Character literals such as `'g'`, `'芋'`, and `'\u0123'` are all untyped runes, with the default type `rune`. Character literals can be used as numbers and can convert to any number type.


## Values
### Why does Odin not have implicit numeric type conversions?

Implicit conversions complicate things and would be difficult to make consistent across architectures. To increase portability and to simplify the language, Odin uses explicit conversion.

In C, the convenience provided by implicit numeric type conversion is outweighed by the confusion it causes. There are many rules in C which are not at all obvious nor simple to the reader of the code (e.g. is this expression unsigned? does this expression over/under-flow? etc).

The exceptions to this are that: all pointer types can automatically coerce to a `rawptr`, and untyped constants can be converted to a type - if that conversion is valid. The constant system does reduce a lot of the issues regarding types as "numbers just work"; there is no need for literal suffixes like in C.

Most programmers spend most of their time _reading_ code; not _writing_ code. And that has been a big design in Odin: making it clear to the reader what is going on in the program. In most cases Odin has been optimized for the _reader_ of code more than the _writer_ of code; as a result this can annoy the _writer_ in certain cases when there requires a lot of explicit type conversions.

### Why are slices, dynamic arrays, and maps references whilst arrays are values?
This is mostly because it "felt" right and is very convenient. Having them as values would require many allocations and may even require automatic memory management to handle correctly.

### Why can I not index/address a constant with a variable?

```odin
// Common Example of the Error

FOO :: [3]f32{1, 2, 3}

i: int = ...
x := FOO[i] // error since `FOO` is a compile-time known constant which only exists at compile-time

```

In Odin, `::` and `:=` are two different ways to declare named values. `:=` is shorthand for declaring a runtime-known variable with an inferred type. `::` is shorthand for declaring a compile-time-known constant value with an inferred type.

For people coming from C, Odin's `::` is closer to `#define` than it is `static const`. The named "constants" in Odin only exist at compile-time and must be instantiated as a variable in order to be addressed/index.

To achieve similar behaviour to C's `static const`, apply the `@(rodata)` attribute to a variable declaration (`:=`) to state that the data must live in the read-only data section of the executable.

```odin
// Common Example of the desired behaviour

@(rodata)
FOO := [3]f32{1, 2, 3}

i: int = ...
x := FOO[i] // allowed since `FOO` is a runtime-known variable

```


## Procedures
### Why is it named `proc`?
_Procedure_ used to be the common term as opposed to a function or subroutine. A function is a mathematical entity that has no side effects. A subroutine is something that has side effects but does not return anything.

A procedure is a superset of functions and subroutines. A procedure may or may not return something. A procedure may or may not have side effects.

### Why does Odin not have any methods?
We believe that data and code should be separate concepts; data should not have "behaviour".

Use a procedure.

### But really, why does Odin not have any methods?

Odin is an imperative procedural language by design, but if it was to add _methods_ as a construct, it has to be asked what kind of "methods" are wanted in the first place:

* Are they "mere methods" where you can associate a procedure/function with a data type?
    * Are they primarily just for organizational purposes or structural?
* Are they going to be used in a more traditional inheritance hierarchy?
    * Will things have to adhere to an interface or something else?
    * Is multiple-inheritance going to be allowed?
* Are they going to be part of a typeclass system?
    * Are they implicit (like Go) or explicit (like Rust)?
* Are they implemented with dynamic dispatch or static dispatch or even general message passing (e.g. Objective-C)?
* Will constructors and destructors be necessary?
* Will any data types be allowed to have methods or are they be restricted to `class`es?
    * If they are bound to a `class`, are they defined within the body of the `class`?
        * Will you have the concepts of class-level `public`/`private` (and even `protected`/`friend`)?
    * If they work on any data type, will they be restricted to their definition within the "library/package" or anyone anywhere can append methods to a type?
* Will Odin allow for extra sugar for getter/setter accessors/properties?
* And many more questions...

This is actually the main reason Odin doesn't have methods in the language: it's a rabbit hole feature which requires asking a lot of questions.

If Odin was to add them, it would not make sense to just add "mere methods" because that would effectively just be wanting a syntactic choice at the end of the day more than anything, and not really offer anything in terms of semantics.

It also bifurcates the language further leading more possible dialects of the language. Where some people prefer `foo(&x)` and others prefer `x.foo()`. A huge aspect of the design of Odin is to minimize (not eliminate) the possibility of dialects.


### How do I define a procedure with a different calling convention?
```odin
proc "c" ()
proc "cdecl" ()
proc "stdcall" ()
proc "fastcall" ()
proc "odin" ()
proc "contextless" ()
proc "naked" ()
```

### Does Odin have closures?

Odin only has non-capturing lambda procedures. For capturing closures to function consistently across all contexts under a unified procedure type (alongside non-capturing procedure values), some form of automatic memory management is required. This does not necessarily imply garbage collection or ARC, but could involve a mechanism similar to RAII (with allocation and deallocation of the closure's memory coupled with copy/move constructors). Even so, this remains automatic and runs counter to Odin’s core philosophy.

```odin
foo :: proc() {
    y: int
    x := proc() -> int {
        // `y` is not available in this scope as it is in a different stack frame
        return 123
    }
}
```


### Why are maps built-in?

The same reason why strings and dynamic arrays are: they are such a useful, powerful, and important data structure that providing an excellent first class implementation with syntactic support makes programming more of a joy. Odin's main implementation of `map` types are strong for the vast majority of use cases. If something specific is needed, it is possible to write your own but it will not benefit from the same convenient syntax. We believe that this is a reasonable trade-off between clarity and flexibility.

## Context System
### What is the context system for?

In each scope, there is an implicit value named `context`. This `context` variable is local to each scope and is implicitly passed by pointer to any procedure call in that scope (if the procedure has the Odin calling convention).

The main purpose of the implicit context system is for the ability to intercept third-party code and libraries and modify their functionality. One such case is modifying how a library allocates something or logs something. In C, this was usually achieved with the library defining macros which could be overridden so that the user could define what they wanted. However, not many libraries supported this in many languages by default which meant intercepting third-party code to see what it does and to change how it does it is not possible.

Please see the overview section on the [implicit context system](/docs/overview/#implicit-context-system) for more information.


## Pointers and Allocation
### When are procedure parameters passed by value?
In Odin, procedure parameters are immutable values. This allows Odin to optimize how procedure values are passed. If it is more efficient to pass them by value (making a copy) or more efficient to pass them as an immutable pointer internally, it does not matter from a user perspective as the parameter value is immutable (because of the Odin calling conventions).

Passing a pointer value makes a copy of the pointer, not the data it points to. Slices, dynamic arrays, and maps behave like pointers in this case (internally they are structures that contain values, which include pointers and the "structure" and may be passed as an immutable pointer internally for performance).

Originally, continuing the C family tradition, everything in Odin was passed by value. However, for performance reasons, this behaviour was changed for the Odin calling conventions.



### What is the difference between `new` and `make`?
`new` allocates memory.
```odin
ptr: ^int = new(int)
```

`make` initializes the slice, dynamic array, and map types.
```odin
slice: []int = make([]int, 16)
```

### What is the difference between `free` and `delete`?
`free` deallocates memory
```odin
ptr: ^int = new(int)
free(ptr)
```

`delete` deinitializes the slice, dynamic array, map, and string types.
```odin
slice := make([]int, 10)
delete(slice)

m := make(map[int]string)
delete(m)

str: string = ...
delete(str)
```


## Packages
### How do I create a multiple file package?
Put all the `.odin` source files for a package in a directory. Source files must have the same `package` declaration. All source files within a package can refer to items from other files. There is no need for a forward declarations or a header file like in C.


### Why isn't X in the core library?
The core library is not yet complete. However when it is complete, it will remain small, as its purpose is to support the runtime, operating system specific calls, formatted I/O, and other key functionality that most Odin programs require.

### Why are package declarations required in every file?
All source files must have a `package` declaration at the top of the file which share the same name. This `package` declaration at the top of the file exists for consistent ABI, so that link names (except parametric polymorphic procedures and anonymous procedures) are deterministic and clear what they are. As Odin is trying to be a form of C alternative, having a deterministic link name is extremely useful for external tooling such as debuggers.

The directory name nor any sort of relative path cannot be used to generate this import name (like other languages like Go) as Odin does not have a concept of a singular absolute root directory where all import paths come from. The name also has to be unique project-wide, so the directory name is not a good way to enforce uniqueness.

### Is there an official Odin package manager?

Odin will __never__ officially support a package manager.

#### How do I manage my code without a "package manager"?

Through manual dependency management. Regardless of the language, it is a very good idea that you know what you are depending on in your project. Copying and vendoring each package manually, and fixing the specific versions down is the most practical approach to keeping a code-base stable, reliable, and maintainable. Automated systems such as generic package managers hide the complexity and complications in a project which are much better not hidden away.

Not everything that can be automated ought to be automated. The automation of dependency hell is a case which should not encouraged. People love to put themselves in hell, dragging others down with them, and a package manager enables that.

Another issue is that for other languages, the concept of a package is ill-defined in the language itself. And as such, the package manager itself is usually trying to define the concept of what a package is, which leads to many issues. Sometimes, if there are multiple competing package managers with different definitions of what a package is, the monstrosity of a package-manager-manager arises and the hell that brings with it.


### What is the criteria for selection what packages go into the `vendor` library collection?

The criteria is approximately the following:

* Widely useable
* Does not cause tons of maintenance burden
* Ginger Bill does not hate it


### Why does Odin not have any extra "namespacing" feature alongside packages?

In Odin, packages are designed to be treated as libraries, rather than _mere organization_. People have a massive tendency to _taxonomize_ code more than absolutely necessary and as such, they will use any mechanism to do this, even if it does not benefit them or their team in the slightest. This "organization" aspect that many people ask for is virtually always a desire to _taxonomize_ rather than _organize_--these are actually quite different in practice.

The problem is that if you have TWO different ways to do very similar things (packages and explicit namespaces), even if those things are categorically different, due to this aspect of human nature, people will tend to do the thing they are more acquainted with (e.g. files as namespaces, or explicit namespaces) rather than the preferred approach (packages as libraries).

If an extra "namespacing" construct was added to allow people to either "organize" code in another way, or add another layer of indirection for taxonomization, it murkies the concept of what a package is in the language.

If "taxonomization" is __absolutely__ necessary, please prefer to prefix the identifiers of the declarations. Typing is not the bottleneck when programming, reading/scanning is.


## Syntax
### What does `:=` mean?
This is two different operators `:` and `=`; is used for variable declarations. The following are all equivalent:
```odin
x : int = 123
x :     = 123
x := 123
x := int(123)
```

### What does `::` mean?
This is two different separate operators `:` and `:`; is used for constant value declarations.
```odin
X :: 123
X :   : 123

Y : int : 123
Y :: int(123)

Z :: proc() {}
Z : proc() : proc() {} // Redundant type declaration
```

### Why does Odin not use keywords to prefix declarations?

Please see gingerBill's article [On the Aesthetics of the Syntax of Declarations](https://www.gingerbill.org/article/2018/03/12/on-the-aesthetics-of-the-syntax-of-declarations/).

### Why are there two ways to do type conversions?

```odin
cast(type)value
type(value) or (type)(value)
```

The reason that there are two ways to do type conversions is because one approach may _feel_ better than the other case. If you are converting a large expression, it sometimes a lot easier to use the operator-style approach, `cast(type)`. The call syntax is commonly used to specify a type of an expression which may be relatively short such as `u32(123)` or `uintptr(ptr)`.

There are two other type conversion operators, [transmute](/docs/overview/#type-conversion) and [auto_cast](/docs/overview/#auto-cast-operation).

### Why curly brackets?
Curly brackets to denote a block is a common approach in many programming languages, and Odin's consistency is useful for people already familiar with the style. Curly brackets also allow for more flexible syntax styles for the programmer and it is easier to parse by the compiler because it is not white space sensitive.

### Why do slice expressions use `:` and not the range syntax?

The reason for the specific syntax was done for the following reasons:

* It is the same syntax as Go and Python, making it familiar to others who have used those languages
* Allows for partial ranges e.g. `x[:]`, `x[:n]`, `x[i:]`
* Partial ranges with _two_ range expression (`a..<b` and `a..=b`) do not look aesthetically good are also inconsistent: `x[..<]` `x[..=]`, `x[..<n]` `x[..=n]`, `x[i..<]` `x[i..=]`
* Virtually all slicing cases only ever require the Python/Go like semantics because Odin is a 0-index language
* Ranges in Odin are only allowed in [a limited number of specific contexts](/docs/overview/#other-operators)

## How do I ...?
### Convert an integer to a string or vice versa?
```odin
package numbers_example

import "core:strconv"

main :: proc() {
    // We'll shortly overwrite the part of this array that we need,
    // so we use `---` to tell the compiler it doesn't have to be zero-initialized.
    buf: [64]u8 = ---

    // Format the integer to a string, using memory backed by `buf`.
    a := 4815162342
    s := strconv.itoa(buf[:], a)

    // Parse it back into an integer. We assume it's a valid base-10 representation here.
    // If you want to check it was parsed correctly or parse binary, octal or hexadecimal,
    // look at the `parse_*` procedures.
    b := strconv.atoi(s)

    assert(a == b)
}
```

## Implementation
### What does the compiler use?
The compiler is written in C++ but in a very C style.
For the current backend, LLVM is used to translate code to platform specific code. 

## Changes from C/C++
### Why is the syntax so different from C?
Other than the declaration syntax, the differences are minor. When designing the syntax, it had to feel right and light. A minimal amount of keywords and syntactic sugar. The syntax has been designed to be very easy to parse without a symbol table. This makes it easier to create build and analysis tools for Odin.

### Why are declarations backwards?
Declarations are only backwards if you are used to C. In C, declarations follow the ["clockwise/spiral rule"](http://c-faq.com/decl/spiral.anderson.html) to reflect the usage of the declaration. This can be confusing when reading.

Please see: <https://odin-lang.org/news/declaration-syntax/>

In C, the declaration:
```odin
int *a, b;
```
declares `a` to be a "pointer to int" but b to be an "int"; in Odin
```odin
a, b: ^int
```
declares both to be a "pointer to int". This is clearer and more regular. This syntax is borrowed from the Pascal family, along with using `^` to denote a pointer, as it is pointy.

Due to the style of value declarations, the type can be omitted and inferred from the declaration. The following are all equivalent:
```odin
a: int = 123
a :    = 123
a := 123
a := int(123)
```

### Why is there no pointer arithmetic?
Type safety and simplicity. Due to slices being a first-class datatype, a lot of the need for pointer arithmetic is reduced. However, if you still require it, the `mem` package provides some utility functions: `mem.ptr_offset` and `mem.ptr_sub`. Odin will allow the programmer to do unsafe things if they so wish.

If pointer arithmetic operations are still required and common (maybe due to interfacing with foreign C-like code), [multi-pointers](https://odin-lang.org/docs/overview/#multi-pointers) may be a better option to use.

### Why are there no `++` or `--` operators?
Pre-increment and post-increment, and the decrement equivalents, look simple but are complex. They require knowledge of the evaluation order and lead to subtle bugs. `f(i++)` or `a[++i] = b[i]` are both confusing, even if the rules are well defined. Removing this is a significant simplification.

`x += 1` is slightly longer but it is unambiguous.

### Does Odin have C++-style constructors?
No. The philosophy for Odin is that the zero value should be useful. By default, all variables are initialized to zero unless told otherwise with the `---` value.
```odin
x: int       // initialized to zero
y: int = 0   // explicitly initialized to zero
z: int = --- // uninitialized memory
```

### Does Odin have C++-style copy constructors?
No. All copies are byte-for-byte copies.

### Does Odin have C++-style move constructors?
No. There are no ownership semantics in Odin.

### Does Odin have C++-style destructors?
No. `defer` can be used to defer a statement till end of a scope. `defer` is explicit and much more flexible than a C++-style destructor in that it can be used for anything.
```odin
f, err := os.open(...)
if err != os.ERROR_NONE {
    // handle error
}
defer os.close(f) // will be executed at the end of the scope

...
```

### Why is `#partial switch` needed when there is a catch-all `case:`?

By default, `switch` statements which have an `enum` or `union` condition require the user to specify every case that the type defines. It is a very common mistake to forget to add a new case when a new variant is added in other languages, so Odin defaults to telling the user of this mistake. If the user wants to explicitly opt-out of this behaviour, `#partial` can be applied to the `switch` statement directly to state that not all of the cases need to be specified.

`case:` is the catch-all case which allows for anything not specified, which includes `nil` or even invalid cases (e.g. custom-user-values or corrupted cases). `#partial` and `case:` are orthogonal concepts which are used to achieve different things entirely. Each variant might be handled, but there might still be an invalid case not handled thus `case:` might still be required depending on the problem.

### Why does `#reverse` not work on ranges in `for in` loops?

* It is a lot clearer to write a normal C-style `for` loop
    * `for i := hi; i >= lo; i -= 1 {...}`
* It might not execute the way the user expects, especially for floats
    * `for i in 1.2 ..< 3.4 {...}` is valid in Odin
* It will cause off-by-one bugs in certain cases



#### Deferred Attributes

There is also the `deferred_*` attributes which can be attached to procedures to have very useful functionality, such as [IMGUIs](https://en.wikipedia.org/wiki/Immediate_Mode_GUI).


<table>
<tbody>
    <tr><td>deferred_none</td><td>the deferred procedure takes <em>none</em> of the parameters from the original procedure</td></tr>
    <tr><td>deferred_in</td><td>the deferred procedure takes the <em>input</em> parameters from the original procedure</td></tr>
    <tr><td>deferred_out</td><td>the deferred procedure takes the <em>return</em> values from the original procedure</td></tr>
</tbody>
</table>

Example:

```odin
begin_menu :: proc(name: string, flags: Flags = nil) -> (open: bool) {
    ...
}

end_menu :: proc(open := true) {
    if !open do return
    ...
}
@(deferred_out=end_menu)
menu :: proc(name: string, flags: Flags = nil) -> (open: bool) {
    return begin_menu(name, flags)
}


if begin_menu("Hello") {
    defer end_menu()
}

if menu("Hello") {

}
```

## Compiler

### What architectures does Odin support?

The official implementation of Odin currently supports: `amd64`, `arm64` (aarch64), and `wasm32`/`wasm64p32`.

Note: `wasm64p32` is a pseudo-architecture which has 32-bit pointers but 64-bit `int`/`uint`, but fundamentally the same as `wasm32`. IT IS NOT THE SAME AS `wasm64`.

### Why does Odin require the MSVC toolchain on Windows?

From _Ginger Bill_ directly:

> For C/C++ development on Windows, there are two main toolchains: MSVC and MinGW.
>
> For C, they are _meant to be_ ABI compatible in theory, but in practice they are not for non-obvious reasons.
>
> For C++, their ABIs are incompatible. Most third-party libraries that precompiled will also assume the MSVC toolchain, and not MinGW. MinGW is also kind of a mess in itself. So outside of libc/libc++, you will suffer.
>
> As for the C aspect, some libraries that provide a C interface may actually rely on specific C++ symbols directly, and assume that they will exist because of ABI assumptions of that toolchain. This does happen in practice, even if it is rare.
>
> Most people appear to want MinGW just to minimize the amount of stuff that they require to download, but in short, you are going to need to download the Windows SDK (and other libraries) any way. This is the problem of developing on Windows&mdash;you effectively need to use Microsoft's toolchain.
>
> There are some unofficial tools out there (see <https://github.com/Data-Oriented-House/PortableBuildTools>) that allow you to download a standalone MSVC compiler/linker/etc without having install Visual Studio; contains only the bare minimum components.

### Does the Odin compiler implement Return Value Optimization (RVO)?

Since Odin does not have constructors nor destructors, there is no proper need for Return Value Optimization (RVO). Any value outside of the conventions of `new`/`free` and `make`/`delete` live on "the stack". Even structs do not have constructors.

By default, all memory is initialized to zero; there is no way to set a default value to any other value (e.g. fields on a complex data structure). Zero initialization is a property of the memory allocation API in Odin too.

Odin's calling convention will try to optimize for performance but RVO is not an "optimization" that is needed in Odin.

### Is the Odin compiler self hosted?

Odin is not currently self hosted nor will be until _after_ version 1.0 when the main implementation of the Odin compiler adheres to a specification and is heavily tested. In general, self hosting before a stable language and compiler exists is masturbatory pleasure.

### Where is the Odin roadmap?

There is no official roadmap. Public roadmaps are pretty much a form of marketing for the language rather than being anything useful for the development team. The development team does have internal goals, many of which are not viewable by the public, and problems are dealt with when and as necessary.

Odin as a language is pretty much done, but Odin the compiler, toolchain, and core library are still in development and always improved. If you want to help out with any of this, try checking out the source code: <https://github.com/odin-lang/Odin>.


## Quotes

> Show me your flowcharts and conceal your tables, and I shall continue to be mystified. Show me your tables, and I won’t usually need your flowcharts; they’ll be obvious.

* Fred Brooks, _The Mythical Man-Month: Essays on Software Engineering_ (1975, 1995)

> A little retrospection shows that although many fine, useful software systems have been designed by committees and built as part of multipart projects, those software systems that have excited passionate fans are those that are the products of one or a few designing minds, great designers.

* Fred Brooks, _No Silver Bullet_

> The language designer should be familiar with many alternative features designed by others, and should have excellent judgment in choosing the best and rejecting any that are mutually inconsistent... One thing he should not do is to include untried ideas of his own. His task is consolidation, not innovation.

* C.A.R. Hoare

> The most important property of a program is whether it accomplishes the intention of its user

* C.A.R. Hoare

> Most ideas come from previous ideas.

* Alan C. Kay, _The Early History Of Smalltalk_

> Reliable and transparent programs are usually not in the interest of the designer.

* Niklaus Wirth, _A Digital Contrarian Retires_ (1999)

> ... we do not consider it as good engineering practice to consume a resource lavishly just because it happens to be cheap

* Niklaus Wirth, _Project Oberon_

> Increasingly, people seem to interpret complexity as sophistication, which is baffling – the incomprehensible should cause suspicion, not admiration. Possibly this results from the mistaken belief that using a mysterious device confers [extra] power on the user.

* Niklaus Wirth
