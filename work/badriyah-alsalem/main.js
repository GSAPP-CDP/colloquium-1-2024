document.addEventListener('DOMContentLoaded', function () {
    // Alert to confirm JS is working
    alert("Temporal Awareness Research by Badriyah Alsalem.");

    // Initialize scrollama
    const scroller = scrollama();
    const sidebarTitle = document.querySelector('.sidebar h1');

    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(response => {
            const { element } = response;
            const title = element.getAttribute('data-title');
            console.log('Step entered:', title);

            // Replace the sidebar title
            sidebarTitle.textContent = title;
        })
        .onStepExit(response => {
            const { element } = response;
            console.log('Step exited:', element.getAttribute('data-title'));
        });

    // Resize event
    window.addEventListener('resize', scroller.resize);    // Flipthrough images functionality
    let currentImageIndex = 0;
    const images = [
        "Assets/Devices/DevicesAll1.png",
        "Assets/Devices/DevicesAll2.png",
        "Assets/Devices/DevicesAll3.png",
        "Assets/Devices/DevicesAll4.png",
        "Assets/Devices/DevicesAll5.png",
        "Assets/Devices/DevicesAll6.png",
        "Assets/Devices/DevicesAll7.png",
        "Assets/Devices/DevicesAll8.png",
        "Assets/Devices/DevicesAll9.png",
        "Assets/Devices/DevicesAllTogether.png"
    ];
    const customImages = [
        "Assets/Devices/DevicesThroughTime/20.png",
        "Assets/Devices/DevicesThroughTime/21.png",  // Forces
        "Assets/Devices/DevicesThroughTime/22.png",  // Control
        "Assets/Devices/DevicesThroughTime/23.png",  // Sync
        "Assets/Devices/DevicesThroughTime/24.png",  // Constant
        "Assets/Devices/DevicesThroughTime/25.png"   // Inaccessible
    ];

    function updateImage() {
        const imageElement = document.getElementById('myImage');
        if (imageElement) {
            imageElement.src = images[currentImageIndex];
        }
    }

    function beforeImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    }

    function afterImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    }

    // Attach event listeners to buttons
    document.getElementById('beforeButton').addEventListener('click', beforeImage);
    document.getElementById('afterButton').addEventListener('click', afterImage);

    // Attach event listeners to custom buttons
    document.getElementById('customButton1').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[0];
    });

    document.getElementById('customButton2').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[1];
    });

    document.getElementById('customButton3').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[2];
    });

    document.getElementById('customButton4').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[3];
    });

    document.getElementById('customButton5').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[4];
    });

    document.getElementById('customButton6').addEventListener('click', function () {
        document.getElementById('myImage').src = customImages[5];
    });

    // Initialize the first image
    updateImage();    // Initialize the Globe using globe.gl
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
    animateArcsSequentially(arcsData);    // Network Graph Code
    const graph = {
        nodes: [
            { name: 'Gregorian Calendar Reform (1582)' },
            { name: 'Standardization of Time Zones (1884)' },
            { name: 'Daylight Saving Time (First Implemented 1916)' },
            { name: 'French Republican Calendar (1793-1805)' },
            { name: 'The Fascist Calendar (1922-1943)' },
            { name: 'Introduction of Unix Epoch Time (1970)' },
            { name: 'Leap Seconds (Introduced in 1972)' },
            { name: 'Soviet Calendar Reform (1929-1940)' },
            { name: 'Railway Time in Britain (1840)' },
            { name: 'The Metric Time Proposal during the French Revolution (1793)' },
            { name: 'Mayan Long Count Calendar' },
            { name: 'The International Date Line (Established in 1884)' },
            { name: 'The Nuremberg Chronology (15th Century)' },
            { name: 'Workweek Standardization (1938)' },
            { name: 'Chinese Lunar Calendar and the Communist Reform (1949)' },
            { name: 'The Nuremberg Laws and Temporal Exclusion (1935)' },
            { name: 'Atomic Timekeeping (1955 onwards)' },
            { name: 'Nuremberg Trials (1945-1946)' }
        ],
        links: [
            { source: 'Gregorian Calendar Reform (1582)', target: 'Standardization of Time Zones (1884)' },
            { source: 'Daylight Saving Time (First Implemented 1916)', target: 'French Republican Calendar (1793-1805)' },
            { source: 'The Fascist Calendar (1922-1943)', target: 'Introduction of Unix Epoch Time (1970)' },
            { source: 'Leap Seconds (Introduced in 1972)', target: 'Soviet Calendar Reform (1929-1940)' },
            { source: 'Railway Time in Britain (1840)', target: 'The Metric Time Proposal during the French Revolution (1793)' },
            { source: 'Mayan Long Count Calendar', target: 'The International Date Line (Established in 1884)' },
            { source: 'The Nuremberg Chronology (15th Century)', target: 'Workweek Standardization (1938)' },
            { source: 'Chinese Lunar Calendar and the Communist Reform (1949)', target: 'The Nuremberg Laws and Temporal Exclusion (1935)' },
            { source: 'Atomic Timekeeping (1955 onwards)', target: 'Nuremberg Trials (1945-1946)' }
        ]
    };

    const canvas = d3.select('#network');
    const width = 1200;
    const height = 800;
    const r = 30;
    const ctx = canvas.node().getContext('2d');

    const color = d3.scaleOrdinal(d3.schemeAccent);

    const simulation = d3.forceSimulation()
        .force('x', d3.forceX(width / 2).strength(0.5)) // Adjust strength to better center nodes
        .force('y', d3.forceY(height / 2).strength(0.5))
        .force('collide', d3.forceCollide(r + 40)) // Increase the collision radius for more spacing
        .force('charge', d3.forceManyBody().strength(-150)) // Adjust the strength to zoom out the network
        .force('link', d3.forceLink().id(node => node.name).distance(200)) // Increase the distance between linked nodes
        .on('tick', update);

    simulation.nodes(graph.nodes);
    simulation.force('link').links(graph.links);

    canvas.call(d3.drag()
        .container(canvas.node())
        .subject(dragsubject)
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

    function update() {
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = 'white'; // Change lines to white
        graph.links.forEach(drawLink);
        ctx.stroke();

        ctx.beginPath();
        ctx.globalAlpha = 1;
        graph.nodes.forEach(drawNode);
        ctx.fill();
    }

    function dragsubject(event) {
        return simulation.find(event.x, event.y);
    }

    function drawNode(d, i) {
        const opacity = 0.4 + (i / graph.nodes.length) * 0.6; // Calculate opacity based on node index
        ctx.globalAlpha = opacity; // Set the opacity for the text

        ctx.font = '16px Libre Baskerville, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white'; // Change text color to white
        ctx.fillText(d.name, d.x, d.y);
    }

    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
    }

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    update();// SINE WAVE GRAPH

    let step = 0; // Declare 'step' once

    function draw() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);
        showAxes(context);
        context.save();

        plotSine(context, step, 50); // Default amplitude
        context.restore();

        step += 4; // Increment 'step'
        window.requestAnimationFrame(draw);
    }

    function showAxes(context) {
        var width = context.canvas.width;
        var height = context.canvas.height;
        context.beginPath();
        context.moveTo(0, height / 2);
        context.lineTo(width, height / 2);
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1;
        context.stroke();
    }

    function plotSine(context, step, amplitude) {
        var width = context.canvas.width;
        var height = context.canvas.height;
        var x = 4;
        var y = 0;

        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "#ffffff";

        while (x < width) {
            y = height / 2 + amplitude * Math.sin((x + step) / 20);
            context.lineTo(x, y);
            x += 1;
        }
        context.stroke();
    }

    // Event Listeners for Buttons
    document.getElementById('dayButton').addEventListener('click', function () {
        plotSineWave(50); // Example amplitude for 'day'
    });

    document.getElementById('nightButton').addEventListener('click', function () {
        plotSineWave(100); // Example amplitude for 'night'
    });

    document.getElementById('tidesButton').addEventListener('click', function () {
        plotSineWave(75); // Example amplitude for 'tides'
    });

    document.getElementById('cricketsButton').addEventListener('click', function () {
        plotSineWave(40); // Example amplitude for 'crickets'
    });

    document.getElementById('lightButton').addEventListener('click', function () {
        plotSineWave(120); // Example amplitude for 'light'
    });

    document.getElementById('sleepButton').addEventListener('click', function () {
        plotSineWave(30); // Example amplitude for 'sleep'
    });

    document.getElementById('circadianButton').addEventListener('click', function () {
        plotSineWave(90); // Example amplitude for 'circadian rhythm'
    });

    function plotSineWave(amplitude) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        showAxes(context);
        context.save();
        plotSine(context, step, amplitude); // Use the passed amplitude
        context.restore();
    }

    window.requestAnimationFrame(draw); // Start the animation
});
document.addEventListener('DOMContentLoaded', function () {
    // Existing code...


    // Existing code...
});
window.onload = function () {
    const div = document.querySelector('#myContainer.hole');
    let isIn = false;
    div.addEventListener('mouseover', function () {
        isIn = true;
    });
    div.addEventListener('mouseout', function () {
        isIn = false;
    });
    div.addEventListener('mousemove', function (event) {
        if (isIn) {
            div.style.setProperty('--x', event.clientX + 'px');
            div.style.setProperty('--y', event.clientY + 'px');
        }
    });
}

