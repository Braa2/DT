// ===== CLEAN ARABIC SCRIPT - DIGITAL TARGET =====
// Essential functions only
// 
// ===== LOADING SCREEN FIX =====
// Fixed duplicate loading screen issue:
// - Added loadingScreenShown flag to prevent multiple initializations
// - Created separate reinitializeHomePage() function for page transitions
// - Loading screen only shows once on initial page load

// ===== GLOBAL VARIABLES =====
window.__loaderFinalized = window.__loaderFinalized || false;
let currentCursor = { x: 0, y: 0 };
let targetCursor = { x: 0, y: 0 };
let loadingScreenShown = false; // Flag to prevent loading screen from showing twice
let loadingScreenActive = false; // Flag to track if loading screen is currently active

// ===== TRANSLATION SYSTEM =====
function applyTranslations(langCode) {
    if (!window.translations || !window.translations[langCode]) {
        console.log('❌ Translations not loaded or language not found:', langCode);
        return;
    }

    const translations = window.translations[langCode];
    console.log('🌐 Applying translations for:', langCode);

    // Find all elements with data-translate attribute
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    elementsToTranslate.forEach(element => {
        const translationKey = element.getAttribute('data-translate');
        const translatedText = getNestedProperty(translations, translationKey);
        
        if (translatedText) {
            element.textContent = translatedText;
            console.log(`✅ Translated: ${translationKey} -> ${translatedText}`);
        } else {
            console.log(`⚠️ Translation not found for key: ${translationKey}`);
        }
    });

    // Update document title
    if (langCode === 'en') {
        document.title = 'Digital Target - Digital Excellence';
    } else {
        document.title = 'الهدف الرقمي - التميز الرقمي';
    }

    // Update moving text marquee
    updateMovingText(langCode, translations);

    console.log(`✅ ${elementsToTranslate.length} elements translated to ${langCode}`);
}

// Helper function to get nested property from object
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] ? current[key] : null;
    }, obj);
}

// Function to update moving text marquee
function updateMovingText(langCode, translations) {
    const movingTexts = translations.movingText;
    if (!movingTexts || !Array.isArray(movingTexts)) {
        console.log('⚠️ Moving text translations not found');
        return;
    }

    // Find both content divs
    const content1 = document.getElementById('content1');
    const content2 = document.getElementById('content2');

    if (!content1 || !content2) {
        console.log('⚠️ Moving text content divs not found');
        return;
    }

    // Generate new HTML content
    const newContent = movingTexts.map(text => `<span>${text}</span>`).join('');

    // Update both content divs
    content1.innerHTML = newContent;
    content2.innerHTML = newContent;

    console.log(`✅ Moving text updated to ${langCode}:`, movingTexts);
}

// ===== CUSTOM CURSOR =====
function initializeCursor() {
    const cursor = document.getElementById('cursor');

    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        targetCursor.x = e.clientX;
        targetCursor.y = e.clientY;
    });

    function animateCursor() {
        currentCursor.x += (targetCursor.x - currentCursor.x) * 0.1;
        currentCursor.y += (targetCursor.y - currentCursor.y) * 0.1;

        cursor.style.transform = `translate(${currentCursor.x}px, ${currentCursor.y}px)`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .project-item, .floating-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(2)';
            cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.8)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
            cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        });
    });
}

// ===== BINARY MATRIX =====
function initializeBinaryMatrix() {
    const matrix = document.getElementById('binaryMatrix');
    if (!matrix) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const digitWidth = 75;
    const digitHeight = 85;

    const columns = Math.ceil(screenWidth / digitWidth);
    const rows = Math.ceil(screenHeight / digitHeight);
    const totalDigits = columns * rows;

    matrix.innerHTML = '';

    for (let i = 0; i < totalDigits; i++) {
        const digit = document.createElement('span');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        digit.style.setProperty('--delay', `${(i % 5) * 0.5}s`);
        matrix.appendChild(digit);
    }

    setInterval(() => {
        const digits = matrix.querySelectorAll('.binary-digit');
        const randomDigits = Array.from(digits).sort(() => 0.5 - Math.random()).slice(0, 5);

        randomDigits.forEach(digit => {
            digit.textContent = digit.textContent === '1' ? '0' : '1';
            digit.classList.add('active');

            setTimeout(() => {
                digit.classList.remove('active');
            }, 300);
        });
    }, 1000);
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScroll() {
    // Handle main navigation links and buttons (excluding footer links)
    const navLinks = document.querySelectorAll('.nav-link, .btn:not(.tell-us-btn)');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Handle footer navigation links separately 
    const footerLinks = document.querySelectorAll('.footer-nav-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Make sure we're not in transition mode
                if (typeof isTransitioning !== 'undefined' && isTransitioning) {
                    console.log('Transition in progress, ignoring footer link click');
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    console.log('Footer link clicked, scrolling to:', href);
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Handle mobile navigation links separately 
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Make sure we're not in transition mode
                if (typeof isTransitioning !== 'undefined' && isTransitioning) {
                    console.log('Transition in progress, ignoring mobile nav link click');
                    return;
                }
                
                // Close mobile menu first
                const burgerMenu = document.getElementById('burgerMenu');
                const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                if (burgerMenu && mobileMenuOverlay) {
                    burgerMenu.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                const target = document.querySelector(href);
                if (target) {
                    console.log('Mobile nav link clicked, scrolling to:', href);
                    // Add a small delay to allow menu closing animation
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });
    
    console.log('✅ Smooth scroll initialized for nav, footer, and mobile links');
}

// ===== NAVBAR SCROLL BEHAVIOR =====
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileLangToggle = document.getElementById('mobileLangToggle');
    
    if (!navbar) return;

    let lastNavScrollY = window.scrollY;
    let navTicking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > lastNavScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastNavScrollY = currentScrollY;
        navTicking = false;
    }

    function requestNavTick() {
        if (!navTicking) {
            requestAnimationFrame(updateNavbar);
            navTicking = true;
        }
    }

    window.addEventListener('scroll', requestNavTick);

    // ===== BURGER MENU FUNCTIONALITY =====
    if (burgerMenu && mobileMenuOverlay) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileMenuOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Note: Mobile nav links are now handled in initializeSmoothScroll()
        // This avoids duplicate event listeners and conflicts

        // Mobile language toggle functionality
        if (mobileLangToggle) {
            mobileLangToggle.addEventListener('click', function() {
                // Trigger the main language toggle
                const mainLangBtn = document.getElementById('langToggleBtn');
                if (mainLangBtn) {
                    mainLangBtn.click();
                }
                
                // Update mobile toggle text
                const mobileLangText = document.getElementById('mobileLangText');
                const currentLang = document.getElementById('langCurrent');
                if (mobileLangText && currentLang) {
                    if (currentLang.textContent === 'AR') {
                        mobileLangText.textContent = 'العربية / English';
                    } else {
                        mobileLangText.textContent = 'English / العربية';
                    }
                }
            });
        }

        // Close menu when clicking outside
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                burgerMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const existingMessages = this.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());

        setTimeout(() => {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';

            this.insertBefore(successMessage, this.firstChild);
            this.reset();

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            setTimeout(() => {
                successMessage.remove();
            }, 5000);

        }, 2000);
    });

    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();

    field.classList.remove('error');

    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+966|0)?[5-9]\d{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            field.classList.add('error');
            return false;
        }
    }

    return true;
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.stat-item, .value-card, .about-paragraph, .logo-showcase, .contact-item, .form-group');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target = parseInt(element.textContent);
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.ceil(current) + '+';

            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            }
        }, 20);
    }

    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => statsObserver.observe(item));
}

