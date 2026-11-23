# Contributing

This project is developed by one person but follows the workflow of a small agile team, so that every change is planned, traceable and finished properly.

## Backlog structure

| Level | Label | Description |
|---|---|---|
| Epic | `epic` | A large goal (for example, *Security & Data Integrity*). Its user stories are sub-issues. |
| User story | `user-story` | A user-facing change: "As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;". Its tasks are sub-issues. |
| Task | `task` | A concrete technical step, usually one or two commits. |
| Bug | `bug` | Something that does not work as expected. |

Every story, task and bug also has:

- an **area** label: `backend`, `frontend`, `docs` or `devops`
- a **priority** label: `priority: high`, `priority: medium` or `priority: low`
- a **size** label: `size: S` (a few hours), `size: M` (one or two days), `size: L` (up to a week)
- a **milestone** (version)

## Milestones

| Milestone | Goal |
|---|---|
| v1.1 Security fixes | Close the security and data integrity issues |
| v1.2 Demo-ready | Anyone can clone the repository and try every role in minutes |
| v1.3 UX polish | The app feels professional on desktop and mobile |
| v1.4 Feature completeness | The app does everything the README describes |
| v2.0 Quality | Automated tests, CI and an online demo |

## Board

All issues live in the GitHub Project board:

**Backlog → Ready → In Progress → In Review → Done**

- **Backlog**: written, but not yet meeting the Definition of Ready.
- **Ready**: meets the Definition of Ready; can be started.
- **In Progress**: being worked on. Keep this column small (ideally one story at a time).
- **In Review**: code finished; reviewing the diff and testing against the acceptance criteria.
- **Done**: meets the Definition of Done. Issues closed by a commit move here automatically.

The **Stories** view hides the tasks and shows only epics, stories and bugs.

## Definition of Ready

A story can move to **Ready** when:

- [ ] It follows "As a / I want / so that"
- [ ] Its acceptance criteria are clear and testable (Given / When / Then)
- [ ] It has size and priority labels
- [ ] It has a milestone and a parent epic
- [ ] Its technical tasks exist as sub-issues, each with area, priority and size labels
- [ ] Its dependencies are identified (including any new library, which must be approved first)
- [ ] It fits in size L or smaller (otherwise split it)

## Definition of Done

A story is **Done** when:

- [ ] All acceptance criteria are met
- [ ] The code was self-reviewed (diff read line by line)
- [ ] It was tested manually and the steps are written in a comment on the issue
- [ ] There are no errors in the browser console or the server log
- [ ] No secrets were committed (`.env` is never committed)
- [ ] The README and Swagger docs are updated if behaviour or the API changed, including the *Future improvements* section
- [ ] Automated tests were added or updated (from v2.0 onwards, once the test setup exists)
- [ ] Commits reference the issue, and the last one closes it
- [ ] All sub-issues are closed

Each story may add its own specific items to this list.

## Commit messages

- Written in English, in the imperative mood: `Add`, `Fix`, `Remove`, not `Added` or `Fixes`.
- A short summary line (around 50 characters, max 72), without a final full stop.
- Reference the issue being worked on. Use a closing keyword only on the commit that finishes it:

```text
Validate order item quantities (#14)
Read delivery cost from the database (closes #13)
Restore stock when an order is cancelled (fixes #21)
```

`closes`, `fixes` and `resolves` close the issue automatically when the commit reaches the default branch.

## Local setup

See the [README](README.md#getting-started).
