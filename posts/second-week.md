---
title: 'MIR and co'
week: '#2'
date: '2020-06-14'
---

## MIR

This week I invested most of the time into how mid-level representation is constructed and how it contributes to the compiler's work.

What it brings:
1. The faster compilation (through incremental compilation and better data structures);
2. Faster execution time (through adding Rust specific optimizations before LLVM ones);


What is drop-flag? 
The hidden bit that specifies whether the struct or enum should be dropped. As far as I am concerned, it does not exist anymore in Rust because it implicitly used more memory than expected (take a look at Zeroing of Dropped values for more details).

MIR is a simple core, i.e. no function calls, for loops, matches, and more. But how is it represented there?
In Control-Flow Graph structure. CFG is a set of blocks with edges between them, which show how the flow goes from one block to another. As well as MIR, LLVM IR has the same CFG structure.

Why are some optimizations are made on MIR and not on HIR, for example? What are the reasons behind that?
MIR represents several operations that are not accessible to a user because he/she can misuse it to write unsafe code.
What are these unsafe operations that are covered with for loops and other structures? There are two main points:
- a control-flow tool `goto`, for example, is fundamental structure for `break`, `continue`, `loop`, `if`, `match`.
- switch and variant downcast. 
If users were allowed to use operations and tools that I just mentioned then developers would easily write spaghetti-like code with a difficult to read and maintain the structure.

Moreover, on MIR type are fully-written and it is reasonable to write type checking there. So borrow checking is performed over MIR.

Another interesting point is how errors are reported if they occur during the compilation. For these scenarios, _unwinding_ comes into the play. During unwinding the compiler checks which variables should be freed. In the CFG blocks there are drop(...) operations all over the place. Once the control-flow notices that a variable should be freed it passes that variable to the drop function.
	
But what if a function starts *panic*ing, you may ask? 
In this case, all unfreed variables should be dropped. Essentially, each function call can cause a _panic_ situation, so in the CFG new edges should be added. Along these edges, all required memory management happens.

Who should free memory when a variable is passed conditionally?
Move semantics is a key in effective memory management in Rust. The thing is that we cannot know statically who should free the variable if it is borrowed conditionally. Modern compilers use zeroing as a mechanism dealing with such a scenario.
In Rust boolean flags are used to check whether a variable should be freed or not. It allows performing many optimizations with that approach (eliminate dead code with the help of constant propagation). 

_side note_: what is llgb and gdb? is used for?
these are debugging tools. llgb is used for languages that use LLVM to generate assembly code. 
gdb is the GNU Project debugger. As well as llgb can tell you what the program was doing before it crashed or while it is working.


### Rust's Type System
Rust has a rich type system. Why is it called _rich_?
It includes representation inference, type checking, trait system, borrow checker (type inference, region/lifetime inference). 

All parts are interesting for study, but this week I went through how *type inference* works.

Type inference is a process of type identification from the code where little information has been provided. For instance, from the code:
``` let mut v = vec![];
	v.push(4); 
```
we can find out the vector contains 32 bits integers (by default Rust considers an unspecified number as of type i32).

The compiler will firstly mark generic types with ?T.

Then unification is needed to able to say that ?T = Some_Real_Type(e.g. String). The idea of unification is to compose **substitution** **S** (mapping from one type to another, which are equal). 
So when the solution is found - we have a mapping from variable types to _real_ ones.

To aviod infinite types like in the example below there is the occurs check:

```
let mut x;
x = None;
x = Option(x);
```

In essence, before we add new substitution we check that ?X is not in T.


### Miri
I installed `miri`, but it is not clear what bugs I can find with it. What code can I write to see how `miri` detects bugs? Or all known bugs are fixed now?
I spent with `miri` the evening and it is not enough (surely!) to understand details how it works. So, the goal for the next week is to discover the code deeper and, ideally, get in touch with key contributors to discuss potential areas of research.

To answer these questions I decided to read some see how `miri` does work. 

To start learning how `miri` works found Ralf's blog (Ralf is a key contributor to `miri`). 
Here are few notes that I made. 

First of all, `miri` is an interpreter of MIR (mid-level intermediate representation). It is executed along the LLVM to check that there is no undefined behavior. 
MIR for the code:
```
fn main() {
	let x = 5 * 2 + 1;
}
```

will be look like:

 bb0: {
    StorageLive(_1);
    StorageLive(_2);
    _1 = Mul(const 5i32, 2i32)
    _2 = Add(_1, const 1i32); 
    StorageDead(_2);
    StorageDead(_1);
    return;
 }

However, the final look is different for the current version (1.44) of `rustc`. Apparently, `rustc`  already performs some optimizations while constructing MIR. 

But anyway, what these `StorageLive` and `StorageDead` are used for?  These marks are for LLVM to say how it should treat variables, i.e. LLVM will reuse memory of a variable that will not be used anymore to store other values. 

What the role of `miri` here? So `miri` has rules that it uses to check that translation of HIR to MIR works correctly (doesn't produce any undefined behavior).
