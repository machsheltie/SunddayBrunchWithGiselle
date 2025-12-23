# Sunday Brunch With Giselle - Website

A cozy podcast & recipe blog built with React and Vite.

## Brand Colors
- **Sage Green:** `#8A9A5B`
- **Buttercream Yellow:** `#FFFDD0`
- **Terracotta:** `#E2725B`
- **Soft Lavender:** `#D4C5E2`
- **Warm Pink:** `#F4C2C2`
- **Text Color:** `#4a4a4a` (soft charcoal)
- **Footer:** `#5a5a5a` (neutral gray)

## Typography
- **Headers:** Cormorant Garamond (Google Fonts - temporary)
- **Script/Accent:** Pacifico (Google Fonts - temporary)
- **Body:** Crimson Text (Google Fonts - temporary)

## Development

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
1. Copy `.env.example` to `.env`
2. Sign up for [ConvertKit](https://convertkit.com) (free)
3. Get your Form ID and API Key
4. Update `.env` with your credentials

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Project Structure
```
sunday-brunch-website/
├── src/
│   ├── components/
│   │   ├── SheltieCallout.jsx      # Character commentary boxes
│   │   ├── RecipeCard.jsx          # Interactive recipe card
│   │   └── EpisodePlayer.jsx       # Audio player
│   ├── pages/
│   │   └── RecipePage.jsx          # Full recipe page layout
│   ├── services/
│   │   └── convertkit.js           # Email signup API
│   ├── App.jsx                     # Main landing page
│   ├── App.css                     # Landing page styles
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── .env.example                    # Environment variables template
├── email_signup_guide.md           # ConvertKit setup guide
└── package.json
```

## Components

### SheltieCallout
Character commentary boxes with 4 variants:
- Giselle (lavender) - Sassy, regal observations
- Phaedra (purple) - Science explanations
- Tiana (yellow) - Sensory/emotional notes
- Havok (terracotta) - Comedic action reports

### RecipeCard
Interactive recipe component with:
- Serving size adjuster
- Ingredient checkboxes
- Print functionality
- Nutrition facts
- Schema.org markup (SEO)

### EpisodePlayer
Audio player with:
- Play/pause controls
- Progress bar
- Playback speed (1x, 1.25x, 1.5x, 1.75x, 2x)
- Volume control

## Email Signup
Uses ConvertKit API for newsletter subscriptions. See `email_signup_guide.md` for setup instructions.

## Next Steps
- Purchase custom fonts (Migra, Manekin, Spezia Serif)
- Generate Episode 1 audio with PlayHT
- Create actual recipe content
- Add routing for multiple pages
- Deploy to hosting platform
