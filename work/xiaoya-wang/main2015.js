// Function to initialize the map with data
function initializeMap(map) {
    // Load data and add it to the map
    function loadCSV(url, headerMapping, options = {}, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data.map(row => ({
                    name: row[headerMapping.name],
                    latitude: parseFloat(row[headerMapping.latitude]),
                    longitude: parseFloat(row[headerMapping.longitude]),
                    tree_id: row.tree_id,
                    tree_dbh: row.tree_dbh
                }));
                callback(data, options);
            },
            error: function(error) {
                console.error('Error loading data:', error);
            }
        });
    }

    function filterData(data, latRange, lonRange) {
        return data.filter(item => 
            item.latitude >= 40.7 && item.latitude <= 40.775 &&
            item.longitude >= -74.02 && item.longitude <= -73.962
        );
    }

    function processAndDisplayData(data, map, options = {}) {
        data.forEach(item => {
            const { name, latitude, longitude, tree_id, tree_dbh } = item;
            if (name) {
                L.circle([latitude, longitude], {
                    radius: options.radius || 100,
                    color: options.color || 'red',
                    fillColor: options.fillColor || 'red',
                    fillOpacity: options.fillOpacity || 0.5
                }).addTo(map).bindPopup(`<b>${name}</b>`);
            } else {
                L.circle([latitude, longitude], {
                    radius: 1, // Adjust size as needed
                    color: options.color || 'green',
                    fillColor: options.fillColor || 'green',
                    fillOpacity: options.fillOpacity || 0.5
                }).addTo(map)
                .bindPopup(`<b>Tree ID:</b> ${tree_id}<br><b>DBH:</b> ${tree_dbh}`);
            }
        });
    }

    function loadData() {
        const headerMapping1 = { name: 'name', latitude: 'latitude', longitude: 'longitude' };
        const headerMapping2 = { name: 'tree_dbh', latitude: 'Latitude', longitude: 'longitude' };
    
        // Define latitude and longitude ranges for filtering
        const latRange = { minLat: 40.5, maxLat: 40.9 };
        const lonRange = { minLon: -74.02, maxLon: -73.962 };
    
        // Load and process the second CSV file first
        loadCSV('./2015StreetTreesCensus_Newyork_TREES.csv', headerMapping2, { color: 'blue', fillColor: 'blue', fillOpacity: 0.5, radius: 2 }, function(data) {
            const filteredData = filterData(data, latRange, lonRange);
            processAndDisplayData(filteredData, map, { color: 'green', fillColor: 'green', fillOpacity: 0.5, radius: 2 });
    
            // Load and process the first CSV file after the second
            loadCSV('./lat_lon2.csv', headerMapping1, { color: 'red', fillColor: 'red', fillOpacity: 0.5 }, function(data) {
                processAndDisplayData(data, map, { color: 'red', fillColor: 'red', fillOpacity: 0.5 });
            });
        });
    }
    

    loadData();
}

// Initialize the map with the specific variable
initializeMap(map2015);
