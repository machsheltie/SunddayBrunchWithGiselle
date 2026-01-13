# Complete Phase Skill

**Skill Name:** `complete-phase`
**Purpose:** Mark a phase as complete in IMPLEMENTATION_ROADMAP.md and commit all changes to git

## When to Use

Use this skill automatically when you have **fully completed** a sprint phase or week. Examples:
- Completed Sprint 4 Week 2: Ratings System (all tasks done)
- Completed Sprint 4 Week 3: Reviews System (all tasks done)
- Completed an entire sprint

**Do NOT use** for partial completions or individual tasks.

## Instructions

When invoked, you MUST follow these steps in order:

### Step 1: Identify Completed Phase

Determine which phase/week was just completed by reviewing:
- The todo list from this session
- What work was actually done
- Which tasks in IMPLEMENTATION_ROADMAP.md are now complete

### Step 2: Update IMPLEMENTATION_ROADMAP.md

1. Read the current IMPLEMENTATION_ROADMAP.md
2. Find the relevant section (e.g., "Sprint 4 Week 2: Ratings System")
3. Check off ALL completed tasks with `- [x]` syntax
4. Update status line if the entire phase is complete
5. Update metrics if applicable (test counts, coverage, etc.)

### Step 3: Create Summary

Prepare a comprehensive completion summary including:
- Phase name (e.g., "Sprint 4 Week 2: Ratings System")
- All completed tasks (bulleted list)
- Key deliverables
- Test metrics (tests added, coverage achieved)
- Files created/modified

### Step 4: Commit Everything to Git

Use a **single comprehensive commit** that includes:
- IMPLEMENTATION_ROADMAP.md (updated with checkmarks)
- All code changes from the phase
- All test files
- All documentation updates

**Commit Message Format:**
```
feat(sprint-X-weekY): complete [Phase Name]

## Phase Complete: [Phase Name]

### Tasks Completed
- [x] Task 1
- [x] Task 2
- [x] Task 3

### Deliverables
- Component A with X tests
- API function B with Y tests
- Integration with Z

### Metrics
- Tests: X/X passing (100%)
- Coverage: Y%
- Files created: N
- Files modified: M

### Next Phase
[Brief description of what comes next]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Step 5: Push to GitHub

After committing, push to GitHub:
```bash
git push origin main
```

## Example Invocation

**User says:** "We completed the ratings system!"

**You do:**
1. ✅ Identify: Sprint 4 Week 2: Ratings System is complete
2. ✅ Update IMPLEMENTATION_ROADMAP.md:
   - Check off "Create StarRating component"
   - Check off "Implement rating submission API"
   - Check off "Display average ratings on recipe cards"
   - Check off "40+ ratings tests"
   - Update status to "✅ Complete"
3. ✅ Create summary
4. ✅ Commit everything with comprehensive message
5. ✅ Push to GitHub

## Important Notes

- **Only mark tasks complete when ALL work is done**
- **Include test metrics** (tests written, passing, coverage)
- **Update overall project metrics** if at the end of a sprint
- **Be specific** about what was accomplished
- **Link related tasks** if they span multiple sections
- **Set expectations** for the next phase

## Error Handling

If you encounter issues:
- ❌ Can't find the phase in roadmap → Ask user to clarify which phase
- ❌ Git conflicts → Resolve or ask user to pull latest
- ❌ Uncertain if phase is complete → Ask user to confirm
- ❌ Missing test metrics → Search for test files and count them

## Success Criteria

A successful completion includes:
- ✅ All relevant tasks checked off in roadmap
- ✅ Accurate metrics (test counts, files changed)
- ✅ Comprehensive commit message
- ✅ Successfully pushed to GitHub
- ✅ User informed of completion and next steps
