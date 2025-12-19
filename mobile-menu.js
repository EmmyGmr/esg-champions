/**
 * Mobile Menu Handler
 * ESG Champions Platform
 */

class MobileMenu {
    constructor() {
        this.menu = null;
        this.toggle = null;
        this.close = null;
        this.isOpen = false;
    }

    init() {
        this.menu = document.querySelector('.mobile-menu');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.close = document.querySelector('.mobile-menu-close');

        if (!this.menu || !this.toggle) return;

        this.bindEvents();
    }

    bindEvents() {
        // Open menu
        this.toggle.addEventListener('click', () => this.open());

        // Close menu
        if (this.close) {
            this.close.addEventListener('click', () => this.closeMenu());
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close on link click
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close on backdrop click
        this.menu.addEventListener('click', (e) => {
            if (e.target === this.menu) {
                this.closeMenu();
            }
        });
    }

    open() {
        this.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Animate toggle to X
        this.toggle.classList.add('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;

        // Animate toggle back
        this.toggle.classList.remove('active');
    }

    toggle() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.open();
        }
    }
}

// Export and auto-initialize
window.MobileMenu = MobileMenu;
window.mobileMenu = new MobileMenu();

document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu.init();
});

