# Email Signup Setup Guide - ConvertKit

## Why ConvertKit?
- **Free tier:** Up to 1,000 subscribers
- **Creator-friendly:** Built for content creators
- **Easy API:** Simple REST API integration
- **Automation:** Welcome emails, sequences
- **No credit card required** for free tier

---

## Step 1: Create ConvertKit Account

1. Go to [convertkit.com](https://convertkit.com)
2. Sign up for free account
3. Verify your email
4. Complete basic profile setup

---

## Step 2: Create a Form

1. In ConvertKit dashboard, go to **Grow → Landing Pages & Forms**
2. Click **Create New → Form**
3. Choose "Inline" form type
4. Name it: "Sunday Brunch Signup"
5. Customize confirmation message (optional)
6. Save the form

---

## Step 3: Get Your API Credentials

1. Go to **Settings → Advanced**
2. Find your **API Key** and **API Secret**
3. Copy these - you'll need them for the integration

**IMPORTANT:** Keep these secret! Don't commit them to Git.

---

## Step 4: Create Environment Variables File

In your `sunday-brunch-website` folder, create `.env`:

```
VITE_CONVERTKIT_FORM_ID=your_form_id_here
VITE_CONVERTKIT_API_KEY=your_api_key_here
```

**Get Form ID:**
1. In ConvertKit, go to your form
2. Click "Embed"
3. The Form ID is in the embed code (looks like a number)

---

## Step 5: Add .env to .gitignore

Make sure `.env` is in your `.gitignore` file:

```
# Environment variables
.env
.env.local
.env.production
```

---

## Step 6: Install Axios (for API calls)

```bash
cd sunday-brunch-website
npm install axios
```

---

## Step 7: Test Your Integration

After implementing the code:

1. Enter your email in the signup form
2. Submit
3. Check ConvertKit dashboard for new subscriber
4. Check your email for confirmation (if enabled)

---

## Alternative: Netlify Forms (Simpler)

If you deploy to Netlify, you can use built-in forms:

1. Add `netlify` attribute to form
2. Add hidden input: `<input type="hidden" name="form-name" value="signup" />`
3. No API needed!
4. View submissions in Netlify dashboard

**Pros:** Zero setup, free
**Cons:** No automation, manual export needed

---

## Next Steps

1. Create ConvertKit account
2. Get API credentials
3. Update `.env` file with your credentials
4. Test signup form
5. Set up welcome email sequence (optional)
