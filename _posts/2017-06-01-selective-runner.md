---
title: Selective Runner
date: 2017-06-01T00:18:02+00:00
author: Akash Shrestha
layout: post
---

Last semester, I was trying to replicate the results of _"Empirical studies of test case prioritization in a JUnit testing environment [^1]"_ as a part of curricular project. On this paper, they have studied about various techniques of test case prioritization all based around code coverage in a JUnit testing environment. 

<!--more-->

For that project, I needed something that would allow me to run the test methods in any arbitrary order. The test methods can come from any test classes. For example: a test class A has test1A, test2A, and test3A as test methods, and test class B has test1B, test2B as test methods. In this project, the prioritization strategy would give the order of test execution as say, "test1B, test2A, test1A, test2B, test3A" and we need to execute the test in the given order. But JUnit allows test execution only at test class level. For this, I implemented a small wrapper class called _Selective Runner_ on top of exisiting JUnit4's runner, available in [Github](https://akasey.github.io/SelectiveRunner/). With this custom runner, we can write our test case as:

```Java
@RunWith(SelectiveRunner.class)
@SelectiveRunner.SuiteMethods({
        "com.example.B#test1B",
        "com.example.A#test2A",
        "com.example.A#test1A",
        "com.example.B#test2B",
        "com.example.A#test3A",
})
public class SelectiveTest {
}
```

[^1]: Do, Hyunsook, Gregg Rothermel, and Alex Kinneer. "Empirical studies of test case prioritization in a JUnit testing environment." *Software Reliability Engineering, 2004. ISSRE 2004. 15th International Symposium on*. IEEE, 2004.