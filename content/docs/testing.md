---
title: Running Tests
summary: A walkthrough of Odin's test runner.
weight: 8
---

## The Test Runner

Odin comes with a powerful test runner.

### Features

- Multi-threaded by default.
- Memory usage tracking: tests will report leaks and bad frees when complete.
- Logging: each test is given a thread-safe logging interface.
- Cancel early with `CTRL-C`.
- Gracefully handles segmentation violations, asserts, and panics from within tests.
- End-of-run summary with a listing of failed tests.
- ANSI-colored animated progress report.
- Test-wide per-run random seed.
- Option to copy failed tests to clipboard.

## What are tests?

If you're unfamiliar with the concept of tests in programming, they are procedures designed to see if expectations are met. They are far better than manually trying out things, especially as time goes on and more features (or bugs!) are introduced to programs and libraries you develop (or depend on!)

It is a fully automated process, capable of ensuring that from the day you wrote the test until many months or even years later, that the expectations you initially laid out are still met.

A collection of tests is often called a test suite. In Odin, we run tests by using the `odin test` command to compile and run our test suites. An Odin test suite is no different from a regular Odin program, and a test itself is no different from an Odin procedure.

Let's start with a small example:

```odin
package tests

import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
    // This tests succeeds by default.
}
```

All individual tests require the [`@(test)` attribute](/docs/overview/#test). This is how the compiler knows which ones to send to the test runner. They also must accept one and only one argument: `^testing.T`. It can be named anything you want it to be, but by convention, virtually every test uses `t`.

`^testing.T` is a pointer to a special `struct` defined by the `core:testing` package. We'll talk more about that later. 

#### Expectations

Let's make our test do something.

```odin
package tests

import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
    n := 2 + 2

    // Check if `n` is the expected value of `4`.
    // If not, fail the test with the provided message.
    testing.expect(t, n == 4, "2 + 2 failed to equal 4.")
}
```

This test will also always succeed, but at least it earned it by testing some condition. `expect` is the heart of how tests are measured. There are a few other procedures that can be used to encode our expectation, and all of them take the `^testing.T` value that we are provided in the argument to every test case. Let's try `expect_value`.

How about a less contrived example?

```odin
package tests

import "core:testing"

// Add up all the rune values in the string.
my_very_simple_hash_function :: proc(str: string) -> (result: int) {
    for r in str {
        result += cast(int)r
    }
    return
}

@(test)
my_test :: proc(t: ^testing.T) {
    hash := my_very_simple_hash_function("hellope")
    testing.expect_value(t, hash, 745)
}
```

Normally, you would not have the procedures you're testing also be in the test file; they would be imported from a package elsewhere. This is just for the sake of example.

Because the numeric values of each rune in `"hellope"` add up to `745`, this test will pass, and it did some real, useful work. Now, if `my_very_simple_hash_function` is ever changed to where its output does not meet this expectation in this case, the test will fail, and you'll be given an informative error message.

```txt
[ERROR] --- [2024-06-10 17:45:38] [tests.odin:16:my_test()] expected 745, got 752
```

**Note:** A test can have multiple `expect`ations, not just one. You can use any combination of the procedures documented here.

#### Conclusion

Hopefully by now, you can see the usefulness in having tests, especially for large, non-trivial programs and libraries. They can save you great amounts of time, catch subtle bugs, and encode your expectations in a format that is objectively _testable_.

## Output Examples

When starting the test runner with the default options, you'll be given a few messages like this:

```txt
[INFO ] --- [2024-06-10 17:45:38] Starting test runner with 1 thread. Set with -define:ODIN_TEST_THREADS=n.
[INFO ] --- [2024-06-10 17:45:38] The random seed sent to every test is: 200916733232426. Set with -define:ODIN_TEST_RANDOM_SEED=n.
[INFO ] --- [2024-06-10 17:45:38] Memory tracking is enabled. Tests will log their memory usage if there's an issue.
[INFO ] --- [2024-06-10 17:45:38] < Final Mem/ Total Mem> <  Peak Mem> (#Free/Alloc) :: [package.test_name]
```

The first line tells you how many threads your CPU is utilizing. Each test will run on its own thread, and the runner will parallelize the work across the available threads.
The second line tells you what the [random seed](/docs/testing/#tseed) is for this run. It is different for every run, but the same seed is sent to every test. The third line reports the state of memory tracking. This is on by default and will stay quiet unless there's an issue, but [this can be changed](/docs/testing/#compile-time-options). The fourth line explains what the format of the memory tracker's output will be like.

### The Memory Tracker

Every test has its memory usage monitored by default, including any procedures it calls that may allocate memory. This makes for a fast and easy way to test a package in development for any issues.

For example, if you have a leaky test:

```txt
[WARN ] --- [2024-06-10 18:08:15] <   1.00KiB/   1.00KiB> <   1.00KiB> (    0/    1) :: tests.my_test
        +++ leak    1.00KiB @ 0x7FD235C00048 [tests.odin:8:my_test()]
```

This test leaked exactly one kilobyte, which is to say that it failed to free the memory in question. It never used more than that one kilobyte, and it had zero frees and one allocation. The next line down, we can see the exact position of where the leak occurred and where the memory was stored.

Let's look at another type of memory issue.

```txt
[WARN ] --- [2024-06-10 18:11:23] <        0B/        8B> <        8B> (    1/    1) :: tests.my_test
        +++ bad free        @ 0x7136A2600048 [tests.odin:10:my_test()]
```

This test had a bad free, which is where `free` or `delete` is used on an invalid pointer. This pointer may have already been freed (in this case, it's called a double free) or it may not have even been a valid place where allocated memory was stored to begin with.


If you find these memory tracking facilities intriguing, know that they are not special to just the test runner. Odin has a [`Tracking_Allocator`](https://pkg.odin-lang.org/core/mem/#Tracking_Allocator) in the `core:mem` package upon which all of this is built. Custom allocators are available to every Odin program.

## API Overview

The `T` given to every test is used in the testing API to indicate which test is speaking to the runner. It is used as the first argument to every one of the procedures in `core:testing`.

### Logging

Tests in Odin use the very same [logging procedures](https://pkg.odin-lang.org/core/log/) made available to regular programs.

```odin
package tests

import "core:log"
import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
	log.info("Hellope!")
}
```

```txt
[INFO ] --- [2024-06-10 18:01:24] [tests.odin:8:my_test()] Hellope!
```

There are five different levels of logging if you need to report extra information during a test. By default, the test runner has its lowest logging level set to `info` but [this can be changed](/docs/testing/#compile-time-options). That means you can filter out messages below a certain level.

For instance, if you only want to see warnings and above, you could use `-define:ODIN_TEST_LOG_LEVEL=warning` on the command line.

It should be noted that if any `error` or `fatal`-level log message is raised during a test, the test will be treated as if it had failed, even if all expectations were met.

### `testing.cleanup`

`cleanup` is a tool to use if you absolutely must have some procedure run when a test fails catastrophically, such as a signal being raised, a bounds-checking error, an `assert` failure, a `panic`, a memory violation, and so on.

The idiomatic way to perform cleanup procedures in Odin is to use a [`defer` statement](/docs/overview/#defer-statement).

```odin
package tests

import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
	i := new(int)
    // This test won't leak any memory, because `free(i)` will be run at the end of this scope.
	defer free(i)

    // ... do some work ...
}
```

With tests, we have a way to perform emergency procedures in the event of a crash.

```odin
package tests

import "core:os"
import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
	fd, open_error := os.open("test_data")

	if !testing.expect_value(t, open_error, os.ERROR_NONE) {
		return
	}

	testing.cleanup(t, proc (raw_handle: rawptr) {
		handle := cast(^os.Handle)raw_handle
		os.close(handle^)
	}, &fd)

	some_value := 5

	// ... later on somewhere else ...

	assert(some_value == 13)
}
```

If we didn't use `cleanup`, the `fd` file handle would still be open, because `defer` statements are not run if the thread panics.

However, for almost all situations, you should be fine trusting in `defer`; `cleanup` is for those rare times when you have a particularly unstable test case and need to clean it up afterwards.

It should be noted that, if the test panics or times out, `cleanup` runs with greater privilege in the main thread, to preserve the state of the test's memory. With this in mind, all `cleanup` procedures must not, under any circumstance: fail an assertion, fail a bounds check, access invalid memory, panic, or raise a signal of any sort. Otherwise, they will take down the entire test runner.

**Note:** Even if a test fails catastrophically and doesn't clean up any of the memory it used, the test runner equips each test thread with its own custom allocator that is wiped clean at the start of a new test. You do not need to worry about memory leaks in completed tests causing issues later on.

### `testing.expect`

This procedure allows for a simple check of a boolean value to determine test success or failure, with an optional message displayed if the boolean was false.

### `testing.expectf`

This procedure is like `expect`, except the message can be formatted with additional values, much like `fmt.printf` or `log.infof`.

```odin
package tests

import "core:testing"

@(test)
my_test :: proc(t: ^testing.T) {
	value := 32
	testing.expectf(t, false, "Hellope! The value is: %i", value)
}
```

This will result in the test failing with the message formatted in the logs.

```txt
[ERROR] --- [2024-06-15 07:18:03] [tests.odin:8:my_test()] Hellope! The value is: 32
```

### `testing.expect_value`

This is the easiest procedure for checking one value against another. It makes an error message for you based on your inputs, if the check fails.

### `testing.set_fail_timeout`

This procedure is handy if you expect some work that you'll do in a test may take a long time, and you don't want it to run over a certain limit, or if you're aware of an edge case where an infinite loop may happen. Provide it with a `time.Duration` from [`core:time`](https://pkg.odin-lang.org/core/time/), such as `5 * time.Second`, and the test will be forced to stop if it takes longer than that duration.

```odin
package tests

import "core:testing"
import "core:time"

@(test)
my_test :: proc(t: ^testing.T) {
	testing.set_fail_timeout(t, 5 * time.Second)

	for i := 0; i >= 0; i += 1 {
		// An infinite loop.
	}
}
```

### `testing.fail`

This is a quick and simple way to make a test fail. Ideally, prefer one of the `expect*` procedures if you can, or use `log.error` with an informative failure reason.

### `testing.fail_now`

`fail_now` will cause not only the test to fail, but for all further execution in that thread to stop. This is what is called a divergent procedure, much like `assert` or `panic`. It is for when you absolutely must stop a test, no matter what.

### `T.seed`

This is where the random seed for each test's generator goes. It is different for every run but the same across all tests in that run. By default, the random number generator is already setup for you, but if you need to reset the generator back to its initial state, a call to `rand.reset(t.seed)` will do it.

Having an explicit and shared random seed for each run helps keep tests that rely on random procedures to be more deterministic, in the event of a test failure due to particular random seed.

## Separating Tests

There's the question of how much or how little to put into a test, as far as number and variety of different expectations go. This is somewhat a matter of taste, but it can be much easier to pin down a failure point when tests cover small or atomic portions of a program or library. The usefulness of a `test_everything` proc full of `expect`s is questionable, for example.

Keep in mind the multi-threaded nature of the test runner. Too little parallelizable work, and any extra cores go to waste.

## Multiple Packages

Normally, the test runner only compiles with the `@(test)` procedures in the specific package and not any of the imported packages.
You can run tests on every `@(test)` procedure by using the `-all-packages` option on the command-line.

Given a directory structure like this:

```txt
\____ src/
 \___ tests/
      \______ foo/
       \_____ bar/
        \____ gadgets/
         \___ widgets/
```

You can keep a file named `tests.odin` at the `tests/` level like so:

```odin
package tests

@require import "foo"
@require import "bar"
@require import "gadgets"
@require import "widgets"
```

Then run `odin test tests/ -all-packages` to run every `@(test)` procedure in the subdirectories.

## Compile-Time Options

There are several compile-time options that help you tailor the test runner's execution to your preferences.
The test runner is written in Odin itself, so these are [`#config` options](/docs/overview/#configidentifer-default), as opposed to regular flags.

- `ODIN_TEST_THREADS=<n>` sets how many threads to use. Set to `0` to use the number of cores available.
- `ODIN_TEST_TRACK_MEMORY=false` turns off memory tracking. It is on by default.
- `ODIN_TEST_ALWAYS_REPORT_MEMORY=true` turns on memory usage reporting for all cases. By default, only issues with memory usage are reported, such as leaks or bad frees.
- `ODIN_TEST_THREAD_MEMORY=<bytes>` sets precisely how many bytes each thread is allocated to start with. Normally, each thread is allocated 4 megabytes of memory and may request additional memory.
- `ODIN_TEST_NAMES=<package.test_name,test_name,...>` sets which tests to run by name. Good for selecting a few out of one package.
- `ODIN_TEST_FANCY=false` turns off the ANSI-colored animated progress report. It is on by default.
- `ODIN_TEST_CLIPBOARD=true` will make the test runner copy the names of any failed tests to your clipboard at the end of the run, if your terminal supports OSC 52.
- `ODIN_TEST_PROGRESS_WIDTH=<n columns>` sets how wide the progress bars should be. Set it to `0` to cap it to the number of tests per package.
- `ODIN_TEST_RANDOM_SEED=<n>` sets the random seed that will be sent to every test. By default, a seed is picked when the test runner starts. This option is good if you encounter an issue that only occurs under certain random conditions with a particular seed.
- `ODIN_TEST_LOG_LEVEL=<debug|info|warning|error|fatal>` sets the lowest log level for the logger, allowing you to filter out messages below a certain level.
- `ODIN_TEST_SHORT_LOGS=true` keeps the log messages short and tidy by omitting the date & time information, as well as what procedure emitted the log message. File and line information is still provided.

These options are entered like so on the command-line:

```txt
odin test . -define:ODIN_TEST_SHORT_LOGS=true
```

## Final Notes

The test runner was written to be easily-readable and maintainable, given its duty in ensuring stability. If you're curious about how to write a multi-threaded program that handles runtime exceptions, memory tracking, and inter-thread communication with thread-safe logging, it makes for a fine example.

The files can be found under `core/testing/`.
