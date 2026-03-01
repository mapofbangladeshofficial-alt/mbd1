// Contact Popup Functions
window.openContactPopup = function () {
  console.log('openContactPopup called');
  const popup = document.getElementById('contactPopup');
  console.log('Popup element:', popup);
  if (popup) {
    popup.style.display = 'flex';
    // Trigger reflow
    popup.offsetHeight;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Popup opened');
  } else {
    console.error('Popup element not found!');
  }
}

window.closeContactPopup = function () {
  console.log('closeContactPopup called');
  const popup = document.getElementById('contactPopup');
  if (popup) {
    popup.classList.remove('active');
    // Wait for animation to complete before hiding
    setTimeout(() => {
      popup.style.display = 'none';
      document.body.style.overflow = '';
      console.log('Popup closed');
    }, 300);
  }
}

// Three.js Scene Setup (Removed for simpler animation)
let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Custom Cursor Variables - Optimized
let cursor, cursorFollower;
let cursorX = 0,
  cursorY = 0;
let followerX = 0,
  followerY = 0;
let isHovering = false;

// Cart functionality
let cart = [];

// 3D Tilt Effect Logic
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.project-card, .skill-category, .language-badge, .floating-card, .product-card, .feature');

  tiltElements.forEach(el => {
    // Add glare element if it doesn't exist
    if (!el.querySelector('.tilt-glare')) {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      el.appendChild(glare);
    }

    el.addEventListener('mousemove', handleTilt);
    el.addEventListener('mouseleave', resetTilt);
  });
}

