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


// Service Tabs Script
// Tab functionality for horizontal tabs with images
function openTab(evt, tabName) {
    // Hide all tabcontent
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    
    // Remove active class from all tablinks
    const tablinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    // Show the specific tab content and add active class to the button
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    // Update the image based on the active tab
    updateTabImage(tabName);
}

function updateTabImage(tabName) {
    const image = document.getElementById('tab-image');
    const imageMap = {
        'Tab1': 'Images/Tabs/backend-development.jpg',
        'Tab2': 'Images/Tabs/frontend-development.jpg',
        'Tab3': 'Images/Tabs/Mobile Application Development.jpg',
        'Tab5': 'Images/Tabs/UI Design.jpg',
        'Tab6': 'Images/Tabs/devops-cloud.jpg',
     
    };
    
    if (imageMap[tabName]) {
        image.src = imageMap[tabName];
        // Update alt text based on tab content
        const activeTab = document.getElementById(tabName);
        if (activeTab) {
            const title = activeTab.querySelector('h3').textContent;
            image.alt = title + ' Image';
        }
    }
}

// Initialize first tab
document.addEventListener('DOMContentLoaded', function() {
    updateTabImage('Tab1');
});