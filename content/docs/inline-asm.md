---
title: Inline asm Templates Overview
summary: Overview of the inline `asm` templates in Odin
weight: 10
---

> **Note:** Currently amd64 targets only (e.g. `windows_amd64`, `linux_amd64`, `darwin_amd64`).

## Overview

An `asm` template is a callable entity, instantiated in place at each call like a
forced-inline procedure. It is not a statement block spliced into a surrounding
procedure; rather, it behaves like an intrinsic. Some platform-specific intrinsics
will be replaced by this system in the near future.

The general `instruction [operand{, operand}]` form is intended as a _universal
syntax_ across instruction set architectures: every ISA shares this common grammar
while still exposing its own instructions and registers. The approach is modeled on
Go's Plan 9–derived assembler, which likewise uses one syntax across all its targets
([Go's assembler guide](https://go.dev/doc/asm), [the Plan 9 assembler manual](https://9p.io/sys/doc/asm.html)).
That syntax originated with Plan 9 (Ken Thompson's toolchain) and was carried into Go.

Odin's inline assembly uses a context-free grammar, but this does not mean any
mnemonics are shared across ISAs—only the syntax itself is.

## Declaration

```odin
name :: asm(params) -> (results) [bindings] {
	body
}
```

- `params`   - input operands. Plain names and types.
- `results`  - output operands. Plain names and types.
- `bindings` - ties, pins, scratch, width-views, clobbers, and effects.
- `body`     - the instruction stream.

Both `-> (results)` and the `[bindings]` block are optional.

The body uses Intel operand order (`dst, src`); the backend lowers per-target.
Physical registers take a `%` sigil (`%rax`); parameter and scratch names are
bare (`r`, `acc`).

Results may be left unbound at the call site; the compiler ignores the unused
ones implicitly, so a template whose results are ABI artifacts need not be
destructured.

```odin
mfence :: asm() [ #volatile, #clobber memory ] { mfence }
// NOTE: `#volatile` and `#clobber memory` are both inferred here from
// the use of `mfence`, but are written for clarity.
```

### Parameter types

A parameter type is one of: integer, float, boolean, pointer, multi-pointer, or
`#simd[N]T`.

A `$name` parameter is a compile-time immediate (`$ctrl: u8`). It must not be
pointer-like, and its value is only known—and only range-checked—at
instantiation.

## Bindings

The `[...]` block holds everything that is not a plain input or output name.
Ties and pins are edges onto names in the signature; scratch, width-views, and
clobbers are declared in the block directly.

| Form                | Meaning                                                      |
|---------------------|--------------------------------------------------------------|
| `in -> out`         | tie: `out` is read-write, sharing `in`'s register            |
| `name = %reg`       | pin `name` to a physical register                            |
| `in -> out = %reg`  | in/out pinned to a fixed register                            |
| `name: T`           | scratch register of type `T`                                 |
| `name: T = %reg`    | scratch register of type `T` pinned to a physical register   |
| `view: T = src`     | width-view of `src`'s register at width `T`                  |
| `#clobber x`        | clobber a register, `flags`, or `memory`                     |
| `#volatile`         | marks a whole template as volatile                           |
| `#align_stack`      | forces stack realignment on entry to the template            |

The right-hand side disambiguates the two `=` forms: `= %reg` (a register) is a
pin; `= src` (a name) is a width-view of another operand. A bare `->` leaves the
register to the compiler, while `= %reg` pins to a specific register for the
target platform.

Scratch declarations are template-lifetime registers, allocated once. They live
in the binding block, not the body—there is no block scope in a template.

### Registers

Explicit registers are prefixed with `%` to prevent namespace collisions with
user-provided parameters and with other global constants in parent scopes.
Register names are the target's own (e.g. `%rax`, `%xmm0`, `%r11`, `%al` on AMD64),
named specifically for each platform rather than given generalized names.

Depending on the template, it may be common to use explicit registers
everywhere, or common to use scratch parameters instead.

### Ties

`in -> out` binds an input and an output to one register. It lowers to a
read-write operand (`+r`). A tie with a pin (`in -> out = %rax`) fixes the
register; a tie without one lets the allocator choose.

```odin
add_one :: asm(x: u64) -> (r: u64) [ x -> r ] { inc r }
```

### Pins

`name = %reg` forces a specific physical register. Two operands may pin the same
register (an in-out that needs no tie):

```odin
divmod_u64 :: asm(n: u64, d: u64) -> (quo, rem: u64) [
	n -> quo = %rax,
	rem      = %rdx,
	#clobber flags,
] {
	xor %rdx, %rdx
	div d
}
```

### Scratch

`name: T` is a working register whose class comes from `T` (`i64` → GP,
`#simd[4]f32` → vector). Unpinned scratch is early-clobbered—it can never
alias an input. Pin scratch with `name: T = %reg` for a fixed register, or use
`#clobber %reg` if it is only trashed, not named.

### Width-views

`view: T = src` is a second name for `src`'s register, seen at width `T`.
One register, two widths; with no pin, the allocator stays free. It is
integer-only, and `T` must be narrower than `src`'s width (a view exists to name
a sub-register). For the `setcc`-then-arithmetic idiom:

```odin
count_less :: asm(x: []i64, n: i64, thr: i64) -> (count: i64) [
	acc:   i64,
	pred:  i64,
	predb: u8 = pred,   // low-8 view of pred
	i:     i64,
	#clobber flags,
	#clobber memory,
] {
	// ... setl predb ; add acc, pred ...
}
```

## Memory operands

Intel-style effective addresses. The general form is
`[base + index*scale + disp]`; any component may be omitted:

- `[base]`
- `[base + index]`
- `[base + index*scale]`  - scale `1`, `2`, `4`, `8`
- `[base + index<<scale]` - shift form, scale `0..=3`
- `[base + index*scale + disp]`

`[base + index>>scale]` is accepted only on targets that encode it (e.g. arm64),
not amd64.

Rules:

- Base and index must be 32- or 64-bit integer registers, and the same width.
- `%rsp`/`%esp` may be a base but never an index.
- A scale requires an index.
- The displacement is a compile-time integer that fits a signed 32-bit value; a
  register belongs in the index slot, not the displacement.

### Size annotation

`[base]:T` gives the memory operand an explicit access width, for when no
register operand pins it (`crc32 r32, r/m8`). It is a type ascription, only the
size and class of `T` are used, not a value cast, so `:u8`, `:i8`, `:b8` are
identical.

```odin
crc32_buf :: asm(init: u32, p: [^]u8, len: i64) -> (crc: u32) [
	init -> crc,
	i: i64,
	#clobber flags,
	#clobber memory,
] {
	xor i, i
	cmp i, len
	jge .done
.loop:
	crc32 crc, [p + i]:u8
	add   i, 1
	cmp   i, len
	jl    .loop
.done:
}
```

## Labels

`.name:` defines a label; `.name` references it. Labels are local to the
template and mangled per instantiation, so a template may be inlined many times
without symbol collisions. There are no global labels.

## Prefixes

A prefix is a separate line before the instruction it applies to:

```odin
	lock
	xadd [p], old
```

A prefix takes no operands, must be immediately followed by an instruction (not
a label or another prefix), and is checked for legality against the following
instruction's form (`lock` requires a memory destination; `rep`/`repne` require
a string instruction).

## Data and alignment directives

These directives are written in the body and emit raw bytes or control layout in
the instruction stream:

- `#byte N[, N]` — directly emit a byte or bytes (represented as integers) as
  instruction information.
- `#skip N` — produce N bytes of zeros.
- `#nop N` — produce N bytes' worth of "nops", emitting the minimal number of
  "nop"-like instructions.
- `#align N` — align the next instruction to `N` bytes, which must be a power of
  two.

## Clobbers and effects

Three orthogonal axes:

- `#clobber %reg`   - a register is trashed.
- `#clobber flags`  - the condition codes (flags) are modified.
- `#clobber memory` - memory the compiler cannot see is read or written; also
  forces ordering.

Most clobbers are inferred from the instructions used; write them explicitly
only for effects that cannot be inferred (e.g. runtime-dependent AVX-512
masking).

## Template directives

Placed within the `[...]` block:

- `#volatile` marks the whole template as _volatile_: it must not be deleted
  even if its results are unused, nor reordered. This is distinct from
  `#clobber memory` (an ordering/visibility statement) and from `#clobber flags`.
- `#align_stack` forces stack realignment on entry to the template, for
  instructions that require an aligned stack.

## Semantic checking

Templates are not passed through to the assembler verbatim. The frontend
type-checks every instruction against the target's own encoding tables—the
same data the backend encodes from—so most mistakes are caught at compile
time, at the offending token, rather than surfacing as an opaque assembler
error later.

Checked, per instruction:

- **Unknown mnemonic or prefix.** Reported with a _did-you-mean_ suggestion
  drawn from the target's mnemonic set (`movsss` → did you mean `movss`,
  `movsd`?). Unknown registers are suggested the same way.
