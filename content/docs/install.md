---
title: Getting Started
summary: How to download and install the Odin compiler. Both from source or from a binary release, along with a list of per-platform requirements.
weight: 1
autonumbering: true
---

Odin is dead-simple to get started with!

There are 3 main ways of getting Odin:
- [Official Releases](#official-releases) - for downloading the latest monthly or nightly release
- [From Source](#from-source) - for building from source (very easy to do)
- [Package Managers](#package-managers) - for an overview of package managers that package Odin

The compiler currently supports compiling on:

- Windows x86-64/AMD64 (MSVC)
- Linux x86-64/AMD64 and ARM64
- MacOS x86-64/AMD64 and ARM64
- FreeBSD x86-64/AMD64 and ARM64
- NetBSD x86-64/AMD64 and ARM64
- OpenBSD x86-64/AMD64
- Haiku x86-64/AMD64 (experimental)

and supports compiling **to** many more targets.

## Official Releases

Download the latest monthly or nightly release and look over the release requirements below.

<a href="https://github.com/odin-lang/Odin/releases" class="btn btn-outline-primary">Latest Release</a>
<a href="/docs/nightly" class="btn btn-outline-primary">Latest Nightly Builds</a>

### Release requirements / notes

**Windows:**

* Odin needs the MSVC compiler and windows SDK from the "Desktop development with C++" component.
If you don't have this already, you can [download the installer here](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
Make sure to at least click on "Desktop development with C++" and tick the boxes for MSVC and the Windows SDK.
It should look something like:
<img src="/images/microsoft-installer.png" width="75%" alt="Microsoft Installer with Desktop development with C++, MSVC, and Windows SDK checked" />
    * If you want the smallest install possible, there is a [third-party script](https://gist.github.com/mmozeiko/7f3162ec2988e81e56d5c4e22cde9977) that installs only the things that are needed
* Optionally [add the Odin compiler directory to the PATH environment variable](https://duckduckgo.com/?q=add+to+path+windows) so `odin.exe` is accessible everywhere on your computer

**MacOS:**

* Install XCode command-line tools `xcode-select --install`
    * If that command is not found you may need to install XCode from the App Store
* Note that this release does not come with `wasm-ld` for compiling to WASM, you have to install that separately as described in [the chapter about building from source](#a-note-on-wasm-and-llvm-binaries)
* Optionally add the Odin folder to your shell's path or symlink the `odin` binary to a folder that is in your shell's path
    * Example for ZSH (from the Odin folder): `echo 'export PATH="/path/to/Odin/folder:$PATH"' >> ~/.zshrc`
    * Note that the compiler executable expects to be next to/in the same folder as the `base`, `core`, and `vendor` folders, you can however set the `ODIN_ROOT` environment variable to override the path to these folders

**Others (Unix):**

* Install Clang which is used for linking (see your package manager's instructions)
    * Debian/Ubuntu - `apt install clang`
    * Fedora - `dnf install clang`
* Optionally add the Odin folder to your shell's path or symlink the `odin` binary to a folder that is in your shell's path
    * Example for bash (from the Odin folder): `echo 'export PATH="/path/to/Odin/folder:$PATH"' >> ~/.bashrc`
    * Note that the compiler executable expects to be next to/in the same folder as the `base`, `core`, and `vendor` folders, you can however set the `ODIN_ROOT` environment variable to override the path to these folders

## Package Managers

Repology maintains a list of package managers and their status.

Note that these packages are configured by third-parties and may be flawed, please direct support to their maintainers.

[![Packaging status](https://repology.org/badge/vertical-allrepos/odin-lang.svg)](https://repology.org/project/odin-lang/versions)

## From Source

### Windows

1. Odin needs the MSVC compiler and windows SDK from the "Desktop development with C++" component.
If you don't have this already, you can [download the installer here](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
Make sure to at least click on "Desktop development with C++" and tick the boxes for MSVC and the Windows SDK.
It should look something like:
    <img src="/images/microsoft-installer.png" width="75%" alt="Microsoft Installer with Desktop development with C++, MSVC, and Windows SDK checked" />
    * If you want the smallest install possible, there is a [third-party script](https://gist.github.com/mmozeiko/7f3162ec2988e81e56d5c4e22cde9977) that installs only the things that are needed
2. Your command prompt will probably not have the Microsoft Build Tools set up by default, there are 2 ways to set it up if it isn't:
    * run the `x64 Native Tools Command Prompt for VS20xx` shortcut bundled with Visual Studio (search in start menu), or
    * run `vcvarsall.bat x64` from a blank `cmd` session
3. Clone the repository somewhere: `git clone https://github.com/odin-lang/Odin`
4. Navigate to the Odin folder: `cd Odin`
5. Optionally use `git checkout dev-YYYY-MM` to checkout one of the official releases
6. Run `build.bat release`
7. Optionally [add the Odin compiler directory to the PATH environment variable](https://duckduckgo.com/?q=add+to+path+windows) so `odin.exe` is accessible everywhere on your computer

#### Updating

1. Through step 2 of installing, open up the developer command prompt
2. Navigate to the Odin folder
3. Optionally use `git checkout dev-YYYY-MM` to checkout an official release
4. `git pull`
5. `build.bat release`

### MacOS

1. Install XCode command-line tools `xcode-select --install`
    * If that command is not found you may need to install XCode from the App Store
2. Install [Homebrew](https://brew.sh/) and then LLVM: `brew install llvm`, the versions we support are 14, 17, 18, and 19
3. Clone the repository somewhere: `git clone https://github.com/odin-lang/Odin`
4. Navigate to the Odin folder: `cd Odin`
5. Optionally use `git checkout dev-YYYY-MM` to checkout an official release
6. Run `make release-native`
    * If you want to specify an explicit LLVM version or path, you can set the `LLVM_CONFIG` environment variable: `LLVM_CONFIG=/path/to/llvm-config make release-native`
7. Optionally add the Odin folder to your shell's path or symlink the `odin` binary to a folder that is in your shell's path
    * Example for ZSH (from the Odin folder): `echo 'export PATH="/path/to/Odin/folder:$PATH"' >> ~/.zshrc`
    * Note that the compiler executable expects to be next to/in the same folder as the `base`, `core`, and `vendor` folders, you can however set the `ODIN_ROOT` environment variable to override this

#### A note on WASM and LLVM binaries

In order to compile for WASM, Odin calls out to `wasm-ld` for linking.
This linker is included in the `lld` formula, install it through `brew install lld`.

#### Updating

1. Navigate to the Odin folder
2. Optionally use `git checkout dev-YYYY-MM` to checkout an official release
3. `git pull`
4. `make release-native`

### Others (Unix)

1. Install clang and LLVM (the versions we support are 14, 17 and 18) using your package manager
    * It could be that LLVM is split into multiple packages and you also need to install something like `llvm-devel`
2. Make sure `llvm-config`, `llvm-config-(14|17|18)`, or `llvm-config(14|17|18)` and `clang` are able to be found through your `$PATH`
    * If you want to specify an explicit LLVM version or path, you can set the `LLVM_CONFIG` environment variable: `LLVM_CONFIG=/path/to/llvm-config make release-native`
3. Clone the repository somewhere: `git clone https://github.com/odin-lang/Odin`
4. Navigate to the Odin folder: `cd Odin`
5. Optionally use `git checkout dev-YYYY-MM` to checkout an official release
6. Run `make release-native`
    * If an atomic.h error occurs, see the following section about it
7. Optionally add the Odin folder to your shell's path or symlink the `odin` binary to a folder that is in your shell's path
    * Example for bash (from the Odin folder): `echo 'export PATH="/path/to/Odin/folder:$PATH"' >> ~/.bashrc`
    * Note that the compiler executable expects to be next to/in the same folder as the `base`, `core`, and `vendor` folders, you can however set the `ODIN_ROOT` environment variable to override this

#### A note on atomic.h

The Odin compiler relies on C++'s atomic.h for atomic memory ordering, some operating systems need some more steps to install this.
To find out which package you need to install, use `clang++ -v` and look for "Selected GCC installation" and note the version number (usually 12, or 14).
Then, depending on OS, install the corresponding c++ standard package, usually called `libstdc++-VERSION-dev` but also found under different names,
for help and more information see [this GitHub issue](https://github.com/odin-lang/Odin/issues/3376).

#### Updating

1. Navigate to the Odin folder
2. Optionally use `git checkout dev-YYYY-MM` to checkout an official release
3. `git pull`
4. `make release-native`

## Got stuck?

If something did not work as said on this page or you just need help, do not hesitate to reach out through our Discord or Github issues/discussions.

Do note that we do not officially maintain or support the various package managers.

## What Next?

Why not check out the [Odin Overview](/docs/overview/) for more information on the Odin Programming Language!
