---
title: "The eight domains of cybersecurity"
date: 2024-05-15
slug: eight-domains-cybersecurity
topic: cybersec
lang: en
description: "A practical walk through the (ISC)² CISSP Common Body of Knowledge: the eight domains and how they show up in real work."
translation: "/blog-es/2024/05/eight-domains-cybersecurity/"
---

The CISSP groups security work into eight domains. They are not eight separate jobs. They are eight angles on the same problem: how to protect data, systems, and people without breaking the business that depends on them.

A little history first. The International Information System Security Certification Consortium, *(ISC)²*, was formed in 1989 by merging several professional information security groups that wanted a neutral, vendor-independent standard for an emerging discipline. The first Common Body of Knowledge (CBK) was finalized in 1992. The Certified Information Systems Security Professional (CISSP) certification launched in 1994. Today (ISC)² is headquartered in Alexandria, Virginia, and the eight domains below are the structure it uses to define what a CISSP is expected to know.

Below is each domain, what it actually covers, and the kind of work it produces day to day.

## 1. Security and risk management

This is the policy and governance layer. It covers risk assessment, regulatory compliance, business continuity, and the security objectives the rest of the program is measured against. Day to day, this is the domain that has the answer to "what does HIPAA require?", "what does PCI-DSS require?", and "if this control fails, what's the business impact?". When a new regulation lands, this is the domain that translates it into internal policy.

## 2. Asset security

Asset security is about the data and the equipment that holds it. Classification, retention, storage, and end-of-life disposal all live here. Disposing of a decommissioned laptop is not a logistics problem, it is a data problem: if the drive leaves the building unwiped, the data leaves with it. Same logic applies to backups, file shares, and any system that holds records the organization is accountable for.

## 3. Security architecture and engineering

This domain designs the controls. Network segmentation, firewall rules, encryption at rest and in transit, identity-aware proxies, hardened base images. The goal is to make the secure path the default path, so the organization isn't relying on every user to make the right decision every time. Architecture work is also where you decide what *not* to build, because every additional system is additional attack surface.

## 4. Communication and network security

Network security covers the channels: wired, wireless, VPN, and everything that moves traffic between systems. The work splits between hardening the infrastructure (segmentation, TLS, monitoring) and shaping user behavior (don't plug corporate gear into open wifi, don't expose internal services through personal tooling). Both matter. You can have the network locked down and still get compromised by a user pasting a credential into the wrong form.

## 5. Identity and access management

This is the domain I work in, so I have an opinion here. IAM is the control plane for who can do what. It covers identity proofing, authentication, authorization, and the entire lifecycle of an account from hire to termination. Single sign-on, SCIM provisioning, group-based access, MFA, and access reviews all live in this domain. Done well, IAM is invisible: people get the access they need on day one, lose it the day they leave, and nothing in between goes stale. Done poorly, IAM is how breaches get their first foothold.

## 6. Security assessment and testing

This is the domain that asks "is the control we put in place actually working?". Vulnerability scanning, penetration testing, access reviews, audit evidence collection. The work is intentionally repetitive. A control that worked last quarter can stop working this quarter because a system got upgraded, a permission got added, or a process changed. The only way to know is to test it again.

## 7. Security operations

Security operations is the live side: monitoring, detection, incident response, and the work that happens when an alert fires at 2 a.m. This domain owns the SIEM, the EDR, the playbooks, and the on-call rotation. Its measure of success is how fast an incident moves from "something looks wrong" to "we contained it and we know what happened".

## 8. Software development security

Software development security folds the other seven domains into the software lifecycle. Threat modeling at the design stage, secure coding standards, dependency review, secrets handling, and security testing as part of CI. The goal is to push security findings as far left as possible, because a vulnerability caught in code review costs a fraction of the same vulnerability caught in production.

---

The eight domains are a map, not a to-do list. Most security professionals work deeply in one or two and stay conversational in the rest. What the CISSP framework gives you is a shared vocabulary, so when the network team, the IAM team, and the appsec team are in the same incident review, they're using the same words to describe the same problem.

If you're starting out, pick the domain that fits the work in front of you and go deep. The other seven will pull you in as soon as you start coordinating across teams, which in practice is most of the job.