- **Operand count.** Too few or too many operands names the accepted arity.
- **Operand kind.** Register vs memory vs immediate vs label, matched against
  each encoding form. A mismatch names the operand and what was expected there
  (e.g. _operand 2 expected a register, got an immediate_).
- **Operand size and class.** A `u32` into a 64-bit slot, a `#simd[8]f32` into
  an xmm slot, or an integer where a vector register is required is reported
  with the expected and actual widths/classes. A scalar float is accepted in a
  vector-register slot (it uses the low lane); a `#simd` vector must match the
  slot width exactly.
- **Immediate ranges.** A constant that does not fit the form's immediate width
  is rejected with the value and the width it overflows
  (`36893488147419103232` does not fit a 32-bit immediate). `$` immediates are
  range-checked at instantiation.
- **Memory operands.** Base/index register class and width agreement,
  `%rsp`/`%esp` misused as an index, a scale without an index, an out-of-range
  or register-valued displacement.

When several encoding forms exist for a mnemonic, the checker reports against
the _closest_ form—the one the operands most nearly satisfied—so the
suggestion points at the encoding you most likely intended rather than an
unrelated one. Prefix legality (`lock` on a memory destination; `rep`/`repne`
on a string instruction) is checked against the selected form.

Clobbers, condition-code effects, and side effects are inferred from the
instructions used; the explicit `#clobber` and `#volatile` forms are for the
cases the tables cannot infer (see above).

