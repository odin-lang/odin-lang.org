---
title: Odin's Declaration Syntax
summary: Odin's Declaration Syntax Compared With C
slug: declaration-syntax
author: Ginger Bill
date: '2022-02-25'
categories:
  - syntax
  - declaration
  - c
  - odin
---

Newcomers to Odin from C-like languages often ask why the declaration syntax is different, or even "opposite" to what they are used to. In this article, we will compare the two languages and explain why I arrived at Odin's declaration syntax.

## C's Syntax


The declaration syntax in C is often thought of as "type first", i.e. type declaration and usage in an expression share the same syntax[^clockwise]. Therefore:

[^clockwise]: Many think of C's declarations to be read in a "spiral": http://c-faq.com/decl/spiral.anderson.html

```c
int x;
```

declares `x` to be an `int`, or more correctly, the expression `x` will have type `int`. Determining how to write the type for a variable declaration involves writing an expression that evaluates the variable's type completely.


```c
int *ptr;
```
states that `ptr` is a pointer to `int` because `*ptr` has type `int`.

```c
int array[3];
```
states that `array` is an array of three ints because `array[0]` has type `int`.


Following these rules, more complex types can be built up:

```c
int *a[3];
```
states that `a` is an array 3 of pointer to `int` because `*a[0]` has type `int`.

```
int (*b)[3]; // pointer to array 3 of int
```
states that `b` is a pointer to array 3 `int` because `(*b)[0]` has type `int`.

### Procedures

In the "original" pre-standardized C, procedure declarations express their types after the parameters names[^implicit-int]:
```c
int main(argc, argv)
	int argc;
	char *argv[];
{
	...
}
```

[^implicit-int]: in those versions of C, if the type was never declared (including the return type), everything was assumed to be of type `int`.

Contemporary C's declaration-matches-usage was merged, making it more familiar:

```c
int main(int argc, char *argv[]) {
	...
}
```

This idea worked well enough in general, but it started to become unwieldy as soon as the programmer wants to declare a procedure pointer:

```c
int (*pp)(int x, int y);
```

Where `pp` is pointer to a procedure because if `(*pp)(x, y)` is written[^procedure-shorthand], it is a call that returns an `int`.

[^procedure-shorthand]: It should be noted that C allows for a shorthand where the programmer does not have to explicitly dereference the procedure pointer so `pp(x, y)` is valid, but it is still required to declare the procedure as a pointer to a procedure because the procedure has an unknown size.

This is what is required to use `pp` as one of the parameters of the procedure itself:
```c
int (*qp)(int (*pp)(int x, int y), int b);
```

This is now really difficult to read without using `typedef` declarations.

Removing the identifier to turn a procedure's signature into a declaration can result in dense, confusing syntax:
```c
int main(int, char *[])
int (*)(int, int)
int (*qp)(int (*)(int x, int y), int b)
```

And what if if the procedure pointer `qp` needed to return another procedure pointer instead of `int`?

```c
int (*(*qp)(int (*)(int, int), int))(int, int)
```


### Type Qualifiers

C has many different [type qualifiers](https://docs.microsoft.com/en-us/cpp/c-language/type-qualifiers) to indicate specific behaviour of a type. The following is an example of many of them applied to one huge declaration:

```c
_Atomic unsigned long long int const volatile *restrict foo[]; // Yeah...
```

An interesting thing about type qualifiers is that they can be in different places and still express the same thing:

```c
int const x;
const int x;

const int *y;
int const *y;
```

And `typedef` has the same behaviour too:
```c
typedef int my_int;
int typedef my_int;
```

### Symbol Table

C requires a symbol table to parse to disambiguate between type declarations and an expression, e.g.:
```
foo * bar;
```

At first glance, it is impossible to know if this an expression or a declaration, and the compiler must use a symbol table to differentiate them whilst parsing.

## Odin Syntax

Odin's approach is much closer to that of a Pascal-style approach, which is a lot easier to read, parse, and comprehend:

```odin
x:     int
ptr:   ^int
array: [3]int
```

where `x` is a variable of type `int`, `ptr` is a pointer to `int`, and `array` is an array 3 of `int`s.

Unlike C, there is no relation between the type `[3]int` and how it will be used in an expression. Readability and simplicity is gained, at the "expense" of separating declaration and usage syntax:

```odin
array: [3]int
x = array[i]

ptr: ^int
x = ptr^
```
**Note:** Odin borrows the `^` syntax for pointers from the Pascal family, because it is pointy and allows for consistent usage of the type-on-left (i.e. `^int`, a pointer to an `int`), and usage-on-right (`x^`, dereference a pointer to an `int`) idiom.

### Procedures

Odin's procedure syntax follows a very similar approach as with other variable declarations. Odin's entry point doesn't take or return anything, but if the C form is transliterated into Odin:

```odin
main :: proc(argc: int, argv: []string) -> int {
	...
}
```

This specific example may not be that much different from C other than the `char *` to `string`, but the entire declaration is readable from left-to-right:

`main` is declared a procedure that takes an `int` and a slice of `string`s, and returns an `int`, with a defined body.

**Note:** A proper semantic translation of that signature would be `proc "c" (argc: c.int, argv: [^]cstring) -> c.int`, but for understandability of this article, a transliteration is done to keep things understandable.

One of the beautiful aspects of this style is that it is very easy to drop the procedure's parameter names and there is absolutely no confusion:
```odin
main :: proc(int, []string) -> int {
	...
}
```

Another wonderful aspect of the ability to read-left-to-right is that more complex types are easier to comprehend. Transliterating the C examples for the procedure pointers into the analogous procedure variables in Odin:

```odin
qp: proc(pp: proc(x: int, y: int) -> int, b: int) -> int
```
or if `qp` was to return a procedure:
```odin
qp: proc(pp: proc(x: int, y: int) -> int, b: int) -> proc(int, int) -> int
```
or with all the parameter names removed:
```odin
qp: proc(proc(int, int) -> int, int) -> proc(int, int) -> int
```

All of these declarations are still read very clearly from left-to-right, and it is still obvious without names what is declared where.


### Syntactic Meaning of `:`

Unlike C, Odin uses `:` to separate the name from the type in a value declaration. This symbol allows for the ability for the type be omitted and inferred from the declaration. The following are all equivalent:

```odin
x : int = 123
x :     = 123
x := 123
x := int(123)
```

**Note:** it is more common to see `x: int = 123` where the `:` is attached to the variable name itself

This syntax has its origins in the language [Newsqueak](https://swtch.com/~rsc/thread/newsqueak.pdf). It can be thought of that `:` declares and `=` assigns; it is not a single token [`:=`](/docs/faq/#what-does--mean).

Odin also has a different kind of declaration for constant value declarations:

```odin
X :: 123
X :   : 123

Y : int : 123
Y :: int(123)

Z :: proc() {...}
Z : proc() : proc() {...} // Redundant type declaration
```

Here the first `:` still declares, whilst the second `:` defines; it is not a single token [`::`](/docs/faq/#what-does--mean-1).

**Note:** Constant value declarations are compile known values and not equivalent to C's `const` (an immutable [runtime] variable) but closer to C's `#define` in terms of semantics.