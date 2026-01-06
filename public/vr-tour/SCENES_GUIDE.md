# Virtual Tour Scenes Guide

Your virtual tour includes 14 different 360-degree scenes from your location.

## Available Scenes

| Key | Scene ID | Filename | Description |
|-----|----------|----------|-------------|
| 0 | entrance | entrance.jpg | Entrance area |
| 1 | parking1 | parking 1.jpg | Parking area - View 1 |
| 2 | parking2 | parking 2.jpg | Parking area - View 2 |
| 3 | main1 | main 1.jpg | Main area - View 1 |
| 4 | main2 | main 2.jpg | Main area - View 2 |
| 5 | main3 | main 3.jpg | Main area - View 3 |
| 6 | main4 | main 4.jpg | Main area - View 4 |
| 7 | main5 | main 5.jpg | Main area - View 5 |
| 8 | jetty | Jetty UMS.jpg | Jetty area |
| 9 | platform1 | platform 1.jpg | Platform - View 1 |
| Q | platform2 | platform 2.jpg | Platform - View 2 |
| W | campsite1 | campsite 1.jpg | Campsite - View 1 |
| E | campsite2 | campsite 2.jpg | Campsite - View 2 |
| R | campsite3 | campsite 3.jpg | Campsite - View 3 |

## Navigation Flow Suggestions

Here's a recommended tour flow:

1. **Start**: Entrance (0)
2. **Parking**: parking1 (1) → parking2 (2)
3. **Main Area**: main1 (3) → main2 (4) → main3 (5) → main4 (6) → main5 (7)
4. **Waterfront**: jetty (8)
5. **Platform**: platform1 (9) → platform2 (Q)
6. **Campsite**: campsite1 (W) → campsite2 (E) → campsite3 (R)

## Adding Navigation Hotspots

To create a logical tour flow, you'll want to add navigation hotspots in each scene that link to the next location. Here's how:

### Example: Add hotspot in entrance.jpg to go to parking1

In [index.html](index.html), add this inside the `<a-scene>`:

```html
<a-circle
    position="1 1.5 -3"
    radius="0.3"
    color="#4CAF50"
    class="clickable"
    event-set__mouseenter="scale: 1.2 1.2 1.2"
    event-set__mouseleave="scale: 1 1 1"
    data-room="parking1"
    data-label="To Parking">
</a-circle>
```

### Positioning Tips

- **position="x y z"**:
  - x: left (-) to right (+)
  - y: down (-) to up (+)
  - z: forward (+) to back (-)
- Place hotspots at z=-3 to z=-5 for comfortable viewing distance
- Keep y between 1.0 and 2.5 for natural eye level

## Color Coding Suggestions

Use different colors to indicate different area types:

- **Green (#4CAF50)**: Nature areas (campsite, entrance)
- **Blue (#2196F3)**: Main areas
- **Orange (#FF9800)**: Parking/service areas
- **Purple (#9C27B0)**: Special features (jetty, platform)

## Scene-Specific Navigation Logic

You can add conditional logic in [js/navigation.js](js/navigation.js) to show different hotspots based on the current scene:

```javascript
// Show/hide hotspots based on current scene
function updateHotspots(currentRoom) {
    // Hide all hotspots first
    document.querySelectorAll('.navigation-hotspot').forEach(el => {
        el.setAttribute('visible', false);
    });

    // Show relevant hotspots for current room
    if (currentRoom === 'entrance') {
        // Show path to parking
        document.querySelector('[data-room="parking1"]').setAttribute('visible', true);
    }
    // Add more conditions for other rooms...
}
```

## Next Steps

1. View each 360 image and note where natural paths/doorways are
2. Add navigation hotspots at those locations
3. Test the flow by navigating through the tour
4. Adjust positions and add labels as needed
5. Consider adding info hotspots with descriptions of each area
