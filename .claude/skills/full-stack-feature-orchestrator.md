# Full-Stack Feature Orchestrator

**Skill Name:** full-stack-feature-orchestrator
**Category:** Workflow Automation
**Version:** 1.0
**Author:** Claude Code
**Last Updated:** 2026-01-06

---

## Description

Orchestrates end-to-end feature development using specialized agents with TDD methodology. This skill manages the complete lifecycle from competitive analysis to deployment, ensuring quality, consistency, and proper testing at every stage.

---

## When to Use This Skill

Use this skill when you need to:
- Implement a new feature from scratch (backend + frontend + tests)
- Add competitive features based on market analysis
- Build full-stack functionality with proper TDD workflow
- Coordinate multiple specialized agents for complex features
- Ensure comprehensive testing and deployment readiness

**Do NOT use for:**
- Simple bug fixes
- Documentation updates
- Single-file changes
- Purely frontend or backend changes (use specific agents instead)

---

## Workflow Steps

### Step 1: Deep Analysis & Planning
**Agent:** `general-purpose` with sequential thinking
**Duration:** 1-2 hours
**Output:** Implementation roadmap document

**Prompt Template:**
```
Using sequential thinking and progressive reasoning, create a comprehensive implementation plan for: {FEATURE_DESCRIPTION}

Context:
- Current tech stack: {TECH_STACK}
- Development approach: Test-Driven Development (TDD)
- Target completion: {TIMELINE}

Analyze:
1. Technical architecture decisions
2. Feature dependencies and implementation order
3. Database schema design (if needed)
4. API design patterns
5. Frontend component architecture
6. Testing strategy for each layer
7. Deployment and infrastructure needs
8. Timeline and resource estimates
9. Risk analysis and mitigation
10. Integration points with existing codebase

Provide detailed specifications with:
- Clear phases and milestones
- Technical specs for each component
- Dependencies between features
- Testing requirements
- Deployment considerations
- Questions needing answers before implementation
```

**Deliverable:** `IMPLEMENTATION_ROADMAP.md`

---

### Step 2: Database Schema Design (if needed)
**Agent:** `database-design:database-architect`
**Duration:** 2-4 hours
**Output:** SQL schema files, migration scripts

**When to run:** If feature requires database changes

**Prompt Template:**
```
Design database schema for: {FEATURE_DESCRIPTION}

Requirements from roadmap:
{PASTE_DATABASE_REQUIREMENTS}

Include:
1. Table definitions with proper types
2. Indexes for performance
3. Foreign key constraints
4. Triggers for data integrity
5. Materialized views (if needed)
6. Migration scripts (up/down)
7. Seed data for testing

Database: {DATABASE_TYPE} (e.g., PostgreSQL 15+)
ORM: {ORM_TYPE} (e.g., Prisma, TypeORM)
```

**Deliverable:** `migrations/`, `schema.sql`

---

### Step 3: Backend API Design & Implementation (TDD)
**Agent:** `api-scaffolding:backend-architect`
**Duration:** 1-2 days per phase
**Output:** API endpoints, tests, documentation

**Prompt Template:**
```
Implement backend API for: {FEATURE_DESCRIPTION}

Follow TDD methodology (RED-GREEN-REFACTOR):

1. RED Phase - Write Failing Tests:
   - Unit tests for services
   - Integration tests for API endpoints
   - Validation tests
   - Security tests

2. GREEN Phase - Implement Code:
   - API routes and controllers
   - Service layer logic
   - Database queries (via ORM)
   - Error handling
   - Input validation

3. REFACTOR Phase:
   - Code cleanup
   - Extract reusable functions
   - Optimize queries
   - Add JSDoc comments

Requirements from roadmap:
{PASTE_API_REQUIREMENTS}

Tech stack:
- Framework: {BACKEND_FRAMEWORK}
- Language: {LANGUAGE}
- ORM: {ORM}
- Testing: {TEST_FRAMEWORK}

Target coverage: 80%+ (aim for 100% on critical paths)
```

**Deliverable:** `src/routes/`, `src/services/`, `tests/`, API docs

