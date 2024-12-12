---
title: Orca Odin Support
summary: How to use Orca as a new platform target and examples
slug: orca-odin
author: Michael Kutowski
date: '2024-12-11'
categories:
  - orca
  - odin
---

## WebAssembly apps without the web. 

[A brand-new stack for cross-platform apps.](https://orca-app.dev)

For more detailed information you can read up on the link above. Please note that Orca is still work in progress.

## Orca

Orca is a new target `-target:orca_wasm32` that Odin now supports! It outputs a WASM blob that can be bundled through the Orca pipeline.

### Bindings Generator

Michael Kutowski (Skytrias) focused on getting the automatic bindings generator up and running. It's a Python script which takes in the `api.json` that's generated through the Orca source code.

Binding generator: [orca-app/orca-odin](https://github.com/orca-app/orca-odin)

Core library: [core:sys/orca](https://github.com/odin-lang/Odin/blob/master/core/sys/orca/odin.odin)

### Compiler Support

gingerBill and Laytan implemented the Orca target properly in the compiler and made sure it works properly. 

### User Experience

There are a few things which Odin also does to make the experience of developing for the Orca target more pleasant:
- main entrypoint automatically bound to the `on_init` event from Orca
- `@fini` calls are bound to `on_terminate` event
- `core:log` can be used normally and uses Orca logging
- str8 type from Orca maps natively to Odin's string type
- [C Macros](https://github.com/orca-app/orca-odin/blob/master/macros.odin) are implemented as normal procedures on the Odin side
- Usage of macros for defer are done through @deferred calls

## Orca Original Examples

The Odin [examples](https://github.com/odin-lang/examples/tree/master/orca) repo includes ports of the C Orca examples for more full fledged examples of using Orca with Odin.

## Orca Step By Step

In the following examples you can see how easy it is to create programs now!
Additionally, you also need to specify the output, as shown below, which will then be used by Orca to bundle up the application. All examples can be built this way.

```
odin build src -target:orca_wasm32 -out:module.wasm 
orca bundle --name output module.wasm
```

I've added comments on most lines to describe what is happening, the examples should be read top to bottom.

### Orca Package (Bindings)

[core:sys/orca](https://github.com/odin-lang/Odin/blob/master/core/sys/orca/odin.odin) for a quick cheatsheet of all the procedures available.

### Plain Window

```odin
package src

main :: proc() {}
```

<img src="/images/news/orca_plain_window.png" class="figure-img img-fluid rounded">

That looks easy! Even simpler than [raylib](https://www.raylib.com) and reminds me of game libraries like [love2d](https://love2d.org) where things just work.

### Rectangle Fill (Fixed Size)
```odin
package src

import oc "core:sys/orca"

// globals
surface: oc.surface
renderer: oc.canvas_renderer
canvas: oc.canvas_context

main :: proc() {
  // init globals
  renderer = oc.canvas_renderer_create()
  surface = oc.canvas_surface_create(renderer)
  canvas = oc.canvas_context_create()
}

// Export the 'oc_on_frame_refresh' implemented call so it's bound to the Orca application.
@(export)
oc_on_frame_refresh :: proc "c" () {
  // This runs every frame and we just want to setup the canvas fresh.
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // Set a RGBA color and fill a rectangular region on the screen (x y w h).
  oc.set_color_rgba(0, 0, 0, 1)
  oc.rectangle_fill(50, 50, 100, 10)
  
  // Finish all the canvas operations up and render them to the screen.
  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```
<img src="/images/news/orca_rectangle_fill_fixed.png" class="figure-img img-fluid rounded">

### Rectangle Fill (Window Sized)

```odin
package src

import oc "core:sys/orca"

surface: oc.surface
renderer: oc.canvas_renderer
canvas: oc.canvas_context
frame_size: oc.vec2 = {500, 500} // Our wanted starting window size

main :: proc() {
  renderer = oc.canvas_renderer_create()
  surface = oc.canvas_surface_create(renderer)
  canvas = oc.canvas_context_create()

  // We provide our wanted dimensions at startup.
  oc.window_set_size(frame_size)
}

// Export the 'oc_on_resize' implemented call so it's bound to the Orca application. This will be called whenever the window size changes.
@(export)
oc_on_resize :: proc "c" (width, height: u32) {
  frame_size.x = f32(width)
  frame_size.y = f32(height)
}

@(export)
oc_on_frame_refresh :: proc "c" () {
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // Set the color to black and fill the window subtracted by some margin.
  oc.set_color_rgba(0, 0, 0, 1)
  SIZE :: 50
  width := frame_size.x - SIZE * 2
  height := frame_size.y - SIZE * 2
  oc.rectangle_fill(SIZE, SIZE, width, height)

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```

<div class="text-center">
  <img src="/images/news/orca_rectangle_fill_window.png" class="img-fluid rounded">
</div>

### Text Rendering

The next example uses a resource that needs to be specified:

```
odin build src -target:orca_wasm32 -out:module.wasm 
orca bundle --name output --resource-dir data module.wasm
```

```odin
package src

import oc "core:sys/orca"

surface: oc.surface
renderer: oc.canvas_renderer
canvas: oc.canvas_context
font: oc.font // font global

main :: proc() {
  renderer = oc.canvas_renderer_create()
  surface = oc.canvas_surface_create(renderer)
  canvas = oc.canvas_context_create()

  // NOTE: This is temporary and will change soon
  // Describe wanted unicode ranges to usable for rendering
  ranges := [?]oc.unicode_range {
    oc.UNICODE_BASIC_LATIN,
    oc.UNICODE_C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
    oc.UNICODE_LATIN_EXTENDED_A,
    oc.UNICODE_LATIN_EXTENDED_B,
    oc.UNICODE_SPECIALS,
  }

  // Create the font from a TTF asset that needs to be provided.
  font = oc.font_create_from_path("segoeui.ttf", 5, &ranges[0])    
}

@(export)
oc_on_frame_refresh :: proc "c" () {
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // Set the wanted font and a size.
  oc.set_font(font)
  oc.set_font_size(40)

  // Similar to before set a color and the text we want to draw at x & y.
  oc.set_color_rgba(0, 0, 0, 1)
  oc.text_fill(50, 50, "Hello World")

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```

<img src="/images/news/orca_text_rendering.png" class="figure-img img-fluid rounded">

### Rectangle Fill following Mouse

```odin
package src

import oc "core:sys/orca"

surface: oc.surface
renderer: oc.canvas_renderer
canvas: oc.canvas_context
mouse: oc.vec2

main :: proc() {
  renderer = oc.canvas_renderer_create()
  surface = oc.canvas_surface_create(renderer)
  canvas = oc.canvas_context_create()
}

// Export the 'oc_on_raw_event' implemented call so it's bound to the Orca application. This way we can check for window specific events like mouse movement, mouse clicks, keyboard events etc.
@(export)
oc_on_raw_event :: proc "c" (event: ^oc.event) {
  if event.type == .MOUSE_MOVE {
    mouse = { event.mouse.x, event.mouse.y }
  }    
}

@(export)
oc_on_frame_refresh :: proc "c" () {
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // Fill the rectangle region while x & y is following the mouse.
  oc.set_color_rgba(0, 0, 0, 1)
  oc.rectangle_fill(mouse.x - 50, mouse.y - 50, 100, 100)

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```
