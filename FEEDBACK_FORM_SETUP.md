# Feedback Form Setup Guide

The feedback form has been added to the end of the web version. Here's how to set it up to collect responses.

## Option 1: Formspree (Easiest - Free)

1. **Sign up** at [formspree.io](https://formspree.io) (free account allows 50 submissions/month)
2. **Create a new form** and get your form ID
3. **Update the form action** in `index.html`:
   - Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual Formspree form ID
4. **Test it** - submissions will be emailed to you

**Pros:** Free, easy, no backend needed  
**Cons:** Limited to 50 submissions/month on free plan

---

## Option 2: Google Forms (Free, Unlimited)

1. **Create a Google Form** with all 26 questions
2. **Get the embed code** from Google Forms
3. **Replace the form section** in `index.html` with the Google Forms iframe

**Pros:** Free, unlimited submissions, easy to view responses  
**Cons:** Less custom styling, requires recreating the form in Google

---

## Option 3: Typeform (Beautiful, Free Tier)

1. **Sign up** at [typeform.com](https://typeform.com)
2. **Create your form** (free tier: 10 questions per form, 10 responses/month)
3. **Embed the Typeform** in your page or link to it

**Pros:** Beautiful interface, great UX  
**Cons:** Free tier is limited

---

## Option 4: Custom Backend (Most Control)

If you have a backend server, you can:
1. Change the form `action` to your endpoint
2. Process submissions server-side
3. Store in database or send to email

---

## Quick Setup with Formspree (Recommended)

1. Go to https://formspree.io/forms
2. Click "New Form"
3. Name it "S2S First Reader Feedback"
4. Copy your form endpoint (looks like: `https://formspree.io/f/xpzgkqyz`)
5. In `index.html`, replace `YOUR_FORM_ID` with just the ID part (e.g., `xpzgkqyz`)

The form will automatically:
- Email you when someone submits
- Store submissions in your Formspree dashboard
- Handle spam protection
- Work immediately after setup

---

## Testing the Form

1. Open the web version in your browser
2. Scroll to the end to see the feedback form
3. Fill out a test submission
4. Check your email/Formspree dashboard for the response

---

## Form Features

- ✅ All 26 questions from your specification
- ✅ Required fields marked with asterisk
- ✅ Slider inputs for scale questions (1-5)
- ✅ Text areas for long answers
- ✅ Styled to match book aesthetic
- ✅ Responsive design for mobile

---

## Alternative: Link to External Form

If you prefer, you can:
1. Remove the embedded form from `index.html`
2. Add a simple link/button that opens your Google Form or Typeform in a new tab
3. Style the button to match the book design

Would you like me to create a simpler "link to external form" version instead?

