# Capability Sandbox

## Current State
New project. Only scaffold files exist (empty actor, generated bindings).

## Requested Changes (Diff)

### Add
- Backend: 7 public Motoko methods covering query and update patterns
  - `greet(name: Text) : async Text` (query)
  - `add(a: Nat, b: Nat) : async Nat` (query)
  - `increment() : async Nat` (update, persistent counter)
  - `getCount() : async Nat` (query)
  - `echo(message: Text) : async Text` (query)
  - `addNote(title: Text, body: Text) : async Nat` (update, persistent note store, returns note ID)
  - `getNotes() : async [{ id: Nat; title: Text; body: Text }]` (query)
- Frontend: Single-page read-only API reference UI
  - Header: app canister ID displayed in monospace code block with one-click copy button
  - Capabilities section: one card per method showing method name (code), query/update badge, plain-English description, input schema, output schema
  - No login, no interactivity beyond the copy button

### Modify
- None

### Remove
- None

## Implementation Plan
1. Generate Motoko backend with all 7 methods; use stable var for counter and stable array/buffer for notes.
2. Frontend reads canister ID at runtime from frontend bindings (`canisterId` export or equivalent).
3. Render capability cards from a static data structure in the frontend (no backend calls needed for the card content).
4. Copy button uses `navigator.clipboard.writeText`.
5. Style: minimal, monospace-accented developer documentation aesthetic.
