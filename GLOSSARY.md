# GDE Additional Category Builder

A plugin and MCP server to evaluate, prepare, and draft Additional Category applications for Google Developer Experts (GDE) based on Advocu activity data.

## Categories & Specializations

**Category**:
A primary Google Developer Experts product track or domain area (e.g., Web Technologies, AI/ML, Cloud, Android).
_Avoid_: Track, vertical, domain

**Sub-category**:
A recognized technology specialization within a primary Category.
- **Web Technologies**: AI for Web Developers, Browser Extensions, CSS and UI, DevTools and Browser Automation, Progressive Web Apps and Project Fugu, Web Identity, Web Performance.
- **AI**: AI - JAX, AI - Keras, AI - PyTorch on XLA/TPU, AI - TPU, AI - vLLM.
_Avoid_: Sub-track, tag, topic

## Application & Evaluation

**Additional Category Application**:
The formal dossier and evaluation package submitted by an existing GDE to request an additional specialization badge.
_Avoid_: Upgrade, promotion request, secondary application

**Cooling-off Period**:
The mandatory waiting period imposed after an unsuccessful application before a candidate is eligible to reapply.
_Avoid_: Ban, lock, penalty phase, 6-month rule

**Empirical Cadence**:
The sustained distribution, recency, and multi-year consistency of qualifying contributions across trailing 12-month periods, evaluated holistically rather than by fixed numerical quotas.
_Avoid_: Frequency score, activity quota, minimum count, number of talks

**Qualifying Activity**:
An Activity logged in Advocu that demonstrates substantial technical expertise, community impact, and recency in the target Category or Sub-category.
_Avoid_: Eligible post, valid talk

**Activity Profile**:
An empirical summary of a candidate's logged Advocu activities within a target Category/Sub-category, evaluating volume, recency, distribution, and language.
_Avoid_: Score, points, official threshold

**High-Density Community Meetup**:
A community-organized meetup with substantial verified reach (e.g., 100+ attendees in high-density tech hubs like China, India, and Indonesia) that carries evaluative weight comparable to regional conferences.
_Avoid_: Casual meetup, local gathering, small talk

**Peer Review & Googler Endorsement**:
The pre-submission workflow where a candidate shares their draft Evidence Dossier with active GDE peers and Googlers to solicit qualitative feedback, identify gaps, and secure endorsements before reaching out to Regional Leads.
_Avoid_: Internal lobbying, informal chat, approval sign-off

**Evidence Dossier**:
A structured, evidence-backed narrative summarizing the candidate's top qualifying contributions, reach metrics, and technical expertise for human review.
_Avoid_: Application form, score card

**Communication Proficiency**:
The ability to engage effectively in English for formal GDE evaluation interviews and confidential program-wide meetings, alongside delivering technical content (talks, articles, videos, workshops) which may be conducted in localized languages.
_Avoid_: English-only requirement, language score, soft skills

## Architecture & Protocols

**MCP Resource**:
A read-only static documentation or data artifact exposed by the server under a structured URI scheme (`gde-docs://{slug}`) for host application discovery and context attachment via standard `resources/list` and `resources/read` protocols.
_Avoid_: Static endpoint, doc route, web page

**MCP Tool**:
An executable function with a Zod-validated parameter schema registered with the server for autonomous invocation by AI agents during evaluation workflows via `tools/call`.
_Avoid_: Plugin command, API route, agent hook
