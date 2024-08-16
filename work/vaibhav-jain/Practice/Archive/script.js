document.addEventListener('DOMContentLoaded', () => {
    drawFlowchart();
    addEventListeners();
});

function drawFlowchart() {
    // Storyteller Flowchart Data with formatting
    const storytellerData = [
        "<div class='content'><span class='highlight'>Weaving the Dream</span><br><span class='normal'>Travels, Reads, Thinks, and Gets an Idea for the Story</span></div>",
        "<div class='content'><span class='highlight'>The Quest for Truth</span><br><span class='normal'>Does Further Research</span></div>",
        "<div class='content'><span class='highlight'>Crafting the Tale</span><br><span class='normal'>Develops the Script with the Writers’ Team</span></div>",
        "<div class='content'><span class='highlight'>Unveiling the Vision</span><br><span class='normal'>Presents to the Producers</span></div>",
        "<div class='content'><div class='highlight'>Interactive Diagram</div></div>" // Placeholder text for the 5th box
    ];

    // Multi-Disciplinary Design Practice Flowchart Data with formatting
    const multiDisciplinaryData = [
        "<div class='content'><span class='highlight'>Searching for the Narrative</span><br><span class='normal'>Integrating the Field of Filmmaking</span></div>",
        "<div class='content'><span class='highlight'>Research, Achieve, and Document</span><br><span class='normal'>Document the Achievements and Research</span></div>",
        "<div class='content'><span class='highlight'>Design and Intervention</span><br><span class='normal'>Fulfilling the Narrative Needs</span></div>",
        "<div class='content'><span class='highlight'>Present to Investors</span><br><span class='normal'>Showcase to Potential Investors</span></div>",
        "<div class='content'><div class='highlight'>Interactive Diagram</div></div>" // Placeholder text for the 5th box
    ];

    // Select containers
    const storytellerContainer = d3.select("#storyteller");
    const multiDisciplinaryContainer = d3.select("#multi-disciplinary");

    // Create boxes for storyteller flowchart
    storytellerContainer.selectAll(".box")
        .data(storytellerData)
        .enter()
        .append("div")
        .attr("class", (d, i) => `box step${i + 1}`)
        .html((d, i) => `
            <div class="content">${d}</div>
        `);

    // Create boxes for multi-disciplinary flowchart
    multiDisciplinaryContainer.selectAll(".box")
        .data(multiDisciplinaryData)
        .enter()
        .append("div")
        .attr("class", (d, i) => `box step${i + 1}`)
        .html((d, i) => `
            <div class="content">${d}</div>
        `);
}

function showBulletPoints(containerId, bulletPoints) {
    // Update the 5th box in the specified container with bullet points
    d3.select(`#${containerId} .box.step5`).html(bulletPoints);
}

