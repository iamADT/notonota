# Product Requirements Document

## Product name
Working name: Names Memory App

## Overview
Names Memory App helps users remember people’s names by making capture instant and review lightweight. The product is built for the moment right after meeting someone, when the name is still fresh but easy to lose. The app also helps users recover a person later by searching not only by name, but also by memorable details.

The core product loop is simple:
1. Capture a name quickly
2. Add one or more memorable details
3. Review a small number of names using spaced repetition
4. Search later by name or detail when recall is incomplete

## Product goal
Help users reliably remember a person’s name and one memorable thing about them.

## MVP goal
Create a fast mobile experience that lets users:
- save a person’s name in seconds
- optionally add memorable details
- review eligible names on a simple spaced repetition schedule
- search saved people by name or details
- edit saved entries later

## Primary user problem
Users often meet someone, hear their name, and forget it shortly afterwards. Existing contact tools are too slow, too formal, or too broad for this specific job. Users need a lightweight tool built specifically for name recall.

## Core user jobs
### Capture
When I meet someone, I want to save their name immediately before I forget it.

### Reinforce
After saving them, I want help remembering their name and one memorable thing about them.

### Recover
When I half remember someone, I want to search by a descriptor, place, or memorable detail and find the right person.

### Correct
When I remember a better detail later or spot a typo, I want to edit the saved entry easily.

## Design principles
- Capture must feel instant
- Name is mandatory, everything else is optional
- The app should teach better memory habits without feeling like homework
- Search must work even when the user does not remember the name
- Review should be lightweight and capped
- Language should stay simple and human

## Information architecture
### Primary navigation
Two-tab navigation:
- Saved
- Capture

### Navigation recommendation
Use a bottom navigation bar for the MVP.

Reasoning:
- Capture is the default landing screen
- Bottom nav is easier to reach one-handed on mobile
- The keyboard opening on launch does not break this pattern because the user is already on Capture
- Switching to Saved is a secondary action that usually happens after capture or later in the day

Note: when the keyboard is open, the bottom nav may be partially obscured depending on platform behaviour. This is acceptable for MVP because the user is in active capture mode. If needed later, nav visibility can be refined per platform.

## App launch behaviour
When the user opens the app:
- the app opens on Capture
- the Name input field is auto-focused
- the mobile keyboard opens immediately
- the Save button is visible but disabled until text is entered
- Add more details is collapsed by default

## MVP screens

## 1. Capture screen
### Purpose
Allow the user to save a person’s name as quickly as possible.

### Layout
- Large Name input field
- Collapsed accordion labelled Add more details
- Save button
- Bottom navigation

### Behaviour
- Name is required
- The keyboard appears immediately on launch
- Save is disabled until the user types at least one character
- Add more details remains optional

### Accordion fields
Use simple, conversational labels:
- Add memorable thing
- Add where you met
- Add another detail

### Save behaviour
When the user taps Save:
- the entry is created
- if at least one detail is present, the person becomes eligible for review
- if no details are present, the person is saved but marked as not yet reviewable

### Post-save system state
The product should keep capture fast. For MVP, saving should not force the user into a long follow-up flow.

Optional future enhancement:
- show a gentle prompt encouraging one memorable detail for stronger recall

## 2. Saved screen
### Purpose
Give users a place to review due names, search saved people, and manage entries.

### Layout order
1. Search bar
2. Review section
3. Saved people list

### Search bar
Search should match across:
- Name
- Add memorable thing
- Add where you met
- Add another detail

### Search use cases
Users should be able to find a person by searching for:
- a name
- a place
- a descriptor
- a role or topic
- any saved memorable detail

Example:
A user searching for “fintech” or “round glasses” should be able to find the correct person even if they do not remember the name.

### Review section
Display at the top of Saved:
- names due for review today
- saved names that need at least one detail before they can enter review

Example labels:
- Review 3 names
- 2 names need more details

### Saved people list
Each row should show:
- Name
- Where you met, if available
- One memorable thing, if available

Each row is tappable and opens the person detail screen.

## 3. Person detail screen
### Purpose
Let the user view a saved person and edit their details.

### Content
- Name
- Add memorable thing
- Add where you met
- Add another detail
- Review status, if applicable
- Edit action

## 4. Edit screen
### Purpose
Allow the user to correct and improve saved entries.

### Editable fields
- Name
- Add memorable thing
- Add where you met
- Add another detail

### Behaviour
- User can save changes at any time
- If review-relevant details change, the review schedule resets to the beginning

Rationale:
If the memory target changes, the spaced repetition schedule should restart.

## Review system

## Review eligibility
A person enters the review queue only if they have:
- a Name
- at least one additional detail

