# Names Memory App MVP Implementation Checklist

## Summary
- [x] Build the MVP as a local-first `Vite + React + TypeScript` PWA.
- [x] Use `React Router` for navigation and `Dexie` with IndexedDB for persistence.
- [x] Ship four core flows: capture, saved/search, review, and edit/delete.
- [x] Keep the MVP local-only with no backend, auth, or sync.
- [x] Treat notifications as best-effort only in the PWA.

## 1. App Foundation
- [x] Create the initial Vite React TypeScript scaffold with working build and test commands.
- [x] Scaffold a Vite React TypeScript app configured as a PWA.
- [x] Add `React Router` routes for `/capture`, `/saved`, `/person/:id`, `/person/:id/edit`, and `/review`.
- [x] Set up a mobile-first layout with bottom navigation pinned to `Capture` and `Saved`.
- [x] Implement the visual system: warm off-white background, charcoal outlines, restrained teal accents, rounded containers, and strong hierarchy.
- [x] Use plain CSS or CSS modules with shared design tokens.

## 2. Data Model and Persistence
- [x] Store all data locally in IndexedDB using a single `people` table.
- [x] Define the core `PersonEntry` shape with `id`, `name`, `memorableThing`, `whereMet`, `anotherDetail`, `createdAt`, `updatedAt`, `reviewStage`, `dueAt`, `lastReviewedAt`, and `learnedAt`.
- [x] Implement review eligibility: a person is reviewable only when `name` exists and at least one detail field is non-empty.
- [x] Implement incomplete state: entries with only a name are saved but marked as needing more details.
- [x] Implement learned state once all review stages are completed.
- [x] Use fixed review intervals in days: `[1, 1, 3, 7, 10, 14]`.
- [x] Compute `dueAt` from the exact clock time of save or the most recent successful review.
- [x] On `Missed it`, reset `reviewStage` to `0` and set the next `dueAt` to one day later at the same clock time as the missed review.
- [x] On meaningful edits to `name` or any detail, reset review progress.
- [x] Preserve review progress for typo-only or formatting-only edits.
- [x] Support hard delete only after explicit confirmation.

## 3. Capture and Saved Flows
- [x] Make `Capture` the default landing route.
- [x] Auto-focus the name field on supported devices.
- [x] Keep `Add more details` collapsed by default.
- [x] Use exactly three fixed detail fields: `Add memorable thing`, `Add where you met`, and `Add another detail`.
- [x] Disable `Save` until the trimmed name input is non-empty.
- [x] On save, persist the entry.
- [x] Detect exact duplicate names by normalized string match and show a non-blocking warning before save.
- [x] After save, show a brief success message.
- [x] After save, clear the form.
- [x] After save, dismiss the keyboard where the platform allows it.
- [x] Add a `Saved` screen search bar that uses simple case-insensitive substring matching across `name`, `memorableThing`, `whereMet`, and `anotherDetail`.
- [x] Show a review summary section with due count and incomplete count.
- [x] Sort the saved list by `createdAt desc`.
- [x] Show `name`, `whereMet` if present, and one memorable field if present in each row.
- [x] Show a passive label for incomplete entries with only a name.

## 4. Review Flow
- [x] Include only eligible entries in review.
- [x] Cap the review queue at 3 entries per day.
- [x] When more than 3 are due, surface the 3 newest due items first by `dueAt desc`, breaking ties with `createdAt desc`.
- [x] Start review prompts with name recall first.
- [x] Show a simple masked prompt and supporting detail.
- [x] Allow the user to reveal the answer on demand.
- [x] Provide exactly two grading actions: `Got it` and `Missed it`.
- [x] On `Got it`, advance to the next review stage.
- [x] On the final successful stage, set `learnedAt` and remove the person from active review.
- [x] On `Missed it`, reveal the answer immediately and reset progress.
- [x] In the `Saved` review module, separate active due reviews from names that need more details before review eligibility.

