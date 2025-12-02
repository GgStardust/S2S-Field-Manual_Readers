# Hosting Guide - Stardust to Sovereignty Web Version

## Quick Start

Your web book is ready! Here's how to share it:

## Option 1: GitHub Pages (Free, Easy)

1. **Create a GitHub repository** (or use existing)
2. **Upload all files** from `web_version/` folder:
   - `index.html`
   - `book.css`
   - `navigation.js`
   - `orb_images/` folder (with all 13 images)
   - `README.md` (optional)

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click Save

4. **Your book will be live at**: `https://yourusername.github.io/repository-name/`

**Example**: If your repo is `stardust-to-sovereignty`, the URL would be:
`https://yourusername.github.io/stardust-to-sovereignty/`

---

## Option 2: Netlify (Free, Very Easy)

1. **Go to**: [netlify.com](https://netlify.com)
2. **Sign up** (free)
3. **Drag and drop** the entire `web_version/` folder
4. **Your book is live instantly!**

Netlify will give you a URL like: `https://random-name-123.netlify.app`

You can customize the domain name in settings.

---

## Option 3: Vercel (Free, Easy)

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Navigate to** `web_version/` folder
3. **Run**: `vercel`
4. **Follow prompts** - your book is live!

---

## Option 4: Your Own Web Hosting

1. **Upload all files** via FTP/SFTP to your web server
2. **Place files** in a folder (e.g., `/book/` or `/stardust/`)
3. **Access at**: `https://yourdomain.com/book/`

---

## Option 5: Share Locally (No Hosting Needed)

1. **Zip the `web_version/` folder**
2. **Share the zip file** via email, Dropbox, etc.
3. **Recipients unzip and open** `index.html` in their browser

---

## File Structure

Make sure your hosting includes:

```
web_version/
├── index.html          (main file)
├── book.css            (styling)
├── navigation.js       (navigation)
├── orb_images/         (folder with 13 images)
│   ├── orb_01_origin_intelligence.png
│   ├── orb_02_resonance_mechanics.png
│   ├── ... (all 13 images)
│   └── orb_13_bridging_intelligence.png
└── README.md           (optional)
```

---

## Custom Domain (Optional)

### GitHub Pages:
1. Add a `CNAME` file with your domain name
2. Update DNS records to point to GitHub Pages

### Netlify/Vercel:
- Add custom domain in project settings
- Follow DNS configuration instructions

---

## Testing Before Sharing

1. **Open `index.html`** in your browser locally
2. **Check**:
   - All Orb images load correctly
   - Navigation works
   - Links work
   - Responsive on mobile (resize browser window)
   - Typography looks good

---

## Updating the Book

1. **Regenerate HTML** from Markdown:
   ```bash
   cd Manuscripts
   pandoc S2S_Field_Manual_v9_print.md -o web_version/book.html \
     --standalone --toc --toc-depth=2 --css=book.css \
     --metadata title="Stardust to Sovereignty" \
     --metadata author="Gigi Stardust" \
     --section-divs --wrap=none
   ```

2. **Copy to index.html**:
   ```bash
   cp web_version/book.html web_version/index.html
   ```

3. **Re-upload** to your hosting platform

---

## Sharing Tips

- **Share the direct link** to `index.html` or root URL
- **Test on mobile** before sharing widely
- **Check image loading** - ensure all Orb images are uploaded
- **Consider adding** a simple landing page before the book

---

## Need Help?

- **GitHub Pages**: [docs.github.com/pages](https://docs.github.com/pages)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

**Your beautiful web book is ready to share!** ✨