If an entry has only a Name:
- it is saved
- it is not added to the review queue
- it is surfaced in Saved using conversational wording that prompts the user to add more details

## What the review is trying to reinforce
The user should remember:
- the person’s name
- one memorable thing about them

## Review cadence
For MVP, use a fixed schedule:
- 1 day after save
- 1 day later
- 3 days later
- 7 days later
- 10 days later
- 14 days later

If the final review is passed, mark the person as learned and remove them from active review.

## Daily review cap
Cap review sessions at 3 names per day.

Rationale:
The app should feel quick and sustainable, not like homework.

## Review interaction
For MVP, use lightweight active recall rather than requiring full text input.

### Suggested review flow
- Show a prompt that tests recall of the name or memorable detail
- User thinks of the answer mentally
- User reveals answer
- User marks Got it or Missed it

### Prompt style
The review should begin by focusing on the name.

Possible examples:
- Partial name shown with some letters hidden
- Full memorable detail shown as support
- Later reviews can hide part of a memorable detail instead

Examples:
- M _ y a
- Works in _ _ _ _ _ _ _

For MVP, prompt variation should remain simple and structured.

## Review grading
Two options only:
- Got it
- Missed it

## Review result logic
### If user taps Missed it
- reveal answer immediately
- reset the review schedule to the first interval

### If user taps Got it
- move the card to the next interval in the schedule

## Functional requirements

## Capture
- App opens on Capture by default
- Name field auto-focuses on launch
- Mobile keyboard opens immediately
- Save button remains disabled until the user enters text
- Add more details is collapsed by default
- User can save with Name only
- User can save with Name plus optional details

## Saved
- Search bar appears at the top
- Search matches all saved fields
- Saved screen displays review summary
- Saved screen displays names needing more details
- Saved list displays key summary information

## Review
- Only eligible entries enter review
- Review session is capped at 3 names
- Review uses fixed intervals
- Review supports Got it and Missed it grading
- Missing a review resets progress
- Passing a review advances to the next stage

## Edit
- Users can edit any saved entry
- Editing review-relevant content resets review progress

## Non-functional requirements
- Capture flow should feel immediate and low friction
- Primary actions should be usable one-handed on mobile
- UI language should stay simple and self-explanatory
- Search results should appear quickly enough to support last-minute recall

## Visual language
### Design direction
The product should feel bold, human, memorable, and simple. The visual language should borrow the confidence of hand-drawn, outlined design systems without becoming chaotic or overly decorative.

The product should not feel like a polished corporate productivity tool. It should feel warm, slightly playful, and immediately recognisable, while still being fast and easy to use under real-world social pressure.

### Core visual principles
- Bold, simple, hand-drawn-inspired shapes
- Strong hierarchy through scale, not clutter
- Monochromatic base palette with restrained accent use
- Thick outlines and rounded forms
- Minimal decoration in task-heavy screens
- Personality in headings and containers, clarity in body text

### Overall style
Use a monochromatic interface with black or near-black outlines, soft neutral backgrounds, and a teal accent used sparingly.

The product should feel:
- playful but controlled
- distinctive but usable
- informal but not messy
- memorable without being exhausting

### Colour system
#### Base palette
- Warm off-white or soft cream background
- Black or charcoal outlines and primary text
- Greys or tonal neutrals for secondary surfaces and separation

#### Accent colour
Use teal as the primary accent colour, but only sporadically.

Teal should be used for:
- selected states
- small emphasis moments
- key interactive highlights
- occasional supportive illustrations or icons

Teal should not be used for:
- large floods of colour across the whole screen
- every button and every component
- decorative overload

The visual goal is for teal to feel intentional and memorable, not constant.

### Shape language
- Use pill-shaped and rounded rectangular containers
- Use thick outlines to define important interactive elements
- Large primary actions should have simple, chunky silhouettes
- Avoid sharp corners unless needed for contrast

Examples:
- the main Name input should feel oversized and highly legible
- the Save button should feel bold and obvious
- review cards should feel like simple flashcard blocks

### Line style
- Use a confident, slightly hand-drawn-feeling outline style
- Keep line weight consistent across major components
- Avoid overly sketchy or jittery execution that harms readability

The interface can reference hand-made energy, but it should still feel intentional and production-ready.

### Typography
#### Heading style
Use a display style with character for large headings, tab labels, and key moments.

This should feel:
- bold
- playful
- slightly imperfect
- highly legible

#### Body style
Use a clean, simple sans-serif for:
- form labels
- body copy
- helper text
- list items
- buttons when readability matters most

