// globe.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Globe using globe.gl
    const locations = [
        { name: 'BIPM', lat: 48.8233, lng: 2.2176 },   // BIPM
        { name: 'NIST', lat: 39.1400, lng: -77.2000 },  // NIST
        { name: 'PTB', lat: 52.2727, lng: 10.5284 },   // PTB
        { name: 'NPL', lat: 51.4249, lng: -0.3446 },   // NPL
        { name: 'NMIJ', lat: 36.0723, lng: 140.1318 },  // NMIJ
        { name: 'ISO/ITU/IEC', lat: 46.2044, lng: 6.1432 },    // ISO, ITU, IEC
        { name: 'IMO', lat: 51.5074, lng: -0.1278 },   // IMO
        { name: 'IAU', lat: 48.8566, lng: 2.3522 },    // IAU
        { name: 'NYC', lat: 40.7128, lng: -74.0060 }   // NYC
    ];

    const gradientColors = [
        "#FF0000", // Red
        "#FF4C4C",
        "#FF6666",
        "#FF9999",
        "#FFB2B2",
        "#FFCCCC",
        "#FFE5E5",
        "#FFFFFF"  // White
    ];

    const arcsData = locations.map((loc, i) => ({
        startLat: loc.lat,
        startLng: loc.lng,
        endLat: locations[i + 1]?.lat || loc.lat,
        endLng: locations[i + 1]?.lng || loc.lng,
        color: [gradientColors[i], gradientColors[i + 1] || "#FFFFFF"],
        duration: 3000 // Slowed down animation time
    })).slice(0, -1); // Remove the last item since it's not needed

    const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png') // Starry sky background
        .atmosphereColor('#FFFFFF') // Change glow to white
        .atmosphereAltitude(0.15) // Adjust glow intensity
        .arcColor('color')
        .arcDashLength(() => 0.3)
        .arcDashGap(() => 0.05)
        .arcDashAnimateTime(() => 6000) // Slowed down to 6 seconds per arc
        .arcStroke(0.7)
        (document.getElementById('globeViz'));

    // Apply black and white filter to the globe
    document.getElementById('globeViz').style.filter = 'grayscale(100%)';

    // Function to animate arcs sequentially
    function animateArcsSequentially(arcsData) {
        let delay = 0;

        arcsData.forEach((arc, index) => {
            setTimeout(() => {
                globe.arcsData(arcsData.slice(0, index + 1));
            }, delay);

            delay += arc.duration;
        });
    }

    // Start the animation
    animateArcsSequentially(arcsData);
});
