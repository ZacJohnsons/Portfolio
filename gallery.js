// Gallery functionality
class ProjectGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.modal = null;
    this.modalImage = null;
    this.modalCaption = null;
    this.init();
  }

  init() {
    this.setupModal();
    this.setupGalleryItems();
    this.setupKeyboardNavigation();
    this.animateOnLoad();
  }

  setupModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById("imageModal")) {
      const modalHTML = `
        <div id="imageModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <button class="modal-nav prev-modal" onclick="gallery.previousImage()">‹</button>
            <button class="modal-nav next-modal" onclick="gallery.nextImage()">›</button>
            <img class="modal-image" id="modalImage" src="" alt="">
            <div class="modal-caption">
              <h3 id="modalTitle"></h3>
              <p id="modalDescription"></p>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    this.modal = document.getElementById("imageModal");
    this.modalImage = document.getElementById("modalImage");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalDescription = document.getElementById("modalDescription");

    // Close modal events
    const closeBtn = document.querySelector(".close");
    closeBtn.onclick = () => this.closeModal();

    // Close on background click
    this.modal.onclick = (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    };
  }

  setupGalleryItems() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    this.images = Array.from(galleryItems);

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => this.openModal(index));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.openModal(index);
        }
      });

      // Make items focusable
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute(
        "aria-label",
        `View ${item.querySelector("h3").textContent} in large size`,
      );
    });
  }

  openModal(index) {
    this.currentImageIndex = index;
    const item = this.images[index];
    const img = item.querySelector("img");
    const title = item.querySelector("h3").textContent;
    const description = item.querySelector("p").textContent;

    this.modalImage.src = img.src;
    this.modalImage.alt = img.alt;
    this.modalTitle.textContent = title;
    this.modalDescription.textContent = description;

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus management
    this.modalImage.focus();
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";

    // Return focus to the item that was clicked
    if (this.images[this.currentImageIndex]) {
      this.images[this.currentImageIndex].focus();
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateModalImage();
  }

  previousImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateModalImage();
  }

  updateModalImage() {
    const item = this.images[this.currentImageIndex];
    const img = item.querySelector("img");
    const title = item.querySelector("h3").textContent;
    const description = item.querySelector("p").textContent;

    // Add fade effect
    this.modalImage.style.opacity = "0";

    setTimeout(() => {
      this.modalImage.src = img.src;
      this.modalImage.alt = img.alt;
      this.modalTitle.textContent = title;
      this.modalDescription.textContent = description;
      this.modalImage.style.opacity = "1";
    }, 150);
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("active")) return;

      switch (e.key) {
        case "Escape":
          this.closeModal();
          break;
        case "ArrowLeft":
          this.previousImage();
          break;
        case "ArrowRight":
          this.nextImage();
          break;
      }
    });
  }

  animateOnLoad() {
    // Animate gallery items on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe gallery items with staggered delay
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        observer.observe(item);
      }, index * 100);
    });
  }
}

// Image loading with error handling
function setupImageLoading() {
  const images = document.querySelectorAll(".gallery-item img");

  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1";
    });

    img.addEventListener("error", function () {
      const placeholder = this.parentNode.querySelector(".loading-placeholder");
      if (!placeholder) {
        const placeholderDiv = document.createElement("div");
        placeholderDiv.className = "loading-placeholder";
        placeholderDiv.textContent = "Image not available";
        this.parentNode.appendChild(placeholderDiv);
        this.style.display = "none";
      }
    });

    // Set initial opacity for fade-in effect
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
  });
}

// Touch/swipe support for mobile
class TouchHandler {
  constructor(gallery) {
    this.gallery = gallery;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    const modal = this.gallery.modal;

    modal.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    modal.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.gallery.nextImage();
      } else {
        // Swipe right - previous image
        this.gallery.previousImage();
      }
    }
  }
}

// Lazy loading for better performance
function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize gallery
  window.gallery = new ProjectGallery();

  // Setup touch handler
  new TouchHandler(window.gallery);

  // Setup image loading
  setupImageLoading();

  // Setup lazy loading if needed
  setupLazyLoading();

  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

// Utility functions
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

// Export for use in individual gallery pages
window.ProjectGallery = ProjectGallery;
window.TouchHandler = TouchHandler;