## Instantiation

A template is a macro: it expands at each call. Immediate-value ranges for `$`
parameters are therefore evaluated per call, not at the template definition.

## `asm` groups

Like procedure groups (which provide explicit overloading), `asm` templates can
also be grouped to give overloading behaviour:

```odin
store_u32 :: asm(p: ^u32, v: u32) {
	mov [p], v
}
store_u64 :: asm(p: ^u64, v: u64) {
	mov [p], v
}

store :: asm{
	store_u32,
	store_u64,
}
```

## Inline `asm` calls

Sometimes you just want a single instantiation of an `asm` template that is
called immediately:

```odin
asm(p: ^u64, v: u64) {
	mov [p], v
}(&x[i], 123)
```

This form can only be used directly within a call expression; it cannot be used
as a regular value, because it does not really exist—it is purely a template.


## Examples Showing The Syntax

```odin
add_one :: asm(x: u64) -> (r: u64) [
	x -> r,
]{
	inc r
}

add_u64 :: asm(x, y: u64) -> (r: u64) {
	mov r, x
	add r, y
}

swap :: asm(x, y: u64) -> (a, b: u64) [
	x -> a,
	y -> b,
]{
	xchg a, b
}

rol_imm :: asm(x: u32, $n: i32) -> (r: u32) [
	x -> r,
]{
	rol r, n
}

rdtsc :: asm() -> (lo, hi: u32) [
	lo = %eax,
	hi = %edx,
] {
	rdtsc
}

cpuid :: asm(leaf: u32) -> (a, b, c, d: u32) [
	leaf -> a = %eax,
	b = %ebx,
	c = %ecx,
	d = %edx,
] {
	cpuid
}

// [#clobber memory] is inferred
store_u64 :: asm(p: ^u64, v: u64) {
	mov [p], v
}

// [#volatile] is inferred but written explicit for clarity
mfence :: asm() [#volatile] {
	mfence
}

dot_f32x4 :: asm(a, b: [^]f32, n: i64) -> (result: f32) [
	acc: #simd[4]f32,
	tmp: #simd[4]f32,
	i:   i64,
	#clobber flags,  // the cmp/jl sets flags
	#clobber memory, // conservatively: we read memory the compiler can't see
] {
	xorps acc, acc          // acc = {0,0,0,0}
	xor   i, i
.loop:
	movups tmp, [a + i*4]   // load 4 floats from a; scale 4 = sizeof(f32)
	mulps  tmp, [b + i*4]   // tmp *= 4 floats from b  (mulps xmm, m128)
	addps  acc, tmp
	add    i, 4
	cmp    i, n
	jl     .loop            // .loop is frontend-mangled per expansion
	haddps acc, acc         // horizontal fold: {a0+a1, a2+a3, ...}
	haddps acc, acc         // {sum, sum, sum, sum}
	movss  result, acc      // result = acc[0]
}

dot_f32x4_v2 :: asm(a, b: [^]f32, n: i64) -> (result: f32) [
	acc0: #simd[4]f32,
	acc1: #simd[4]f32,
	t0:   #simd[4]f32,
	t1:   #simd[4]f32,
	i:    i64,
] {
	vxorps acc0, acc0, acc0
	vxorps acc1, acc1, acc1
	xor    i, i
.loop:
	vmovups     t0, [a + i<<2]              // equivalent to [a + i*4]
	vmovups     t1, [a + i<<2 + 16]
	vfmadd231ps acc0, t0, [b + i<<2]        // acc0 += t0 * b[i:][:4]
	vfmadd231ps acc1, t1, [b + i<<2 + 16]   // acc1 += t1 * b[i+4:][:4]
	add    i, 8
	cmp    i, n
	jl     .loop
	vaddps  acc0, acc0, acc1                // combine the two chains
	vhaddps acc0, acc0, acc0
	vhaddps acc0, acc0, acc0
	vmovss  result, acc0, acc0
}

shuffle4 :: asm(v: #simd[4]f32, $ctrl: u8) -> (r: #simd[4]f32) [
	v -> r, // xmm in/out tie; r starts as v
]{
	shufps r, r, ctrl // permute r's 4 lanes by the imm8 control
}

memcpy_rep :: asm(dst, src: rawptr, len: uint) -> (end_dst, end_src: rawptr, rem: uint) [
	dst -> end_dst = %rdi,
	src -> end_src = %rsi,
	len -> rem     = %rcx,
] {
	rep
	movsb
}

divmod_u64 :: asm(n: u64, d: u64) -> (quo, rem: u64) [
	n -> quo = %rax,
	rem      = %rdx,
] {
	xor %rdx, %rdx            // clear high half of the dividend
	div d                     // rax = rdx:rax / d ; rdx = remainder
}

crc32_buf :: asm(init: u32, p: [^]u8, len: i64) -> (crc: u32) [
	init -> crc,
	i: i64,
] {
	xor i, i
	cmp i, len
	jge .done
.loop:
	crc32 crc, [p + i + 0]:u8
	add   i, 1
	cmp   i, len
	jl    .loop
.done:
}

atomic_fetch_add :: asm(p: ^i64, delta: i64) -> (old: i64) [
	delta -> old,
] {
	lock
	xadd [p], old         // [p] += old; old = previous [p].
}

count_less_than :: asm(src: [^]i64, n: i64, threshold: i64) -> (count: i64) [
	acc:  i64,        // running count (unpinned scratch -> allocator's choice)
	pred: i64,        // predicate register, used at two widths
	predb: u8 = pred, // the low-8 view of `pred`, for setl
	elem: i64,        // loaded element
	i:    i64,        // loop index
] {
	xor acc, acc
	xor i, i
	cmp i, n
	jge .done
.loop:
	mov  elem, [src + i*8]
	xor  pred, pred        // zero the full 64-bit register first
	cmp  elem, threshold
	setl predb             // predb = (elem < threshold) ? 1 : 0  -> low byte of pred
	add  acc, pred         // read pred at 64-bit width; upper bits are known 0
	add  i, 1
	cmp  i, n
	jl   .loop
.done:
	mov  count, acc
}

tzcnt :: asm(x: u64) -> (count: u64, was_zero: bool) [
	was_zero = %flags.z,
] {
	tzcnt count, x
}

bit_reset :: asm(in_val: i32, bit: i32) -> (out_val: i32, f: bool) [
	in_val -> out_val,
	f = %flags.c,
] {
	btr out_val, bit
}
```

