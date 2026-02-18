// ========================================
// CONSTRUCTION PAGE INTERACTIVITY
// ========================================

// Smooth fade in on page load
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// ANIMATED PARTICLES
// ========================================
function createFloatingParticles() {
    const particleCount = 20;
    const body = document.body;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 15}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 5;
        `;
        
        body.appendChild(particle);
    }

    // Add keyframe animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 50 - 25}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

createFloatingParticles();

// ========================================
// HOVER EFFECTS FOR CARDS
// ========================================
const cards = document.querySelectorAll('.card');

cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// SMOOTH SCROLL (if needed)
// ========================================
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

// ========================================
// PROGRESS BAR ANIMATION
// ========================================
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');

// Simulate progress
let progress = 0;
const targetProgress = 65;
const duration = 3000; // 3 seconds
const steps = 60;
const increment = targetProgress / steps;
const stepDuration = duration / steps;

function animateProgress() {
    if (progress < targetProgress) {
        progress += increment;
        if (progress > targetProgress) progress = targetProgress;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `En procés... ${Math.round(progress)}%`;
        
        setTimeout(animateProgress, stepDuration);
    } else {
        progressText.textContent = 'En procés...';
    }
}

// Start animation after page loads
setTimeout(animateProgress, 1000);

// ========================================
// RANDOM PROGRESS UPDATES
// ========================================
setInterval(() => {
    const randomProgress = Math.random() * 5 + 63; // Between 63-68%
    progressFill.style.width = randomProgress + '%';
}, 5000);

// ========================================
// SOCIAL LINKS ANIMATION
// ========================================
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        link.style.transition = 'all 0.5s ease';
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
    }, 1200 + (index * 150));
});

// ========================================
// CONSTRUCTION ICON CLICK EASTER EGG
// ========================================
const constructionIcon = document.querySelector('.construction-icon');
let clickCount = 0;

constructionIcon.addEventListener('click', () => {
    clickCount++;

    // Quick bounce on click
    constructionIcon.style.transform = 'scale(1.15)';
    setTimeout(() => {
        constructionIcon.style.transform = '';
    }, 200);

    // Easter egg after 5 clicks
    if (clickCount === 5) {
        const message = document.createElement('div');
        message.textContent = '🎉 Aviat estarem llestos! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd966 0%, #ef9a9a 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: fadeInUp 0.5s ease;
            text-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -60%)';
            setTimeout(() => message.remove(), 500);
        }, 3000);

        clickCount = 0;
    }
});

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// ========================================
// PARALLAX EFFECT ON SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const logo = document.querySelector('.logo-container');
    
    if (logo) {
        logo.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c🚧 Pàgina en Construcció 🚧', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cEstem treballant per oferir-te la millor experiència!', 'font-size: 14px; color: #764ba2;');
console.log('%c💻 AEiG Sant Joan - 2025', 'font-size: 12px; color: #666;');
