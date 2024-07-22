let cities = [];
let flights = [];
let cityData;
let flightData;

function preload() {
  // Load the CSV files
  cityData = loadTable('cities.csv', 'csv', 'header');
  flightData = loadTable('flights.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 400);
  background(200, 220, 255); // Light blue background for the map
  
  // Initialize cities array from CSV data
  for (let r = 0; r < cityData.getRowCount(); r++) {
    let row = cityData.getRow(r);
    let name = row.getString('City');
    let latitude = row.getNum('Latitude');
    let longitude = row.getNum('Longitude');
    let population = row.getNum('Population');

    // Create a City object
    let city = new City(name, latitude, longitude, population);
    cities.push(city);
  }

  // Initialize flights array from CSV data
  for (let r = 0; r < flightData.getRowCount(); r++) {
    let row = flightData.getRow(r);
    let departureName = row.getString('Departure');
    let destinationName = row.getString('Destination');
    let distance = row.getNum('Distance');

    // Find the City objects for departure and destination
    let departureCity = cities.find(city => city.getName() === departureName);
    let destinationCity = cities.find(city => city.getName() === destinationName);

    if (departureCity && destinationCity) {
      // Create a Flight object
      let flight = new Flight(departureCity, destinationCity, distance);
      flights.push(flight);
    }
  }

  // Draw the cities and flights
  drawCities();
  drawFlights();
}

function drawCities() {
  fill(255, 0, 0); // Red color for cities
  noStroke();
  for (let city of cities) {
    let x = map(city.getLongitude(), -180, 180, 0, width);
    let y = map(city.getLatitude(), 90, -90, 0, height);
    ellipse(x, y, 5, 5); // Draw city as a small circle

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(city.getName(), x + 5, y - 5); // Draw city name
  }
}

function drawFlights() {
  for (let flight of flights) {
    flight.draw();
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

// Flight class definition
class Flight {
  constructor(departure, destination, distance) {
    this.departure = departure; // Departure City object
    this.destination = destination; // Destination City object
    this.distance = distance; // Distance in kilometers
  }

  getDeparture() {
    return this.departure;
  }

  getDestination() {
    return this.destination;
  }

  getDistance() {
    return this.distance;
  }

  setDeparture(departure) {
    this.departure = departure;
  }

  setDestination(destination) {
    this.destination = destination;
  }

  setDistance(distance) {
    this.distance = distance;
  }

  displayInfo() {
    return `Flight from ${this.departure.getName()} to ${this.destination.getName()} covers a distance of ${this.distance} km.`;
  }

  draw() {
    let start = createVector(
      map(this.departure.getLongitude(), -180, 180, 0, width),
      map(this.departure.getLatitude(), 90, -90, 0, height)
    );
    let end = createVector(
      map(this.destination.getLongitude(), -180, 180, 0, width),
      map(this.destination.getLatitude(), 90, -90, 0, height)
    );

    stroke(255, 0, 0); // Red color for the flight path
    line(start.x, start.y, end.x, end.y); // Draw line between cities
  }
}