// ===== HERO ANIMATIONS =====
function initializeHeroAnimations() {
    const heroWords = document.querySelectorAll('.hero-title .word');

    heroWords.forEach((word, index) => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(50px)';

        setTimeout(() => {
            word.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ===== MOVING TEXT MARQUEE =====
function initializeMovingText() {
    setTimeout(() => {
        const marqueeTrack = document.getElementById("marqueeTrack");
        const content1 = document.getElementById("content1");
        const content2 = document.getElementById("content2");

        if (!marqueeTrack || !content1 || !content2) {
            console.error('Marquee elements not found');
            return;
        }

        console.log('🔄 Initializing marquee with elements:', {
            track: !!marqueeTrack,
            content1: !!content1,
            content2: !!content2
        });

        // Position content2 immediately after content1
        content1.style.position = 'absolute';
        content1.style.left = '0px';
        content2.style.position = 'absolute';
        content2.style.left = content1.offsetWidth + 'px';

        let lastScrollY = window.scrollY;
        let direction = -1; // Always start moving right to left
        let x = 0;
        const speed = 3;

        function animate() {
            x += speed * direction;

            // Move both content divs together
            content1.style.transform = `translateX(${x}px)`;
            content2.style.transform = `translateX(${x}px)`;

            const contentWidth = content1.offsetWidth;

            // Reset logic for seamless loop
            if (direction === -1) {
                // Moving right to left
                if (x <= -contentWidth) {
                    x = 0; // Reset to start position
                }
            } else {
                // Moving left to right  
                if (x >= 0) {
                    x = -contentWidth; // Reset to left position
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener("scroll", () => {
            const currentY = window.scrollY;
            direction = currentY > lastScrollY ? -1 : 1;
            lastScrollY = currentY;
        });

        console.log('✅ Moving text initialized - seamless loop version');
    }, 300);
}

// ===== TECH MARQUEE ANIMATION - SIMPLIFIED TO WORK WITH HTML =====
function initializeTechMarquee() {
    setTimeout(() => {
        const techContent1 = document.getElementById("techContent1");
        const techContent2 = document.getElementById("techContent2");

        if (!techContent1 || !techContent2) {
            console.error('Tech content elements not found');
            return;
        }

        console.log('🔄 Initializing tech marquee with existing HTML elements:', {
            content1: !!techContent1,
            content2: !!techContent2
        });

        // Position content2 immediately after content1 - EXACTLY like moving text
        techContent1.style.position = 'absolute';
        techContent1.style.left = '0px';
        techContent2.style.position = 'absolute';
        techContent2.style.left = techContent1.offsetWidth + 'px';

        console.log('Content width:', techContent1.offsetWidth);

        let lastScrollY = window.scrollY;
        let direction = -1; // Always start moving right to left
        let x = 0;
        const speed = 2; // Same as moving text

        function animate() {
            x += speed * direction;

            // Move both content divs together - EXACTLY like moving text
            techContent1.style.transform = `translateX(${x}px)`;
            techContent2.style.transform = `translateX(${x}px)`;

            const contentWidth = techContent1.offsetWidth;

            // Reset logic for seamless loop - EXACT COPY from moving text
            if (direction === -1) {
                // Moving right to left
                if (x <= -contentWidth) {
                    x = 0; // Reset to start position
                }
            } else {
                // Moving left to right  
                if (x >= 0) {
                    x = -contentWidth; // Reset to left position
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener("scroll", () => {
            const currentY = window.scrollY;
            direction = currentY > lastScrollY ? -1 : 1;
            lastScrollY = currentY;
        });

        console.log('✅ Tech marquee initialized - SIMPLIFIED VERSION');
    }, 300);
}


// ===== LOADING SCREEN FUNCTIONALITY =====
function initializeLoadingScreen() {
    // If back navigation requested a forced loader, allow it
    try {
        const params = new URLSearchParams(window.location.search);
        const forceFlag = sessionStorage.getItem('force-loader-next') === '1' || params.get('ref') === 'back';
        if (forceFlag) {
            window.__loaderFinalized = false;
            loadingScreenShown = false;
        }
    } catch (e) {}

    if (window.__loaderFinalized) {
        console.log('🚫 Loader finalized, never show again');
        return;
    }
    // Prevent loading screen from running twice
    if (loadingScreenShown || loadingScreenActive) {
        console.log('🚫 Loading screen already shown or active, skipping...');
        return;
    }
    
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    if (!loadingScreen) {
        console.log('❌ Loading screen element not found');
        return;
    }
    
    // Mark as shown and active
    loadingScreenShown = true;
    loadingScreenActive = true;
    
    // Ensure loading screen is visible and reset any previous state
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('slide-up');
    loadingScreen.style.transform = 'translateY(0)';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    
    // Add loading class to body initially
    body.classList.add('loading');
    body.classList.remove('loaded');
    
    // Apply translations to loading screen
    setTimeout(() => {
        try {
            const savedLang = localStorage.getItem('preferred-language') || 'ar';
            applyTranslations(savedLang);
            console.log('✅ Loading screen translations applied:', savedLang);
        } catch (e) {
            console.log('⚠️ Could not apply loading translations');
        }
    }, 100);
    
    console.log('🔄 Loading screen initialized - will slide up after 3 seconds');
    
    // Show loading for 3 seconds then slide up
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000); // Show for 3 seconds
}

// Separate function to hide loading screen smoothly
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    if (!loadingScreen || !loadingScreenActive) {
        return;
    }
    
    console.log('🎬 Starting smooth fade-out animation');
    
    // Add slide-up class to trigger the animation
    loadingScreen.classList.add('slide-up');
    body.classList.remove('loading');
    body.classList.add('loaded');
    
    // Remove loading screen completely after slide animation
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
        }
        // Remove any prepaint style that locked scrolling
        try {
            const pre = document.getElementById('preload-style');
            if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
        } catch (e) {}
        // Ensure scrolling is restored
        document.body.style.overflow = '';
        // Clean any back overlay
        const backOverlay = document.querySelector('.back-fade-overlay');
        if (backOverlay && backOverlay.parentNode) backOverlay.parentNode.removeChild(backOverlay);
        try { sessionStorage.removeItem('force-loader-next'); } catch(e) {}
        window.__loaderFinalized = true;
        loadingScreenActive = false; // Mark as inactive
        console.log('✅ Loading screen hidden smoothly, site ready');
    }, 1200); // Wait for slide animation to complete
}

// Show the existing loading screen, then navigate to home with a hard refresh
function showExistingLoaderThenGoHome() {
    try {
        const body = document.body;
        let loader = document.getElementById('loading-screen');

        // Ensure body is in loading state so CSS won't hide the loader
        body.classList.remove('loaded');
        body.classList.add('loading');

        // If loader element doesn't exist on this page (e.g., contact.html), create a minimal one
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading-screen';
            loader.className = 'loading-screen';
            // Minimal structure; site CSS will style it
            loader.innerHTML = '<div class="loading-text">جاري التحميل...</div><div class="loading-dots"><span></span><span></span><span></span></div>';
            document.body.appendChild(loader);
        }

        // Make sure it is visible
        loader.style.display = 'flex';
        loader.style.visibility = 'visible';
        loader.style.opacity = '1';
        loader.style.transform = 'translateY(0)';
        loader.classList.remove('slide-up');

        // Smooth overlay fade for nicer transition
        if (!document.getElementById('back-overlay-styles')) {
            const s = document.createElement('style');
            s.id = 'back-overlay-styles';
            s.textContent = `
                .back-fade-overlay { position: fixed; inset: 0; background: #000; opacity: 0; pointer-events:none; z-index: 10001; transition: opacity 400ms ease; }
                .back-fade-overlay.active { opacity: 0.75; }
            `;
            document.head.appendChild(s);
        }
        const overlay = document.createElement('div');
        overlay.className = 'back-fade-overlay';
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        // Allow paint, then navigate to home with cache-busting to force refresh
        setTimeout(() => {
            window.__loaderFinalized = false; // allow loader on next page load
            const url = './?ref=back&ts=' + Date.now();
            window.location.assign(url);
        }, 420); // match overlay transition
    } catch (e) {
        // Fallback: direct navigate
        window.location.assign('./');
    }
}

// ===== MAIN INITIALIZATION =====
let appInitialized = false; // Prevent multiple initializations

function initializeApp() {
    if (appInitialized) {
        console.log('🚫 App already initialized, skipping...');
        return;
    }
    
    console.log('🚀 ديجيتال تارجت - بدء التطبيق');
    console.log('🔍 DOM ready, starting initialization...');

    // Check if we're on contact page (for refresh handling)
    const isContactPage = window.location.pathname.includes('contact.html');
    
    if (isContactPage) {
        console.log('📧 Contact page detected, skipping loading screen');
        document.body.classList.add('js-loaded', 'loaded');
        window.__loaderFinalized = true;
        loadingScreenShown = true;
        loadingScreenActive = false;
    } else {
        // Initialize loading screen first (only if not shown before)
        if (!loadingScreenShown && !loadingScreenActive && !window.__loaderFinalized) {
            initializeLoadingScreen();
        } else {
            console.log('🚫 Loading screen already shown or active, skipping initialization');
            // If loading screen was already shown, make sure body has loaded class
            document.body.classList.add('js-loaded', 'loaded');
            // Ensure loading screen is hidden
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
                loadingScreen.style.visibility = 'hidden';
            }
        }
    }
    
    appInitialized = true;

    // Add js-loaded class to enable animations
    document.body.classList.add('js-loaded');
    console.log('✅ JS loaded class added');

    initializeCursor();
    console.log('✅ Cursor initialized');

    initializeBinaryMatrix();
    console.log('✅ Binary matrix initialized');

    initializeSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    initializeNavbar();
    console.log('✅ Navbar initialized');

    initializeLanguageToggle();
    console.log('✅ Language toggle initialized');

    initializeContactForm();
    console.log('✅ Contact form initialized');

    initializeBinaryQuestionMark();
    console.log('✅ Binary question mark initialized');

    initializeScrollAnimations();
    console.log('✅ Scroll animations initialized');

    initializeHeroAnimations();
    console.log('✅ Hero animations initialized');

    initializeMovingText();
    console.log('✅ Moving text marquee initialized');

    initializeTechMarquee();
    console.log('✅ Tech marquee initialized');

    initializeHeroVideo();
    console.log('✅ Hero video initialized');

    initializeTellUsButton();
    console.log('✅ Tell us button initialized');

    // Initialize goals section scroll animation
    // initializeGoalsScrollAnimation(); // Disabled - using stacking animation instead
    // console.log('✅ Goals section scroll animation initialized');

    // initGoalsStackingEffect();
    // console.log('✅ Goals stacking cards animation initialized');

    // Initialize connect section lighting effect
    initConnectLightingEffect();
    console.log('✅ Connect section lighting effect initialized');



    // Initialize project cards animation
    initializeProjectCardsAnimation();
    console.log('✅ Project cards animation initialized');

    // Initialize features grid section animations
    initializeFeaturesGridAnimation();
    console.log('✅ Features grid animations initialized');

    // Initialize title animations with delay to ensure DOM is ready
    setTimeout(() => {
        // initializeTitleAnimations();
        // console.log('✅ Title animations initialized');
    }, 100);

    // Extra verification for footer and mobile links after everything is loaded
    setTimeout(() => {
        const footerLinks = document.querySelectorAll('.footer-nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        console.log(`🔗 Final check: Found ${footerLinks.length} footer links`);
        console.log(`📱 Final check: Found ${mobileNavLinks.length} mobile nav links`);
        
        if (footerLinks.length === 0) {
            console.log('⚠️ No footer links found, may need to reinitialize later');
        } else {
            console.log('✅ Footer links detected and should be working');
        }

        if (mobileNavLinks.length === 0) {
            console.log('⚠️ No mobile nav links found, may need to reinitialize later');
        } else {
            console.log('✅ Mobile nav links detected and should be working');
        }
    }, 500);

    // Apply initial translations based on saved language preference
    setTimeout(() => {
        try {
            const savedLang = localStorage.getItem('preferred-language') || 'ar';
            applyTranslations(savedLang);
            console.log('✅ Initial translations applied:', savedLang);
        } catch (e) {
            console.log('⚠️ Could not apply initial translations, using Arabic as default');
            applyTranslations('ar');
        }
    }, 100);

    console.log('✅ تم تحميل التطبيق بنجاح');
}

// Helper functions for reinitializing animations
function initializeProjectCardsAnimation() {
    const worksSection = document.querySelector('.works-section');
    const projectCards = document.querySelectorAll('.project-card');

    if (worksSection && projectCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                            const img = card.querySelector('.project-image-bg');
                            if (img) img.classList.add('show');
                        }, index * 100);
                    });
                    observer.unobserve(worksSection);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(worksSection);
        console.log('Project cards animation reinitialized');
    }
}

