---
title: "Memory leaks: what they are and how to avoid them"
draft: true
date: "2019-06-05"
---

# Simple definition

**A memory leak is a piece of stored information that has become unreachable by your code.**

![alt text](../../assets/images/article-images/spring-2019-6.jpg)

# How computers store information
For our purposes in understanding memory leaks, we'll need to back up and examine how computers store information.
This is a complex and detailed topic - and I certainly have no degree in computer science. We'll hit just the highlights so we can understand
how memory might be "left behind" by our code.


As you probably know, computers store all data as 1s and 0s. These are grouped 8 together into a byte, and further organized
in a data structure you might understand as a bookshelf - 8 bits to a shelf. 
Everything that happens with your computer memory is done via these 8-bit "bookshelves". What's important to understand here
is that the memory is not filled up purely sequentially. You are constantly adding, deleting, modifying your data. 
Your processor will determine where the memory should be stored. 

(Side note: early programming languages *did* store information purely sequentially - and that meant you had to determine
*ahead of time* how much memory you would need for each array, say. If, later on, you needed additional indices in your array, you were SOL.)



# Garbage Collection

# References
[](https://www.computerhope.com/issues/ch001498.htm)
[Stack Overflow question about memory leaks](https://stackoverflow.com/questions/312069/the-best-memory-leak-definition)
