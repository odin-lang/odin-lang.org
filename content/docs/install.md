---
title: Getting Started
summary: Getting Odin and running your first program.
weight: 1
---

## Getting Odin
There are two options for getting Odin. You can either:
- A) Download a pre-built Odin binary, **or**
- B) Clone the Odin repository and build it yourself (**recommended** to make [updating Odin](#updating-odin) easier).

### Option A: Download Odin
<a href="https://github.com/odin-lang/Odin/releases/latest" class="btn btn-outline-primary">Latest Release Build</a>
<a href="https://odin-lang.org/docs/nightly/#nightly-builds" class="btn btn-outline-primary">Latest Nightly Build</a>

- Choose either a release build or a nightly build.
- Download the build for your platform.
- Unzip the directory and move it to your desired location.
- Use `./odin --help` to learn how to run your first Odin program.

### Option B: Clone and build Odin
- Clone Odin with: `git clone https://github.com/odin-lang/Odin`.
- Build Odin by following the steps for your platform below.

#### Windows
- Install Visual Studio (VS2019-2022 is recommended, VS2017 works).
- Open a valid command prompt. You can either:
    - A) Run the `x64 Native Tools Command Prompt for VS2017` shortcut, or
    - B) Run `vcvarsall.bat x64` from a blank `cmd` session.
- Navigate to the Odin directory inside your command prompt.
- Run `build.bat` to build Odin. That creates the `odin` binary.
- Use `./odin --help` to learn how to run your first Odin program.

**Note:** The Odin repository includes the necessary LLVM components for Windows.

**Note:** Odin requires `link.exe` from Visual Studio, and it must be in the PATH.

#### MacOS
- Install XCode from App Store or their [website](https://developer.apple.com/xcode/).
- Install XCode command-line tools: `xcode-select --install`.
- Install [Homebrew](https://brew.sh/).
- Install LLVM: `brew install llvm@14`.
- Add the LLVM binaries to your `$PATH` environment variable by inserting the line: `export PATH=$PATH:/usr/local/opt/llvm/bin` in your shell configuration file (it may be called `~/.bashrc`, `~/.zshrc`, or something else, depending on your shell). To apply the change, run: `source ~/.name_of_shell_config_file`.
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- Use `./odin --help` to learn how to run your first Odin program.

**Note:** On newer versions of MacOS, some headers are not installed by default. Open `macOS_SDK_headers_for_macOS_*.pkg` in `/Library/Developer/CommandLineTools/Packages/` to install the missing ones.

**Tip:** You can add the Odin directory to your `$PATH` environment variable to gain easy access to the `odin` command from anywhere on your computer.

#### Linux
- Install `llvm14`, `clang14`, and `make` through your package manager.
- Add the LLVM binaries to your `$PATH` environment variable by inserting the line: `export PATH=$PATH:/path/to/llvm/bin` in your shell configuration file (it may be called `~/.bashrc`, `~/.zshrc`, or something else, depending on your shell and distribution). To apply the change, run: `source ~/.name_of_shell_config_file`.
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- Use `./odin --help` to learn how to run your first Odin program.

**Note:** The installed location of LLVM depends on your distribution. One possible location is: `/usr/lib/llvm14/bin`.

**Note:** The compiler currently relies on the `core` and `shared` library collection being relative to the compiler executable. Installing the compiler in the usual sense (to `/usr/local/bin` or similar) is therefore not as straightforward as you need to make the mentioned libraries available. As a result, we recommend explicitly invoking the compiler with `/path/to/Odin` in your preferred build system or adding `/path/to/Odin` to `$PATH`.

**Note:** If you get the error: `'atomic.h' file not found`, try installing `libx32stdc++-12-dev`.

**Note:** If you get the error: `'sys/wait.h' file not found` and `'stdio.h' file not found`, try installing `g++`.

**Note:** If you get the error: `'linux/futex.h' file not found`, try installing `linux-headers`.

**Note:** On some distributions, you need to add a "-dev" suffix to packages to get the development files (like `llvm14-dev` and `clang14-dev`).

**Note:** The package names may differ slightly depending on your distribution.

**Tip:** You can add the Odin directory to your `$PATH` environment variable to gain easy access to the `odin` command from anywhere on your computer.

#### BSD
- On FreeBSD, run: `pkg install bash git llvm14`
- Add the LLVM binaries to your `$PATH` environment variable by inserting the line: `export PATH=$PATH:/path/to/llvm/bin` in your shell configuration file (it may be called `~/.bashrc`, `~/.zshrc`, or something else, depending on your shell). To apply the change, run: `source ~/.name_of_shell_config_file`.
- Navigate to the Odin directory inside your terminal.
- Run `make` to build Odin. That creates the `odin` binary.
- Use `./odin --help` to learn how to run your first Odin program.

**Tip:** You can add the Odin directory to your `$PATH` environment variable to gain easy access to the `odin` command from anywhere on your computer.

## Updating Odin
If you cloned the Odin repository, you can update the compiler by running `git pull` and then rebuilding it with `make`.

If you downloaded a pre-built Odin binary, you can update the compiler by downloading and extracting a new version.

## What's next?
Check out the [Odin Overview](https://odin-lang.org/docs/overview/) for more information on the Odin Programming Language.