function reinitializeConnectSection() {
    const connectSection = document.querySelector('.connect-section');
    if (!connectSection) {
        console.log('❌ Connect section not found');
        return;
    }

    console.log('🔄 Reinitializing connect section...');

    // Force section to be visible but don't mess with animation properties
    connectSection.style.display = 'flex';
    connectSection.style.minHeight = '100vh';
    connectSection.style.alignItems = 'center';
    connectSection.style.justifyContent = 'center';
    connectSection.style.opacity = '1';
    connectSection.style.visibility = 'visible';

    // Reset animation state cleanly - remove the class first
    connectSection.classList.remove('light-up');
    console.log('🧹 Removed light-up class');

    // Ensure child elements are properly structured (but don't force animation states)
    const connectContainer = connectSection.querySelector('.connect-container');
    if (connectContainer) {
        connectContainer.style.display = 'flex';
        connectContainer.style.flexDirection = 'column';
        connectContainer.style.height = '100vh';
        connectContainer.style.justifyContent = 'space-between';
    }

    const formContainer = connectSection.querySelector('.contact-form-container');
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.style.textAlign = 'center';
    }

    const formHeader = connectSection.querySelector('.form-header');
    if (formHeader) {
        formHeader.style.display = 'block';
        formHeader.style.marginBottom = '4rem';
        formHeader.style.textAlign = 'center';
    }

    const tellUsBtn = connectSection.querySelector('.tell-us-btn');
    if (tellUsBtn) {
        tellUsBtn.style.display = 'flex';
        tellUsBtn.style.visibility = 'visible';
        tellUsBtn.style.margin = '0 auto';
        tellUsBtn.style.alignItems = 'center';
        tellUsBtn.style.justifyContent = 'center';
        tellUsBtn.style.opacity = '1';
    }

    // Let the intersection observer handle the animation naturally
    setTimeout(() => {
        console.log('🔄 Reinitialized connect lighting observer');
        initConnectLightingEffect();
    }, 100);

    console.log('✅ Connect section reinitialized - letting natural animations take over');
}

