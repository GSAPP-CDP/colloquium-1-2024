mapboxgl.accessToken = config.accessToken;
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.94868300343751, 40.8056836503125],
    zoom: 14
});

// Create a inset map if enabled in config.js
if (config.inset) {
    var insetMap = new mapboxgl.Map({
        container: 'mapInset', // container id
        style: config.style, //hosted style id
        center: config.chapters[0].location.center,
        // Hardcode above center value if you want insetMap to be static.
        zoom: 3, // starting zoom
        hash: false,
        interactive: false,
        attributionControl: false,
        //Future: Once official mapbox-gl-js has globe view enabled,
        //insetmap can be a globe with the following parameter.
        //projection: 'globe'
    });
}

if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();

const data_path = "../data/raw_sensor_data.geojson"

// // Function to load an image and return a promise
// function loadImagePromise(map, url, id) {
//     return new Promise((resolve, reject) => {
//         map.loadImage(url, (error, image) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 map.addImage(id, image);
//                 resolve();
//             }
//         });
//     });
// }

function makeDescription(feature) {
    const temperature = feature.properties['AirTemp'];
    const sensorId = feature.properties['Sensor.ID'];
    const installType = feature.properties['Install.Type'];

    return`
        <div>
            <h3>Temperature: ${temperature}°F</h3>
            <p>Sensor ID: ${sensorId}</p>
            <p>Install type: ${installType}</p>
        </div>
    `;
}

// Helper function to create and display a popup
function createPopup(map, coordinates, feature) {
    const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(makeDescription(feature))
        .addTo(map);

    const closeButton = popup.getElement().querySelector('.mapboxgl-popup-close-button');
    if (closeButton && closeButton.hasAttribute('aria-hidden')) {
        closeButton.removeAttribute('aria-hidden');
    }

    return popup;
}

// Function to check if the layer is visible (opacity is 1)
function isLayerVisible(map, layerId) {
    const opacity = map.getPaintProperty(layerId, 'icon-opacity') || map.getPaintProperty(layerId, 'circle-opacity');
    return opacity === 1;
}

