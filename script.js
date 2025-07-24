// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const heroTitle = document.querySelector('.hero-title');
    const counters = document.querySelectorAll('.counter');
    
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

    // Hero text animation
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('.line');
        lines.forEach((line, index) => {
            line.style.transform = 'translateY(100px)';
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.transition = 'all 0.8s ease';
                line.style.transform = 'translateY(0)';
                line.style.opacity = '1';
            }, index * 200 + 500);
        });
    }

    // Animate hero subtitle and buttons
    setTimeout(() => {
        const subtitle = document.querySelector('.hero-subtitle');
        const buttons = document.querySelector('.hero-buttons');
        const robotImage = document.querySelector('.floating-robot');
        
        if (subtitle) {
            subtitle.style.transition = 'all 0.8s ease';
            subtitle.style.transform = 'translateY(0)';
            subtitle.style.opacity = '1';
        }
        
        if (buttons) {
            buttons.style.transition = 'all 0.8s ease';
            buttons.style.transform = 'translateY(0)';
            buttons.style.opacity = '1';
        }
        
        if (robotImage) {
            robotImage.style.transition = 'all 1s ease';
            robotImage.style.transform = 'scale(1)';
            robotImage.style.opacity = '1';
        }
    }, 1000);

    // Set initial states for hero animations
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons = document.querySelector('.hero-buttons');
    const robotImage = document.querySelector('.floating-robot');
    
    if (subtitle) {
        subtitle.style.transform = 'translateY(50px)';
        subtitle.style.opacity = '0';
    }
    
    if (buttons) {
        buttons.style.transform = 'translateY(30px)';
        buttons.style.opacity = '0';
    }
    
    if (robotImage) {
        robotImage.style.transform = 'scale(0.8)';
        robotImage.style.opacity = '0';
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.feature-card, .solution-card, .stat-item, .section-header');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add animate class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Counter animation for statistics
    let hasAnimated = false;
    
    const animateCounters = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCounter, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Trigger counter animation when stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Feature cards hover effect
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // Solution cards hover effect
    document.querySelectorAll('.solution-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const overlay = card.querySelector('.solution-overlay');
            if (overlay) {
                overlay.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.solution-overlay');
            if (overlay) {
                overlay.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Demo video click handler
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        videoWrapper.addEventListener('click', () => {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 30px 100px rgba(0, 255, 136, 0.3);
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
            
            const demoVideo = document.createElement('video');
            demoVideo.style.cssText = `
                width: 100%;
                height: auto;
                display: block;
                max-width: 800px;
            `;
            demoVideo.src = './assets/1.mp4';
            demoVideo.controls = true;
            demoVideo.autoplay = true;
            
            const closeButton = document.createElement('div');
            closeButton.style.cssText = `
                position: absolute;
                top: -50px;
                right: 0;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.3s ease;
            `;
            closeButton.innerHTML = '×';
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            videoContainer.appendChild(demoVideo);
            videoContainer.appendChild(closeButton);
            modal.appendChild(videoContainer);
            document.body.appendChild(modal);
            
            // Animate modal in
            setTimeout(() => {
                modal.style.opacity = '1';
                videoContainer.style.transform = 'scale(1)';
            }, 10);
            
            // Close modal handlers
            const closeModal = () => {
                modal.style.opacity = '0';
                videoContainer.style.transform = 'scale(0.8)';
                setTimeout(() => modal.remove(), 300);
            };
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            closeButton.addEventListener('click', closeModal);
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Animate button
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00ccff)';
                submitBtn.style.opacity = '1';
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #00ff88, #00ccff);
                    color: #000;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    z-index: 10001;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                `;
                successMsg.textContent = 'Message sent successfully!';
                document.body.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.style.transform = 'translateX(0)';
                }, 100);
                
                setTimeout(() => {
                    successMsg.style.transform = 'translateX(100%)';
                    setTimeout(() => successMsg.remove(), 300);
                }, 3000);
                
                // Reset form
                setTimeout(() => {
                    e.target.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                }, 2000);
            }, 2000);
        });
    }

    // Form input focus animations
    document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
            input.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
        });
        
        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
            input.style.boxShadow = 'none';
        });
    });

    // Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tech items hover effect with pause
    const techTrack = document.querySelector('.tech-track');
    document.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (techTrack) {
                techTrack.style.animationPlayState = 'paused';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (techTrack) {
                techTrack.style.animationPlayState = 'running';
            }
        });
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

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const robotImage = document.querySelector('.floating-robot');
        const glowEffect = document.querySelector('.glow-effect');
        
        if (robotImage && scrolled < window.innerHeight) {
            robotImage.style.transform = `translateY(${rate}px) scale(${1 - scrolled * 0.0002})`;
        }
        
        if (glowEffect && scrolled < window.innerHeight) {
            glowEffect.style.opacity = 0.7 - (scrolled * 0.001);
        }
    });

    // Loading animation for page
    window.addEventListener('load', () => {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            flex-direction: column;
            gap: 2rem;
            transition: opacity 0.5s ease;
        `;
        
        const logo = document.createElement('div');
        logo.style.cssText = `
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00ff88, #00ccff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoFloat 2s ease-in-out infinite;
        `;
        logo.innerHTML = 'RedLinear';
        
        const loadingBar = document.createElement('div');
        loadingBar.style.cssText = `
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            position: relative;
        `;
        
        const loadingProgress = document.createElement('div');
        loadingProgress.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #00ccff);
            border-radius: 2px;
            transition: width 0.3s ease;
        `;
        
        // Add loading animation CSS
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(loadingStyle);
        
        loadingBar.appendChild(loadingProgress);
        loader.appendChild(logo);
        loader.appendChild(loadingBar);
        document.body.appendChild(loader);
        
        // Simulate loading progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 25 + 5;
            if (progress > 100) progress = 100;
            
            loadingProgress.style.width = progress + '%';
            
            if (progress === 100) {
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.remove();
                        // Trigger hero animations after loading
                        document.body.classList.add('loaded');
                    }, 500);
                }, 500);
            }
        }, 100);
    });

    // Floating animation for robot
    const robotImg = document.querySelector('.floating-robot img');
    if (robotImg) {
        let floatDirection = 1;
        setInterval(() => {
            robotImg.style.transform += ` translateY(${floatDirection * 2}px)`;
            floatDirection *= -1;
        }, 2000);
    }

    // Mouse trail effect
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        // Limit trail length
        if (mouseTrail.length > 10) {
            mouseTrail.shift();
        }
        
        // Create trail particles occasionally
        if (Math.random() > 0.8) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                opacity: 1;
                transition: all 1s ease-out;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0.1)';
            }, 10);
            
            setTimeout(() => particle.remove(), 1000);
        }
    });

    // Dynamic background particles (CSS-only fallback)
    const createParticles = () => {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: rgba(0, 255, 136, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
                z-index: -1;
            `;
            document.body.appendChild(particle);
        }
    };

    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
    
    // Create particles after a delay
    setTimeout(createParticles, 2000);

    // Add custom cursor effect
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

    // Cursor hover effects
    document.querySelectorAll('a, button, .feature-card, .solution-card').forEach(el => {
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

    // Add scroll-triggered animations for better performance
    const scrollAnimations = () => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Animate elements as they come into view
        document.querySelectorAll('[data-animate]').forEach(el => {
            const elementTop = el.offsetTop;
            const elementHeight = el.offsetHeight;
            
            if (scrolled + windowHeight > elementTop + elementHeight * 0.1) {
                el.classList.add('animate');
            }
        });
    };

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollAnimations();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    });

    // Add data-animate attributes to elements that should animate
    document.querySelectorAll('.feature-card, .solution-card, .tech-item, .stat-item').forEach(el => {
        el.setAttribute('data-animate', '');
    });

    // Enhanced button click effects
    document.querySelectorAll('button').forEach(btn => {
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
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            if (!document.querySelector('[data-ripple-style]')) {
                rippleStyle.setAttribute('data-ripple-style', '');
                document.head.appendChild(rippleStyle);
            }
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Initialize all animations
    console.log('🚀 RoboVision Labs website loaded successfully!');
    console.log('🤖 All animations and interactions are ready!');
    
    // Remove initial loading state
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
});

// Set initial page state
document.body.style.visibility = 'hidden';
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';