function forceShowAllElements() {
    // Force show all elements that might be hidden
    const elementsToShow = [
        '.section-subtitle',
        '.project-card',
        '.project-image-bg',
        '.hero-title',
        '.hero-description',
        '.hero-actions',
        '.hero-badge',
        '.about-paragraph',
        '.goal-card',
        '.service-card-ultra',
        '.modern-nav',
        '.nav-links',
        '.nav-logo-right',
        '.feature-card' // Add feature cards to the list
        // Removed connect section elements to allow animations to work
    ];

    elementsToShow.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Force visibility
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.display = '';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
            
            // Add necessary classes
            element.classList.add('animate-in');
            if (element.classList.contains('project-card')) {
                element.classList.add('visible');
            }
            if (element.classList.contains('project-image-bg')) {
                element.classList.add('show');
            }
            if (element.classList.contains('section-subtitle')) {
                element.classList.add('slide-up');
            }
        });
    });

    // Special handling for features grid section
    const featuresSection = document.querySelector('.features-grid-section');
    if (featuresSection) {
        featuresSection.classList.add('in-view');
        console.log('✅ Features grid section forced visible');
    }

    // Special handling for navbar layout
    const navbar = document.querySelector('.modern-nav');
    if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateY(0)';
        navbar.style.display = 'block';
        navbar.classList.remove('hidden');
        
        // Fix navbar container layout
        const navContainer = navbar.querySelector('.nav-container');
        if (navContainer) {
            navContainer.style.display = 'flex';
            navContainer.style.justifyContent = 'space-between';
            navContainer.style.alignItems = 'center';
        }
        
        // Fix nav links
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.left = '50%';
            navLinks.style.transform = 'translateX(-50%)';
        }
        
        // Fix nav logo
        const navLogo = navbar.querySelector('.nav-logo-right');
        if (navLogo) {
            navLogo.style.display = 'flex';
            navLogo.style.marginLeft = 'auto';
        }
    }

    // Special handling for connect section - DON'T force styles
    const connectSection = document.querySelector('.connect-section');
    if (connectSection) {
        // Only ensure the section is visible, but don't force animation states
        connectSection.style.display = 'flex';
        connectSection.style.minHeight = '100vh';
        connectSection.style.alignItems = 'center';
        connectSection.style.justifyContent = 'center';
        connectSection.style.opacity = '1';
        connectSection.style.visibility = 'visible';
        
        // Let the animation system handle the rest
        console.log('🎯 Connect section structure ensured, animations left intact');
    }

    // Special handling for hero elements
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        heroContainer.style.opacity = '1';
        heroContainer.style.transform = 'translateY(0)';
    }

    console.log('✅ All elements forced to visible state (except connect section animations)');
}