---

### Step 4: Frontend Components & UI (TDD)
**Agent:** `frontend-mobile-development:frontend-developer`
**Duration:** 1-2 days per phase
**Output:** React components, tests, styles

**Prompt Template:**
```
Implement frontend UI for: {FEATURE_DESCRIPTION}

Follow TDD methodology:

1. RED Phase - Write Failing Tests:
   - Component rendering tests
   - User interaction tests
   - State management tests
   - Accessibility tests (WCAG 2.1 AA)

2. GREEN Phase - Implement Components:
   - React components with TypeScript
   - Custom hooks
   - API integration (React Query)
   - Form validation
   - Error handling
   - Loading states

3. REFACTOR Phase:
   - Extract common components
   - Optimize re-renders
   - Improve accessibility
   - Polish animations

Requirements from roadmap:
{PASTE_FRONTEND_REQUIREMENTS}

Tech stack:
- Framework: {FRONTEND_FRAMEWORK}
- State: {STATE_MANAGEMENT}
- Styling: {STYLING_APPROACH}
- Testing: {TEST_FRAMEWORK}

Target coverage: 80%+ on components
```

**Deliverable:** `src/components/`, `src/hooks/`, `src/pages/`, tests

---

### Step 5: Integration Testing
**Agent:** `full-stack-orchestration:test-automator`
**Duration:** 1 day
**Output:** E2E tests, integration tests

**Prompt Template:**
```
Create integration and E2E tests for: {FEATURE_DESCRIPTION}

Test scenarios:
1. Happy path (user successfully completes flow)
2. Error paths (validation errors, API failures)
3. Edge cases (empty states, max limits)
4. Security (unauthorized access, injection)
5. Performance (load times, large datasets)

Use these APIs:
{PASTE_API_ENDPOINTS}

Use these UI components:
{PASTE_COMPONENT_LIST}

Tech stack:
- E2E: {E2E_FRAMEWORK} (e.g., Playwright, Cypress)
- Integration: {INTEGRATION_TEST_FRAMEWORK}

Target: Cover all critical user flows
```

**Deliverable:** `tests/e2e/`, `tests/integration/`

---

### Step 6: Code Review & Quality Check
**Agent:** `comprehensive-review:code-reviewer`
**Duration:** 4-6 hours
**Output:** Code review report, improvement suggestions

**Prompt Template:**
```
Perform comprehensive code review for: {FEATURE_DESCRIPTION}

Review areas:
1. Code quality (clean code, SOLID principles)
2. Test coverage (is it 80%+?)
3. Security vulnerabilities (OWASP top 10)
4. Performance (N+1 queries, inefficient algorithms)
5. Accessibility (WCAG 2.1 AA compliance)
6. TypeScript strict mode compliance
7. Error handling (graceful degradation)
8. Documentation (JSDoc, README updates)

Files to review:
{PASTE_FILE_LIST}

Provide:
- Critical issues (must fix before merge)
- Suggestions (nice to have improvements)
- Praise (what was done well)
```

**Deliverable:** Code review report

---

### Step 7: Security Audit
**Agent:** `security-compliance:security-auditor`
**Duration:** 2-4 hours
**Output:** Security audit report

**Prompt Template:**
```
Conduct security audit for: {FEATURE_DESCRIPTION}

Check for:
1. Authentication/Authorization vulnerabilities
2. Input validation (SQL injection, XSS)
3. CSRF protection
4. Rate limiting
5. Data encryption (at rest, in transit)
6. Sensitive data exposure
7. Security headers
8. Dependency vulnerabilities

Files to audit:
{PASTE_FILE_LIST}

Provide:
- Critical vulnerabilities (P0)
- High priority issues (P1)
- Medium priority issues (P2)
- Recommendations
```

**Deliverable:** Security audit report

---

### Step 8: Deployment Preparation
**Agent:** `cicd-automation:deployment-engineer`
**Duration:** 1 day
**Output:** CI/CD pipeline, deployment scripts

