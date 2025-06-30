// Global variables
let currentProjectIndex = 0;
let projectInterval;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializePortfolio();
});

// Initialize all portfolio functionality
function initializePortfolio() {
  setupSectionToggling();
  setupProjectCarousel();
  setupSmoothScrolling();
  setupAnimations();
  startProjectAutoplay();
}

// Section Toggling (About Me tabs)
function setupSectionToggling() {
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const contentSections = document.querySelectorAll(".content-section");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetSection = this.getAttribute("data-section");

      // Remove active class from all buttons and sections
      toggleButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.remove("active"));

      // Add active class to clicked button and corresponding section
      this.classList.add("active");
      document.getElementById(targetSection).classList.add("active");
    });
  });
}

// Project Carousel
function setupProjectCarousel() {
  const slides = document.querySelectorAll(".project-slide");
  const dots = document.querySelectorAll(".dot");

  // Show specific project
  window.currentProject = function (n) {
    showProject((currentProjectIndex = n - 1));
  };

  // Change project (next/previous)
  window.changeProject = function (n) {
    showProject((currentProjectIndex += n));
  };

  function showProject(n) {
    // Reset interval
    clearInterval(projectInterval);
    startProjectAutoplay();

    // Wrap around if necessary
    if (n >= slides.length) {
      currentProjectIndex = 0;
    }
    if (n < 0) {
      currentProjectIndex = slides.length - 1;
    }

    // Hide all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show current slide and dot
    slides[currentProjectIndex].classList.add("active");
    dots[currentProjectIndex].classList.add("active");
  }

  // Initialize first project
  showProject(currentProjectIndex);
}

// Autoplay for projects
function startProjectAutoplay() {
  projectInterval = setInterval(function () {
    currentProjectIndex++;
    if (
      currentProjectIndex >= document.querySelectorAll(".project-slide").length
    ) {
      currentProjectIndex = 0;
    }

    const slides = document.querySelectorAll(".project-slide");
    const dots = document.querySelectorAll(".dot");

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[currentProjectIndex].classList.add("active");
    dots[currentProjectIndex].classList.add("active");
  }, 10000); // Change every 5 seconds
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Scroll animations
function setupAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all cards and sections for animation
  const animatedElements = document.querySelectorAll(
    ".card, .skill-category, .timeline-item",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Keyboard navigation for carousel
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    changeProject(-1);
  } else if (e.key === "ArrowRight") {
    changeProject(1);
  }
});

// Pause autoplay when user hovers over carousel
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".project-carousel");

  if (carousel) {
    carousel.addEventListener("mouseenter", function () {
      clearInterval(projectInterval);
    });

    carousel.addEventListener("mouseleave", function () {
      startProjectAutoplay();
    });
  }
});

// Mobile touch events for carousel
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".project-carousel");

  if (carousel) {
    carousel.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next project
      changeProject(1);
    } else {
      // Swipe right - previous project
      changeProject(-1);
    }
  }
}

// Form validation (if you add a contact form later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Utility function to debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add scroll effect to navigation (if you add a nav bar later)
window.addEventListener(
  "scroll",
  debounce(() => {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector(".navbar");

    if (navbar) {
      if (scrolled > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  }, 10),
);

// Progress bar for page loading
window.addEventListener("load", function () {
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = "100%";
    setTimeout(() => {
      progressBar.style.opacity = "0";
    }, 500);
  }
});

// Console welcome message
console.log(`
🚀 Welcome to Opolot Isaac's Portfolio!
📧 Contact: isaac.opolot2000@gmail.com / +256787638998
💼 LinkedIn: https://github.com/Joasac
🌐 GitHub: https://www.linkedin.com/in/opolot-isaac-166801255/

Thanks for checking out the code! 
Built with vanilla HTML, CSS, and JavaScript.
`);
