function drawMindMap(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 400; // Margin from the edges of the SVG to prevent nodes from going out of view

    d3.select("#mindmap-container").selectAll("svg").remove();

    const svg = d3.select("#mindmap-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define nodes with labels and links
    const nodes = [
        { id: "Adaptive Reuse", label: "Adaptive Reuse", type: "central", lines: ["Adaptive", "Gorilla"] },

        { id: "Methods", label: "Methods", type: "branch" },
        { id: "Prototype", label: "Prototype", type: "leaf", lines: ["Prototype:", "Booleanify!"] },
        { id: "Balloonify!", label: "Balloonify!", type: "leaf", lines: ["Flagship:", "Balloonify!"] },
        { id: "References", label: "References", type: "branch" },
        { id: "Targets", label: "Targets", type: "branch" },
        { id: "Tools", label: "Tools", type: "branch" },
        { id: "Gordon Matta-Clark", label: "Gordon Matta-Clark", type: "leaf", lines: ["Gordon", "Matta-Clark"] },
        { id: "David Macaulay", label: "David Macaulay", type: "leaf", lines: ["David", "Macaulay"] },
        { id: "Rachel Whiteread", label: "Rachel Whiteread", type: "leaf", lines: ["Rachel", "Whiteread"] },
        { id: "Lebbeus Woods", label: "Lebbeus Woods", type: "leaf", lines: ["Lebbeus", "Woods"] },
        { id: "Cohort", label: "Cohort", type: "leaf", lines: ["My Beloved", "Cohort"] },
        { id: "Grasshopper", label: "Grasshopper", type: "leaf"},
        { id: "Blender", label: "Blender", type: "leaf" },
        { id: "Physical Models", label: "Physical Models", type: "leaf", lines: ["Physical", "Models"] },
        { id: "Python", label: "Python", type: "leaf" },
        { id: "GIS", label: "GIS", type: "leaf" },
        { id: "Building Codes", label: "Building Codes", type: "leaf", lines: ["Building", "Codes"] },
        { id: "Overbuilt Buildings", label: "Overbuilt Buildings", type: "leaf", lines: ["Overbuilt", "Buildings"] },
        { id: "Historic Buildings", label: "Historic Buildings", type: "leaf", lines: ["Historic", "Buildings"] },
        { id: "Urban Fabric", label: "Urban Fabric", type: "leaf", lines: ["Urban", "Fabric"] },

        { id: "Geometry Nodes", label: "Geometry nodes", type: "extra", lines: ["Geometry", "Nodes"] },
        { id: "Soft Body", label: "Soft Body", type: "extra", lines: ["Soft Body", "Physics"] },
        { id: "Kangaroo", label: "Kangaroo", type: "extra"},
        { id: "FlexHopper", label: "FlexHopper", type: "extra"},
        { id: "Membrane", label: "Membrane", type: "extra"},
        { id: "Building Structure", label: "Building Structure", type: "extra", lines: ["Building", "Structure"] },
        { id: "Technical Support", label: "Technical Support", type: "extra", lines: ["Technical", "Support"] },
        { id: "Emotional Support", label: "Emotional Support", type: "extra", lines: ["Emotional", "Support"] },
    ];

    const links = [
        { source: "Adaptive Reuse", target: "Methods" },
        { source: "Adaptive Reuse", target: "References" },
        { source: "Adaptive Reuse", target: "Targets" },
        { source: "Adaptive Reuse", target: "Tools" },
        { source: "Methods", target: "Prototype" },
        { source: "Methods", target: "Balloonify!" },
        { source: "References", target: "Gordon Matta-Clark" },
        { source: "References", target: "David Macaulay" },
        { source: "References", target: "Rachel Whiteread" },
        { source: "References", target: "Lebbeus Woods" },
        { source: "References", target: "Cohort" },
        { source: "Tools", target: "Grasshopper" },
        { source: "Tools", target: "Blender" },
        { source: "Tools", target: "Physical Models" },
        { source: "Tools", target: "Python" },
        { source: "Tools", target: "GIS" },
        { source: "Targets", target: "Building Codes" },
        { source: "Targets", target: "Overbuilt Buildings" },
        { source: "Targets", target: "Historic Buildings" },
        { source: "Targets", target: "Urban Fabric" },
        { source: "Blender", target: "Geometry Nodes" },
        { source: "Blender", target: "Soft Body" },
        { source: "Grasshopper", target: "Kangaroo" },
        { source: "Grasshopper", target: "FlexHopper" },
        { source: "Physical Models", target: "Membrane" },
        { source: "Physical Models", target: "Building Structure" },
        { source: "Cohort", target: "Technical Support" },
        { source: "Cohort", target: "Emotional Support" },
    ];

    // Randomize initial positions for all nodes
    nodes.forEach(node => {
        node.x = Math.random() * width;
        node.y = Math.random() * height;
    });

    // link distance
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
            const distanceFromCenter = Math.sqrt(Math.pow(d.source.x - width / 2, 2) + Math.pow(d.source.y - height / 2, 2));
            let distance = 110 + distanceFromCenter / 10; // Increase link distance as it goes further away from the center
            if (d.source.type === "branch") {
                distance *= 1.05; 
            }
            return distance;
        }))
        .force("charge", d3.forceManyBody().strength(-30)) // Reduced charge strength
        .force("x", d3.forceX(width / 2).strength(0)) // Disable centering force
        .force("y", d3.forceY(height / 2).strength(0)) // Disable centering force

    // Apply continuous random force
    function randomForce() {
        return function(alpha) {
            nodes.forEach(node => {
                node.vx += (Math.random() - 0.5) * 0.2; // Increased random velocity
                node.vy += (Math.random() - 0.5) * 0.2; // Increased random velocity
            });
        };
    }

    // Cursor repulsion force
    function cursorForce(x, y) {
        return function(alpha) {
            nodes.forEach(node => {
                const dx = node.x - x;
                const dy = node.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const radius = 70; // Distance within which nodes are pushed away
                const force = 0.2; // Increased strength of the force
                if (distance < radius) {
                    const angle = Math.atan2(dy, dx);
                    node.vx += force * (radius - distance) * Math.cos(angle);
                    node.vy += force * (radius - distance) * Math.sin(angle);
                }
            });
        };
    }

    // Apply forces continuously
    function applyForces() {
        svg.on("mousemove", (event) => {
            const [x, y] = d3.pointer(event);
            simulation.force("cursor", cursorForce(x, y));
        });
    }
    applyForces();

    // Function to determine stroke width based on source node type
    function getStrokeWidth(d) {
        const widths = {
            "central": 8,
            "branch": 4,
            "leaf": 2,
            "extra": 1
        };
        return widths[d.source.type] || 1; // Default to 1 if type is not recognized
    }
    
    // Function to determine stroke opacity based on source node type
    function getLinkOpacity(d) {
        return d.source.type === "extra" || d.target.type === "extra" ? 0.25 : 1; // Set opacity to 0.25 if either source or target is "extra"
    }


    function getLinkColor(d) {
        // If the source node is of type "branch", set the link color to #0033ff
        return d.source.type === "branch" ? "black" : "black"; // Default link color is black
    }
    
    // Append links first to be at the bottom
    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", d => getLinkColor(d)) // Set link color based on source node type
        .style("stroke-width", d => getStrokeWidth(d)) // Set line width based on source node type
        .style("stroke-opacity", d => getLinkOpacity(d)) // Set stroke opacity based on node type
        .attr("stroke-dasharray", d => {
            const distance = Math.sqrt((d.target.x - d.source.x) ** 3 + (d.target.y - d.source.y) ** 3);
            const maxLength = 250; // Maximum length of the link
            const dashLength = Math.min(distance, maxLength); // Length of the dash
            const dashCount = Math.floor(dashLength / 10); // Number of dashes
            const gapLength = (distance - dashLength) / dashCount; // Length of the gap
            return `${dashLength},${gapLength}`.repeat(dashCount);
        });

        
    // Append nodes after links
    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g");

    // Function to determine node radius based on type
    function getNodeRadius(d) {
        const baseRadius = 75; 
        const radius = {
            "central": baseRadius,
            "branch": baseRadius * 0.8,
            "leaf": baseRadius * 0.7,
            "extra": baseRadius * 0.5 // Smaller radius for extra nodes
        };
        return radius[d.type] || baseRadius * 0.5;
    }

    function getNodeStroke(d) {
        if (d.type === "central" || d.type === "branch" || d.type === "leaf") {
            return "black";
        }
        return "black";
    }

    function getNodeStrokeWidth(d) {
        if (d.type === "central") {
            return "8px";
        } else if (d.type === "branch") {
            return "4px";
        } else if (d.type === "leaf") {
            return "2px"; // No border for leaf nodes
        } else if (d.type === "extra") {
            return "1px"; // Thinner border for extra nodes
        }
        return "1px";
    }
    


    function getNodeColor(d) {
        if (d.id === "Prototype" || d.id === "Balloonify!") {
            return "#ffcc00"; // Specific color for these nodes
        }
        // Default colors for other nodes
        return d.type === "extra" ? "#dbdbdb" :
                d.type === "central" ? "black" :
                d.type === "branch" ? "#dbdbdb" : "#dbdbdb";
    }
    
    node.append("circle")
        .attr("class", d => d.type)
        .attr("r", d => getNodeRadius(d)) // Set radius based on node type
        .style("fill", d => getNodeColor(d)) // Set node color with specific color for certain nodes
        .style("stroke", d => d.type === "extra" ? "black" : getNodeStroke(d)) // Set stroke color based on node type, black for extra type
        .style("stroke-width", d => d.type === "extra" ? "1px" : getNodeStrokeWidth(d)) // Set stroke width, default to 1px for extra type
        .style("stroke-opacity", d => d.type === "extra" ? 0.25 : 1) // Set stroke opacity, 0.5 for extra type
        .call(drag(simulation));






    // Calculate font weight based on node type
    function getFontWeight(d) {
        const weights = {
            "central": 1000,
            "branch": 600,
            "leaf": 200
        };
        return weights[d.type];
    }

    // Apply dynamic font size and weight
    node.append("text")
        .attr("class", "node-text") // Apply the non-interactive class
        .attr("x", 0)
        .attr("y", d => d.lines ? -5 : 5) // Adjust y position for multi-line text
        .attr("text-anchor", "middle")
        .style("font-family", "Host Grotesk, sans-serif") // Set font family
        .style("font-weight", d => getFontWeight(d)) // Set font weight based on node type
        .style("fill", d => d.type === "central" ? "white" : "black") // Set text color to white for central and Branch nodes, black for others
        .style("font-size", d => d.type === "central" ? "25px" : d.type === "branch" ? "16px" : "14px") // Set font size based on node type
        .selectAll("tspan")
        .data(d => d.lines ? d.lines : [d.label]) // Use multi-line data or single line
        .enter().append("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => i === 0 ? "0" : "1.2em") // Adjust line spacing
        .text(d => d);


    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    simulation
        .alpha(1) // Start with higher alpha for movement
        .alphaDecay(0) // No alpha decay to maintain movement
        .on("tick", () => {
            // Apply random force on each tick
            randomForce()(simulation.alpha());

            // Constrain the central node's movement
            nodes.forEach(node => {
                if (node.type === "central") {
                    node.x = Math.max(margin, Math.min(width - margin, node.x));
                    node.y = Math.max(margin, Math.min(height - margin, node.y));
                }
            });

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);

            // Update node radius dynamically
            node.select("circle")
                .attr("r", d => getNodeRadius(d));
        })
        .restart(); // Restart the simulation
}
// Initial draw
drawMindMap();

// Redraw on window resize
window.addEventListener("resize", drawMindMap);