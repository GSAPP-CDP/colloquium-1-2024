mapboxgl.accessToken = 'pk.eyJ1Ijoia2l0Mzc3NSIsImEiOiJjbHlsc3Z0bHowYmNmMmtvamZjeG1xYzJjIn0.6DjxqtbCSE9iiq1Xwd3YRw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kit3775/clzqdgaop00bw01pb4cod5xnd',
    zoom: 8,
    minZoom: 10.8,
    maxZoom: 30.5,
    center: [-73.918285, 40.793091],
    pitch: 0,
    bearing: 0
});

// Add image to the map once on load
map.on('load', function () {
    map.loadImage(
        'Park-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Park-icon')) {
                map.addImage('Park-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Sub-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Sub-icon')) {
                map.addImage('Sub-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Bus-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Bus-icon')) {
                map.addImage('Bus-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Super-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Super-icon')) {
                map.addImage('Super-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Club-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Club-icon')) {
                map.addImage('Club-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Bar-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Bar-icon')) {
                map.addImage('Bar-icon', image);
            }
        }
    );
});

map.on('load', function () {
    map.loadImage(
        'Fire-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Fire-icon')) {
                map.addImage('Fire-icon', image);
            }
        }
    );
});

// Function to load and add GeoJSON files to the map
function loadGeoJSON(url, name, type, color, width = 2, icon = null, iconSize = 1.0) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON source
            map.addSource(name, {
                type: 'geojson',
                data: data
            });

            // Determine the layer type and properties based on input
            const layerProperties = {
                id: name,
                source: name
            };

            // Set the type of the layer based on the provided type
            if (type === 'polygon') {
                layerProperties.type = 'fill'; // Set layer type to 'fill'
                layerProperties.paint = {
                    'fill-color': color,
                    'fill-opacity': 0.6
                };
            } else if (type === 'line') {
                layerProperties.type = 'line'; // Set layer type to 'line'
                layerProperties.paint = {
                    'line-color': color,
                    'line-width': 4
                };
            } else if (type === 'line-dash') {
                layerProperties.type = 'line'; // Set layer type to 'line'
                layerProperties.paint = {
                    'line-color': color,
                    'line-width': 1,
                    'line-dasharray': [2,1.5]
                };    
            } else if (type === 'circle') {
                layerProperties.type = 'circle'; // Set layer type to 'circle'
                layerProperties.paint = {
                    'circle-color': color,
                    'circle-radius': 5
                };
            } else if (type === 'icon') {
                layerProperties.type = 'symbol'; // Set layer type to 'symbol'
                layerProperties.layout = {
                    'icon-image': icon, // Use the icon image
                    'icon-size': 0.04 // Adjust icon size
                };
            }

            // Add layer to map
            map.addLayer(layerProperties);
        });
}

// Function to remove all GeoJSON layers
function removeGeoJSONLayers() {
    const layerIds = map.getStyle().layers.map(layer => layer.id);
    layerIds.forEach(id => {
        if (id.startsWith('geojson-layer') || id.startsWith('geojson2-layer')) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    });
}

// Load GeoJSON files with specific styles