function initializeFooterAnimation() {
    const footerContent = document.querySelector('.footer-content-integrated');
    const connectSection = document.querySelector('.connect-section');

    if (connectSection && footerContent) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        footerContent.classList.add('animate-lines');
                    }, 500);
                } else {
                    footerContent.classList.remove('animate-lines');
                }
            });
        }, {
            threshold: 0.3
        });

        footerObserver.observe(connectSection);
        console.log('Footer animation reinitialized');
    }
}

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .value-card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
    }
    
    .stat-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .contact-item {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    .contact-item:nth-child(1) { animation-delay: 0.1s; }
    .contact-item:nth-child(2) { animation-delay: 0.2s; }
    .contact-item:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .social-link {
        animation: bounceIn 0.6s ease-out forwards;
    }
    
    .social-link:nth-child(1) { animation-delay: 0.4s; }
    .social-link:nth-child(2) { animation-delay: 0.5s; }
    .social-link:nth-child(3) { animation-delay: 0.6s; }
    .social-link:nth-child(4) { animation-delay: 0.7s; }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(30px);
        }
        50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
        }
        70% {
            transform: scale(0.9) translateY(0);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .form-group {
        animation: fadeInLeft 0.6s ease-out forwards;
    }
    
    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.2s; }
    .form-group:nth-child(3) { animation-delay: 0.3s; }
    .form-group:nth-child(4) { animation-delay: 0.4s; }
    .form-group:nth-child(5) { animation-delay: 0.5s; }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .submit-btn {
        animation: fadeInUp 0.6s ease-out 0.6s forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .about-logo {
        animation: logoReveal 1s ease-out forwards;
    }
    
    @keyframes logoReveal {
        0% {
            opacity: 0;
            transform: scale(0.8) rotate(-10deg);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1) rotate(5deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    .modern-nav {
        animation: slideDown 0.6s ease-out forwards;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hero-badge {
        animation: fadeInDown 0.8s ease-out 0.2s forwards;
        opacity: 0;
    }
    
    .hero-description {
        animation: fadeInUp 0.8s ease-out 1.5s forwards;
        opacity: 0;
    }
    
    .hero-actions {
        animation: fadeInUp 0.8s ease-out 1.8s forwards;
        opacity: 0;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes highlightForm {
        0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
        }
        70% {
            box-shadow: 0 0 0 20px rgba(99, 102, 241, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
    }
`;
document.head.appendChild(style);

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

// Also initialize features grid immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize features grid immediately
    setTimeout(() => {
        initializeFeaturesGridAnimation();
        
        // Also ensure no duplicate loading screen on ready state
        if (loadingScreenShown) {
            console.log('🔄 DOM ready and loading screen already shown, ensuring clean state...');
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreenActive) {
                loadingScreen.style.display = 'none';
                loadingScreen.style.visibility = 'hidden';
                document.body.classList.add('loaded');
                document.body.classList.remove('loading');
            }
        }
    }, 100);
}

// Window resize handler
window.addEventListener('resize', () => {
    console.log('تم تغيير حجم النافذة');
});

function initializeBinaryQuestionMark() {
    const questionMarkContainer = document.getElementById('binaryQuestionMark');
    if (!questionMarkContainer) return;

    // Create the binary digits that form the question mark
    for (let i = 0; i < 5; i++) {
        const digit = document.createElement('span');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        questionMarkContainer.appendChild(digit);
    }

    // Animate the digits periodically
    setInterval(() => {
        const digits = questionMarkContainer.querySelectorAll('.binary-digit');
        digits.forEach(digit => {
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
        });
    }, 2000);
}

// Page transition system - FIXED FOR REPEATED CLICKS
document.addEventListener('DOMContentLoaded', function () {
    let lastScrollPosition = 0;
    let isTransitioning = false; // منع التداخل

    // Ensure transition div exists
    function ensureTransitionDiv() {
        let transitionDiv = document.querySelector('.page-transition');
        if (!transitionDiv) {
            transitionDiv = document.createElement('div');
            transitionDiv.className = 'page-transition';
            document.body.appendChild(transitionDiv);
        }
        return transitionDiv;
    }

    // Add CSS for transitions
    if (!document.querySelector('#page-transition-styles')) {
        const style = document.createElement('style');
        style.id = 'page-transition-styles';
        style.innerHTML = `
            .page-transition {
                position: fixed;
                bottom: -100%;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 9999;
                transition: bottom 0.8s ease-in-out;
            }
            
            .page-transition.active {
                bottom: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize tell us button - IMPROVED
    function initializeTellUsButton() {
        // Remove any existing listeners first
        const existingBtns = document.querySelectorAll('.tell-us-btn');
        existingBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Add fresh event listener
        const tellUsBtn = document.querySelector('.tell-us-btn');
        if (tellUsBtn) {
            tellUsBtn.addEventListener('click', function (e) {
                e.preventDefault();

                // Prevent multiple clicks during transition
                if (isTransitioning) {
                    console.log('Transition in progress, ignoring click');
                    return;
                }

                isTransitioning = true;
                lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                console.log('Tell us button clicked, saved scroll position:', lastScrollPosition);
                loadContactPage();
            });
            console.log('Tell us button initialized successfully');
        } else {
            console.log('Tell us button not found!');
        }
    }

    // Initial button setup
    initializeTellUsButton();

    // Load contact page function - IMPROVED
    function loadContactPage() {
        const transitionDiv = ensureTransitionDiv();

        console.log('Loading contact page...');

        if (transitionDiv) {
            transitionDiv.classList.add('active');
        }

        // Pre-fetch contact page content while transition is happening
        fetch('./contact.html')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const contactBody = doc.body;

                setTimeout(() => {
                    if (contactBody) {
                        // Remove old contact styles first
                        const oldContactStyles = document.querySelectorAll('#contact-page-styles, style[data-contact="true"]');
                        oldContactStyles.forEach(style => style.remove());

                        // Copy ALL CSS from contact.html head
                        const contactHead = doc.head;
                        const allStyles = contactHead.querySelectorAll('style, link[rel="stylesheet"]');

                        allStyles.forEach(styleElement => {
                            if (styleElement.tagName === 'STYLE') {
                                const newStyle = document.createElement('style');
                                newStyle.setAttribute('data-contact', 'true');
                                newStyle.innerHTML = styleElement.innerHTML;
                                document.head.appendChild(newStyle);
                                console.log('CSS loaded from contact page');
                            }
                        });

                        // Replace body content directly
                        document.body.innerHTML = contactBody.innerHTML;

                        // Re-add page transition div since body content was replaced
                        const newTransitionDiv = document.createElement('div');
                        newTransitionDiv.className = 'page-transition';
                        document.body.appendChild(newTransitionDiv);

                        // Ensure loader never reappears after DOM replacement
                        const strayLoader = document.getElementById('loading-screen');
                        if (strayLoader) {
                            strayLoader.remove();
                        }
                        document.body.classList.add('loaded');
                        document.body.classList.remove('loading');
                        window.__loaderFinalized = true;

                        // Re-add page transition CSS since head content was replaced
                        if (!document.querySelector('#page-transition-styles')) {
                            const style = document.createElement('style');
                            style.id = 'page-transition-styles';
                            style.innerHTML = `
                                .page-transition {
                                    position: fixed;
                                    bottom: -100%;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: white;
                                    z-index: 9999;
                                    transition: bottom 0.8s ease-in-out;
                                }
                                
                                .page-transition.active {
                                    bottom: 0;
                                }
                            `;
                            document.head.appendChild(style);
                        }

                        // Update page title
                        const newTitle = doc.querySelector('title');
                        if (newTitle) {
                            document.title = newTitle.textContent;
                        }

                        // Update URL
                        history.pushState({
                            page: 'contact',
                            homeScrollPosition: lastScrollPosition
                        }, '', './contact.html');

                        // Scroll to top
                        window.scrollTo(0, 0);

                        // Remove transition overlay from original transitionDiv
                        if (transitionDiv) {
                            transitionDiv.classList.remove('active');
                        }

                        // Reset transition flag
                        isTransitioning = false;

                        // Initialize contact page
                        initializeContactPage();

                        console.log('Contact page loaded successfully');
                    }
                }, 800);
            })
            .catch(error => {
                console.error('Error loading contact page:', error);
                isTransitioning = false; // Reset flag on error
                setTimeout(() => {
                    if (transitionDiv) {
                        transitionDiv.classList.remove('active');
                    }
                    window.location.href = 'contact.html';
                }, 800);
            });
    }

    // Load home page function - IMPROVED
    function loadHomePage(restoreScrollPosition = true) {
        const transitionDiv = ensureTransitionDiv();

        console.log('Loading home page...');

        if (transitionDiv) {
            transitionDiv.classList.add('active');
        }

        isTransitioning = true;

        fetch('./index.html')
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newBody = doc.body;

                setTimeout(() => {
                    if (newBody) {
                        // Remove contact page styles
                        const contactStyles = document.querySelectorAll('#contact-page-styles, style[data-contact="true"]');
                        contactStyles.forEach(style => style.remove());

                        // Replace body content directly
                        document.body.innerHTML = newBody.innerHTML;

                        // Re-add page transition div since body content was replaced
                        const newTransitionDiv = document.createElement('div');
                        newTransitionDiv.className = 'page-transition';
                        document.body.appendChild(newTransitionDiv);

                        // Ensure loader never reappears after DOM replacement
                        const strayLoader2 = document.getElementById('loading-screen');
                        if (strayLoader2) {
                            strayLoader2.remove();
                        }
                        document.body.classList.add('loaded');
                        document.body.classList.remove('loading');
                        window.__loaderFinalized = true;

                        // Re-add page transition CSS since head content was replaced
                        if (!document.querySelector('#page-transition-styles')) {
                            const style = document.createElement('style');
                            style.id = 'page-transition-styles';
                            style.innerHTML = `
                                .page-transition {
                                    position: fixed;
                                    bottom: -100%;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: white;
                                    z-index: 9999;
                                    transition: bottom 0.8s ease-in-out;
                                }
                                
                                .page-transition.active {
                                    bottom: 0;
                                }
                            `;
                            document.head.appendChild(style);
                        }

                        // Update URL
                        history.pushState({
                            page: 'home',
                            scrollPosition: 0
                        }, '', './');

                        // Update title
                        document.title = 'الهدف الرقمي';

                        // Force show all elements immediately to prevent hiding
                        setTimeout(() => {
                            forceShowAllElements();
                        }, 100);

                        // Restore scroll position
                        if (restoreScrollPosition && lastScrollPosition > 0) {
                            console.log('Restoring scroll position:', lastScrollPosition);
                            setTimeout(() => {
                                window.scrollTo(0, lastScrollPosition);
                            }, 200);
                        } else {
                            window.scrollTo(0, 0);
                        }

                        // Remove transition
                        if (transitionDiv) {
                            transitionDiv.classList.remove('active');
                        }

                        // Reset transition flag
                        isTransitioning = false;

                        // Enhanced reinitialization for back navigation
                        setTimeout(() => {
                            console.log('🔄 Starting enhanced reinitialization...');
                            
                            // Clean up any observers first
                            if (window.connectLightingObserver) {
                                window.connectLightingObserver.disconnect();
                            }
                            
                            // Force show all elements
                            forceShowAllElements();
                            
                            // Reinitialize core functionality
                            reinitializeHomePage();
                            
                            // Delay for animations
                            setTimeout(() => {
                                initializeProjectCardsAnimation();
                                initializeFooterAnimation();
                                console.log('✅ Project and footer animations reinitialized');
                            }, 100);
                            
                            setTimeout(() => {
                                initConnectLightingEffect();
                                console.log('✅ Connect lighting effect reinitialized');
                            }, 200);
                            
                            setTimeout(() => {
                                initializeFeaturesGridAnimation();
                                console.log('✅ Features grid animations reinitialized');
                            }, 300);
                            
                            // Re-apply language settings
                            setTimeout(() => {
                                const savedLang = localStorage.getItem('preferred-language') || 'ar';
                                applyTranslations(savedLang);
                                
                                if (savedLang === 'en') {
                                    document.body.setAttribute('dir', 'ltr');
                                    document.body.setAttribute('lang', 'en');
                                    document.body.classList.add('english-mode');
                                    document.body.classList.remove('arabic-mode');
                                } else {
                                    document.body.setAttribute('dir', 'rtl');
                                    document.body.setAttribute('lang', 'ar');
                                    document.body.classList.add('arabic-mode');
                                    document.body.classList.remove('english-mode');
                                }
                                
                                console.log('✅ Language settings restored:', savedLang);
                            }, 150);
                            
                            console.log('✅ Enhanced reinitialization complete');
                        }, 300);

                        console.log('Home page loaded successfully');
                    }
                }, 800);
            })
            .catch(error => {
                console.error('Error loading home page:', error);
                isTransitioning = false;
                setTimeout(() => {
                    if (transitionDiv) {
                        transitionDiv.classList.remove('active');
                    }
                    window.location.href = './';
                }, 800);
            });
    }

    // Initialize contact page function - FIXED
    function initializeContactPage() {
        console.log('Initializing contact page...');

        // Force show all content immediately
        setTimeout(() => {
            const body = document.body;
            const container = document.querySelector('.container');
            const header = document.querySelector('.header');

            if (body) {
                body.style.opacity = '1';
                body.style.background = '#ffffff';
            }

            if (container) {
                container.style.opacity = '1';
                container.style.transform = 'none';
            }

            if (header) {
                header.style.opacity = '1';
                header.style.transform = 'none';
            }

            // Show all form elements
            const formElements = document.querySelectorAll('.form-group, h1, .subtitle, .submit-btn');
            formElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.style.animationDelay = '0s';
            });
        }, 100);

        // Add back button functionality
        const backBtn = document.querySelector('.back-button');
        if (backBtn) {
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            newBackBtn.addEventListener('click', function (e) {
                e.preventDefault();

                if (isTransitioning) return;

                console.log('Back button clicked, show existing loader then go home');
                showExistingLoaderThenGoHome();
            });
            console.log('Back button initialized (uses existing loader + refresh)');
        }

        // Initialize interests selection
        const interestOptions = document.querySelectorAll('.interest-option');
        interestOptions.forEach(option => {
            option.addEventListener('click', function () {
                this.classList.toggle('selected');
                console.log('Interest selected:', this.dataset.value);
            });
        });

        // Initialize budget selection (single choice)
        const budgetOptions = document.querySelectorAll('.budget-option');
        budgetOptions.forEach(option => {
            option.addEventListener('click', function () {
                // Remove selected from all others
                budgetOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected to clicked one
                this.classList.add('selected');
                console.log('Budget selected:', this.dataset.value);
            });
        });

        // Initialize form if exists
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('تم إرسال رسالتك بنجاح!');
            });
        }

        // Auto-resize textarea
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }

        console.log('Contact page interactions initialized');
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function (e) {
        console.log('🔙 Browser back/forward detected - show existing loader then go home');
        
        if (isTransitioning) return;

        const currentPath = window.location.pathname;

        if (currentPath.includes('contact.html') || (e.state && e.state.page === 'contact')) {
            // Navigating into contact page
            loadContactPage();
        } else {
            // Navigating back to home: use the existing loader and hard refresh to home
            showExistingLoaderThenGoHome();
        }
    });
});

