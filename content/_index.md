---
title: Home
hide_title: true
images:
- https://odin-lang.org/images/logo-slim.png
---
<center id="hero">
	<a href="//odin-lang.org">
		<div style="max-width: 20em"><img class="center" alt="Odin Programming Language" src="/images/logo-slim.png"></div>
	</a>
	<p id="hero-text">A fast, concise, readable, pragmatic and open sourced programming language.</p>
</center>

<section id="buttons">
<p>
	<a class="github-button" href="https://github.com/odin-lang" aria-label="Follow @odin-lang on GitHub">Follow @odin-lang</a>
	<a class="github-button" href="https://github.com/odin-lang/Odin" data-size="small" aria-label="Star odin-lang/Odin on GitHub">Star</a>
	<a class="github-button" href="https://github.com/odin-lang/Odin/subscription" aria-label="Watch odin-lang/Odin on GitHub">Watch</a>
</p>
<p>
	<a href="https://github.com/odin-lang/odin/releases/latest">
		<img src="https://img.shields.io/github/release/odin-lang/odin.svg">
	</a>
	<a href="https://github.com/odin-lang/odin/releases/latest">
		<img src="https://img.shields.io/badge/platforms-Windows%20|%20Linux%20|%20macOS-green.svg">
	</a>
	<a href="https://github.com/odin-lang/odin/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/odin-lang/odin.svg">
	</a>
</p>
</section>

# Design Goals

The Odin programming language is designed with the intent of creating an alternative to C with the following goals:

* simplicity
* high performance
* built for modern systems
* joy of programming

# Example Code

```odin
package main

import "core:fmt"

main :: proc() {
	program := "+ + * 😃 - /";
	accumulator := 0;

	for token in program {
		switch token {
		case '+': accumulator += 1;
		case '-': accumulator -= 1;
		case '*': accumulator *= 2;
		case '/': accumulator /= 2;
		case '😃': accumulator *= accumulator;
		case: // Ignore everything else
		}
	}

	fmt.printf("The program \"%s\" calculates the value %d\n",
	           program, accumulator);
}
```

# Language Features

* Built-in types: strings, array, slices, dynamic arrays, maps, 128-bit integers, endian-specific integers
* Multiple return arguments
* Consistent value declaration syntax
* Parametric polymorphism
* Compile time conditions (`when` statements) and stress where there is not full blown compile time execution
* The `context` system and memory allocator system
* Explicit procedure overloading


<script async defer src="/js/github-buttons.js"></script>
