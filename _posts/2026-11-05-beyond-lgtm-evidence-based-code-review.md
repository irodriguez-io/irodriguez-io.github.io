---
title: 'Beyond "LGTM": Evidence-Based Code Review in the Age of AI'
date: 2026-11-05
slug: beyond-lgtm-evidence-based-code-review
topic: infosec
lang: en
description: "An approval tells you someone accepted a change, not what they checked. How to turn code review into an evidence package the tests can actually support, and who should accept the risk that remains."
translation: "/blog-es/2026/11/beyond-lgtm-evidence-based-code-review/"
image: /img/blog-hero/pixabay-1853330.jpg
---

## 1. The gap between approval and assurance

Imagine a large pull request for an access-management automation. The author is respected, the description is clear, and the deadline is close. A reviewer scans the central logic, checks a few comments, sees a green test suite, and approves: "LGTM." The review is sincere. It is also narrower than the approval suggests.

What does an approval actually tell us about the safety of a change?

It tells us that someone accepted the change under particular conditions. Unless those conditions are visible, we cannot tell which requirements the reviewer examined, which failures they considered, or how much confidence the tests deserve. A competent, well-intentioned reviewer is still limited by attention, familiarity, and delivery pressure. Respect for an experienced colleague can affect how hard we question a design. A looming release can affect which questions we leave unanswered.

These weaknesses belong to the review process, not to the person who wrote the code, whatever their seniority or choice of tools. Human peer review has always worked within limited time and within social relationships. AI-assisted development makes the weakness of an approval without evidence harder to ignore: producing more code does not increase our capacity to understand its consequences.

The answer is to give review a basis that others can inspect. Building on existing secure development practice, we can collect reproducible evidence, check whether tests represent real operating conditions, and make the remaining uncertainty explicit for the people authorized to decide what happens next.

## 2. A foundation already exists

NIST's Secure Software Development Framework (SSDF), SP 800-218, provides a useful foundation. In SSDF version 1.1, practice PW.7 covers reviewing and analyzing human-readable code to identify vulnerabilities and verify compliance with security requirements. PW.8 covers testing executable code for the same purposes. Both include recording and triaging what is found. The two practices complement each other: reading the source can expose problems that no test run triggers, and running the code can reveal behavior that reading misses.[^1]

What is missing is a way to make that evidence gathering systematic and inspectable while development speeds up. For the access-management automation, that means assembling enough information to evaluate one specific claim: does this version enforce the agreed access rules under the conditions in which it will operate?

## 3. From an approval to an evidence package

The automation in our example receives HR lifecycle events and updates employee account access. When an employment update arrives cleanly and on time, the automation produces the intended account state. The change looks straightforward until we examine event ordering, retries, and who has the authority to restore access.

A review workflow could give specialized AI agents distinct responsibilities:

- **Requirements:** connect each behavior that matters to an explicit requirement, and identify expectations that are ambiguous or missing.
- **Authorization and misuse:** examine who can submit lifecycle changes, what authority the automation holds, and whether stale, replayed, or unauthorized inputs can restore access.
- **Edge cases and recovery:** exercise late events, duplicates, concurrent updates, dependency failures, partial completion, and retries.
- **Source quality and architecture:** inspect state handling, separation of responsibilities, and whether future changes can be reasoned about safely.

An orchestrator collects the agents' findings along with actual execution results. A proposed test is not a completed run, and a narrative claiming success needs a result behind it. The orchestrator should also surface contradictions, such as an authorization review concluding that stale updates are rejected while an execution trace shows an account being re-enabled.

Each finding should be tied to the exact code version, test version, input fixtures, configuration, and environment. Recording runtime and dependency versions, simulated service behavior, commands, and relevant logs lets another reviewer reproduce the result within stated limits. If the candidate changes, the package must separate evidence that still applies from evidence that needs another run.

The deliverable is a review package that explains what was checked, what happened, what failed, and what remains unknown. It connects each claim to its evidence and keeps unresolved disagreements on the record.

NIST does not prescribe this multi-agent design. It is one way to implement the practices above, and its value has to be shown through the quality of the evidence it produces and the decisions that evidence supports.

Agreement between agents does not prove correctness. Several agents can share the same mistaken requirement or assume the same unrealistic service behavior, and giving them different role descriptions does not make their judgments independent. The workflow earns trust when its assertions can be checked against explicit rules and against results anyone can inspect.

## 4. Do the tests justify the conclusion?

The most important question in the review is whether the tests justify the conclusions drawn from them. To answer it, we first need a rule to test against.

