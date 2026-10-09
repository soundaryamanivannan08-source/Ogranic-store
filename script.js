document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const nav = document.querySelector("nav");

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
            
            // Toggle icon between bars and xmark
            const icon = mobileMenuBtn.querySelector("i");
            if(icon) {
                if(nav.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    // 2. Dynamic Active Links
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav ul li a");
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            const linkPath = link.getAttribute("href");
            // Also match if currentPath is empty and link is index.html
            if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
                link.classList.add("active");
            }
        });
    }

    // 3. Global Navigation: Click buttons, links, and icons to go to 404 page (excluding navbar and footer)
    document.addEventListener("click", (e) => {
        // DO NOT TOUCH navbar (header, nav, mobile menu) and footer
        if (e.target.closest("header, nav, #mobile-menu, footer, .header-static, .footer-grid, .footer-bottom")) {
            return;
        }

        // Allow FAQ accordion toggles to expand/collapse normally
        if (e.target.closest(".faq-question")) {
            return;
        }

        // Allow form inputs and textareas to be clicked and focused
        if (e.target.closest("input, textarea, select, label")) {
            return;
        }

        // Detect if clicked element is a button, link, icon, or clickable card
        const clickable = e.target.closest("a, button, i, .btn, .btn-primary, .btn-outline, .btn-add, .btn-app, .deal-card, .deal-btn, .diet-card, .cat-item, .category-card, .play-btn, .video-card, .arrow-btn, .action-btn, .hero-tag, .product-card, .team-card, .view-all-link, .pop-post, .team-socials a");

        if (clickable) {
            // If it's a form submit button, ensure form validation is checked first
            if (clickable.type === "submit" && clickable.form) {
                if (!clickable.form.checkValidity()) {
                    clickable.form.reportValidity();
                    e.preventDefault();
                    return;
                }
            }

            e.preventDefault();
            window.location.href = "404.html";
        }
    });

    // 4. Form Submissions Simulation
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        // Exclude specific auth forms and forms with explicit action or onsubmit
        if (form.id !== 'loginForm' && form.id !== 'signupForm' && !form.getAttribute("onsubmit") && !form.getAttribute("action")) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                form.reset();
            });
        }
    });
});
    // 5. Stats Counter Animation
    const statCounters = document.querySelectorAll('.stat-new h3, .stat-item h3');
    
    if (statCounters.length > 0) {
        const animateCounter = (el) => {
            const originalText = el.innerText;
            const match = originalText.match(/([\d\.]+)(.*)/);
            if (!match) return;
            
            const target = parseFloat(match[1]);
            const suffix = originalText.substring(match[1].length); // Get everything after the number including HTML if innerHTML was used, but we use innerText so it's fine. Wait, if it has HTML we should use innerHTML.
            const isFloat = match[1].includes('.');
            
            let current = 0;
            const increment = target / 60; // 60 frames
            const duration = 1500; // 1.5s
            const interval = duration / 60;
            
            // Capture original HTML for the suffix to preserve span tags if any
            const originalHTML = el.innerHTML;
            const htmlSuffix = originalHTML.replace(/[\d\.]+/, '');
            
            const updateText = () => {
                current += increment;
                if (current >= target) {
                    el.innerHTML = (isFloat ? target.toFixed(1) : Math.ceil(target)) + htmlSuffix;
                    clearInterval(timer);
                } else {
                    el.innerHTML = (isFloat ? current.toFixed(1) : Math.ceil(current)) + htmlSuffix;
                }
            };
            
            el.innerHTML = '0' + htmlSuffix;
            const timer = setInterval(updateText, interval);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        statCounters.forEach(counter => observer.observe(counter));
    }

    // 6. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other open items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle the clicked item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

// Number counting animation
document.addEventListener('DOMContentLoaded', () => {
  const countUpElements = document.querySelectorAll('.count-up, .count-up-float');
  
  const animateCountUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isFloat = el.classList.contains('count-up-float');
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    
    let current = start;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        el.innerText = isFloat ? current.toFixed(1) : Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        el.innerText = isFloat ? target.toFixed(1) : target;
      }
    };
    updateCounter();
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  countUpElements.forEach(el => observer.observe(el));
});
