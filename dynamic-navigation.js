/**
 * Dynamic Navigation System
 * ESG Champions Platform
 * 
 * Handles role-based navigation and menu state
 */

class DynamicNavigation {
    constructor() {
        this.auth = null;
        this.initialized = false;
    }

    /**
     * Initialize navigation
     */
    async init() {
        if (this.initialized) return;
        
        // Wait for auth to be ready
        this.auth = window.championAuth;
        
        // Initial render
        await this.updateNavigation();
        
        // Listen for auth changes
        this.auth.addAuthListener((event, session) => {
            this.updateNavigation();
        });

        // Set up mobile menu
        this.setupMobileMenu();
        
        // Set up header scroll effect
        this.setupHeaderScroll();
        
        this.initialized = true;
    }

    /**
     * Update navigation based on auth state
     */
    async updateNavigation() {
        const isAuthenticated = this.auth && this.auth.isAuthenticated();
        const isAdmin = isAuthenticated ? await this.auth.isAdmin() : false;
        const champion = isAuthenticated ? this.auth.getChampion() : null;

        // Update desktop nav
        this.updateDesktopNav(isAuthenticated, isAdmin, champion);
        
        // Update mobile nav
        this.updateMobileNav(isAuthenticated, isAdmin, champion);
        
        // Update nav actions (login/register buttons)
        this.updateNavActions(isAuthenticated, champion);
    }

    /**
     * Update desktop navigation menu
     */
    updateDesktopNav(isAuthenticated, isAdmin, champion) {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        let menuHTML = '';

        // Public links - always visible
        menuHTML += `<li><a href="/" class="nav-link ${this.isActive('/')}" >Home</a></li>`;
        menuHTML += `<li><a href="/about.html" class="nav-link ${this.isActive('/about.html')}">About</a></li>`;
        
        if (isAuthenticated) {
            // Authenticated user links
            menuHTML += `<li><a href="/champion-dashboard.html" class="nav-link ${this.isActive('/champion-dashboard.html')}">Dashboard</a></li>`;
            menuHTML += `<li><a href="/champion-panels.html" class="nav-link ${this.isActive('/champion-panels.html')}">Panels</a></li>`;
            menuHTML += `<li><a href="/ranking.html" class="nav-link ${this.isActive('/ranking.html')}">Rankings</a></li>`;
            
            // Admin link
            if (isAdmin) {
                menuHTML += `<li><a href="/admin-review.html" class="nav-link ${this.isActive('/admin-review.html')}">Admin</a></li>`;
            }
        } else {
            // Public links for non-authenticated users
            menuHTML += `<li><a href="/faq.html" class="nav-link ${this.isActive('/faq.html')}">FAQ</a></li>`;
        }

        navMenu.innerHTML = menuHTML;
    }

    /**
     * Update mobile navigation menu
     */
    updateMobileNav(isAuthenticated, isAdmin, champion) {
        const mobileNavMenu = document.querySelector('.mobile-nav-menu');
        if (!mobileNavMenu) return;

        let menuHTML = '';

        // Public links
        menuHTML += `<li><a href="/" class="mobile-nav-link">Home</a></li>`;
        menuHTML += `<li><a href="/about.html" class="mobile-nav-link">About</a></li>`;
        
        if (isAuthenticated) {
            menuHTML += `<li><a href="/champion-dashboard.html" class="mobile-nav-link">Dashboard</a></li>`;
            menuHTML += `<li><a href="/champion-panels.html" class="mobile-nav-link">Panels</a></li>`;
            menuHTML += `<li><a href="/ranking.html" class="mobile-nav-link">Rankings</a></li>`;
            menuHTML += `<li><a href="/champion-profile.html" class="mobile-nav-link">Profile</a></li>`;
            
            if (isAdmin) {
                menuHTML += `<li><a href="/admin-review.html" class="mobile-nav-link">Admin Panel</a></li>`;
            }
            
            menuHTML += `<li><a href="#" class="mobile-nav-link" onclick="window.championAuth.logout().then(() => window.location.href = '/')">Logout</a></li>`;
        } else {
            menuHTML += `<li><a href="/faq.html" class="mobile-nav-link">FAQ</a></li>`;
            menuHTML += `<li><a href="/champion-login.html" class="mobile-nav-link">Login</a></li>`;
            menuHTML += `<li><a href="/champion-register.html" class="mobile-nav-link">Register</a></li>`;
        }

        mobileNavMenu.innerHTML = menuHTML;
    }