```odin
main :: proc() {
	// scalar result
	a1 := add_one(41)                       // -> 42
	fmt.println("add_one:", a1)

	// scalar result, aliasing-hazard case
	s := add_u64(20, 22)                    // -> 42 (see NOTE on proc)
	fmt.println("add_u64:", s)

	// multiple return values
	x, y := swap(1, 2)                      // -> 2, 1
	fmt.println("swap:", x, y)

	// immediate operand: n must be a compile-time constant
	rr := rol_imm(0x0000_00FF, 8)           // -> 0x0000_FF00
	fmt.println("rol_imm:", rr)

	// pinned outputs -> two-field destructure
	lo, hi := rdtsc()
	tsc := (u64(hi) << 32) | u64(lo)
	fmt.println("rdtsc:", tsc)

	// four-result destructure, result order preserved
	ea, eb, ec, ed := cpuid(0)
	fmt.println("cpuid.0:", ea, eb, ec, ed)

	// store, consumed only for its side effect
	slot: u64
	store_u64(&slot, 0xDEAD_BEEF)
	fmt.println("store_u64:", slot)

	// vector kernel: [^]f32 args via raw_data, scalar f32 result
	xs := make_aligned([]f32, 8, 16)
	ys := make_aligned([]f32, 8, 16)
	copy(xs, []f32{1, 2, 3, 4, 5, 6, 7, 8})
	copy(ys, []f32{8, 7, 6, 5, 4, 3, 2, 1})
	d := dot_f32x4_v2(raw_data(xs[:]), raw_data(ys[:]), 8)
	fmt.println("dot:", d)             // 1*8+2*7+...+8*1 = 120

	// pure side-effect, no result binding
	mfence()
}
```