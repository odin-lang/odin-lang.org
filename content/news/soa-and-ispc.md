---
title: "Odin's #soa Compared With ISPC"
summary: "Common ISPC kernels side-by-side with Odin's #soa, and the trade-offs between implicit and explicit"
slug: soa-and-ispc
author: Ginger Bill
date: '2026-11-28'
categories:
  - soa
  - simd
  - ispc
  - odin
---

If you care about performance, you've probably come across [ISPC](https://ispc.github.io/), Intel's SPMD Program Compiler, and maybe wondered how its features stack up against Odin's, especially `#soa`. Both exist for the same reason. A CPU can work on several values at once, but only when the data is laid out for it and the code is written to use it. Where they differ is in how much they do for you.

ISPC's design rests on one question. Does this value vary across the SIMD lanes? You write your code as if for a single element, much like a GPU shading language, and answer that question for each value. Anything that differs per element is `varying`, the default, and anything shared is `uniform`. From there, the ISPC compiler does the rest for you. It runs your code across a [*gang*](https://ispc.github.io/ispc.html#basic-concepts-program-instances-and-gangs-of-program-instances) of program instances, spread over the CPU's SIMD lanes, and quietly handles the awkward parts. When some instances take an `if` and others don't, it masks off the ones that shouldn't run. The size of the gang comes from the `--target` you compile for.

Odin is plainer. `#soa` is just a data layout, and a loop over an `#soa` array is just a loop, the same as you'd write for any other array. With `-o:speed`, LLVM tries to vectorize it whenever that gives the same result. And when you want vector code of a particular width, you write it yourself. An `#simd[8]f32` is eight `f32` lanes on every target, and `core:simd` has the operations for it.

So ISPC is the more implicit of the two and Odin the more explicit. You'd expect that to make the Odin code longer, but it mostly doesn't, and once or twice it's actually shorter.

**Note:** All the timings in this article come from an AMD Ryzen 9 7950X (Zen 4) running Windows 11, Odin, LLVM 22, and ISPC 1.32.0. Unless a table says otherwise, each timing is 20000 passes over 4096 elements (built with `-o:speed`).

## Data Layout

If you've written a structure of arrays (SoA) in ISPC, or in C, you've most likely done it by hand, with one array per field. In Odin you keep the struct and ask for the layout instead.

{{< side-by-side >}}
```c
uniform float xs[1024];
uniform float ys[1024];
uniform float zs[1024];

uniform float x = xs[10];
```
<--->
```odin
Point :: struct { x, y, z: f32 }

pts: #soa[1024]Point

x := pts[10].x
```
{{< /side-by-side >}}

Both store all 1024 `x` values, then all the `y` values, then all the `z` values. In ISPC that's three arrays with three names to keep in step. In Odin it's one `#soa` array of `Point`s, and `pts[10]` is still a `Point`.

You don't lose the separate arrays either. `pts.x` is the whole `x` column, a `[1024]f32`, and `pts.x[:]` is a slice of it you can pass to anything that takes a `[]f32`. Nor are you stuck with fixed sizes. `#soa[]Point` is a slice with the same layout, `#soa[dynamic]Point` grows with `append` like any other dynamic array, and `#soa[dynamic; N]Point` has a fixed capacity of `N`, stored inline.

There's one more detail Odin takes care of. With a power-of-two length like 1024, the columns would start exactly 4 KiB apart, and memory 4 KiB apart fights over the same few slots in the L1 cache. A loop touching many columns could keep evicting its own data. So Odin staggers the columns, and the ones in `pts` start `4224` bytes apart instead of `4096`.

## Kernels

Most of what people write in ISPC are kernels, small pieces of work done to every element of an array. The classic one moves every particle along by its velocity.

{{< side-by-side >}}
```c
export void step(
	uniform float x[],  uniform float y[],
	uniform float z[],  uniform float vx[],
	uniform float vy[], uniform float vz[],
	uniform int n, uniform float dt) {
	foreach (i = 0 ... n) {
		x[i] += vx[i] * dt;
		y[i] += vy[i] * dt;
		z[i] += vz[i] * dt;
	}
}
```
<--->
```odin
Particle :: struct {
	x, y, z:    f32,
	vx, vy, vz: f32,
}

step :: proc(ps: #soa[]Particle, dt: f32) {
	for &p in ps {
		p.x += p.vx * dt
		p.y += p.vy * dt
		p.z += p.vz * dt
	}
}
```
{{< /side-by-side >}}

