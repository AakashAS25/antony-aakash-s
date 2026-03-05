// Load section HTML files into the page
async function loadSections() {
    const sections = [
        { id: 'section-profile', file: 'sections/profile.html' },
        { id: 'section-about', file: 'sections/about.html' },
        { id: 'section-experience', file: 'sections/experience.html' },
        { id: 'section-project', file: 'sections/project.html' },
        { id: 'section-contact', file: 'sections/contact.html' }
    ];

    await Promise.all(sections.map(async (section) => {
        const container = document.getElementById(section.id);
        if (container) {
            const response = await fetch(section.file);
            const html = await response.text();
            container.innerHTML = html;
        }
    }));
}

function toggleMenu(){
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    menu.classList.toggle('open');
    icon.classList.toggle('open');
}

// CSS Scroll-Snap Carousel functionality
function initCarousel() {
    const carouselCards = document.getElementById('carouselCards');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (!carouselCards || !scrollLeftBtn || !scrollRightBtn) return;

    const scrollAmount = () => {
        const card = carouselCards.querySelector('.carousel-card');
        return card ? card.offsetWidth + 24 : 400; // card width + gap
    };

    scrollLeftBtn.addEventListener('click', () => {
        carouselCards.scrollBy({
            left: -scrollAmount(),
            behavior: 'smooth'
        });
    });

    scrollRightBtn.addEventListener('click', () => {
        carouselCards.scrollBy({
            left: scrollAmount(),
            behavior: 'smooth'
        });
    });

    // Optional: Update button states based on scroll position
    const updateButtonStates = () => {
        const scrollLeft = carouselCards.scrollLeft;
        const maxScroll = carouselCards.scrollWidth - carouselCards.clientWidth;

        scrollLeftBtn.style.opacity = scrollLeft <= 0 ? '0.4' : '1';
        scrollLeftBtn.style.cursor = scrollLeft <= 0 ? 'not-allowed' : 'pointer';
        
        scrollRightBtn.style.opacity = scrollLeft >= maxScroll - 5 ? '0.4' : '1';
        scrollRightBtn.style.cursor = scrollLeft >= maxScroll - 5 ? 'not-allowed' : 'pointer';
    };

    carouselCards.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
    updateButtonStates();
}

// Initialize touch/swipe functionality when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load all sections from separate files first
    await loadSections();

    // Scroll to hash target if present (for #anchor links)
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView();
    }

    // Initialize CSS scroll-snap carousel
    initCarousel();

    // Chat widget toggle
    const chatToggle = document.getElementById('chat-toggle');
    const chatPopup = document.getElementById('chat-popup');
    const chatClose = document.getElementById('chat-close');

    if (chatToggle && chatPopup) {
        chatToggle.addEventListener('click', () => {
            const isOpen = chatPopup.classList.toggle('open');
            chatToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                const iframe = document.getElementById('chat-iframe');
                if (iframe && !iframe.src) {
                    const url = iframe.getAttribute('data-src');
                    if (url) iframe.src = url;
                }
            }
        });
    }

    if (chatClose && chatPopup) {
        chatClose.addEventListener('click', () => {
            chatPopup.classList.remove('open');
            chatToggle && chatToggle.setAttribute('aria-expanded', 'false');
        });
    }

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatPopup && chatPopup.classList.contains('open')) {
            chatPopup.classList.remove('open');
            chatToggle && chatToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close when clicking outside the popup (but not when interacting with iframe)
    document.addEventListener('click', (e) => {
        if (!chatPopup || !chatPopup.classList.contains('open')) return;
        const withinWidget = e.target.closest('#chat-widget');
        if (!withinWidget) {
            chatPopup.classList.remove('open');
            chatToggle && chatToggle.setAttribute('aria-expanded', 'false');
        }
    });
});