**Prompt Template:**
```
Prepare deployment for: {FEATURE_DESCRIPTION}

Tasks:
1. Update CI/CD pipeline (GitHub Actions/GitLab CI)
   - Add new test jobs
   - Update build steps
   - Configure deployment stages

2. Database migrations
   - Create migration scripts
   - Test rollback procedures
   - Seed production data (if needed)

3. Environment configuration
   - Add environment variables
   - Update .env.example
   - Document configuration

4. Monitoring & Alerts
   - Add error tracking (Sentry)
   - Set up performance monitoring
   - Create alerts for critical metrics

5. Rollout strategy
   - Feature flags (if applicable)
   - Phased rollout plan (10% → 50% → 100%)
   - Rollback plan

Deployment target:
- Frontend: {FRONTEND_HOST}
- Backend: {BACKEND_HOST}
- Database: {DATABASE_HOST}
```

**Deliverable:** `.github/workflows/`, deployment docs

---

### Step 9: Documentation
**Agent:** `documentation-generation:docs-architect`
**Duration:** 4-6 hours
**Output:** User docs, API docs, README updates

**Prompt Template:**
```
Create comprehensive documentation for: {FEATURE_DESCRIPTION}

Documentation types:
1. User documentation
   - How to use the feature
   - Screenshots/videos
   - FAQ

2. API documentation
   - Endpoint specifications (OpenAPI)
   - Request/response examples
   - Error codes

3. Developer documentation
   - Architecture diagrams
   - Database schema
   - Testing guide
   - Deployment guide

4. README updates
   - Add feature to changelog
   - Update setup instructions
   - Add badges (test coverage, build status)

Output formats:
- Markdown for GitHub
- OpenAPI YAML for API
- Mermaid diagrams for architecture
```

**Deliverable:** `docs/`, OpenAPI spec, README updates

---

### Step 10: Launch & Monitor
**Agent:** Manual (developer oversight)
**Duration:** Ongoing
**Output:** Deployed feature, monitoring dashboards

**Checklist:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] CI/CD pipeline green
- [ ] Staging deployment successful
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Product owner approval

**Rollout Plan:**
1. Deploy to staging
2. Smoke test on staging
3. Deploy to production (10% traffic)
4. Monitor for 24 hours
5. Increase to 50% traffic
6. Monitor for 24 hours
7. Full rollout (100% traffic)
8. Post-launch monitoring (1 week)

**Monitoring:**
- Error rates (Sentry)
- Performance (New Relic, Lighthouse)
- User engagement (Google Analytics)
- Revenue impact (Stripe dashboard)

---

## Usage Examples

### Example 1: User Reviews & Ratings System

```bash
# Step 1: Generate plan
Use Task tool with subagent_type="general-purpose"
Prompt: "Using sequential thinking, create implementation plan for user reviews and ratings system..."

# Step 2: Database design
Use Task tool with subagent_type="database-design:database-architect"
Prompt: "Design database schema for reviews and ratings..."

# Step 3: Backend API (TDD)
Use Task tool with subagent_type="api-scaffolding:backend-architect"
Prompt: "Implement backend API for reviews and ratings using TDD..."

# Step 4: Frontend UI (TDD)
Use Task tool with subagent_type="frontend-mobile-development:frontend-developer"
Prompt: "Implement frontend components for reviews and ratings using TDD..."

# Continue through steps 5-10...
```

### Example 2: Advanced Search Feature

```bash
# Similar workflow, but Step 2 might focus on search indexes instead of schema
# Step 3 would include search algorithm implementation
# Step 4 would include autocomplete, filters, etc.
```

---

## Success Criteria

A feature is considered "done" when:

### Technical Quality
- ✅ 80%+ test coverage (unit, integration, E2E)
- ✅ All tests passing in CI/CD
- ✅ No critical security vulnerabilities
- ✅ TypeScript strict mode passing (no `any`)
- ✅ ESLint passing with zero warnings
- ✅ Performance benchmarks met (<3s page load, <500ms API)

### Code Quality
- ✅ Code review approved by 2+ reviewers
- ✅ SOLID principles followed
- ✅ DRY (no significant duplication)
- ✅ Proper error handling
- ✅ Comprehensive logging

