
gsap.registerPlugin(ScrollTrigger);

// GSAP Horizontal Scroll
let sections = gsap.utils.toArray(".panel");

// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');


function navigateToSection(sectionId) {
  document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
  const navbar = document.querySelector('.timeline-navbar');
  navbar.classList.toggle('active');
}
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('expanded');
});


gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth
  }
});

const flowers = [
  {
    name: "Tulip",
    color: "yellow",
    image: "./assets/images/1.png"
  },
  {
    name: "Sunflower",
    color: "yellow",
    image: "./assets/images/2.png"
  },
  {
    name: "Bluebell",
    color: "blue",
    image: "./assets/images/3.png"
  },
  {
    name: "Rose",
    color: "red",
    image: "./assets/images/4.png"
  },
  {
    image: "./assets/images/5.png"
  },
  {
    image: "./assets/images/6.png"
  },
  {
    image: "./assets/images/7.png"
  },
  {
    image: "./assets/images/8.png"
  }

];

const btn = document.querySelector(".clear-btn");
const firstContainer = document.querySelector(".firstContainer");


let i = 0;

function placeImage(x, y) {
  const nextImg = flowers[i].image;
  console.log(nextImg);

  const img = document.createElement("img");
  img.setAttribute("src", nextImg);
  img.style.left = x + "px";
  img.style.top = y + "px";
  img.style.transform = "translate(-50%, -50%) scale(1.5) rotate(" + Math.random() * 20 + "deg)";

  firstContainer.appendChild(img);

  i = i + 1;
  if (i >= flowers.length) {
    i = 0;
  }
}

// For web
firstContainer.addEventListener("click", function(event) {
  event.preventDefault();
  placeImage(event.pageX, event.pageY);
});

// For mobile
firstContainer.addEventListener("touchstart", function(event) {
  event.preventDefault();
  placeImage(event.touches[0].pageX, event.touches[0].pageY);
});

window.addEventListener('load', function() {
  const highlight = document.querySelector('.highlight');
  highlight.classList.add('animate');
});


document.addEventListener("DOMContentLoaded", function() {
  const scroller = scrollama();
  let currentGraph = null;

  function hideGraph(element) {
    if (element) {
      console.log("Hiding graph:", element.id);
      gsap.to(element, { autoAlpha: 0, duration: 0.5, onComplete: () => {
        element.style.display = 'none';
      }});
    }
  }
  
  function showGraph(element) {
    if (element) {
      console.log("Showing graph:", element.id);
      element.style.display = 'block';
      gsap.fromTo(
        element,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 }
      );
    } else {
      console.error("Graph element is null or undefined");
    }
  }
  
  scroller
    .setup({
      step: '.step',
      offset: 0.5,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  // Handle step enter
  function handleStepEnter(response) {
    // Hide the current graph if there is one
    if (currentGraph) {
      hideGraph(currentGraph);
    }
    
    // Show the graph corresponding to the current step
    currentGraph = document.querySelector(`#${response.element.dataset.graph}`);
    if (currentGraph) {
      showGraph(currentGraph);
    } else {
      console.error("No graph found for the current step");
    }
  }

  // Handle step exit (optional)
  function handleStepExit(response) {
    // Custom logic on step exit if needed
    console.log("Step exited:", response.element.dataset.graph);
  }

  // Reinitialize Scrollama on window resize
  window.addEventListener('resize', scroller.resize);
});
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const contentPanel = document.getElementById('content-panel');
  const infoContent = document.getElementById('info-content');
  
  const tabContent = {
    'tab1': `
      <div id="animation-container">
        <img src="assets/images/contentauthenticityinitiative.png" alt="Content Authenticity Initiative" class="tab-image small-image">
      </div>
      <div class="design-fiction">
        <h3>Ensuring Digital Integrity</h3>
        <p>Digital content is cryptographically hashed and validated through a decentralized blockchain network. This initiative allows users to verify the authenticity of content via an API or browser plugin, ensuring that what they see is genuine and unaltered.</p>
      </div>
    `,
'tab2': `
  <div id="animation-container">
    <img src="assets/images/nightshadeAI.png" alt="Nightshade AI" class="tab-image small-image">
  </div>
  <div class="design-fiction">
    <h3>Advanced Threat Detection & Mitigation</h3>
    <p>Nightshade AI utilizes cutting-edge machine learning algorithms to detect and mitigate cybersecurity threats in real-time. The system continuously analyzes network traffic and user behavior, automatically responding to potential threats before they can cause harm.</p>
  </div>
`,
'tab3': `
<div id="animation-container">
  <img src="assets/images/face.png" alt="Minimalist Metal Mask" class="tab-image small-image">
</div>
<div class="design-fiction">
  <h3>Merging Style with Functionality</h3>
  <p>The Minimalist Brass Mask is designed to cover the wearer's face, preventing facial recognition software from identifying them. This mask is a direct response to the increasing prevalence of public surveillance, embodying both a functional purpose and a strong message against the erosion of personal privacy.</p>
  </div>
`
  };

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contentPanel.style.display = 'block';
        infoContent.style.opacity = '0';
        
        setTimeout(() => {
          infoContent.innerHTML = tabContent[tab.id];
          infoContent.style.opacity = '1';
        }, 300);
      });
    });
  });
  


document.addEventListener("DOMContentLoaded", function () {
  const highlights = document.querySelectorAll('.highlight');

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is in view
  };

  const highlightObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // Stop observing once the animation is triggered
      }
    });
  }, observerOptions);

  highlights.forEach(highlight => {
    highlightObserver.observe(highlight);
  });
});

const style = document.createElement('style');
style.textContent = `
  .small-image {
    width: auto;  /* 或者您想要的任何尺寸 */
    height: 100%;  /* 保持宽高比 */
    object-fit: contain;  /* 确保图片完全适应指定的尺寸 */
  }
`;
document.head.appendChild(style);
