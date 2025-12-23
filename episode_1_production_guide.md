# Episode 1 Audio Production - Complete Guide

## Overview
This guide walks you through producing Episode 1 "The Pie That Started a Dynasty" from script to final export.

**Total Episode Length:** ~30-35 minutes  
**Segments:** 7 (Intro, Before We Bake, Story, Shelties, Recipe, Preview, Outro)

---

## Phase 1: Pre-Production Setup

### 1.1 Set Up PlayHT Account
1. Go to [play.ht](https://play.ht)
2. Sign up for Creator plan ($31/month)
3. Navigate to Voice Cloning section

### 1.2 Gather Reference Audio
You need 30-60 seconds of clean audio for each character:

**Giselle - Goldie Hawn (Overboard)**
- Search YouTube: "Overboard Goldie Hawn scenes"
- Use a YouTube downloader (e.g., yt-dlp, 4K Video Downloader)
- Extract audio using Audacity or VLC
- Trim to 30-60 seconds of clear dialogue

**Phaedra - Tara Strong (Twilight Sparkle)**
- Search: "Twilight Sparkle voice clips"
- Find educational/excited moments
- Extract 30-60 seconds

**Tiana - Evanna Lynch (Luna Lovegood)**
- Search: "Luna Lovegood voice clips"
- Find dreamy, whimsical dialogue
- Extract 30-60 seconds

**Havok - Steve Martin or Bill Murray**
- Search: "Steve Martin Sgt. Bilko" or "Bill Murray Stripes"
- Find over-the-top, comedic moments
- Extract 30-60 seconds

### 1.3 Clone Voices in PlayHT
1. Upload each reference audio file
2. Name each voice (Giselle, Phaedra, Tiana, Havok)
3. Wait for processing (5-10 minutes per voice)
4. Test with sample dialogue
5. Adjust if needed

---

## Phase 2: Script Preparation

### 2.1 Review Episode 1 Scripts
Located in: `Episodes/Episode 1/`
- `1 intro.txt`
- `2 before we bake.txt`
- `3 Recipe Story.txt`
- `4 Recipe Walkthrough.txt`
- `5 Sheltie segments.txt`
- `6 Next Week.txt`
- `7 Outro.txt`

### 2.2 Add Emotion Tags to Scripts
For each character line, note the emotion:

**Example - Giselle:**
```
Line: "Oh, THAT'S your technique? How... quaint."
Emotion: sassy
Intensity: 70%
Emphasis: THAT'S, quaint
Pitch: +5%
Speed: 0.95x
```

**Example - Havok:**
```
Line: "MISSION CRITICAL! The chocolate is approaching DEFCON 1!"
Emotion: dramatic
Intensity: 90%
Emphasis: MISSION CRITICAL, DEFCON 1
Speed: 1.2x
```

---

## Phase 3: Generate Audio in PlayHT

### 3.1 Host Segments (Stacey)
**Option A:** Record yourself
- Use Audacity
- Quiet room, good microphone
- Warm, conversational tone

**Option B:** Use PlayHT with your voice clone
- Clone your own voice
- Generate with "warm, conversational" emotion

### 3.2 Character Segments
For each character line:
1. Select the cloned voice
2. Paste the dialogue
3. Set emotion tag and intensity
4. Adjust pitch/speed if needed
5. Generate audio
6. Listen and refine
7. Download as WAV (highest quality)

**Recommended Settings:**
- **Format:** WAV (44.1kHz, 16-bit)
- **Quality:** Maximum
- **Normalization:** On

### 3.3 Organization
Create folder structure:
```
Episode 1 Audio/
├── Host/
│   ├── 01_intro.wav
│   ├── 02_before_we_bake.wav
│   ├── 03_story.wav
│   ├── 04_recipe.wav
│   ├── 06_next_week.wav
│   └── 07_outro.wav
├── Giselle/
│   └── giselle_segment.wav
├── Phaedra/
│   └── phaedra_segment.wav
├── Tiana/
│   └── tiana_segment.wav
└── Havok/
    └── havok_segment.wav
```

---

## Phase 4: Set Up Audacity Project

### 4.1 Create New Project
1. Open Audacity
2. File → Save Project As → `Episode_1_French_Silk_Pie.aup3`
3. Set project rate: 44100 Hz

### 4.2 Create Track Structure
Add 8 tracks (Tracks → Add New → Stereo Track):

1. **Track 1: Music** (Color: Blue)
   - Intro/outro theme
   - Background music beds

2. **Track 2: Host (Stacey)** (Color: Green)
   - All host narration

3. **Track 3: Giselle** (Color: Purple)
   - Giselle's segment

4. **Track 4: Phaedra** (Color: Lavender)
   - Phaedra's segment

5. **Track 5: Tiana** (Color: Yellow)
   - Tiana's segment

6. **Track 6: Havok** (Color: Orange)
   - Havok's segment

7. **Track 7: Sound Effects** (Color: Red)
   - Kitchen sounds, transitions

8. **Track 8: Ambience** (Color: Gray)
   - Background atmosphere

### 4.3 Add Labels Track
Tracks → Add New → Label Track

Add markers:
- `00:00` - INTRO START
- `02:30` - BEFORE WE BAKE
- `06:00` - RECIPE STORY
- `13:00` - GISELLE SEGMENT
- `15:00` - PHAEDRA SEGMENT
- `17:00` - TIANA SEGMENT
- `19:00` - HAVOK SEGMENT
- `21:00` - RECIPE WALKTHROUGH
- `30:00` - NEXT WEEK
- `32:00` - OUTRO

---

## Phase 5: Import and Arrange Audio

### 5.1 Import Host Audio
1. File → Import → Audio
2. Select all host WAV files
3. Drag to Track 2 (Host)
4. Arrange in order with gaps

### 5.2 Import Character Audio
1. Import each character's audio
2. Place on respective tracks
3. Position at correct timestamps (use labels)

### 5.3 Add Music
**Intro/Outro Theme:**
- Length: 30 seconds intro, 15 seconds outro
- Style: Cozy, whimsical, warm
- Sources: Epidemic Sound, Artlist, Uppbeat

**Background Music:**
- Story segment: Nostalgic piano/strings
- Recipe walkthrough: Upbeat, encouraging
- Keep volume LOW (-20dB to -30dB)

---

## Phase 6: Add Sound Effects

### 6.1 Essential Kitchen Sounds
Download from:
- **Freesound.org** (free, Creative Commons)
- **Zapsplat.com** (free with attribution)
- **BBC Sound Effects** (free)
- **Epidemic Sound** (subscription)

**Sounds to get:**
- Whisk in bowl
- Electric mixer
- Pouring liquid
- Knife chopping
- Oven door
- Timer beep
- Spoon stirring
- Jar opening

### 6.2 Placement
- **Before We Bake:** Match strike, candle lighting
- **Recipe Story:** Subtle kitchen ambience
- **Recipe Walkthrough:** Sound effects matching each step
- **Transitions:** Gentle chimes between segments

### 6.3 Volume Levels
- Keep SFX at -15dB to -25dB
- Don't overpower dialogue
- Use fade in/out for smooth transitions

---

## Phase 7: Mixing and Mastering

### 7.1 Balance Levels
Target levels:
- **Dialogue:** -6dB to -3dB peak
- **Music:** -20dB to -15dB
- **SFX:** -15dB to -10dB
- **Ambience:** -25dB to -20dB

### 7.2 Apply Effects

**For Each Voice Track:**
1. Effect → Noise Reduction (if needed)
2. Effect → Compressor
   - Threshold: -12dB
   - Ratio: 3:1
   - Attack: 0.2s
   - Release: 1.0s
3. Effect → Equalization
   - Boost: 100-200Hz (warmth)
   - Cut: 3-5kHz (harshness)
   - Boost: 8-12kHz (clarity)

**For Music:**
1. Effect → Compressor (gentle)
2. Effect → Fade In/Fade Out

### 7.3 Master Track
1. Select All (Ctrl+A)
2. Effect → Limiter
   - Type: Hard Limit
   - Limit to: -1.0dB
3. Effect → Normalize
   - Peak amplitude: -1.0dB

---

## Phase 8: Export

### 8.1 Export Settings
File → Export → Export Audio

**Format:** MP3
**Bit Rate:** 192 kbps (good quality, reasonable file size)
**Quality:** High
**Channels:** Stereo

**Metadata:**
- Title: "Episode 1: The Pie That Started a Dynasty"
- Artist: "Sunday Brunch With Giselle"
- Album: "Sunday Brunch With Giselle"
- Year: 2024
- Genre: Podcast

### 8.2 Quality Check
1. Listen to entire episode
2. Check for:
   - Clipping/distortion
   - Volume inconsistencies
   - Awkward transitions
   - Background noise
3. Fix issues and re-export if needed

---

## Additional Tools & Apps

### Sound Effect Libraries
1. **Freesound.org** - FREE
   - Massive library
   - Creative Commons licensed
   - High quality

2. **Zapsplat.com** - FREE
   - Professional sound effects
   - Easy search
   - Attribution required

3. **Epidemic Sound** - $15/month
   - Music + SFX
   - Commercial license included
   - Huge library

4. **Artlist** - $9.99/month
   - High-quality music
   - SFX library
   - Unlimited downloads

### Audio Enhancement Tools

1. **iZotope RX Elements** - $129
   - Professional noise reduction
   - De-click, de-hum
   - Spectral repair
   - **Worth it for podcast quality**

2. **Auphonic** - FREE tier available
   - Automatic leveling
   - Noise reduction
   - Loudness normalization
   - Upload → Process → Download

3. **Adobe Audition** - $22.99/month
   - Professional DAW
   - Better than Audacity for complex projects
   - Multitrack editing
   - Advanced effects

4. **Descript** - $12/month
   - Edit audio by editing text
   - Automatic transcription
   - Remove filler words
   - Overdub (voice cloning)

### Workflow Enhancers

1. **Reaper** - $60 (alternative to Audacity)
   - More powerful than Audacity
   - Better for complex projects
   - Customizable

2. **Hindenburg Journalist** - $95
   - Designed for podcasters
   - Automatic leveling
   - Easy workflow

3. **Ferrite Recording Studio** - iOS app
   - Record on phone
   - Basic editing
   - Good for field recording

---

## Recommended Workflow

### Budget-Friendly (Current Setup)
- **Voice:** PlayHT ($31/month)
- **DAW:** Audacity (FREE)
- **SFX:** Freesound.org (FREE)
- **Music:** Uppbeat (FREE with attribution)
- **Enhancement:** Auphonic (FREE tier)

**Total:** $31/month

### Professional Upgrade
- **Voice:** PlayHT ($31/month)
- **DAW:** Adobe Audition ($22.99/month)
- **SFX/Music:** Epidemic Sound ($15/month)
- **Enhancement:** iZotope RX Elements ($129 one-time)

**Total:** $69/month + $129 one-time

---

## Timeline Estimate

- **Voice Cloning Setup:** 2-3 hours
- **Script Preparation:** 2-4 hours
- **Audio Generation:** 4-6 hours
- **Audacity Setup:** 1 hour
- **Import & Arrange:** 2-3 hours
- **Sound Effects:** 2-3 hours
- **Mixing:** 3-4 hours
- **Mastering & Export:** 1-2 hours

**Total:** 17-26 hours for first episode
(Subsequent episodes: 10-15 hours as you get faster)

---

## Next Steps

1. ✅ Set up PlayHT account
2. ✅ Gather reference audio for character voices
3. ✅ Clone all 4 voices
4. ✅ Test with sample dialogue
5. ✅ Generate all Episode 1 audio
6. ✅ Download royalty-free music and SFX
7. ✅ Set up Audacity project
8. ✅ Import and arrange all audio
9. ✅ Mix and master
10. ✅ Export final episode

Good luck! 🎙️