### User Experience
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Mobile responsive (tested on 3+ devices)
- ✅ Loading states for async operations
- ✅ Error states with clear messaging
- ✅ Graceful degradation for failures

### Documentation
- ✅ API documentation complete (OpenAPI)
- ✅ User documentation with examples
- ✅ README updated
- ✅ Architecture diagrams created
- ✅ Deployment guide written

### Deployment
- ✅ CI/CD pipeline configured
- ✅ Environment variables documented
- ✅ Database migrations tested
- ✅ Monitoring/alerts set up
- ✅ Rollback plan documented

---

## Estimated Timeline

| Phase | Duration (Solo) | Duration (Team of 5) |
|-------|----------------|---------------------|
| Planning & Design | 1-2 days | 4-8 hours |
| Backend Implementation | 3-5 days | 1-2 days |
| Frontend Implementation | 3-5 days | 1-2 days |
| Testing | 2-3 days | 1 day |
| Review & Security | 1-2 days | 4-8 hours |
| Deployment Prep | 1 day | 4 hours |
| Documentation | 1 day | 4 hours |
| **TOTAL** | **12-19 days** | **4-6 days** |

---

## Cost Estimates

### Infrastructure
- Development environment: $30-50/month
- Staging environment: $30-50/month
- Production environment: $100-200/month (scales with traffic)

### Development Time
- Solo developer: 100-150 hours
- Team of 5: 40-60 hours per person (200-300 hours total, but parallel)

### Third-Party Services
- Error monitoring (Sentry): $0-26/month
- Analytics: $0 (Google Analytics)
- Email (SendGrid): $0-15/month
- Image hosting (Cloudinary): $0-89/month

---

## Risk Mitigation

### Common Risks & Solutions

1. **Scope Creep**
   - Mitigation: Define clear acceptance criteria upfront
   - Use feature flags to defer non-critical features

2. **Integration Issues**
   - Mitigation: Integration tests from day 1
   - Test on staging environment before production

3. **Performance Degradation**
   - Mitigation: Performance benchmarks in CI/CD
   - Load testing before launch

4. **Security Vulnerabilities**
   - Mitigation: Security audit by specialized agent
   - Automated dependency scanning (Dependabot)

5. **Poor User Adoption**
   - Mitigation: User testing in beta phase
   - A/B testing different approaches
   - Gather feedback early and often

---

## Agent Coordination Matrix

| Step | Primary Agent | Supporting Agents | Output |
|------|--------------|-------------------|--------|
| 1. Planning | general-purpose | - | Roadmap |
| 2. Database | database-architect | - | Schema |
| 3. Backend | backend-architect | test-automator | API + Tests |
| 4. Frontend | frontend-developer | test-automator | UI + Tests |
| 5. Integration | test-automator | - | E2E Tests |
| 6. Code Review | code-reviewer | architect-review | Review Report |
| 7. Security | security-auditor | - | Audit Report |
| 8. Deployment | deployment-engineer | - | CI/CD |
| 9. Docs | docs-architect | - | Documentation |

---

## Maintenance & Updates

After launch, continue monitoring and iterating:

### Week 1 Post-Launch
- Monitor error rates hourly
- Fix critical bugs immediately
- Gather user feedback
- Performance tuning

### Month 1 Post-Launch
- Analyze usage metrics
- Identify improvement opportunities
- Plan iteration 2
- Technical debt cleanup

### Quarterly Reviews
- Review success metrics
- User surveys
- Competitive analysis
- Feature prioritization

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-06 | Initial skill creation | Claude Code |

---

## Related Skills

- `workflows:tdd-cycle` - For granular TDD implementation
- `workflows:full-review` - For comprehensive code reviews
- `tools:multi-agent-review` - For multi-perspective reviews
- `database-design:postgresql` - For PostgreSQL-specific design
- `api-scaffolding:fastapi-templates` - For FastAPI projects
- `cicd-automation:github-actions-templates` - For CI/CD setup

---

**Skill Status:** Active
**Maintenance:** Review quarterly
**Support:** GitHub Issues

