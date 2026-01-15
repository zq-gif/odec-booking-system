// Virtual Tour Navigation Script
console.error('✅ navigation.js file loaded!');
console.error('✅ Script is running!');

// Wait for A-Frame to initialize
document.addEventListener('DOMContentLoaded', function() {
    console.error('✅ DOMContentLoaded event fired!');
    const scene = document.querySelector('a-scene');

    // Wait for A-Frame scene to fully load
    scene.addEventListener('loaded', function() {
        console.error('✅ A-Frame scene loaded!');
        const sky = document.querySelector('#image-360');
        const camera = document.querySelector('#camera');
        let currentRoom = 'entrance'; // Starting room

        // Camera view persistence - restore saved rotation on page load
        const savedRotation = localStorage.getItem('cameraRotation');
        if (savedRotation) {
            const rotation = JSON.parse(savedRotation);
            camera.setAttribute('rotation', rotation);
            console.error('Restored camera rotation:', rotation);
        }

        // Save camera rotation periodically (every 2 seconds)
        setInterval(() => {
            const rotation = camera.getAttribute('rotation');
            localStorage.setItem('cameraRotation', JSON.stringify(rotation));
        }, 2000);

        // Initialize - show correct navigation on load
        updateNavigation(currentRoom);

        // Handle room navigation - attach event listeners after scene is loaded
        const clickableElements = document.querySelectorAll('.clickable');
        console.error('✅ Found ' + clickableElements.length + ' clickable elements');

        clickableElements.forEach(element => {
            element.addEventListener('click', function() {
                const roomId = this.getAttribute('data-room');
                const infoText = this.getAttribute('data-info');
                const action = this.getAttribute('data-action');

                // Debug logging
                console.error('🖱️ CLICKED element:', this.tagName);
                console.error('📍 Position:', this.getAttribute('position'));
                console.error('🎯 Target room:', roomId);
                console.error('🎬 Action:', action);

                if (action === 'showMap') {
                    // Show the map panel
                    showMap();
                } else if (action === 'closeMap') {
                    // Close the map panel
                    closeMap();
                } else if (roomId) {
                    // Navigate to a different room
                    navigateToRoom(roomId);
                } else if (infoText) {
                    // Show information
                    showInfo(infoText);
                }
            });
        });

        console.error('✅ Event listeners attached to all clickable elements');

    // Function to update which navigation hotspots are visible
    function updateNavigation(roomId) {
        // Hide all navigation groups (14 scenes total, including platform2)
        const allNavGroups = [
            'nav-jetty', 'nav-entrance', 'nav-parking2', 'nav-parking1',
            'nav-main5', 'nav-main4', 'nav-main3', 'nav-main2', 'nav-main1',
            'nav-platform1', 'nav-platform2',
            'nav-campsite3', 'nav-campsite2', 'nav-campsite1'
        ];

        allNavGroups.forEach(navId => {
            const navElement = document.querySelector('#' + navId);
            if (navElement) {
                navElement.setAttribute('visible', 'false');
            }
        });

        // Show the navigation group for the current room
        const currentNavElement = document.querySelector('#nav-' + roomId);
        if (currentNavElement) {
            currentNavElement.setAttribute('visible', 'true');
        }

        // Update current room
        currentRoom = roomId;
        console.log('Current room:', currentRoom);
    }

    // Function to change the 360 panorama
    function navigateToRoom(roomId) {
        console.log('Navigating to:', roomId);

        // Fade out effect
        sky.setAttribute('animation', {
            property: 'opacity',
            to: 0,
            dur: 500,
            easing: 'easeInOutQuad'
        });

        // Change the sky source after fade out
        setTimeout(() => {
            sky.setAttribute('src', '#' + roomId);

            // Update navigation hotspots
            updateNavigation(roomId);

            // Fade in effect
            sky.setAttribute('animation', {
                property: 'opacity',
                to: 1,
                dur: 500,
                easing: 'easeInOutQuad'
            });

            console.log('Navigated to:', roomId);
        }, 500);
    }

    // Function to display information
    function showInfo(text) {
        console.log('Info:', text);

        // Create a text entity in the scene
        const infoText = document.createElement('a-text');
        infoText.setAttribute('value', text);
        infoText.setAttribute('position', '0 2.5 -3');
        infoText.setAttribute('align', 'center');
        infoText.setAttribute('color', '#FFF');
        infoText.setAttribute('width', '4');
        infoText.setAttribute('background', '#000000');
        infoText.setAttribute('opacity', '0.8');

        document.querySelector('a-scene').appendChild(infoText);

        // Remove after 3 seconds
        setTimeout(() => {
            infoText.remove();
        }, 3000);
    }

    // Function to show the beach map panel
    function showMap() {
        console.log('🗺️ Opening map panel');
        const mapPanel = document.querySelector('#map-panel');
        if (mapPanel) {
            mapPanel.setAttribute('visible', 'true');
            // Add fade-in animation
            mapPanel.setAttribute('animation', {
                property: 'scale',
                from: '0.1 0.1 0.1',
                to: '1 1 1',
                dur: 300,
                easing: 'easeOutBack'
            });
        }
    }

    // Function to close/hide the beach map panel
    function closeMap() {
        console.log('🗺️ Closing map panel');
        const mapPanel = document.querySelector('#map-panel');
        if (mapPanel) {
            // Add fade-out animation
            mapPanel.setAttribute('animation', {
                property: 'scale',
                from: '1 1 1',
                to: '0.1 0.1 0.1',
                dur: 200,
                easing: 'easeInBack'
            });
            // Hide after animation
            setTimeout(() => {
                mapPanel.setAttribute('visible', 'false');
            }, 200);
        }
    }

    // Keyboard navigation for direct scene access
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();

        // Direct scene access with number and letter keys
        const keyMap = {
            '1': 'jetty',
            '2': 'entrance',
            '3': 'parking2',
            '4': 'parking1',
            '5': 'main5',
            '6': 'main4',
            '7': 'main3',
            '8': 'main2',
            '9': 'main1',
            '0': 'platform1',
            'q': 'platform2',
            'w': 'campsite3',
            'e': 'campsite2',
            'r': 'campsite1'
        };

        if (keyMap[key]) {
            navigateToRoom(keyMap[key]);
            console.error('⌨️ Keyboard shortcut: ' + key + ' → ' + keyMap[key]);
        }

        // Map toggle with 'M' key (only works in Main 3 scene)
        if (key === 'm' && currentRoom === 'main3') {
            const mapPanel = document.querySelector('#map-panel');
            if (mapPanel) {
                const isVisible = mapPanel.getAttribute('visible') === 'true';
                if (isVisible) {
                    closeMap();
                } else {
                    showMap();
                }
                console.error('⌨️ Map toggled with M key');
            }
        }
    });

    console.error('✅ Virtual Tour initialized successfully!');
    console.error('⌨️ Keyboard shortcuts enabled:');
    console.error('   1-9, 0, Q, W, E, R: Direct scene access');
    console.error('   M: Toggle map (in Main 3 scene)');
    console.log('Tour flow (14 scenes): Jetty → Entrance → Parking 2 → Parking 1 → Main 5-1 → Platform 1-2 → Campsite 3-1');
    }); // Close scene.addEventListener('loaded')
}); // Close DOMContentLoaded

// Optional: Track user interactions for analytics
function trackInteraction(action, target) {
    console.log('Interaction:', action, 'Target:', target);
    // Add your analytics code here
}
