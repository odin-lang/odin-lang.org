---
title: Compiling to WASM
summary: How to compile Odin into WASM for the web and freestanding targets.
weight: 7
---

## Wasm on the Web

To build Odin for the web, build for the `has_wasm32` target. You would need to include the runtime script at [`vendor:wasm/js/runtime.js`](https://github.com/odin-lang/Odin/blob/master/vendor/wasm/js/runtime.js) into your webserver.

```js
<script type="text/javascript" src="runtime.js"></script>
<script type="text/javascript">
	odin.runWasm(pathToWasm, consolePreElement);
</script>
```

## Wasm for plug-ins

Odin offers two targets useful to write WASM for plugins. `wasi_wasm32` implements the [WASI Preview 1 API](https://github.com/WebAssembly/WASI). `freestanding_wasm32` implements no API by default and needs to import and export everything needed. Also, like all freestanding targets, the default allocator is not set.

For a WASM module that exports two functions, it is useful to set the allocator in a lazily initialized global variable.

```odin
import "base:runtime"

g_ctx: Maybe(runtime.Context) = nil

setup_global_context :: proc "contextless"() -> runtime.Context {
	ctx := runtime.default_context()
	ctx.allocator = runtime.default_wasm_allocator()
	
	g_ctx = ctx 
	return ctx
}

@(export)
add :: proc "c" (a, b: i32) -> i32 {
	context = g_ctx.? or_else setup_global_context()
	// do work here
	return a + b
}

@(export)
sub :: proc "c" (a, b: i32) -> i32 {
	context = g_ctx.? or_else setup_global_context()
	// do work here
	return a - b
}
```

