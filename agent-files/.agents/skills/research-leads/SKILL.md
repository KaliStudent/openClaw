---
name: research-leads
description: Build a one-glance profile of any new signup or contact — their role, company, ICP fit (good / maybe / poor), and a tailored outreach angle. No manual tab-hopping.
---

# Lead Research

A new signup just landed. Instead of opening five browser tabs and piecing
together who they are, this skill hands you a one-glance profile: who the person
is, what their company does, whether they fit your ideal customer, and the
sharpest way to reach out. The outcome is a decision in seconds — engage now,
engage later, or skip — not a manual research chore.

**Talking to the user:** keep it short and conclusive. Lead with the verdict
(good / maybe / poor fit) and the angle, then the supporting facts. They want to
know what to *do* about this signup, not read a dossier.

## The One Rule That Matters Most: Confirmed, Never Guessed

Every claim in a profile must trace to something you actually found — a company
page, a LinkedIn profile, a press mention, a CRM record. If you didn't find it,
you don't state it. This matters more than any other instruction here, so it
comes first.

Here's why it's not negotiable. The user *acts* on this profile — they'll open
with the role you named, reference the company you listed, pitch the use case you
guessed. A fabricated detail doesn't just sit quietly in a card; it walks into a
real conversation and embarrasses them. Worse, one confident-but-wrong profile
teaches the user they can't trust *any* of your profiles, and the whole skill
becomes useless. The math is lopsided: a blank field costs them nothing (they
just go look themselves), while a wrong field costs them a botched outreach and
their confidence in you. So when forced to choose, leave it blank.

This cuts hardest on the **person's identity**. It is tempting to read
`jsmith@gmail.com` and decide you're looking at a "John Smith, probably a
developer." Don't. A name-shaped email local part, a generic free-mail address,
or a common name with no other signal tells you almost nothing about who this
human actually is. Treat those as *places to start searching*, never as facts.
If you can't confirm the person from a real source, the honest and correct
output is **"Person: not identified"** — not a plausible character you invented
to fill the row.

## Method

1. **Read the signal — as search leads, not conclusions.** Start with whatever
   you were given: email, domain, name, or a CRM record. Split an email: the
   domain is the strong anchor (a work domain like `@acme.io` often names the
   company even when the person is unknown), and the local part is at most a
   *hint to search on* — never an identity you assert. Note right away whether
   it's a work domain or a free provider (gmail, outlook, icloud, proton, etc.),
   because a free provider usually means the person and their company can't be
   resolved from the address at all, and you should set expectations
   accordingly.

2. **Confirm the company, then the person — citing each find.** Look up the
   company first; it's easier and grounds everything else: what they do in one
   line, rough size, industry, funding stage only if it bears on fit. Then the
   person: role, seniority, team. Pull from the company site, LinkedIn, press,
   and any connected CRM/email history, and attach a source to every non-obvious
   claim. Hold every statement to one test: *did I actually find this, or am I
   filling a gap?* Anything you can't tie to a source doesn't go in as fact. If
   the company is real but the specific person can't be verified, that's a
   normal, useful result — return a **company-level profile** and mark the person
   as not identified, rather than manufacturing a role to complete the picture.

3. **Assess fit and pick an angle — from what you confirmed.** This is the point
   of the exercise, so don't stop at facts: state the likely use case, rate ICP
   fit as **good / maybe / poor** with a one-line reason, and propose a concrete
   outreach angle. Base it only on what you actually established. When the person
   is unidentified, it's fine to give a company-level fit and a company-level
   angle — just say that's what it is, so the user doesn't open a 1:1 message as
   if they know the recipient.

## Inference vs. fabrication — where the line is

A little reasoning from solid evidence is useful; inventing from nothing is not.
The difference is whether a real, cited fact backs the leap:

- **OK (mark it as inference):** "Their careers page lists 40+ open roles and a
  Series B last year, so likely 150–250 people" — grounded in cited signals, and
  flagged as an estimate.
- **OK:** "Title on LinkedIn reads 'Growth,' so probably owns acquisition" —
  reasoning from a confirmed title.
- **Not OK:** guessing the person's name, role, or seniority from the email
  address alone.
- **Not OK:** naming or describing a company you never actually found, or
  attaching a headcount/industry to a domain you couldn't verify.

When you do infer, label it plainly ("likely…", "estimate", "inferred from X")
and keep the source attached. An unlabeled inference reads as a confirmed fact,
which is the very thing that erodes trust.

## Output Format

A compact profile card:

```
Person:          Name — role, seniority [source]   (or: not identified)
Company:         Name — one-line description [source]
Size & industry: ~headcount, sector [source]
Likely use case: how they'd probably use the product
Fit:             good / maybe / poor — one-line reason
Suggested angle: the specific hook to open with
```

Bold the Fit verdict. For any field you couldn't confirm, write "unknown" (or
"not identified" for the person) rather than padding it — gaps are information.
If the person is unidentified, label the card **company-level** so its scope is
unmistakable.

## Tooling

Web search and fetch are the default engine. If a CRM or email account is
connected, check it first: prior touchpoints, deal stage, or notes change the
angle entirely and save the user from re-researching a known contact. When the
web and connected tools turn up little (common with free-email signups), return
an honest "limited info" profile that states the domain type, what you confirmed,
and what you couldn't — don't stretch thin signals into firm claims.

## Iterating

- **Batch a list.** Given several signups, profile each one and surface only the
  good-fit leads up top so the user can triage fast.
- **Go deeper on the company.** Offer competitors, recent news, tech stack, or a
  fuller org map when a lead looks worth real effort.
- **Filter, don't dump.** When asked, return only good-fit signups and skip the
  rest — the value is in the shortlist, not the volume.

## Recurring Use

Offer to make this automatic: profile each new signup as it arrives, or compile
a once-a-day digest of everyone who signed up, sorted by fit. A daily batch with
the good-fit leads flagged turns this from a tool you remember to use into a feed
that lands on its own.

## Examples

**"Who just signed up — priya@notion.so?"**
> Resolve the domain (Notion, work email), confirm the company and the person's
> role from a real source, rate fit, and return the card with a Notion-specific
> angle and source links.

**"Who's this — jsmith2284@gmail.com just signed up?"**
> Free-mail address, no company signal, generic name. Don't invent a person.
> Return: Person — not identified (free-mail address, no public footprint found);
> note what was checked and turned up nothing; suggest the user ask one
> qualifying question or wait for more signal. An honest "couldn't identify them"
> is the right answer here, not a fabricated persona.

**"Look up the company behind @flux-robotics.com."**
> Lead with the domain even though no person was named: identify Flux Robotics,
> its size, industry, and funding if relevant, then a one-line use-case guess and
> the strongest outreach hook — labeled company-level since the contact is still
> unknown.