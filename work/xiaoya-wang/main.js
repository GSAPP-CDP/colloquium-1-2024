// Initialize the Leaflet map
var map = L.map('map').setView([40.724, -74.0060], 12);  // New York City coordinates

// Set up the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity:0.7
}).addTo(map);

// City class definition
class City {
    constructor(name, latitude, longitude) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Method to add a circle to the map
    addCircleToMap(map) {
        console.log(`Adding circle: ${this.name} at (${this.latitude}, ${this.longitude})`);
        if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
            L.circle([this.latitude, this.longitude], {
                radius: 70,  // Adjust the radius as needed
                color: 'blue',  // Circle border color
                fillColor: 'blue',  // Circle fill color
                fillOpacity: 0.6  // Opacity of the fill color
            })
            .addTo(map)
            .bindPopup(`<b>${this.name}</b>`);
        } else {
            console.error('Invalid LatLng object:', this.latitude, this.longitude);
        }
    }
}

// Function to load and parse the CSV data
function loadData() {
    Papa.parse('./lat_lon2.csv', {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            data.forEach(item => {
                // Log the raw data
                console.log('Raw data:', item);

                // Ensure the headers in your CSV match these names
                var latitude = parseFloat(item.latitude);  // Use lowercase 'latitude'
                var longitude = parseFloat(item.longitude); // Use lowercase 'longitude'
                var name = item.name; // Use 'name'

                // Log the parsed values
                console.log('Parsed Latitude:', latitude);
                console.log('Parsed Longitude:', longitude);

                // Create city object
                var city = new City(name, latitude, longitude);
                city.addCircleToMap(map);
            });
        }
    });
}

// Load the data
loadData();