Rule:
Use expressive typography for emphasis and brand personality, but use straightforward typography for comprehension.

### Layout principles
- Prioritise strong vertical flow
- Keep primary actions visually dominant
- Use generous spacing to reduce pressure
- Avoid busy compositions on core utility screens
- Let scale create hierarchy instead of relying on many colours or decorative elements

The app should feel easy to scan in a hurry.

### Screen-specific guidance
#### Capture
- The Name input should dominate the screen
- Auto-focused input should feel immediate and inviting
- Add more details should feel secondary and optional
- Save should be visually strong but not oversized enough to compete with the Name field
- Minimal decorative elements

#### Saved
- Search bar should be prominent and easy to reach
- Review module should feel clearly separated from the saved list
- List rows should be clean, bold, and easy to scan
- Use subtle tonal separation rather than many colours

#### Review
- Review prompts should be visually simple and high contrast
- Focus attention on the recall task
- Use teal only for selective emphasis, not full-card fills
- Keep grading actions obvious and easy to tap

### Iconography and illustration
- Use simple, bold, characterful icons
- Small moments of illustration are fine, but they should not interrupt the task flow
- Decorative visual elements should be sparse, especially on Capture and Review

If illustration is used, it should support brand identity rather than dominate usability.

### Motion and interaction feel
- Motion should be quick, light, and reassuring
- Expanding Add more details should feel smooth and low-friction
- Review reveal states should feel immediate
- Avoid overly bouncy or novelty-heavy animation

### Accessibility and usability guardrails
- Maintain high contrast between text, outlines, and backgrounds
- Do not rely on accent colour alone to signal state
- Ensure playful styling never reduces legibility
- Keep all key actions large enough for comfortable mobile use

### Visual summary
The visual language for the MVP should be:
- monochromatic at its core
- outlined and rounded
- bold but restrained
- playful but clear
- human, memorable, and fast to use
- accented with teal in small, deliberate moments

## Design principles page
### 1. Background tone
Use a warm off-white or soft cream as the default background across the product.

Reasoning:
- it keeps the interface softer and more human than pure white
- it supports the hand-drawn-inspired visual language
- it gives black outlines and teal accents more presence

Rule:
Pure white should be avoided as the dominant background unless needed for contrast in a specific component.

### 2. Outline style and weight
Use a bold outline style throughout the product.

Guidance:
- primary components should use a visibly thick outline
- outline weight should stay consistent across inputs, buttons, cards, and containers
- outlines should feel confident and clean, not messy or shaky

Rule:
The outline system should create recognition and structure. It should not become decorative noise.

### 3. Corner radius and shape rules
The interface should use rounded rectangles and pill shapes as the default container language.

Guidance:
- primary fields and buttons should feel soft and chunky
- large hero elements can lean more pill-shaped
- list items and cards can use rounded rectangles for easier stacking

Rule:
Avoid mixing too many container styles. The product should feel visually unified.

### 4. Heading font direction
Use a high-character display font for large headings and branded moments.

It should feel:
- playful
- bold
- slightly irregular
- highly legible

Use cases:
- screen titles
- section labels
- major review prompts
- branded empty states or illustration moments

Rule:
The heading font should provide personality without making the interface harder to read.

### 5. Body font direction
Use a clean sans-serif for all functional UI text.

Use cases:
- form labels
- search input
- list rows
- helper text
- buttons where clarity matters most
- review actions

Preferred characteristics:
- highly legible on small mobile screens
- neutral enough to balance the expressive heading style
- simple enough to keep the interface feeling fast

Rule:
Do not use the expressive display font for dense or functional text.

### 6. Type hierarchy
Use a very clear hierarchy built around scale and weight.

Suggested pattern:
- expressive large heading for screen identity
- straightforward subheading or helper text beneath when needed
- bold list titles and card labels
- simple body text for supporting detail

Rule:
Hierarchy should come from size, spacing, and weight before colour.

### 7. Input field rules
Inputs should feel oversized, obvious, and easy to use.

For the Name input:
- make it the most visually dominant element on the Capture screen
- use a thick outline and large rounded container
- keep internal padding generous
- ensure the typed text is large and easy to scan quickly

For secondary inputs inside Add more details:
- use the same shape language
- reduce visual prominence slightly compared to the Name field
- keep labels conversational and action-oriented

Rule:
The Name input is the star of the interface and should always look like the primary action.

### 8. Button rules
Buttons should feel simple, bold, and dependable.

Guidance:
- primary buttons should have strong outlines and generous tap area
- button text should be highly legible and concise
- avoid overly decorative treatments on core actions
- teal can be used sparingly for selected or highlighted button states