// Example usage (replace with your actual data loading)
fetch(data_path)
.then(response => response.json())
.then(data => {
    // const processedGeoJson = processGeoJson(data);
    // console.log(processedGeoJson)

    // Find minimum and maximum temperatures
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    data.features.forEach(feature => {
        minTemp = Math.min(minTemp, feature.properties.AirTemp);
        maxTemp = Math.max(maxTemp, feature.properties.AirTemp);
    });

    const colors = [
        'rgba(251,189,28,0)', // Blue for lowest
        'rgb(237,152,23)',
        'rgb(223,114,17)',
        'rgb(208,76,12)',
        'rgb(193,37,6)',
        'rgb(178,0,0)' // Red for highest  
    ]

    // Generate color stops based on min and max temperatures
    const colorStops = [
        minTemp, colors[0],
        minTemp + (maxTemp - minTemp) * 0.2, colors[1],
        minTemp + (maxTemp - minTemp) * 0.4, colors[2],
        minTemp + (maxTemp - minTemp) * 0.6, colors[3],
        minTemp + (maxTemp - minTemp) * 0.8, colors[4],
        maxTemp, colors[5]
    ];

    map.on('load', () => {
        map.loadImage('./images/Hot_Emoji.png', (error, image) => {
            if (error) throw error;

            map.addImage('hot-emoji-icon', image)

            if (config.use3dTerrain) {
                console.log('Using 3D terrain')
                map.addSource('mapbox-dem', {
                    'type': 'raster-dem',
                    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    'tileSize': 512,
                    'maxzoom': 14
                });
                // add the DEM source as a terrain layer with exaggerated height
                map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

                // add a sky layer that will show when the map is highly pitched
                map.addLayer({
                    'id': 'sky',
                    'type': 'sky',
                    'paint': {
                        'sky-type': 'atmosphere',
                        'sky-atmosphere-sun': [0.0, 0.0],
                        'sky-atmosphere-sun-intensity': 15
                    }
                });

                map.addLayer(//add-3d-buildings
                    {
                        id: 'add-3d-buildings',
                        source: 'composite',
                        'source-layer': 'building',
                        filter: ['==', 'extrude', 'true'],
                        type: 'fill-extrusion',
                        minzoom: 15,
                        paint: {
                            'fill-extrusion-color': '#aaa',
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.6
                        }
                    },
                );
            };

            map.addSource(
                'temperature-data', {
                    // This GeoJSON contains features that include an "icon"
                    // property. The value of the "icon" property corresponds
                    // to an image in the Mapbox Streets style's sprite.
                    'type': 'geojson',
                    'data': data
                }
            );
            map.addLayer({
                'id': 'temperature-emoji',
                'type': 'symbol',
                'source': 'temperature-data',
                'layout': {
                    'icon-image': 'hot-emoji-icon', // Reference the loaded PNG emoji
                    // 'icon-image': 'theater',
                    'icon-size': 0.1, // Adjust the size of the emoji image as needed
                    'icon-allow-overlap': true // Allow overlap of icons
                },
                'paint': {
                    'icon-opacity': 0 // Initialize the opacity to 0 (fully transparent)
                }
            });
            map.addLayer({
                'id': 'temperature-points',
                'type': 'circle',
                'source': 'temperature-data',
                'paint': {
                    'circle-opacity': 0,
                    'circle-radius': 10
                }
            });
            map.addLayer(
                {
                    'id': 'temperature-heatmap',
                    'type': 'heatmap',
                    'source': 'temperature-data',
                    'maxzoom': 20, // Adjust as needed
                    'paint': {
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'AirTemp'],
                            minTemp, 0,           // Min temp, no weight
                            maxTemp, 1          // Max temp, full weight
                        ],
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 1,            // Low zoom, low intensity
                            9, 3             // High zoom, higher intensity
                        ],
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0, colors[0],
                            0.2, colors[1],
                            0.4, colors[2],
                            0.6, colors[3],
                            0.8, colors[4],
                            1, colors[5],         
                        ],
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 4,            // Smaller radius at low zoom
                            9, 40           // Larger radius at high zoom
                        ],
                        'heatmap-opacity': 0.8  
                    }
                });
                map.addLayer({
                    'id': 'Percent_Above_Daylight_Threshold',
                    'type': 'fill-extrusion', 
                    'source': {
                        'type': 'geojson',
                        'data': '../data/Columbia_daylight_streets.geojson'
                    },
                    'paint': {
                        'fill-extrusion-color': [
                            'interpolate', ['linear'], ['get', 'Percent_Above_Daylight_Threshold'],
                            18, '#FFF500',
                            89, '#CF00AE'
                        ],
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['get', 'Percent_Above_Daylight_Threshold'],
                            18, 0,  // Set the lowest value to a minimum height
                            89, 500  // Increase the maximum height to make bars higher
                        ],
                        'fill-extrusion-opacity': 0, // Increase opacity for better visibility
                        'fill-extrusion-base': 0 // Keep the base height at 0
                    }

                });
                map.addLayer({
                    'id': 'Avg_Daylight_Hours',
                    'type': 'fill-extrusion', 
                    'source': {
                        'type': 'geojson',
                        'data': '../data/Columbia_daylight_streets.geojson'
                    },
                    'paint': {
                        'fill-extrusion-color': [
                            'interpolate', ['linear'], ['get', 'Avg_Daylight_Hours'],
                            // -100, '#8b332d',
                            // -50, '#dc6565',
                            1.49, '#D8FFD4',
                            6.6, '#2C7400'
                        ],
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['get', 'Avg_Daylight_Hours'],
                            1.49, 0,  // Set the lowest value to a minimum height
                            6.6, 500  // Increase the maximum height to make bars higher
                        ],
                        'fill-extrusion-opacity': 0, // Increase opacity for better visibility
                        'fill-extrusion-base': 0 // Keep the base height at 0
                    }
                });
                map.addLayer({
                    'id': 'Treecoverage%',
                    'type': 'fill-extrusion', 
                    'source': {
                        'type': 'geojson',
                        'data': '../data/Columbia_daylight_streets.geojson'
                    },
                    'paint': {
                        'fill-extrusion-color': [
                            'interpolate', ['linear'], ['get', 'Treecoverage%'],
                            // -100, '#8b332d',
                            // -50, '#dc6565',
                            0, '#00A3FF',
                            11.71355, '#FC0000'
                        ],
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['get', 'Treecoverage%'],
                            0.004, 0,  // Set the lowest value to a minimum height
                            11.71355, 500  // Increase the maximum height to make bars higher
                        ],
                        'fill-extrusion-opacity': 0, // Increase opacity for better visibility
                        'fill-extrusion-base': 0 // Keep the base height at 0
                    }
                });
            // // Wait for the layer to finish rendering before adding event listeners
            map.once('idle', () => {
                // Declare the popup variable outside the event handlers to give it the correct scope
                let popup;

                // // Handle click event
                // map.on('click', 'temperature-points', (e) => {
                //     if (!isLayerVisible(map, 'temperature-emoji')) return;

                //     const coordinates = e.features[0].geometry.coordinates.slice();

                //     // Create and display a new popup
                //     const popup = createPopup(map, coordinates, e.features[0]);
                // });

                // Handle mouse enter event
                map.on('mouseenter', 'temperature-points', (e) => {
                    if (!isLayerVisible(map, 'temperature-emoji')) return;

                    const coordinates = e.features[0].geometry.coordinates.slice();

                    // Remove the existing popup if any
                    if (popup) {
                        popup.remove();
                    }

                    // Create and display a new popup
                    popup = createPopup(map, coordinates, e.features[0]);
                });

                // Handle mouse leave event
                map.on('mouseleave', 'temperature-points', (e) => {
                    if (!isLayerVisible(map, 'temperature-emoji')) return;

                    if (popup) {
                        popup.remove();
                        popup = null; // Clear the reference to avoid potential memory leaks
                    }
                });

            });


            // map.addLayer(
            //     {
            //         id: 'temperature-point',
            //         type: 'circle',
            //         source: 'temperature-data',
            //         // minzoom: 20,
            //         paint: {
            //             // increase the radius of the circle as the zoom level and dbh value increases
            //             'circle-radius': {
            //                 property: 'AirTemp',
            //                 type: 'exponential',
            //                 stops: [
            //                     [{ zoom: 15, value: minTemp }, 5],
            //                     [{ zoom: 15, value: maxTemp }, 10],
            //                     [{ zoom: 22, value: minTemp }, 20],
            //                     [{ zoom: 22, value: maxTemp }, 50]
            //                 ]
            //             },
            //             // 'circle-radius': 10,
            //             'circle-color': [
            //                 'interpolate',
            //                 ['linear'],
            //                 ['get', 'AirTemp'],
            //                 ...colorStops
            //             ],
            //             // 'circle-stroke-color': 'rgb(0, 0, 0)',
            //             // 'circle-stroke-width': 1,
            //             'circle-opacity': {
            //                 stops: [
            //                 [14, 0],
            //                 [15, 1]
            //                 ]
            //             }
            //         }
            //     },
            //     'waterway-label'
            // );


        });
    });
})
.catch(error => console.error('Error loading or processing data:', error))

