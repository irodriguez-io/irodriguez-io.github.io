---
title: "AI coding agents are unmanaged identities"
date: 2026-05-21
slug: ai-coding-agents-unmanaged-identities
lang: en
image: /img/art03.png
description: "AI coding agents like Cursor, Claude Code, and Copilot are non-human identities operating under human credentials — with no joiner-mover-leaver, no session controls, and a built-in exfiltration path. The fix is the IAM playbook we already know."
translation: "/blog-es/2026/05/ai-coding-agents-unmanaged-identities/"
---

The IDE assistant your devs installed last week violates more of your access control policy than any human contractor ever could.

I mean that literally. Pull your access policy. Read it line by line. Then look at how Cursor, Claude Code, or Copilot got onto every engineer's laptop in your org, and tell me with a straight face that it complies.

Imagine a contractor walked in on Monday. They plugged a personal laptop into your network. They asked for read access to every repo, every wiki, every secret in every dev's env file. They wanted their badge to keep working after the contract ended. They wanted to operate outside your SSO, your Conditional Access, and your device trust. And they wanted to ship code on your behalf without ever logging in as themselves.

You would escalate to security in ninety seconds.

Your engineers did all of that last week. Voluntarily. And called it "developer productivity."

## These agents are identities, not tools

AI coding agents are not productivity tools. They are non-human identities operating under a human's credentials. Most security teams haven't caught up because the procurement story looks like a $20-per-seat license, not a new privileged identity getting onboarded with broader scope than your senior IC.

The part that should bother you: every IDE agent running in your environment is a standing-privilege identity with no joiner-mover-leaver, no session controls, no review, and a built-in exfiltration path. By every policy you have written, it is a violation.

Three reasons why.

## 1. It inherits broad standing privilege with no review

Your devs have legitimately broad read access. Multiple repos, internal docs, secrets in dotfiles, sometimes prod read for debugging. They earned that access through tickets, approvals, and reviews over time.

The agent gets all of it the second the dev pastes a PAT or signs in with OAuth. No access request. No approval workflow. No entry in your IGA. No User Access Review is going to catch it, because the UAR is reviewing humans.

You would never grant that scope to a person in thirty seconds. You just granted it to a non-human identity that can read every file the dev can read, and send it to an inference endpoint you have not vetted.

## 2. It has no joiner-mover-leaver

The PAT lives in a config file. The OAuth refresh token lives in the OS keychain. The MCP server token lives in a JSON file in the dev's home directory.

When the dev rotates teams, you re-scope their account in Okta. The agent's token does not re-scope.

When the dev leaves, you disable their account. The agent's token often keeps working until it expires on its own schedule. Which might be ninety days. Might be never. And the token is, more often thannot, sitting on a personal device you no longer have visibility into.

There is no leaver process for an identity that is not in your identity graph.

## 3. It tunnels around every control you built

Conditional Access is scoped to user sessions in your IdP. Device trust is scoped to managed devices. IP allowlists are scoped to corporate ranges. Step-up auth fires on the user's session, not on the agent's API call.

The agent operates outside all of that. Often from a personal device. Often pushing code, prompts, and secrets to a third-party inference endpoint that is not in your DLP scope and not in your egress controls.

Your SIEM sees the user's identity acting. It does not see the agent. Your forensics story for "what did the agent do on October 15th between 2 and 4 PM" is, today, that you cannot tell.

## What this looks like in practice

A pattern I have seen, made deliberately generic:

A senior engineer joins a new team. Their Okta group membership gets re-scoped — they lose access to the old team's repos. But the GitHub fine-grained PAT they generated for their IDE agent six months ago, when they were still on the old team, still has the original scope. The agent keeps reading the old team's code every time the engineer opens the project folder where that token lives in `.env`.

Six months later the same engineer leaves the company. Their Okta account is offboarded the same afternoon. The PAT — still on their personal MacBook, which they used to dial in occasionally because corporate VPN was flaky — keeps working until it expires on the calendar, 47 days later. For 47 days, an offboarded employee's coding agent has read access to repositories that no current employee at the company should be able to read.

