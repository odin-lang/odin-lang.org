---
title: Solar Storm
slug: solar_storm
summary: A scifi artillery game to play with your friends <img src="/images/showcase/solar_storm.gif" class="showcase-preview">
author: Jakub Tomšů
date: '2024-03-05'
categories:
  - showcase
---

Solar Storm is a retro turn-based artillery shooter with tons of explosions and unique weapons. It's inspired by local multiplayer games from the 90s, such as Worms or Scorched Earth.

### Demo Trailer

{{< youtube id="5_ru0hrqeZs" >}}

## Custom Odin Engine
The game is written from scratch in Odin, which was chosen because of it's simplicity.

The engine has many features, such as:
- code and shader hotreloading
- fast instanced rendering
- procedural destructible terrain
- continuous collision
- localization system
- Steam API integration
- FMOD Studio integration
- custom immediate-mode GUI with both mouse and controller support

### Zero memory allocations
The game itself doesn't do any dynamic memory allocations at runtime. All of the memory for the game state is statically allocated, most common datastructure is a custom static array. This is not only great for simplicity, but also for performance, stability and predictability. The game also heavily uses `context.temp_allocator`, which along with external C libraries is the only source of dynamic memory allocations.

### Sokol
The game engine is built on [Sokol](https://github.com/floooh/sokol), which is a set of STB-style C/C++ libraries. In particular `sokol_app` for a cross-platform OS interface, and `sokol_gfx` for rendering API abstraction. All of the shaders in the game are compiled with `sokol-shdc`, which is a cross-platform shader compiler for `sokol_gfx`. Sokol has official Odin bindings, which makes it ideal for game and engine development in Odin!

## Play on Steam!
You can play a free demo on Steam: https://store.steampowered.com/app/2754920/Solar_Storm/

The full version is coming in Q1 2024.

<div id="contenedor">
  <iframe src="https://store.steampowered.com/widget/2754920/" frameborder="0" width="100%" height="190"></iframe>
</div>