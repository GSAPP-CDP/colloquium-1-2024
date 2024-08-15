mapboxgl.accessToken = 'pk.eyJ1Ijoia2l0Mzc3NSIsImEiOiJjbHlsc3Z0bHowYmNmMmtvamZjeG1xYzJjIn0.6DjxqtbCSE9iiq1Xwd3YRw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kit3775/clzqdgaop00bw01pb4cod5xnd',
    zoom: 12,
    minZoom: 10.8,
    maxZoom: 30.5,
    center: [-73.828285, 40.783091],
    pitch: 0,
    bearing: 0
});

// Function to calculate zoom level based on viewport height
function adjustZoomBasedOnViewport() {
    const vh = window.innerWidth / 100; // Calculate vh unit
    const zoomLevel = (100 - vh) / 8; // Adjust zoom level based on vh (arbitrary ratio)
    map.setZoom(zoomLevel);
}

// Adjust zoom on page load
window.addEventListener('load', adjustZoomBasedOnViewport);

// Adjust zoom on window resize
window.addEventListener('resize', adjustZoomBasedOnViewport);

map.on('load', function () {
    // Define layer groups
    const layers = {
        'Owned_2020': ['Owned_2020'],
        'Rented_2020': ['Rented_2020'],
        'Owned+Rented': ['Owned+Rented'],
        'points': ['Points_Owned', 'Points_Rented']
    };

    // Add 'Owned_2020' layer
    map.addLayer({
        'id': 'Owned_2020',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/Owned.geojson'
        },
        'paint': {
            'fill-color': [
                'match',
                ['get', 'Val1_class'],
                '0', 'transparent',
                '1', '#003A04',
                '2', '#006B1D',
                '3', '#009D36',
                '4', '#00CE4E',
                '5', '#00FF67',
                '#000000'
            ],
            'fill-opacity': 0.6
        }
    });

    // Add 'Rented_2020' layer
    map.addLayer({
        'id': 'Rented_2020',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/Rented.geojson'
        },
        'paint': {
            'fill-color': [
                'match',
                ['get', 'Val2_class'],
                'A', 'transparent',
                'B', '#2E0047',
                'C', '#610075',
                'D', '#9300A3',
                'E', '#C500D1',
                'F', '#F800FF',
                '#000000'
            ],
            'fill-opacity': 0.6
        }
    });

    // Add 'Owned+Rented' layer
    map.addLayer({
        'id': 'Owned+Rented',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/Owned+Rented.geojson'
        },
        'paint': {
            'fill-color': [
                'match',
                ['get', 'Bi_class'],
                'E1', '#cf58e3',
                'E2', '#ce6fe6',
                'E3', '#d087eb',
                'E4', '#d2a0ef',
                'E5', '#d4bff4',
                'D1', '#984e9f',
                'D2', '#9c67a8',
                'D3', '#a080b0',
                'D4', '#a59db9',
                'D5', '#a4bbc0',
                'C1', '#784a7c',
                'C2', '#7c6487',
                'C3', '#817f92',
                'C4', '#819798',
                'C5', '#87bea4',
                'B1', '#5d485f',
                'B2', '#62636c',
                'B3', '#637a75',
                'B4', '#699982',
                'B5', '#6fc490',
                'A1', 'transparent',
                'A2', '#455e51',
                'A3', '#49795e',
                'A4', '#4e996c',
                'A5', '#57ce7f',
                '#000000'
            ],
            'fill-opacity': 0.7
        }
    });

    // Add 'Points_Owned' layer
    map.addLayer({
        'id': 'Points_Owned',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/Points_Owned.geojson'
        },
        'paint': {
            'circle-color': '#57ce7f',
            'circle-radius': 0.8, // Slightly increased radius
        }
    });

    // Add 'Points_Rented' layer
    map.addLayer({
        'id': 'Points_Rented',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/Points_Rented.geojson'
        },
        'paint': {
            'circle-color': '#cf58e3',
            'circle-radius': 0.8, // Slightly increased radius
        }
    });

    // Initially hide all layers
    Object.keys(layers).forEach(groupId => {
        layers[groupId].forEach(layerId => {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        });
    });

    // Initially show points group layer and text
    showLayerGroup('points');
    textElement.style.display = 'block'; // Show text when points layer is shown
});

// Function to toggle layer groups
function showLayerGroup(groupId) {
    const layers = {
        'Owned_2020': ['Owned_2020'],
        'Rented_2020': ['Rented_2020'],
        'Owned+Rented': ['Owned+Rented'],
        'points': ['Points_Owned', 'Points_Rented']
    };

    // Hide all layers
    Object.keys(layers).forEach(layerGroup => {
        layers[layerGroup].forEach(layerId => {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        });
    });

    // Show selected layer group
    layers[groupId].forEach(layerId => {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
    });
}

// Text typing effect
const textElement = document.getElementById('text');
const textContent = textElement.innerText;
let charIndex = 0;
let textInterval;

function typeText() {
    if (charIndex < textContent.length) {
        textElement.innerText = textContent.substring(0, charIndex + 1);
        charIndex++;
    } else {
        clearInterval(textInterval);
    }
}

// Start typing effect when page loads
window.addEventListener('load', function () {
    textElement.innerText = ''; // Clear text before starting
    textInterval = setInterval(typeText, 100); // Adjust speed as needed
});

// Price Forecast graph toggle function
function toggleGraph() {
    const priceImage = document.getElementById('price-image');
    const graphVisible = priceImage.style.display === 'block';
    priceImage.style.display = graphVisible ? 'none' : 'block';

    if (graphVisible) {
        // Show text when graph is hidden
        textElement.style.display = 'block';
    } else {
        // Hide text when graph is shown
        textElement.style.display = 'none';
        showLayerGroup('none'); // Hide all layers when graph is shown
    }
}