The IGA shows zero exceptions. The UAR last quarter was clean. The SIEM, looking back, sees the engineer's GitHub user reading the repos — exactly the activity it has seen for years. There is nothing to alert on.

That is what "no JML for non-human identities" actually costs.

## What is not going to fix this

I have heard all the easy answers in the last six months. None of them are the answer.

"Block the tools." Your devs will use personal accounts on personal devices. You will not see it. You will see it less than you see it now.

"Train people." On what, exactly? They are using a productivity tool their VP told them to try. You will not train your way out of standing privilege.

"Use the vendor's enterprise tier." Sure, do it. It is still inheriting the user's permissions and still operating outside your IdP boundary. It is a better posture. It is not a fix.

## The actual fix is unglamorous

The actual fix is the IAM playbook you already know. Scoped tokens, not classic PATs. Short TTLs. Agent-specific service accounts with their own lifecycle, owner, and review cadence. Audit logs that distinguish the human from the agent. Conditional Access policies that treat "API call from agent context" as a posture signal, not just a user-session signal.

Here is what that looks like in concrete terms.

The PAT a developer typically generates for an IDE agent today has roughly this shape:

```yaml
# Classic GitHub PAT — the way most agents are wired today
scopes:
  - repo            # full read/write to every repo the user can access
  - workflow        # modify GitHub Actions
  - read:org        # see all org membership
  - gist            # create public gists (a known exfil path)
expiry: 90 days     # or never, if the user picked "no expiration"
identity_in_logs:   indistinguishable from the user
```

What it should be, in scope terms:

```yaml
# Fine-grained PAT — scoped per agent
resource_owner: acme-org
repositories:
  - acme-org/api-service       # only the repo this agent is actively helping with
permissions:
  contents: read
  metadata: read
  pull_requests: write         # if it needs to open PRs at all
expiry: 7 days                 # weekly rotation, mandatory
identity_in_logs:  distinct token ID, mapped to a service principal
```

The YAML is illustrative — GitHub does not actually configure fine-grained PATs from a file — but the *scope* shape is real. The agent reads one repo, not the world. Writes are gated where they need to be gated. The token rotates often enough that a leaked one expires before it matters.

Wrap that token in an Okta-side service account that lives in a dedicated `Agent-Service-Accounts` group, with a named human owner, a quarterly UAR specifically for non-human identities, and a Conditional Access policy that flags API activity from outside known agent contexts. None of that is novel. We just have not been doing it for agents.

We have governed non-human identities before. We did it badly for service accounts. And we are about to do it badly again for AI agents — except this time the identity makes decisions.

## This is not new ground

If you read NIST 800-207, the seven tenets of Zero Trust Architecture are the argument I am making in this post, written six years before AI coding agents existed. Tenet 3 says access to enterprise resources is granted on a per-session basis. A 90-day PAT is not per-session. Tenet 4 says access is determined by dynamic policy that considers the observable state of identity, application, and requesting asset. An IDE agent on an unmanaged laptop is none of those things, by design. Tenet 6 says all authentication and authorization are dynamic and strictly enforced before access. The agent's authentication happened once, months ago, in a config file the IdP never sees.

CISA's Zero Trust Maturity Model puts a lot of orgs at Advanced on the Identity pillar today — MFA, conditional access, lifecycle automation, the works. AI coding agents quietly drop that score back to Initial for an entire category of identity nobody is measuring. The maturity model assumes you know what identities exist in your environment. The IDE assistant your devs installed last week is, by every observable measure, not in your identity graph.

## Where this is going

We are going to look back at 2026 the way we look back at 2010 service-account sprawl. Except worse, because these ones write code.

If you are in IAM or security and your org has actually started governing these the way you would govern any other privileged identity, I want to hear about it. Banning, ignoring, and "we'll deal with it next quarter" are the three options I see most often.

I am curious if anyone has tried option four.
