---
title: Attributes
summary: The attributes which change how declarations are compiled or behave.
weight: 10
---

Attributes modify the compilation details or behaviour of declarations.

## General attributes

### User tag which is ignored by the compiler

* [`@(tag=<string>)`](#tagstring) -- works on ANY declaration

### Non-user code

* [`@(builtin)`](#builtin) --- marks builtin declarations in Odin's `base:runtime` package. Cannot be used in user code

### Foreign blocks

* [`@(default_calling_convention=<string>)`](#default_calling_conventionstring) -- `foreign` blocks
* [`@(link_prefix=<string>)`](#link_prefixstring) -- `foreign` blocks and declarations within `foreign` blocks
* [`@(link_suffix=<string>)`](#link_suffixstring) -- `foreign` blocks and declarations within `foreign` blocks
* [`@(private=<string?>)`](#privatestring)-- all declarations except `import` statements
* [`@(require_results)`](#require_results) -- procedure declarations and `foreign` blocks

### Foreign import declarations

* [`@(export)`](#exportboolean)
* [`@(extra_linker_flags=<string>)`](#extra_linker_flagsstring)
* [`@(ignore_duplicates)`](#ignore_duplicates)
* [`@(priority_index=<integer>)`](#priority_indexinteger)
* [`@(require)`](#requireboolean)

### Import declarations

* [`@(require)`](#requireboolean)

### Procedure groups

* [`@(objc_is_class_method=<boolean>)`](#objc_is_class_methodboolean)
* [`@(objc_name=<string>)`](#objc_namestring)
* [`@(objc_type=<type>)`](#objc_typetype)
* [`@(require_results)`](#require_results)

### Procedure declarations

* [`@(cold)`](#cold)
* [`@(deferred_in=<procedure>)`](#deferred_procedure)
* [`@(deferred_in_by_ptr=<procedure>)`](#deferred_procedure)
* [`@(deferred_in_out=<procedure>)`](#deferred_procedure)
* [`@(deferred_in_out_by_ptr=<procedure>)`](#deferred_procedure)
* [`@(deferred_none=<procedure>)`](#deferred_procedure)
* [`@(deferred_out=<procedure>)`](#deferred_procedure)
* [`@(deferred_out_by_ptr=<procedure>)`](#deferred_procedure)
* [`@(deprecated=<string>)`](#deprecatedstring)
* [`@(disabled=<boolean>)`](#disabledboolean)
* [`@(enable_target_feature=<string>)`](#enable_target_featurestring)
* [`@(entry_point_only)`](#entry_point_only)
* [`@(export=<boolean?>)`](#exportboolean)
* [`@(fast_math=<intrinsics.Fast_Math_Flags>)`](#fast_mathintrinsicsfast_math_flags)
* [`@(fini)`](#fini)
* [`@(init)`](#init)
* [`@(instrumentation_enter)`](#instrumentation_enter)
* [`@(instrumentation_exit)`](#instrumentation_exit)
* [`@(link_name=<string>)`](#link_namestring)
* [`@(link_prefix=<string>)`](#link_prefixstring)
* [`@(link_suffix=<string>)`](#link_suffixstring)
* [`@(link_section=<string>)`](#link_sectionstring)
* [`@(linkage=<string>)`](#linkagestring)
* [`@(no_instrumentation=<boolean?>)`](#no_instrumentationboolean)
* [`@(no_sanitize_address)`](#no_sanitize_address)
* [`@(no_sanitize_memory)`](#no_sanitize_memory)
* [`@(no_sanitize_thread)`](#no_sanitize_thread)
* [`@(objc_implement=<boolean?>)`](#objc_implementboolean)
* [`@(objc_is_class_method=<boolean>)`](#objc_is_class_methodboolean)
* [`@(objc_name=<string>)`](#objc_namestring)
* [`@(objc_selector=<string>)`](#objc_selectorstring)
* [`@(objc_type=<type>)`](#objc_typetype)
* [`@(optimization_mode=<string>)`](#optimization_modestring)
* [`@(require=<boolean?>)`](#requireboolean)
* [`@(require_results)`](#require_results)
* [`@(require_target_feature=<string>)`](#require_target_featurestring)
* [`@(test)`](#test)

### Variable declarations

* [`@(align=<integer>)`](#aligninteger)
* [`@(export=<boolean?>)`](#exportboolean)
* [`@(link_name=<string>)`](#link_namestring)
* [`@(link_prefix=<string>)`](#link_prefixstring)
* [`@(link_section=<string>)`](#link_sectionstring)
* [`@(link_suffix=<string>)`](#link_suffixstring)
* [`@(linkage=<string>)`](#linkagestring)
* [`@(private=<string>?)`](#privatestring) -- globals only
* [`@(require=<boolean?>)`](#requireboolean)
* [`@(rodata)`](#rodata)
* [`@(static)`](#static) -- locals variable declarations only
* [`@(thread_local=<string?>)`](#thread_localstring)

### Constant value declarations

* [`@(private=<string>?)`](#privatestring)

### Type declarations

* [`@(deprecated=<string>)`](#deprecatedstring)
* [`@(objc_class=<string>)`](#objc_classstring)
* [`@(objc_context_provider=<procedure>)`](#objc_context_providerprocedure)
* [`@(objc_implement=<boolean?>)`](#objc_implementboolean)
* [`@(objc_ivar=<type>)`](#objc_ivartype)
* [`@(objc_superclass=<type>)`](#objc_superclasstype)
* [`@(private=<string>?)`](#privatestring)
* [`@(raddbg_type_view=<string?>)`](#raddbg_type_viewstring)


### `@(align=<integer>)`

Raises the alignment of a variable to at least the given number of bytes, which must be a power of two. This can be applied to global variables, local variables, `@(static)` variables, and `@(thread_local)` variables.

```odin
@(align=64)
cache_line_data: [64]u8 // aligned to 64 bytes
```

### `@(builtin)`

Marks builtin procs in Odin's "base:runtime" package. Cannot be used in user code.

### `@(cold)`

A hint to the compiler that this procedure is rarely called, and thus "cold".

### `@(default_calling_convention=<string>)`

This attribute can be attached to a `foreign` block to specify the default calling convention for all procedures in the block. Example:
```odin
@(default_calling_convention = "std")
foreign kernel32 {
	@(link_name="LoadLibraryA") load_library_a  :: proc(c_str: ^u8) -> Hmodule ---
}
```

### `@(deferred_*=<procedure>)`

* `@(deferred_none=<procedure>)`
* `@(deferred_in=<procedure>)`
* `@(deferred_out=<procedure>)`
* `@(deferred_in_out=<procedure>)`
* `@(deferred_in_by_ptr=<procedure>)`
* `@(deferred_out_by_ptr=<procedure>)`
* `@(deferred_in_out_by_ptr=<procedure>)`


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


### `@(deprecated=<string>)`

Mark a procedure or type as deprecated. Running `odin build/run/check` will print out the message for each usage of the deprecated procedure or type.
```odin
@(deprecated="'foo' deprecated, use 'bar' instead")
foo :: proc() {
	...
}

@(deprecated="use 'New_Thing' instead")
Old_Thing :: struct {
	...
}
```

### `@(disabled=<boolean>)`

If the provided boolean is set, the procedure will not be used when called.

### `@(enable_target_feature=<string>)`

Enables or disables a specific feature needed for the target.

```odin
@(enable_target_feature="sse2,ssse3")
byteswap :: proc "contextless" (x: x86.__m128i) -> x86.__m128i {
	return x86._mm_shuffle_epi8(x, _BYTESWAP_INDEX)
}

// clang-style `+`/`-` prefixes are also supported.
@(enable_target_feature="+sse2,+ssse3,-avx")
byteswap2 :: proc "contextless" (x: x86.__m128i) -> x86.__m128i {
	return x86._mm_shuffle_epi8(x, _BYTESWAP_INDEX)
}
```

This attribute is primarily useful when maintaining backward compatibility while allowing the use of newer CPU features, by providing multiple implementations.

When using the `-` prefix to disable a target feature, it is strongly recommended for the procedure to be marked with the `#force_inline` or `#force_no_inline` directive, as functions that are automatically inlined may silently use the disabled feature anyway.

### `@(entry_point_only)`

Marks a procedure that can be called within the entry point only.

### `@(export=<boolean?>)`

Exports a variable or procedure symbol, useful for producing DLLs.

When applied to a `foreign import` declaration, the foreign import name becomes visible to every file in the package, rather than just the file it was declared in.
```odin
@(export)
foreign import lib "system:foo"
```

### `@(extra_linker_flags=<string>)`

This attribute can be attached to a `foreign import` declaration to specify additional flags to be passed to the linker.

```odin
@(extra_linker_flags="-L/path/to/lib_dir")
foreign import foo "system:foo"

foreign foo {
	foo_add_int    :: proc(a, b: c.int)    -> c.int ---
	foo_add_double :: proc(a, b: c.double) -> c.double ---
}
```

### `@(fast_math=<intrinsics.Fast_Math_Flags>)`

Enables the specified fast-math optimizations for the floating point operations within the procedure. These allow the compiler to produce results which differ from strict IEEE-754 semantics in exchange for speed. The value is a `bit_set` of the following `intrinsics.Fast_Math_Flag` values:

* `.Allow_Reassoc` - allow reassociation of floating point operations, e.g. `(a + b) + c` to `a + (b + c)`
* `.No_NaNs` - assume the arguments and results are never NaN
* `.No_Infs` - assume the arguments and results are never +/-Inf
* `.No_Signed_Zeros` - treat the sign of a zero as insignificant
* `.Allow_Reciprocal` - allow `x / y` to be computed as `x * (1 / y)`
* `.Allow_Contract` - allow floating point contraction, e.g. fusing a multiply and an add into a fused multiply-add
* `.Approx_Func` - allow approximations of functions such as `sin` and `sqrt`

```odin
@(fast_math={.Allow_Reassoc, .Allow_Contract})
dot :: proc(a, b: []f32) -> (sum: f32) {
	for _, i in a {
		sum += a[i]*b[i]
	}
	return
}
```

### `@(ignore_duplicates)`

This attribute can be attached to a `foreign import` declaration so that the library is not passed to the linker again if it has already been passed.

### `@(init)`

This attribute may be applied to any procedure, declared at file scope, that neither takes any parameters nor returns any values. All suitable procedures marked in this way by `@(init)` will then be called at the start of the program before `main` is called. The exact order in which all such initialization functions are called is deterministic and hence reliable. The order is determined by a topological sort of the import graph and then in alphabetical file order within the package and then top down within the file.
```odin
@(init)
startup :: proc "contextless" () {
	// runs before `main`
}
```

The procedure must be `"contextless"` unless its file enables [`#+feature global-context`](/docs/overview/#feature).

### `@(fini)`

Like `@(init)` but run after the `main` procedure finishes. It too must be `"contextless"`.

### `@(instrumentation_enter)`

Attaches to a procedure declaration to mark as the procedure to use for instrumentation profiling on enter. It must have the signature: `proc "contextless" (proc_address, call_site_return_address: rawptr, loc: runtime.Source_Code_Location)`.

```odin
@(instrumentation_enter)
spall_enter :: proc "contextless" (proc_address, call_site_return_address: rawptr, loc: runtime.Source_Code_Location) {
	spall._buffer_begin(&spall_ctx, &spall_buffer, "", "", loc)
}
```

### `@(instrumentation_exit)`

Attaches to a procedure declaration to mark as the procedure to use for instrumentation profiling on exit. It must have the signature: `proc "contextless" (proc_address, call_site_return_address: rawptr, loc: runtime.Source_Code_Location)`.

```odin
@(instrumentation_exit)
spall_exit :: proc "contextless" (proc_address, call_site_return_address: rawptr, loc: runtime.Source_Code_Location) {
	spall._buffer_end(&spall_ctx, &spall_buffer)
}
```

### `@(link_name=<string>)`

This attribute can be attached to variable and procedure declarations, either when exporting or inside a `foreign` block. This specifies what the variable/proc is called in the library.
Example:
```odin
foreign foo {
	@(link_name = "bar")
	testbar :: proc(baz: int) ---
}

@(export, link_name="lib_foo")
foo :: proc "c" () -> int {
	return 42
}
```

### `@(link_prefix=<string>)`


This attribute can be attached to variable and procedure declarations, either when exporting or inside a `foreign` block. So if functions are prefixed with `ltb_` in the library, you can attach this and not specify that on the procedure on the Odin side; conversely, non-Odin procedures must match the exported procedure's name with its link prefix. Example:
```odin
@(link_prefix = "ltb_")
foreign foo {
	testbar :: proc(baz: int) --- // This now refers to ltb_testbar
}

@(export, link_prefix="ltb_")
foo :: proc "c" () -> int {
	return 42
}
```

### `@(link_section=<string>)`


Specify the link section for a global variable.

```odin
@(link_section=".foo")
my_global: i32
```

Specify the link section for a procedure.

```odin
@(link_section=".bar")
my_procedure :: proc "c" () -> i32 {
	return 1337
}
```

### `@(link_suffix=<string>)`

This attribute can be attached to variable and procedure declarations, either when exporting or inside a `foreign` block. This is similar to `link_prefix`, except that it appends to the end of the link name instead of prepending to the start.
```odin
@(link_suffix = "_x86")
foreign foo {
	testbar :: proc(baz: int) --- // This now refers to testbar_x86
}

@(export, link_suffix="_x86")
foo :: proc "c" () -> int {
	return 42
}
```

### `@(linkage=<string>)`

Allows the ability to specify the specific linkage of a declaration. Allowed linkage kinds: `"internal"`, `"strong"`, `"weak"`, and `"link_once"`.

### `@(no_instrumentation=<boolean?>)`

Disables instrumentation for the specified procedure. If no boolean is specified, the default state is `true`.

### `@(no_sanitize_address)`

If set, the procedure will not be instrumented by [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) when using the `-sanitize:address` build flag, which permits the procedure and all called procedures to read and write to any memory that may be marked as invalid by the sanitizer.

This attribute will typically be used in the procedures that make up a memory allocator.

### `@(no_sanitize_memory)`

Disables checks for memory sanitization for the specified procedure.

### `@(no_sanitize_thread)`

Disables instrumentation by [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html) for the specified procedure when using the `-sanitize:thread` build flag.

### `@(objc_class=<string>)`

Specifies the name of the Objective-C class for a type.

```odin
@(objc_class="NSAutoreleasePool")
AutoreleasePool :: struct {using _: Object}
```

### `@(objc_context_provider=<procedure>)`

Specifies the procedure used to provide a default `context`. It must be a procedure that takes 1 parameter (a single pointer to the `@(objc_type)` value) and only returns `runtime.Context`.

> [!NOTE]
> Prefer not to use this if possible.

### `@(objc_implement=<boolean?>)`

Specifies whether this declaration is an implementation of an Objective-C class or not on the Odin-side.

### `@(objc_is_class_method=<boolean>)`

Specifies whether the procedure or procedure groups is bound the class type or the variable (i.e. `+` vs `-` in Objective-C).

### `@(objc_ivar=<type>)`

Specifies the type to be used as the instance variable (`ivar`) with the associated Objective-C class type.

See: https://developer.apple.com/documentation/objectivec/ivar?language=objc

### `@(objc_name=<string>)`

Specifies the name to be used as the bound "method" (NOT the internal name)

### `@(objc_selector=<string>)`

Specifies the internal selector name for the Objective-C call.

### `@(objc_superclass=<type>)`

Specifies the superclass for the class type.

### `@(objc_type=<type>)`

Specifies the associated Objective-C class type for a procedure/procedure-group.

### `@(optimization_mode=<string>)`


Set the optimization mode of a procedure. Valid modes are `"none"` and `"favor_size"`.

```odin
@(optimization_mode="favor_size")
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

### `@(priority_index=<integer>)`

This attribute can be attached to a `foreign import` declaration to control the order in which libraries are passed to the linker. Libraries with a lower priority index are passed first; the default is `0`.

```odin
@(priority_index=-1)
foreign import first "first.lib"
```

### `@(private=<string?>)`

Prevents a top level element from being exported with the package.
```odin
@(private)
my_variable: int // cannot be accessed outside this package
@private // parenthesis can be dropped on no arguments
my_other_variable: int
```

You may also make an entity private to _the file_ instead of the package.
```odin
@(private="file")
my_variable: int // cannot be accessed outside this file
```
`@(private)` is equivalent to `@(private="package")`.

Using `#+private` before the package declaration will automatically add `@(private)` to everything in that file:
```odin
#+private
package foo
```

And `#+private file` will be equivalent to automatically adding `@(private="file")` to each declaration. This means that to remove the private-to-file association, you must apply a private-to-package attribute `@(private)` to the declaration.

### `@(raddbg_type_view=<string?>)`

Adds a custom debug watch window rendering for the RAD Debugger. If no custom view rule string is set, then the Odin compiler will generate a specific view from the struct fields tags (reading the `fmt:"..."` style declarations).

### `@(require=<boolean?>)`

Requires that the declaration is added to the final compilation and not optimized out.

When applied to an `import` declaration, the imported package is always included in the compilation (e.g. so that its `@(init)` procedures or `@(test)` procedures are run) and it is not reported as an unused import. When applied to a `foreign import` declaration, the library is always linked, even if none of its entities are used.
```odin
@(require) import "core:image/png" // registers the PNG loader, even though nothing from the package is used directly
```

### `@(require_results)`

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

### `@(require_target_feature=<string>)`

Forces a procedure to require a specific target feature on use. e.g. `@(require_target_feature="sha512,sse4.1")`

### `@(rodata)`

A global or static variable with the `@(rodata)` attribute will live in the read-only data block of the program. This means that the value cannot be changed.

In most cases, using a constant is a better idea. One example where `@(rodata)` is useful is this case:

```odin
@(rodata)
numbers := []int {
	7,
	42,
	628,
}

main :: proc() {
	index := 1
	n := numbers[index]
	fmt.println(n)
}
```

If you instead used a constant `numbers` array (`NUMBERS :: []int {}`), then it would not be possible to index `numbers` using a variable, because constants only exist at compile time.


### `@(static)`

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

### `@(tag=<string>)`

An attribute that user-level code can use but will be ignored by the compiler. This is useful for metaprogramming purposes. If more custom tags are required, use the flag `-ignore-unknown-attributes`.

### `@(test)`

Allows procedures with the attribute `@(test)` to be run with the command `odin test` directly.

```odin
import "core:testing"

@(test)
foo :: proc(_: ^testing.T) {
}
```

### `@(thread_local=<string?>)`

Makes a variable thread local, meaning each thread has its own copy of the variable. It can be applied to a variable at file scope, or to a local variable, which makes it a thread local [`@(static)`](#static) variable. Thread local variables cannot have initialization values.
```odin
@(thread_local) foo: int

counter :: proc() -> int {
	@(thread_local) n: int // like a `@(static)` variable, but one per thread
	n += 1
	return n
}
```

Optionally, a thread local storage model can be specified: `"default"`, `"globaldynamic"`, `"localdynamic"`, `"initialexec"`, or `"localexec"`. e.g. `@(thread_local="localexec")`.
