---
title: Getting Started
summary: Getting Odin and running your first program.
weight: 1
---

## Getting Odin
There are two options for getting Odin:
- A) Download a pre-built Odin binary.
- B) Clone the Odin repository and build it yourself (**recommended** to make [updating Odin](#update-odin) easier).

## Download Odin
<a href="https://github.com/odin-lang/Odin/releases/latest" class="btn btn-outline-primary">Latest Release Build</a>
<a href="https://odin-lang.org/docs/nightly/#nightly-builds" class="btn btn-outline-primary">Latest Nightly Build</a>

- Choose either a release build or a nightly build.
- Download the build that is specific to your platform.
- Unzip it and move the directory to your desired location.
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

## Clone and build Odin
- Clone Odin with: `git clone https://github.com/odin-lang/Odin`.
- Build Odin by following the platform-specific steps below.

### Windows
- Install Visual Studio (VS2019-2022 is recommended, VS2017 works).
- Open a valid command prompt by either:
    - A) Running the `x64 Native Tools Command Prompt for VS2017` shortcut bundled with Visual Studio.
    - B) Running `vcvarsall.bat x64` from a blank `cmd` session.
- Navigate to the Odin directory inside the command prompt.
- Run `build.bat` to build Odin. This will create an Odin binary.
- Use `odin --help` to learn how to run your first Odin program.

**Note:** The necessary LLVM components for Windows are included with the Odin repository.

**Note:** Odin requires `link.exe` from Visual Studio, and it must be in the PATH to work.

### MacOS
- Install XCode (from the App Store or their [website](https://developer.apple.com/xcode/)).
- Install XCode command-line tools: `xcode-select --install`.
- Install [Homebrew](https://brew.sh/).
- Install LLVM through Homebrew: `brew install llvm@14`.
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. This will create an Odin binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

**Note:** On newer versions of MacOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/` to install the ones you need.

### Linux
- Install `llvm14`, `clang14`, and `make` through your package manager.
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. This will create an Odin binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

**Note:** The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straightforward as you need to make sure the mentioned libraries are available. As a result, it is recommended to simply explicitly invoke the compiler with `/path/to/Odin` in your preferred build system, or add `/path/to/Odin` to `$PATH`.

**Note:**: If you get the error: `'atomic.h' file not found`, also install `libx32stdc++-12-dev`.

**Note:**: If you get the error: `'sys/wait.h' file not found` and `'stdio.h' file not found`, also install `g++`.

**Note:**: If you get the error: `'linux/futex.h' file not found`, also install `linux-headers`.

**Note:**: On some distributions, you need to add the "-dev" suffix to the llvm and clang packages like so: `llvm14-dev`, `clang14-dev` to get the development files.

**Note:**: The package names may be slightly different depending on your distribution.

### BSD
- On FreeBSD, run: `pkg install bash git llvm14`
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. This will create an Odin binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

## Add LLVM to your PATH
To temporarily add LLVM to the `$PATH` environment variable, run: `export PATH=$PATH:/path/to/llvm/bin`.

To permanently add LLVM to the `$PATH` environment variable, add the line: `export PATH=$PATH:/path/to/llvm/bin` to your shell configuration file. This file may be called `~/.bashrc` or `~/.zshrc` or `/etc/profile` depending on your shell and platform. Then apply the change to the session, by running: `source ~/.name_of_shell_config_file`. Alternatively, just restart the terminal.

**Note:**: The installed location of LLVM depends on your platform. Two possible locations are: `/usr/local/opt/llvm/bin` and `/usr/lib/llvm14/bin`.

## Add Odin to your PATH
To temporarily add Odin to the `$PATH` environment variable, run: `export PATH=$PATH:/path/to/Odin`.

To permanently add Odin to the `$PATH` environment variable, add the line: `export PATH=$PATH:/path/to/Odin` to your shell configuration file. This file may be called `~/.bashrc` or `~/.zshrc` or `/etc/profile` depending on your shell and platform. Then apply the change to the session, by running: `source ~/.name_of_shell_config_file`. Alternatively, just restart the terminal.

## Update Odin
If you chose to clone and build Odin, you can update the compiler by running `git pull` and then `make`.

If you chose to download Odin, you can update the compiler by downloading and extracting a new version.

## What's next?
Check out the [Odin Overview](/docs/overview/) for more information on the Odin Programming Language.
