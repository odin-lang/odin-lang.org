---
title: Home
hide_title: true
images:
- https://odin-lang.org/images/logo-slim.png
---
<div id="home-info">
	<a href="//odin-lang.org">
		<div class="logo" style="max-width: 20em"><img alt="Odin Programming Language" src="/images/logo-slim.png"></div>
	</a>

	<p>A fast, concise, readable, pragmatic and open sourced programming language.</p>
	<br>
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
	<p>
		<a href="https://discord.gg/hnwN2Rj">
	        <img src="https://img.shields.io/discord/568138951836172421?logo=discord">
	    </a>
	</p>
</div>

# The Odin Programming Language


The Odin programming language is designed with the intent of creating an alternative to C with the following goals:

* simplicity
* high performance
* built for modern systems
* joy of programming

<br>

## Example Code

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

## Language Features

* Built-in types: strings, array, slices, dynamic arrays, maps, 128-bit integers, endian-specific integers
* [Multiple return arguments](/docs/overview/#multiple-results)
* Consistent value declaration syntax
* [Parametric polymorphism](/docs/overview/#parametric-polymorphism)
* [Compile time conditions](/docs/overview/#when-statement) (`when` statements) and stress where there is not full blown compile time execution
* [`defer` statement](/docs/overview/#defer-statement)
* [`using` statement](/docs/overview/#using-statement)
* The [implicit `context` system](/docs/overview/#implicit-context-system) and [memory allocator system](/docs/overview/#allocators)
* [Explicit procedure overloading](/docs/overview/#explicit-procedure-overloading)

## Financial Support

<div class="help-sponsor">
	<a href="https://www.patreon.com/gingerbill">
		<img src="/images/Patreon_Dark.jpg" alt="Patreon">
		<p>Sponsor Odin for $1/month or more</p>
	</a>
</div>

<script async defer src="/js/github-buttons.js"></script>
