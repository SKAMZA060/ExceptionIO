// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Clone social icons for mobile menu
        if (navLinks.classList.contains('active') && !document.querySelector('.social-icons.mobile-visible')) {
            const mobileSocialIcons = socialIcons.cloneNode(true);
            mobileSocialIcons.classList.add('mobile-visible');
            navLinks.appendChild(mobileSocialIcons);
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Mobile dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        
        dropbtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
});

// Tab functionality - Optimized for performance
class TabManager {
    constructor() {
        this.tabs = [];
        this.currentIndex = 0;
        this.imageMap = new Map([
            ['Tab1', 'Images/Tabs/backend-development.jpg'],
            ['Tab2', 'Images/Tabs/frontend-development.jpg'],
            ['Tab3', 'Images/Tabs/Mobile Application Development.jpg'],
            ['Tab4', 'Images/Tabs/UI Design.jpg'],
            ['Tab5', 'Images/Tabs/devops-cloud.jpg']
        ]);
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.preloadImages();
        this.activateTab(0);
    }

    cacheElements() {
        this.tablinks = document.getElementsByClassName('tablink');
        this.tabcontent = document.getElementsByClassName('tabcontent');
        this.tabImage = document.getElementById('tab-image');
        
        // Convert HTMLCollections to Arrays for better performance
        this.tabs = Array.from(this.tablinks);
    }

    bindEvents() {
        // Event delegation for tab clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tablink')) {
                const tablink = e.target.closest('.tablink');
                const tabIndex = this.tabs.indexOf(tablink);
                if (tabIndex > -1) {
                    this.activateTab(tabIndex);
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextTab();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousTab();
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextTab();
                } else {
                    this.previousTab();
                }
            }
        });
    }

    preloadImages() {
        // Preload all tab images for instant switching
        this.imageMap.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }

    activateTab(index) {
        // Validate index
        if (index < 0 || index >= this.tabs.length) return;
        
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
            this.currentIndex = index;
            
            // Update tabs
            this.updateTabStates();
            
            // Update content
            this.updateContent();
            
            // Update image with smooth transition
            this.updateImage();
        });
    }

    updateTabStates() {
        // Batch DOM updates
        for (let i = 0; i < this.tablinks.length; i++) {
            const method = i === this.currentIndex ? 'add' : 'remove';
            this.tablinks[i].classList[method]('active');
            this.tabcontent[i].classList[method]('active');
        }
    }

    updateContent() {
        // Add fade animation
        const activeContent = this.tabcontent[this.currentIndex];
        if (activeContent) {
            activeContent.style.animation = 'fadeIn 0.3s ease-in-out';
            
            // Remove animation after it completes
            setTimeout(() => {
                activeContent.style.animation = '';
            }, 300);
        }
    }

    updateImage() {
        const tabName = this.tabs[this.currentIndex]?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        
        if (tabName && this.imageMap.has(tabName)) {
            const newSrc = this.imageMap.get(tabName);
            
            // Only update if source changed
            if (this.tabImage.src !== newSrc) {
                // Add loading state
                this.tabImage.style.opacity = '0.7';
                
                // Use preloaded image for instant switch
                const tempImg = new Image();
                tempImg.src = newSrc;
                
                tempImg.onload = () => {
                    this.tabImage.src = newSrc;
                    this.tabImage.alt = `${this.getTabTitle()} Image`;
                    
                    // Smooth fade in
                    this.tabImage.style.opacity = '1';
                };
                
                tempImg.onerror = () => {
                    console.warn(`Failed to load image: ${newSrc}`);
                    this.tabImage.style.opacity = '1';
                };
            }
        }
    }

    getTabTitle() {
        const activeTab = this.tabcontent[this.currentIndex];
        return activeTab?.querySelector('h3')?.textContent || 'Service';
    }

    nextTab() {
        const nextIndex = (this.currentIndex + 1) % this.tabs.length;
        this.activateTab(nextIndex);
    }

    previousTab() {
        const prevIndex = (this.currentIndex - 1 + this.tabs.length) % this.tabs.length;
        this.activateTab(prevIndex);
    }

    // Public methods for external control
    goToTab(tabName) {
        const tabIndex = this.tabs.findIndex(tab => 
            tab.getAttribute('onclick')?.includes(tabName)
        );
        if (tabIndex > -1) {
            this.activateTab(tabIndex);
        }
    }

    getCurrentTab() {
        return this.currentIndex;
    }

    getTotalTabs() {
        return this.tabs.length;
    }
}

// Initialize tab manager
let tabManager;

document.addEventListener('DOMContentLoaded', function() {
    tabManager = new TabManager();
    
    // Add next/previous buttons if they exist
    const nextBtn = document.getElementById('nextTab');
    const prevBtn = document.getElementById('prevTab');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => tabManager.nextTab());
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => tabManager.previousTab());
    }
});

// Export for global access (if needed)
window.TabManager = TabManager;

