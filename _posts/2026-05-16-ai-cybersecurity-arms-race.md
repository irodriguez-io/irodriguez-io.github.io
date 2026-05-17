---
title: "The AI cybersecurity arms race"
date: 2026-05-16
slug: ai-cybersecurity-arms-race
lang: en
image: /img/art02.png
description: "How the same generative AI now protects organizations and attacks them, what Mythos and MDASH actually change, and what smaller businesses can do about it."
translation: "/blog-es/2026/05/ai-cybersecurity-arms-race/"
---

In September 2026, an employee at the engineering firm Arup transferred $25 million to attackers after a video conference with what looked like the company's CFO and financial controller. Every face on the call was a real-time AI deepfake. That one incident is the cleanest summary of where cybersecurity is in 2026: the same generative AI that protects an organization also impersonates its executives, and both sides are shipping faster than incident response can keep up.

This is an arms race, not a one-sided technology shift. The same week Anthropic released *Claude Mythos* under *Project Glasswing*, a $100 million defensive initiative with Amazon, Apple, Cisco, CrowdStrike, Google, JPMorgan Chase, Microsoft, NVIDIA, and Palo Alto Networks, CrowdStrike's 2026 Global Threat Report documented a 340% year-over-year increase in AI-assisted intrusion attempts. Adversarial AI tools now drive roughly 38% of credential-harvesting campaigns globally.

## What the attackers have

The offensive tooling is no longer experimental. Generative models produce near-flawless phishing in dozens of languages. Polymorphic malware changes behavior at runtime to evade signature-based detection. Voice and video deepfakes are interactive in real time, not pre-recorded clips. Ransomware operates between 80 and 90 percent autonomously today, and analysts are forecasting fully self-directed campaigns that pick targets, find the path in, and exfiltrate data without an operator on the keyboard.

What changed in 2026 is not capability, it is access. Tools that previously required a nation-state budget are now packaged into commercial offerings on criminal marketplaces. The barrier to running an AI-assisted attack at scale is a credit card, not a research lab.

## What the defenders have

The defensive side gained an equally significant capability. In its first preview, *Claude Mythos* identified thousands of zero-day vulnerabilities across every major operating system and browser, including Windows, macOS, Linux, FreeBSD, OpenBSD, Chrome, Firefox, Safari, and Edge. One of the OpenBSD findings was a 27-year-old flaw in an OS that has spent decades being audited by hand. Mythos reproduced the bugs and built working exploits on the first attempt in more than 83% of cases.

Microsoft's *MDASH*, a multi-agent system orchestrating more than 100 specialized AI agents in parallel, scored 88.45% on the CyberGym benchmark, narrowly beating Mythos and GPT-5.5. The shift inside security operations is just as concrete. The agentic SOC model, now adopted at Microsoft, Palo Alto Networks, and a growing number of mid-market vendors, puts AI agents alongside analysts to investigate, triage, and contain in single-digit minutes rather than hours.

The bottleneck is not detection. It is patching. When Anthropic announced the first batch of Mythos findings, more than 99% of the discovered vulnerabilities were still unpatched in production. AI finds the holes faster than vendors close them, and that gap is exactly what an AI-assisted attacker exploits.

## Where this leaves smaller organizations

For small and medium businesses, the news is mixed but workable. Gartner is forecasting $238 billion in information security spending in 2026, with AI capability priced increasingly per-seat instead of per-deployment. A 50-person company can now buy behavioral anomaly detection, autonomous threat response, and identity threat protection at a cost that fits the budget. The same vendors selling agentic SOC tooling to banks are selling scaled-down versions to companies that used to be defended only by a firewall and a hope.

The choice is no longer whether to use AI in defense. The attackers already made that decision for everyone. The remaining choices are how fast to deploy, how rigorously to validate what the AI surfaces, and how cleanly to integrate the output into a human-led review process that still matters more than any single model.

## What to do about it

Anthropic, Microsoft, and the FBI agree from very different angles on the same point: defenders only win this race if they ship faster than the attackers. That requires investment in tooling, patching velocity, and people who can read what the AI is telling them and act on it.

The action items are the same for any organization, regardless of size:

1. Deploy AI defensively. Buy or pilot one tool from the agentic SOC category this quarter, even at a small scale.
2. Shorten patching windows. AI accelerates discovery on both sides; the only safe assumption is that an attacker has the same vulnerability list you do.
3. Train people for the new threat model. Most current phishing training does not prepare staff for a live deepfake video call. Update it.
4. Keep a human in the loop on every escalation. The most expensive incidents in 2026 happen when an AI output is acted on without verification.

This preserves the integrity of the systems the business runs on, avoids handing attackers an asymmetric advantage, and keeps the security budget funded by something other than the cost of the next incident.
