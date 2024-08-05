let cities = [];
let cityData; // To store the CSV data

function preload() {
  // Load the CSV file
  cityData = loadTable('data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 400); // Set canvas size
  background(255);
  
  // Create a map projection with equidistant cylindrical projection parameters
  let projection = (lat) => {
    // Equidistant cylindrical projection
    let x = map(lat.longitude, -180, 180, 0, width);
    let y = map(lat.latitude, 90, -90, 0, height);
    return createVector(x, y);
  };

  // Initialize cities array from CSV data
  for (let r = 0; r < cityData.getRowCount(); r++) {
    let row = cityData.getRow(r);
    let name = row.getString('City');
    let latitude = row.getNum('Latitude');
    let longitude = row.getNum('Longitude');
    let population = row.getNum('Population');

    // Create a City object
    let city = new City(name, latitude, longitude, population);

    // Project city coordinates to map
    let projected = projection(city);
    
    // Store the city and its projected position
    cities.push({
      city: city,
      position: projected
    });
  }

  // Draw the map
  drawMap();
}

function drawMap() {
  background(200, 220, 255); // Light blue background for the map
  
  // Draw each city
  for (let i = 0; i < cities.length; i++) {
    let city = cities[i];
    fill(255, 0, 0); // Red color for the city
    noStroke();
    ellipse(city.position.x, city.position.y, 5, 5); // Draw city as a small circle

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(city.city.getName(), city.position.x + 5, city.position.y - 5); // Draw city name
  }
}

// City class definition
class City {
  constructor(name, latitude, longitude, population) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.population = population;
  }

  getName() {
    return this.name;
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

  getPopulation() {
    return this.population;
  }
}
