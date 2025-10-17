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

// ===============================
// FORMULARIO DE CONTACTO
// ===============================
// contact.js - versión robusta y con logs para depuración
(function () {
  'use strict';

  // selector flexible: intenta id, luego selector por clase, luego por action
  function findContactForm() {
    let form = document.getElementById('contact-form');
    if (form) return form;

    form = document.querySelector('.contact-form form');
    if (form) return form;

    // intenta buscar por action de Formspree (ajusta si cambias el endpoint)
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
      console.warn('[contact.js] No se encontró el formulario de contacto en la página.');
      return;
    }

    // evita duplicados de listener
    if (form._contactHandlerAttached) {
      console.log('[contact.js] Listener ya adjuntado.');
      return;
    }
    form._contactHandlerAttached = true;

    // crea o encuentra el elemento donde mostraremos el estado
    let status = form.querySelector('#form-status');
    if (!status) {
      status = document.createElement('p');
      status.id = 'form-status';
      status.style.marginTop = '10px';
      form.appendChild(status);
    }

    // encuentra el primer botón submit si existe
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

    form.addEventListener('submit', async function (ev) {
      // Bloqueo absoluto para evitar redirecciones
      ev.preventDefault();
      ev.stopImmediatePropagation();

      showStatus(status, 'Enviando...', '#555');

      // pequeña comprobación de validaciones nativas
      if (!form.checkValidity()) {
        showStatus(status, 'Por favor rellena los campos correctamente.', 'red');
        // permite que el navegador marque inputs inválidos
        form.reportValidity();
        return;
      }

      // desactiva botón para evitar múltiples envíos
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

        // Log para depuración
        console.log('[contact.js] fetch status:', response.status, 'ok?', response.ok);

        if (response.ok) {
          showStatus(status, '✅ ¡Mensaje enviado correctamente!', 'yellow');
          form.reset();

          // opcional: que el mensaje desaparezca a los X segundos
          setTimeout(() => { showStatus(status, ''); }, 5000);
        } else {
          // intenta leer JSON con detalle de errores
          let data;
          try { data = await response.json(); } catch (err) { data = null; }
          if (data && data.errors) {
            const msg = data.errors.map(e => e.message).join(' / ');
            showStatus(status, msg, 'red');
          } else {
            // si status 422 u otro, mostrar info
            showStatus(status, '❌ Error al enviar el mensaje. Intenta de nuevo.', 'red');
          }
          console.warn('[contact.js] respuesta fetch no ok:', response, data);
        }
      } catch (err) {
        console.error('[contact.js] Error en fetch:', err);
        showStatus(status, '⚠️ Ocurrió un error. Verifica tu conexión.', 'red');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        }
      }

      // Devuelve false por si hay handlers inline
      return false;
    }, { passive: false, capture: true }); // capture:true para interceptar primero si hay otros listeners
  }

  // inicializa cuando DOM listo. Si prefieres, añade defer al script y puedes llamar initContactForm() directamente.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

  // también expone la función por si quieres inicializar manualmente
  window.initContactForm = initContactForm;
})();

// ===============================
// FORMULARIO DE INSCRIPCION
// ===============================
// inscription.js - enviament Formspree sense redirecció
// inscription.js - envío Formspree sin redirección, email obligatorio
(function () {
  'use strict';

  function initInscriptionForm() {
    const form = document.getElementById('inscription-form');
    const status = document.getElementById('inscription-status');
    if (!form) return console.warn('[inscription.js] No se encontró el formulario.');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      status.textContent = "Enviando...";
      status.style.color = "#555";

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData();

        // email obligatorio para Formspree
        formData.append('email', document.getElementById('email-tutor')?.value || '');

        // asunto personalizado
        formData.append('_subject', 'Nou formulari de pre-inscripció');

        // datos del niño/joven
        formData.append('Nom infant', document.getElementById('nom-infant')?.value || '');
        formData.append('Cognoms infant', document.getElementById('cognoms-infant')?.value || '');
        formData.append('Data de naixement', document.getElementById('data-naixement')?.value || '');
        formData.append('Edat', document.getElementById('edat')?.value || '');

        // datos del tutor/a
        formData.append('Nom tutor', document.getElementById('nom-tutor')?.value || '');
        formData.append('Cognoms tutor', document.getElementById('cognoms-tutor')?.value || '');
        formData.append('Telèfon tutor', document.getElementById('telefon-tutor')?.value || '');
        formData.append('Adreça', document.getElementById('adreca')?.value || '');

        // información adicional
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
          console.warn('[inscription.js] Resposta fetch no OK:', response, data);
        }
      } catch (err) {
        console.error('[inscription.js] Error al enviar el formulari:', err);
        status.textContent = "⚠️ Error de connexió. Torna-ho a provar.";
        status.style.color = "red";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }

      return false; // evita envíos por otros handlers
    }, { passive: false, capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInscriptionForm);
  } else {
    initInscriptionForm();
  }

  window.initInscriptionForm = initInscriptionForm;
})();

