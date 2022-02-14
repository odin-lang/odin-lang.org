---
title: Style Guide
linktitle: Style Guide
weight: 7
---

### Packages
Package names are denoted with snake case.

Example:

```odin
package container_small_array
```

### Imports
Import names are denoted with snake case.

Example:

```odin
import "collection:example_name"
```

### Constants 
Constants are denoted with screaming snake case. 

Example:

```odin
WINDOW_WIDTH :: 1600
WINDOW_TITLE :: "Hello Window!"
```

### Procedures
Procedures are denoted with snake case.

Example:

```odin
set_window_width :: proc(width, height: i32) {}
init_window :: proc(width: i32, height: i32, title_example: string) -> Window_Handle { 
        // Random variable here but a good example regardless.
        velocity: [2]f32 = { // Prefer single words if possible.
                10.0, 2.0,
        }
        return Window_Handle {} 
}
```

### Type Declarations

All type declarations are denoted with Ada case.

The members within are snake case. Members should have their colon aligned to the left.

Example:

```odin
Physics_World :: struct {
        gravity: Vec2,
}

Event_Data :: union {
        [128] bool,
        [4]   i32,
        [4]   f32,
}

Event_Error :: enum {
	None,
	Valid,
}
```

### Indent and Aligning Styles
Odin uses a tab to indent things and aligns things with spaces.

### Semicolons as Statement Terminators
Semicolons are left out in a typical odin codebase and are mainly used as a way to end a statement.

### Non-Native Code(bindings)
Non-Native Code(bindings) must use their original name style.