// ===== SLOW DOWN HERO VIDEO =====
function initializeHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');

    if (heroVideo) {
        // Wait for video to load
        heroVideo.addEventListener('loadeddata', function () {
            // Set playback rate to 0.5 (half speed) or 0.3 (slower)
            this.playbackRate = 0.8;
            console.log('Hero video playback rate set to:', this.playbackRate);
        });

        // If video is already loaded
        if (heroVideo.readyState >= 2) {
            heroVideo.playbackRate = 0.8;
            console.log('Hero video playback rate set to:', heroVideo.playbackRate);
        }
    }
}

// ===== BINARY MATRIX =====
function initializeBinaryMatrix() {
    const matrix = document.getElementById('binaryMatrix');
    if (!matrix) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const digitWidth = 75;
    const digitHeight = 85;

    const columns = Math.ceil(screenWidth / digitWidth);
    const rows = Math.ceil(screenHeight / digitHeight);
    const totalDigits = columns * rows;

    matrix.innerHTML = '';

    for (let i = 0; i < totalDigits; i++) {
        const digit = document.createElement('span');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        digit.style.setProperty('--delay', `${(i % 5) * 0.5}s`);
        matrix.appendChild(digit);
    }

    setInterval(() => {
        const digits = matrix.querySelectorAll('.binary-digit');
        const randomDigits = Array.from(digits).sort(() => 0.5 - Math.random()).slice(0, 5);

        randomDigits.forEach(digit => {
            digit.textContent = digit.textContent === '1' ? '0' : '1';
            digit.classList.add('active');

            setTimeout(() => {
                digit.classList.remove('active');
            }, 300);
        });
    }, 1000);
}

