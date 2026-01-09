# Security Best Practices - Sunday Brunch with Giselle

**Last Updated:** 2026-01-08
**Sprint:** 3 - Security & Performance Hardening

---

## 🔒 Overview

This document outlines the security measures implemented in the Sunday Brunch with Giselle website to protect user data, prevent vulnerabilities, and maintain secure communication with third-party services.

---

## ✅ Implemented Security Measures

### 1. API Key Protection (Sprint 3 - Phase 1.1)

**Problem:** ConvertKit API key was exposed in client-side JavaScript bundle, allowing anyone to inspect the bundle and steal the API key.

**Solution:** Implemented Netlify serverless function architecture.

**Architecture:**
```
Client (Browser)
    ↓ POST /.netlify/functions/subscribe
Netlify Serverless Function (Server-side)
    ↓ POST https://api.convertkit.com/v3/forms/{formId}/subscribe
ConvertKit API (with API key)
```

**Implementation Details:**
- ✅ Created `netlify/functions/subscribe.js` serverless function
- ✅ Moved API credentials to Netlify environment variables (server-side only)
- ✅ Updated client code to call serverless function instead of ConvertKit API
- ✅ Removed all VITE_CONVERTKIT_* environment variables from client

**Files Modified:**
- `netlify/functions/subscribe.js` (NEW) - Secure API proxy
- `sunday-brunch-website/src/services/convertkit.js` (UPDATED) - Calls serverless function
- `netlify.toml` (UPDATED) - Function configuration
- `.env.example` (NEW) - Environment variable documentation

**Verification:**
```bash
# Check that no API keys are in the production bundle
npm run build
grep -r "CONVERTKIT_API_KEY" dist/
# Should return no results
```

### 2. Rate Limiting

**Purpose:** Prevent abuse of newsletter subscription endpoint.

**Implementation:** In-memory rate limiting in serverless function
- **Limit:** 5 requests per minute per IP address
- **Window:** 60 seconds
- **Response:** 429 Too Many Requests when limit exceeded

**Note:** For high-traffic production, consider migrating to Redis-based rate limiting.

### 3. Input Validation

**Email Validation:**
- Server-side regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Prevents invalid email submissions
- Returns 400 Bad Request for invalid emails

**Request Validation:**
- JSON parsing with error handling
- Required field validation (email)
- Content-Type header enforcement

### 4. Security Headers

**Implemented in `netlify.toml`:**
```toml
[headers.values]
  X-Frame-Options = "DENY"                          # Prevent clickjacking
  X-XSS-Protection = "1; mode=block"                 # XSS protection
  X-Content-Type-Options = "nosniff"                 # Prevent MIME sniffing
  Referrer-Policy = "strict-origin-when-cross-origin" # Referrer control
```

**Purpose:**
- **X-Frame-Options:** Prevents site from being embedded in iframes (clickjacking protection)
- **X-XSS-Protection:** Enables browser XSS filtering
- **X-Content-Type-Options:** Prevents browsers from MIME-sniffing responses
- **Referrer-Policy:** Controls referrer information sent with requests

### 5. HTTPS Enforcement

**Status:** Enforced by Netlify on all production deployments
- Automatic HTTPS redirection
- Free SSL certificates via Let's Encrypt
- TLS 1.2+ required

---

## 🚫 Security Anti-Patterns (AVOID)

### ❌ DO NOT: Use VITE_ prefix for sensitive data

```javascript
// ❌ WRONG - This exposes API key in client bundle
const API_KEY = import.meta.env.VITE_API_KEY

// ✅ CORRECT - Use serverless function
const response = await fetch('/.netlify/functions/api')
```

**Why:** All `VITE_*` environment variables are bundled into the client JavaScript and can be inspected by anyone.

### ❌ DO NOT: Commit .env files

```bash
# ❌ WRONG
git add .env
git commit -m "Add environment variables"

# ✅ CORRECT
# .env files are already in .gitignore
# Configure environment variables in Netlify UI
```

### ❌ DO NOT: Store secrets in localStorage