// As the map moves, grab and update bounds in inset map.
if (config.inset) {
    map.on('move', getInsetBounds);
    }
    // setup the instance, pass callback functions
    scroller
    .setup({
        step: '.step',
        offset: 0.5,
        progress: true
    })
    .onStepEnter(async response => {
        var current_chapter = config.chapters.findIndex(chap => chap.id === response.element.id);
        var chapter = config.chapters[current_chapter];
        
        response.element.classList.add('active');
        map[chapter.mapAnimation || 'flyTo'](chapter.location);

        // Incase you do not want to have a dynamic inset map,
        // rather want to keep it a static view but still change the
        // bbox as main map move: comment out the below if section.
        if (config.inset) {
            if (chapter.location.zoom < 5) {
                insetMap.flyTo({center: chapter.location.center, zoom: 0});
            }
            else {
                insetMap.flyTo({center: chapter.location.center, zoom: 3});
            }
        }
        if (config.showMarkers) {
            marker.setLngLat(chapter.location.center);
        }
        if (chapter.onChapterEnter.length > 0) {
            chapter.onChapterEnter.forEach(setLayerOpacity);
        }
        if (chapter.callback) {
            window[chapter.callback]();
        }
        if (chapter.rotateAnimation) {
            map.once('moveend', () => {
                const rotateNumber = map.getBearing();
                map.rotateTo(rotateNumber + 180, {
                    duration: 30000, easing: function (t) {
                        return t;
                    }
                });
            });
        }
        if (config.auto) {
            var next_chapter = (current_chapter + 1) % config.chapters.length;
            map.once('moveend', () => {
                document.querySelectorAll('[data-scrollama-index="' + next_chapter.toString() + '"]')[0].scrollIntoView();
            });
        }
    })
    .onStepExit(response => {
        var chapter = config.chapters.find(chap => chap.id === response.element.id);
        response.element.classList.remove('active');
        if (chapter.onChapterExit.length > 0) {
            chapter.onChapterExit.forEach(setLayerOpacity);
        }
    });


    if (config.auto) {
        document.querySelectorAll('[data-scrollama-index="0"]')[0].scrollIntoView();
    }

    map.scrollZoom.disable();

//Helper functions for insetmap
function getInsetBounds() {
    let bounds = map.getBounds();

    let boundsJson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ]
                    ]
                ]
            }
        }]
    }

    if (initLoad) {
        addInsetLayer(boundsJson);
        initLoad = false;
    } else {
        updateInsetLayer(boundsJson);
    }
}

function addInsetLayer(bounds) {
    insetMap.addSource('boundsSource', {
        'type': 'geojson',
        'data': bounds
    });

    insetMap.addLayer({
        'id': 'boundsLayer',
        'type': 'fill',
        'source': 'boundsSource', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': 0.2
        }
    });
    // // Add a black outline around the polygon.
    insetMap.addLayer({
        'id': 'outlineLayer',
        'type': 'line',
        'source': 'boundsSource',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1
        }
    });
}

function updateInsetLayer(bounds) {
    insetMap.getSource('boundsSource').setData(bounds);
}



// setup resize event
window.addEventListener('resize', scroller.resize);