## 5. Person Detail, Edit, and Delete
- [x] Build a person detail screen that shows all fields, review status, and entry metadata needed to distinguish duplicates, including created date/time.
- [x] Build an edit screen for updating all four fields.
- [x] Add meaningful-change detection that normalizes whitespace and casing before comparison.
- [x] Preserve review state when semantic content is unchanged.
- [x] Reset review state and recompute `dueAt` when semantic content changes meaningfully.
- [x] Put delete on the edit screen.
- [x] Require a confirmation dialog with irreversible wording before deletion.

## 6. Notifications and Reminder Behavior
- [x] Implement best-effort reminders only.
- [x] Register a service worker for PWA installability and notification permission flow.
- [x] Send one reminder notification when a review becomes due, at its `dueAt` timestamp, where web support allows it.
- [x] If the app is open and permission is granted, schedule an in-app notification at `dueAt`.
- [x] If the app is reopened after `dueAt`, immediately surface due state in the UI.
- [x] Do not add backend push, periodic background sync, or exact closed-app delivery guarantees.

## 7. Important Modules
- [x] Create `db/people.ts` for IndexedDB schema, CRUD, and query helpers.
- [x] Create `domain/review.ts` for review schedule calculation, eligibility, reset logic, and due queue selection.
- [x] Create `domain/search.ts` for normalized substring matching across searchable fields.
- [x] Create `domain/meaningfulChange.ts` for distinguishing typo/format edits from memory-cue changes.
- [x] Create route screens for `Capture`, `Saved`, `Review`, `PersonDetail`, and `EditPerson`.
- [x] Create shared UI pieces for bottom nav, search bar, review card, person row, success toast, and confirmation dialog.

## 8. Test Plan
- [x] Add a minimal smoke test so the scaffold has a passing baseline test run.
- [x] Add unit tests for eligibility rules.
- [x] Add unit tests for exact next-day same-time due date computation.
- [x] Add unit tests for `Got it` stage advancement.
- [x] Add unit tests for `Missed it` reset behavior.
- [x] Add unit tests for learned-state transition after the final stage.
- [x] Add unit tests for newest-due-first queue selection with the 3-item cap.
- [x] Add unit tests for search matching across every field.
- [x] Add unit tests for meaningful edit detection versus typo-only edits.
- [x] Add component tests for capture save enabled/disabled states.
- [x] Add component tests for post-save clear and success message.
- [x] Add component tests for duplicate warning display.
- [x] Add component tests for saved list ordering.
- [x] Add component tests for passive incomplete-entry labeling.
- [x] Add component tests for delete confirmation flow.
- [x] Add end-to-end coverage for creating a name-only entry.
- [x] Add end-to-end coverage for creating a reviewable entry.
- [x] Add end-to-end coverage for searching by descriptor instead of name.
- [x] Add end-to-end coverage for completing one review step.
- [x] Add end-to-end coverage for missing a review and confirming reset.
- [x] Add end-to-end coverage for editing without resetting review on typo-only changes.
- [x] Add end-to-end coverage for editing with a meaningful change and confirming reset.

## 9. Experimental Add Name V2
- [x] Add a separate `/add-name-v2` route for testing a second home-screen variant.
- [x] Build a bottom-up, conversation-inspired add-name flow that starts with the name prompt.
- [x] Reveal the three fixed detail prompts only after a name is entered and let the user activate one detail input at a time.
- [x] Reuse the existing save and duplicate-warning behavior in V2.
- [x] Treat `Delete` on V2 as clearing the in-progress draft.
- [x] Add route and interaction tests for the V2 experiment.

## Assumptions and Defaults
- [x] MVP is PWA-first and local-only.
- [x] IndexedDB is the source of truth.
- [x] There is no auth, sync, import/export, or server API in MVP.
- [x] Duplicate detection is exact normalized name matching only.
- [x] Search is simple case-insensitive substring matching with no fuzzy logic.
- [x] Notifications are best-effort and not guaranteed when the app is closed.
