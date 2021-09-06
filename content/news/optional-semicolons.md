---
title: Optional Semicolons
summary: Making semicolons truly optional within the language Odin.
slug: optional-semicolons
author: Ginger Bill
date: '2021-09-06'
categories:
  - feature
---

The pull request (PR) [Optional Semicolons #1112](https://github.com/odin-lang/Odin/pull/1112) was recently merged into master. This PR makes semicolons truly optional with the language Odin. This effectively makes the now old flag `-insert-semicolon` ob by default (and not opt-out-able).

This is a **NON-BREAKING CHANGE**, which means all valid code before this PR is valid with the PR.

**Note:** This change has been been planned for over a year.

## Compiler Features 

Two new features to the compiler:

* `odin strip-semicolon` utility function which will strip unneeded tokens (i.e. statement terminator semicolons). Takes the same parameters as `odin check`
* `-strict-style` will print a syntax error on an unneeded token (i.e. statement terminator semicolons).

The entirety of `core` and `vendor` have had their semicolons stripped.

## Rationale

Rationale behind making statement terminator semicolons fully optional:

* Previous rules for semicolons were inconsistent
* Previous rules for semicolons were a little random
* Better to go full one way or the other than the half-arsed approach that existed
* Enforcing semicolons everywhere would have made a lot of people mad
* Aids with tooling such as code generation
* Minor point regarding advertisement: many people (mostly idiots) will dismiss a language in [the current year] purely for having semicolons still


## Lexical Rules

Full rules for semicolon insertion (directly from the compiler):
```c
switch (token->kind) {
case Token_Invalid:
case Token_Comment:
    // Preserve insert_semicolon info (from previous token)
    break;
case Token_Ident:
case Token_context:
case Token_typeid:
case Token_break:
case Token_continue:
case Token_fallthrough:
case Token_return:
case Token_or_return:
    /*fallthrough*/
case Token_Integer:
case Token_Float:
case Token_Imag:
case Token_Rune:
case Token_String:
case Token_Undef:
    /*fallthrough*/
case Token_Question:
case Token_Pointer:
case Token_CloseParen:
case Token_CloseBracket:
case Token_CloseBrace:
    /*fallthrough*/
case Token_Increment:
case Token_Decrement:
    /*fallthrough*/
    // Insert semicolon after this token if newline is found
    t->insert_semicolon = true;
    break;
default:
    // DO NOT insert semicolon after this token if newline is found
    t->insert_semicolon = false;
    break;
}
```



## Discussion Around the Idea

### Previous Semicolon Rules

These were the optional semicolon rules (__before__ this PR).
```txt
Current optional semicolon rules
--------------------------------

A semicolon is optional if the statement is followed by one of these tokens on the same line:
    } 
    ) 
    else
    "EOF" 

After any block ("{}") (any control flow block)

If a constant value declaration's last expression is one of the following expressions, then a semicolon is not required:

    '#type'    of any type on the list (recursively)
    'distinct' of any type on the list (recursively)
    pointer    of any type on the list (recursively)

    procedure literal

    // Only optional at file scope, required in a procedure body
    struct type
    union type
    enum type

A semicolon is optional after the following declarations:
    package declaration        (package name)
    import declarations        (import "foo")
    foreign import declaration ("foreign import "bar")
    foreign block declaration  (foreign lib { })
```

My person opinions about these rules is that they are a complete [bodge](https://www.urbandictionary.com/define.php?term=bodge). And I don't want permanent bodges in the language's rules. And the bodges still have issues to them, which would require adding even more rules to make them "feel good".

### Arguments for Old Semicolon Rules

So it looks like the main arguments **against** making optional semicolons are:
1) I'm used to semicolons
2) I don't mind typing semicolons
3) Semicolons look good to read (partially due to being used to it)
4) Semicolons are good to type because they act like a full-stop/period on a sentence in many languages

    a) Semicolons have semantic meaning as statement terminators
5) I see little benefit over making them optional
6) Consistent with other languages such as C or GLSL, when swapping between them
7) If they will remain truly optional, what about the inevitable friction of style collisions?

Counter-points:
1) Is just habit
2) Is fine IF you knew what the rules were! If you had to type them everywhere, then you'd realize how much you have come to rely on optional semicolons. My bet is that the vast majority would hate it and want some form of optional semicolons in place regardless
3) I agree this is true, but so are newlines
4) I agree this is true but it's mostly due to (1)

    a) This is true but adding rules for semicolon insertion achieves the same semantic end
5) That's because of (1) (2) and not understanding why people dislike semicolons
6) Odin is already different enough from those languages, especially with regards to declaration syntax, that trying to unify them is not really a good idea
7) Tooling such as `odin strip-semicolon` and the upcoming `odin fmt` can help to mitigate all of this

Counter-counter-points:
1) Habits and norms are useful, especially in programming languages closely related to other languages that do similar things. Adding friction requires good reasons.
2) Most people don't know the rules behind most languages but they still intuitively get by in them
3) Semicolons are more explicit than a newline, which is a form of visual whitespace
4) They have semantic benefits showing the end of a statement (thus the term statement terminator)

    a) An explicit statement terminator is clearer than an implicit one (through a newline)
5) Relating the (2), people know many rules intuitively rather than explicitly
6) Odin is similar enough to other imperative procedural languages that the mental context switch can be bug prone
7) Relying on external tool complicates changelogs to the point where it's hard to see what the actual (non-formatting and whitespace) changes are. This confuses many version control systems (e.g. git), and much more. It would require everyone to use the tool, unless it was made automatic, which would require IMPLICIT tooling.

### Arguments for Making Semicolons Optional

These are the arguments **for** making semicolons optional:

1) Semicolons are visual clutter and don't aid reading practice
2) Semicolons are not needed in other "modern" languages in [the current year]

    a) It's very good for marketing purposes to keep up with trends
3) the parsing rules are a lot more consistent, simplified, and not a bodge

    a) The current grammar (before the PR) is not expressible in EBNF
4) Easier for code generation tools
5) Productivity is slightly increased when you don't have to type semicolons, many typos arising from forgetting to type a semicolon
6) Because it's possible

Counter-points:

1) They do aid in reading in that they show the end of the statement, relying on a newline is not necessarily that easy to read
2) Why do other language TRENDS matter that much? I don't care about fads.

     a) A lot of trends come from languages with no redeeming features
3) But the previous ones felt fine, why change? "Just write a better parser"

     a) Why does that matter in practice?
4) Make better code generation tools
5) In a statically typed and compiled language, those typos are quickly caught. And the slight increase to productivity is highly debatable
6) Have you ever thought that you should?

Counter-counter-points:

1) People are fine in languages such as Python or Go which have decent optional semicolon rules
2) If a trend is keeping around, there might be a good reason for it

     a) Ignoring trends is bad for marketing and advertisement. Ignoring this will make Odin harder to market.
3) they were awful rules and complete bodges

     a) Bodges are never a good idea if they are going to be permanent. If you have the possibility of correct the rules, you should. Odin is not different.
4) Sometimes you don't need brilliant tools, just good enough
5) Can still induce a minor mental overhead (but it's most definitely not measurable)
6) Yes, that's why I'm writing all of these arguments for and against.
