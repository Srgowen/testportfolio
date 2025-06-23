// Dr. Sarah Mitchell - Clinical Psychologist Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Global variables
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    setupTestimonialSlider();
    setupForms();
    setupModals();
    setupMobileMenu();
    
    // Set minimum date for booking to today
    const today = new Date().toISOString().split('T')[0];
    const bookingDateInput = document.getElementById('booking-date');
    if (bookingDateInput) {
        bookingDateInput.min = today;
    }
}

// Navigation functionality
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                scrollToSection(href.substring(1));
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Scroll effects and animations
function setupScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .step, .method, .credential');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Testimonial slider functionality
function setupTestimonialSlider() {
    if (testimonials.length === 0) return;
    
    // Auto-rotate testimonials every 8 seconds
    setInterval(() => {
        changeTestimonial(1);
    }, 8000);
}

function changeTestimonial(direction) {
    if (testimonials.length === 0) return;
    
    // Hide current testimonial
    testimonials[testimonialIndex].classList.remove('active');
    dots[testimonialIndex].classList.remove('active');
    
    // Calculate new index
    testimonialIndex += direction;
    
    if (testimonialIndex >= testimonials.length) {
        testimonialIndex = 0;
    } else if (testimonialIndex < 0) {
        testimonialIndex = testimonials.length - 1;
    }
    
    // Show new testimonial
    testimonials[testimonialIndex].classList.add('active');
    dots[testimonialIndex].classList.add('active');
}

function currentTestimonial(index) {
    if (testimonials.length === 0) return;
    
    // Hide current testimonial
    testimonials[testimonialIndex].classList.remove('active');
    dots[testimonialIndex].classList.remove('active');
    
    // Set new index (convert from 1-based to 0-based)
    testimonialIndex = index - 1;
    
    // Show new testimonial
    testimonials[testimonialIndex].classList.add('active');
    dots[testimonialIndex].classList.add('active');
}

// Form handling
function setupForms() {
    const contactForm = document.getElementById('contact-form');
    const bookingForm = document.getElementById('booking-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    }
    
    // Setup floating labels
    setupFloatingLabels();
}

function setupFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label && !group.classList.contains('checkbox-group')) {
            // Check if field has value on load
            if (input.value) {
                label.classList.add('active');
            }
            
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        console.log('Contact form submitted:', data);
        
        // Reset form
        e.target.reset();
        setupFloatingLabels(); // Reinitialize floating labels
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessModal('Thank you for your message! I\'ll get back to you within 24 hours.');
    }, 1500);
}

function handleBookingForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateBookingForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting...';
    submitBtn.disabled = true;
    
    // Simulate booking submission (replace with actual booking system)
    setTimeout(() => {
        console.log('Booking form submitted:', data);
        
        // Reset form
        e.target.reset();
        setupFloatingLabels(); // Reinitialize floating labels
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close booking modal and show success
        closeBookingModal();
        showSuccessModal('Your appointment request has been submitted! I\'ll contact you within 24 hours to confirm your appointment.');
    }, 1500);
}

function validateContactForm(data) {
    const requiredFields = ['name', 'email', 'service', 'message'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        showAlert('Please fill in all required fields: ' + missingFields.join(', '));
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showAlert('Please enter a valid email address.');
        return false;
    }
    
    if (!data.consent) {
        showAlert('Please provide consent to be contacted.');
        return false;
    }
    
    return true;
}

function validateBookingForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        showAlert('Please fill in all required fields: ' + missingFields.join(', '));
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showAlert('Please enter a valid email address.');
        return false;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showAlert('Please select a future date for your appointment.');
        return false;
    }
    
    if (!data.consent) {
        showAlert('Please acknowledge the appointment request terms.');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message) {
    // Create a simple alert modal or use browser alert
    // For now, using browser alert (can be replaced with custom modal)
    alert(message);
}

// Modal functionality
function setupModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Booking Modal Functions
function openBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Success Modal Functions
function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    if (modal) {
        const messageElement = modal.querySelector('p');
        if (messageElement && message) {
            messageElement.textContent = message;
        }
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Privacy/Terms/HIPAA Modal Functions (placeholders)
function openPrivacyModal() {
    showInfoModal('Privacy Policy', 'Privacy policy content would go here. This would include information about how personal information is collected, used, and protected.');
}

function openTermsModal() {
    showInfoModal('Terms of Service', 'Terms of service content would go here. This would include the terms and conditions for using the website and services.');
}

function openHipaaModal() {
    showInfoModal('HIPAA Notice', 'HIPAA notice content would go here. This would include information about patient privacy rights and how health information is protected.');
}

function showInfoModal(title, content) {
    // Create a temporary modal for info display
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close" onclick="this.closest('.modal').remove(); document.body.style.overflow = '';">&times;</span>
            </div>
            <div class="modal-body">
                <p>${content}</p>
                <button class="btn-primary" onclick="this.closest('.modal').remove(); document.body.style.overflow = '';">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
}

// Utility Functions
function formatPhoneNumber(phone) {
    // Simple phone formatting for US numbers
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    });
});

// Scroll to top functionality (optional)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional enhancement)
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `;
    
    button.onclick = scrollToTop;
    document.body.appendChild(button);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    addScrollToTopButton();
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Export functions for global access (if needed)
window.scrollToSection = scrollToSection;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeSuccessModal = closeSuccessModal;
window.changeTestimonial = changeTestimonial;
window.currentTestimonial = currentTestimonial;
window.openPrivacyModal = openPrivacyModal;
window.openTermsModal = openTermsModal;
window.openHipaaModal = openHipaaModal;