// Sin waves
document.addEventListener("DOMContentLoaded", function () {
    console.log("Sine wave script is running"); // Debug log

    const sineWaves = [
        { canvasId: "canvas1", amplitude: 20, speed: 4 },
        { canvasId: "canvas2", amplitude: 30, speed: 3 },
        { canvasId: "canvas3", amplitude: 40, speed: 5 },
        { canvasId: "canvas4", amplitude: 50, speed: 2 },
        { canvasId: "canvas5", amplitude: 60, speed: 6 },
        { canvasId: "canvas6", amplitude: 70, speed: 3 },
        { canvasId: "canvas7", amplitude: 80, speed: 4 },
        { canvasId: "canvas8", amplitude: 90, speed: 2 }
    ];

    sineWaves.forEach(function (sineWave) {
        console.log(`Rendering sine wave on ${sineWave.canvasId}`); // Debug log

        let step = 0;

        function draw() {
            var canvas = document.getElementById(sineWave.canvasId);
            if (!canvas) {
                console.log(`Canvas ${sineWave.canvasId} not found`); // Debug log
                return;
            }
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);
            showAxes(context);
            context.save();

            plotSine(context, step, sineWave.amplitude);
            context.restore();

            step += sineWave.speed;
            window.requestAnimationFrame(draw);
        }

        function showAxes(context) {
            var width = context.canvas.width;
            var height = context.canvas.height;
            context.beginPath();
            context.moveTo(0, height / 2);
            context.lineTo(width, height / 2);
            context.strokeStyle = "#ffffff";
            context.lineWidth = 1;
            context.stroke();
        }

        function plotSine(context, step, amplitude) {
            var width = context.canvas.width;
            var height = context.canvas.height;
            var x = 4;
            var y = 0;

            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "#ffffff";

            while (x < width) {
                y = height / 2 + amplitude * Math.sin((x + step) / 20);
                context.lineTo(x, y);
                x += 1;
            }
            context.stroke();
        }

        draw();
    });
});