// ===============================
// 🚀 INICIALIZACIÓN GLOBAL
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Aquí puedes llamar a todas tus funciones globales
  initContactForm();
  // initNavbar();
  // initAnimations();
  // etc...
});


// ========================================
// INSCRIPTION FORM HANDLING
// ========================================
const inscriptionForm = document.querySelector('.inscription-form');
if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nomInfant = document.querySelector('#nom-infant').value;
        const nomTutor = document.querySelector('#nom-tutor').value;
        const email = document.querySelector('#email-tutor').value;
        
        alert(`Gràcies ${nomTutor}! Hem rebut la pre-inscripció de ${nomInfant}. Ens posarem en contacte amb tu aviat a ${email} per completar el procés.`);
        this.reset();
    });
}

// ========================================
// SCROLL ANIMATIONS FOR CARDS
// ========================================
const animateOnScroll = () => {
    const cards = document.querySelectorAll('.value-card, .activity-item, .step-card, .section-card');
    
    if (cards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Set initial state
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => observer.observe(card));
};

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// ========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ========================================
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Set active nav link on page load
setActiveNavLink();

// ========================================
// MOBILE MENU TOGGLE (Optional Enhancement)
// ========================================
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    if (!nav || !navUl) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.style.display = 'none';
    hamburger.style.background = 'none';
    hamburger.style.border = 'none';
    hamburger.style.color = 'white';
    hamburger.style.fontSize = '2rem';
    hamburger.style.cursor = 'pointer';
    
    // Add hamburger to nav
    nav.insertBefore(hamburger, navUl);
    
    // Toggle menu on click
    hamburger.addEventListener('click', () => {
        navUl.classList.toggle('mobile-open');
    });
    
    // Show/hide hamburger based on screen size
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            navUl.style.display = navUl.classList.contains('mobile-open') ? 'flex' : 'none';
        } else {
            hamburger.style.display = 'none';
            navUl.style.display = 'flex';
        }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
};

// Initialize mobile menu
createMobileMenu();

// ========================================
// FORM VALIDATION ENHANCEMENT
// ========================================
const enhanceFormValidation = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.style.borderColor = '#ff6b35';
                } else {
                    this.style.borderColor = '#4a7c2c';
                }
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#4a7c2c';
            });
        });
    });
};

// Initialize form validation
enhanceFormValidation();

// ========================================
// SCROLL TO TOP BUTTON (Optional)
// ========================================
const createScrollToTop = () => {
    // Create button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4a7c2c 0%, #2d5016 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 999;
        display: none;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
            setTimeout(() => {
                scrollBtn.style.opacity = '1';
            }, 10);
        } else {
            scrollBtn.style.opacity = '0';
            setTimeout(() => {
                scrollBtn.style.display = 'none';
            }, 300);
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
    });
};

// Initialize scroll to top button
createScrollToTop();

// ========================================
// LAZY LOADING IMAGES (Optional)
// ========================================
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize lazy loading
lazyLoadImages();

// ========================================
// CONSOLE LOG (Development)
// ========================================
console.log('🌲 El Cau Website - Script loaded successfully!');
console.log('📍 Current page:', window.location.pathname);
console.log('✅ All interactive features initialized');