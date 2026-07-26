---
title: "The Secrets Manager Combination Nobody Ships Yet"
date: 2026-07-25
slug: secrets-manager-combination-nobody-ships
topic: iam
lang: en
description: "Concealed credential autofill, a passkey on removable hardware, and enterprise management all exist today — but no product ships them together. How a profile-wiping DLP control breaks device trust for outsourced teams, and why the fallback is always a spreadsheet."
translation: "/blog-es/2026/07/secrets-manager-combination-nobody-ships/"
image: /img/blog-hero/pixabay-4703841.jpg
---
## The business case

Plenty of organizations hand sensitive systems to teams they don't directly employ. Outsourced support desks, back-office processors, and contractor pods all need to log into tools that hold customer data, financial records, or internal systems. The catch is that the humans doing the work are not supposed to know the credentials themselves. If a person can read the password, the password may walk out the door.

The first question any security reviewer asks here is why these are passwords at all. Put everything behind SSO and the whole problem disappears. Sometimes you can. But many of these logins belong to third parties, and some of those third parties carry the business. A partner portal built in 2009 doesn't speak SAML or OIDC, and when that partner moves half your volume, nobody gets to say "modernize your login page or we're done." The password stays because the relationship matters more than the portal. So you end up managing legacy credentials for systems you will never control.

For those, the standard answer is credential concealment. A secrets manager holds the real value, and a browser extension autofills it into the login form. The agent clicks "log in," the field populates, and the plaintext never appears anywhere the human can read or copy it. The secret gets used without being known.

That pattern works right up until you combine it with a hardened endpoint.

## Where it breaks

To make sure only an authorized agent can trigger that autofill, the secrets manager authenticates the user, increasingly with a passkey. A WebAuthn credential gets provisioned and bound to the device, living in the browser profile or the OS credential store. Device trust, established once, reused every session.

Now add a data-loss-prevention posture built around ephemeral workspaces. At the end of every session, the user profile and every file generated during that session are wiped. This is a reasonable control for outsourced environments: nothing persists locally, so nothing can be exfiltrated from local storage.

The problem is that the device-bound passkey lives in exactly the storage that gets wiped. Session ends, profile is destroyed, passkey is gone. Next session, the extension has no trust anchor and can't authenticate. The autofill mechanism, the entire point of the setup, stops working.

A synced passkey would ride out the wipe, but syncing means signing the browser into a cloud account that follows the user around, and that's precisely what these environments forbid.

## What exists today, and where each piece falls short

To be fair to the market, every ingredient of the fix already ships somewhere. What I haven't found, in products or in the security evaluations I've seen for this scenario, is all of them in one enterprise-deployable product.

Roaming-key vault unlock exists. In late 2025, Dashlane and Yubico shipped exactly the trust-anchor relocation this problem calls for: a browser extension where a FIDO2 security key both authenticates the user and derives the vault decryption key, using the WebAuthn PRF extension, with no master password involved. Because the credential lives on the removable key rather than in the profile, it would survive a session wipe intact. But it launched for new personal users on desktop Chromium browsers, not as an enterprise-managed deployment. And it's a normal password manager: the user can reveal what's in their vault. No concealment.

Concealed autofill exists too. Bitwarden's hidden-password collection permissions let members autofill credentials they can't reveal or copy. Keeper hides shared credentials from end users while injecting them at login. But the mainstream implementations anchor their device trust in exactly the storage an ephemeral workspace destroys. The browser-side variants also have a known weakness, one the vendors themselves document: if the plaintext is delivered to a field in the user's own browser, a determined user can often dig it out of the DOM with developer tools. Concealment at the extension layer is an access-control convenience, not a hard boundary.

A different architecture sidesteps the whole problem. Remote browser isolation (Keeper Connection Manager is the clearest example) runs the session in a containerized browser on a gateway and streams pixels to the agent, injecting the credential server-side. Nothing ever lands on the local machine, so there's nothing for a profile wipe to break and nothing in the local DOM to inspect. If you can live with a streamed session, this solves the business need today. The trade-offs are real, though: latency and rendering quirks for high-volume production work, gateway infrastructure to run and scale, and per-session compute costs that multiply across a large outsourced floor. For teams doing hundreds of fast, repetitive logins a day, a streamed browser is a very different product than a local one.

