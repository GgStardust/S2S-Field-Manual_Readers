# Stardust to Sovereignty - Web Version

A beautiful, shareable HTML version of *Stardust to Sovereignty*.

## Files

- `index.html` - Main HTML file (to be created)
- `book.html` - Generated HTML from Pandoc
- `book.css` - Custom styling
- `navigation.js` - Navigation functionality
- `orb_images/` - Folder containing Orb symbol images

## Setup

1. **Add Orb Images**: Place all 13 Orb images in the `orb_images/` folder with these names:
   - `orb_01_origin_intelligence.png`
   - `orb_02_resonance_mechanics.png`
   - `orb_03_photonic_intelligence.png`
   - `orb_04_harmonic_architectures.png`
   - `orb_05_temporal_sovereignty.png`
   - `orb_06_starline_memory.png`
   - `orb_07_alchemical_current.png`
   - `orb_08_quantum_intuition.png`
   - `orb_09_temporal_fluidity.png`
   - `orb_10_ancestral_repatterning.png`
   - `orb_11_radiant_transparency.png`
   - `orb_12_sovereign_field.png`
   - `orb_13_bridging_intelligence.png`

2. **View Locally**: Open `index.html` in a web browser

3. **Host Online**: Upload all files to a web server or use:
   - GitHub Pages
   - Netlify
   - Vercel
   - Your own web hosting

## Features

- ✅ Beautiful typography (Crimson Text + Playfair Display)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scrolling navigation
- ✅ Orb images integrated
- ✅ Elegant spacing and layout
- ✅ Print-friendly styles

## Regenerating HTML

To regenerate the HTML from the Markdown source:

```bash
cd Manuscripts
pandoc S2S_Field_Manual_v9_print.md -o web_version/book.html \
  --standalone \
  --toc \
  --toc-depth=2 \
  --css=book.css \
  --metadata title="Stardust to Sovereignty" \
  --metadata author="Gigi Stardust" \
  --section-divs \
  --wrap=none
```

## Customization

Edit `book.css` to customize:
- Colors
- Fonts
- Spacing
- Layout
- Orb image sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

