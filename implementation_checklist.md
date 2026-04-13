# Names Memory App MVP Implementation Checklist

## Summary
- [ ] Build the MVP as a local-first `Vite + React + TypeScript` PWA.
- [ ] Use `React Router` for navigation and `Dexie` with IndexedDB for persistence.
- [ ] Ship four core flows: capture, saved/search, review, and edit/delete.
- [ ] Keep the MVP local-only with no backend, auth, or sync.
- [ ] Treat notifications as best-effort only in the PWA.

## 1. App Foundation
- [x] Create the initial Vite React TypeScript scaffold with working build and test commands.
- [ ] Scaffold a Vite React TypeScript app configured as a PWA.
- [ ] Add `React Router` routes for `/capture`, `/saved`, `/person/:id`, `/person/:id/edit`, and `/review`.
- [ ] Set up a mobile-first layout with bottom navigation pinned to `Capture` and `Saved`.
- [ ] Implement the visual system: warm off-white background, charcoal outlines, restrained teal accents, rounded containers, and strong hierarchy.
- [ ] Use plain CSS or CSS modules with shared design tokens.

## 2. Data Model and Persistence
- [ ] Store all data locally in IndexedDB using a single `people` table.
- [ ] Define the core `PersonEntry` shape with `id`, `name`, `memorableThing`, `whereMet`, `anotherDetail`, `createdAt`, `updatedAt`, `reviewStage`, `dueAt`, `lastReviewedAt`, and `learnedAt`.
- [ ] Implement review eligibility: a person is reviewable only when `name` exists and at least one detail field is non-empty.
- [ ] Implement incomplete state: entries with only a name are saved but marked as needing more details.
- [ ] Implement learned state once all review stages are completed.
- [ ] Use fixed review intervals in days: `[1, 1, 3, 7, 10, 14]`.
- [ ] Compute `dueAt` from the exact clock time of save or the most recent successful review.
- [ ] On `Missed it`, reset `reviewStage` to `0` and set the next `dueAt` to one day later at the same clock time as the missed review.
- [ ] On meaningful edits to `name` or any detail, reset review progress.
- [ ] Preserve review progress for typo-only or formatting-only edits.
- [ ] Support hard delete only after explicit confirmation.

## 3. Capture and Saved Flows
- [ ] Make `Capture` the default landing route.
- [ ] Auto-focus the name field on supported devices.
- [ ] Keep `Add more details` collapsed by default.
- [ ] Use exactly three fixed detail fields: `Add memorable thing`, `Add where you met`, and `Add another detail`.
- [ ] Disable `Save` until the trimmed name input is non-empty.
- [ ] On save, persist the entry.
- [ ] Detect exact duplicate names by normalized string match and show a non-blocking warning before save.
- [ ] After save, show a brief success message.
- [ ] After save, clear the form.
- [ ] After save, dismiss the keyboard where the platform allows it.
- [ ] Add a `Saved` screen search bar that uses simple case-insensitive substring matching across `name`, `memorableThing`, `whereMet`, and `anotherDetail`.
- [ ] Show a review summary section with due count and incomplete count.
- [ ] Sort the saved list by `createdAt desc`.
- [ ] Show `name`, `whereMet` if present, and one memorable field if present in each row.
- [ ] Show a passive label for incomplete entries with only a name.

## 4. Review Flow
- [ ] Include only eligible entries in review.
- [ ] Cap the review queue at 3 entries per day.
- [ ] When more than 3 are due, surface the 3 newest due items first by `dueAt desc`, breaking ties with `createdAt desc`.
- [ ] Start review prompts with name recall first.
- [ ] Show a simple masked prompt and supporting detail.
- [ ] Allow the user to reveal the answer on demand.
- [ ] Provide exactly two grading actions: `Got it` and `Missed it`.
- [ ] On `Got it`, advance to the next review stage.
- [ ] On the final successful stage, set `learnedAt` and remove the person from active review.
- [ ] On `Missed it`, reveal the answer immediately and reset progress.
- [ ] In the `Saved` review module, separate active due reviews from names that need more details before review eligibility.

## 5. Person Detail, Edit, and Delete
- [ ] Build a person detail screen that shows all fields, review status, and entry metadata needed to distinguish duplicates, including created date/time.
- [ ] Build an edit screen for updating all four fields.
- [ ] Add meaningful-change detection that normalizes whitespace and casing before comparison.
- [ ] Preserve review state when semantic content is unchanged.
- [ ] Reset review state and recompute `dueAt` when semantic content changes meaningfully.
- [ ] Put delete on the edit screen.
- [ ] Require a confirmation dialog with irreversible wording before deletion.

## 6. Notifications and Reminder Behavior
- [ ] Implement best-effort reminders only.
- [ ] Register a service worker for PWA installability and notification permission flow.
- [ ] Send one reminder notification when a review becomes due, at its `dueAt` timestamp, where web support allows it.
- [ ] If the app is open and permission is granted, schedule an in-app notification at `dueAt`.
- [ ] If the app is reopened after `dueAt`, immediately surface due state in the UI.
- [ ] Do not add backend push, periodic background sync, or exact closed-app delivery guarantees.

## 7. Important Modules
- [ ] Create `db/people.ts` for IndexedDB schema, CRUD, and query helpers.
- [ ] Create `domain/review.ts` for review schedule calculation, eligibility, reset logic, and due queue selection.
- [ ] Create `domain/search.ts` for normalized substring matching across searchable fields.
- [ ] Create `domain/meaningfulChange.ts` for distinguishing typo/format edits from memory-cue changes.
- [ ] Create route screens for `Capture`, `Saved`, `Review`, `PersonDetail`, and `EditPerson`.
- [ ] Create shared UI pieces for bottom nav, search bar, review card, person row, success toast, and confirmation dialog.

## 8. Test Plan
- [x] Add a minimal smoke test so the scaffold has a passing baseline test run.
- [ ] Add unit tests for eligibility rules.
- [ ] Add unit tests for exact next-day same-time due date computation.
- [ ] Add unit tests for `Got it` stage advancement.
- [ ] Add unit tests for `Missed it` reset behavior.
- [ ] Add unit tests for learned-state transition after the final stage.
- [ ] Add unit tests for newest-due-first queue selection with the 3-item cap.
- [ ] Add unit tests for search matching across every field.
- [ ] Add unit tests for meaningful edit detection versus typo-only edits.
- [ ] Add component tests for capture save enabled/disabled states.
- [ ] Add component tests for post-save clear and success message.
- [ ] Add component tests for duplicate warning display.
- [ ] Add component tests for saved list ordering.
- [ ] Add component tests for passive incomplete-entry labeling.
- [ ] Add component tests for delete confirmation flow.
- [ ] Add end-to-end coverage for creating a name-only entry.
- [ ] Add end-to-end coverage for creating a reviewable entry.
- [ ] Add end-to-end coverage for searching by descriptor instead of name.
- [ ] Add end-to-end coverage for completing one review step.
- [ ] Add end-to-end coverage for missing a review and confirming reset.
- [ ] Add end-to-end coverage for editing without resetting review on typo-only changes.
- [ ] Add end-to-end coverage for editing with a meaningful change and confirming reset.

## Assumptions and Defaults
- [ ] MVP is PWA-first and local-only.
- [ ] IndexedDB is the source of truth.
- [ ] There is no auth, sync, import/export, or server API in MVP.
- [ ] Duplicate detection is exact normalized name matching only.
- [ ] Search is simple case-insensitive substring matching with no fuzzy logic.
- [ ] Notifications are best-effort and not guaranteed when the app is closed.
