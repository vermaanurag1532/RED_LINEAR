// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const galleryCounter = document.querySelector('.gallery-counter');
    
    let currentIndex = 0;
    let isAnimating = false;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Gallery Navigation Functions
    function updateGallery(index, direction = 'none') {
        if (isAnimating || index < 0 || index >= galleryItems.length) return;
        
        isAnimating = true;
        
        // Remove active class from current item
        galleryItems[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');
        
        // Add swipe animation based on direction
        if (direction === 'left') {
            galleryItems[currentIndex].classList.add('swipe-left');
        } else if (direction === 'right') {
            galleryItems[currentIndex].classList.add('swipe-right');
        }
        
        // Update current index
        currentIndex = index;
        
        // Move gallery track
        const translateX = -currentIndex * (100 / galleryItems.length);
        galleryTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update counter
        galleryCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
        
        // Add active class to new item after a delay
        setTimeout(() => {
            galleryItems[currentIndex].classList.add('active');
            indicators[currentIndex].classList.add('active');
            
            // Remove swipe classes
            galleryItems.forEach(item => {
                item.classList.remove('swipe-left', 'swipe-right');
            });
            
            isAnimating = false;
        }, 400);
        
        // Create ripple effect on active indicator
        createRipple(indicators[currentIndex]);
    }

    // Create ripple effect
    function createRipple(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Previous button click
    prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
        updateGallery(newIndex, 'right');
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
        updateGallery(newIndex, 'left');
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index !== currentIndex) {
                const direction = index > currentIndex ? 'left' : 'right';
                updateGallery(index, direction);
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    // Touch/Mouse swipe functionality
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Mouse events
    galleryContainer.addEventListener('mousedown', handleStart);
    galleryContainer.addEventListener('mousemove', handleMove);
    galleryContainer.addEventListener('mouseup', handleEnd);
    galleryContainer.addEventListener('mouseleave', handleEnd);
    
    // Touch events
    galleryContainer.addEventListener('touchstart', handleStart);
    galleryContainer.addEventListener('touchmove', handleMove);
    galleryContainer.addEventListener('touchend', handleEnd);

    function handleStart(e) {
        if (isAnimating) return;
        
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        galleryContainer.style.cursor = 'grabbing';
        
        // Add transition disable class
        galleryTrack.style.transition = 'none';
    }

    function handleMove(e) {
        if (!isDragging || isAnimating) return;
        
        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - startX;
        const translateX = -currentIndex * (100 / galleryItems.length) + (deltaX / galleryContainer.offsetWidth) * 100 / galleryItems.length;
        
        galleryTrack.style.transform = `translateX(${translateX}%)`;
        
        // Add tilt effect based on drag direction
        const tiltAngle = Math.max(-10, Math.min(10, deltaX / 20));
        galleryItems[currentIndex].style.transform = `rotateY(${tiltAngle}deg)`;
    }

    function handleEnd(e) {
        if (!isDragging || isAnimating) return;
        
        isDragging = false;
        galleryContainer.style.cursor = 'grab';
        
        // Re-enable transitions
        galleryTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const deltaX = currentX - startX;
        const threshold = 50; // Minimum swipe distance
        
        // Reset tilt
        galleryItems[currentIndex].style.transform = 'rotateY(0deg)';
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                // Swipe right - go to previous
                const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
                updateGallery(newIndex, 'right');
            } else {
                // Swipe left - go to next
                const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
                updateGallery(newIndex, 'left');
            }
        } else {
            // Snap back to current position
            const translateX = -currentIndex * (100 / galleryItems.length);
            galleryTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        startX = 0;
        currentX = 0;
    }

    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (!isDragging && !isAnimating) {
                const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
                updateGallery(newIndex, 'left');
            }
        }, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play after 3 seconds
    setTimeout(startAutoPlay, 3000);
    
    // Stop auto-play on user interaction
    [prevBtn, nextBtn, ...indicators, galleryContainer].forEach(element => {
        element.addEventListener('mouseenter', stopAutoPlay);
        element.addEventListener('mouseleave', () => {
            setTimeout(startAutoPlay, 2000);
        });
    });

    // Achievement cards animations
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // 3D tilt effect
            card.addEventListener('mousemove', handleCardTilt);
            
            // Create floating particles
            createFloatingParticles(card);
        });
        
        card.addEventListener('mouseleave', () => {
            card.removeEventListener('mousemove', handleCardTilt);
            card.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg)';
        });
    });

    function handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
            translateY(-15px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    }

    // Create floating particles
    function createFloatingParticles(element) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat 3s ease-out forwards;
                z-index: 10;
            `;
            
            element.style.position = 'relative';
            element.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(0);
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Button hover effects with magnetic attraction
    document.querySelectorAll('.btn-primary, .btn-secondary, .control-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `
                translateX(${x * 0.3}px) 
                translateY(${y * 0.3}px) 
                scale(1.05)
            `;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateX(0) translateY(0) scale(1)';
        });
        
        // Click ripple effect
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add scroll animations to elements
    const animateElements = document.querySelectorAll('.achievement-card, .section-header');
    animateElements.forEach((el, index) => {
        if (index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else {
            el.classList.add('slide-in-right');
        }
        observer.observe(el);
    });

    // Parallax effect for grid lines
    const gridLines = document.querySelectorAll('.grid-line');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        gridLines.forEach((line, index) => {
            const speed = 0.1 + (index * 0.02);
            line.style.transform = `translateX(${scrolled * speed}px)`;
        });
    });

    // Enhanced gallery item transitions
    function addGalleryItemEffects() {
        galleryItems.forEach((item, index) => {
            const image = item.querySelector('.gallery-image img');
            const overlay = item.querySelector('.image-overlay');
            const info = item.querySelector('.gallery-info');
            
            // Hover effects for non-active items
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    item.style.opacity = '0.9';
                    item.style.transform = 'scale(0.98)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    item.style.opacity = '0.7';
                    item.style.transform = 'scale(0.95)';
                }
            });
            
            // Click to navigate
            item.addEventListener('click', () => {
                if (index !== currentIndex) {
                    const direction = index > currentIndex ? 'left' : 'right';
                    updateGallery(index, direction);
                }
            });
        });
    }

    addGalleryItemEffects();

    // Dynamic background particles
    function createBackgroundParticles() {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: rgba(0, 255, 136, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: particleMove ${15 + Math.random() * 25}s linear infinite;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.appendChild(particle);
        }
    }

    // Add background particle animation
    const bgParticleStyle = document.createElement('style');
    bgParticleStyle.textContent = `
        @keyframes particleMove {
            0% {
                transform: translateY(100vh) translateX(0px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(200px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(bgParticleStyle);

    // Create background particles
    setTimeout(createBackgroundParticles, 1000);

    // Custom cursor for gallery page
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #00ff88;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        mix-blend-mode: difference;
        opacity: 0;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Enhanced cursor effects
    document.querySelectorAll('a, button, .gallery-item, .achievement-card, .indicator').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.background = 'rgba(0, 255, 136, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'transparent';
        });
    });

    // Special cursor effect for swipeable area
    galleryContainer.addEventListener('mouseenter', () => {
        cursor.innerHTML = '<i class="fas fa-hand-rock" style="font-size: 12px; color: #00ff88;"></i>';
        cursor.style.display = 'flex';
        cursor.style.alignItems = 'center';
        cursor.style.justifyContent = 'center';
    });

    galleryContainer.addEventListener('mouseleave', () => {
        cursor.innerHTML = '';
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ff88, #00ccff);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Enhanced timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 2000 + (index * 200));
        
        // Initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
    });

    // Gallery preloader
    function preloadGalleryImages() {
        const imageUrls = [
            './assets/123.jpg',
            './assets/image2.jpg',
            './assets/image3.jpg',
            './assets/image4.jpg',
            './assets/image5.jpg',
            './assets/image6.jpg',
            './assets/image7.jpg',
            './assets/image8.jpg',
            './assets/image9.jpg'
        ];
        
        imageUrls.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            
            // Add error handling for local images
            img.onerror = function() {
                console.warn(`Failed to load image: ${url}`);
                // Optionally set a fallback image
                const galleryImg = document.querySelector(`[data-index="${index}"] .gallery-image img`);
                if (galleryImg) {
                    galleryImg.src = 'https://via.placeholder.com/800x600/1a1a1a/00ff88?text=Image+Not+Found';
                    galleryImg.alt = 'Image not found';
                }
            };
            
            img.onload = function() {
                console.log(`Successfully loaded: ${url}`);
            };
        });
    }

    // Preload images
    preloadGalleryImages();

    // Initialize gallery
    function initializeGallery() {
        // Set initial state
        galleryItems[0].classList.add('active');
        indicators[0].classList.add('active');
        galleryCounter.textContent = `1 / ${galleryItems.length}`;
        
        // Enable cursor grab
        galleryContainer.style.cursor = 'grab';
        
        console.log('🎨 Gallery initialized with swipe functionality!');
        console.log('📱 Use arrows, click indicators, or swipe to navigate');
    }

    // Loading animation
    setTimeout(() => {
        initializeGallery();
        
        // Fade in gallery
        document.querySelector('.swipe-gallery').style.opacity = '1';
        document.querySelector('.swipe-gallery').style.transform = 'translateY(0)';
    }, 500);

    // Initial gallery state
    document.querySelector('.swipe-gallery').style.opacity = '0';
    document.querySelector('.swipe-gallery').style.transform = 'translateY(30px)';
    document.querySelector('.swipe-gallery').style.transition = 'all 0.8s ease';

    // Escape key to stop auto-play
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            stopAutoPlay();
        }
    });

    // Window visibility API to pause auto-play when tab is not active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            setTimeout(startAutoPlay, 1000);
        }
    });

    console.log('🚀 Gallery page loaded successfully!');
    console.log('🎯 Interactive swipe gallery ready!');
});