In ISPC, `foreach` hands each program instance its own `i`, and everything the gang shares is marked `uniform`. In Odin there's nothing to mark. `#soa[]Particle` carries all six columns and their length in a single parameter, and `for &p in ps` is a normal loop. Each iteration only touches its own particle, so LLVM is free to vectorize it at `-o:speed`.

| Build                                    | Particles per instruction | 20,000 passes over 4,096 particles (96 KB) | 10 passes over 8,192,000 particles (196 MB) |
|------------------------------------------|--------------------------:|-------------------------------------------:|--------------------------------------------:|
| default, `x86-64-v2` (SSE4.2)            |                         4 |                                      25 ms |                                       63 ms |
| `-microarch:x86-64-v3` (AVX2)            |                         8 |                                      19 ms |                                       59 ms |
| `-microarch:native` on a Zen 4 (AVX-512) |                        16 |                                      18 ms |                                       58 ms |

**Note:** You'll notice the gains shrink as the vectors get wider. That's because the loop does very little arithmetic for all the data it moves. Each particle means reading 24 bytes and writing 12, just for three multiplies and three adds. At 96 KB, the columns don't even fit in the Zen 4's 32 KB L1 cache. Make it 196 MB and they have to come all the way from main memory, and then every build takes about 60 ms. At that point the vectors spend most of their time waiting for data, however wide they are.

## Calling Kernels From Your Program

ISPC is a separate language with its own compiler. It builds the kernel and writes a C header, and your C or C++ program calls the kernel through that header. In Odin the kernel is just part of your program, because `#soa` is part of the language itself.

{{< side-by-side left="C++ and ISPC" right="Odin" >}}
```cpp
// ispc step.ispc -o step.o -h step.h
#include "step.h"

std::vector<float> x, y, z, vx, vy, vz;
// ... fill them in
ispc::step(x.data(),  y.data(),  z.data(),
           vx.data(), vy.data(), vz.data(),
           (int)x.size(), dt);
```
<--->
```odin
ps: #soa[dynamic]Particle
append(&ps, Particle{x = 1, vx = 2})
// ... fill them in
step(ps[:], dt)
```
{{< /side-by-side >}}

Your particles live in an `#soa[dynamic]` array that grows with `append`, and `ps[:]` hands them to `step` as an `#soa[]Particle`. There's no second build step and no header to keep in sync (Odin doesn't have headers anyway).

## What If My Data Is Already in Separate Arrays?

Maybe your data already lives in one array per field (the way an ISPC kernel expects). The built-in `soa_zip` takes separate slices and presents them as a single `#soa` slice, without copying anything.

{{< side-by-side >}}
```c
foreach (i = 0 ... n) {
	x[i] += vx[i] * dt;
}
```
<--->
```odin
for &p in soa_zip(x=x, vx=vx) {
	p.x += p.vx * dt
}
```
{{< /side-by-side >}}

`soa_zip` uses the shortest of the slices' lengths, so there's no `n` to pass and no way to run off the end of one. The loop vectorizes like `step` does. `soa_unzip` goes the other way and gives you the separate slices back.

## Converting Between AoS and SoA

Data doesn't always arrive in the layout you want. The usual case is an array of structs from a file or a library, when what you really want is columns.

{{< side-by-side >}}
```c
// any kind of struct (one element at a time)
foreach (i = 0 ... n) {
	xs[i] = pts[i].x;
	ys[i] = pts[i].y;
	zs[i] = pts[i].z;
}

// 2 to 4 fields of one type, a gang at a time;
// pos holds x, y, z, x, y, ...
// and n is a multiple of programCount
for (uniform int i = 0; i < n;
     i += programCount) {
	float x, y, z;
	aos_to_soa3(&pos[3*i], &x, &y, &z);
	xs[i + programIndex] = x;
	ys[i + programIndex] = y;
	zs[i + programIndex] = z;
}
```
<--->
```odin
// any struct, one element at a time
for &p, i in soa {
	p = aos[i]
}

// any struct and length, in blocks
// where the fields allow it
copy(soa, aos)
copy(aos, soa) // and back again

// fixed-size arrays convert directly
s := (#soa[4]Point)(arr)
```
{{< /side-by-side >}}

