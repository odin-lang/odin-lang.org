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
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

## Clone and build Odin
- Clone Odin with: `git clone https://github.com/odin-lang/Odin`.
- Build Odin by following the steps specific to your platform.

### Windows
- Install Visual Studio (VS2019-2022 is recommended, VS2017 works).
- Open a valid command prompt by either:
    - A) Running the `x64 Native Tools Command Prompt for VS2017` shortcut bundled with Visual Studio.
    - B) Running `vcvarsall.bat x64` from a blank `cmd` session.
- Navigate to the Odin directory inside the command prompt.
- Run `build.bat` to build Odin. That creates the `odin` binary.
- Use `odin --help` to learn how to run your first Odin program.

**Note:** The Odin repository includes the necessary LLVM components for Windows.

**Note:** Odin requires `link.exe` from Visual Studio; it must be in the PATH to work.

### MacOS
- Install XCode (from the App Store or their [website](https://developer.apple.com/xcode/)).
- Install XCode command-line tools: `xcode-select --install`.
- Install [Homebrew](https://brew.sh/).
- Install LLVM through Homebrew: `brew install llvm@14`.
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

**Note:** On newer versions of MacOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/` to install the missing ones.

### Linux
- Install `llvm14`, `clang14`, and `make` through your package manager.
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

**Note:** The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straightforward as you need to make the mentioned libraries available. As a result, we recommend explicitly invoking the compiler with `/path/to/Odin` in your preferred build system or adding `/path/to/Odin` to `$PATH`.

**Note:** If you get the error: `'atomic.h' file not found`, try installing `libx32stdc++-12-dev`.

**Note:** If you get the error: `'sys/wait.h' file not found` and `'stdio.h' file not found`, try installing `g++`.

**Note:** If you get the error: `'linux/futex.h' file not found`, try installing `linux-headers`.

**Note:** On some distributions, you need to add a "-dev" suffix to the llvm and clang packages like so: `llvm14-dev`, `clang14-dev` to get the development files.

**Note:** The package names may differ slightly depending on your distribution.

### BSD
- On FreeBSD, run: `pkg install bash git llvm14`
- [Add the LLVM binaries to your `$PATH`.](#add-llvm-to-your-path)
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- [Add the Odin directory to your `$PATH`.](#add-odin-to-your-path)
- Use `odin --help` to learn how to run your first Odin program.

## Add LLVM to your PATH
To add LLVM to the `$PATH` environment variable, insert the line: `export PATH=$PATH:/path/to/llvm/bin` in your shell configuration file. This file may be called `~/.bashrc` or `~/.zshrc` or `/etc/profile`; it depends on your shell and platform. Then apply the change to the current session by running: `source ~/.name_of_shell_config_file`. Alternatively, you can restart the terminal to apply the change.

**Note:** The installed location of LLVM depends on your platform. Two possible locations to look into are: `/usr/local/opt/llvm/bin` and `/usr/lib/llvm14/bin`.

## Add Odin to your PATH
To add Odin to the `$PATH` environment variable, insert the line: `export PATH=$PATH:/path/to/Odin` in your shell configuration file. This file may be called `~/.bashrc` or `~/.zshrc` or `/etc/profile`; it depends on your shell and platform. Then apply the change to the current session by running: `source ~/.name_of_shell_config_file`. Alternatively, you can restart the terminal to apply the change.

## Update Odin
If you cloned the Odin repository, you update the compiler by running `git pull` and then rebuilding it with `make`.

If you downloaded a pre-built Odin binary, you update the compiler by downloading and extracting a new version.

## What's next?
Check out the [Odin Overview](https://odin-lang.org/docs/overview/) for more information on the Odin Programming Language.