// Function to show GeoJSON layers and zoom to the area
function showGeoJSON(prefix) {
    removeGeoJSONLayers();

    if (prefix === 'geojson') {
        // Red polygon
        loadGeoJSON('geojson/Bldg1/Bldg1.geojson', 'geojson-layer-1', 'polygon', '#eb157f');

        // Yellow lines
        loadGeoJSON('geojson/Bldg1/Walk5.geojson', 'geojson-layer-2', 'line-dash', '#7c6487');
        loadGeoJSON('geojson/Bldg1/Walk10.geojson', 'geojson-layer-3', 'line-dash', '#8c7198');
        loadGeoJSON('geojson/Bldg1/Walk15.geojson', 'geojson-layer-4', 'line-dash', '#9a7da7');
        loadGeoJSON('geojson/Bldg1/Walk20.geojson', 'geojson-layer-5', 'line-dash', '#aa8bb8');
        loadGeoJSON('geojson/Bldg1/Walk25.geojson', 'geojson-layer-6', 'line-dash', '#b997c8');
        loadGeoJSON('geojson/Bldg1/Park_route.geojson', 'geojson-layer-7', 'line', '#49795e');
        loadGeoJSON('geojson/Bldg1/Sub_route.geojson', 'geojson-layer-8', 'line', '#984e9f');
        loadGeoJSON('geojson/Bldg1/Bus_route.geojson', 'geojson-layer-9', 'line', '#4f898c');
        loadGeoJSON('geojson/Bldg1/Super_route.geojson', 'geojson-layer-10', 'line', '#9b7a3b');

        // Blue icons (with images)
        loadGeoJSON('geojson/Bldg1/Park.geojson', 'geojson-layer-12', 'icon', null, 2, 'Park-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Subway.geojson', 'geojson-layer-13', 'icon', null, 2, 'Sub-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Bus.geojson', 'geojson-layer-14', 'icon', null, 2, 'Bus-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Supermarket.geojson', 'geojson-layer-15', 'icon', null, 2, 'Super-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Bar.geojson', 'geojson-layer-16', 'icon', null, 2, 'Bar-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Club.geojson', 'geojson-layer-16', 'icon', null, 2, 'Club-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Fire.geojson', 'geojson-layer-16', 'icon', null, 2, 'Fire-icon', 1.0);

        map.flyTo({
            center: [-73.964570, 40.803158],
            zoom: 16
        });
    } else if (prefix === 'geojson2') {
        // Red polygon
        loadGeoJSON('geojson/Bldg2/Bldg2.geojson', 'geojson-layer-1', 'polygon', '#4215eb');

        // Yellow lines
        loadGeoJSON('geojson/Bldg2/Walk5.geojson', 'geojson-layer-2', 'line-dash', '#7c6487');
        loadGeoJSON('geojson/Bldg2/Walk10.geojson', 'geojson-layer-3', 'line-dash', '#8c7198');
        loadGeoJSON('geojson/Bldg2/Walk15.geojson', 'geojson-layer-4', 'line-dash', '#9a7da7');
        loadGeoJSON('geojson/Bldg2/Walk20.geojson', 'geojson-layer-5', 'line-dash', '#aa8bb8');
        loadGeoJSON('geojson/Bldg2/Walk25.geojson', 'geojson-layer-6', 'line-dash', '#b997c8');
        loadGeoJSON('geojson/Bldg2/Park_route.geojson', 'geojson-layer-7', 'line', '#49795e');
        loadGeoJSON('geojson/Bldg2/Sub_route.geojson', 'geojson-layer-8', 'line', '#984e9f');
        loadGeoJSON('geojson/Bldg2/Bus_route.geojson', 'geojson-layer-9', 'line', '#4f898c');
        loadGeoJSON('geojson/Bldg2/Super_route.geojson', 'geojson-layer-10', 'line', '#9b7a3b');

        // Blue icons (with images)
        loadGeoJSON('geojson/Bldg2/Park.geojson', 'geojson-layer-12', 'icon', null, 2, 'Park-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Subway.geojson', 'geojson-layer-13', 'icon', null, 2, 'Sub-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Bus.geojson', 'geojson-layer-14', 'icon', null, 2, 'Bus-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Supermarket.geojson', 'geojson-layer-15', 'icon', null, 2, 'Super-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Bar.geojson', 'geojson-layer-16', 'icon', null, 2, 'Bar-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Club.geojson', 'geojson-layer-16', 'icon', null, 2, 'Club-icon', 1.0);
        loadGeoJSON('geojson/Bldg2/Fire.geojson', 'geojson-layer-16', 'icon', null, 2, 'Fire-icon', 1.0);

        // Zoom to GeoJSON 2 area
        map.flyTo({
            center: [-73.990863, 40.760212],
            zoom: 16
        });
    }
}

// Function to display the correct score information
function showScore(scoreType) {
    // Hide all score elements
    document.getElementById('score').style.display = 'none';
    document.getElementById('score2').style.display = 'none';
    document.getElementById('score0').style.display = 'none';

    // Show the specified score element
    if (scoreType === 'score') {
        document.getElementById('score').style.display = 'block';
    } else if (scoreType === 'score2') {
        document.getElementById('score2').style.display = 'block';
    } else {
        document.getElementById('score0').style.display = 'block';
    }
}

// Initial display (if needed)
showScore('score0');

// Event listeners for buttons
// Event listeners for buttons
document.getElementById('geojson1-btn').addEventListener('click', function () {
    showGeoJSON('geojson');
        showScore('score');

    // Update the Score-number and Real-Score for GeoJSON 1
    document.querySelector('#Number .Score-number').textContent = '2500$';
    document.querySelector('#Number .Real-Score').textContent = '85/100';
    document.querySelector('#recomandation .recomandationB').textContent = 'Negotiation TIP!';
    document.querySelector('#recomandation .recomandationT').textContent = 'I think price of this house is appropriate.';
});

document.getElementById('geojson2-btn').addEventListener('click', function () {
    showGeoJSON('geojson2');
    showScore('score2');

    // Update the Score-number and Real-Score for GeoJSON 2
    document.querySelector('#Number .Score-number').textContent = '4000$';
    document.querySelector('#Number .Real-Score').textContent = '65/100';
    document.querySelector('#recomandation .recomandationB').textContent = 'Negotiation TIP!';
    document.querySelector('#recomandation .recomandationT').innerHTML = 'You can ask for at least $600 off this place.<br>Maybe it\'s too loud at night';
});