// Main JavaScript for Portfolio

// Toggle Mobile Menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', 
        menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use default
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Function to apply project filtering
function applyFilter(filterValue) {
    // Show/hide projects based on filter
    projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Apply the default filter on page load
document.addEventListener('DOMContentLoaded', function() {
    // Find the button with active class
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        const defaultFilter = activeBtn.getAttribute('data-filter');
        applyFilter(defaultFilter);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(filterBtn => {
            filterBtn.classList.remove('active');
        });
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        applyFilter(filterValue);
    });
});

// Handle form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        try {
            // Hide any existing messages
            const existingMessages = document.querySelectorAll('.success-message, .error-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Add loading state to submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit the form to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            // Create message element
            const messageElement = document.createElement('div');
            
            if (response.ok) {
                messageElement.className = 'success-message';
                messageElement.textContent = 'Thanks! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                messageElement.className = 'error-message';
                messageElement.textContent = 'Oops! There was a problem sending your message. Please try again.';
            }
            
            // Insert message before the form
            contactForm.parentNode.insertBefore(messageElement, contactForm);
            
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Auto-remove message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = 'Network error. Please check your connection and try again.';
            contactForm.parentNode.insertBefore(errorElement, contactForm);
        }
    });
}

// Implement lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('lazy-load');
                    
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Implement smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Only if the target exists
        if (document.querySelector(targetId)) {
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Scroll to target
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL but without scrolling
            history.pushState(null, null, targetId);
        }
    });
});

// Add scroll-to-top functionality
const scrollToTopButton = document.createElement('div');
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
scrollToTopButton.setAttribute('role', 'button');
scrollToTopButton.setAttribute('tabindex', '0');
document.body.appendChild(scrollToTopButton);

// Style the scroll-to-top button
scrollToTopButton.style.position = 'fixed';
scrollToTopButton.style.bottom = '80px';
scrollToTopButton.style.right = '20px';
scrollToTopButton.style.width = '50px';
scrollToTopButton.style.height = '50px';
scrollToTopButton.style.backgroundColor = 'var(--primary-color)';
scrollToTopButton.style.color = 'white';
scrollToTopButton.style.borderRadius = '50%';
scrollToTopButton.style.display = 'flex';
scrollToTopButton.style.justifyContent = 'center';
scrollToTopButton.style.alignItems = 'center';
scrollToTopButton.style.cursor = 'pointer';
scrollToTopButton.style.zIndex = '999';
scrollToTopButton.style.boxShadow = 'var(--box-shadow)';
scrollToTopButton.style.transition = 'var(--transition)';
scrollToTopButton.style.opacity = '0';
scrollToTopButton.style.visibility = 'hidden';

// Handle scroll event for scroll-to-top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.visibility = 'visible';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.visibility = 'hidden';
    }
});

// Add click event for scroll-to-top button
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Make scroll-to-top button keyboard accessible
scrollToTopButton.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});