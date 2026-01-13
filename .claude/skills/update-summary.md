# Update Summary Skill

**Skill Name:** `update-summary`
**Purpose:** Update IMPLEMENTATION_SUMMARY.md with completed phase details and metrics

## When to Use

Use this skill automatically when you have **fully completed** a feature or major phase. Examples:
- Completed Sprint 4 Week 3: Reviews System (all tasks done)
- Completed a new feature implementation (Ratings, Search, etc.)
- Completed major enhancements or refactoring

**Do NOT use** for minor fixes or individual task completions.

## Instructions

When invoked, you MUST follow these steps in order:

### Step 1: Identify Completed Feature

Determine what feature/phase was just completed by reviewing:
- The todo list from this session
- What work was actually done
- Test results and metrics
- Which deliverables are now complete

### Step 2: Gather Metrics

Collect comprehensive metrics:
1. **Test Metrics:**
   - Total tests written for this feature
   - Tests passing vs total
   - Pass rate percentage
   - Test execution time

2. **Code Deliverables:**
   - New files created
   - Components built
   - Hooks/utilities created
   - Test files written
   - Documentation files

3. **Performance Metrics:**
   - Bundle size impact
   - Rendering performance
   - API response times (if applicable)

4. **Quality Metrics:**
   - Accessibility compliance
   - Browser compatibility
   - Mobile responsiveness

### Step 3: Create/Update IMPLEMENTATION_SUMMARY.md

**Location:** `sunday-brunch-website/IMPLEMENTATION_SUMMARY.md`

**If file doesn't exist:** Create new file with full structure

**If file exists:** Update or append new section

**Required Sections:**
```markdown
# [Feature Name] - Implementation Summary

## Executive Summary
[Brief overview of what was accomplished]

## Achievement Metrics

### Test Coverage
- **Total Tests Written:** X
- **Tests Passing:** X/X (XX% pass rate)
- **Test Execution Time:** X.XX seconds
- **Methodology:** RED-GREEN-REFACTOR (strict TDD)

### Components Delivered
1. ✅ **Component A** - X/X tests passing (100%)
2. ✅ **Component B** - X/X tests passing (100%)
3. ⚠️ **Component C** - X/Y tests passing (XX%) [if not 100%]

### Code Deliverables
- **New Files Created:** X
- **Components:** X major components
- **Custom Hooks:** X
- **Test Files:** X comprehensive test suites
- **Styling:** X CSS files
- **Documentation:** X comprehensive guides

## Feature Highlights

### 1. [Key Feature]
- **Technology:** [Libraries/tools used]
- **Capability:** [What it does]
- **Performance:** [Speed/efficiency]
- **User Experience:** [UX benefits]

[Continue for all major features...]

## Technical Implementation

### Technologies Used
- **React X.X.X** - [Purpose]
- **Library X.X.X** - [Purpose]
[List all major dependencies]

### Architecture Pattern
```
[Visual representation of component hierarchy]
```

### State Management
```javascript
[Key state management patterns used]
```

## TDD Process Summary

### Phase 1: RED ✅
**Objective:** Write failing tests
- [Summary of test writing phase]
- **Result:** All tests failed (expected)

### Phase 2: GREEN ✅
**Objective:** Implement minimal code to pass tests
- [Summary of implementation phase]
- **Result:** X/X tests passing (XX%)

### Phase 3: REFACTOR ✅
**Objective:** Optimize and clean code
- [Summary of refactoring phase]
- **Result:** Production-ready code

## File Structure

```
[Directory tree of all files created/modified]
```

## Performance Benchmarks

### [Category] Performance
- **Metric 1:** X value
- **Metric 2:** X value

## Browser Compatibility

### Tested Browsers
- ✅ Chrome X+ (Desktop & Mobile)
- ✅ Firefox X+
- ✅ Safari X+ (Desktop & Mobile)
- ✅ Edge X+

### Responsive Breakpoints
- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** 320px - 767px

## Deployment Checklist

### Pre-Deployment
- ✅ Tests written and passing (100%)
- ✅ Components implemented
- ✅ Accessibility tested
- ✅ Mobile responsive verified
- ✅ Documentation complete

### Deployment Steps
1. **Run Full Test Suite** (verify 100% pass rate)
2. **Build Production Bundle** (`npm run build`)
3. **Deploy to Staging** (test with real users)
4. **Monitor Performance** (Core Web Vitals)
5. **Deploy to Production** (gradual rollout)

### Post-Deployment
- Monitor analytics
- Track user engagement
- Collect user feedback
- Plan future enhancements

## Known Issues

[If any issues exist, list them here]

**Impact:** [High/Medium/Low]
**Estimated Fix Time:** [X hours]
**Priority:** [High/Medium/Low]

## Future Enhancements

### Short-Term (1-2 weeks)
1. [Enhancement 1]
2. [Enhancement 2]

### Medium-Term (1-3 months)
1. [Enhancement 1]
2. [Enhancement 2]

### Long-Term (3-6 months)
1. [Enhancement 1]
2. [Enhancement 2]

## Lessons Learned

### What Went Well
✅ [Success 1]
✅ [Success 2]

### Challenges Overcome
⚠️ [Challenge 1]
⚠️ [Challenge 2]

### Best Practices Applied
- [Practice 1]
- [Practice 2]

## Team Velocity

### Time Breakdown
- **Planning & Design:** X hours
- **Test Writing (RED):** X hours
- **Implementation (GREEN):** X hours
- **Refactoring (CLEAN):** X hours
- **Documentation:** X hours
- **Total Time:** ~X hours

### Productivity Metrics
- **Tests per Hour:** X.X
- **Components per Day:** X.X
- **Lines of Code:** ~X,XXX
- **Test Coverage:** XX%

## Conclusion

[Summary paragraph about what was delivered]

**Status:** [Production Ready / In Progress / Blocked]

**Recommendation:** [Next steps]

---

**Project:** Sunday Brunch with Giselle
**Feature:** [Feature Name]
**Developer:** Claude Code (Sonnet 4.5)
**Methodology:** Test-Driven Development
**Date:** [YYYY-MM-DD]
**Version:** [X.X.X]
```

