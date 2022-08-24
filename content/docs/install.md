---
title: Getting Started
summary: Getting Started with Odin. Downloading, installing, and getting your first program to compile and run.
weight: 1
---

Odin is dead-simple to get started with!

<a href="https://github.com/odin-lang/Odin/releases" class="btn btn-outline-primary">Latest Release</a>
<a href="/docs/nightly" class="btn btn-outline-primary">Latest Nightly Builds</a>


## Clone or download Odin binaries
You can either:

Clone the repository `git clone https://github.com/odin-lang/Odin` (recommended).

Or download the latest binaries and add them to your path:

Download [the latest release](https://github.com/odin-lang/Odin/releases/latest).

Download [the latest nightly build](/docs/nightly/).

**Note**: Cloning the repository is recommended in order to make [updating](#updating-the-compiler) easier.

### Support 
Odin supports x86-64/AMD64 on Windows, Linux and macOS, and ARM64 on macOS. Odin also relies on LLVM (for code generation) and an external linker.

### Requirements
The following platform-specific steps are necessary:

- Windows
    * Have Visual Studio installed (VS2019-2022 is recommend, VS2017 will likely work, for the linker)
    * Open a valid command prompt:
        * **Basic:** run the `x64 Native Tools Command Prompt for VS2017` shortcut bundled with VS 2017, or
        * **Advanced:** run `vcvarsall.bat x64` from a blank `cmd` session

- MacOS
    * Install the latest XCode (from the App Store or the [Xcode website](https://developer.apple.com/xcode/))
    * Install XCode command-line tools `xcode-select --install`
    * Install [Homebrew](https://brew.sh/) 
    * Install LLVM through Homebrew with: `brew install llvm`
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable

- GNU/Linux and other \*Nix
    * For Linux: clang and llvm (Using your distro's packet manager)
    * For FreeBSD: `pkg install bash git llvm14`
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable

## Building Odin
Now, it's time to build Odin and get started!

#### For Windows
There's a couple prerequisites here. First, make sure you have Visual Studio installed; you have to compile Odin from source, and Odin also requires `link.exe` from VS anyway. The necessary LLVM components for Windows are included in the Odin repository.

Now, it's time to build Odin and get started! Open the X64 Visual Studio command prompt ([if you don't typically use it, here's how to find it](https://docs.microsoft.com/en-us/dotnet/framework/tools/developer-command-prompt-for-vs)) and navigate to the directory where you downloaded Odin. Run the `build.bat` file, and you should have a successfully built Odin compiler!

To use Odin `link.exe` is required to be in the PATH of the callee as mentioned, this can either be achieved but calling Odin from the X64 Visual Studio command prompt or by calling the vcvarsall.bat (with x64 as an argument) script either in your shell or in your build script.

#### For MacOS
Make sure all requirements for MacOS are installed, after installing LLVM through Homebrew make sure to add it to the PATH:
- run `echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.zshrc_profile` to add LLVM to your PATH.

Then run `source ~/.bash_profile` or `source ~/.zshrc` to update your PATH variable in the current terminal session depending on your shell.

On newer versions of macOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/`.

Now navigate to the Odin directory in your terminal, use `make`, and you should have a newly-built, fresh Odin compiler!

Now you can export the odin folder to the PATH

#### For Linux and other \*Nix
For Linux, make sure you have `llvm` and `clang` installed through your package managers.

For FreeBSD make sure you have `bash`, `git` and the latest version of LLVM (the base `llvm` package is most of the times outdated).

Now navigate to the Odin directory in your terminal, use `make`, and you should have a newly-built, fresh Odin compiler!

**Notes for Linux:** The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straight forward as you need to make sure the mentioned libraries are available. As a result, it is recommended to simply explicitly invoke the compiler with `/path/to/odin` in your preferred build system, or add `/path/to/odin` to `$PATH`.

### Updating the compiler
For a compiler that's in-development like Odin, things move fast. Make sure you keep your compiler up-to-date by running `git pull` and then rebuilding every now and then. (or, if you use releases, redownload and rebuild)

## What Next?
Why not check out the [Odin Overview](/docs/overview/) for more information on the Odin Programming Language!
