document.addEventListener('DOMContentLoaded', function () {
    const canvas = d3.select('#network');
    const width = 1200;
    const height = 800;
    const r = 30;
    const ctx = canvas.node().getContext('2d');

    const color = d3.scaleOrdinal(d3.schemeAccent);

    const graph = {
        nodes: [/* Replace with your nodes data */],
        links: [/* Replace with your links data */]
    };

    const simulation = d3.forceSimulation()
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .force('collide', d3.forceCollide(r + 20))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('link', d3.forceLink().id(node => node.name))
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
        ctx.strokeStyle = 'white';
        graph.links.forEach(drawLink);
        ctx.stroke();

        ctx.beginPath();
        ctx.globalAlpha = 1;
        graph.nodes.forEach(drawNode);
        ctx.fill();
    }

    function drawNode(d, i) {
        const opacity = 0.4 + (i / graph.nodes.length) * 0.6;
        ctx.globalAlpha = opacity;

        ctx.font = '16px Libre Baskerville, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(d.name, d.x, d.y);
    }

    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
    }

    function dragsubject(event) {
        return simulation.find(event.x, event.y);
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

    update();
});
