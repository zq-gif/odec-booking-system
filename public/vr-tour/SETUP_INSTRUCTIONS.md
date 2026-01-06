# Setup Instructions

Complete setup guide for your OdecVR Virtual Tour project.

## What's Been Set Up

Your virtual tour starter kit is ready with:

- A-Frame 1.6.0 (latest version)
- 14 pre-loaded 360-degree scenes from your Scenes folder
- Interactive navigation system
- Keyboard shortcuts for quick scene switching
- VR support ready to go
- Customizable UI and styling

## Quick Start (Choose One Method)

### Method 1: Node.js (Recommended)

1. Install Node.js if you haven't already: https://nodejs.org/
2. Open terminal in the project folder
3. Run:
```bash
npm install
npm start
```
4. Your browser will open automatically to the tour

### Method 2: Python

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Method 3: VS Code Live Server

1. Install VS Code: https://code.visualstudio.com/
2. Install "Live Server" extension
3. Right-click [index.html](index.html)
4. Select "Open with Live Server"

### Method 4: Other Simple Servers

```bash
# PHP
php -S localhost:8000

# Ruby
ruby -run -ehttpd . -p8000
```

## Testing Your Tour

Once the server is running:

1. Open browser to `http://localhost:8000`
2. You should see the entrance scene
3. Try the keyboard shortcuts (0-9, Q, W, E, R)
4. Click on the colored circles to navigate
5. Look around with your mouse
6. Click the VR icon (bottom-right) to test VR mode

## Project Files Overview

```
OdecVR/
├── index.html              ← Main tour file (edit this to customize)
├── js/
│   └── navigation.js       ← Navigation logic and interactions
├── css/
│   └── style.css          ← UI styling
├── Scenes/                 ← Your 14 360° images (already loaded!)
│   ├── entrance.jpg
│   ├── parking 1.jpg
│   ├── parking 2.jpg
│   ├── main 1.jpg
│   ├── main 2.jpg
│   ├── main 3.jpg
│   ├── main 4.jpg
│   ├── main 5.jpg
│   ├── Jetty UMS.jpg
│   ├── platform 1.jpg
│   ├── platform 2.jpg
│   ├── campsite 1.jpg
│   ├── campsite 2.jpg
│   └── campsite 3.jpg
├── assets/                 ← Additional assets (icons, sounds, etc.)
├── QUICKSTART.md          ← Quick reference
├── SCENES_GUIDE.md        ← Guide to your 14 scenes
└── README.md              ← Full documentation
```

## Customization Checklist

### 1. Adjust Starting Scene

Currently starts at "entrance". To change:

In [index.html:34](index.html#L34), change:
```html
<a-sky id="image-360" src="#entrance" ...>
```
to:
```html
<a-sky id="image-360" src="#main1" ...>
```

### 2. Position Navigation Hotspots

The example hotspots at lines 51-84 in [index.html](index.html#L51-L84) need positioning based on your actual scenes.

For each scene:
1. Load it in the browser
2. Look around to find natural transition points
3. Note the direction you're looking
4. Add a hotspot in that direction

### 3. Create Logical Tour Flow

Suggested flow (see [SCENES_GUIDE.md](SCENES_GUIDE.md)):
- Entrance → Parking → Main Areas → Jetty → Platform → Campsite

### 4. Add Information Hotspots

Add descriptions to points of interest:
```html
<a-sphere
    position="2 1.8 -4"
    radius="0.15"
    color="#FFC107"
    class="clickable info-spot"
    data-info="This is the main gathering area">
</a-sphere>
```

### 5. Customize Styling

Edit [css/style.css](css/style.css) to:
- Change colors
- Adjust UI overlay
- Modify button styles
- Add your logo

### 6. Add Sound/Music (Optional)

```html
<a-sound src="assets/sounds/ambient.mp3" autoplay="true" loop="true" volume="0.3"></a-sound>
```

## Controls Reference

### Mouse/Touch
- **Drag**: Look around 360°
- **Click**: Interact with hotspots
- **Scroll**: Zoom (if enabled)

### Keyboard
- **0**: Entrance
- **1-2**: Parking areas
- **3-7**: Main areas (1-5)
- **8**: Jetty
- **9, Q**: Platform areas
- **W, E, R**: Campsite areas

### VR Mode
- Click VR icon (bottom-right corner)
- Use VR headset controls to look around
- Use controller trigger to select hotspots

## Troubleshooting

### Images Don't Load
- ✅ Check you're using a web server (not file://)
- ✅ Verify filenames match exactly (case-sensitive)
- ✅ Check browser console (F12) for errors

### Blank Screen
- ✅ Check internet connection (A-Frame loads from CDN)
- ✅ Try a different browser
- ✅ Check console for JavaScript errors

### Performance Issues
Your images might be very high resolution. To optimize:
1. Resize images to max 4096x2048 pixels
2. Compress using tools like:
   - TinyJPG.com
   - ImageOptim (Mac)
   - RIOT (Windows)
3. Target file size: 1-3 MB per image

### VR Mode Not Working
- ✅ Use HTTPS in production (required for WebXR)
- ✅ Check browser supports WebXR
- ✅ Test on compatible VR headset

## Deployment

### Quick Deployment Options

1. **Netlify** (Free, Easy)
   - Drag & drop the entire folder to netlify.com/drop
   - Get instant URL

2. **GitHub Pages** (Free)
   ```bash
   git init
   git add .
   git commit -m "Initial virtual tour"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
   Then enable GitHub Pages in repo settings

3. **Vercel** (Free)
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow prompts

## Next Steps

1. ✅ Test the tour with current setup
2. ✅ Read [SCENES_GUIDE.md](SCENES_GUIDE.md) to understand your 14 scenes
3. ✅ Position hotspots for natural flow between scenes
4. ✅ Add information hotspots with descriptions
5. ✅ Customize colors and styling
6. ✅ Test on mobile devices
7. ✅ Test VR mode if you have a headset
8. ✅ Deploy to web hosting

## Need Help?

- Check [README.md](README.md) for detailed documentation
- See [QUICKSTART.md](QUICKSTART.md) for quick reference
- A-Frame docs: https://aframe.io/docs/
- A-Frame Discord: https://discord.gg/aframe

## Credits

Built with A-Frame - https://aframe.io/

Enjoy building your virtual tour! 🎉