In ISPC, the general way is a `foreach` that copies field by field, and every field it reads becomes a gather. The `aos_to_soa` functions avoid the gathers by using shuffles, but they only handle two to four fields of the same type, and they read or write past the end unless `n` is a multiple of the gang size.

In Odin you mostly just use `copy`. It works between any mix of slices and `#soa` slices, in either direction, and transposes whole blocks of elements at once where the fields allow it.

The fixed-size conversion comes for free from Odin's [array programming](/docs/overview/#array-programming). `[4]Point` and `#soa[4]Point` are both four elements, and converting between them only changes the layout. And if your data is already in separate arrays, `soa_zip` means you don't have to convert at all.

## Keeping Your Own Vector Types

Positions and velocities read best as vectors, not as six separate fields. ISPC has a short vector type for this, `float<3>`, and `soa<8>` quietly splits such a field into blocks of `x`, `y`, and `z`. Odin's `#soa_split` does the same, but only when you ask for it.

{{< side-by-side >}}
```c
struct Body {
	float<3> pos;
	float<3> vel;
	float life;
};

soa<8> Body bs[1024];

foreach (i = 0 ... 1024) {
	bs[i].pos += bs[i].vel * dt;
}
```
<--->
```odin
Body :: struct {
	#soa_split pos: [3]f32,
	#soa_split vel: [3]f32,
	life:           f32,
}

bs: #soa[1024]Body

for &b in bs {
	b.pos += b.vel * dt
}
```
{{< /side-by-side >}}

`bs[i].pos` is still a `[3]f32` you can do mathematics on, `bs.pos.x` is a `[]f32` column, and the loop vectorizes just like `step`.

Written out as plain structs, the two layouts look like this.

{{< side-by-side >}}
```c
// soa<8> Body bs[1024] is in effect:
struct {
	uniform float pos[3][8];
	uniform float vel[3][8];
	uniform float life[8];
} bs[128];
```
<--->
```odin
// bs: #soa[1024]Body is in effect:
bs: struct {
	pos:  [3][1024]f32,
	vel:  [3][1024]f32,
	life: [1024]f32,
}

// and without #soa_split:
bs: struct {
	pos:  [1024][3]f32,
	vel:  [1024][3]f32,
	life: [1024]f32,
}
```
{{< /side-by-side >}}

You might have noticed that `soa<8>` makes two decisions at once. Every vector field gets split and the blocks are eight elements long. Odin keeps those separate concepts which is in keeping with its general preference for orthogonal features. `#soa` turns each field into a column, whatever the field's type, so a `[3]f32` field gets a column of `[3]f32`s. `#soa_split` splits an array or struct field into columns of its own, and the two compose. You can split the fields you work on lane by lane and keep whole the ones you always read whole.

The block size is the other half, and in ISPC it's tied to the gang size. Compile for a gang of 4 or 16 and ISPC warns that the `soa<8>` blocks no longer match, then falls back to gathers and scatters. Odin's `#soa` stores whole columns rather than fixed-size blocks, so a loop over them works at any vector width.

## Branches and Masking

In ISPC, an `if` inside a `foreach` is masked for you. Every program instance evaluates the condition, and the body runs with the others switched off. In Odin, an `if` is just an `if`, which means it actually branches.

{{< side-by-side >}}
```c
foreach (i = 0 ... 1024) {
	if (bs[i].life > 0) {
		bs[i].pos += bs[i].vel * dt;
	}
}
```
<--->
```odin
for &b in bs {
	if b.life > 0 {
		b.pos += b.vel * dt
	}
}
```
{{< /side-by-side >}}

To vectorize it, LLVM needs masked stores, instructions that write only the lanes where the condition holds. SSE, the default, doesn't have them, so the loop stays scalar. AVX2 does, and AVX-512 can mask nearly any instruction.

If you want vector code on every target, you have to say so. Either write the update without the branch, or write the vector code yourself in packets of eight particles.

{{< side-by-side left="Odin, without the branch" right="Odin, with packets" >}}
```odin
for &b in bs {
	b.pos += b.vel * (b.life > 0 ? dt : 0)
}
```
<--->
```odin
P :: struct { x, vx, life: f32 }

move :: proc(p: ^#soa[8]P, dt: f32) {
	life  := simd.from_array(p.life)
	x     := simd.from_array(p.x)
	vx    := simd.from_array(p.vx)
	alive := simd.lanes_gt(life, 0)
	p.x = simd.to_array(
		simd.select(alive, x + vx*dt, x))
}

for &block in blocks { // []#soa[8]P
	move(&block, dt)
}
```
{{< /side-by-side >}}

