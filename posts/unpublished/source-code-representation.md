---
title: 'No-name-yet'
week: '#2'
date: '2020-06-03'
---


## Source code representations

### The Rustc driver and interface
- What is it? What is the purpose?
- Why is it called driver?
- 

Entry point of the compiler conceptually like a 'main' function. Hence, it defines the order of phases that are executed.
However, an arbitrary crate can use rustc_interface to crate a query and compiler iteslf (is that right? should be a manager who delegate such tasks, not a crate itself).


### Syntax and the AST

#### Name resolution
It is a process of retrieving a "value" under the given name. In other words, it should derive the actual "thing" under the name. For example, during import resultion the compiler find the library which should be used later on. If the path to the library is incorrect or suspicious the compiler will report about that.

Name resultion might me challenging because the same names might be used for different namespaces. Like in the code:
``` type x = 8i;
	let x : x = 4;
	let y : x  = 9;
```
Namespaces are macros, types, variables, etc. 

#### Macro expansion
The documentation does not explain what expansion means. Probably, it is obvious for some, but not for me unfortunately. I wonder what is the difference between resolving a macro and, for example, an imported function from std. Different naming assumes that they are treated differently. 
