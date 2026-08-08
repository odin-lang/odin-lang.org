---
title: 2026 Spring & Summer Newsletter
summary: Highlights for Spring & Summer of 2026
slug: newsletter-2026-spring-summer
author: Jeroen van Rijn
date: '2026-08-07'
categories:
  - newsletter
  - odin
---

## A Message from our Ginger

{{< newsletter-youtube "dLPAqXi9In0" >}}

## Made in Odin

We've renewed the page for projects made in Odin that we'd like to [showcase](/showcase).

A [games](/games) sister page was also added for games made in Odin.

Speaking of which, here are some highlights:

### Blick by Dihedron Software - Available Now

[Blick](https://blickeditor.com/?lang=en) is a fully native nonlinear video editor built from scratch for an editing workflow that keeps up.

A new NLE for the art of editing, with a better workflow and performance than you've ever felt before.

Fully native, built from scratch. Blick is written from scratch in Odin. The renderer, the UI framework, the works. It is built for speed and answers the instant you call.

<a href="https://blickeditor.com/?lang=en" target="_blank" title="Blick"><img src="/images/news/2026-summer-blick.jpg" alt="Blick" class="figure-img img-fluid"></a>

### Vigil by Michael Kutowski - Available Now

[Vigil](https://mktwsk.xyz/vigil) is a portable, CPU-rendered desktop workspace for exploring Odin codebases. It maps packages, imports, symbols, files, and documentation so you can understand a project’s shape before diving into source. Quick Open, source-linked docs, history, favorites, and a minimap keep investigation fast and connected.

Package metrics and import graphs make it easy to trace structure, spot complexity, and focus on the code that matters. Its custom software-rendered interface stays compact, responsive, and portable across macOS, Linux, and Windows.

<a href="https://mktwsk.xyz/vigil" target="_blank" title="Vigil"><img src="/images/news/2026-summer-vigil.jpg" alt="Vigil" class="figure-img img-fluid"></a>

### Fish Lab by Stone Codes - Out on Steam on 14 Sep, 2026

<a href="https://store.steampowered.com/app/4221990/Fish_Lab/" target="_blank" title="Fish Lab">Fish Lab</a> is an incremental game about catching absurd numbers of fish, processing them in your lab, and upgrading until the screen fills with giant GPU-simulated swarms. I made the engine, shaders, and music myself, the visuals are code/shader-driven rather than hand-drawn.

The entire game is synced to the music. Inspired by katamari damacy because I love the feeling of keep zooming out to reveal more and more. I thought this idea would be a great fit for a idle game.

<a href="https://store.steampowered.com/app/4221990/Fish_Lab/" target="_blank" title="Fish Lab"><img src="/images/news/2026-summer-fish-lab.jpg" alt="Fish Lab" class="figure-img img-fluid"></a>

### Daisy Trains by Rockwell Studios - Coming to Steam Soon

<a href="https://store.steampowered.com/app/4905620/Daisy_Trains/" target="_blank" title="Daisy Trains">Daisy Trains</a> is a vibrant, 3D train puzzle game where you will build railways and manage trains to deliver colored cargo containers to their destinations. Both the game and engine are written from scratch in Odin for the joy of game development.

<a href="https://store.steampowered.com/app/4905620/Daisy_Trains/" target="_blank" title="Daisy Trains"><img src="/images/news/2026-summer-daisy-trains.jpg" alt="Daisy Trains" class="figure-img img-fluid"></a>



## New Packages

| Package | Description |
|------|-------------|
| Cryptography |
| [RSA](https://github.com/odin-lang/Odin/tree/master/core/crypto/rsa) | `RSA` (Rivest–Shamir–Adleman) cryptosystem |
| [ASN1](https://github.com/odin-lang/Odin/tree/master/core/encoding/asn1) | Strict `DER` (Distinguished Encoding Rules) reader and writer for the `PKIX` subset of `ASN.1`, the substrate for `X.509` certificates and related structures |
| [Turboshake](https://github.com/odin-lang/Odin/tree/master/core/crypto/turboshake) | [TurboSHAKE](https://keccak.team/turboshake.html) XOF algorithm family |
| [ML-KEM](https://github.com/odin-lang/Odin/tree/master/core/crypto/mlkem) | Post-quantum Module-Lattice-Based Key-Encapsulation Mechanism ([FIPS 203](https://csrc.nist.gov/pubs/fips/203/final)) |
| [ML-DSA](https://github.com/odin-lang/Odin/tree/master/core/crypto/mldsa) | Post-quantum digital signature support ([FIPS 204](https://csrc.nist.gov/pubs/fips/204/final)) |
| [Noise](https://github.com/odin-lang/Odin/tree/master/core/crypto/noise) | [Noise Protocol Framework](https://noiseprotocol.org) implementation |
| [Argon2Id](https://github.com/odin-lang/Odin/tree/master/core/crypto/argon2id) | Argon2Id Memory-Hard Function for Password Hashing and Proof-of-Work Applications ([RFC 9106](https://datatracker.ietf.org/doc/rfc9106/)) |
| [ECDSA](https://github.com/odin-lang/Odin/tree/master/core/crypto/ecdsa) | Elliptic Curve Digital Signature Algorithm per [SEC](https://secg.org/) 2.0 section 4.1 |
| Code Generation & Debugging |
| [rexcode](https://github.com/odin-lang/Odin/tree/master/core/rexcode) | A high-performance multi-architecture instruction encoder/decoder/printer package |
| [trace](https://github.com/odin-lang/Odin/tree/master/core/debug/trace) | `core:debug/trace` was replaced to offer much-improved backtrace functionality |
| Vendor |
| [raylib](https://github.com/odin-lang/Odin/tree/master/vendor/raylib) | [Raylib](https://www.raylib.com), major version 6 update |
| [box3d](https://github.com/odin-lang/Odin/tree/master/vendor/box3d) | [Box3D](https://github.com/erincatto/box3d) physics engine
| [wasapi](https://github.com/odin-lang/Odin/tree/master/vendor/windows/wasapi) | [Windows Audio Sesssion API](https://learn.microsoft.com/en-us/windows/win32/coreaudio/wasapi) |
| [SDL3 Mixer](https://github.com/odin-lang/Odin/tree/master/vendor/sdl3/mixer) | [SDL3's Mixer](https://github.com/libsdl-org/SDL_mixer) was released and bindings were added |
