const myGlobe = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

// Load country boundaries
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(countries => {
    myGlobe
      .polygonsData(countries.features)
      .polygonAltitude(0.01)
      .polygonCapColor(() => 'rgba(255, 255, 255, 0.1)') // Light grey for minimalistic look
      .polygonSideColor(() => 'rgba(255, 255, 255, 0.1)')
      .polygonStrokeColor(() => '#FFFFFF') // White borders for contrast
      .polygonLabel(({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b>
      `);
  });

// Example data from the Excel file
const aiFraudData = [
  { location: 'Hong Kong', lat: 22.3193, lng: 114.1694, size: 25 },
  { location: 'UK', lat: 51.509865, lng: -0.118092, size: 2 },
  { location: 'China', lat: 35.8617, lng: 104.1954, size: 6 }
  // Add more data points here...
];

// Function to get coordinates for a location (simplified, replace with a real geocoding solution)
const getCoordinates = (location) => {
  const coords = {
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'UK': { lat: 51.509865, lng: -0.118092 },
    'China': { lat: 35.8617, lng: 104.1954 }
  };
  return coords[location];
};

// Transform data to include coordinates
const formattedData = aiFraudData.map(d => {
  const coords = getCoordinates(d.location);
  return { ...d, lat: coords.lat, lng: coords.lng, size: d.size / 10 }; // Adjust size for visualization
});

myGlobe
  .pointsData(formattedData)
  .pointAltitude('size')
  .pointColor(() => '#FF4500') // Bright color for visibility
  .pointRadius('size');
