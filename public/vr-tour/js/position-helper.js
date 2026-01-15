// Hotspot Position Helper - JavaScript Version
// Usage: Load this script in your browser console or add to index.html

(function() {
    'use strict';

    // Create control panel UI
    function createControlPanel() {
        // Remove existing panel if any
        const existingPanel = document.getElementById('position-helper-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'position-helper-panel';
        panel.innerHTML = `
            <style>
                #position-helper-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.9);
                    padding: 20px;
                    border-radius: 10px;
                    color: white;
                    z-index: 10000;
                    min-width: 300px;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                }

                #position-helper-panel h3 {
                    margin-top: 0;
                    color: #00E676;
                    font-size: 18px;
                }

                .ph-control {
                    margin-bottom: 15px;
                }

                .ph-label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #00E676;
                    font-size: 13px;
                }

                .ph-slider {
                    width: 100%;
                    margin-bottom: 5px;
                }

                .ph-value {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 5px;
                    border-radius: 3px;
                    text-align: center;
                    font-family: monospace;
                    font-size: 14px;
                }

                .ph-coords {
                    background: #00E676;
                    color: black;
                    padding: 12px;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                    word-break: break-all;
                    cursor: pointer;
                }

                .ph-coords:hover {
                    background: #00C853;
                }

                .ph-btn {
                    width: 100%;
                    padding: 10px;
                    background: #00E676;
                    color: black;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 8px;
                }

                .ph-btn:hover {
                    background: #00C853;
                }

                .ph-btn.close {
                    background: #FF5252;
                    color: white;
                }

                .ph-btn.close:hover {
                    background: #D32F2F;
                }

                .ph-info {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 11px;
                    margin-top: 10px;
                }
            </style>

            <h3>🎯 Position Helper</h3>

            <div class="ph-control">
                <span class="ph-label">X (Left ← → Right)</span>
                <input type="range" class="ph-slider" id="ph-x" min="-10" max="10" step="0.01" value="0">
                <input type="number" class="ph-value" id="ph-x-val" step="0.01" value="0" style="width:100%; cursor:text;">
            </div>

            <div class="ph-control">
                <span class="ph-label">Y (Down ↓ ↑ Up)</span>
                <input type="range" class="ph-slider" id="ph-y" min="-2" max="5" step="0.01" value="0.05">
                <input type="number" class="ph-value" id="ph-y-val" step="0.01" value="0.05" style="width:100%; cursor:text;">
            </div>

            <div class="ph-control">
                <span class="ph-label">Z (Far ← → Near)</span>
                <input type="range" class="ph-slider" id="ph-z" min="-20" max="0" step="0.01" value="-3">
                <input type="number" class="ph-value" id="ph-z-val" step="0.01" value="-3" style="width:100%; cursor:text;">
            </div>

            <div class="ph-coords" id="ph-coords" title="Click to copy">
                position="0 0.05 -3"
            </div>

            <button class="ph-btn" id="ph-copy">📋 Copy Position</button>
            <button class="ph-btn" id="ph-click-mode">🎯 Click to Place Mode</button>
            <button class="ph-btn" id="ph-reset">🔄 Reset</button>
            <button class="ph-btn" id="ph-console">📝 Log to Console</button>
            <button class="ph-btn close" id="ph-close">✖ Close Helper</button>

            <div class="ph-info" id="ph-info">
                Move sliders or type values to adjust.<br>
                Click "Click to Place" to position by clicking in scene.
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // Create test hotspot
    function createTestHotspot() {
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error('A-Frame scene not found!');
            return null;
        }

        // Remove existing test hotspot
        const existingHotspot = document.getElementById('test-hotspot');
        if (existingHotspot) {
            existingHotspot.remove();
        }

        // Create container
        const container = document.createElement('a-entity');
        container.id = 'test-hotspot';

        // Create ring
        const ring = document.createElement('a-ring');
        ring.setAttribute('position', '0 0.05 -3');
        ring.setAttribute('rotation', '-90 0 0');
        ring.setAttribute('radius-inner', '0.4');
        ring.setAttribute('radius-outer', '0.6');
        ring.setAttribute('color', '#00E676');
        ring.setAttribute('opacity', '0.85');

        // Add pulse animation
        ring.innerHTML = `
            <a-animation attribute="scale" from="1 1 1" to="1.25 1.25 1.25"
                direction="alternate" dur="1200" repeat="indefinite"
                easing="ease-in-out-sine"></a-animation>
            <a-animation attribute="opacity" from="0.85" to="0.4"
                direction="alternate" dur="1200" repeat="indefinite"
                easing="ease-in-out-sine"></a-animation>
        `;

        // Create center circle
        const circle = document.createElement('a-circle');
        circle.setAttribute('position', '0 0.06 -3');
        circle.setAttribute('rotation', '-90 0 0');
        circle.setAttribute('radius', '0.35');
        circle.setAttribute('color', '#FFFFFF');
        circle.setAttribute('opacity', '0.95');

        // Add arrow
        circle.innerHTML = `
            <a-text value="▶" align="center" position="0 0 0.01"
                scale="1.5 1.5 1.5" color="#00E676" rotation="0 0 -90"></a-text>
        `;

        container.appendChild(ring);
        container.appendChild(circle);
        scene.appendChild(container);

        return { ring, circle };
    }

    // Initialize helper
    function init() {
        console.log('🎯 Initializing Position Helper...');

        const panel = createControlPanel();
        const hotspot = createTestHotspot();

        if (!hotspot) {
            console.error('Failed to create test hotspot!');
            return;
        }

        const { ring, circle } = hotspot;

        // Get controls
        const xSlider = document.getElementById('ph-x');
        const ySlider = document.getElementById('ph-y');
        const zSlider = document.getElementById('ph-z');

        const xVal = document.getElementById('ph-x-val');
        const yVal = document.getElementById('ph-y-val');
        const zVal = document.getElementById('ph-z-val');

        const coords = document.getElementById('ph-coords');
        const copyBtn = document.getElementById('ph-copy');
        const clickModeBtn = document.getElementById('ph-click-mode');
        const resetBtn = document.getElementById('ph-reset');
        const consoleBtn = document.getElementById('ph-console');
        const closeBtn = document.getElementById('ph-close');
        const infoDiv = document.getElementById('ph-info');

        let clickPlaceMode = false;
        const scene = document.querySelector('a-scene');
        const camera = document.querySelector('#camera');

        // Update position function
        function updatePosition() {
            const x = parseFloat(xSlider.value);
            const y = parseFloat(ySlider.value);
            const z = parseFloat(zSlider.value);

            ring.setAttribute('position', `${x} ${y} ${z}`);
            circle.setAttribute('position', `${x} ${y + 0.01} ${z}`);

            xVal.value = x.toFixed(2);
            yVal.value = y.toFixed(2);
            zVal.value = z.toFixed(2);

            coords.textContent = `position="${x} ${y} ${z}"`;

            return { x, y, z };
        }

        // Update from number input
        function updateFromInput() {
            xSlider.value = parseFloat(xVal.value);
            ySlider.value = parseFloat(yVal.value);
            zSlider.value = parseFloat(zVal.value);
            updatePosition();
        }

        // Copy to clipboard
        function copyToClipboard() {
            const text = coords.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Position';
                }, 2000);
            });
        }

        // Reset to default
        function reset() {
            xSlider.value = 0;
            ySlider.value = 0.05;
            zSlider.value = -3;
            xVal.value = 0;
            yVal.value = 0.05;
            zVal.value = -3;
            updatePosition();
        }

        // Log to console
        function logToConsole() {
            const pos = updatePosition();
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📍 Current Hotspot Position:');
            console.log(`   X: ${pos.x.toFixed(2)}`);
            console.log(`   Y: ${pos.y.toFixed(2)}`);
            console.log(`   Z: ${pos.z.toFixed(2)}`);
            console.log('');
            console.log('📋 Code to copy:');
            console.log(`   position="${pos.x} ${pos.y} ${pos.z}"`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        // Click to place mode
        function toggleClickPlaceMode() {
            clickPlaceMode = !clickPlaceMode;

            if (clickPlaceMode) {
                clickModeBtn.textContent = '✅ Click Mode ON (Click scene)';
                clickModeBtn.style.background = '#FF5252';
                clickModeBtn.style.color = 'white';
                infoDiv.innerHTML = '<strong>CLICK MODE ACTIVE!</strong><br>Click anywhere in the 360° scene to place hotspot.';
                infoDiv.style.background = 'rgba(255, 82, 82, 0.2)';
                console.log('🎯 Click to Place Mode ENABLED');
            } else {
                clickModeBtn.textContent = '🎯 Click to Place Mode';
                clickModeBtn.style.background = '#00E676';
                clickModeBtn.style.color = 'black';
                infoDiv.innerHTML = 'Move sliders or type values to adjust.<br>Click "Click to Place" to position by clicking in scene.';
                infoDiv.style.background = 'rgba(255, 255, 255, 0.1)';
                console.log('🎯 Click to Place Mode DISABLED');
            }
        }

        // Handle scene click
        function handleSceneClick(event) {
            if (!clickPlaceMode) return;

            // Get camera rotation
            const cameraRotation = camera.getAttribute('rotation');
            const cameraPosition = camera.getAttribute('position');

            // Calculate direction based on camera rotation (simple conversion)
            const degToRad = (deg) => deg * (Math.PI / 180);
            const pitch = degToRad(-cameraRotation.x);
            const yaw = degToRad(cameraRotation.y);

            // Calculate position in front of camera
            const distance = 3; // Default distance
            const x = Math.sin(yaw) * Math.cos(pitch) * distance;
            const y = Math.sin(pitch) * distance + cameraPosition.y;
            const z = -Math.cos(yaw) * Math.cos(pitch) * distance;

            // Update sliders and inputs
            xSlider.value = x.toFixed(2);
            ySlider.value = y.toFixed(2);
            zSlider.value = z.toFixed(2);

            xVal.value = x.toFixed(2);
            yVal.value = y.toFixed(2);
            zVal.value = z.toFixed(2);

            updatePosition();

            // Flash effect
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 230, 118, 0.5);
                width: 100px;
                height: 100px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10001;
                animation: flashPulse 0.5s ease-out;
            `;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 500);

            console.log(`📍 Hotspot placed at: X=${x.toFixed(2)}, Y=${y.toFixed(2)}, Z=${z.toFixed(2)}`);
        }

        // Add CSS animation for flash
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flashPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Close helper
        function close() {
            clickPlaceMode = false;
            scene.removeEventListener('click', handleSceneClick);
            panel.remove();
            const testHotspot = document.getElementById('test-hotspot');
            if (testHotspot) {
                testHotspot.remove();
            }
            console.log('✅ Position Helper closed');
        }

        // Event listeners for sliders
        xSlider.addEventListener('input', updatePosition);
        ySlider.addEventListener('input', updatePosition);
        zSlider.addEventListener('input', updatePosition);

        // Event listeners for number inputs
        xVal.addEventListener('input', updateFromInput);
        yVal.addEventListener('input', updateFromInput);
        zVal.addEventListener('input', updateFromInput);

        copyBtn.addEventListener('click', copyToClipboard);
        coords.addEventListener('click', copyToClipboard);
        clickModeBtn.addEventListener('click', toggleClickPlaceMode);
        resetBtn.addEventListener('click', reset);
        consoleBtn.addEventListener('click', logToConsole);
        closeBtn.addEventListener('click', close);

        // Listen for clicks on the scene
        scene.addEventListener('click', handleSceneClick);

        // Initialize
        updatePosition();

        console.log('✅ Position Helper ready!');
        console.log('Use sliders to adjust hotspot position.');
        console.log('Type "closeHelper()" in console to close.');

        // Make close function global
        window.closeHelper = close;
    }

    // Keyboard shortcut to toggle helper
    let isHelperOpen = false;

    function toggleHelper() {
        const existingPanel = document.getElementById('position-helper-panel');

        if (existingPanel) {
            // Close if already open
            existingPanel.remove();
            const testHotspot = document.getElementById('test-hotspot');
            if (testHotspot) testHotspot.remove();
            isHelperOpen = false;
            console.log('✅ Position Helper closed');
        } else {
            // Open if closed
            init();
            isHelperOpen = true;
            console.log('🎯 Position Helper opened (Press H to close)');
        }
    }

    // Listen for 'H' key press
    document.addEventListener('keydown', function(event) {
        // Check if H key is pressed (not in input field)
        if (event.key === 'h' || event.key === 'H') {
            // Don't trigger if user is typing in an input field
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                event.preventDefault();
                toggleHelper();
            }
        }
    });

    // Export to global scope
    window.PositionHelper = {
        open: init,
        close: function() {
            const panel = document.getElementById('position-helper-panel');
            if (panel) panel.remove();
            const hotspot = document.getElementById('test-hotspot');
            if (hotspot) hotspot.remove();
            isHelperOpen = false;
        },
        toggle: toggleHelper
    };

    console.log('📦 Position Helper loaded!');
    console.log('💡 Press "H" key to open/close the helper');
    console.log('Or type "PositionHelper.open()" to activate manually.');

    // ========================================
    // MAP BUTTON POSITION HELPER
    // ========================================

    // Create Map Button Position Helper Panel
    function createMapButtonPanel() {
        const existingPanel = document.getElementById('map-button-helper-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'map-button-helper-panel';
        panel.innerHTML = `
            <style>
                #map-button-helper-panel {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(255, 87, 34, 0.95));
                    padding: 20px;
                    border-radius: 15px;
                    color: white;
                    z-index: 10000;
                    min-width: 320px;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 8px 32px rgba(255, 152, 0, 0.4);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                #map-button-helper-panel h3 {
                    margin-top: 0;
                    color: white;
                    font-size: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }

                .mb-control {
                    margin-bottom: 15px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 10px;
                    border-radius: 8px;
                }

                .mb-label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #FFF;
                    font-size: 13px;
                }

                .mb-slider {
                    width: 100%;
                    margin-bottom: 5px;
                    height: 8px;
                    -webkit-appearance: none;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }

                .mb-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #FFF;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }

                .mb-value {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 8px;
                    border-radius: 5px;
                    text-align: center;
                    font-family: monospace;
                    font-size: 14px;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                }

                .mb-coords {
                    background: white;
                    color: #FF5722;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                    word-break: break-all;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .mb-coords:hover {
                    background: #FFF8E1;
                }

                .mb-btn {
                    width: 100%;
                    padding: 12px;
                    background: white;
                    color: #FF5722;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                }

                .mb-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .mb-btn.apply {
                    background: #4CAF50;
                    color: white;
                }

                .mb-btn.close {
                    background: #F44336;
                    color: white;
                }

                .mb-info {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    margin-top: 10px;
                    line-height: 1.5;
                }

                .mb-preset {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 10px;
                }

                .mb-preset button {
                    flex: 1;
                    padding: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 5px;
                    font-size: 11px;
                    cursor: pointer;
                }

                .mb-preset button:hover {
                    background: rgba(255,255,255,0.3);
                }
            </style>

            <h3>🗺️ Map Button Position Helper</h3>

            <div class="mb-preset">
                <button id="mb-preset-front">Front</button>
                <button id="mb-preset-left">Left</button>
                <button id="mb-preset-right">Right</button>
                <button id="mb-preset-top">Top</button>
            </div>

            <div class="mb-control">
                <span class="mb-label">X Position (Left ← → Right)</span>
                <input type="range" class="mb-slider" id="mb-x" min="-10" max="10" step="0.1" value="0">
                <input type="number" class="mb-value" id="mb-x-val" step="0.1" value="0" style="width:100%;">
            </div>

            <div class="mb-control">
                <span class="mb-label">Y Position (Down ↓ ↑ Up)</span>
                <input type="range" class="mb-slider" id="mb-y" min="0" max="6" step="0.1" value="3">
                <input type="number" class="mb-value" id="mb-y-val" step="0.1" value="3" style="width:100%;">
            </div>

            <div class="mb-control">
                <span class="mb-label">Z Position (Near ← → Far)</span>
                <input type="range" class="mb-slider" id="mb-z" min="-15" max="15" step="0.1" value="-6">
                <input type="number" class="mb-value" id="mb-z-val" step="0.1" value="-6" style="width:100%;">
            </div>

            <div class="mb-coords" id="mb-coords" title="Click to copy">
                position="0 3 -6"
            </div>

            <button class="mb-btn" id="mb-copy">📋 Copy Position</button>
            <button class="mb-btn apply" id="mb-apply">✅ Apply to Map Button</button>
            <button class="mb-btn" id="mb-console">📝 Log Code Snippet</button>
            <button class="mb-btn close" id="mb-close">✖ Close Helper</button>

            <div class="mb-info">
                <strong>Instructions:</strong><br>
                1. Adjust sliders to move the test button<br>
                2. Click "Apply" to update the actual map button<br>
                3. Copy the position to update index.html<br>
                <strong>Press 'B' key to toggle this helper</strong>
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // Create test map button (orange circle)
    function createTestMapButton() {
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error('A-Frame scene not found!');
            return null;
        }

        const existingTest = document.getElementById('test-map-button');
        if (existingTest) {
            existingTest.remove();
        }

        const container = document.createElement('a-entity');
        container.id = 'test-map-button';
        container.setAttribute('position', '0 3 -6');

        container.innerHTML = `
            <!-- Outer glow ring -->
            <a-ring
                radius-inner="0.85"
                radius-outer="1.0"
                color="#FFC107"
                opacity="0.7">
                <a-animation
                    attribute="opacity"
                    from="0.7"
                    to="0.3"
                    direction="alternate"
                    dur="800"
                    repeat="indefinite"
                    easing="ease-in-out-sine">
                </a-animation>
            </a-ring>
            <!-- Button background circle -->
            <a-circle
                radius="0.8"
                color="#FF9800"
                opacity="0.95">
                <a-animation
                    attribute="scale"
                    from="1 1 1"
                    to="1.2 1.2 1.2"
                    direction="alternate"
                    dur="800"
                    repeat="indefinite"
                    easing="ease-in-out-sine">
                </a-animation>
            </a-circle>
            <!-- Map text -->
            <a-text
                value="MAP"
                align="center"
                position="0 0 0.02"
                scale="1.5 1.5 1.5"
                color="#FFFFFF">
            </a-text>
            <!-- Label below -->
            <a-text
                value="(TEST)"
                align="center"
                position="0 -1.2 0"
                scale="0.8 0.8 0.8"
                color="#FFEB3B">
            </a-text>
        `;

        scene.appendChild(container);
        return container;
    }

    // Initialize Map Button Helper
    function initMapButtonHelper() {
        console.log('🗺️ Initializing Map Button Position Helper...');

        const panel = createMapButtonPanel();
        const testButton = createTestMapButton();

        if (!testButton) {
            console.error('Failed to create test map button!');
            return;
        }

        // Get controls
        const xSlider = document.getElementById('mb-x');
        const ySlider = document.getElementById('mb-y');
        const zSlider = document.getElementById('mb-z');
        const xVal = document.getElementById('mb-x-val');
        const yVal = document.getElementById('mb-y-val');
        const zVal = document.getElementById('mb-z-val');
        const coords = document.getElementById('mb-coords');
        const copyBtn = document.getElementById('mb-copy');
        const applyBtn = document.getElementById('mb-apply');
        const consoleBtn = document.getElementById('mb-console');
        const closeBtn = document.getElementById('mb-close');

        // Preset buttons
        const presetFront = document.getElementById('mb-preset-front');
        const presetLeft = document.getElementById('mb-preset-left');
        const presetRight = document.getElementById('mb-preset-right');
        const presetTop = document.getElementById('mb-preset-top');

        // Update position function
        function updatePosition() {
            const x = parseFloat(xSlider.value);
            const y = parseFloat(ySlider.value);
            const z = parseFloat(zSlider.value);

            testButton.setAttribute('position', `${x} ${y} ${z}`);

            xVal.value = x.toFixed(1);
            yVal.value = y.toFixed(1);
            zVal.value = z.toFixed(1);

            coords.textContent = `position="${x} ${y} ${z}"`;

            return { x, y, z };
        }

        // Update from number input
        function updateFromInput() {
            xSlider.value = parseFloat(xVal.value);
            ySlider.value = parseFloat(yVal.value);
            zSlider.value = parseFloat(zVal.value);
            updatePosition();
        }

        // Preset positions
        function setPreset(x, y, z) {
            xSlider.value = x;
            ySlider.value = y;
            zSlider.value = z;
            xVal.value = x;
            yVal.value = y;
            zVal.value = z;
            updatePosition();
        }

        presetFront.addEventListener('click', () => setPreset(0, 3, -6));
        presetLeft.addEventListener('click', () => setPreset(-6, 2.5, 0));
        presetRight.addEventListener('click', () => setPreset(6, 2.5, 0));
        presetTop.addEventListener('click', () => setPreset(0, 4.5, -4));

        // Copy to clipboard
        copyBtn.addEventListener('click', () => {
            const text = coords.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Position';
                }, 2000);
            });
        });

        coords.addEventListener('click', () => {
            const text = coords.textContent;
            navigator.clipboard.writeText(text).then(() => {
                coords.style.background = '#4CAF50';
                coords.style.color = 'white';
                setTimeout(() => {
                    coords.style.background = 'white';
                    coords.style.color = '#FF5722';
                }, 1000);
            });
        });

        // Apply to actual map button
        applyBtn.addEventListener('click', () => {
            const realMapButton = document.getElementById('map-button');
            if (realMapButton) {
                const pos = updatePosition();
                realMapButton.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
                applyBtn.textContent = '✅ Applied!';
                setTimeout(() => {
                    applyBtn.textContent = '✅ Apply to Map Button';
                }, 2000);
                console.log(`🗺️ Map button position updated to: ${pos.x} ${pos.y} ${pos.z}`);
            } else {
                applyBtn.textContent = '❌ Map button not found (go to Main 3)';
                setTimeout(() => {
                    applyBtn.textContent = '✅ Apply to Map Button';
                }, 3000);
            }
        });

        // Log code snippet
        consoleBtn.addEventListener('click', () => {
            const pos = updatePosition();
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🗺️ MAP BUTTON POSITION');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            console.log('Copy this to index.html (nav-main3 section):');
            console.log('');
            console.log(`<a-entity
    id="map-button"
    position="${pos.x} ${pos.y} ${pos.z}"
    rotation="0 0 0">`);
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });

        // Close helper
        closeBtn.addEventListener('click', () => {
            panel.remove();
            testButton.remove();
            console.log('✅ Map Button Helper closed');
        });

        // Slider event listeners
        xSlider.addEventListener('input', updatePosition);
        ySlider.addEventListener('input', updatePosition);
        zSlider.addEventListener('input', updatePosition);

        // Number input event listeners
        xVal.addEventListener('input', updateFromInput);
        yVal.addEventListener('input', updateFromInput);
        zVal.addEventListener('input', updateFromInput);

        // Initialize
        updatePosition();

        console.log('✅ Map Button Position Helper ready!');
        console.log('Press "B" key to toggle this helper.');
    }

    // Toggle Map Button Helper with 'B' key
    let isMapButtonHelperOpen = false;

    function toggleMapButtonHelper() {
        const existingPanel = document.getElementById('map-button-helper-panel');

        if (existingPanel) {
            existingPanel.remove();
            const testButton = document.getElementById('test-map-button');
            if (testButton) testButton.remove();
            isMapButtonHelperOpen = false;
            console.log('✅ Map Button Helper closed');
        } else {
            initMapButtonHelper();
            isMapButtonHelperOpen = true;
            console.log('🗺️ Map Button Helper opened (Press B to close)');
        }
    }

    // Listen for 'B' key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'b' || event.key === 'B') {
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                event.preventDefault();
                toggleMapButtonHelper();
            }
        }
    });

    // Export Map Button Helper to global scope
    window.MapButtonHelper = {
        open: initMapButtonHelper,
        close: function() {
            const panel = document.getElementById('map-button-helper-panel');
            if (panel) panel.remove();
            const testButton = document.getElementById('test-map-button');
            if (testButton) testButton.remove();
            isMapButtonHelperOpen = false;
        },
        toggle: toggleMapButtonHelper
    };

    console.log('🗺️ Map Button Helper loaded! Press "B" to toggle.');

})();
