// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// DOM Elements
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.querySelector('.mobile-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
let lastScroll = 0;

// Theme Management
function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Navbar Scroll Effect
function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Floating effect
    if (currentScroll > 100) {
        navbar.classList.add('floating');
    } else {
        navbar.classList.remove('floating');
    }
    
    // Hide/show navbar
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateX(-50%)';
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.style.transform = 'translateX(-50%) translateY(-100%)';
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.style.transform = 'translateX(-50%) translateY(0)';
    }
    
    lastScroll = currentScroll;

    // Active section highlighting
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    window.addEventListener('scroll', handleScroll);
});

// System theme preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Enhanced slider functionality
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slider-item'),
    totalSlides: null,
    
    init() {
        this.totalSlides = this.slides.length;
        this.setupControls();
        this.autoPlay();
    },
    
    setupControls() {
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        
        prevBtn?.addEventListener('click', () => this.navigate(-1));
        nextBtn?.addEventListener('click', () => this.navigate(1));
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.querySelector('.slider')?.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.querySelector('.slider')?.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) this.navigate(1);
            if (touchStartX - touchEndX < -50) this.navigate(-1);
        });
    },
    
    navigate(direction) {
        this.currentSlide = (this.currentSlide + direction + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    },
    
    updateSlider() {
        const sliderItems = document.querySelector('.slider-items');
        if (sliderItems) {
            sliderItems.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
    },
    
    autoPlay() {
        setInterval(() => this.navigate(1), 5000);
    }
};

// Initialize slider if elements exist
if (document.querySelector('.slider')) {
    slider.init();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .about-content, .project-card').forEach(el => {
    observer.observe(el);
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.textContent = "↑";
scrollToTopBtn.classList.add("scroll-to-top");
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
});

// Form Validation for Contact Page
const contactForm = document.querySelector(".contact-form form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
        
        let isValid = true;

        // Name Validation
        if (name.trim() === "") {
            isValid = false;
            alert("Name is required.");
        }

        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            alert("Please enter a valid email address.");
        }

        // Message Validation
        if (message.trim() === "") {
            isValid = false;
            alert("Message cannot be empty.");
        }

        if (isValid) {
            // Send Form Data to Server (example: using Fetch API)
            console.log("Form submitted successfully");
            // Uncomment the following line for actual form submission
            // contactForm.submit();
        }
    });
}

// Preloader (optional)
window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        preloader.classList.add("hide");
    }
});

// Code for Preloader Styling
const preloaderCSS = document.createElement("style");
preloaderCSS.textContent = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 1s ease;
    }
    .preloader.hide {
        opacity: 0;
        visibility: hidden;
    }
    .preloader img {
        width: 100px;
        height: 100px;
    }
`;
document.head.appendChild(preloaderCSS);

// Portfolio Filter and Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 0);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Modal and Slider Functionality
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const projectLinks = document.querySelectorAll('.project-link');
    const sliderGroups = document.querySelectorAll('.slider-group');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;

    // Project Data
    const projectData = {
        posters: {
            title: "Poster Design Collection",
            description: "A series of creative poster designs for various events and promotions.",
            images: ['poster1.jpg', 'poster2.jpg', 'poster3.jpg']
        },
        food: {
            title: "Food Photography",
            description: "Professional food photography showcasing culinary delights and presentations.",
            images: ['food1.jpg', 'food2.jpg', 'food3.jpg']
        },
        social: {
            title: "Social Media Campaign",
            description: "Engaging social media content designed for maximum impact and reach.",
            images: ['social1.jpg', 'social2.jpg', 'social3.jpg']
        }
    };

    // Open Modal
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.closest('.portfolio-item').getAttribute('data-category');
            openModal(category);
        });
    });

    function openModal(category) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update modal content
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-description');
        modalTitle.textContent = projectData[category].title;
        modalDesc.textContent = projectData[category].description;
        
        // Show correct slider group
        sliderGroups.forEach(group => {
            group.classList.remove('active');
            if (group.getAttribute('data-category') === category) {
                group.classList.add('active');
                initializeSlider(group);
            }
        });
    }

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Slider Navigation
    function initializeSlider(sliderGroup) {
        const slides = sliderGroup.querySelectorAll('.slide');
        currentSlide = 0;
        updateSlider(slides);
        createDots(slides.length);
    }

    function updateSlider(slides) {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        updateDots();
    }

    function createDots(count) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        const activeGroup = document.querySelector('.slider-group.active');
        const slides = activeGroup.querySelectorAll('.slide');
        currentSlide = index;
        updateSlider(slides);
    }

    // Navigation Buttons
    prevBtn.addEventListener('click', () => {
        const activeGroup = document.querySelector('.slider-group.active');
        const slides = activeGroup.querySelectorAll('.slide');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider(slides);
    });

    nextBtn.addEventListener('click', () => {
        const activeGroup = document.querySelector('.slider-group.active');
        const slides = activeGroup.querySelectorAll('.slide');
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider(slides);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
});

// Typing Animation
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["UI/UX Designer", "Web Developer", "Creative Designer"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// Portfolio Slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelector('.slider-dots');
const prevBtn = document.querySelector('.slider-nav.prev');
const nextBtn = document.querySelector('.slider-nav.next');
let currentSlide = 0;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dots.appendChild(dot);
});

// Show initial slide
showSlide(currentSlide);

// Navigation functions
function showSlide(index) {
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelectorAll('.dot').forEach(dot => {
    dot.classList.remove('active');
  });

  slides[index].classList.add('active');
  document.querySelectorAll('.dot')[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto slide
setInterval(nextSlide, 5000);

