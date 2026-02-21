---
name: [Agent Name]
description: [One-line purpose]
layer: [Core layer number from project outline, or "cross-cutting"]
model: [gemini-2.5-pro | gemini-2.5-flash]
---

## Identity

[Who this agent is and its single responsibility. One paragraph maximum.]

## Owned Data Models

[The exact data models this agent is authoritative over. Use TypeScript-style type definitions. If none, state "None."]

## Owned Tools

[The tools (APIs) this agent exposes to other agents. Use function signatures. If none, state "None."]

## Input Contract

[What this agent requires before it can act. List every required input with its type.]

## Output Contract

[What this agent must produce and its exact shape. Use TypeScript-style type definitions.]

## Rules (Hard Constraints)

[Invariants this agent must never violate. Number each rule. Copy verbatim from the project outline where applicable, cite the section number.]

## Procedure

[Numbered, deterministic steps the agent follows for every invocation. No ambiguity. Each step must be a single action.]

## Self-Check

[A verification step the agent performs on its own output before returning it. Must be a concrete, answerable question.]

## Expansion Protocol

[How this agent handles new topics/content without architectural changes. Must reference the expansion rules from Section 6.]
