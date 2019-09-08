---
title: Getting Started
url: "/docs/install"
---

## Getting started with Odin

Odin is dead-simple to get started with!
Clone the repository (recommended, `git clone https://github.com/gingerBill/Odin`) or download [the latest release](https://github.com/gingerBill/Odin/releases/latest)

#### For Windows...
There's a couple prerequisites here. First, make sure you have Visual Studio installed; you have to compile Odin from source, and Odin also requires `link.exe` from VS anyway. Also, you'll need to download [a couple LLVM binaries](https://github.com/odin-lang/Odin/releases/tag/llvm-windows) and move the `bin` folder in that zip file into your Odin directory. These are used internally by the compiler.

Now, it's time to build Odin and get started! Open the X64 Visual Studio command prompt ([if you don't typically use it, here's how to find it](https://docs.microsoft.com/en-us/dotnet/framework/tools/developer-command-prompt-for-vs)) and navigate to the directory where you downloaded Odin. Run the `build.bat` file, and you should have a successfully built Odin compiler!

To use Odin `link.exe` is required to be in the PATH of the callee as mentioned, this can either be achieved but calling Odin from the X64 Visual Studio command prompt or by calling the vcvarsall.bat (with x64 as an argument) script either in your shell or in your build script.

#### For Mac and \*Nix...

For Linux, make sure you have `llvm` and `clang` installed through your package managers.
For macOS, make sure you've installed the Xcode command-line tools (`xcode-select --install`), then install LLVM. If you use [Homebrew](https://brew.sh/), you can run `brew install llvm` to do this.

Homebrew will not add LLVM to the PATH, run `echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.bash_profile` to add LLVM to your PATH. Then run `source ~/.bash_profile` to update your PATH variable in the current terminal session.

On newer versions of macOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/`.

Now navigate to the Odin directory in your terminal, use `make` or `./build.sh`, and you should have a newly-built, fresh Odin compiler!

### Updating the compiler

For a compiler that's in-development like Odin, things move fast. Make sure you keep your compiler up-to-date by running `git pull` and then rebuilding every now and then. (or, if you use releases, redownload and rebuild)

## Setup

Odin only supports x86-64 at the moment (64-bit), relies on LLVM for code generation and an external linker.

In addition, the following platform-specific steps are necessary:

- Windows
    * Have Visual Studio installed (MSVC 2010 or later, for the linker)
    * Have a copy of `opt.exe` and `llc.exe` in `Odin/bin`. Pre-built Windows binaries can be found [here](https://github.com/odin-lang/Odin/releases/tag/llvm-windows) and *must* be explicitly copied
    * Open a valid command prompt:
        * **Basic:** run the `x64 Native Tools Command Prompt for VS2017` shortcut bundled with VS 2017, or
        * **Advanced:** run `vcvarsall.bat x64` from a blank `cmd` session

- MacOS
    * Have LLVM explicitly installed (`brew install llvm`)
    * Have XCode installed (version X.X or later, for linking)
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable

- GNU/Linux
    * Have LLVM installed (opt/llc)
    * Have Clang installed (version X.X or later, for linking)
    * Make sure the LLVM binaries and the linker are added to your `$PATH` environmental variable

Then build the compiler by calling `build.bat` (Windows) or `make` (Linux/MacOS). This will automatically run the demo program if successful.

**Notes for Linux:**: The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straight forward as you need to make sure the mentioned libraries are available. As a result, it is recommended to simply explicitly invoke the compiler with `/path/to/odin` in your preferred build system, or add `/path/to/odin` to `$PATH`.
