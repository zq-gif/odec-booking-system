# A-Frame Virtual Tour Starter Kit

This is a complete starter kit for building interactive 360-degree virtual tours using A-Frame.

## Features

- 360-degree panoramic image viewer
- Interactive navigation hotspots
- Clickable information points
- Smooth transitions between rooms
- Keyboard navigation support
- Mobile and VR headset compatible
- Easy to customize

## Getting Started

### 1. Add Your 360 Images

Place your 360-degree panoramic images in the `assets/images/` folder:
- `room1.jpg` - First room/location
- `room2.jpg` - Second room/location
- `room3.jpg` - Third room/location

You can add more rooms by:
1. Adding the image to `assets/images/`
2. Adding it to the `<a-assets>` section in `index.html`
3. Creating navigation hotspots to that room

### 2. Run the Project

You need a local web server to run this project. Choose one of these methods:

#### Option A: Using Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js
```bash
npm install -g http-server
http-server -p 8000
```

#### Option C: Using VS Code
Install the "Live Server" extension and click "Go Live"

Then open your browser to `http://localhost:8000`

## Project Structure

```
OdecVR/
│
├── index.html              # Main HTML file with A-Frame scene
├── js/
│   └── navigation.js       # Navigation and interaction logic
├── assets/
│   ├── images/            # 360 panoramic images and icons
│   └── sounds/            # Optional audio files
├── css/
│   └── style.css          # Optional custom styles
└── README.md              # This file
```

## Customization

### Adding More Rooms

1. Add your image to `<a-assets>`:
```html
<img id="room4" src="assets/images/room4.jpg" crossorigin="anonymous">
```

2. Create a navigation hotspot:
```html
<a-image
    src="#arrow-icon"
    position="0 1.5 -3"
    width="0.5"
    height="0.5"
    class="clickable"
    data-room="room4">
</a-image>
```

### Adding Information Hotspots

```html
<a-sphere
    position="1 2 -3"
    radius="0.2"
    color="#FFC107"
    class="clickable info-spot"
    data-info="Your information text here">
</a-sphere>
```

### Keyboard Controls

- **1, 2, 3**: Jump to rooms 1, 2, or 3
- **Mouse/Touch**: Look around
- **WASD**: Move camera (optional)
- **Click**: Interact with hotspots

## Tips for 360 Images

- Use high-resolution images (4096x2048 or higher)
- Ensure images are in equirectangular projection format
- Optimize file sizes for faster loading
- Free 360 images: [Flickr 360](https://www.flickr.com/groups/equirectangular/)

## Adding Features

### Background Audio
```html
<a-sound src="assets/sounds/ambient.mp3" autoplay="true" loop="true" volume="0.5"></a-sound>
```

### Video Tours
```html
<video id="video-tour" src="assets/video/tour.mp4" loop></video>
<a-videosphere src="#video-tour"></a-videosphere>
```

### Custom UI Overlay
Create a `css/style.css` file for custom HTML overlays outside the A-Frame scene.

## VR Support

This project works with:
- Desktop browsers (Chrome, Firefox, Edge)
- Mobile devices (iOS Safari, Android Chrome)
- VR headsets (Meta Quest, HTC Vive, etc.)

Click the VR goggles icon in the bottom-right corner to enter VR mode.

## Resources

- [A-Frame Documentation](https://aframe.io/docs/)
- [A-Frame School](https://aframe.io/aframe-school/)
- [A-Frame Examples](https://aframe.io/examples/)
- [A-Frame Components Registry](https://www.npmjs.com/search?q=aframe-component)

## Troubleshooting

**Issue**: Images don't load
- Make sure you're using a web server (not just opening the HTML file)
- Check that image paths are correct
- Verify images are in the correct format

**Issue**: VR mode not working
- Ensure you're using HTTPS (required for VR)
- Check that your browser supports WebXR

**Issue**: Performance issues
- Reduce image resolution
- Optimize image file sizes
- Remove unnecessary hotspots or animations

## License

Free to use for personal and commercial projects.

## Next Steps

1. Replace placeholder images with your own 360 photos
2. Customize hotspot positions and styles
3. Add more rooms and navigation paths
4. Enhance with custom interactions
5. Deploy to a web server

Happy building! 🚀
