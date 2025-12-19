/**
 * Account Completion Handler
 * ESG Champions Platform
 * 
 * Handles post-registration profile completion
 */

class AccountCompletion {
    constructor() {
        this.champion = null;
        this.requiredFields = ['full_name'];
        this.optionalFields = ['company', 'job_title', 'linkedin_url', 'bio'];
    }

    async init() {
        // Wait for auth
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!window.championAuth.isAuthenticated()) {
            return;
        }

        this.champion = window.championAuth.getChampion();
        
        // Check if profile is complete
        if (!this.isProfileComplete()) {
            this.showCompletionPrompt();
        }
    }

    /**
     * Check if profile has required fields
     */
    isProfileComplete() {
        if (!this.champion) return false;
        
        for (const field of this.requiredFields) {
            if (!this.champion[field] || this.champion[field].trim() === '') {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Calculate profile completion percentage
     */
    getCompletionPercentage() {
        if (!this.champion) return 0;
        
        const allFields = [...this.requiredFields, ...this.optionalFields];
        let completed = 0;
        
        for (const field of allFields) {
            if (this.champion[field] && this.champion[field].toString().trim() !== '') {
                completed++;
            }
        }
        
        return Math.round((completed / allFields.length) * 100);
    }

    /**
     * Show completion prompt
     */
    showCompletionPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'account-completion-prompt';
        prompt.innerHTML = `
            <div class="completion-content">
                <h3>Complete Your Profile</h3>
                <p>Add your name and details to get the most out of ESG Champions.</p>
                <div class="completion-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getCompletionPercentage()}%;"></div>
                    </div>
                    <span>${this.getCompletionPercentage()}% complete</span>
                </div>
                <div class="completion-actions">
                    <a href="/champion-profile.html" class="btn btn-primary btn-sm">Complete Profile</a>
                    <button class="btn btn-ghost btn-sm" onclick="this.closest('.account-completion-prompt').remove()">Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.classList.add('fade-out');
                setTimeout(() => prompt.remove(), 300);
            }
        }, 10000);
    }
}

// Add styles
const completionStyles = document.createElement('style');
completionStyles.textContent = `
    .account-completion-prompt {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: var(--space-6);
        max-width: 350px;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    }
    
    .account-completion-prompt.fade-out {
        animation: slideDown 0.3s ease forwards;
    }
    
    .account-completion-prompt h3 {
        margin-bottom: var(--space-2);
        font-size: var(--text-lg);
    }
    
    .account-completion-prompt p {
        color: var(--gray-600);
        font-size: var(--text-sm);
        margin-bottom: var(--space-4);
    }
    
    .completion-progress {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
    }
    
    .completion-progress .progress-bar {
        flex: 1;
        height: 6px;
    }
    
    .completion-progress span {
        font-size: var(--text-xs);
        color: var(--gray-500);
        white-space: nowrap;
    }
    
    .completion-actions {
        display: flex;
        gap: var(--space-2);
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(completionStyles);

// Export and auto-initialize
window.AccountCompletion = AccountCompletion;

document.addEventListener('DOMContentLoaded', () => {
    // Only show on dashboard
    if (window.location.pathname.includes('dashboard')) {
        const completion = new AccountCompletion();
        completion.init();
    }
});

