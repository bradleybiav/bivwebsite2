
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      }
      
      // Close mobile menu if open
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.5rem 2rem';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.padding = '1rem 2rem';
      navbar.style.boxShadow = 'none';
    }
  });

  // Animation on scroll
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
  
  function checkInView() {
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkInView);
  checkInView(); // Check on initial load
  
  // Form validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = this.querySelector('input[name="name"]');
      const emailInput = this.querySelector('input[name="email"]');
      const messageInput = this.querySelector('textarea[name="message"]');
      
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        isValid = false;
        showError(nameInput, 'Please enter your name');
      } else {
        removeError(nameInput);
      }
      
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        isValid = false;
        showError(emailInput, 'Please enter a valid email');
      } else {
        removeError(emailInput);
      }
      
      if (!messageInput.value.trim()) {
        isValid = false;
        showError(messageInput, 'Please enter your message');
      } else {
        removeError(messageInput);
      }
      
      if (isValid) {
        // Here you would typically send the form data to a server
        const formData = {
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value
        };
        
        console.log('Form data:', formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
      }
    });
  }
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
      formGroup.appendChild(errorMessage);
    }
    
    input.classList.add('error');
  }
  
  function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
      formGroup.removeChild(errorMessage);
    }
    
    input.classList.remove('error');
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // 3D Model Loading (if present)
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.addEventListener('load', function() {
      console.log('3D model loaded successfully');
    });
    
    modelViewer.addEventListener('error', function(error) {
      console.error('Error loading 3D model:', error);
    });
  }
});

// Performance data
const performances = [
  {
    title: 'Movement Research',
    date: 'May 15, 2023',
    location: 'Contemporary Dance Studio',
    description: 'An exploratory session focusing on the relationship between neural pathways and physical movement.',
    image: 'performance1.jpg'
  },
  {
    title: 'Cognitive Dance',
    date: 'June 20, 2023',
    location: 'City Arts Center',
    description: 'A performance investigating how cognitive processes manifest through dance and improvisation.',
    image: 'performance2.jpg'
  },
  {
    title: 'Neural Networks',
    date: 'August 5, 2023',
    location: 'University Theater',
    description: 'A collaborative performance with neuroscientists examining the parallels between neural networks and choreographic structures.',
    image: 'performance3.jpg'
  }
];

// Function to dynamically populate performances
function populatePerformances() {
  const performanceGrid = document.querySelector('.performance-grid');
  if (performanceGrid) {
    performances.forEach(performance => {
      const card = document.createElement('div');
      card.className = 'performance-card fade-in';
      
      card.innerHTML = `
        <div class="performance-image" style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center;">
          <span>Performance Image</span>
        </div>
        <div class="performance-details">
          <h3>${performance.title}</h3>
          <p><strong>Date:</strong> ${performance.date}</p>
          <p><strong>Location:</strong> ${performance.location}</p>
          <p>${performance.description}</p>
          <button class="btn">Learn More</button>
        </div>
      `;
      
      performanceGrid.appendChild(card);
    });
  }
}

// Call function to populate performances
window.addEventListener('load', populatePerformances);