### Step 4: Commit to Git

**Do NOT commit yet** - this file should be included in the comprehensive phase completion commit created by the `complete-phase` skill.

### Step 5: Inform User

Provide a brief summary:
```
✅ Updated IMPLEMENTATION_SUMMARY.md with:
- [Feature Name] details
- X/X tests passing (XX%)
- X new components
- X files created
- Performance metrics
- Deployment checklist
```

## Important Notes

- **Always use ✅ for 100% passing tests**
- **Always use ⚠️ for <100% passing tests**
- **Include actual numbers** (not placeholders)
- **Be specific** about technologies and metrics
- **Update existing sections** if feature already exists
- **Maintain consistent formatting** with existing content
- **Use emoji indicators** for visual clarity
- **Include file paths** for all deliverables

## Error Handling

If you encounter issues:
- ❌ Can't find metrics → Run test suite to get actual numbers
- ❌ Uncertain about feature name → Ask user to clarify
- ❌ Missing performance data → Use "Performance metrics pending"
- ❌ File doesn't exist → Create new file with full structure

## Success Criteria

A successful update includes:
- ✅ All test metrics accurate and current
- ✅ All components listed with pass rates
- ✅ File structure documented
- ✅ Performance benchmarks included
- ✅ Deployment checklist complete
- ✅ User informed of updates

## Example Invocation

**User says:** "We completed the reviews system!"

**You do:**
1. ✅ Identify: Sprint 4 Week 3: Reviews System is complete
2. ✅ Gather metrics:
   - 50 tests written, 50/50 passing (100%)
   - 3 components: ReviewForm, ReviewList, ReviewCard
   - Test execution: 4.2s
3. ✅ Update IMPLEMENTATION_SUMMARY.md:
   - Add "Reviews System - Implementation Summary" section
   - Include all metrics and deliverables
   - Document architecture and state management
4. ✅ Inform user of completion

## Coordination with Other Skills

**Use with `complete-phase` skill:**
- `update-summary` updates IMPLEMENTATION_SUMMARY.md
- `complete-phase` updates IMPLEMENTATION_ROADMAP.md and commits everything
- Both should be used together for phase completions

**Execution Order:**
1. First: Run `update-summary` to update the summary file
2. Second: Run `complete-phase` to update roadmap and commit all changes
