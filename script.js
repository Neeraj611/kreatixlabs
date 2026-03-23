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

// === PORTFOLIO FILTERING (BENTO GRID) ===
const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        portfolioCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const matches = filter === 'all' || category === filter;

            if (!matches) {
                card.classList.add('hide-anim');
                setTimeout(() => {
                    card.classList.remove('active', 'hide-anim');
                }, 280);
            } else {
                setTimeout(() => {
                    card.classList.add('active', 'show-anim');
                    setTimeout(() => card.classList.remove('show-anim'), 500);
                }, index * 60);
            }
        });
    });
});

// 3D Tilt effect on portfolio cards
portfolioCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        const tiltX  = y * -12;
        const tiltY  = x *  12;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        // Move glow to cursor position
        const glow = card.querySelector('.portfolio-card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(14,165,233,0.3), transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
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
const cards = document.querySelectorAll('.service-card, .trust-card, .pricing-card, .testimonial-card, .stat-item');

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

    // Send to Backend (dynamic URL — works on localhost AND GitHub Pages)
    const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : ''; // GitHub Pages has no backend — will gracefully handle below

    try {
        if (!apiBase) {
            // No backend on GitHub Pages — show a helpful message instead of crashing
            await new Promise(r => setTimeout(r, 800)); // simulate loading
            showNotification('Message received! Please email us at labsKreatix@gmail.com directly.', 'success');
            contactForm.reset();
        } else {
            const response = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
    }
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

// ============================================
// EFFECT 1 - CUSTOM CURSOR WITH TRAILING RING
// ============================================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Use requestAnimationFrame for smooth ring tracking
let ringX = 0, ringY = 0;
let dotX  = 0, dotY  = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot snaps instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
});

// Smooth ring follow loop
(function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top  = `${ringY}px`;
    requestAnimationFrame(animateRing);
})();

// Expand ring on hover over interactive elements
const interactiveEls = document.querySelectorAll('a, button, .service-card, .portfolio-item, .tab-btn, .pricing-card, input, textarea, select');
interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Shrink ring on click
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

// Hide cursor when leaving the window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
});

// ============================================
// EFFECT 2 - TYPEWRITER HERO TEXT
// ============================================
const typewriterEl = document.getElementById('typewriterText');
const phrases = [
    'Build Websites',
    'Edit Videos',
    'Scale Brands',
    'Design Futures',
    'Drive Growth',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typeTimeout;

function runTypewriter() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
        // Type characters in
        typewriterEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            // Pause at full word then start deleting
            isDeleting = true;
            typeTimeout = setTimeout(runTypewriter, 2000);
            return;
        }
    } else {
        // Delete characters
        typewriterEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            // Move to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    const speed = isDeleting ? 60 : 100;
    typeTimeout = setTimeout(runTypewriter, speed);
}

if (typewriterEl) {
    setTimeout(runTypewriter, 1200); // small delay before starting
}

// ============================================
// EFFECT 3 - MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    const strength = 0.35; // pull strength (0 = none, 1 = full follow)

    btn.addEventListener('mousemove', (e) => {
        const rect   = btn.getBoundingClientRect();
        const btnX   = rect.left + rect.width  / 2;
        const btnY   = rect.top  + rect.height / 2;
        const distX  = (e.clientX - btnX) * strength;
        const distY  = (e.clientY - btnY) * strength;

        btn.style.transform = `translate(${distX}px, ${distY}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
    });
});

// ============================================
// EFFECT 4 - SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop  = document.documentElement.scrollTop;
        const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct        = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${pct}%`;
    }, { passive: true });
}

