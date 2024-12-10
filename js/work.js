// Project Data
const projectData = {
  food: {
    title: "Food Photography",
    description: "Professional food photography showcasing culinary delights and presentations.",
    images: [
      '../img/work/hero-food.png',
      '../img/work/hero-poster.png',
      '../img/work/hero-social.png'
    ]
  },
  poster: {
    title: "Poster Design",
    description: "Creative poster designs for various events and promotions.",
    images: [
      '../img/work/hero-poster.png',
      '../img/work/hero-food.png',
      '../img/work/hero-social.png'
    ]
  },
  social: {
    title: "Social Media",
    description: "Engaging social media content designed for maximum impact.",
    images: [
      '../img/work/hero-social.png',
      '../img/work/hero-food.png',
      '../img/work/hero-poster.png'
    ]
  }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const projectLinks = document.querySelectorAll('.project-link');
  const modal = document.querySelector('.project-modal');
  const closeBtn = document.querySelector('.close-modal');
  const prevBtn = document.querySelector('.modal-nav.prev');
  const nextBtn = document.querySelector('.modal-nav.next');
  const dotsContainer = document.querySelector('.modal-dots');
  let currentSlide = 0;

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
    
    // Show correct slider group
    const sliderGroups = document.querySelectorAll('.slider-group');
    sliderGroups.forEach(group => {
      group.style.display = 'none';
      if (group.getAttribute('data-category') === category) {
        group.style.display = 'block';
        initializeSlider(group);
      }
    });

    // Update modal content
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-description');
    modalTitle.textContent = projectData[category].title;
    modalDesc.textContent = projectData[category].description;
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Slider Functions
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
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    const activeGroup = document.querySelector('.slider-group[style*="display: block"]');
    const slides = activeGroup.querySelectorAll('.slide');
    currentSlide = index;
    updateSlider(slides);
  }

  // Navigation
  prevBtn.addEventListener('click', () => {
    const activeGroup = document.querySelector('.slider-group[style*="display: block"]');
    const slides = activeGroup.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider(slides);
  });

  nextBtn.addEventListener('click', () => {
    const activeGroup = document.querySelector('.slider-group[style*="display: block"]');
    const slides = activeGroup.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider(slides);
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prevBtn.click();
        break;
      case 'ArrowRight':
        nextBtn.click();
        break;
    }
  });
}); 