    /**
     * Update navigation action buttons
     */
    updateNavActions(isAuthenticated, champion) {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        if (isAuthenticated && champion) {
            navActions.innerHTML = `
                <div class="nav-notifications">
                    <button class="btn btn-icon btn-ghost" id="notifications-btn" title="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span class="notification-badge hidden" id="notification-count">0</span>
                    </button>
                </div>
                <div class="nav-user-menu">
                    <button class="user-menu-trigger" id="user-menu-btn">
                        <div class="avatar">
                            ${champion.avatar_url 
                                ? `<img src="${champion.avatar_url}" alt="${champion.full_name}">`
                                : this.getInitials(champion.full_name || champion.email)
                            }
                        </div>
                    </button>
                    <div class="user-dropdown hidden" id="user-dropdown">
                        <div class="user-dropdown-header">
                            <strong>${champion.full_name || 'Champion'}</strong>
                            <span class="text-muted">${champion.email}</span>
                        </div>
                        <div class="user-dropdown-divider"></div>
                        <a href="/champion-profile.html" class="user-dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Profile Settings
                        </a>
                        <a href="/champion-dashboard.html" class="user-dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            Dashboard
                        </a>
                        <div class="user-dropdown-divider"></div>
                        <a href="#" class="user-dropdown-item text-error" onclick="event.preventDefault(); window.championAuth.logout().then(() => window.location.href = '/')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </a>
                    </div>
                </div>
            `;

            // Set up user dropdown
            this.setupUserDropdown();
            
            // Load notification count
            this.loadNotificationCount();
        } else {
            navActions.innerHTML = `
                <a href="/champion-login.html" class="btn btn-ghost">Login</a>
                <a href="/champion-register.html" class="btn btn-primary">Get Started</a>
            `;
        }
    }

    /**
     * Set up user dropdown menu
     */
    setupUserDropdown() {
        const btn = document.getElementById('user-menu-btn');
        const dropdown = document.getElementById('user-dropdown');
        
        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });
    }

    /**
     * Load notification count
     */
    async loadNotificationCount() {
        try {
            const count = await window.championDB.getUnreadCount();
            const badge = document.getElementById('notification-count');
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Error loading notification count:', error);
        }
    }

    /**
     * Set up mobile menu toggle
     */
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        const close = document.querySelector('.mobile-menu-close');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (close && menu) {
            close.addEventListener('click', () => {
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu) {
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /**
     * Set up header scroll effect
     */
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    /**
     * Check if current path is active
     */
    isActive(path) {
        const currentPath = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            return (currentPath === '/' || currentPath === '/index.html') ? 'active' : '';
        }
        return currentPath === path ? 'active' : '';
    }

    /**
     * Get initials from name
     */
    getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
}

// Add styles for dynamic elements
const dynamicNavStyles = document.createElement('style');
dynamicNavStyles.textContent = `
    .nav-notifications {
        position: relative;
    }
    
    .notification-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--error);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 5px;
        border-radius: var(--radius-full);
        min-width: 18px;
        text-align: center;
    }
    
    .nav-user-menu {
        position: relative;
    }
    
    .user-menu-trigger {
        background: none;
        border: 2px solid var(--gray-200);
        border-radius: var(--radius-full);
        padding: 2px;
        cursor: pointer;
        transition: all var(--transition);
    }
    
    .user-menu-trigger:hover {
        border-color: var(--primary-400);
    }
    
    .user-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        min-width: 220px;
        z-index: var(--z-dropdown);
        overflow: hidden;
    }
    
    .user-dropdown-header {
        padding: var(--space-4);
        border-bottom: 1px solid var(--gray-100);
    }
    
    .user-dropdown-header strong {
        display: block;
        color: var(--gray-900);
    }
    
    .user-dropdown-header .text-muted {
        font-size: var(--text-sm);
        color: var(--gray-500);
    }
    
    .user-dropdown-divider {
        height: 1px;
        background: var(--gray-100);
    }
    
    .user-dropdown-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        color: var(--gray-700);
        transition: all var(--transition);
    }
    
    .user-dropdown-item:hover {
        background: var(--gray-50);
        color: var(--gray-900);
    }
    
    .user-dropdown-item.text-error {
        color: var(--error);
    }
    
    .user-dropdown-item.text-error:hover {
        background: var(--error-bg);
    }
`;
document.head.appendChild(dynamicNavStyles);

// Create and export singleton instance
window.DynamicNavigation = DynamicNavigation;
window.dynamicNav = new DynamicNavigation();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for auth to initialize
    setTimeout(() => {
        window.dynamicNav.init();
    }, 100);
});

