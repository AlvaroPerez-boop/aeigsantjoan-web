// ========================================
// SMOOTH SCROLL NAVIGATION
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
// TRANSLUCENT HEADER ON SCROLL (INDEX PAGE ONLY)
// ========================================
const header = document.querySelector('header');
const heroCarousel = document.querySelector('.hero-carousel');

function handleHeaderScroll() {
    if (!header || !heroCarousel) return;
    
    // Only apply scroll effect if we're on the index page
    if (!document.body.classList.contains('index-page')) return;
    
    const heroHeight = heroCarousel.offsetHeight;
    
    if (window.scrollY > heroHeight - 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

handleHeaderScroll();
window.addEventListener('scroll', handleHeaderScroll);
window.addEventListener('resize', handleHeaderScroll);

// ========================================
// CONTACT FORM HANDLER
// ========================================
(function () {
    'use strict';

    function findContactForm() {
        let form = document.getElementById('contact-form');
        if (form) return form;

        form = document.querySelector('.contact-form form');
        if (form) return form;

        form = document.querySelector('form[action*="formspree.io"]');
        return form;
    }

    function showStatus(statusEl, message, color) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.style.color = color || '';
    }

    function initContactForm() {
        const form = findContactForm();
        if (!form) {
            console.warn('[contact.js] Contact form not found on page.');
            return;
        }

        if (form._contactHandlerAttached) {
            return;
        }
        form._contactHandlerAttached = true;

        let status = form.querySelector('#form-status');
        if (!status) {
            status = document.createElement('p');
            status.id = 'form-status';
            status.style.marginTop = '10px';
            form.appendChild(status);
        }

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

        form.addEventListener('submit', async function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();

            showStatus(status, 'Enviando...', '#555');

            if (!form.checkValidity()) {
                showStatus(status, 'Por favor rellena los campos correctamente.', 'red');
                form.reportValidity();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
            }

            try {
                const response = await fetch(form.action, {
                    method: (form.method || 'POST').toUpperCase(),
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showStatus(status, '✅ ¡Mensaje enviado correctamente!', 'green');
                    form.reset();
                    setTimeout(() => { showStatus(status, ''); }, 5000);
                } else {
                    let data;
                    try { data = await response.json(); } catch (err) { data = null; }
                    if (data && data.errors) {
                        const msg = data.errors.map(e => e.message).join(' / ');
                        showStatus(status, msg, 'red');
                    } else {
                        showStatus(status, '❌ Error al enviar el mensaje. Intenta de nuevo.', 'red');
                    }
                }
            } catch (err) {
                console.error('[contact.js] Error:', err);
                showStatus(status, '⚠️ Ocurrió un error. Verifica tu conexión.', 'red');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
            }

            return false;
        }, { passive: false, capture: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

    window.initContactForm = initContactForm;
})();

// ========================================
// INSCRIPTION FORM HANDLER
// ========================================
(function () {
    'use strict';

    function initInscriptionForm() {
        const form = document.getElementById('inscription-form');
        const status = document.getElementById('inscription-status');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            status.textContent = "Enviando...";
            status.style.color = "#555";

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const formData = new FormData();

                formData.append('email', document.getElementById('email-tutor')?.value || '');
                formData.append('_subject', 'Nou formulari de pre-inscripció');
                formData.append('Nom infant', document.getElementById('nom-infant')?.value || '');
                formData.append('Cognoms infant', document.getElementById('cognoms-infant')?.value || '');
                formData.append('Data de naixement', document.getElementById('data-naixement')?.value || '');
                formData.append('Edat', document.getElementById('edat')?.value || '');
                formData.append('Nom tutor', document.getElementById('nom-tutor')?.value || '');
                formData.append('Cognoms tutor', document.getElementById('cognoms-tutor')?.value || '');
                formData.append('Telèfon tutor', document.getElementById('telefon-tutor')?.value || '');
                formData.append('Adreça', document.getElementById('adreca')?.value || '');
                formData.append('Com ens coneixes', document.getElementById('com-ens-coneixes')?.value || '');
                formData.append('Informació mèdica', document.getElementById('informacio-medica')?.value || '');
                formData.append('Comentaris', document.getElementById('comentaris')?.value || '');

                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    status.textContent = "✅ Formulari enviat correctament!";
                    status.style.color = "green";
                    form.reset();
                    setTimeout(() => { status.textContent = ""; }, 5000);
                } else {
                    const data = await response.json().catch(() => null);
                    if (data?.errors) {
                        status.textContent = data.errors.map(e => e.message).join(' / ');
                    } else {
                        status.textContent = "❌ Error al enviar el formulari. Torna-ho a provar.";
                    }
                    status.style.color = "red";
                }
            } catch (err) {
                console.error('[inscription.js] Error:', err);
                status.textContent = "⚠️ Error de connexió. Torna-ho a provar.";
                status.style.color = "red";
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }

            return false;
        }, { passive: false, capture: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInscriptionForm);
    } else {
        initInscriptionForm();
    }

    window.initInscriptionForm = initInscriptionForm;
})();

// ========================================
// MOBILE MENU
// ========================================
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    if (!nav || !navUl) return;
    
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');
    
    const logo = nav.querySelector('.logo');
    if (logo) {
        logo.parentNode.insertBefore(hamburger, logo.nextSibling);
    } else {
        nav.insertBefore(hamburger, navUl);
    }
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navUl.classList.toggle('mobile-open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.innerHTML = isOpen ? '✕' : '☰';
        
        if (window.innerWidth <= 768) {
            navUl.style.display = isOpen ? 'flex' : 'none';
        }
    });
    
    const navLinks = navUl.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navUl.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.innerHTML = '☰';
                navUl.style.display = 'none';
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !nav.contains(e.target) && 
            navUl.classList.contains('mobile-open')) {
            navUl.classList.remove('mobile-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
            navUl.style.display = 'none';
        }
    });
    
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            if (!navUl.classList.contains('mobile-open')) {
                navUl.style.display = 'none';
            }
        } else {
            hamburger.style.display = 'none';
            navUl.style.display = 'flex';
            navUl.classList.remove('mobile-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
        }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
};

createMobileMenu();

// ========================================
// HERO CAROUSEL
// ========================================
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function moveSlide(direction) {
    if (slides.length === 0) return;
    
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    slideIndex = (slideIndex + direction + slides.length) % slides.length;
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function goToSlide(index) {
    if (slides.length === 0) return;
    
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    slideIndex = index;
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Auto-play carousel every 5 seconds
if (slides.length > 0) {
    setInterval(() => moveSlide(1), 5000);
}

// ========================================
// CONSOLE LOG
// ========================================
console.log('🌲 El Cau Website - Script loaded successfully!');