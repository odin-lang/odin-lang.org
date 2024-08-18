---
title: Getting Started
summary: How to download and install the Odin compiler. Both from source or from a binary release, along with a list of per-platform requirements.
weight: 1
---

Odin is dead-simple to get started with!

<a href="https://github.com/odin-lang/Odin/releases" class="btn btn-outline-primary">Latest Release</a>
<a href="/docs/nightly" class="btn btn-outline-primary">Latest Nightly Builds</a>


## Clone or download Odin binaries
You can either:

- Clone the repository: `git clone https://github.com/odin-lang/Odin` (makes [updating](#updating-the-compiler) the compiler easier)

or download the latest binaries and add them to your path:

- Download [the latest release](https://github.com/odin-lang/Odin/releases/latest)
- Download [the latest nightly build](/docs/nightly/)

**Note**: If you use the binary version, then you can skip the "Building Odin" section below, but the stuff under [requirements](#requirements) is still required!

### Platform and CPU support 
Odin supports x86-64/AMD64 on Windows, Linux and macOS, and ARM64 on macOS.

Additional supported platforms are FreeBSD, OpenBSD, NetBSD and Haiku. There are no binary releases for those platforms.

### Requirements
Odin relies on LLVM (for code generation) and an external linker. These are needed regardless of if you build from source or use the binary releases. When building from source you also need a C++ compiler. Here follows platform-specific steps on how to acquire these dependencies:

* Windows
    * Install Visual Studio 2019-2022 (2017 may also work)
    * Install Visual Studio workload "Desktop development with C++", required components from that workload are the MSVC build tools and the Windows SDK
    * No LLVM installation is needed, the LLVM DLL is bundled in the repository
* MacOS
    * Install the latest XCode (from the App Store or the [Xcode website](https://developer.apple.com/xcode/))
    * Install XCode command-line tools `xcode-select --install`
    * Install [Homebrew](https://brew.sh/) 
    * Install LLVM through Homebrew with: `brew install llvm`
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable (see `brew info llvm`)
* GNU/Linux and other \*Nix
    * For Linux: clang and llvm (version 11.1, 12, 13, 14, 17, or 18; using your distro's package manager)
    * Note: If an atomic.h error occurs, also add `libx32stdc++-12-dev`
    * Note: If a `No llvm-config command found` error occurs, install `llvm-devel` with your distro's package manager
    * For FreeBSD: `pkg install bash git llvm`
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable

## Building Odin

### For Windows
Make sure you have installed the [requirements](#requirements).

You'll be compiling Odin using a command prompt. In order for the command prompt to find the Visual Studio C++ compiler you'll need to open the X64 Visual Studio command prompt. There are two ways:
* **Basic:** run the `x64 Native Tools Command Prompt for VS20xx` shortcut bundled with Visual Studio (search in start menu), or
* **Advanced:** run `vcvarsall.bat x64` from a blank `cmd` session

Using this command prompt, navigate to the directory where you downloaded Odin and run `build.bat release`. You should now have a working Odin compiler!

**Note**: Run `build.bat` or `build.bat debug` to get a debug compiler. The debug compiler is slower and only needed for troubleshooting the compiler itself.

After this, [add the Odin compiler directory to the PATH environment variable](https://duckduckgo.com/?q=add+to+path+windows) so `odin.exe` is accessible everywhere on your computer.

### For MacOS
Make sure all [requirements](#requirements) for MacOS are installed, after installing LLVM through Homebrew make sure to add it to the PATH:
- run `echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.zshrc_profile` to add LLVM to your PATH.

Then run `source ~/.bash_profile` or `source ~/.zshrc` to update your PATH variable in the current terminal session depending on your shell.

On newer versions of macOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/`.

Now navigate to the Odin directory in your terminal and run `make release`, and you should have a newly-built, fresh Odin compiler!

**Note**: Run `make` or `make debug` to get a debug compiler. The debug compiler is slower and only needed for troubleshooting the compiler itself. 

Finally, export the Odin directory to the PATH by running: `echo 'export PATH="/path/to/your/odin/compiler:$PATH"' >> ~/.zshrc_profile`

### For Linux and other \*Nix
For Linux, make sure you have `llvm` and `clang` installed through your package managers.

For FreeBSD make sure you have `bash`, `git` and the latest version of LLVM (the base `llvm` package is most of the times outdated).

Now navigate to the Odin directory in your terminal and run `make release`, and you should have a newly-built, fresh Odin compiler!

**Note**: Run `make` or `make debug` to get a debug compiler. The debug compiler is slower and only needed for troubleshooting the compiler itself. 

**Notes for Linux:** The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straight forward as you need to make sure the mentioned libraries are available. As a result, it is recommended to simply explicitly invoke the compiler with `/path/to/odin` in your preferred build system, or add `/path/to/odin` to `$PATH`.

## Updating the compiler

### If you build Odin from source
Run `git pull` and the rebuild the compiler using `build.bat release` on Windows or `make release` on other platforms.

**Note**: Change `release` for `debug` (or just omit the word) to get a debug compiler.

### If you use a binary package
Delete all the files in your Odin compiler directory and extract the new compiler into this directory.

**Note**: _Do not_ just copy the new compiler on top of the old one. This will merge the directories, and files that have been renamed or deleted in the new version will then still remain, which may cause issues.

## What Next?
Why not check out the [Odin Overview](/docs/overview/) for more information on the Odin Programming Language!
