---
title: 'Overview of High-level the compiler architecture'
week: '#1'
date: '2020-06-07'
---

I will not talk about how Rust's compiler design in detail (Rust has great documentation). Instead, I will share what I found interesting to me. 
The main purpose of the post is to summarize what I have learned. I use writing as a tool to recap what I have just known. My research insights and thoughts along the contribution efforts will be in future posts.


### Bootstrapping
The interesting fact about `rustc` that it __eats its own dogfood__, i.e. in order to compile the compiler Rust uses old versions of `rustc`.

The motivation for that is to perform additional tests of the compiler. Since Rust is a user for itself, it can provide useful feedback and highlight weak spots.

**Side note**:
_How frequently the `rustc` is released?
Rust uses a software release train model to deliver updates to the language. In this model, Rust has three 'stations': Nightly, Beta and Stable. Trains come from Nightly to Stable through Beta every 6 weeks. Thus, new features are delivered every 6 weeks which helps to reduce pressure on polishing feature, i.e. it is not a big issue to miss release date._


### Query system
The Query system ("demand-driven" system) is another interesting design decision of Rest developers. As of writing, `rustc` is currently transitioning to that system. Unlike traditional compilers, which make sequential passes over the source code, `rustc` implements an incremental compilation approach. This allows us to reuse the compiled code that hasn't been changed.
An example of a query is asking for a type of definition at HIR level.
But I wonder how this query system makes things more complex when parallel compilation comes into play? It seems like an extremely challenging problem.


### Arena and interning [I might be wrong here]
These two terms are tightly related to memory management of Rust. During the compilation, lots of data structures are created (ty::Ty, Subsets,...), so there is a need in managing them properly in order to not use much memory than is required for compilation. 
Arena is a long-lived pool/buffer where data structures are placed once they were created. Arena stores unique objects by means of Interning. Also, these objects are compared quickly (by pointers) which helps to achieve better performance.


### Unanswered questions this week
- What is __monomorphization__? How does it look like? What the purpose of it? 
- How do the compilers of other languages (C/C++, Java, etc.) parallelize the compilation process (and what stages)?
- How the query cache is invalidated?