Rule:
Primary buttons should stand out through shape and placement first, accent colour second.

### 9. Search bar rules
The search bar on Saved should be prominent and immediately understandable.

Guidance:
- place it at the top of the Saved screen
- use the same outlined rounded shape language as other major components
- keep the placeholder simple: Search names or details
- allow search results to surface based on any saved field

Rule:
Search is a core recovery tool, not a secondary utility. It should feel first-class.

### 10. Card and list rules
Saved people and review modules should use clean, structured cards.

Guidance:
- each row should clearly prioritise the person’s name
- secondary information should be visible but not crowded
- use spacing and tonal contrast to separate sections
- avoid dense, data-heavy list layouts

Rule:
List rows should help recognition at a glance.

### 11. Accent usage rules
Teal is the accent, not the base language.

Use teal for:
- focus states
- selected states
- subtle highlights
- occasional icons or supportive illustrations
- light emphasis in review or success moments

Do not use teal for:
- full-screen backgrounds
- every interactive element
- multiple competing states at once

Rule:
If everything is accented, nothing feels important.

### 12. Illustration and decoration rules
Illustration should support brand personality, not interrupt speed.

Guidance:
- use sparse decorative moments
- keep drawings simple and bold
- avoid crowding task-heavy screens
- place illustrations in empty states, onboarding, or supportive areas rather than around critical actions

Rule:
The product should always feel usable before it feels expressive.

### 13. Motion rules
Motion should reinforce clarity.

Guidance:
- keep transitions short and smooth
- use subtle motion when expanding Add more details
- make answer reveal in review feel immediate
- avoid novelty animations that compete with task completion

Rule:
Motion should reassure, not distract.

### 14. Accessibility rules
Playfulness cannot come at the expense of usability.

Requirements:
- maintain high contrast
- ensure text remains legible at mobile sizes
- do not use colour alone to indicate meaning
- preserve generous tap targets
- keep handwriting-inspired styles readable and limited to the right contexts

Rule:
Every expressive choice must still pass a practical usability check.

### 15. Practical visual checklist
Before approving a screen, ask:
- Is the main action obvious within one second?
- Is the Name field dominant on Capture?
- Is search clearly visible on Saved?
- Is teal being used sparingly?
- Are outlines consistent?
- Is the screen playful without becoming cluttered?
- Would this still feel easy to use in a hurry?

## MVP exclusions
Not included in the first version:
- custom spaced repetition settings
- profile management
- photos
- advanced quiz modes requiring typed answers
- AI-generated associations
- notifications strategy beyond basic scheduling support
- tags, folders, or CRM-style account structures

## Open questions
- Should the app show a lightweight prompt after save encouraging one memorable detail?
- Should the bottom nav remain visible while the keyboard is open on all supported platforms, or can it be temporarily obscured?
- Should learned names ever re-enter long-term maintenance review in a later version?
- Should the review prompt always begin with name recall, or should the app alternate between name and memorable-detail prompts earlier?

## Clarification questions to answer inline
Answer each question by writing your response after the `//`.

### 1. Post-save flow
Question:
After the user taps `Save`, what should happen immediately after the entry is created?

Examples:
- clear the form and keep the user on Capture
- show a brief success message, then clear the form
- keep the entered values visible until the user changes them
- navigate to Saved or the person detail screen

Why this matters:
This determines the feel of the core capture loop. If the app is meant for repeated fast entry, the screen should reset quickly. If the app is meant to encourage completion or review, we may want a different next step.

Answer:
//show a brief success message, then clear the form but close the keyboard view

### 2. Detail field structure
Question:
Should `Add memorable thing`, `Add where you met`, and `Add another detail` be exactly three fixed fields, or should `Add another detail` support multiple repeatable entries?

Why this matters:
This changes both the UI and the data model. Fixed fields are simpler for MVP. Repeatable details are more flexible, but they add complexity to capture, edit, display, and search.

Answer:
//fixed

### 3. Duplicate names
Question:
What should happen if the user saves two different people with the same name?

Examples:
- allow duplicates with no warning
- allow duplicates but show a soft warning
- prompt the user to add a distinguishing detail

Why this matters:
Duplicate names are common. We should decide whether the app treats them as normal, or whether it helps the user reduce confusion at save time.

Answer:
//allow duplicates but show a soft warning. shoulld be okay since each entry will have date and time

### 4. Default sort order on Saved
Question:
How should the `Saved` list be ordered by default?

Examples:
- most recently added first
- recently edited first
- alphabetical by name
- review-related entries first, then the rest

Why this matters:
This shapes how the list feels in daily use. Different sort orders optimize for capture history, maintenance, or quick lookup.

