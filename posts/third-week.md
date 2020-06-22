---
title: 'Const safty and CTFE'
week: '#3'
date: '2020-06-21'
---


This week I wanted to make myself familiar with `miri`. I kept in mind these questions when I started reading:
- What kind of UB `miri` can detect? give examles.
- Can I write buggy code which will make `miri` alarming?
- What types of UB `miri` cannot detect? why?


### What is compiler-time function evaluation (CTFE)?
CTFE is a machanism of expression evaluation like `const x: T = ...` where `...` is an expression that should be calculated by the compiler during the compilation. 
Is it somehow related to constant propogation? no, Constant propogation is an optimization pass done by compilers like LLVM. 
CTFE is different, it must calculate the value at compile time. For example, i.e. `const x: i32 = 5+33;` or `const l: i32 = arr.len();`. 

What CTFE is not reasonable to use?
For example, when we want to calculate the length of a file on the disk since the file size might change later during the program execution. The worse case is reading data from the network. 
Or even more, scenario is having const generics, traits, and coherence. (what is that?)
In short, non-determentistic operations are not allowed for CTFE. 

As a consequence, const safe programs are the ones that do not raise errors while CTFE evaluate expressions. 

Const type system is a part of a type checking system. One of the responsibilities of the const type system is to make sure that there is no unsafe function calls out from const safe ones. 

Why converting reference (Box) into integer is const unsafe? 
Because allocation of memeory is non-determentistic. It is known where the value will be placed. 


### When I am saing that a program is safe, what do I mean?
It could panic and run "forever" (non-termination). But the program will not produce undefined behavior (dereferencing moved object) or call unsupported operation (unimplemented intrinsic). 

Miri has the most primitive value `Scalar`. It can represent either Pointer(Scalar:Bits) or Interger (Scalar::Bits). 



### What are dynamic and static checks?
Dynamic check is evaluation of compile-time code by looking at what the code does and checking that the code does not violate a set of safty rules. 
The disadvantage of this kind of check is that it can be performed only when the code is being evaluated, which is after monomorphization (why it is bad? too late? what we can't do at this stage? it leads to bad user experience). 
So the main problem is caused by the fact that the site where eror is reported is disconnected from the cause of that error (why?)

Static check are less precise (haulting problem), but it is sound (everything that is accepted by static analysis is accepted by dynamic). Dynamic analysis helps to improve static techniqs (or at lease pointing out which values are rejected by static analysis). 

Const safety check prohibits operations with raw pointers: 
- comparing it for (in)equality
- converting to integers
- hashing

Only few options are allowed with raw pointers (which ones?).

const safty check does not allow construction of const-unsafe value. 


### What is safty invariants?
So invariants are properties that are held at any given time in a program. For example, if a varibale `x` has a `bool` type then data must be either `true` or `false`. There are no other options. In this case we say that data in `x` is safe for type `bool`. 
If the given invariant doesn't hold, the compiler definately has wrong behavior. 
Otherwise, the safe code with produce undefined behavior. 

Examples of invariants:

3. variable `x` is safe at `i32` if `x` is initialized.
4. pointer is safe for `&'a mut T` if it is aligned, non-NULL and points to allocated memory that, for lifetime `'a`, no other pointer accesses, and such that the data stored in memory at that location is safe for `T`.


### What does it mean that a reference is alligned?
Alignment is a process of allocating a memory by the given value. In other words, if we say the reference is aligned, we mean that the data under the reference will store no more than __aligned__ bytes.

### Is i32 safe?
It is tempting to say yes, since all CPU support operations with 32bits data. However, the answer is no. There are more states than `0..255`. `bytes` under the variable could be uninitialized (which are treated as `undef` of `poison` in LLVM). As a result comparison `x == 0` will be unsafe if `x` is unitialized. 

### What can we say about safety of higer-order data?
function pointer `f` is safe for type `fn(bool) -> i32` if data at `bool` is safe, body function does not cause undefined behavior and the data under `i32` is safe.

!Key property of Rust's type system that users can define their own safte inveriants.
Even if a struct has usafe types (e.g. `usize`), the safety is ensured by abstraction and privacy. In other words, all operations that are accessible to public  provide safe operations.

#### When talking about saftey we should keep in mind the level of where the safty holds. Thus, for user-defined structures non-public API can violates vaildity invariants (within boudaries. Boundaries are defined by visibility). 


All insights that I made this week is by reading this great blog  https://www.ralfj.de/blog/