## The combination nobody ships

So the gap, stated precisely: no single product I've found combines

1. **Local-browser concealed autofill**: the secret injected without being renderable or copyable, in the agent's own browser, not a streamed one;
2. **Device trust on a roaming authenticator**: the passkey on an external FIDO2 key, so an ephemeral-profile wipe can't destroy it;
3. **Enterprise deployment**: centrally managed, policy-controlled, auditable, and able to pass a security review for third-party access.

Dashlane has (2) without (1) or (3). The concealment-capable enterprise vaults have (1) and (3) but anchor their trust in wiped storage, failing (2). Fronting one of those vaults with SSO doesn't escape the trap either: a zero-knowledge manager still needs a local decryption anchor after the identity provider says yes, and that anchor lives in the profile the wipe destroys. Remote browser isolation achieves the outcome by abandoning the local browser entirely. The primitives all exist: WebAuthn PRF, resident keys on hardware authenticators, encrypted secret retrieval, injection without rendering. The assembly doesn't, or at least didn't survive contact with a real security review the last time I looked. If a vendor has quietly shipped all three, I'd welcome the correction in the comments, because it would solve a real problem.

## What keeps a stolen key from becoming a skeleton key

One objection comes up immediately when you propose putting the trust anchor on a piece of hardware an outsourced agent carries: what happens when the key walks off?

The honest answer is that a FIDO2 key on its own is designed to be inert. The standard defense-in-depth stack looks like this:

- **User verification on the authenticator.** The key won't release an assertion for possession alone. It demands a PIN or an on-key biometric on top of the physical touch, so a found or stolen key without its second factor is a paperweight.
- **Retry lockout.** A FIDO2 authenticator locks after eight consecutive wrong PIN attempts, and the only way back is a factory reset that wipes its credentials. There's no offline brute-force path; the key destroys its own usefulness under guessing.
- **Attestation-gated enrollment.** Registration can be restricted to approved authenticator models, so an attacker can't enroll a rogue device even with a stolen account.
- **Session binding.** The key unlocks nothing by itself. It works only inside an authenticated identity-provider session, on a managed endpoint, against a service that logs every autofill. Possession is one gate in a series, never the only one.

None of that is exotic. It's the same layering any WebAuthn deployment should have. The point is that "the passkey is on removable hardware" doesn't mean "whoever holds the hardware holds the secrets."

## The actual lesson: over-tight DLP manufactures risk

A profile-wiping DLP control does precisely what it's configured to do. It erases local artifacts to prevent exfiltration. But configured bluntly enough, it also destroys a legitimate security mechanism: the device-trust anchor a concealment tool depends on.

When a control is that indiscriminate, it relocates risk instead of eliminating it, and usually to somewhere worse, because the business need doesn't evaporate when the tool breaks. The agents still have to log in. So the vacuum gets filled by whatever's available, and what's available is almost always less secure than the thing the control just broke.

The predictable endgame, across the industry, is a spreadsheet, a shared document, or a pinned chat message. A control designed to stop data loss ends up herding the most sensitive secrets in the building into the least protected container available. The plaintext the concealment tool existed to hide is now sitting in a document anyone with the link can read.

That's the default gravity here. Remove the secure tool while the need remains, and the workaround arrives on schedule.

## The takeaway

A DLP program that wipes profiles has to account for the trust layer, not just the data layer. Exempt or relocate the credentials that establish device trust, whether by putting them on hardware or anchoring them outside the wipe. Otherwise the control will keep breaking the exact tools that make outsourced access safe.

And the tooling gap is narrower than it looks. Roaming-key vault unlock shipped in 2025. Concealed autofill has existed for years. Remote isolation proves the business need is solved when you're willing to change architectures. All that's missing is one vendor putting concealment, a hardware-anchored passkey, and enterprise management into the same local-browser product. Until someone does, teams in locked-down environments are stuck choosing between a control that breaks their tools, an architecture change they may not be able to absorb, and a workaround that quietly undoes the control. Nobody should have to make that choice. It's a good problem for a security vendor to go finish solving.
