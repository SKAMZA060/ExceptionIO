(function () {
  "use strict";

  // Small utilities
  const safeQuery = (selector, root = document) => root.querySelector(selector);

  function initMenu() {
    const menuToggle = safeQuery(".menu-toggle");
    const navLinks = safeQuery(".nav-links");
    const socialIcons = safeQuery(".social-icons");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // Clone social icons for mobile menu (if present)
      if (
        navLinks.classList.contains("active") &&
        socialIcons &&
        !document.querySelector(".social-icons.mobile-visible")
      ) {
        const mobileSocialIcons = socialIcons.cloneNode(true);
        mobileSocialIcons.classList.add("mobile-visible");
        navLinks.appendChild(mobileSocialIcons);
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !event.target.closest(".main-nav") &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
      }
    });

    // Mobile dropdown functionality (guard for buttons)
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown) => {
      const dropbtn = dropdown.querySelector(".dropbtn");
      if (!dropbtn) return;

      dropbtn.addEventListener("click", function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle("active");
        }
      });
    });
  }

  // Tab functionality - cleaned and robust
  class TabManager {
    constructor() {
      this.tabs = [];
      this.currentIndex = 0;
      // Use normalized filenames; spaces are encoded when setting src
      this.imageMap = new Map([
        ["Tab1", "Images/Tabs/backend-development.jpg"],
        ["Tab2", "Images/Tabs/frontend-development.jpg"],
        ["Tab3", "Images/Tabs/mobile-application-development.jpg"],
        ["Tab4", "Images/Tabs/ui-design.jpg"],
        ["Tab5", "Images/Tabs/devops-cloud.jpg"],
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
      this.tablinks = document.getElementsByClassName("tablink");
      this.tabcontent = document.getElementsByClassName("tabcontent");
      this.tabImage = document.getElementById("tab-image");
      this.tabs = Array.from(this.tablinks);
    }

    bindEvents() {
      // Event delegation for tab clicks
      document.addEventListener("click", (e) => {
        const tablink = e.target.closest(".tablink");
        if (tablink) {
          const tabIndex = this.tabs.indexOf(tablink);
          if (tabIndex > -1) this.activateTab(tabIndex);
        }
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          this.nextTab();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.previousTab();
        }
      });

      // Touch/swipe support for mobile
      let touchStartX = 0;
      document.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      document.addEventListener(
        "touchend",
        (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 50)
            diff > 0 ? this.nextTab() : this.previousTab();
        },
        { passive: true }
      );
    }

    preloadImages() {
      if (!("Image" in window)) return;
      this.imageMap.forEach((src) => {
        const img = new Image();
        img.src = encodeURI(src);
      });
    }

    activateTab(index) {
      if (index < 0 || index >= this.tabs.length) return;
      requestAnimationFrame(() => {
        this.currentIndex = index;
        this.updateTabStates();
        this.updateContent();
        this.updateImage();
      });
    }

    updateTabStates() {
      for (let i = 0; i < this.tablinks.length; i++) {
        const method = i === this.currentIndex ? "add" : "remove";
        this.tablinks[i].classList[method]("active");
        if (this.tabcontent[i]) this.tabcontent[i].classList[method]("active");
      }
    }

    updateContent() {
      const activeContent = this.tabcontent[this.currentIndex];
      if (activeContent) {
        activeContent.style.animation = "fadeIn 0.3s ease-in-out";
        setTimeout(() => {
          activeContent.style.animation = "";
        }, 300);
      }
    }

    updateImage() {
      if (!this.tabImage) return;
      const tabName = this.tabs[this.currentIndex]
        ?.getAttribute("onclick")
        ?.match(/'([^']+)'/)?.[1];
      if (tabName && this.imageMap.has(tabName)) {
        const newSrc = encodeURI(this.imageMap.get(tabName));
        if (this.tabImage.src !== newSrc) {
          this.tabImage.style.opacity = "0.7";
          const tempImg = new Image();
          tempImg.src = newSrc;
          tempImg.onload = () => {
            this.tabImage.src = newSrc;
            this.tabImage.alt = `${this.getTabTitle()} Image`;
            this.tabImage.style.opacity = "1";
          };
          tempImg.onerror = () => {
            console.warn(`Failed to load image: ${newSrc}`);
            this.tabImage.style.opacity = "1";
          };
        }
      }
    }

    getTabTitle() {
      const activeTab = this.tabcontent[this.currentIndex];
      return activeTab?.querySelector("h3")?.textContent || "Service";
    }
    nextTab() {
      this.activateTab((this.currentIndex + 1) % this.tabs.length);
    }
    previousTab() {
      this.activateTab(
        (this.currentIndex - 1 + this.tabs.length) % this.tabs.length
      );
    }

    goToTab(tabName) {
      const tabIndex = this.tabs.findIndex((tab) =>
        tab.getAttribute("onclick")?.includes(tabName)
      );
      if (tabIndex > -1) this.activateTab(tabIndex);
    }

    getCurrentTab() {
      return this.currentIndex;
    }
    getTotalTabs() {
      return this.tabs.length;
    }
  }

  // Expose TabManager in a controlled way
  window.TabManager = TabManager;

  // Legacy fallback for openTab still supported
  function openTab(evt, tabName) {
    if (window.__TAB_MANAGER_INSTANCE__) {
      window.__TAB_MANAGER_INSTANCE__.goToTab(tabName);
      return;
    }

    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tabcontent.length; i++)
      tabcontent[i].classList.remove("active");
    for (let i = 0; i < tablinks.length; i++)
      tablinks[i].classList.remove("active");
    const el = document.getElementById(tabName);
    if (el) el.classList.add("active");
    if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");

    const imageMap = {
      Tab1: "Images/Tabs/backend-development.jpg",
      Tab2: "Images/Tabs/frontend-development.jpg",
      Tab3: "Images/Tabs/mobile-application-development.jpg",
      Tab5: "Images/Tabs/ui-design.jpg",
      Tab6: "Images/Tabs/devops-cloud.jpg",
    };
    const image = document.getElementById("tab-image");
    if (image && imageMap[tabName]) image.src = encodeURI(imageMap[tabName]);
  }

  // Contact form handling (EmailJS optional, Netlify fallback)
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = form.querySelector(".submit-btn");
    const statusEl = document.getElementById("formStatus");

    // Helpers
    function showStatus(msg, cls) {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.className = "form-status " + cls;
        statusEl.setAttribute("aria-hidden", "false");
      }
    }

    // Show modal messages (reuse previous markup)
    function showSuccessMessage(firstName) {
      const modal = document.createElement("div");
      modal.style.cssText =
        /* same as before */ "position: fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;font-family:system-ui,-apple-system,sans-serif;";
      modal.innerHTML = `<div style="background:white;padding:40px;border-radius:12px;text-align:center;max-width:500px;margin:20px;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid #e0e0e0;"><div style="background:#4CAF50;width:60px;height:60px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:30px;color:white;">✓</div><h2 style="color:#2c3e50;margin:0 0 15px 0;font-size:24px;font-weight:600;">Message Sent Successfully</h2><p style="color:#5d6d7e;line-height:1.6;margin:0 0 25px 0;font-size:16px;">Thank you, <strong>${firstName}</strong>! Your inquiry has been received and will be reviewed by our team. We will respond within 24 business hours.</p><button id="closeSuccess" style="background:#3498db;color:white;border:none;padding:12px 30px;border-radius:6px;font-size:16px;cursor:pointer;font-weight:500;">Continue</button></div>`;
      document.body.appendChild(modal);
      const btn = document.getElementById("closeSuccess");
      if (btn) btn.addEventListener("click", () => modal.remove());
      setTimeout(() => {
        if (document.body.contains(modal)) modal.remove();
      }, 8000);
    }

    function showErrorMessage() {
      const modal = document.createElement("div");
      modal.style.cssText =
        "position: fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:10000;font-family:system-ui,-apple-system,sans-serif;";
      modal.innerHTML = `<div style="background:white;padding:40px;border-radius:12px;text-align:center;max-width:500px;margin:20px;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid #e0e0e0;"><div style="background:#e74c3c;width:60px;height:60px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:30px;color:white;">!</div><h2 style="color:#2c3e50;margin:0 0 15px 0;font-size:24px;font-weight:600;">Submission Error</h2><p style="color:#5d6d7e;line-height:1.6;margin:0 0 25px 0;font-size:16px;">We apologize, but there was an issue sending your message. Please try again in a few moments or contact us directly at our support email.</p><button id="closeError" style="background:#e74c3c;color:white;border:none;padding:12px 30px;border-radius:6px;font-size:16px;cursor:pointer;font-weight:500;">Try Again</button></div>`;
      document.body.appendChild(modal);
      const btn = document.getElementById("closeError");
      if (btn) btn.addEventListener("click", () => modal.remove());
    }

    // Read EmailJS config from data attributes (don't hardcode keys)
    const emailjsPublicKey = form.dataset.emailjsPublicKey;
    const emailjsService = form.dataset.emailjsService;
    const emailjsTemplate = form.dataset.emailjsTemplate;
    const emailjsNotificationTemplate =
      form.dataset.emailjsNotificationTemplate;

    // Initialize EmailJS only if configured and library is available
    if (
      emailjsPublicKey &&
      window.emailjs &&
      typeof emailjs.init === "function"
    ) {
      try {
        emailjs.init(emailjsPublicKey);
      } catch (err) {
        console.warn("EmailJS init failed", err);
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot check
      const botField = document.getElementById("bot-field");
      if (botField && botField.value) {
        showStatus("Submission rejected (bot detected).", "error");
        return;
      }

      if (submitBtn) {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const formValues = Object.fromEntries(new FormData(form).entries());
      formValues.timestamp = new Date().toISOString();

      // Prefer EmailJS if configured
      if (
        window.emailjs &&
        typeof emailjs.send === "function" &&
        emailjsService &&
        emailjsTemplate
      ) {
        Promise.all([
          emailjs.send(emailjsService, emailjsTemplate, formValues),
          emailjs.send(
            emailjsService,
            emailjsNotificationTemplate || emailjsTemplate,
            formValues
          ),
        ])
          .then((res) => {
            showSuccessMessage(formValues.firstName || "");
            form.reset();
            showStatus("Message sent — we will reply soon.", "success");
          })
          .catch((err) => {
            console.error("EmailJS error", err);
            showErrorMessage();
            showStatus("Sending failed. Please try again later.", "error");
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.classList.remove("loading");
              submitBtn.disabled = false;
              submitBtn.textContent = "Send";
            }
          });
      } else if (form.hasAttribute("data-netlify")) {
        // Netlify fallback (server-side)
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)),
        })
          .then(() => {
            showSuccessMessage(formValues.firstName || "");
            form.reset();
            showStatus("Message sent — we will reply soon.", "success");
          })
          .catch((err) => {
            console.error("Form submit error", err);
            showErrorMessage();
            showStatus("Sending failed. Please try again later.", "error");
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.classList.remove("loading");
              submitBtn.disabled = false;
              submitBtn.textContent = "Send";
            }
          });
      } else {
        // No handler configured
        console.warn("No email handler configured (EmailJS or Netlify).");
        showStatus("Sending failed. No handler configured.", "error");
        if (submitBtn) {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
        }
      }
    });

    // Focus animations
    const formInputs = form.querySelectorAll("input, textarea, select");
    formInputs.forEach((input) => {
      input.addEventListener("focus", () =>
        input.parentElement?.classList?.add("focused")
      );
      input.addEventListener("blur", () =>
        input.parentElement?.classList?.remove("focused")
      );
    });
  }

  function initPortfolioObserver() {
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    if ("IntersectionObserver" in window && portfolioItems.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
      portfolioItems.forEach((item) => observer.observe(item));
    } else {
      // Fallback: reveal all
      portfolioItems.forEach((item) => item.classList.add("visible"));
    }
  }

  // Enhanced ServicesTabManager (typo fixes)
  class ServicesTabManager {
    constructor() {
      this.currentTab = "system-development";
      this.init();
    }
    init() {
      this.bindEvents();
      this.activateTab(this.currentTab);
      this.adjustTabButtons();
    }
    bindEvents() {
      document
        .querySelectorAll(".tab-button")
        .forEach((button) =>
          button.addEventListener("click", (e) =>
            this.activateTab(e.currentTarget.dataset.tab)
          )
        );
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          this.navigateTabs(e.key === "ArrowRight" ? "next" : "prev");
        }
      });
      window.addEventListener("resize", () => this.adjustTabButtons());
    }
    activateTab(tabId) {
      document
        .querySelectorAll(".tab-button")
        .forEach((button) =>
          button.classList.toggle("active", button.dataset.tab === tabId)
        );
      document
        .querySelectorAll(".tab-content")
        .forEach((content) =>
          content.classList.toggle("active", content.id === tabId)
        );
      this.updateTheme(tabId);
      this.currentTab = tabId;
      const tabsSection = document.querySelector(".services-tabs-section");
      if (tabsSection)
        tabsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    updateTheme(tabId) {
      const section = document.querySelector(".services-tabs-section");
      if (!section) return;
      if (tabId === "penetration-testing") {
        section.classList.add("cybersecurity-theme");
        this.updateMetaTheme("dark");
      } else {
        section.classList.remove("cybersecurity-theme");
        this.updateMetaTheme("light");
      }
    }
    updateMetaTheme(theme) {
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme)
        metaTheme.setAttribute(
          "content",
          theme === "dark" ? "#0F172A" : "#38BDF8"
        );
    }
    navigateTabs(direction) {
      const tabs = Array.from(document.querySelectorAll(".tab-button"));
      const currentIndex = tabs.findIndex((tab) =>
        tab.classList.contains("active")
      );
      if (currentIndex === -1) return;
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length;
      this.activateTab(tabs[nextIndex].dataset.tab);
    }
    adjustTabButtons() {
      const tabButtons = document.querySelector(".tab-buttons");
      const buttons = document.querySelectorAll(".tab-button");
      if (!tabButtons) return;
      if (window.innerWidth < 768) {
        tabButtons.style.overflowX = "auto";
        buttons.forEach((button) => (button.style.flex = "0 0 auto"));
      } else {
        tabButtons.style.overflowX = "visible";
        buttons.forEach((button) => (button.style.flex = "1"));
      }
    }
  }

  // Initialize everything once
  document.addEventListener("DOMContentLoaded", function () {
    initMenu();

    // Tab manager instance
    const tm = new TabManager();
    window.__TAB_MANAGER_INSTANCE__ = tm;
    const nextBtn = document.getElementById("nextTab");
    const prevBtn = document.getElementById("prevTab");
    if (nextBtn) nextBtn.addEventListener("click", () => tm.nextTab());
    if (prevBtn) prevBtn.addEventListener("click", () => tm.previousTab());

    // Services tabs
    new ServicesTabManager();

    // Observers
    initPortfolioObserver();

    // Contact form
    initContactForm();
  });

  // Remove aggressive scroll reset (handled by CSS)
})();