function handleTilt(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
  const rotateY = ((x - centerX) / centerX) * 10;

  const glare = el.querySelector('.tilt-glare');
  const glareX = (x / rect.width) * 100;
  const glareY = (y / rect.height) * 100;

  el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

  if (glare) {
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3), transparent 60%)`;
    glare.style.opacity = '1';
  }
}

function resetTilt(e) {
  const el = e.currentTarget;
  const glare = el.querySelector('.tilt-glare');

  el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

  if (glare) {
    glare.style.opacity = '0';
  }
}

// Initialize Custom Cursor - Optimized
function initCustomCursor() {
  // Only on desktop
  if (window.innerWidth <= 768) {
    console.log("Mobile device detected - cursor disabled");
    return;
  }

  console.log("Initializing custom cursor...");

  // Add custom cursor class to body to hide default cursor
  document.body.classList.add("custom-cursor");

  // Create cursor elements
  cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.style.left = "0px";
  cursor.style.top = "0px";
  cursor.style.opacity = "1";
  cursor.style.visibility = "visible";
  document.body.appendChild(cursor);

  cursorFollower = document.createElement("div");
  cursorFollower.className = "cursor-follower";
  cursorFollower.style.left = "0px";
  cursorFollower.style.top = "0px";
  cursorFollower.style.opacity = "1";
  cursorFollower.style.visibility = "visible";
  document.body.appendChild(cursorFollower);

  // Initialize cursor positions to center
  cursorX = window.innerWidth / 2;
  cursorY = window.innerHeight / 2;
  followerX = cursorX;
  followerY = cursorY;

  console.log("Custom cursor created and added to DOM");
  console.log("Cursor element:", cursor);
  console.log("Follower element:", cursorFollower);

  // Start animation loop for cursor
  animateCursor();

  console.log("Custom cursor animation loop started");
}

// Smooth cursor animation using RAF
function animateCursor() {
  // Reduced smoothing for less delay (changed from 0.15 to 0.3)
  followerX += (cursorX - followerX) * 0.3;
  followerY += (cursorY - followerY) * 0.3;

  // Update cursor position using transform for better performance
  if (cursor) {
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
  }

  if (cursorFollower) {
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top = followerY + "px";
  }

  requestAnimationFrame(animateCursor);
}

// Create simple ripple effect on click
function createRipple(x, y) {
  const ripple = document.createElement("div");
  ripple.className = "cursor-ripple";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Mouse move event - Optimized
let rafPending = false;
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - windowHalfX) / windowHalfX;
  mouseY = (event.clientY - windowHalfY) / windowHalfY;

  // Update cursor position
  cursorX = event.clientX;
  cursorY = event.clientY;

  if (rafPending) return;
  rafPending = true;

  requestAnimationFrame(() => {
    // Check for hoverable elements
    const hoverable = event.target.closest(
      ".btn, .nav-link, .product-card, .social-link, .skill-category, .feature, .buy-btn",
    );

    if (hoverable) {
      if (!isHovering) {
        cursor?.classList.add("hover");
        cursorFollower?.classList.add("hover");
        isHovering = true;
      }
    } else {
      if (isHovering) {
        cursor?.classList.remove("hover");
        cursorFollower?.classList.remove("hover");
        isHovering = false;
      }
    }

    rafPending = false;
  });
});

// Mouse click events - Simple ripple only
document.addEventListener("mousedown", (event) => {
  if (cursor) {
    cursor.classList.add("click");
  }
  createRipple(event.clientX, event.clientY);
});

document.addEventListener("mouseup", () => {
  if (cursor) {
    cursor.classList.remove("click");
  }
});

// Window resize
window.addEventListener("resize", () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
});

// Navigation
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Navbar scroll effect
const navbar = document.querySelector(".navbar");
let lastScroll = 0;
let ticking = false;

window.addEventListener("scroll", () => {
  lastScroll = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (lastScroll > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Typing animation
const typingText = document.querySelector(".typing-text");
const texts = [
  "Premium Free Fire Cheat",
  "Antiban Protection",
  "Main ID Safe",
  "ESP & Aimbot",
  "Lifetime Updates",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 150;

function typeText() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 150;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typingDelay = 500;
  }

  setTimeout(typeText, typingDelay);
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

// Observe elements
const revealElements = document.querySelectorAll(
  ".skill-category, .product-card, .stat-item, .about-content, .contact-content, .feature",
);
revealElements.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + (isNaN(target) ? "" : "+");
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + (isNaN(target) ? "" : "+");
    }
  }, 16);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        const statNumber = entry.target.querySelector(".stat-number");
        const targetValue = statNumber.textContent.replace("+", "");
        statNumber.textContent = "0+";
        animateCounter(statNumber, isNaN(parseInt(targetValue)) ? targetValue : parseInt(targetValue), 2000);
        entry.target.classList.add("counted");
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".stat-item").forEach((stat) => {
  statsObserver.observe(stat);
});

// Form submission
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = "Message Sent! ✓";
      submitBtn.style.background =
        "linear-gradient(135deg, #10b981 0%, #059669 100%)";

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = "";
      }, 3000);
    }, 1500);

    console.log("Form submitted:", data);
  });
}

// Function to add items to cart
function addToCart(productName, price) {
  const product = { name: productName, price: price };
  cart.push(product);
  alert(`${productName} has been added to your cart!`);
  updateCartCount();
}

// Function to update cart count (in a real app, this would show the actual count)
function updateCartCount() {
  // This is a placeholder - in a real app you would update a cart icon with the item count
  console.log(`Cart now has ${cart.length} items`);
}

// Add event listeners to all "Add to Cart" buttons - DISABLED (using popup instead)
/*
function initCartButtons() {
  const buyButtons = document.querySelectorAll('.buy-btn');

  buyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const priceText = productCard.querySelector('.price').textContent;
      const price = parseFloat(priceText.replace('$', ''));

      addToCart(productName, price);
    });
  });
}
*/

// Parallax effect for floating cards - Throttled
let parallaxTicking = false;
document.addEventListener("mousemove", (e) => {
  if (parallaxTicking) return;

  parallaxTicking = true;
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll(".floating-card");
    const mouseXPercent = e.clientX / window.innerWidth;
    const mouseYPercent = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseXPercent - 0.5) * speed * 20;
      const y = (mouseYPercent - 0.5) * speed * 20;

      card.style.transform = `translate(${x}px, ${y}px)`;
    });

    parallaxTicking = false;
  });
});

// Product card hover effect
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Scroll progress indicator
function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;

  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
    document.body.appendChild(progressBar);
  }

  progressBar.style.width = scrollProgress + "%";
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing website...");
  console.log("Window size:", window.innerWidth, "x", window.innerHeight);

  // Initialize Three.js - Removed
  // initThreeJS();

  // Initialize custom cursor immediately
  // initCustomCursor(); // Disabled - using default cursor

  // Initialize 3D Tilt Effect
  initTiltEffect();

  // Initialize cart buttons
  // initCartButtons(); // Disabled - using contact popup instead

  // Start typing animation
  setTimeout(typeText, 1000);

  // Add smooth entrance animations
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);

  // Preload animations
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    setTimeout(() => {
      heroContent.style.transition = "opacity 1s ease";
      heroContent.style.opacity = "1";
    }, 300);
  }
});

// Easter egg - Konami code
let konamiCode = [];
const konamiPattern = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode.splice(
    -konamiPattern.length - 1,
    konamiCode.length - konamiPattern.length,
  );

  if (konamiCode.join("") === konamiPattern.join("")) {
    // Easter egg activated
    document.body.style.animation = "rainbow 2s linear infinite";

    const style = document.createElement("style");
    style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});

// Performance optimization - Reduced
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  // Simpler animations for low-end devices can be handled by CSS media queries if needed
}

// Add loading screen
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }

  // Scroll to top on page load/reload
  window.scrollTo(0, 0);
});
// Hero Image Slider
function initHeroSlider() {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');

  if (!sliderWrapper || slides.length === 0) {
    console.log('Slider not found or no slides');
    return;
  }

  // Clone first slide and append to end for seamless loop
  const firstSlideClone = slides[0].cloneNode(true);
  sliderWrapper.appendChild(firstSlideClone);

  let currentIndex = 0;
  const totalSlides = slides.length; // Original count
  const slideInterval = 3000;

  function updateSlider(instant = false) {
    const translateX = -(currentIndex * 100);

    if (instant) {
      sliderWrapper.style.transition = 'none';
      sliderWrapper.style.transform = `translateX(${translateX}%)`;
      // Force reflow
      sliderWrapper.offsetHeight;
      sliderWrapper.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      sliderWrapper.style.transform = `translateX(${translateX}%)`;
    }
  }

  function nextSlide() {
    currentIndex++;
    updateSlider();

    // If we're at the cloned slide, reset to first slide instantly
    if (currentIndex === totalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        updateSlider(true);
      }, 600); // Wait for transition to complete
    }
  }

  // Initialize first slide
  updateSlider();

  // Start auto-slide
  setInterval(nextSlide, slideInterval);

  console.log('Slider initialized with infinite loop');
}

// Initialize slider when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
  initHeroSlider();
}


// Close popup on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeContactPopup();
  }
});
// Online Buy Toggle
function toggleOnlineOptions() {
    const box = document.getElementById("onlineOptions");
    if (!box) return;

    if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

// Go To Payment
function goToPayment(link) {
    window.open(link, "_blank");
}

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    openContactPopup();
  });
});
