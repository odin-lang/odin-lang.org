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

For more detailed information you can read up on the link above. Please note that orca is still Work in Progress.

## Orca

Orca is a new target `-target:orca_wasm32` that odin supports now! It outputs a wasm blob that can be bundled through the orca pipeline.

### Bindings Generator

Michael Kutowski (Skytrias) focused on getting the automatic bindings genrator up and running. It's a python script which takes in the `api.json` that's generated through the orca source code. 

Binding Generator: [orca-app/orca-odin](https://github.com/orca-app/orca-odin)

Core Library: [core:sys/orca](https://github.com/odin-lang/Odin/blob/master/core/sys/orca/odin.odin)

### Compiler Support

GingerBill and Laytan implemented the orca target properly in the compiler and made sure it works properly. 

### User Experience

There are a few things which odin also does to make the experience of developing for the orca target more pleasant:
- main entrypoint automatically bound to the `on_init` event from orca
- `@fini` calls are bound to `on_terminate` event
- `core:log` can be used normally -> uses orca logging
- str8 type from orca maps natively to odins string type
- [C Macros](https://github.com/orca-app/orca-odin/blob/master/macros.odin) are implemented as normal procedures on the odin side
- Usage of macros for defer are done through @deferred calls

## Orca Original Examples

The odin [examples](https://github.com/odin-lang/examples/tree/master/orca) repo includes ports of the C orca examples for more full fledged examples of orca within odin. 

## Orca Step By Step

In the upcoming Examples you can see how easy it is to create programs now!
Additionally you also need to specifiy the output as shown below which will then be used by orca to bundle up the application. All examples can be built this way

```
odin build src -target:orca_wasm32 -out:module.wasm 
orca bundle --name output module.wasm
```

I've added comments on most lines to describe what is happening, the examples should be read top to bottom.

### Orca Package (Bindings)

[core:sys/orca](https://github.com/odin-lang/Odin/blob/master/core/sys/orca/odin.odin) for a quick cheatsheet of all the procedures available

### Plain Window

```odin
package src

main :: proc() {}
```

That looks easy! Even simpler than raylib and reminds me of game libraries like love2d where things just work.

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

// export the 'oc_on_frame_refresh' implemented call so it's bound to the orca application
@(export)
oc_on_frame_refresh :: proc "c" () {
  // This runs every frame and we just want to setup the canvas fresh
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // set a RGBA color and fill a rectangular region on the screen (x y w h)
  oc.set_color_rgba(0, 0, 0, 1)
  oc.rectangle_fill(50, 50, 100, 10)
  
  // finish all the canvas operations up and render them to the screen
  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```

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

  // We provide our wanted dimensions at startup
  oc.window_set_size(frame_size)
}

// export the 'oc_on_resize' implemented call so it's bound to the orca application, this will be called whenever the window size changes
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

  // set the color to black and fill the window subtracted by some margin
  oc.set_color_rgba(0, 0, 0, 1)
  SIZE :: 50
  width := frame_size.x - SIZE * 2
  height := frame_size.y - SIZE * 2
  oc.rectangle_fill(SIZE, SIZE, width, height)

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}```

### Text Rendering

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

  // create the font from an ttf asset that needs to be provided
  font = oc.font_create_from_path("segoeui.ttf", 5, &ranges[0])    
}

@(export)
oc_on_frame_refresh :: proc "c" () {
  oc.canvas_context_select(canvas)
  oc.set_color_rgba(1, 1, 1, 1)
  oc.clear()

  // set the wanted font and a size
  oc.set_font(font)
  oc.set_font_size(40)

  // similar to before set a color and the text we want to draw at x & y
  oc.set_color_rgba(0, 0, 0, 1)
  oc.text_fill(50, 50, "Hello World")

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```

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

// export the 'oc_on_raw_event' implemented call so it's bound to the orca application, this way we can check for window specific events like mouse movement, mouse clicks, keyboard events etc.
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

  // fill the rectangle region while x & y is following the mouse
  oc.set_color_rgba(0, 0, 0, 1)
  oc.rectangle_fill(mouse.x - 50, mouse.y - 50, 100, 100)

  oc.canvas_render(renderer, canvas, surface)
  oc.canvas_present(renderer, surface)    
}
```
