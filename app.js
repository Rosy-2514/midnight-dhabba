/**
 * V4 Midnight Dhabha - Interactive App Script
 * Handles custom animations, modal dialogs, menu sorting, review sliding, and lightboxes.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Loader Sequence
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                // Initiate entrance animation for hero content
                setTimeout(() => {
                    const heroContent = document.querySelector('.hero-content');
                    const heroShowcase = document.querySelector('.hero-showcase');
                    if (heroContent) {
                        heroContent.style.opacity = '1';
                        heroContent.style.transform = 'translateY(0)';
                        heroContent.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    }
                    if (heroShowcase) {
                        heroShowcase.style.opacity = '1';
                        heroShowcase.style.transform = 'scale(1)';
                        heroShowcase.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    }
                }, 200);
            }, 800); // 800ms loading effect
        });
    }

    // 2. Scroll Progress & Sticky Navbar Header
    const header = document.querySelector('header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Section Scroll Highlight
        highlightNavLinks();
    });

    // 3. Responsive Navigation Hamburger Menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close navbar when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Highlight menu links on scroll
    function highlightNavLinks() {
        const sections = document.querySelectorAll('section, #hero');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` || 
               (link.getAttribute('href') === '#' && currentSectionId === 'hero')) {
                link.classList.add('active');
            }
        });
    }

    // 4. Interactive Menu Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all tabs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add animated fade transitions during filtering
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 5. Testimonials Review Sliding Carousel
    const track = document.querySelector('.reviews-track');
    const slides = Array.from(document.querySelectorAll('.review-slide'));
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlideIndex = 0;
    let autoSlideInterval;

    if (track && slides.length > 0) {
        // Create indicator dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(document.querySelectorAll('.dot'));

        function updateSlidePosition() {
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlideIndex);
            });
        }

        function moveToSlide(index) {
            currentSlideIndex = index;
            updateSlidePosition();
            resetAutoSlide();
        }

        function nextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateSlidePosition();
        }

        function prevSlide() {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateSlidePosition();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 6000); // 6s cycle
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Initialize Slider
        startAutoSlide();
    }

    // 6. Interactive Modal Reservation Setup
    const modal = document.getElementById('reservation-modal');
    const openModalBtns = document.querySelectorAll('.open-booking');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const bookingForm = document.getElementById('booking-form');
    const successScreen = document.getElementById('success-screen');
    const formFields = document.querySelector('.booking-fields');

    // Date validator: block past dates
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Reset to form display
            if (successScreen && formFields) {
                successScreen.style.display = 'none';
                formFields.style.display = 'flex';
            }
            if (bookingForm) bookingForm.reset();
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // prevent page scroll
        });
    });

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    // Handle interactive reservation booking form
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Perform basic mock API validation
            const name = document.getElementById('book-name').value.trim();
            const phone = document.getElementById('book-phone').value.trim();
            const guests = document.getElementById('book-guests').value;
            const date = document.getElementById('book-date').value;
            const time = document.getElementById('book-time').value;

            if (!name || !phone || !guests || !date || !time) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simulate Network Request Delay
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loader-icon" style="width:20px;height:20px;margin-bottom:0;display:inline-block;border:2px solid #FFF;border-top-color:transparent;border-radius:50%;animation:rotatePulse 1s linear infinite;"></span> SECURING...';

            setTimeout(() => {
                // Formatting WhatsApp message redirection for instant mobile booking conversions
                const text = `Hi V4 Midnight Dhabha! I would like to book a table for ${guests} guests on ${date} at ${time}. Name: ${name}, Phone: ${phone}.`;
                const whatsappUrl = `https://wa.me/919884988562?text=${encodeURIComponent(text)}`;

                // Hide fields, show beautiful glowing success validation message
                formFields.style.display = 'none';
                successScreen.style.display = 'flex';
                
                // Add quick link to launch WhatsApp confirmation
                const whatsappLink = document.getElementById('whatsapp-confirm-link');
                if (whatsappLink) {
                    whatsappLink.href = whatsappUrl;
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        });
    }

    // 7. Masonry Gallery Lightbox Setup
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-overlay-title');
            
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                if (lightboxCaption && title) {
                    lightboxCaption.textContent = title.textContent;
                }
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        if (!modal.classList.contains('open')) {
            document.body.style.overflow = 'auto';
        }
    }

    // 8. Intersection Scroll Reveal Animations (Premium Visual UX)
    const animElements = document.querySelectorAll('.why-card, .menu-card, .about-visual, .about-content, .section-header, .contact-card, .contact-map');
    
    // Set initial transition styles
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animElements.forEach(el => scrollObserver.observe(el));

    // 9. Floating Menu Order Button Click Actions
    const orderBtnActions = document.querySelectorAll('.order-now-action');
    orderBtnActions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dishName = btn.getAttribute('data-dish') || 'Food Items';
            
            // Generate customized WhatsApp query for simple late-night orders
            const orderText = `Hi V4 Midnight Dhabha! I would like to place an order for takeaway/delivery of: ${dishName}. Please confirm pricing and delivery time.`;
            const waUrl = `https://wa.me/919884988562?text=${encodeURIComponent(orderText)}`;
            
            // Redirect to WhatsApp or show prompt
            window.open(waUrl, '_blank');
        });
    });
});