// Interactive Services Hub
document.addEventListener('DOMContentLoaded', function () {
    const serviceOrbs = document.querySelectorAll('.service-orb');
    const serviceDetails = document.querySelectorAll('.service-detail');

    // Function to show service detail
    function showServiceDetail(serviceId) {
        // Hide all details
        serviceDetails.forEach(detail => {
            detail.classList.remove('active');
        });

        // Show selected detail
        const targetDetail = document.getElementById(serviceId);
        if (targetDetail) {
            setTimeout(() => {
                targetDetail.classList.add('active');
            }, 200);
        }
    }

    // Add click listeners to orbs
    serviceOrbs.forEach(orb => {
        orb.addEventListener('click', function () {
            const serviceId = this.dataset.service;
            showServiceDetail(serviceId);

            // Add active state to orb
            serviceOrbs.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize with first service
    showServiceDetail('mobile');
    if (serviceOrbs[0]) {
        serviceOrbs[0].classList.add('active');
    }
});

// ===== CONNECT SECTION TOP LIGHTING EFFECT =====
function initConnectLightingEffect() {
    const connectSection = document.querySelector('.connect-section');

    if (!connectSection) {
        console.log('❌ Connect section not found for lighting effect');
        return;
    }

    console.log('🔍 Found connect section, initializing lighting effect...');

    // Remove any existing observers
    if (window.connectLightingObserver) {
        window.connectLightingObserver.disconnect();
        console.log('🧹 Cleaned up existing observer');
    }

    window.connectLightingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('📊 Connect section intersection:', {
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
                boundingRect: entry.boundingClientRect
            });

            if (entry.isIntersecting) {
                // Light comes down from top when entering viewport
                connectSection.classList.add('light-up');
                console.log('✨ Connect section lighting up from top...');
            } else {
                // Lights go back up when leaving viewport
                connectSection.classList.remove('light-up');
                console.log('🌙 Connect section lights going back up...');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px 0px 0px 0px' // No margin for immediate trigger
    });

    window.connectLightingObserver.observe(connectSection);
    console.log('✅ Connect lighting effect observer initialized and watching');

    // Also check if it's already in viewport
    setTimeout(() => {
        const rect = connectSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        console.log('🔍 Initial viewport check:', {
            isInViewport,
            rectTop: rect.top,
            rectBottom: rect.bottom,
            windowHeight: window.innerHeight
        });
        
        if (isInViewport) {
            connectSection.classList.add('light-up');
            console.log('⚡ Connect section immediately lit up - already in viewport');
        }
    }, 100);
}

// Make sure this runs when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // ... your existing code ...

    // Initialize the lighting effect
    initConnectLightingEffect();
});


// اجمع كل العناصر المراد مراقبتها
const elements = document.querySelectorAll('.section-subtitle, .project-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;

            // عنوان
            if (el.classList.contains('section-subtitle')) {
                el.classList.add('slide-up');
            }

            // كرت مشروع
            if (el.classList.contains('project-card')) {
                el.classList.add('visible');

                // صورة داخل الكرت
                const img = el.querySelector('.project-image-bg');
                if (img) img.classList.add('show');
            }

            // نوقف المراقبة بعد أول ظهور
            observer.unobserve(el);
        }
    });
}, {
    threshold: 0.15
});

// نبدأ المراقبة
elements.forEach(el => observer.observe(el));



// Footer Navigation Lines Animation
const footerContent = document.querySelector('.footer-content-integrated');
const connectSection = document.querySelector('.connect-section');

const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation class when footer comes into view
            setTimeout(() => {
                footerContent.classList.add('animate-lines');
            }, 500); // Delay for better effect
        } else {
            // Remove animation class when footer goes out of view
            footerContent.classList.remove('animate-lines');
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% of the section is visible
});

if (connectSection && footerContent) {
    footerObserver.observe(connectSection);
};

