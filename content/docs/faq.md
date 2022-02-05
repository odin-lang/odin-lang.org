---
title: "Frequently Asked Questions"
linktitle: FAQ
summary: Answers to commonly asked questions about Odin.
weight: 3
---

## General

### What is the history of the project?
The project started one evening in late July 2016 when Ginger Bill was annoyed with programming in C++. The language began as a Pascal clone (with `begin` and `end` and more) but changed quite quickly to become something else.

Bill originally tried to create a preprocessor for C to augment and add new capabilities to the language. However, he found this endeavour a dead-end. That evening was the point at which Bill decided to create an entirely new language from scratch instead of trying to augment C.

### What have been the major influences in the language's design?
The language borrows heavily from (in order of philosophy and impact): Pascal, C, Go, Oberon.

[Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth) and [Rob Pike](https://en.wikipedia.org/wiki/Rob_Pike) have been the programming language design idols throughout this project.

### How is Odin licensed?
The Odin compiler and the library are under the [BSD 3-Clause license](https://github.com/odin-lang/Odin/blob/master/LICENSE).

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

| Untyped type | Default Type |
|--------------|--------------|
| boolean      | `bool`       |
| integer      | `int`        |
| float        | `f64`        |
| complex      | `complex128` |
| rune         | `rune`       |
| string       | `string`     |
| nil          | *            |
| undef        | *            |
| type (not first class) | *  |

\* if there is no default type for the untyped type, the type of the value cannot be inferred and this will cause an error.

### What is the size of `int`?
`size_of(int) = size_of(uint) = size_of(rawptr)`. For portability, code that relies on a particular size of value should use an explicitly sized type, like `i64`. `int` and `uint` are guaranteed to be big enough to represent a pointer; however, please use `uintptr` to represent a pointer.

Floating-point types and complex types are always sized, because the programmer should be aware of precision.

### Which of `f32` and `f64` should I prefer for floating-point mathematics?
The choice is dependent on the purpose of the program. The default floating point type is `f64` so if in doubt, prefer `f64`.

### What is `rune`?
A `rune` is a basic type that is used to represent individual Unicode code points. It is equivalent to an `i32` internally but they are not the same type.

Character literals such as `'g'`, `'芋'`, and `'\u0123'` are all untyped runes, with the default type `rune`. Character literals can be used as numbers and can convert to any number type.


## Values
### Why does Odin not have implicit numeric type conversions?

Implicit conversions complicate things and would be difficult to make consistent across architectures. To increase portability and to simplify the language, Odin uses explicit conversion.

In C, the confusion caused by implicit numeric type conversions is outweighed by the convenience it provides. There are many rules in C which are not at all obvious nor simple to the reader of the code (e.g. is this expression unsigned does this expression over/under-flow? etc).

The exceptions to this are that: all pointer types can automatically coerce to a `rawptr`, and untyped constants can be converted to a type - if that conversion is valid. The constant system does reduce a lot of the issues regarding types as "numbers just work"; there is no need for literal suffixes like in C.

Most programmers spend most of their time _reading_ code; not _writing_ code. And that has been a big design in Odin: making it clear to the reader what is going on in the program. In most cases Odin has been optimized for the _reader_ of code more than the _writer_ of code; as a result this can annoy the _writer_ in certain cases when there requires a lot of explicit type conversions.

### Why are slices, dynamic arrays, and maps references whilst arrays are values?
This is mostly because it "felt" right and is very convenient. Having them as values would require many allocations and may even require automatic memory management to handle correctly.

## Procedures
### Why is it named `proc`?
_Procedure_ used to be the common term as opposed to a function or subroutine. A function is a mathematical entity that has no side effects. A subroutine is something that has side effects but does not return anything.

A procedure is a superset of functions and subroutines. A procedure may or may not return something. A procedure may or may not have side effects.

### Why does Odin not have any methods?
We believe that data and code should be separate concepts; data should not have "behaviour".

Use a procedure.

### How do I define a procedure with a different calling convention?
```odin
proc "c" ()
proc "cdecl" ()
proc "stdcall" ()
proc "fastcall" ()
proc "odin" ()
proc "contextless" ()
proc "none" ()
```

### Does Odin have closures?
Odin only has non-capturing lambda procedures. For closures to work correctly would require a form of automatic memory management which will never be implemented into Odin.

```odin
foo :: proc() {
    y: int
    x := proc() -> int {
        // `y` is not available in this scope as it is in a different stack frame
        return 123
    }
}
```

## Context System
### What is the context system for?

In each scope, there is an implicit value named `context`. This `context` variable is local to each scope and is implicitly passed by pointer to any procedure call in that scope (if the procedure has the Odin calling convention).

The main purpose of the implicit context system is for the ability to intercept third-party code and libraries and modify their functionality. One such case is modifying how a library allocates something or logs something. In C, this was usually achieved with the library defining macros which could be overridden so that the user could define what he wanted. However, not many libraries supported this in many languages by default which meant intercepting third-party code to see what it does and to change how it does it is not possible.

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

`delete` deinitializes the the slice, dynamic array, map, and string types.
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

### Why are two ways to do type conversions?

```odin
cast(type)value
type(value) or (type)(value)
```

The reason that there are two ways to do type conversions is because one approach may _feel_ better than the other case. If you are converting a large expression, it sometimes a lot easier to use the operator-style approach, `cast(type)`. The call syntax is commonly used to specify a type of an expression which may be relatively short such as `u32(123)` or `uintptr(ptr)`.

There are two other type conversion operators, [transmute](/docs/overview/#type-conversion) and [auto_cast](/docs/overview/#auto-cast-operation).

### Why curly brackets?
Curly brackets to denote a block is a common approach in many programming languages, and Odin's consistency is useful for people already familiar with the style. Curly brackets also allow for more flexible syntax styles for the programmer and it is easier to parse by the compiler because it is not white space sensitive.

## Implementation
### What does the compiler use?
The compiler is written in C++ but in a very C style.
For the current backend, LLVM is used to translate code to platform specific code. 

## Changes from C/C++
### Why is the syntax so different from C?
Other than the declaration syntax, the differences are minor. When designing the syntax, it had to feel right and light. A minimal amount of keywords and syntactic sugar. The syntax has been designed to be very easily to parse without a symbol table. This makes it easier to create build and analysis tools for Odin.

### Why are declarations backwards?
Declarations are only backwards if you are used to C. In C, declarations follow the ["clockwise/spiral rule"](http://c-faq.com/decl/spiral.anderson.html) to reflect the usage of the declaration. This is can be confusing when reading.

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
Type safety and simplicity. Due to slices being a first-class datatype, a lot of the need for pointer arithmetic is reduced. However, if you still require it, the `mem` package provides so utility functions: `mem.ptr_offset` and `mem.ptr_sub`. Odin will allow the programmer to do unsafe things if he wishes so.

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

#### Deferred Attributes

There is also the `deferred_*` attributes which can be attached to procedures to have very useful functionality, such as [IMGUIs](https://en.wikipedia.org/wiki/Immediate_Mode_GUI).


<table>
<tbody>
    <tr><td>deferred_none</td><td>the deferred procedure takes _none_ of the parameters from the original procedure</td></tr>
    <tr><td>deferred_in</td><td>the deferred procedure takes the _input_ parameters from the original procedure</td></tr>
    <tr><td>deferred_out</td><td>the deferred procedure takes the _return_ values from the original procedure</td></tr>
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

## Is the Odin compiler self hosted?

Odin is not currently self hosted nor will be until _after_ version 1.0 when the main implementation of the Odin compiler adheres to a specification and is heavily tested. In general, self hosting before a stable language and compiler exists is masturbatory pleasure.

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
