// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const memberCards = document.querySelectorAll('.member-card');
    const valueCards = document.querySelectorAll('.value-card');
    
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

    // Enhanced team member card interactions
    memberCards.forEach((card, index) => {
        // Add stagger delay for initial animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-20px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Skill tags animation on hover
        const skills = card.querySelectorAll('.skill');
        card.addEventListener('mouseenter', () => {
            skills.forEach((skill, skillIndex) => {
                setTimeout(() => {
                    skill.style.transform = 'translateY(-5px) scale(1.05)';
                    skill.style.background = 'rgba(0, 255, 136, 0.2)';
                }, skillIndex * 100);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            skills.forEach(skill => {
                skill.style.transform = 'translateY(0) scale(1)';
                skill.style.background = 'rgba(0, 255, 136, 0.1)';
            });
        });
        
        // Click animation for member cards
        card.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 136, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: 50%;
                top: 50%;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Add bounce animation
            card.classList.add('bounce-in');
            setTimeout(() => card.classList.remove('bounce-in'), 800);
        });
    });

    // Value cards animations
    valueCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Animate icon rotation
            const icon = card.querySelector('.value-icon');
            icon.style.transform = 'rotateY(360deg) scale(1.1)';
            
            // Create floating particles
            createFloatingParticles(card);
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.value-icon');
            icon.style.transform = 'rotateY(0deg) scale(1)';
        });
    });

    // Create floating particles for value cards
    function createFloatingParticles(element) {
        for (let i = 0; i < 5; i++) {
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
                animation: particleFloat 2s ease-out forwards;
                z-index: 10;
            `;
            
            element.style.position = 'relative';
            element.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
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
                transform: translateY(-50px) scale(0);
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

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
    const animateElements = document.querySelectorAll('.member-card, .value-card, .section-header');
    animateElements.forEach((el, index) => {
        // Determine animation type based on element position
        if (index % 3 === 0) {
            el.classList.add('slide-in-left');
        } else if (index % 3 === 1) {
            el.classList.add('animate-in');
        } else {
            el.classList.add('slide-in-right');
        }
        
        observer.observe(el);
    });

    // Button hover effects with magnetic attraction
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `
                translateY(-3px) 
                scale(1.05) 
                translateX(${x * 0.3}px) 
                translateY(${y * 0.3}px)
            `;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1) translateX(0) translateY(0)';
        });
        
        // Click effect
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
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.element');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Dynamic background particles
    function createBackgroundParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: rgba(0, 255, 136, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: particleMove ${10 + Math.random() * 20}s linear infinite;
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
                transform: translateY(-100vh) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(bgParticleStyle);

    // Create background particles after a delay
    setTimeout(createBackgroundParticles, 1000);

    // Team member card entrance animations
    setTimeout(() => {
        memberCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);

    // Initialize member cards with hidden state
    memberCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Custom cursor for team page
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

    // Enhanced cursor effects for interactive elements
    document.querySelectorAll('a, button, .member-card, .value-card').forEach(el => {
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

    // Initialize page
    console.log('🤖 Team page loaded successfully!');
    console.log('👥 Meet the amazing RoboVision team!');
});