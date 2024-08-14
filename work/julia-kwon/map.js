mapboxgl.accessToken = config.mapboxToken;

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jkwon830/cljxcm37d001s01qge8oi0gqq',
    center: [-73.9654, 40.7829], // Central Park approximate center
    zoom: 13 // starting zoom
});

const mushroomLocations = [
    { 
        id: 1, 
        name: 'Puffball', 
        lat: 40.7916, 
        lng: -73.9640, 
        image: 'media/M01.jpg',
        latin_name: 'Lycoperdon curtisii',
        description: 'This puffball mushroom is found in forests and open areas. It is edible when young and often grows on forest floors or in open woods during the summer to fall season.', 
        edibility: 'Edible when young', 
        habitat: 'Forest floor, open woods', 
        season: 'Summer to Fall',
        analysis_1: 'media/M01-A.png',
        analysis_2: 'media/M01-B.png'
    },
    { 
        id: 2, 
        name: 'Crucibulum laeve', 
        lat: 40.7925, 
        lng: -73.9582, 
        image: 'media/M02.jpg' 
    },  
    { 
        id: 3, 
        name: 'Calocera cornea', 
        lat: 40.79523618359044, 
        lng: -73.95571031721349, 
        image: 'media/M03.jpg' 
    },
    { 
        id: 4, 
        name: 'Hericium erinaceus', 
        lat: 40.7961, 
        lng: -73.9588, 
        image: 'media/M04.jpg' 
    },
    { 
        id: 5, 
        name: 'Laetiporus sulphureus (Chicken Mushroom)', 
        lat: 40.7935, 
        lng: -73.9530, 
        image: 'media/M05.jpg' 
    },
    { 
        id: 6, 
        name: 'Tylopilus badiceps (ferrugineus)', 
        lat: 40.7794, 
        lng: -73.9718, 
        image: 'media/M06.jpg' 
    },
    { 
        id: 7, 
        name: 'Phellinus robiniae (P. rimosus)', 
        lat: 40.7939, 
        lng: -73.9514, 
        image: 'media/M07.jpg' 
    },
    { 
        id: 8, 
        name: 'Boletus campestris', 
        lat: 40.7884, 
        lng: -73.9561, 
        image: 'media/M08.jpg' 
    },
    { 
        id: 9, 
        name: 'Neonectria coccinea (Coral Spot)', 
        lat: 40.7891, 
        lng: -73.9580, 
        image: 'media/M09.jpg' 
    },
    { 
        id: 10, 
        name: 'Hypholoma sublateritium (H. lateritium) (Bricktops)', 
        lat: 40.7794, 
        lng: -73.9690, 
        image: 'media/M10.jpg' 
    }
];

// Add the Central Park GeoJSON as a green polygon
map.on('load', function () {
    map.addSource('cPark', {
        'type': 'geojson',
        'data': './media/cPark.geojson'
    });

    map.addLayer({
        'id': 'cPark-layer',
        'type': 'fill',
        'source': 'cPark',
        'layout': {},
        'paint': {
            'fill-color': '#98FF98', // Changed color to Mint Green
            'fill-opacity': .2
        }
    });

    // Add a green outline with thickness 1
    map.addLayer({
        'id': 'cPark-outline',
        'type': 'line',
        'source': 'cPark',
        'layout': {},
        'paint': {
            'line-color': '#008000', // Darker green color
            'line-width': 3
        }
    });
}); // End of Selection

// Add mushroom markers after layers are loaded
addMushroomMarkers();

// Function to add mushroom markers
function addMushroomMarkers() {
    const bounds = new mapboxgl.LngLatBounds();

    mushroomLocations.forEach(location => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(./media/mushroom-icon.png)';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = '100%';

        // Extend the bounds to include each marker's location
        bounds.extend([location.lng, location.lat]);
        const popupContent = `
            <div class="popup-content" style="max-height: 60vh; width: 30vw; opacity: 0; transition: opacity 0.5s ease-in-out; background-color: white; font-size: 18px; display: flex;">
                <div style="flex: 1;">
                    <button id="close-popup" style="float: right; font-size: 16px; background: none; border: none; cursor: pointer;">&#10006;</button>
                    <h3 id="name" style="background-color: white;">${location.name}</h3>
                    <img id="main-image" src="${location.image}" alt="${location.name}" style="width:100%;height:auto;max-height: 100%;background-color: white;">
                    ${location.latin_name ? `<p id="latin-name" style="background-color: white;"><strong>Latin Name:</strong> ${location.latin_name}</p>` : ''}
                    ${location.description ? `<p id="description" style="background-color: white;"><strong>Description:</strong> ${location.description}</p>` : ''}
                    ${location.edibility ? `<p id="edibility" style="background-color: white;"><strong>Edibility:</strong> ${location.edibility}</p>` : ''}
                    ${location.habitat ? `<p id="habitat" style="background-color: white;"><strong>Habitat:</strong> ${location.habitat}</p>` : ''}
                    ${location.season ? `<p id="season" style="background-color: white;"><strong>Season:</strong> ${location.season}</p>` : ''}
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start;">
                    ${location.analysis_1 ? `<img id="analysis-1" src="${location.analysis_1}" alt="Analysis Image 1" style="width:100%;height:auto;max-height: 50%;margin-top:5px;background-color: white;">` : ''}
                    ${location.analysis_2 ? `<img id="analysis-2" src="${location.analysis_2}" alt="Analysis Image 2" style="width:100%;height:auto;max-height: 50%;margin-top:5px;background-color: white;">` : ''}
                </div>
            </div>
        `;

        const popup = new mapboxgl.Popup({
            closeButton: false,  // Disable the default close button
            closeOnClick: false,  // Prevent popup from closing when clicking on the map
            anchor: 'left' // Position the popup to the left of the marker
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .addTo(map);

        el.addEventListener('click', () => {
            map.flyTo({
                center: [location.lng, location.lat],
                zoom: 17,
                speed: 0.005, // Slower speed for smoother transition
                duration: 1000, // Animate over 12 seconds
            essential: true, // This animation is considered essential with
            //respect to prefers-reduced-motion
                curve: 10, // Smoother curve
                easing: (t) => t * (2 - t) // Smooth easing function
            });

            // Delay the popup by 0.5 seconds after the map flies to the location
            setTimeout(() => {
                popup.setLngLat([location.lng, location.lat]).addTo(map);

                // Smoothly fade in the popup content
                const popupElement = document.querySelector('.popup-content');
                if (popupElement) {
                    popupElement.style.opacity = '1'; // Trigger the fade-in effect
                }

                // Add event listener to close the popup and reset the map view
                document.getElementById('close-popup').addEventListener('click', () => {
                    popup.remove();
                    map.fitBounds(bounds, {
                        padding: 20,
                        maxZoom: 15,
                        duration: 2000 // Slower and smoother transition back to show all markers
                    });
                });
            }, 1000); // 0.5 second delay
        });
    });

    // Fit the map to the bounds including all markers
    map.fitBounds(bounds, {
        padding: 20,
        maxZoom: 13,
        duration: 2000 // Slower and smoother initial transition to show all markers
    });
}
