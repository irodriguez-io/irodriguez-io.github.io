---
title: "Before You Trust the Number"
date: 2026-09-19
slug: audit-your-own-numbers-access-review
topic: iam
lang: en
description: "A dashboard told me a security control was failing. The mistake was in my measurement. What that taught me about checking the numbers people act on."
translation: "/blog-es/2026/09/audit-your-own-numbers-access-review/"
image: /img/blog-hero/pixabay-1051697.jpg
---

A dashboard I built once showed a security control failing on about ten percent of events. People were watching that number. A plan was forming to fix the problem, and I was getting ready to investigate why the control was letting things through.

The control was working one hundred percent of the time.

The mistake was in the way I had taught the dashboard to classify certain events. At the edge of the rules, my logic disagreed with itself. I had built a measurement that made a working control look broken, and the result was convincing enough for people to start acting on it.

I think about that whenever I am about to send someone a security finding.

Much of my work involves checking who can access a company's systems and whether they still need that access. In the industry, we call this an access review. The questions are fairly ordinary: Does someone who left the company still have an account? Can a contractor open an application they no longer work with? Who is responsible for a shared account?

Answering them means gathering information from different systems. One tells you which accounts exist. Another tells you which applications those accounts can open. A third tells you when someone signed in. Put the records together, count the exceptions, and you have a report.

The trouble is that those systems do not necessarily tell the same story. They may cover different people, use different names, or describe different moments in time. The code that combines their records can make mistakes too. By the time the result reaches a meeting, all of that uncertainty may have disappeared behind a very definite number.

I have made enough of these mistakes to know how easily that happens.

A result of zero, for example, is reassuring. No unexpected accounts. No suspicious activity. Nothing to investigate. It is also a result people have little reason to question.

But an empty report can mean that the search failed. Some systems respond to a search they cannot understand by returning no records, without explaining that anything went wrong. You can also look in the wrong part of a record. A log may distinguish between a person doing something and a person whose account someone else changed. Search only the second category and you might find account updates while missing every sign-in.

Before I trust an empty result, I now try the same kind of search on an account I know has been busy. If that comes back empty too, I have a reason to investigate the search before drawing conclusions about the account.

I learned a similar lesson while checking several thousand accounts for application access that might have been missed. I found none. For about an hour, that looked like good news.

Then I noticed an application with thousands of recorded sign-ins. According to the other source I was using, nobody had access to it at all.

People were clearly getting in. The source simply was not returning the information I needed. My report looked complete because nothing in the response told me what was missing.

That experience made me more careful about the word "unused" too. Companies often have a central sign-in service, the familiar page employees pass through to open their work applications. Its records are useful, but they only show the activity that passes through it. Someone using an account created directly in an application, a shared password, or a separate connection for software may never appear there.

If I have only checked the central service, I can say I saw no sign-ins there. Calling the application unused goes further than the evidence allows. Before recommending that access be removed, I need to check the application's own records as well.

There is another question hidden inside a quiet account: could its owner have signed in at all? An account that has been suspended, deactivated, or never activated needs to be understood differently from a working account that someone has stopped using. Combining them produces a bigger number, but gives the person receiving the report less idea what to do.

Even a field labeled "last login" deserves a check. I have encountered timestamps that changed when an account was suspended or reactivated, without anyone signing in. A familiar label can make a piece of data seem more straightforward than it is.

Some of the most convincing false alarms come from comparing two lists that were never quite comparable.

Suppose one list contains everyone who currently has access to an application, while another contains everyone who used it during an earlier period. Someone whose access was removed after that period will appear in the usage list but not the current access list. That can look like a person getting into a system without permission. The timing may explain it entirely.

The same problem occurs when the lists include different kinds of accounts. If one covers only active accounts and the other includes a broader population, the mismatch can look like a security gap. Before investigating the difference, I need to establish who each list includes and when it was collected.

