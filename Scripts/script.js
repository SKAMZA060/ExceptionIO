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
            ['Tab5', 'Images/Tabs/UI Design.jpg'],
            ['Tab6', 'Images/Tabs/devops-cloud.jpg']
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

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Here you would typically send the form data to your server
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    });
    
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