```javascript
// ❌ WRONG - localStorage is accessible to all JavaScript
localStorage.setItem('apiKey', 'secret-key')

// ✅ CORRECT - Keep secrets server-side only
// If you need user tokens, use httpOnly cookies
```

### ❌ DO NOT: Log sensitive data

```javascript
// ❌ WRONG
console.log('API Key:', process.env.API_KEY)

// ✅ CORRECT
console.log('API request completed')
```

---

## 🔐 Environment Variable Configuration

### Development (.env.local)

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local and add your credentials
# CONVERTKIT_API_KEY=your_api_key
# CONVERTKIT_FORM_ID=your_form_id

# Test with Netlify CLI
npx netlify dev
```

### Production (Netlify UI)

1. **Navigate to:** Netlify Dashboard → Site Settings → Environment Variables
2. **Add Variables:**
   - `CONVERTKIT_API_KEY` = `your_production_api_key`
   - `CONVERTKIT_FORM_ID` = `your_production_form_id`
3. **Deploy:** Push to main branch (triggers automatic deployment)

**IMPORTANT:** Never use VITE_ prefix for sensitive credentials!

---

## 🛡️ Security Checklist

### Before Every Deployment

- [ ] No API keys or secrets in client code
- [ ] All sensitive variables use serverless functions
- [ ] .env files are in .gitignore
- [ ] Environment variables set in Netlify UI
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting tested
- [ ] Input validation working
- [ ] No console.log with sensitive data

### Code Review Checklist

- [ ] Check for `VITE_*` environment variables with sensitive data
- [ ] Verify serverless functions handle errors securely
- [ ] Confirm no hardcoded API keys or credentials
- [ ] Review third-party dependencies for vulnerabilities
- [ ] Validate all user inputs server-side
- [ ] Ensure proper error messages (no information leakage)

---

## 🔍 Security Auditing

### Automated Scans

```bash
# Check for exposed secrets in code
npm install -g git-secrets
git secrets --scan

# Audit dependencies for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Manual Code Review

```bash
# Search for potential API keys in code
grep -r "api_key" sunday-brunch-website/src/
grep -r "VITE_.*KEY" sunday-brunch-website/src/

# Check production bundle for secrets
npm run build
grep -r "api_key" dist/
grep -r "secret" dist/
```

### Penetration Testing

- **Rate Limiting:** Send 10+ requests in 1 minute, verify 429 response
- **Input Validation:** Submit invalid emails, verify 400 response
- **SQL Injection:** Test with malicious payloads (when backend added)
- **XSS:** Test with `<script>alert('XSS')</script>` in inputs

---

## 🚨 Incident Response

### If API Key is Compromised

1. **Immediate Actions:**
   - Rotate API key in ConvertKit dashboard
   - Update `CONVERTKIT_API_KEY` in Netlify environment variables
   - Redeploy site (to pick up new environment variable)

2. **Investigation:**
   - Review access logs for suspicious activity
   - Check ConvertKit dashboard for unauthorized subscriptions
   - Audit git history for accidental commits

3. **Prevention:**
   - Review this security document
   - Run `git secrets --scan` on entire repository
   - Update team training on security practices

### Reporting Security Issues

**Email:** security@sundaybrunch.com *(configure this email)*

**DO NOT:** Open public GitHub issues for security vulnerabilities

**DO:** Email detailed description to security team privately

---

## 📚 Additional Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Netlify Security Best Practices](https://docs.netlify.com/security/secure-access-to-sites/)
- [ConvertKit API Documentation](https://developers.convertkit.com/)

### Tools
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent committing secrets
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Check dependencies
- [Snyk](https://snyk.io/) - Continuous security monitoring

### Security Training
- [Web Security Academy](https://portswigger.net/web-security)
- [OWASP CheatSheets](https://cheatsheetseries.owasp.org/)

---

**Document Maintained By:** Development Team
**Review Schedule:** Every Sprint (2 weeks)
**Next Review:** Sprint 4 completion (2026-01-22)
