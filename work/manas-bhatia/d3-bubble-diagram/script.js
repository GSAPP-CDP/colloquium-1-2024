const nodes = [
    { id: "Clients", group: 1, description: "Clients oversee project requirements and approvals. They need intuitive tools to articulate needs and understand designs. While architects decide on massing, clients should control style and aesthetics, providing feedback throughout to ensure their vision is realized.", size: 30 },
    { id: "Architects", group: 2, description: "Architects handle creative design, needing a balance of consistency and flexibility. Tools should offer standardized workflows and allow customization. Architects must ensure originality, compliance, and ethical use of AI, with credit for their creative input.", size: 40 },
    { id: "Project Managers & Contractors", group: 3, description: "They require consistency for compliance and efficient management but need flexibility for on-site challenges. They control timelines and execution, ensuring projects are built to specifications while adapting schedules as needed.", size: 35 },
    { id: "Consultants", group: 4, description: "Consultants need standardized data for integration and flexibility for their expertise. They have authorship over their fields but must align with the overall project, sometimes adjusting their proposals as directed by architects.", size: 25 },
    { id: "Government & Regulatory Bodies", group: 5, description: "They enforce strict adherence to standards, holding significant authority but not credit for creative aspects.", size: 20 },
    { id: "Software Developers", group: 6, description: "Developers create adaptable frameworks meeting industry standards, enabling architects to work efficiently. Tools must be ethical and transparent, with architects retaining copyright over their work. Developers should be credited through licensing, especially for AI tools referencing their work.", size: 45 }
];

const links = [
    { source: "Clients", target: "Architects" },
    { source: "Architects", target: "Project Managers & Contractors" },
    { source: "Project Managers & Contractors", target: "Consultants" },
    { source: "Consultants", target: "Government & Regulatory Bodies" },
    { source: "Government & Regulatory Bodies", target: "Software Developers" },
    { source: "Software Developers", target: "Clients" } // Creating a loop for visualization
];

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Define a color scale based on the group property
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Set up the force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(200))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Create link elements
const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

    const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node"); // Ensure nodes have the "node" class



const circles = node.append("circle")
    .attr("r", d => d.size) // Use the size property for radius
    .attr("fill", d => color(d.group)) // Use the group property for color
    .call(drag(simulation));

    const labels = node.append("text")
    .text(d => d.id)
    .attr("dy", -3)
    .attr("text-anchor", "middle");
    
// Tooltip setup
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Tooltip event handlers
node.on("mouseover", function (event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(d.description)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function () {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
});

// Update the positions as the simulation runs
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

// Continuously apply random forces to nodes
d3.timer(() => {
    nodes.forEach(d => {
        d.vx += (Math.random() - 0.5) * 6; // Increase the random force
        d.vy += (Math.random() - 0.5) * 3; // Increase the random force
    });
    simulation.alpha(1).restart(); // Restart the simulation to apply the forces
});

// Drag functionality
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