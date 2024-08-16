// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Center on the world and zoom out

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// City data with additional info and color coding
const cities = [
    // Highlighted in black
    { name: 'Amsterdam', coordinates: [52.3676, 4.9041], color: 'black',  country: 'Netherlands', continent: 'Europe', population: '872,680', footprint: '4,743 km²' },
    { name: 'Barcelona', coordinates: [41.3851, 2.1734], color: 'black',  country: 'Spain', continent: 'Europe', population: '1,620,343', footprint: '101 km²' },
    { name: 'Berlin', coordinates: [52.5200, 13.4050], color: 'black',  country: 'Germany', continent: 'Europe', population: '3,769,495', footprint: '891.8 km²' },
    { name: 'Buenos Aires', coordinates: [-34.6037, -58.3816], color: 'black',  country: 'Argentina', continent: 'South America', population: '2,891,000', footprint: '203 km²' },
    { name: 'Copenhagen', coordinates: [55.6761, 12.5683], color: 'black',  country: 'Denmark', continent: 'Europe', population: '794,128', footprint: '86.2 km²' },
    { name: 'Hong Kong', coordinates: [22.3193, 114.1694], color: 'black',  country: 'China', continent: 'Asia', population: '7,500,700', footprint: '1,104 km²' },
    { name: 'Istanbul', coordinates: [41.0082, 28.9784], color: 'black',  country: 'Turkey', continent: 'Asia', population: '15,067,724', footprint: '5,343 km²' },
    { name: 'Milan', coordinates: [45.4642, 9.1900], color: 'black',  country: 'Italy', continent: 'Europe', population: '1,396,000', footprint: '181 km²' },
    { name: 'Mumbai', coordinates: [19.0760, 72.8777], color: 'black',  country: 'India', continent: 'Asia', population: '12,478,447', footprint: '603 km²' },
    { name: 'Paris', coordinates: [48.8566, 2.3522], color: 'black',  country: 'France', continent: 'Europe', population: '2,165,423', footprint: '105 km²' },
    { name: 'Sao Paolo', coordinates: [-23.5505, -46.6333], color: 'black',  country: 'Brazil', continent: 'South America', population: '11,253,503', footprint: '1,521 km²' },
    { name: 'Tokyo', coordinates: [35.6824, 139.7590], color: 'black',  country: 'Japan', continent: 'Asia', population: '14,043,000', footprint: '2,194 km²' },

    // Additional cities
    { name: 'New York City', coordinates: [40.7128, -74.0060], color: 'grey', country: 'USA', continent: 'North America', population: '8,336,817', footprint: '789 km²' },
    { name: 'San Francisco', coordinates: [37.7749, -122.4194], color: 'grey', country: 'USA', continent: 'North America', population: '881,549', footprint: '121 km²' },
    { name: 'Toronto', coordinates: [43.6510, -79.3470], color: 'grey', country: 'Canada', continent: 'North America', population: '2,731,571', footprint: '630 km²' },
    { name: 'Los Angeles', coordinates: [34.0522, -118.2437], color: 'grey', country: 'USA', continent: 'North America', population: '3,898,747', footprint: '1,302 km²' },
    { name: 'Chicago', coordinates: [41.8781, -87.6298], color: 'grey', country: 'USA', continent: 'North America', population: '2,746,388', footprint: '606 km²' },
    { name: 'Vancouver', coordinates: [49.2827, -123.1207], color: 'grey', country: 'Canada', continent: 'North America', population: '631,486', footprint: '115 km²' },
    { name: 'Seattle', coordinates: [47.6062, -122.3321], color: 'grey', country: 'USA', continent: 'North America', population: '724,745', footprint: '217 km²' },
    { name: 'Boston', coordinates: [42.3601, -71.0589], color: 'grey', country: 'USA', continent: 'North America', population: '692,600', footprint: '125 km²' },
    { name: 'Washington D.C.', coordinates: [38.9072, -77.0369], color: 'grey', country: 'USA', continent: 'North America', population: '705,749', footprint: '177 km²' },
    { name: 'Montreal', coordinates: [45.5017, -73.5673], color: 'grey', country: 'Canada', continent: 'North America', population: '1,704,694', footprint: '431 km²' },
    { name: 'London', coordinates: [51.5074, -0.1278], color: 'grey', country: 'UK', continent: 'Europe', population: '8,982,965', footprint: '1,572 km²' },
    { name: 'Madrid', coordinates: [40.4168, -3.7038], color: 'grey', country: 'Spain', continent: 'Europe', population: '6,661,949', footprint: '604 km²' },
    { name: 'Rome', coordinates: [41.9028, 12.4964], color: 'grey', country: 'Italy', continent: 'Europe', population: '2,860,009', footprint: '1,285 km²' },
    { name: 'Vienna', coordinates: [48.2082, 16.3738], color: 'grey', country: 'Austria', continent: 'Europe', population: '1,911,191', footprint: '414.6 km²' },
    { name: 'Brussels', coordinates: [50.8503, 4.3517], color: 'grey', country: 'Belgium', continent: 'Europe', population: '1,212,000', footprint: '161 km²' },
    { name: 'Lisbon', coordinates: [38.7223, -9.1393], color: 'grey', country: 'Portugal', continent: 'Europe', population: '505,526', footprint: '84.8 km²' },
    { name: 'Dublin', coordinates: [53.3331, -6.2489], color: 'grey', country: 'Ireland', continent: 'Europe', population: '1,169,000', footprint: '115 km²' },
    { name: 'Shanghai', coordinates: [31.2304, 121.4737], color: 'grey', country: 'China', continent: 'Asia', population: '24,153,000', footprint: '6,340 km²' },
    { name: 'Singapore', coordinates: [1.3521, 103.8198], color: 'grey', country: 'Singapore', continent: 'Asia', population: '5,637,000', footprint: '728.6 km²' },
    { name: 'Seoul', coordinates: [37.5665, 126.9780], color: 'grey', country: 'South Korea', continent: 'Asia', population: '9,733,000', footprint: '605 km²' },
    { name: 'Bangkok', coordinates: [13.7563, 100.5018], color: 'grey', country: 'Thailand', continent: 'Asia', population: '8,281,000', footprint: '1,568 km²' },
    { name: 'Delhi', coordinates: [28.6139, 77.2090], color: 'grey', country: 'India', continent: 'Asia', population: '31,000,000', footprint: '1,484 km²' },
    { name: 'Kuala Lumpur', coordinates: [3.139, 101.6869], color: 'grey', country: 'Malaysia', continent: 'Asia', population: '1,808,000', footprint: '243 km²' },
    { name: 'Jakarta', coordinates: [-6.2088, 106.8456], color: 'grey', country: 'Indonesia', continent: 'Asia', population: '10,562,000', footprint: '662 km²' },
    { name: 'Taipei', coordinates: [25.0330, 121.5654], color: 'grey', country: 'Taiwan', continent: 'Asia', population: '2,646,000', footprint: '272 km²' },
    { name: 'Rio de Janeiro', coordinates: [-22.9068, -43.1729], color: 'grey', country: 'Brazil', continent: 'South America', population: '6,750,000', footprint: '1,255 km²' },
    { name: 'Santiago', coordinates: [-33.4489, -70.6693], color: 'grey', country: 'Chile', continent: 'South America', population: '5,610,000', footprint: '641 km²' },
    { name: 'Lima', coordinates: [-12.0464, -77.0428], color: 'grey', country: 'Peru', continent: 'South America', population: '9,751,000', footprint: '2,674 km²' },
    { name: 'Cape Town', coordinates: [-33.9249, 18.4241], color: 'grey', country: 'South Africa', continent: 'Africa', population: '4,710,000', footprint: '400 km²' },
    { name: 'Johannesburg', coordinates: [-26.2041, 28.0473], color: 'grey', country: 'South Africa', continent: 'Africa', population: '5,822,000', footprint: '1,645 km²' },
    { name: 'Lagos', coordinates: [6.5244, 3.3792], color: 'grey', country: 'Nigeria', continent: 'Africa', population: '14,368,000', footprint: '1,171 km²' },
    { name: 'Nairobi', coordinates: [-1.2864, 36.8172], color: 'grey', country: 'Kenya', continent: 'Africa', population: '4,397,073', footprint: '696 km²' },
    { name: 'Accra', coordinates: [5.6037, -0.1870], color: 'grey', country: 'Ghana', continent: 'Africa', population: '2,201,863', footprint: '225 km²' },
    { name: 'Sydney', coordinates: [-33.8688, 151.2093], color: 'grey', country: 'Australia', continent: 'Australia', population: '5,312,000', footprint: '12,368 km²' },
    { name: 'Melbourne', coordinates: [-37.8136, 144.9631], color: 'grey', country: 'Australia', continent: 'Australia', population: '5,078,000', footprint: '9,990 km²' },
    { name: 'Auckland', coordinates: [-36.8481, 174.7625], color: 'grey', country: 'New Zealand', continent: 'Oceania', population: '1,657,200', footprint: '1,086 km²' },
    { name: 'Wellington', coordinates: [-41.2865, 174.7762], color: 'grey', country: 'New Zealand', continent: 'Oceania', population: '431,200', footprint: '290 km²' },
    { name: 'Dubai', coordinates: [25.2769, 55.2962], color: 'grey', country: 'United Arab Emirates', continent: 'Asia', population: '3,490,000', footprint: '4,114 km²' },
    { name: 'Tel Aviv', coordinates: [32.0853, 34.7818], color: 'grey', country: 'Israel', continent: 'Asia', population: '451,523', footprint: '52 km²' },
    { name: 'Doha', coordinates: [25.2760, 51.5200], color: 'grey', country: 'Qatar', continent: 'Asia', population: '1,945,000', footprint: '132 km²' }
];

// Add markers to the map with hover functionality
cities.forEach(city => {
    // Use circleMarker with specified color
    const marker = L.circleMarker(city.coordinates, { color: city.color, radius: 8 }).addTo(map);

    // Add a popup with city info
    marker.bindPopup(`
        <b>${city.name}</b><br>
        Country: ${city.country}<br>
        Continent: ${city.continent}<br>
        Population: ${city.population}<br>
        Footprint: ${city.footprint}
    `);
});

// JavaScript for Map 2
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer to the map (replace with your desired tile layer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
});