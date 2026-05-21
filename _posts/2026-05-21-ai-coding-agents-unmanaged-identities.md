---
title: "AI coding agents are unmanaged identities"
date: 2026-05-21
slug: ai-coding-agents-unmanaged-identities
lang: en
image: /img/art03.png
description: "AI coding agents like Cursor, Claude Code, and Copilot are non-human identities operating under human credentials — with no joiner-mover-leaver, no session controls, and a built-in exfiltration path. The fix is the IAM playbook we already know."
---

The IDE assistant your devs installed last week violates more of your access control policy than any human contractor ever could.

I mean that literally. Pull your access policy. Read it line by line. Then look at how Cursor, Claude Code, or Copilot got onto every engineer's laptop in your org, and tell me with a straight face that it complies.

Imagine a contractor walked in on Monday. They plugged a personal laptop into your network. They asked for read access to every repo, every wiki, every secret in every dev's env file. They wanted their badge to keep working after the contract ended. They wanted to operate outside your SSO, your Conditional Access, and your device trust. And they wanted to ship code on your behalf without ever logging in as themselves.

You would escalate to security in ninety seconds.

Your engineers did all of that last week. Voluntarily. And called it "developer productivity."

## These agents are identities, not tools

AI coding agents are not productivity tools. They are non-human identities operating under a human's credentials. Most security teams haven't caught up because the procurement story looks like a $20-per-seat license, not a new privileged identity getting onboarded with broader scope than your senior IC.

Here is the part that should bother you. Every IDE agent running in your environment is a standing-privilege identity with no joiner-mover-leaver, no session controls, no review, and a built-in exfiltration path. By every policy you have written, it is a violation.

Three reasons why.

## 1. It inherits broad standing privilege with no review

Your devs have legitimately broad read access. Multiple repos, internal docs, secrets in dotfiles, sometimes prod read for debugging. They earned that access through tickets, approvals, and reviews over time.

The agent gets all of it the second the dev pastes a PAT or signs in with OAuth. No access request. No approval workflow. No entry in your IGA. No User Access Review is going to catch it, because the UAR is reviewing humans.

You would never grant that scope to a person in thirty seconds. You just granted it to a non-human identity that can read every file the dev can read, and send it to an inference endpoint you have not vetted.

## 2. It has no joiner-mover-leaver

The PAT lives in a config file. The OAuth refresh token lives in the OS keychain. The MCP server token lives in a JSON file in the dev's home directory.

When the dev rotates teams, you re-scope their account in Okta. The agent's token does not re-scope.

When the dev leaves, you disable their account. The agent's token often keeps working until it expires on its own schedule. Which might be ninety days. Might be never. And the token is sitting on a personal device you no longer have visibility into.

There is no leaver process for an identity that is not in your identity graph.

## 3. It tunnels around every control you built

Conditional Access is scoped to user sessions in your IdP. Device trust is scoped to managed devices. IP allowlists are scoped to corporate ranges. Step-up auth fires on the user's session, not on the agent's API call.

The agent operates outside all of that. Often from a personal device. Often pushing code, prompts, and secrets to a third-party inference endpoint that is not in your DLP scope and not in your egress controls.

Your SIEM sees the user's identity acting. It does not see the agent. Your forensics story for "what did the agent do on October 15th between 2 and 4 PM" is, today, that you cannot tell.

## What is not going to fix this

I have heard all the easy answers in the last six months. None of them are the answer.

"Block the tools." Your devs will use personal accounts on personal devices. You will not see it. You will see it less than you see it now.

"Train people." On what, exactly? They are using a productivity tool their VP told them to try. You will not train your way out of standing privilege.

"Use the vendor's enterprise tier." Sure, do it. It is still inheriting the user's permissions and still operating outside your IdP boundary. It is a better posture. It is not a fix.

## The actual fix is unglamorous

The actual fix is the IAM playbook you already know. Scoped tokens, not classic PATs. Short TTLs. Agent-specific service accounts with their own lifecycle, owner, and review cadence. Audit logs that distinguish the human from the agent. Conditional Access policies that treat "API call from agent context" as a posture signal, not just a user-session signal.

We have governed non-human identities before. We did it badly for service accounts. And we are about to do it badly again for AI agents — except this time the identity makes decisions.

## Where this is going

We are going to look back at 2026 the way we look back at 2010 service-account sprawl. Except worse, because these ones write code.

If you are in IAM or security and your org has actually started governing these the way you would govern any other privileged identity, I want to hear about it. Banning, ignoring, and "we'll deal with it next quarter" are the three options I see most often.

I am curious if anyone has tried option four.