// ===== HOME PAGE REINITIALIZATION WITHOUT LOADING SCREEN =====
function reinitializeHomePage() {
    console.log('🔄 Reinitializing home page without loading screen...');

    // Add js-loaded class to enable animations
    document.body.classList.add('js-loaded', 'loaded');
    console.log('✅ JS loaded class added');

    initializeCursor();
    console.log('✅ Cursor initialized');

    initializeBinaryMatrix();
    console.log('✅ Binary matrix initialized');

    initializeSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    initializeNavbar();
    console.log('✅ Navbar initialized');

    initializeLanguageToggle();
    console.log('✅ Language toggle initialized');

    initializeContactForm();
    console.log('✅ Contact form initialized');

    initializeBinaryQuestionMark();
    console.log('✅ Binary question mark initialized');

    initializeScrollAnimations();
    console.log('✅ Scroll animations initialized');

    initializeHeroAnimations();
    console.log('✅ Hero animations initialized');

    initializeMovingText();
    console.log('✅ Moving text marquee initialized');

    initializeTechMarquee();
    console.log('✅ Tech marquee initialized');

    initializeHeroVideo();
    console.log('✅ Hero video initialized');

    initializeTellUsButton();
    console.log('✅ Tell us button initialized');

    // Initialize connect section lighting effect
    initConnectLightingEffect();
    console.log('✅ Connect section lighting effect initialized');

    // Initialize footer animation
    initializeFooterAnimation();
    console.log('✅ Footer animation initialized');

    // Initialize project cards animation
    initializeProjectCardsAnimation();
    console.log('✅ Project cards animation initialized');

    // Initialize features grid section animations
    initializeFeaturesGridAnimation();
    console.log('✅ Features grid animations initialized');

    // Extra safety: Re-initialize footer and mobile links explicitly
    setTimeout(() => {
        // Footer links
        const footerLinks = document.querySelectorAll('.footer-nav-link');
        console.log(`🔗 Found ${footerLinks.length} footer links, ensuring they work properly`);
        
        footerLinks.forEach((link, index) => {
            // Remove any existing event listeners by cloning the element
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add fresh event listener
            newLink.addEventListener('click', (e) => {
                const href = newLink.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    // Make sure we're not in transition mode
                    if (typeof isTransitioning !== 'undefined' && isTransitioning) {
                        console.log('Transition in progress, ignoring footer link click');
                        return;
                    }
                    
                    const target = document.querySelector(href);
                    if (target) {
                        console.log('Footer link clicked, scrolling to:', href);
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
            
            console.log(`✅ Footer link ${index + 1} reinitialized: ${newLink.getAttribute('href')}`);
        });

        // Mobile nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        console.log(`📱 Found ${mobileNavLinks.length} mobile nav links, ensuring they work properly`);
        
        mobileNavLinks.forEach((link, index) => {
            // Remove any existing event listeners by cloning the element
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add fresh event listener
            newLink.addEventListener('click', (e) => {
                const href = newLink.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    // Make sure we're not in transition mode
                    if (typeof isTransitioning !== 'undefined' && isTransitioning) {
                        console.log('Transition in progress, ignoring mobile nav link click');
                        return;
                    }
                    
                    // Close mobile menu first
                    const burgerMenu = document.getElementById('burgerMenu');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (burgerMenu && mobileMenuOverlay) {
                        burgerMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    const target = document.querySelector(href);
                    if (target) {
                        console.log('Mobile nav link clicked, scrolling to:', href);
                        // Add a small delay to allow menu closing animation
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                }
            });
            
            console.log(`✅ Mobile nav link ${index + 1} reinitialized: ${newLink.getAttribute('href')}`);
        });
    }, 100);

    // Re-apply translations after page reinitialization
    setTimeout(() => {
        try {
            const savedLang = localStorage.getItem('preferred-language') || 'ar';
            applyTranslations(savedLang);
            console.log('✅ Translations re-applied after page reinitialization:', savedLang);
        } catch (e) {
            console.log('⚠️ Could not re-apply translations, using Arabic as default');
            applyTranslations('ar');
        }
    }, 200);

    console.log('✅ Home page reinitialized successfully without loading screen');
}

// ===== INNOVATIVE LANGUAGE TOGGLE FUNCTIONALITY =====
function initializeLanguageToggle() {
    const langToggleBtn = document.getElementById('langToggleBtn');
    const langCurrent = document.getElementById('langCurrent');
    const langNext = document.getElementById('langNext');
    const body = document.body;

    if (!langToggleBtn || !langCurrent || !langNext) return;

    let isArabic = true; // Default state

    // Initialize state
    updateLanguageDisplay();

    // Button click event
    langToggleBtn.addEventListener('click', function() {
        // Add active animation
        this.classList.add('active');
        this.classList.add('switching');
        
        // Create click feedback effect
        createClickFeedback(this);
        
        // Toggle language
        isArabic = !isArabic;
        
        // Update display with animation
        setTimeout(() => {
            updateLanguageDisplay();
        }, 150);

        // Apply language changes
        updateLanguageState(isArabic);

        // Remove active state
        setTimeout(() => {
            this.classList.remove('active');
            this.classList.remove('switching');
        }, 600);
    });

    // Add hover sound effect (optional)
    langToggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px) scale(1.02)';
    });

    langToggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    function createClickFeedback(element) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(0, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        
        element.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '60px', height: '60px', opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out'
        });
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 400);
    }

    function updateLanguageDisplay() {
        if (isArabic) {
            langCurrent.textContent = 'AR';
            langNext.textContent = 'EN';
        } else {
            langCurrent.textContent = 'EN';
            langNext.textContent = 'AR';
        }
    }

    function updateLanguageState(isArabic) {
        const langCode = isArabic ? 'ar' : 'en';
        
        if (isArabic) {
            // Arabic mode
            body.setAttribute('dir', 'rtl');
            body.setAttribute('lang', 'ar');
            body.classList.add('arabic-mode');
            body.classList.remove('english-mode');
            console.log('🌐 Language switched to Arabic');
        } else {
            // English mode
            body.setAttribute('dir', 'ltr');
            body.setAttribute('lang', 'en');
            body.classList.add('english-mode');
            body.classList.remove('arabic-mode');
            console.log('🌐 Language switched to English');
        }

        // Apply translations
        applyTranslations(langCode);

        // Add transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);

        // Store preference
        try {
            localStorage.setItem('preferred-language', langCode);
        } catch (e) {
            console.log('Could not save language preference');
        }
    }

    // Load saved preference
    try {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && savedLang === 'en') {
            isArabic = false;
            updateLanguageDisplay();
            updateLanguageState(isArabic);
        }
    } catch (e) {
        console.log('Could not load language preference');
    }

    console.log('✅ Innovative language toggle initialized');
}

function fixNavbarAndConnectSection() {
    setTimeout(() => {
        // Force show connect section
        const connectSection = document.querySelector('.connect-section');
        if (connectSection) {
            connectSection.style.display = 'flex';
            connectSection.style.opacity = '1';
            connectSection.style.visibility = 'visible';
            connectSection.style.minHeight = '100vh';
            connectSection.style.alignItems = 'center';
            connectSection.style.justifyContent = 'center';
            connectSection.classList.add('light-up'); // أضف هذا السطر لإجبار الأنيميشن
            console.log('✅ connect-section forced visible');
        } else {
            console.log('❌ connect-section not found');
        }
        // Force show navbar
        const navbar = document.querySelector('.modern-nav');
        if (navbar) {
            navbar.classList.remove('hidden', 'scrolled');
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
            navbar.style.display = 'block';
            console.log('✅ navbar forced visible');
        } else {
            console.log('❌ navbar not found');
        }
        // Reinitialize connect lighting effect
        if (typeof initConnectLightingEffect === 'function') {
            initConnectLightingEffect();
            console.log('✅ connect lighting effect reinitialized');
        }
    }, 400); // اجعل التأخير أكبر قليلاً
}

// استبدل كل محاولات إجبار الظهور بهذا فقط بعد loadHomePage
const originalLoadHomePage = loadHomePage;
loadHomePage = function(restoreScrollPosition = true) {
    originalLoadHomePage.call(this, restoreScrollPosition);
    fixNavbarAndConnectSection();
};

// ===== FEATURES GRID SECTION ANIMATIONS =====
function initializeFeaturesGridAnimation() {
    const featuresSection = document.querySelector('.features-grid-section');
    
    if (!featuresSection) {
        console.log('❌ Features grid section not found');
        return;
    }

    console.log('🔄 Initializing features grid animations...');

    // Force show cards initially if section is already in view
    const rect = featuresSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInViewport) {
        featuresSection.classList.add('in-view');
        console.log('⚡ Features grid section immediately in view - animations triggered');
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view class to trigger animations
                featuresSection.classList.add('in-view');
                console.log('✨ Features grid section in view - animations triggered');
            } else {
                // Remove in-view class when out of view
                featuresSection.classList.remove('in-view');
                console.log('🌙 Features grid section out of view - animations reset');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(featuresSection);
    console.log('✅ Features grid animation observer initialized');

    // Fallback: Force show after 2 seconds if still not visible
    setTimeout(() => {
        if (!featuresSection.classList.contains('in-view')) {
            featuresSection.classList.add('in-view');
            console.log('🔄 Fallback: Features grid section forced visible');
        }
    }, 2000);
}