// Fallback for legacy support
function openTab(evt, tabName) {
    if (tabManager) {
        tabManager.goToTab(tabName);
    } else {
        // Fallback to original functionality
        const tabcontent = document.getElementsByClassName("tabcontent");
        const tablinks = document.getElementsByClassName("tablink");
        
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }
        
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");
        
        // Simple image update
        const imageMap = {
            'Tab1': 'Images/Tabs/backend-development.jpg',
            'Tab2': 'Images/Tabs/frontend-development.jpg',
            'Tab3': 'Images/Tabs/Mobile Application Development.jpg',
            'Tab5': 'Images/Tabs/UI Design.jpg',
            'Tab6': 'Images/Tabs/devops-cloud.jpg'
        };
        
        const image = document.getElementById('tab-image');
        if (imageMap[tabName]) {
            image.src = imageMap[tabName];
        }
    }
}


    
// Form submission handling with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Initialize EmailJS with your Public Key
    emailjs.init('OX-a1fFWh5t1sFFrN');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            companySize: document.getElementById('companySize').value,
            message: document.getElementById('message').value,
            privacyPolicy: document.getElementById('privacyPolicy').checked,
            timestamp: new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Send TWO emails: Auto-reply to user + Notification to you
        Promise.all([
            // Auto-reply to user
            emailjs.send('service_3ia6jom', 'template_9k5hxqd', formData),
            // Notification to you (business owner)
            emailjs.send('service_3ia6jom', 'template_notification', formData)
        ])
        .then(function(responses) {
            console.log('SUCCESS! Both emails sent', responses);
            
            // Show professional success message
            showSuccessMessage(formData.firstName);
            contactForm.reset();
            
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message
            showErrorMessage();
            
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
        });
    });
    
    // Professional success message function (keep your existing one)
    function showSuccessMessage(firstName) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 1px solid #e0e0e0;
            ">
                <div style="
                    background: #4CAF50;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    color: white;
                ">✓</div>
                
                <h2 style="
                    color: #2c3e50;
                    margin: 0 0 15px 0;
                    font-size: 24px;
                    font-weight: 600;
                ">Message Sent Successfully</h2>
                
                <p style="
                    color: #5d6d7e;
                    line-height: 1.6;
                    margin: 0 0 25px 0;
                    font-size: 16px;
                ">
                    Thank you, <strong>${firstName}</strong>! Your inquiry has been received and will be reviewed by our team. 
                    We appreciate your interest and will respond within 24 business hours.
                </p>
                
                <button onclick="this.closest('div').parentElement.remove()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#2980b9'" 
                   onmouseout="this.style.background='#3498db'">
                    Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-close after 8 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 8000);
    }
    
    // Professional error message function (keep your existing one)
    function showErrorMessage() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 1px solid #e0e0e0;
            ">
                <div style="
                    background: #e74c3c;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    color: white;
                ">!</div>
                
                <h2 style="
                    color: #2c3e50;
                    margin: 0 0 15px 0;
                    font-size: 24px;
                    font-weight: 600;
                ">Submission Error</h2>
                
                <p style="
                    color: #5d6d7e;
                    line-height: 1.6;
                    margin: 0 0 25px 0;
                    font-size: 16px;
                ">
                    We apologize, but there was an issue sending your message. 
                    Please try again in a few moments or contact us directly at our support email.
                </p>
                
                <button onclick="this.closest('div').parentElement.remove()" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#c0392b'" 
                   onmouseout="this.style.background='#e74c3c'">
                    Try Again
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Add focus animations
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Scroll animation for portfolio items
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    portfolioItems.forEach(item => {
        observer.observe(item);
    });
});


// Enhanced Tab Manager with overflow prevention
class ServicesTabManager {
    constructor() {
        this.currentTab = 'system-development';
        this.init();
    }

    init() {
        this.bindEvents();
        this.activateTab(this.currentTab);
        this.adimateTabButtons();
    }

    bindEvents() {
        // Tab button clicks
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.activateTab(tabId);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateTabs(e.key === 'ArrowRight' ? 'next' : 'prev');
            }
        });

        // Window resize handling
        window.addEventListener('resize', () => {
            this.adimateTabButtons();
        });
    }

    activateTab(tabId) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        // Update theme
        this.updateTheme(tabId);

        this.currentTab = tabId;

        // Smooth scroll to top of tabs section
        const tabsSection = document.querySelector('.services-tabs-section');
        if (tabsSection) {
            window.scrollTo({
                top: tabsSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    updateTheme(tabId) {
        const section = document.querySelector('.services-tabs-section');
        
        if (tabId === 'penetration-testing') {
            section.classList.add('cybersecurity-theme');
            this.updateMetaTheme('dark');
        } else {
            section.classList.remove('cybersecurity-theme');
            this.updateMetaTheme('light');
        }
    }

    updateMetaTheme(theme) {
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0F172A' : '#38BDF8');
        }
    }

    navigateTabs(direction) {
        const tabs = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = tabs.findIndex(tab => tab.classList.contains('active'));
        let nextIndex;

        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        this.activateTab(tabs[nextIndex].dataset.tab);
    }

    adjustTabButtons() {
        const tabButtons = document.querySelector('.tab-buttons');
        const buttons = document.querySelectorAll('.tab-button');
        
        if (window.innerWidth < 768) {
            // On mobile, ensure buttons are properly scrollable
            tabButtons.style.overflowX = 'auto';
            buttons.forEach(button => {
                button.style.flex = '0 0 auto';
            });
        } else {
            // On desktop, ensure equal distribution
            tabButtons.style.overflowX = 'visible';
            buttons.forEach(button => {
                button.style.flex = '1';
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ServicesTabManager();
});

// Prevent horizontal scroll
window.addEventListener('scroll', function() {
    if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
    }
});