The `blocks` slice in the packet version has the same layout as ISPC's `soa<8>`.

```odin
// the same layout as ISPC's soa<8>:
// 8 x, 8 vx, 8 life, then the next block
blocks: []#soa[8]P

// element i is at position i%8 in block i/8
x := blocks[i/8][i%8].x
```

| Form               | Default                | `-microarch:x86-64-v3`        | `-microarch:native`, Zen 4 |
|--------------------|------------------------|-------------------------------|----------------------------|
| `if`               | not vectorized, 60 ms  | 8 lanes, masked stores, 92 ms | 16 lanes, masked, 20 ms    |
| Without the branch | 4 lanes, 30 ms         | 8 lanes, 19 ms                | 16 lanes, 20 ms            |
| Packets            | 8 lanes, in two halves | 8 lanes                       | 8 lanes                    |

The branch-free version writes every element, alive or not. Apart from an infinite or NaN velocity, or the sign of a zero, it gives the same answer as the `if`, and it vectorizes everywhere. Masked stores aren't free either. On our Zen 4, the AVX2 version of the `if` is actually slower than the scalar one. Vector code isn't faster just because it's vector code, so profile it before you assume it helped.

## Summing an Array

Adding up an array sounds like the easiest loop there is, but it shows quite clearly how each language treats floating point.

{{< side-by-side >}}
```c
export uniform float total(uniform float x[],
                           uniform int   n) {
	float sum = 0;
	foreach (i = 0 ... n) {
		sum += x[i];
	}
	return reduce_add(sum);
}
```
<--->
```odin
V :: #simd[8]f32

total :: proc(x: []f32) -> f32 {
	sums: V
	n := len(x) / 8
	for k in 0..<n {
		sums += simd.from_slice(V, x[8*k:])
	}
	sum := simd.reduce_add_pairs(sums)
	for v in x[8*n:] {
		sum += v
	}
	return sum
}
```
{{< /side-by-side >}}

The plain `for v in x { sum += v }` isn't vectorized in Odin, because floating-point addition isn't associative. Split a sum into partial sums and the result can change, and Odin won't change your result behind your back. (Integer sums don't have that problem, and they are vectorized.) Writing the partial sums yourself brings the loop from 50 ms down to 7 ms. The price is a three-line tail for the leftover elements, which ISPC's `foreach` handles for you.

**Note:** ISPC's version needs no tail, but its result depends on the gang size. Summing `1e8` and 1,002 ones gives 100,000,752 with a gang of 4, 100,000,880 with 8, and 100,000,944 with 16.

## Lookups

Reading a table through an array of indices is common enough. In vector code that's a *gather*, one load per lane, each from its own address.

{{< side-by-side >}}
```c
export void lookup(uniform float table[],
                   uniform int   idx[],
                   uniform float out[],
                   uniform int   n) {
	foreach (i = 0 ... n) {
		out[i] = table[idx[i]];
	}
}
```
<--->
```odin
lookup :: proc(table:         [^]f32,
               idx:           [^]i32,
               #no_alias out: [^]f32,
               n:             int) {
	for i in 0..<n {
		out[i] = table[idx[i]]
	}
}
```
{{< /side-by-side >}}

ISPC gathers on any target that has a gather instruction. It's allowed to assume `out` doesn't overlap `table`, because `foreach` iterations must not depend on each other. An Odin loop runs in order, and as far as LLVM knows, `out` might overlap `table`, so it keeps the loop scalar until you say otherwise with `#no_alias`. Even then it only gathers where gathers are fast, which means `-microarch:skylake` or a Zen 4 with `-microarch:native`, but not the generic `x86-64-v3`.

**Note:** At the time of writing, `#no_alias` only goes on pointer parameters, which is why this version takes multi-pointers and a length, just like the ISPC one.

## Stopping Early

Once you've found the first dead particle, there's no point looking at the rest. ISPC won't let you `break` or `return` inside a `foreach`, so you step through the array a gang at a time yourself.

