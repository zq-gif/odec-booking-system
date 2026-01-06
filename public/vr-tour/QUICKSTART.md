# Quick Start Guide

Get your virtual tour running in 3 simple steps!

## Step 1: Add Your 360 Images

1. Get some 360-degree panoramic images (equirectangular format)
2. Rename them to: `room1.jpg`, `room2.jpg`, `room3.jpg`
3. Place them in the `assets/images/` folder

**Don't have 360 images yet?** Download free samples from:
- [Sample 1](https://www.flickr.com/groups/equirectangular/) - Flickr 360 images
- [Sample 2](https://polyhaven.com/hdris) - Poly Haven HDRIs

## Step 2: Start a Local Server

Choose one of these methods:

### Option A: Using npm (Recommended)
```bash
npm install
npm start
```

### Option B: Using Python
```bash
python -m http.server 8000
```

### Option C: Using VS Code
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Step 3: Open in Browser

Navigate to: `http://localhost:8000`

That's it! 🎉

## Controls

- **Mouse**: Look around
- **Click**: Interact with hotspots
- **Keys 1, 2, 3**: Jump between rooms
- **VR Icon** (bottom-right): Enter VR mode

## Next Steps

1. Customize hotspot positions in [index.html](index.html)
2. Adjust navigation logic in [js/navigation.js](js/navigation.js)
3. Style the UI in [css/style.css](css/style.css)
4. Add more rooms and features!

## Need Help?

Check out the full [README.md](README.md) for detailed documentation.

## Common Issues

**Images not loading?**
- Make sure you're using a web server (not just opening the HTML file)
- Check that images are named correctly: `room1.jpg`, `room2.jpg`, `room3.jpg`

**Page is blank?**
- Open browser console (F12) to check for errors
- Verify A-Frame is loading from CDN (check your internet connection)

**VR mode not working?**
- VR requires HTTPS in production
- Make sure your browser supports WebXR
