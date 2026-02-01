// ============================================
// KRETIXLAB - Premium Interactive JavaScript
// ============================================

// === NAVIGATION & HEADER SCROLL ===
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

// Enhanced header background on scroll with smooth transition
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
});

// Mobile menu toggle with animation
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navLinksContainer.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Enhanced smooth scroll to sections & active link highlighting
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Close mobile menu if open
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';

        // Smooth scroll to section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll with improved detection
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// === PORTFOLIO FILTERING WITH ENHANCED ANIMATIONS ===
const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked tab
        button.classList.add('active');

        // Get filter value
        const filter = button.getAttribute('data-filter');

        // Filter portfolio items with stagger animation
        portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');

            // First hide all items
            item.classList.remove('active');

            // Then show matching items with delay
            setTimeout(() => {
                if (filter === 'all') {
                    item.classList.add('active');
                } else if (category === filter) {
                    item.classList.add('active');
                }
            }, index * 50); // Stagger effect
        });
    });
});

// === SCROLL ANIMATIONS (INTERSECTION OBSERVER) ===
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// === 3D CARD TILT EFFECT ===
const cards = document.querySelectorAll('.service-card, .trust-card, .pricing-card, .testimonial-card');

cards.forEach(card => {
    card.addEventListener('mousemove', handleCardTilt);
    card.addEventListener('mouseleave', resetCardTilt);
});

function handleCardTilt(e) {
    if (window.innerWidth < 768) return; // Disable on mobile

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
}

// === FAQ ACCORDION ===
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    }
});

// === ENHANCED CONTACT FORM HANDLING ===
const contactForm = document.getElementById('contactForm');
const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

// Add floating label effect
formInputs.forEach(input => {
    input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', (e) => {
        if (!e.target.value) {
            e.target.parentElement.classList.remove('focused');
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Validate form
    let isValid = true;
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#EC4899';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });

    if (!isValid) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Get submit button
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    // Simulate API call (replace with actual backend)
    try {
        // Here you would send to your backend
        console.log('Form submitted:', data);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');

        // Reset form
        contactForm.reset();

    } catch (error) {
        showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
    }

    // Optional: Send to email service or backend API
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
});

// Custom notification function
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00D9FF, #8B5CF6)' : 'linear-gradient(135deg, #EC4899, #F472B6)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === SMOOTH REVEAL ON LOAD ===
window.addEventListener('load', () => {
    // Add a slight delay to hero animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('active');
        }, 100);
    }

    // Trigger stats counter when stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// === STATS COUNTER ANIMATION ===
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const hasPlus = element.textContent.includes('+');

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// === BACK TO TOP BUTTON ===
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Smooth scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === CLOSE MOBILE MENU WHEN CLICKING OUTSIDE ===
document.addEventListener('click', (e) => {
    const isClickInsideNav = navLinksContainer.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);

    if (!isClickInsideNav && !isClickOnToggle && navLinksContainer.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// === PARALLAX EFFECT FOR HERO ===
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// === SMOOTH PAGE TRANSITIONS ===
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// === PERFORMANCE OPTIMIZATION ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Any scroll-based animations optimized here
            ticking = false;
        });
        ticking = true;
    }
});

// === DYNAMIC YEAR IN FOOTER ===
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2026', currentYear);
}

// === PRICING CARD HOVER ENHANCEMENT ===
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add subtle scale to featured badge if exists
        const badge = card.querySelector('.featured-badge');
        if (badge) {
            badge.style.transform = 'translateX(-50%) scale(1.1)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const badge = card.querySelector('.featured-badge');
        if (badge) {
            badge.style.transform = 'translateX(-50%) scale(1)';
        }
    });
});

// === PORTFOLIO IMAGE LAZY LOADING ===
const portfolioImages = document.querySelectorAll('.portfolio-image');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    portfolioImages.forEach(img => imageObserver.observe(img));
}

// === TESTIMONIAL STARS ANIMATION ===
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const stars = card.querySelector('.testimonial-stars');
        if (stars) {
            stars.style.transform = 'scale(1.2)';
            stars.style.filter = 'brightness(1.5)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const stars = card.querySelector('.testimonial-stars');
        if (stars) {
            stars.style.transform = 'scale(1)';
            stars.style.filter = 'brightness(1.2)';
        }
    });
});

console.log('🚀 Kretixlab website loaded successfully!');
