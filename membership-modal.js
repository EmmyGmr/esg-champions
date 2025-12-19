/**
 * Membership Modal
 * ESG Champions Platform
 * 
 * Shows membership benefits and registration prompt
 */

class MembershipModal {
    constructor() {
        this.modal = null;
    }

    /**
     * Show membership modal
     */
    show() {
        if (!document.getElementById('membership-modal')) {
            this.createModal();
        }

        document.getElementById('membership-modal').classList.add('active');
        document.getElementById('membership-backdrop').classList.add('active');
    }

    /**
     * Close modal
     */
    close() {
        document.getElementById('membership-modal')?.classList.remove('active');
        document.getElementById('membership-backdrop')?.classList.remove('active');
    }

    /**
     * Create modal HTML
     */
    createModal() {
        const modalHTML = `
            <div class="modal-backdrop" id="membership-backdrop">
                <div class="modal" id="membership-modal" style="max-width: 500px;">
                    <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                        <button class="modal-close" onclick="membershipModal.close()">&times;</button>
                    </div>
                    <div class="modal-body text-center">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-100), var(--primary-200)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6);">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        
                        <h2 style="margin-bottom: var(--space-4);">Become an ESG Champion</h2>
                        <p class="text-secondary" style="margin-bottom: var(--space-6);">
                            Join our community to validate ESG indicators and earn recognition for your expertise.
                        </p>
                        
                        <div style="text-align: left; margin-bottom: var(--space-6);">
                            <div class="flex" style="gap: var(--space-3); margin-bottom: var(--space-3);">
                                <div style="width: 24px; height: 24px; background: var(--success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <strong>Submit Reviews</strong>
                                    <p class="text-secondary" style="margin: 0; font-size: var(--text-sm);">Share your expertise on ESG indicators</p>
                                </div>
                            </div>
                            <div class="flex" style="gap: var(--space-3); margin-bottom: var(--space-3);">
                                <div style="width: 24px; height: 24px; background: var(--success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <strong>Earn Credits</strong>
                                    <p class="text-secondary" style="margin: 0; font-size: var(--text-sm);">Get rewarded for quality contributions</p>
                                </div>
                            </div>
                            <div class="flex" style="gap: var(--space-3); margin-bottom: var(--space-3);">
                                <div style="width: 24px; height: 24px; background: var(--success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <strong>Climb the Leaderboard</strong>
                                    <p class="text-secondary" style="margin: 0; font-size: var(--text-sm);">Gain recognition in the community</p>
                                </div>
                            </div>
                            <div class="flex" style="gap: var(--space-3);">
                                <div style="width: 24px; height: 24px; background: var(--success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <strong>Connect with Experts</strong>
                                    <p class="text-secondary" style="margin: 0; font-size: var(--text-sm);">Join a global sustainability community</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: var(--space-3); justify-content: center;">
                            <a href="/champion-register.html" class="btn btn-primary btn-lg">
                                Get Started Free
                            </a>
                            <a href="/champion-login.html" class="btn btn-secondary btn-lg">
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Close on backdrop click
        document.getElementById('membership-backdrop').addEventListener('click', (e) => {
            if (e.target.id === 'membership-backdrop') {
                this.close();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    /**
     * Show modal for action requiring login
     */
    requireLogin(message = '') {
        if (!window.championAuth?.isAuthenticated()) {
            this.show();
            return false;
        }
        return true;
    }
}

// Export singleton
window.MembershipModal = MembershipModal;
window.membershipModal = new MembershipModal();