That does not mean I should limit every review to active accounts. Doing so can hide something worth finding.

When I once expanded a review beyond active accounts to include everything that had not been deleted, dozens of additional applications appeared. Their access permissions were held entirely by accounts that could no longer sign in. Those permissions had disappeared from my earlier report because I had excluded the accounts holding them.

A suspended contractor with forty application permissions is still something I want to understand. Their inability to sign in today does not answer whether those permissions should remain attached to the account.

Names introduce their own confusion. Someone changes their email address, and older records keep the previous one. Count by email address and the same person can appear twice. The old address looks abandoned, perhaps like an account that should be closed, while the person continues working under the new address. This is why the permanent account identifier matters, even if the email address is what makes the report readable.

Then there are the labels used to decide who belongs in a review in the first place.

A company might want a particular rule to cover its outsourced workforce. That sounds simple until you ask how the system recognizes those people. It may rely on a field supplied by the HR system, a job title, or membership in a group whose own membership comes from several other groups. The description of the group may explain what it was intended to do. The actual rules explain whom it includes.

In one comparison, I found a coded field maintained by an HR feed that was filled in for nearly everyone and used a controlled set of values. The job title field for the same people contained dozens of values, including six spellings of one role. Rules based on job titles were already in use and quietly missing people.

The more readable field was harder to rely on.

Missing information can be misleading as well. If outsourced workers do not come through the HR system, looking for active accounts without an employee ID might find most of them. It might also find temporary accounts, test accounts, and other people the HR system does not know about. A useful clue can become a poor rule when it is treated as a complete definition.

And fixing a missing value in the directory may not fix the problem. If that value comes from another system, the next automatic update can overwrite the correction. The report looks better for a while, then the account drops out again. The repair has to happen where the information originates.

These details can sound remote from the people reading a report, but they affect very ordinary decisions. A group membership count may include old, deactivated accounts, so using it as a headcount or license estimate can overstate what is needed. A naming rule meant to exclude machine accounts can accidentally exclude real people. I have seen one such rule drop two people because a prefix originally used for non-interactive accounts had later been reused for a category of human accounts.

The total still looked plausible. Reading the names that had been excluded was what exposed the mistake.

That is also why I pay attention to the small group usually labeled "unknown" at the bottom of a report. It is tempting to leave it there, especially when most of the population has been accounted for. But those accounts need decisions too.

Looking through one such group, I found a shared functional account with no manager and a test account that had been suspended months earlier. Both sat inside a production population and retained its access permissions. In the summary, they had been reduced to a single line labeled "unknown".

Once I looked at them individually, there was work someone could actually own. Some accounts needed to be classified. Others needed an access decision. The count alone did not tell anyone which was which.

I now try to keep the records behind a number alongside the number itself. If someone asks which accounts make up a finding, I want to answer from the same set of data that produced it.

Recreating that list later is less reliable than it sounds. Once, a five-day-old export gave me forty-five candidates for a bucket that had contained forty accounts. I could not tell which five had left. I still had a total, but I could no longer explain exactly who was behind it.

The arithmetic needs checking too. If a person belongs to two groups, adding the group totals counts that person twice. A sensible-looking total can survive several rounds of reporting before anyone notices. I compare it with a separate count of the people themselves and check the underlying inventory one item at a time. Differences are easier to find there than in a paragraph about a whole category of applications.

All of this takes time. So does asking people to investigate a problem that exists only in your report.

A false alarm spends the trust of the people who have to act on it. Dismissing a real gap as a reporting mistake can do more harm. I have to leave room for both possibilities and gather enough evidence to tell them apart.

Before a finding leaves my hands now, I ask what else could explain it. Were the lists collected at different times? Did I count the same person twice? Did the source leave something out? Is the rule selecting the people I think it is?

Then I report what I can support, including what I could not verify. I still remember how certain that ten percent looked on my dashboard, and how close we came to building a remediation plan around my mistake.
