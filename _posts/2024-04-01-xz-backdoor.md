---
title: "Understanding the XZ Backdoor"
date: 2024-04-01
slug: xz-backdoor
lang: en
image: /img/art03.png
description: "A breakdown of the XZ Utils backdoor (CVE-2024-3094) — what happened, why it matters, and what supply-chain lessons stick."
translation: "/blog-es/2024/04/xz-backdoor/"
---

A recent discovery has reminded us of the perennial truth: security is a never-ending battle. The latest frontier in this battle is the 'XZ Backdoor' vulnerability, a critical issue that has managed to slip under the radar until its recent unmasking.

## What is the XZ Backdoor Vulnerability?

In simple terms, the XZ Backdoor is like an illicit secret passage into what should be a fortress of your digital systems. It's a severe weakness within the XZ Utils software, a tool used for compressing and decompressing files on Linux and other Unix-like systems. This vulnerability grants unauthorized access to a system, much like leaving the backdoor of your house unlocked, only in this case, you didn't even know there was a door there.

The back door part comes into play with one of the main ways xz is used - SSH. SSH is an encrypted protocol between two machines where text commands can be exchanged, allowing a user to interact with a server. It’s a very common utility in the Linux world and the security of this communication is critical. The back door means that the connection is no longer private and could allow an attacker to insert their own text commands into the secure connection.

## How Did It Come to Be?

Imagine a community garden where everyone adds plants and helps it grow – this is akin to open-source software development. XZ Utils, maintained for years by only one dedicated individual, suffered when someone introduced a toxic plant, so to speak. This "plant" grew over time, unnoticed due to its clever camouflage, until it spread its roots deep into the system.

A new developer, "Jia Tan", took advantage of the open and trusting nature of the open-source community to implement this backdoor. By submitting seemingly innocent patches over 2 years and manipulating community dynamics, this individual gained trust and eventually critical access to the project.

## A Brief Timeline Description

**2021:** JiaT75 (Jia Tan) creates their GitHub account. The first commits they make are not to xz, but they are deeply suspicious. The code he submits does a little more than it says.

In April 2022, Jia Tan submitted a patch via a mailing list. The contents of the patch are not relevant, but the events that follow are. A new persona — Jigar Kumar — enters the conversation and begins pressuring for this patch to be merged. This is when JiaT75 makes their first commit to xz. Since this commit, they become a regular contributor to xz.

On Jan 7, 2023 JiaT75 merges their first commit into the xz repository, which gives us a good indication of when they fully gain trust. Testing infrastructure that will be used in this exploit is committed.

By early 2024 a commit containing the final steps required to execute this backdoor is added to the repository.

This vulnerability was discovered by a vigilant Microsoft employee in March 2024 and was subsequently given the identifier CVE-2024-3094.

## Ensuring Your Systems Are Protected

To safeguard your personal and business systems, it's imperative to:

- **Check for the vulnerability:** Tools such as the one provided by security firm Binarly can help you identify if your system is compromised.
- **Patch immediately:** If the vulnerability is detected, apply patches released by your Linux distribution provider without delay.
- **Remain informed:** Subscribe to security advisories for the latest information on vulnerabilities and patches.

## A Call for Vigilance in Cybersecurity.

This event is a stark reminder that complacency in cybersecurity can have dire consequences. While the open-source model promotes collaboration and innovation, it also demands vigilance and a proactive approach to security.

As an information security analyst, my message is clear: never underestimate the importance of a vigilant mindset. In cybersecurity, the enemy is often invisible, the tactics ever evolving, and the battle unending. This is not to induce fear, but to encourage awareness and action. Stay educated, patch diligently, and fortify your digital domain. Remember, a single unattended backdoor can compromise the safety of the entire structure.

In an age where digital security is paramount, let's not allow our guards to slip. It's our shared responsibility to protect the integrity of our systems, for the sake of our personal safety, our businesses, and the trust of those we serve. Keep the doors locked, the windows bolted, and the watch constant.
