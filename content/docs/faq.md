---
title: "Frequently Asked Questions"
url: "/docs/faq"
show_table_of_contents: true
---

## General

### What is the history of the project?
The project started one evening in late July 2016 when Ginger Bill was annoyed with programming in C++. The language began as a Pascal clone (with `begin` and `end` and more) but changed quite quickly to become something else.

Bill originally tried to create a preprocessor for C to augment and add new capabilities to the language however, found this endeavour a dead-end. That evening was the point at which Bill decided to create an entirely new language from scratch than trying to augment C.

### What have been the major influences in the language's design?
The language borrows heavily from (in order of philosophy and impact): Pascal, C, Go, Oberon.

[Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth) and [Rob Pike](https://en.wikipedia.org/wiki/Rob_Pike) have been the programming language design idols throughout this project.

### How is Odin licensed?
The Odin compiler and the library are under the [BSD 2-Clause license](https://github.com/odin-lang/Odin/blob/master/LICENSE).

### Does Odin have any third-party library?
Check out a few selected libraries at https://github.com/odin-lang/odin-libs.

### What does Odin offer over other languages?

A quick overview of features (in no particular order):

* Full UTF-8 Support
* Custom allocators that are simple to use:
    * Memory arenas/regions, pools, stacks, etc. which can be easily added
* [Context system](#context-system) for allocations, logging, and thread data
* Built-in types and procedures that take advantage over the context system:
    * `new(type)`, and `make` use the context's allocator (unless explicitly given)
    * Dynamic arrays and hash maps (`[dynamic]int` and `map[string]int`)
* Array programming
    * `a, b: [4]f32; c := a * b;`
    * `i := a.x * b.y;`
    * `v := swizzle(a, 1, 2, 0);`
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
    * `x: int = 1;`
    * `x := 1; // x is deduced to be an int`
* `using`
    * making everything a namespacing (similar to Pascal's `with` but on steroids)
    * Ability to have [subtype polymorphism](#is-odin-an-objective-oriented-language)
* Multiple return values
* Clean, consistent, and fast to parse syntax
* No need for procedure prototypes
* [`defer` statements](/docs/overview/#defer-statement)
    * defer a statement until the end of scope (akin to D's `scope(exit)`)
* Nested procedures and types
* Tagged unions and untagged unions
* Ranged `for` loops
* [Labelled branches](/docs/overview/#branch-statements)
    * `break label_name;`
* `break` by default in `switch` statements
    * Explicit `fallthrough`
* "Raw" strings
    * ``` x := `what "the" string?`; ```
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
### Is Odin an objective oriented language?
No. Data structures as just data.

Subtype polymorphism is possible through the use of `using` but Odin does not offer methods.
```odin
Base :: struct {...};
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
};
```

### Why does Odin not have operator overloading?
The design goals of Odin were explicitness and simplicity.  Operator overloading is very easily abused and can be used to do many magical things. A procedure is clearer and more explicit.

Array programming is available in Odin; this removes some of the need for operator overloading when creating mathematical libraries.

### What does `distinct` do?
`distinct` makes a type declaration distinct from its base type.

```odin
Int_Alias :: int;
#assert(Int_Alias == int);

My_Int :: distinct int;
#assert(My_Int != int);
```

### What is the type of `x` in `x := 123;`?
`123` is an untyped integer literal, if the type has not been specified in the declaration, the default type for the "untyped" type will be chosen. In this case, `x` will be of type `int`.

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

\* if there is no default type for the untyped type, the type of the value cannot be inferred and this will cause an error.

### What is the size of `int`?
`size_of(int) = size_of(uint) = size_of(rawptr)`. For portability, code that relies on a particular size of value should use an explicitly sized type, like `i64`. `int` and `uint` are guaranteed to be big enough to represent a pointer however, please use `uintptr` to represent a pointer.

For floating-point types and complex types, they are always sized because the programmer should be aware of precision.

### Which of `f32` and `f64` should I prefer for floating-point mathematics?
The choice is dependent on the purpose of the program. The default floating point type is `f64` so if in doubt, prefer `f64`.

### What is `rune`?
A `rune` is a basic type that is used to represent individual Unicode code points. It is equivalent to an `i32` internally but they are not the same type.

Character literals such as `'g'`, `'芋'`, and `'\u0123'` are all untyped runes, with the default type `rune`. Character literals can be used as numbers and can convert to any number type.


## Values
### Why does Odin not have implicit numeric type conversions?

Implicit conversions complicate and would be difficult to make consistent across architectures. To increase portability and to simplify the language, Odin uses explicit conversion.

In C, the confusion caused by implicit numeric type conversions is outweighed by the convenience it provides. There are many rules in C which are not at all obvious nor simple to the reader of the code (e.g. is this expression unsigned@ does this expression over/under-flow? etc).

The exceptions to this being all pointer types can automatically coerce to a `rawptr` and untyped constants can be convert to a type if that conversion is valid. The constant system does reduce a lot of the issues regarding types as "numbers just work"; there is no need for literally suffixes like in C.

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
    y: int;
    x := proc() -> int {
        // `y` is not available in this scope as it is in a different stack frame
        return 123;
    };
}
```

## Context System
### What is the context system for?
TODO(bill)

## Pointers and Allocation
### When are procedure parameters passed by value?
Continuing the C family tradition, everything in Odin is passed by value. The procedure always gets a copy of the thing that has been passed, as if there was an assignment statement to the procedure parameter.

Passing a pointer value makes a copy of the pointer, not the data it points to it. Slices, dynamic arrays, and maps behave like pointers in this case (Internally they are structures that contain values, which include pointers and the "structure" is passed by value).

### What is the difference between `new` and `make`?
`new` allocates memory.
```odin
ptr: ^int = new(int);
```

`make` initializes the slice, dynamic array, and map types.
```odin
slice: []int = make([]int, 16);
```

### What is the difference between `free` and `delete`?
`free` deallocates memory
```odin
ptr: ^int = new(int);
free(ptr);
```

`delete` deinitializes the the slice, dynamic array, map, and string types.
```odin
slice := make([]int, 10);
delete(slice);

m := make(map[int]string);
delete(m);

str: string = ...;
delete(str);
```


## Packages
### How do I create a multiple file package?
Put all the `.odin` source files for a package in a directory. Source files must have the same `package` declaration. All source files within a package can refer to items from other files. There is no need for a forward declarations or a header file like in C.


### Why isn't X in the core library?
The core library is not yet complete. However when it is complete, it will be small as its purpose is to support the runtime, operating system specific calls, formatted I/O, and other key functionality that most Odin programs require.


## Syntax
### What does `:=` mean?
This is two different operators `:` and `=`; is used for variable declarations. The following are all equivalent:
```odin
x : int = 123;
x :     = 123;
x := 123;
x := int(123);
```

### What does `::` mean?
This is two different separate operators `:` and `:`; is used for constant value declarations.
```odin
X :: 123;
X :   : 123;

Y : int : 123;
Y :: int(123);

Z :: proc() {};
Z : proc() : proc() {}; // Redundant type declaration
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

### Why semicolons?
Semicolons are used to denote the termination of a statement. If semicolons where made optional, it would mean enforcing a coding style either through sensitive white space (Python-esque) or curly brace positioning (automatic semicolon insertion). With semicolons, the programmer is free to decide what style is best suited for his needs.

## Implementation
### What does the compiler use?
The compiler is written in C++ but in a very C style.
For the current backend, LLVM is used to translate code to platform specific code. A custom backend is in development.

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
a, b: ^int;
```
declares both to be a "pointer to int". This is clearer and more regular. This syntax is borrowed from the Pascal family, along with using `^` to denote a pointer, as it is pointy.

Due to the style of value declarations, the type can be omitted and inferred from the declaration. The follwoing are all equivalent:
```odin
a: int = 123;
a :    = 123;
a := 123;
a := int(123);
```

### Why is there no pointer arithmetic?
Type safety and simplicity. Due to slices being a first-class datatype, a lot of the need for pointer arithmetic is reduced. However, if you still require it, the `mem` package provides so utility functions: `mem.ptr_offset` and `mem.ptr_sub`. Odin will allow the programmer to do unsafe things if he wishes so.

### Why are there no `++` or `--` operators?
Pre-increment and post-increment, and the decrement equivalents, look simple but are complex. They require knowledge of the evaluation order and lead to subtle bugs. `f(i++)` or `a[++i] = b[i]` are both confusing, even if the rules are well defined. Removing this is a significant simplification.

`x += 1;` is slightly longer but it is unambiguous.

### Does Odin have C++-style constructors?
No. The philosophy for Odin is that the zero value should be useful. By default, all variables are initialized to zero unless told otherwise with the `---` value.
```odin
x: int;       // initialized to zero
y: int = 0;   // explicitly initialized to zero
z: int = ---; // uninitialized memory
```

### Does Odin have C++-style copy constructors?
No. All copies are byte-for-byte copies.

### Does Odin have C++-style move constructors?
No. There are no ownership semantics in Odin.

### Does Odin have C++-style destructors?
No. `defer` can be used to defer a statement till end of a scope. `defer` is explicit and much more flexible than a C++-style destructor in that it can be used for anything.
```odin
f, err := os.open(...);
if err != os.ERROR_NONE {
    // handle error
}
defer os.close(f); // will be executed at the end of the scope

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
    if !open do return;
    ...
}
@(deferred_out=end_menu)
menu :: proc(name: string, flags: Flags = nil) -> (open: bool) {
    return begin_menu(name, flags);
}


if begin_menu("Hello") {
    defer end_menu();
}

if menu("Hello") {

}
```



