# Accessibility Testing Guide - Sunday Brunch with Giselle

**Last Updated:** 2026-01-09
**Standard:** WCAG 2.1 Level AA
**Target Lighthouse Score:** 100

---

## 🎯 Accessibility Standards & Targets

### WCAG 2.1 Level AA Compliance
All components must meet the following criteria:
- **Perceivable:** Content presented in multiple ways
- **Operable:** All functionality available via keyboard
- **Understandable:** Clear, predictable, readable
- **Robust:** Compatible with assistive technologies

### Success Criteria
- ✅ Lighthouse Accessibility Score: 100
- ✅ 0 critical axe DevTools violations
- ✅ 0 high-priority manual issues
- ✅ Full keyboard navigation support
- ✅ Screen reader compatible

---

## 🔍 Automated Testing

### axe DevTools Chrome Extension

**Installation:**
```bash
# Install Chrome extension
https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd
```

**Testing Workflow:**
1. Open page in Chrome
2. Open DevTools (F12)
3. Navigate to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review violations by severity:
   - **Critical:** Must fix immediately
   - **Serious:** Should fix before production
   - **Moderate:** Fix when possible
   - **Minor:** Nice to have fixes

**Common Issues to Check:**
- [ ] Missing alt text on images
- [ ] Insufficient color contrast
- [ ] Missing form labels
- [ ] Missing ARIA attributes
- [ ] Heading hierarchy skips levels
- [ ] Links without descriptive text
- [ ] Buttons without accessible names

---

### Lighthouse Accessibility Audit

**Run Lighthouse:**
```bash
# Via Chrome DevTools
1. Open DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" only
4. Click "Generate report"

# Via CLI
npm install -g lighthouse
lighthouse http://localhost:5173 --only-categories=accessibility --view
```

**Target Metrics:**
- Accessibility Score: 100
- 0 violations in all categories
- All manual checks passed

---

## ⌨️ Keyboard Navigation Testing

### Navigation Checklist

**Global Navigation:**
- [ ] Tab through all interactive elements in order
- [ ] Shift+Tab moves backwards correctly
- [ ] Skip to main content link present (first tab stop)
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps (can exit all components)

**Interactive Components:**
- [ ] Forms: Tab moves between fields
- [ ] Buttons: Enter/Space activates
- [ ] Links: Enter activates
- [ ] Dropdowns: Arrow keys navigate options
- [ ] Modals: Esc closes, focus trapped inside
- [ ] Carousels: Arrow keys navigate slides

**Recipe Page Specific:**
- [ ] Tab order follows visual layout
- [ ] Ingredient checkboxes toggleable with Space
- [ ] Recipe calculator controls keyboard accessible
- [ ] Filter dropdowns keyboard navigable
- [ ] Search: Type to filter, Enter to submit

**Expected Tab Order:**
1. Skip to content link
2. Main navigation links
3. Search input
4. Recipe filters
5. Recipe cards/content
6. Footer links

---

## 🔊 Screen Reader Testing

### Tools

**NVDA (Windows - Free):**
```bash
# Download from:
https://www.nvaccess.org/download/
```

**JAWS (Windows - Paid):**
```bash
# Download from:
https://www.freedomscientific.com/products/software/jaws/
```

**VoiceOver (macOS - Built-in):**
```bash
# Activate with: Cmd + F5
```

### Testing Workflow

**Basic Navigation:**
1. Turn on screen reader
2. Navigate through page with Tab key
3. Verify each element is announced correctly
4. Check landmarks (main, nav, footer) are identified
5. Verify heading hierarchy is logical

**Content Verification:**
- [ ] Page title announced on load
- [ ] Headings announced with level (h1, h2, etc.)
- [ ] Images have meaningful alt text
- [ ] Links have descriptive text (not "click here")
- [ ] Buttons have clear action labels
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Dynamic content changes are announced (aria-live)

**Recipe Page Specific:**
- [ ] Recipe title announced as main heading
- [ ] Ingredients list readable in order
- [ ] Steps numbered and sequential
- [ ] Timer values announced
- [ ] Serving size changes announced
- [ ] Nutrition facts table navigable

---

## 🎨 Color Contrast Testing

### Contrast Requirements (WCAG AA)
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+):** 3:1 minimum
- **UI components:** 3:1 minimum

### Testing Tools

**WebAIM Contrast Checker:**
```bash
https://webaim.org/resources/contrastchecker/
```

**Chrome DevTools:**
1. Inspect element
2. Click color swatch in Styles panel
3. Check "Contrast ratio" section
4. Verify AA and AAA badges

### Common Issues:
- [ ] Light gray text on white background
- [ ] Placeholder text too light
- [ ] Disabled button text insufficient contrast
- [ ] Link colors on colored backgrounds
- [ ] Icon-only buttons (need labels)

---

## 📋 Manual Testing Checklist

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Landmark regions used (header, nav, main, footer)
- [ ] Lists use `<ul>`, `<ol>`, or `<dl>`
- [ ] Tables use `<table>`, `<th>`, `<caption>`
- [ ] Forms use `<form>`, `<label>`, `<fieldset>`, `<legend>`