function addEventListeners() {
    // Event listeners for the left container boxes
    d3.select("#storyteller .box.step1").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Gathering Inspiration:</strong> Immersing in diverse environments, cultures, and experiences.</li>
                    <li><strong>Reading:</strong> Exploring books, articles, and other materials related to potential story ideas.</li>
                    <li><strong>Thinking:</strong> Reflecting on personal experiences, observations, and insights.</li>
                    <li><strong>Formulating Initial Ideas:</strong> Brainstorming themes, characters, and plot concepts.</li>
                    <li><strong>Sketching Rough Concepts:</strong> Drafting preliminary notes or outlines for potential stories.</li>
                    <li><strong>Exploring Themes:</strong> Identifying and refining the central themes and messages of the story.</li>
                </ul>
            </div>
        `;
        showBulletPoints('storyteller', bulletPoints);
    });

    d3.select("#storyteller .box.step2").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Investigating Plot Points:</strong> Developing key events and turning points in the story.</li>
                    <li><strong>Structuring the Story:</strong> Outlining the beginning, middle, and end.</li>
                    <li><strong>Researching Locations:</strong> Gathering information on settings and environments.</li>
                    <li><strong>Identifying High Points:</strong> Determining crucial moments of tension and resolution.</li>
                    <li><strong>Casting:</strong> Considering potential actors and characters.</li>
                    <li><strong>Historical and Cultural Context:</strong> Researching relevant historical, social, or cultural elements.</li>
                    <li><strong>Competitor Analysis:</strong> Reviewing similar stories or genres to differentiate the narrative.</li>
                </ul>
            </div>
        `;
        showBulletPoints('storyteller', bulletPoints);
    });

    d3.select("#storyteller .box.step3").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Collaborating on Scriptwriting:</strong> Working with writers to develop the dialogue and plot.</li>
                    <li><strong>Refining the Narrative:</strong> Adjusting the story arc and character development.</li>
                    <li><strong>Drafting and Revising:</strong> Creating multiple drafts and refining based on feedback.</li>
                    <li><strong>Incorporating Feedback:</strong> Integrating input from collaborators, producers, and test readers.</li>
                    <li><strong>Finalizing Script:</strong> Completing the final version of the script ready for presentation.</li>
                    <li><strong>Script Formatting:</strong> Ensuring the script adheres to industry standards.</li>
                </ul>
            </div>
        `;
        showBulletPoints('storyteller', bulletPoints);
    });

    d3.select("#storyteller .box.step4").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Pitch Preparation:</strong> Crafting a compelling pitch and presentation materials.</li>
                    <li><strong>Pitching the Script:</strong> Presenting the script to producers for consideration.</li>
                    <li><strong>Handling Questions:</strong> Responding to questions and feedback from producers.</li>
                    <li><strong>Negotiating Terms:</strong> Discussing budget, timelines, and production details.</li>
                    <li><strong>Securing Approval:</strong> Obtaining approval and securing funding or resources.</li>
                    <li><strong>Preparing for Production:</strong> Finalizing contracts and scheduling for the production phase.</li>
                </ul>
            </div>
        `;
        showBulletPoints('storyteller', bulletPoints);
    });

    // Event listeners for the right container boxes
    d3.select("#multi-disciplinary .box.step1").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Identifying Problems for Intervention:</strong> Pinpointing areas where design interventions can make a difference.</li>
                    <li><strong>Interviewing Local Professionals:</strong> Gaining insights from local experts to inform design decisions.</li>
                    <li><strong>Understanding Local Culture:</strong> Exploring and integrating cultural aspects into the design process.</li>
                    <li><strong>Academic Education and Exploring Locations:</strong> Leveraging academic knowledge and site exploration for context.</li>
                    <li><strong>Documenting Narratives and Stories:</strong> Capturing real-life stories to enhance the design’s authenticity.</li>
                    <li><strong>Bringing the Real Life of the City to the Audience:</strong> Showcasing the vibrant life of the city through design.</li>
                    <li><strong>Opening New Mediums for Designers:</strong> Creating innovative platforms for design expression.</li>
                    <li><strong>Sharing Stories of Designers or Places:</strong> Highlighting stories to foster a deeper connection with the design.</li>
                    <li><strong>Increasing Tourism Potential:</strong> Designing interventions that attract and engage tourists.</li>
                    <li><strong>Potential for Becoming an OTT Series or Study Trip:</strong> Exploring opportunities for broader exposure through media or educational trips.</li>
                </ul>
            </div>
        `;
        showBulletPoints('multi-disciplinary', bulletPoints);
    });

    d3.select("#multi-disciplinary .box.step2").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Utilizing Computation Tools and Methods:</strong> Employing mapping, data visualization, spatial analysis, and narrative documentation.</li>
                    <li><strong>Digitally Capturing Film Content:</strong> Converting film content into digital formats for analysis and presentation.</li>
                    <li><strong>Achieving a Realistic Depiction of the City for Future Development:</strong> Creating accurate city depictions to guide future design.</li>
                    <li><strong>Generating Base Data for Design Practices:</strong> Establishing foundational data for design projects.</li>
                    <li><strong>Analyzing Data for Problems and Inception Points for Intervention:</strong> Identifying issues and potential intervention points from data.</li>
                    <li><strong>Further Academic Education:</strong> Continuing education to stay informed and innovative.</li>
                </ul>
            </div>
        `;
        showBulletPoints('multi-disciplinary', bulletPoints);
    });

    d3.select("#multi-disciplinary .box.step3").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Urban Design Proposals:</strong> Crafting interventions that reshape urban spaces to meet the narrative's vision.</li>
                    <li><strong>Material Exploration:</strong> Investigating innovative materials to enhance design effectiveness and sustainability.</li>
                    <li><strong>Technological Innovation:</strong> Integrating cutting-edge technologies to elevate the design and functionality.</li>
                    <li><strong>Construction System Proposals:</strong> Developing detailed and efficient construction systems for implementation.</li>
                    <li><strong>Architectural Proposals:</strong> Designing architectural solutions that align with the project’s vision and requirements.</li>
                    <li><strong>Fashion and Product Development:</strong> Creating design concepts for fashion and product lines that reflect the narrative.</li>
                    <li><strong>Furniture Design:</strong> Proposing bespoke furniture solutions that complement the overall design.</li>
                    <li><strong>Installation Proposals:</strong> Designing and planning installations that interact with the space and narrative.</li>
                    <li><strong>Landscape Design:</strong> Developing interventions that enhance outdoor environments and public spaces.</li>
                    <li><strong>Interactive Media:</strong> Incorporating interactive elements to engage users and enrich their experience.</li>
                    <li><strong>Exhibition Design:</strong> Designing immersive exhibitions that communicate the project’s themes and messages.</li>
                </ul>
            </div>
        `;
        showBulletPoints('multi-disciplinary', bulletPoints);
    });

    d3.select("#multi-disciplinary .box.step4").on("click", () => {
        const bulletPoints = `
            <div class="bullet-points">
                <ul>
                    <li><strong>Pitching the Intervention:</strong> Presenting the design intervention to potential investors.</li>
                    <li><strong>Facilitating Open Presentations and Collaboration with Multiple Investors:</strong> Hosting presentations and collaborating with various investors.</li>
                    <li><strong>Balancing Creativity with Business Needs:</strong> Ensuring that creativity is maintained while meeting business requirements.</li>
                    <li><strong>Developing a Solid Proposal Before Project Confirmation:</strong> Crafting a comprehensive proposal before project confirmation.</li>
                    <li><strong>Ensuring Solid Support for Approvals:</strong> Securing robust support to facilitate project approvals.</li>
                    <li><strong>Allowing Designers to Choose Investors and Retain Ownership:</strong> Enabling designers to select investors and maintain ownership.</li>
                    <li><strong>Ensuring Designers Receive Their Share of Profits:</strong> Ensuring fair profit-sharing for designers.</li>
                </ul>
            </div>
        `;
        showBulletPoints('multi-disciplinary', bulletPoints);
    });
}