Suppose the policy owner for this system, the person accountable for its access rules, has set the following rule: once a valid termination is processed, the account must stay disabled, and an older active-status event cannot restore access. Reactivation requires a separately authorized rehire transition. The rule was set independently of the implementation.

With the rule in place, three distinctions help:

| Question | What it asks | Applied to the example |
| --- | --- | --- |
| Validity | Are we testing the intended property against justified expectations? | Does the assertion show that a processed termination cannot be undone by an older active-status event? |
| Fidelity | Do the test conditions resemble real operation? | Can events arrive late, out of order, or more than once, and can a retry resume after state has changed? |
| Coverage | Which important situations remain outside the tests? | Have we examined simultaneous updates, prolonged failures, and recovery after partial execution? |

The initial tests deliver an active update and then a termination, in order, with immediate responses from the account service. The account ends disabled. The tests pass.

Now change the delivery order:

| Event time | Delivery time | HR event |
| --- | --- | --- |
| 08:58 | 09:04 | Version 41: employee active |
| 09:00 | 09:01 | Version 42: employee terminated |

The automation processes version 42 and disables the account. Three minutes later, version 41 arrives. An implementation that simply applies the last status it received re-enables the account. It passed the original tests because they never challenged its assumption that arrival order is authoritative order.

A passing result can be weak evidence in two ways. The test may assert the right rule under conditions too narrow to support the deployment claim, which is a fidelity problem. Or it may model delayed delivery accurately but expect the wrong result, for example by treating "last arrival wins" as correct because that is what the code already does. That is a validity problem, and making the environment more realistic will not fix it.

Assertions must also observe the property being claimed. Confirming that the workflow returned success, or that it sent a disable request, does not show that the account stayed disabled after the stale event arrived. The test has to observe the resulting access state, including any intermediate state that matters. A temporary unauthorized reactivation is still a failure, even if a later reconciliation disables the account again.

An isolated unit test is still valuable for a narrow claim, such as how two event versions are compared. Broader claims need evidence that also covers persistence, service responses, and recovery. A faithful test does not need to recreate all of production, but its simplifications must be visible.

## 5. Operational history becomes a testing asset

Knowing how the current process really works improves our ability to verify the automation that replaces it. In that sense, observability is an input to verification. Event timing, exceptions, manual interventions, failed attempts, incidents, and recovery outcomes can reveal conditions that a clean requirements document leaves implicit.

Suppose authorized records from the current process show that active-status updates sometimes arrive after termination updates. They also show retries after account-service timeouts, and occasions when an operator corrected an account by hand. These records give us reasons to test delivery order, duplicate execution, and the interaction between automation and manual action.

What the records cannot do is decide whether any resulting access state was acceptable. History shows what happened, not what should have happened. Historical patterns should shape the scenarios, and the independently set access rules should determine the expected outcomes. If the old process routinely restored access incorrectly, reproducing that behavior would preserve a defect. If an operator made a legitimate exception, the test needs the conditions that authorized it, not an assumption that every manual intervention was valid.

The same distinction applies to timing. Records can show how long termination events took to reach the workflow, but the acceptable delay has to come from an agreed requirement. A test should also separate upstream delivery latency from the automation's own response time after receipt. Otherwise a fast handler can appear to meet an end-to-end deadline that the overall process actually misses.

History has limits of its own. Logs may omit dropped events, capture only successful operations, or leave out work done outside the system. A quiet period may contain few meaningful exceptions. Changes in integrations or operating practice can make older patterns less representative. And the absence of a recorded failure does not mean the failure is implausible.

To reduce overfitting, keep the records used to build scenarios separate from held-out evaluation cases. The split has to account for related events: putting copies of the same incident on both sides offers little independent challenge. Once an evaluation case has influenced development, keep it as a regression test and look for fresh evaluation evidence. Then add adversarial scenarios that history has never recorded, such as a forged lifecycle event or a rehire transition submitted without the required authorization.

Use authorized, minimized, sanitized, or synthetic data. For this example, synthetic identities and event sequences can preserve timing, ordering, and failure relationships without carrying real employee details. Document which properties were preserved or changed in the transformation, because sanitization can also remove the conditions a test depends on. Records become useful testing assets only when their provenance and limits stay visible.

## 6. Confidence should describe evidence and its limits

Confidence should be tied to specific claims, versions, and conditions. A useful assessment for a candidate release might read:

> Normal transitions are well tested. Delayed events have limited coverage. Concurrent updates remain untested.

That statement is deliberately uneven. Evidence can strongly support one behavior while leaving another important one unresolved. The package should back up each part: which normal transitions ran, which delay patterns were exercised, and why concurrency is outside the available evidence.