{{< side-by-side >}}
```c
export uniform int first_dead(uniform float life[],
                              uniform int   n) {
	for (uniform int i = 0; i < n; i += programCount) {
		int j = i + programIndex;
		bool dead = j < n && life[j] <= 0;
		if (any(dead)) {
			return i + count_trailing_zeros(packmask(dead));
		}
	}
	return -1;
}
```
<--->
```odin
first_dead :: proc(ps: #soa[]P) -> int {
	// not vectorized because the loop can return early
	for p, i in ps {
		if p.life <= 0 {
			return i
		}
	}
	return -1
}
```
{{< /side-by-side >}}

In Odin the search is just a loop, and `return` works the way you'd expect. LLVM won't vectorize a loop like this, though. When the search matters, you can write the packet version instead, and it's no longer than ISPC's.

{{< side-by-side >}}
```c
export uniform int first_dead(uniform float life[],
                              uniform int   n) {
	for (uniform int i = 0; i < n; i += programCount) {
		int j = i + programIndex;
		bool dead = j < n && life[j] <= 0;
		if (any(dead)) {
			return i + count_trailing_zeros(packmask(dead));
		}
	}
	return -1;
}
// copied again for comparison
```
<--->
```odin
first_dead :: proc(blocks: []#soa[8]P) -> int {
	for &b, k in blocks {
		life := simd.from_array(b.life)
		dead := simd.lanes_le(life, 0)
		for lane in simd.extract_msbs(dead) {
			return 8*k + lane
		}
	}
	return -1
}
```
{{< /side-by-side >}}

`simd.extract_msbs` turns the comparison into a `bit_set` of dead lanes, and looping over it hands you the lowest one first. When nothing is dead, both versions scan every particle, and the packets take 7.4 ms against 23 ms for the plain loop.

## Array Compaction

Sometimes you only want the elements that pass a test, packed next to each other. Here that's the indices of every particle that's still alive. ISPC has a function for exactly this, `packed_store_active`, which writes the values of the active program instances next to each other and tells you how many it wrote.

{{< side-by-side >}}
```c
export uniform int alive_ids(uniform float life[],
                             uniform int   n,
                             uniform int   ids[]) {
	uniform int count = 0;
	foreach (i = 0 ... n) {
		if (life[i] > 0) {
			count += packed_store_active(&ids[count], i);
		}
	}
	return count;
}
```
<--->
```odin
alive_ids :: proc(ps: #soa[]P, ids: []i32) -> (n: int) {
	for p, i in ps {
		if p.life > 0 {
			ids[n] = i32(i)
			n += 1
		}
	}
	return
}
```
{{< /side-by-side >}}

The ISPC version updates a `uniform` inside an `if` the instances can disagree on. That's only safe because `packed_store_active` returns the count for the whole gang. In general, a `uniform` changed like that ends up depending on whether any instance took the branch. The Odin loop has no such catch, but it's scalar. Its packet version uses `simd.masked_compress_store`, which is the same operation as `packed_store_active`.

```odin
alive_ids :: proc(blocks: []#soa[8]P, ids: []i32) -> (n: int) {
	for &b, k in blocks {
		life  := simd.from_array(b.life)
		alive := simd.lanes_gt(life, 0)
		lanes := simd.indices(#simd[8]i32) + i32(8*k)
		simd.masked_compress_store(&ids[n], lanes, alive)
		n += card(simd.extract_msbs(alive))
	}
	return
}
```

Here are the timings with half the particles alive at random.

| Build                      | Plain loop | Packets |
|----------------------------|-----------:|--------:|
| Default                    |      58 ms |   44 ms |
| `-microarch:x86-64-v3`     |      58 ms |   42 ms |
| `-microarch:native`, Zen 4 |      58 ms |  128 ms |

The packets win right up until AVX-512. There the compress becomes `vpcompressd` to memory, which the Zen 4 runs slowly, and the plain loop comes out ahead.

## Choosing the Width

Most of the examples so far have taken their vector width from the build, but sometimes you want a say in it. ISPC picks the gang size once per compile, from `--target`, though it can also build one file for several targets and pick between them at run time. Odin lets you choose at whatever level you need. `-microarch` sets it for the whole program, a type like `#simd[8]f32` fixes it for one value, and `@(enable_target_feature)` sets it for a single procedure, with a dispatch you write yourself.

{{< side-by-side >}}
```sh
ispc step.ispc --target=avx2-i32x8 -o step.o -h step.h
```
<--->
```odin
@(enable_target_feature="avx2")
step_avx2 :: proc(ps: #soa[]Particle, dt: f32) {
	#force_inline step(ps, dt)
}

step_any :: proc(ps: #soa[]Particle, dt: f32) {
	if .avx2 in info.cpu_features() {
		step_avx2(ps, dt)
	} else {
		step(ps, dt)
	}
}
```
{{< /side-by-side >}}

