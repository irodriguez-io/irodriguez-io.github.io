---
title: "A trending language is not a migration plan"
date: 2026-07-19
slug: rust-vs-python-migration-plan
topic: iam
lang: en
description: "A systems and IAM engineer tries Rust after years of Python and C++ — where it earns a place in real automation work, where it doesn't, and why a trending language is never on its own a reason to rewrite something that works."
translation: "/blog-es/2026/07/rust-vs-python-migration-plan/"
---

I didn't start looking at Rust because I had a problem that needed it. I started because enough people around me kept asking why I hadn't.

Some of that pressure was fair. Rust gives you native performance and shuts down whole categories of memory bugs, the tooling is coherent, and it has earned real ground in infrastructure, CLI tools, embedded work, and security-sensitive services. Some of it was just noise. A language gets popular, a few respected companies publish adoption stories, the conference talks pile up, and suddenly every working application looks like a rewrite candidate. People start talking about language choice as a statement of identity instead of an engineering decision with requirements, constraints, and a maintenance bill attached.

I've spent nineteen years in systems engineering, most of the last decade in identity and access management, integration, and automation. My work is connecting systems that were never meant to talk to each other, reconciling messy identity data, babysitting flaky APIs, and keeping automation alive long after the people who wrote it moved on. My two default languages are C++ and Python. C++ taught me to care about memory, lifetimes, and interfaces. Python taught me that shipping the right answer this week usually beats shipping the elegant one next month.

So when Rust became the language everyone insisted I try, I tried it. What follows is anecdotal: my systems, my problems, my environments.

## This isn't a benchmark

Language arguments almost always open on speed. Which one runs faster, uses less memory, handles more requests. Fair questions, and mostly the wrong ones for the work I do.

Most of my automation spends its life waiting. Waiting on an identity provider's API, a database, a directory. Respecting rate limits. Retrying failures. Reconciling records from two systems that disagree about what a "user" even is. When a script sits for 300 milliseconds waiting on a remote call, shaving-off a local operation five milliseconds changes nothing a human will ever notice. The faster language still waits on the API.

That's why Python has held its ground with me. It gets me from idea to working prototype with almost no ceremony, and the hard part of IAM automation is rarely running the loop fast. It's figuring out what the loop is supposed to mean. "Disable inactive accounts" turns into "disable accounts inactive for 90 days, unless they're service accounts, unless the source of truth still sees them as active, unless there's an open exception in governance." Python lets me feel my way through that ambiguity with a REPL open.

## The experiment

I wanted a first project that looked like something I'd actually ship, not a toy calculator. So I built a small identity-reconciliation tool: read records from two sources, normalize the fields, compare status and entitlements, flag the conflicts, write a machine-readable report, return real exit codes.

In Python I already knew how I'd write it: start with imperfect input, print things, tighten as I go. Rust made me answer questions before it would run. What exactly is an identity record? Which fields are optional? What errors can this operation produce? Who owns this value, and how long does it need to live? At first it felt like the compiler was in my way. Then I realized it was forcing me to answer things Python had always let me defer.

## Where Rust earned its keep

A few things won me over fast.

**Modeling states.** IAM is full of states you should never treat as interchangeable: account not found, account disabled, account active but unmanaged, entitlement missing, entitlement pending removal, source system failed to answer. In a loose Python script those collapse into a soup of booleans, empty strings, and nulls. Rust pushed me to name each one. That doesn't make my access policy correct, the compiler can't tell me whether an employee should hold a privileged role, but it makes the wrong states harder to write by accident.

**Error handling.** In automation, failure is ordinary. APIs time out, tokens expire, records vanish between two calls. Python lets those failures stay invisible until one bites you in production. Rust puts failure in the function's return type, so the caller has to decide what to do with it. For a long-running agent, that's worth the extra code. For a one-off migration script, it's overhead.

**Cargo and the single binary.** Coming from C++, where builds and dependencies can eat a week of a new hire's life, Cargo felt almost suspicious in how much it just worked. And handing someone a self-contained binary (no interpreter, no virtualenv, no "which Python is this") is a real advantage when you're pushing a tool across a lot of hosts or into a locked-down environment. Deployment friction is one of the few things that would make me reach for Rust over Python on a new tool without thinking twice.

The borrow checker that everyone complains about mostly stopped being a fight once I quit trying to beat it and started reading its errors as design feedback. It usually caught me holding a reference I didn't need, or sharing data I should have transformed instead. The cost is still real, though. Some ownership problems, especially around async, turned a five-minute Python change into an afternoon. Correctness after three days isn't automatically better than correctness after three hours. Context decides whether the extra assurance was worth it.

## The part the hype skips

Where the trend gets expensive is the rewrite. A rewrite looks clean because it deletes the technical debt you can see. It also deletes everything you can't: the retry that exists because one endpoint returns success before the data is ready, the field normalized twice because two systems use different Unicode, the account category excluded because it follows a separate governance process. None of that shows up in the architecture diagram. It lives in the code, the tests, and the memory of whoever was on call. A rewrite starts with none of it.

Rust can stop a use-after-free. It can't stop a team from dropping a ten-year-old access exception nobody wrote down. In IAM, a program that reliably removes the wrong access isn't safer for being written in a memory-safe language. "Everyone is using Rust" was never an engineering reason. So I won't rewrite a working Python or C++ system to chase a trend. When I do reach for Rust inside something that already works, I do it at a boundary (one hot parser, one collector, one agent) where I can measure it against the old code and back out if I'm wrong.

## How I actually decide

After the experiment, I reach for Rust when I can say yes to a few of these:

- Performance is a *measured* problem, not a theoretical one. The current thing misses an objective or can't handle the volume.
- Deployment simplicity matters: a single binary across many hosts, or a restricted environment where dependencies are a fight.
- The thing is long-running or concurrent: a service, an event processor, an agent, not a script that finishes in two seconds.
- It parses untrusted or sensitive input, where memory safety is worth paying for.
- The team can actually maintain it after I'm gone. Training time goes in the estimate, not the footnotes.

When none of that holds, Python is still the shortest path from problem to solution, and it usually wins.

## Where I landed

Rust changed how I think a little. It made me more deliberate about modeling states and more honest about error paths. Every language moves complexity somewhere: Python pushes it into runtime and tests, C hands it to the programmer, Rust pushes it into the compiler and the time you spend up front. None of them make it disappear.

I'll use Rust when I need a reliable native binary, predictable performance, or memory-safety guarantees that earn their cost. I'll keep using Python when the real problem is integration, experimentation, or business logic that changes three times a week. And I'll leave the working C++ where it is.

Rust earned a spot in my toolbox. It didn't earn command of it, and no language does that on hype. It earns that one project at a time.