### ARIA Attributes
- [ ] aria-label for icon-only buttons
- [ ] aria-labelledby for complex labels
- [ ] aria-describedby for help text
- [ ] aria-live for dynamic updates
- [ ] aria-expanded for collapsible sections
- [ ] aria-current for active nav items
- [ ] aria-hidden for decorative elements

### Focus Management
- [ ] Focus visible on all interactive elements
- [ ] Focus outline sufficient contrast (3:1)
- [ ] Focus not removed with :focus {outline: none}
- [ ] Custom focus styles match design
- [ ] Focus trapped in modals
- [ ] Focus returned after modal close

### Forms
- [ ] All inputs have associated labels
- [ ] Required fields marked (visual + aria-required)
- [ ] Error messages clear and specific
- [ ] Errors associated with inputs (aria-describedby)
- [ ] Success messages announced (aria-live)
- [ ] Placeholder text not used as labels

### Images
- [ ] Decorative images have alt=""
- [ ] Informative images have descriptive alt text
- [ ] Complex images have longdesc or detailed caption
- [ ] Icons have aria-label if no text present
- [ ] Background images not convey information

### Links
- [ ] Link text descriptive (not "click here")
- [ ] Links distinguished from text (color + underline)
- [ ] External links indicated
- [ ] File download links indicate type/size

### Buttons
- [ ] Buttons use `<button>` (not `<div>` with click)
- [ ] Icon buttons have aria-label
- [ ] Button purpose clear from text
- [ ] Disabled buttons have aria-disabled

---

## 🧪 Component-Specific Testing

### RecipeTemplate
- [ ] Recipe title is h1
- [ ] Ingredients in ordered list
- [ ] Steps in ordered list with step numbers
- [ ] Nutrition table has proper headers
- [ ] Print button accessible
- [ ] Share buttons accessible

### Navigation
- [ ] Main nav uses `<nav>` landmark
- [ ] Current page indicated (aria-current="page")
- [ ] Mobile menu keyboard accessible
- [ ] Skip to content link present

### Search
- [ ] Search input has label
- [ ] Search button accessible
- [ ] Live results announced (aria-live)
- [ ] Clear button accessible

### Filters
- [ ] Filter checkboxes keyboard accessible
- [ ] Filter changes announced
- [ ] Applied filters visible
- [ ] Clear filters button accessible

---

## 🚨 Common Accessibility Violations

### Critical Issues (Must Fix)
- ❌ Missing alt text on images
- ❌ Form inputs without labels
- ❌ Insufficient color contrast (<4.5:1)
- ❌ Keyboard traps
- ❌ Missing page title
- ❌ Duplicate IDs

### High Priority (Should Fix)
- ⚠️ Skipped heading levels
- ⚠️ Missing ARIA landmarks
- ⚠️ Links without descriptive text
- ⚠️ Buttons without accessible names
- ⚠️ Focus not visible

### Medium Priority (Nice to Have)
- 📋 Missing skip links
- 📋 Tables without headers
- 📋 Missing language attribute
- 📋 Non-descriptive link text

---

## 📊 Testing Schedule

### Every PR
- [x] Automated axe DevTools scan
- [x] Lighthouse accessibility audit
- [ ] Manual keyboard navigation test
- [ ] Focus visibility check

### Weekly
- [ ] Full screen reader test (NVDA)
- [ ] Color contrast audit
- [ ] Semantic HTML review
- [ ] ARIA attribute validation

### Monthly
- [ ] Comprehensive manual audit
- [ ] User testing with assistive tech users
- [ ] Mobile accessibility test
- [ ] Third-party library audit

---

## 🛠️ Fixing Violations

### Example Fixes

**Missing Alt Text:**
```jsx
// ❌ Bad
<img src="cake.jpg" />

// ✅ Good
<img src="cake.jpg" alt="Chocolate layer cake with frosting" />

// ✅ Decorative
<img src="decoration.jpg" alt="" aria-hidden="true" />
```

**Form Label:**
```jsx
// ❌ Bad
<input type="email" placeholder="Email" />

// ✅ Good
<label htmlFor="email">Email Address</label>
<input id="email" type="email" placeholder="you@example.com" />
```

**Button Accessible Name:**
```jsx
// ❌ Bad
<button><Icon /></button>

// ✅ Good
<button aria-label="Close modal"><CloseIcon /></button>
```

**Color Contrast:**
```css
/* ❌ Bad - 3:1 ratio */
.text {
  color: #999;
  background: #fff;
}

/* ✅ Good - 4.8:1 ratio */
.text {
  color: #666;
  background: #fff;
}
```

---

## 📈 Success Metrics

### Sprint 3 Targets
- ✅ Lighthouse Accessibility: 100
- ✅ 0 critical axe violations
- ✅ Full keyboard navigation
- ✅ Screen reader compatible

### Ongoing Goals
- Maintain 100% Lighthouse score
- 0 accessibility regressions in CI
- Quarterly user testing with assistive tech users
- Regular training for team on a11y best practices

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
