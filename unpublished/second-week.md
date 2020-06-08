---
title: 'No-name-yet'
week: '#2'
date: '2020-06-08'
---


**Questions:**
- What kind of representations exist in rustc?
- How many stages of the complier in Rust?
- What is the Query system? What is its purpose?
- What parts are parallelized?
	- codegen units retieved during the monomorphization 
	- linker combines all parts together
	- current apporach is turning RefCells into Mutexs.
- What the bootstraping is? (eating our own dogfood)
	- compiling new version of a compiler by the old one
	- two stages build


### Type-checking

### Ty module


### Clippy
**Current issues and questions:**
- What is Clippy scheme?
	- how is it used to generate the code?
- How Clippy can be trained on Examples to generate lints?
- Why this idea is limited? (syntactical lints)
- How Clippy rules look like?
- How DSL should be integrated?
	- what is required to do?
	- why it cannot be implmeneted?

### Miri