A numerical score might eventually summarize parts of this assessment, but its meaning and calibration must be explicit. The percentage of listed scenarios covered describes a chosen set of scenarios. It is not a probability that the system is safe. The set may omit the most damaging failure, and its cases may overlap heavily.

If a score is meant to predict an outcome, then the outcome, the evaluation population, and the calibration method all need to be defined. Otherwise a precise-looking number hides uncertainty. An unresolved path that re-enables a terminated account must stay visible even when hundreds of minor tests pass.

The history of the evidence matters as much as the latest summary. In our example, the out-of-order test exposed a defect. A revision adds authoritative version checks, and the retest passes. The package should keep the original failing case, the affected version, the fix, and the new result. It should also keep the gap that remains: the passing retest does not show that two concurrent workers cannot race while updating stored state.

Assumptions need a history too. The fix depends on HR versions being trustworthy and monotonic. If that guarantee changes, earlier evidence may no longer support the same conclusion. The package should record when an assumption becomes obsolete and which claims need reassessment.

## 7. Human judgment and accountable risk decisions

Humans still challenge requirements, inspect important design choices, and judge whether the tests deserve trust. In the example, someone has to question the authority of lifecycle events, examine how termination state survives retries, and decide whether the test environment meaningfully represents the account service.

A second judgment follows: is the evidence enough for the proposed deployment? Likelihood and impact are a starting point, but the decision also depends on exposure, reversibility, safeguards, monitoring, and rollback. The same uncertainty means one thing in an isolated evaluation and another in a deployment that controls real access.

Safeguards need evidence of their own. An alert about reactivation is useful only if it detects the condition and reaches someone able to respond. Reverting the workflow's code may stop further changes while leaving an already re-enabled account active, so recovery has to address access state as well as software state. Reversibility has limits too: disabling the account afterward cannot undo what was done while access was open.

That second judgment does not belong to the code reviewer by default. Accepting residual risk is the job of the risk owner named by the organization's governance. That may be the policy owner who set the termination rule or a separate system owner, but approving code does not make the reviewer one: permission to merge is not authority to accept the operational or security consequences of deploying.

Accepting the risk is also different from shipping the change. Engineers still run the deployment; the risk owner decides whether it may proceed and under what conditions.

For routine changes, the risk owner can delegate that acceptance in advance under agreed criteria, so ordinary merges do not wait on a sign-off. The decision goes back to the owner when the residual risk crosses an agreed threshold. A path that can restore a terminated employee's access crosses it.

Possible decisions include requesting more evidence, limiting the rollout, accepting a documented residual risk, or declining the release. A limited rollout might start by comparing intended account changes against current state without applying them, then proceed within a bounded scope after further checks. Such a rollout produces evidence about specific behaviors; it does not prove every property of a fully active deployment.

Whatever the decision, the package should record it with its scope, the risk owner who made it, the safeguards it relies on, and a point for reassessment. Mandatory requirements remain constraints. A favorable summary or a willing reviewer cannot, on its own, authorize bypassing them.

## 8. Deployment produces the next generation of evidence

Return to the opening approval. Its value should come from the reasoning and evidence behind it: the requirements challenged, the executions observed, the failures corrected, and the uncertainty handed to an accountable decision-maker. The reviewer's name says who is responsible for the review; the package makes the basis for that review inspectable.

Deployment starts another round of learning. Watching the automation in production can reveal new delay patterns, retries, manual interventions, and recovery failures. Those observations can become regression tests, challenge the service simulations, and expose assumptions that no longer hold. A lack of alerts means something only within the limits of what monitoring could detect.

The evidence package should therefore stay linked to the deployed versions and to later findings. When production contradicts a tested expectation, investigate both the implementation and the test's model of operations. Update the affected scenarios, reassess the claims that depended on them, and revisit risk decisions where needed.

Evidence-based review does not end at the merge. AI can gather and examine evidence at a scale no human reviewer can match. People still have to judge what that evidence means and decide whether the remaining uncertainty is acceptable for a particular deployment. The package exists to make that uncertainty visible enough for them to decide responsibly.

---

[^1]: National Institute of Standards and Technology, [NIST SP 800-218: Secure Software Development Framework (SSDF), version 1.1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf), February 2022, practices PW.7 and PW.8. The multi-agent workflow, operational-history method, and confidence framing in this essay are proposals, not prescriptions attributed to NIST. All events, rules, records, and outcomes described here are synthetic illustrations, not reports about an employer or a deployed system.