Answer:
//most recently added first

### 5. Review priority when more than 3 names are due
Question:
If more than 3 names are due on the same day, which 3 should the app surface first?

Examples:
- oldest due first
- newest due first
- oldest saved first
- names missed most recently first

Why this matters:
The PRD sets a daily cap, but not a priority rule. Without one, the backlog behavior is unclear and the review experience may feel inconsistent.

Answer:
//newest due first

### 6. Meaning of "due today"
Question:
Should review timing be based on calendar days or exact elapsed time?

Examples:
- calendar-day based: saved Monday, due Tuesday at any time
- elapsed-time based: saved Monday at 3pm, due Tuesday at 3pm

Why this matters:
This affects scheduling logic, what users expect, and how forgiving the app feels. Calendar-day logic is simpler and usually feels more human for MVP.

Answer:
//- calendar-day based: saved Monday, due Tuesday at 12:15pm

### 7. What resets review progress
Question:
Exactly which edits should reset the review schedule back to the beginning?

Examples:
- any change to name or any detail
- only meaningfully different memory cues
- not typo fixes or formatting-only changes

Why this matters:
The PRD says review-relevant changes reset progress, which is sensible, but we should define the boundary so editing does not feel punitive.

Answer:
//- only meaningfully different memory cues
- not typo fixes or formatting-only changes

### 8. Search behavior in MVP
Question:
How smart should search be in the MVP?

Examples:
- simple case-insensitive substring match only
- tokenized word match across all fields
- typo-tolerant or fuzzy matching

Why this matters:
Search is one of the product's core promises. We should decide how much matching behavior is needed to make "recover by partial memory" actually work in version one.

Answer:
//- simple case-insensitive substring match only

### 9. Delete or archive behavior
Question:
Should the MVP allow users to delete entries, archive entries, or neither?

Why this matters:
If users cannot remove mistakes, duplicates, or irrelevant entries, the saved list may become noisy quickly. On the other hand, removal options add UI and state complexity.

Answer:
//
allow users to delete entries but deletion shoulld not be simple since it's non-recoverable

### 10. Notification expectation in MVP
Question:
For the first version, should review happen only when the user opens the app, or should the app send any reminder notifications at all?

Why this matters:
The PRD excludes a full notification strategy, but mentions basic scheduling support. This needs a concrete product decision so implementation scope stays clear.

Answer:
//app sends reminder only once

### 11. Platform target for MVP
Question:
Is the MVP intended to be:
- a native mobile app
- a mobile web app
- a PWA

Why this matters:
Several UX requirements depend on this, especially keyboard behavior, auto-focus behavior, bottom navigation visibility, and how "app opens on Capture" should work in practice.

Answer:
// i want it to be native but i don't know how we'll test this. So llet's do PWA first then mobile llater

### 12. Incomplete entries with only a name
Question:
For entries that only have a name, should the app simply label them as needing more details, or should it actively prompt the user to complete them?

Examples:
- passive label only
- small CTA in Saved
- post-save prompt on Capture

Why this matters:
This affects how many entries ever become reviewable. A passive approach keeps capture faster. A stronger prompt may improve learning outcomes.

Answer:
//- passive label only

## Working MVP decisions from answers
- After save, show a brief success message, then clear the form and dismiss the keyboard.
- Detail structure is fixed for MVP: `Add memorable thing`, `Add where you met`, and `Add another detail`.
- Duplicate names are allowed, but the app should show a soft warning when a likely duplicate is being saved.
- The Saved list should default to most recently added first.
- If more than 3 names are due, the app should surface the newest due names first.
- Search in MVP should use simple case-insensitive substring matching across all saved fields.
- Users should be able to delete entries, but deletion should require friction because it is non-recoverable.
- MVP should be built as a PWA first, with native mobile as a later step.
- Entries with only a name should show a passive label indicating they need more details.
- Review progress should reset only when the memory cue changes meaningfully, not for typo fixes or formatting-only changes.
- Reviews should become due at the same clock time on the next scheduled day. Example: if a name is saved or reviewed at `12:15`, the next review becomes due at `12:15` on the scheduled future day.
- The app should send one reminder notification when a review becomes due, at that due time. Example: if a review is due at `12:15`, the app sends one reminder at `12:15`.

## Success criteria for MVP
- Users can save a new person in seconds
- Users can find a saved person by searching descriptors, not just name
- Users complete review sessions without friction
- Users improve recall of names paired with one memorable detail

## Summary
The MVP should feel like a fast, focused mobile tool for remembering people. The product succeeds if saving a name is instant, review is light, search is forgiving, and the whole experience stays simple enough that users will actually use it in real life.