The `#force_inline` at the call compiles `step`'s loop a second time, inside `step_avx2`, where LLVM vectorizes it with AVX2's 8 lanes. `step_any` checks the CPU and runs whichever version it supports. In a default build that takes 19.5 ms against 25 ms for plain `step`, and the rest of the program keeps the default target.

## Dependent Iterations

Not every loop can run in any order. In a running total, each step adds the element the previous step has just updated.

{{< side-by-side >}}
```c
// undefined behaviour in a foreach,
// so it has to be a serial loop
for (uniform int i = 1; i < n; i++) {
	x[i] += x[i-1];
}
```
<--->
```odin
for i in 1..<len(x) {
	x[i] += x[i-1]
}
```
{{< /side-by-side >}}

ISPC's `foreach` is free to run its iterations in any order, and the ISPC User's Guide calls a dependence like this undefined behaviour. The compiler won't stop you writing one, though. It's up to you to spot it and use a serial `for` instead. Odin only has one kind of loop, and it always runs in order. LLVM vectorizes it only when that gives the same answer, and this one stays scalar.

A running total can still be vectorized, as a scan. Each block of eight adds up its own lanes in three shifted steps, plus the total carried over from the block before. ISPC has `exclusive_scan_add` for the part within a block, and Odin has `simd.scan_add`.

{{< side-by-side >}}
```c
uniform float carry = 0;
for (uniform int i = 0; i < n; i += programCount) {
	int j = i + programIndex;
	float v = j < n ? x[j] : 0;
	float s = carry + exclusive_scan_add(v) + v;
	if (j < n) {
		x[j] = s;
	}
	carry = extract(s, programCount - 1);
}
```
<--->
```odin
V :: #simd[8]f32

carry: V
n := len(x) / 8
blocks := slice.reinterpret([][8]f32, x[:8*n])
for &block in blocks {
	v := simd.from_array(block)
	v  = simd.scan_add(v) + carry
	block = simd.to_array(v)
	carry = simd.shuffle(v, v, 7, 7, 7, 7, 7, 7, 7, 7)
}
for i in max(8*n, 1)..<len(x) {
	x[i] += x[i-1]
}
```
{{< /side-by-side >}}

Both add the numbers in a different order from the plain loop, and for floats that can change the last bits of the result. On our Zen 4 the Odin scan takes 18 ms where the plain loop takes 56 ms, and it stays well ahead with `-microarch:x86-64-v3` and `-microarch:native`. The carry stays a vector, with its last lane copied across by a shuffle. Carried as a plain `f32` instead, the loop is slower than the scalar one with `-microarch:native`.

## Conclusion

ISPC is a domain-specific language for kernels. You write the code for one program instance and say which values vary across the lanes, and the compiler takes it from there. It runs the code across the gang and masks whatever the instances disagree on. Odin is a general-purpose language. `#soa` gives you the layout, a loop stays a loop, and you pick the vector width when it matters.

ISPC does a lot for you implicitly. It masks every branch on every target, handles the last partial gang, comes with cross-lane helpers such as `foreach_unique` and scans for `and` and `or`, builds for several targets at once, and spreads work over the cores with `launch`. Odin can do all of this too, but you write it yourself, using a branch-free form or packets instead of masking, a tail loop, `core:simd` for the cross-lane work, `@(enable_target_feature)` for dispatch, and `core:thread` for the cores.

The cost of all that help is that the target decides more than you'd think. The gang size changes the performance, `soa<8>` blocks that stop matching fall back to gathers, and a floating-point sum can come out differently depending on what you compiled for. In Odin, loops run in order, vectorizing never changes your result, and the width you write is the width you get. The kernel lives in the same program as everything else, and bounds checks and zeroed variables are on by default. The flip side is that you sometimes have to make the call yourself, and on the Zen 4, masked and compress stores helped on some builds and hurt on others.

The one thing Odin can't match is GPUs. ISPC also compiles for Intel's GPUs, and Odin doesn't target GPUs at all. Personally, I think shader languages need to be different anyway. The architecture is different, and trying to merge the languages before merging the computational models is not a good idea, at least not yet.
