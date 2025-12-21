/**
 * Champion Panels JavaScript
 * ESG Champions Platform
 */

class ChampionPanels {
    constructor() {
        this.panels = [];
        this.currentFilter = 'all';
        this.currentPanelId = null;
        this.currentPanelName = '';
        this.indicators = [];
        this.selectedIndicators = new Set();
    }

    async init() {
        // Wait for services to be ready
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Load panels
        await this.loadPanels();
        
        // Setup filters
        this.setupFilters();
        
        // Setup modal
        this.setupModal();
        
        // Check URL params for category filter
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            this.filterPanels(category);
            this.updateFilterButtons(category);
        }
    }

    async loadPanels() {
        try {
            const panels = await window.championDB.getPanelsWithCounts();
            this.panels = panels;
            
            // Group by category
            const environmental = panels.filter(p => p.category === 'environmental');
            const social = panels.filter(p => p.category === 'social');
            const governance = panels.filter(p => p.category === 'governance');
            
            // Render each category
            this.renderPanelCategory('environmental-panels', environmental);
            this.renderPanelCategory('social-panels', social);
            this.renderPanelCategory('governance-panels', governance);
            
            // Show content
            document.getElementById('loading-state').classList.add('hidden');
            document.getElementById('panels-grid').classList.remove('hidden');
            
        } catch (error) {
            console.error('Error loading panels:', error);
            this.showError('Failed to load panels. Please refresh the page.');
        }
    }

    renderPanelCategory(containerId, panels) {
        const container = document.getElementById(containerId);
        
        if (!panels || panels.length === 0) {
            container.innerHTML = '<p class="text-secondary">No panels available in this category.</p>';
            return;
        }

        container.innerHTML = panels.map(panel => {
            // Get panel icon based on category/name
            const panelIcon = this.getPanelIcon(panel.name, panel.category);
            
            // Get impact level (default based on category)
            const impactLevel = panel.impact_level || (panel.category === 'environmental' ? 'high' : panel.category === 'social' ? 'medium' : 'medium');
            const impactText = impactLevel === 'high' ? 'Impact High' : impactLevel === 'low' ? 'Impact Low' : 'Impact Medium';
            
            // Get estimated time
            const estimatedTime = panel.estimated_time || '10-15 min';
            
            // Get status
            const status = panel.user_status || 'not_started';
            const statusText = status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started';
            const statusClass = status === 'completed' ? 'badge-completed' : status === 'in_progress' ? 'badge-in-progress' : 'badge-not-started';
            
            // Progress percentage
            const progress = panel.user_progress || 0;
            
            return `
                <div class="panel-card ${panel.category}" data-panel-id="${panel.id}" data-panel-name="${panel.name}" style="cursor: pointer;">
                    <div class="panel-card-header">
                        <span class="panel-icon">${panelIcon}</span>
                        <h3 class="panel-title">${panel.name}</h3>
                    </div>
                    
                    <div style="margin-bottom: var(--space-3);">
                        <span class="badge badge-impact-${impactLevel}">${impactText}</span>
                    </div>
                    
                    <div class="panel-time-row">
                        <span>Estimated time</span>
                        <span>${estimatedTime}</span>
                    </div>
                    
                    <div class="panel-progress-bar">
                        <div class="panel-progress-fill" style="width: ${progress}%;"></div>
                    </div>
                    
                    <div style="margin-bottom: var(--space-4);">
                        <span class="badge-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <button class="btn btn-primary w-full">Select Indicators</button>
                </div>
            `;
        }).join('');

        // Add click handlers to panel cards
        container.querySelectorAll('.panel-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const panelId = card.dataset.panelId;
                const panelName = card.dataset.panelName;
                this.openIndicatorModal(panelId, panelName);
            });
        });
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterPanels(filter);
                this.updateFilterButtons(filter);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('indicator-modal');
        const closeBtn = document.getElementById('modal-close-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const submitBtn = document.getElementById('modal-submit-btn');
        const selectAllCheckbox = document.getElementById('select-all-indicators');
        const searchInput = document.getElementById('indicator-search');

        // Close modal handlers
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Select all toggle
        selectAllCheckbox.addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterIndicators(e.target.value);
        });

        // Submit button
        submitBtn.addEventListener('click', () => {
            this.submitSelectedIndicators();
        });
    }

    async openIndicatorModal(panelId, panelName) {
        this.currentPanelId = panelId;
        this.currentPanelName = panelName;
        this.selectedIndicators.clear();
        
        const modal = document.getElementById('indicator-modal');
        const panelNameEl = document.getElementById('modal-panel-name');
        const indicatorsList = document.getElementById('indicators-list');
        const submitBtn = document.getElementById('modal-submit-btn');
        const selectAllCheckbox = document.getElementById('select-all-indicators');
        const searchInput = document.getElementById('indicator-search');

        // Reset state
        panelNameEl.textContent = panelName;
        searchInput.value = '';
        selectAllCheckbox.checked = false;
        submitBtn.disabled = true;
        
        // Show loading state
        indicatorsList.innerHTML = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <p>Loading indicators...</p>
            </div>
        `;

        // Show modal with animation
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Fetch ALL indicators (system-wide, not panel-specific)
        try {
            this.indicators = await window.championDB.getAllIndicators();
            this.renderIndicators(this.indicators);
        } catch (error) {
            console.error('Error loading indicators:', error);
            indicatorsList.innerHTML = `
                <div class="modal-error">
                    <p>Failed to load indicators. Please try again.</p>
                    <button class="btn btn-secondary btn-sm" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    renderIndicators(indicators) {
        const indicatorsList = document.getElementById('indicators-list');
        
        if (!indicators || indicators.length === 0) {
            indicatorsList.innerHTML = `
                <div class="modal-empty">
                    <p>No indicators available for this panel.</p>
                </div>
            `;
            this.updateSelectedCount();
            return;
        }

        indicatorsList.innerHTML = indicators.map(indicator => {
            // Generate importance badge
            const importance = indicator.importance_level || 'medium';
            const importanceText = importance === 'high' ? 'High Importance' : importance === 'low' ? 'Low Importance' : 'Medium Importance';
            
            // Generate difficulty badge
            const difficulty = indicator.difficulty || 'moderate';
            const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            
            // Generate time estimate
            const timeEstimate = indicator.time_estimate || '3-5 min';
            
            // Generate GRI standard
            const griStandard = indicator.gri_standard || indicator.data_source || '';
            
            // Generate impact stars
            const impactRating = indicator.impact_rating || 4;
            const stars = '★'.repeat(impactRating) + '☆'.repeat(5 - impactRating);
            
            return `
                <label class="indicator-item" data-indicator-id="${indicator.id}">
                    <input 
                        type="checkbox" 
                        class="indicator-checkbox" 
                        value="${indicator.id}"
                        data-name="${indicator.name}"
                    >
                    <div class="indicator-content">
                        <h4 class="indicator-name">${indicator.name}</h4>
                        <p class="indicator-description">${indicator.description || 'No description available'}</p>
                        
                        <div class="indicator-badges">
                            <span class="badge-importance-${importance}">${importanceText}</span>
                            <span class="badge-difficulty">${difficultyText}</span>
                            <span class="badge-time">${timeEstimate}</span>
                            ${griStandard ? `<span class="badge-gri">${griStandard}</span>` : ''}
                        </div>
                        
                        <div class="impact-rating">
                            <span>Impact:</span>
                            <span class="impact-stars">${stars}</span>
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        // Add change handlers
        indicatorsList.querySelectorAll('.indicator-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedIndicators.add(e.target.value);
                } else {
                    this.selectedIndicators.delete(e.target.value);
                }
                this.updateSelectedCount();
                this.updateSelectAllState();
            });
        });

        this.updateSelectedCount();
    }

    filterIndicators(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const items = document.querySelectorAll('.indicator-item');
        
        items.forEach(item => {
            const name = item.querySelector('.indicator-name').textContent.toLowerCase();
            const description = item.querySelector('.indicator-description').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.indicator-checkbox');
        
        checkboxes.forEach(checkbox => {
            const item = checkbox.closest('.indicator-item');
            // Only toggle visible items
            if (item.style.display !== 'none') {
                checkbox.checked = checked;
                if (checked) {
                    this.selectedIndicators.add(checkbox.value);
                } else {
                    this.selectedIndicators.delete(checkbox.value);
                }
            }
        });
        
        this.updateSelectedCount();
    }

    updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.indicator-checkbox');
        const visibleCheckboxes = Array.from(checkboxes).filter(cb => 
            cb.closest('.indicator-item').style.display !== 'none'
        );
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(cb => cb.checked);
        
        document.getElementById('select-all-indicators').checked = allChecked;
    }

    updateSelectedCount() {
        const total = this.indicators.length;
        const selected = this.selectedIndicators.size;
        const countEl = document.getElementById('selected-count');
        const submitBtn = document.getElementById('modal-submit-btn');
        
        countEl.textContent = `${selected} of ${total} selected`;
        submitBtn.disabled = selected === 0;
        
        if (selected > 0) {
            submitBtn.textContent = `Review ${selected} Indicator${selected > 1 ? 's' : ''}`;
        } else {
            submitBtn.textContent = 'Review Selected Indicators';
        }
    }

    closeModal() {
        const modal = document.getElementById('indicator-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset state
        this.currentPanelId = null;
        this.currentPanelName = '';
        this.indicators = [];
        this.selectedIndicators.clear();
    }

    submitSelectedIndicators() {
        if (this.selectedIndicators.size === 0) {
            alert('Please select at least one indicator to review.');
            return;
        }

        // Store selected indicators in sessionStorage
        const selectionData = {
            panelId: this.currentPanelId,
            panelName: this.currentPanelName,
            indicatorIds: Array.from(this.selectedIndicators),
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('selectedIndicators', JSON.stringify(selectionData));
        
        // Navigate to review page
        window.location.href = `/champion-indicators.html?panel=${this.currentPanelId}&selected=${Array.from(this.selectedIndicators).join(',')}`;
    }

    filterPanels(filter) {
        this.currentFilter = filter;
        
        const sections = {
            environmental: document.getElementById('environmental-section'),
            social: document.getElementById('social-section'),
            governance: document.getElementById('governance-section')
        };

        if (filter === 'all') {
            Object.values(sections).forEach(section => {
                section.classList.remove('hidden');
            });
        } else {
            Object.entries(sections).forEach(([category, section]) => {
                if (category === filter) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        }

        // Update URL without reload
        const url = new URL(window.location);
        if (filter === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', filter);
        }
        window.history.replaceState({}, '', url);
    }

    updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === activeFilter) {
                btn.classList.add('active');
                btn.classList.remove('btn-ghost');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('active');
                btn.classList.add('btn-ghost');
                btn.classList.remove('btn-primary');
            }
        });
    }

    showError(message) {
        const loadingState = document.getElementById('loading-state');
        loadingState.innerHTML = `
            <div class="text-center">
                <div class="alert alert-error">${message}</div>
                <button class="btn btn-primary mt-4" onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    getPanelIcon(name, category) {
        const nameLower = name.toLowerCase();
        
        // Environmental icons
        if (nameLower.includes('climate') || nameLower.includes('ghg') || nameLower.includes('emission')) return '🌍';
        if (nameLower.includes('energy')) return '⚡';
        if (nameLower.includes('water')) return '💧';
        if (nameLower.includes('waste') || nameLower.includes('circular')) return '♻️';
        if (nameLower.includes('biodiversity') || nameLower.includes('land')) return '🌳';
        
        // Social icons
        if (nameLower.includes('human rights')) return '⚖️';
        if (nameLower.includes('labor') || nameLower.includes('workforce')) return '👥';
        if (nameLower.includes('health') || nameLower.includes('safety')) return '🏥';
        if (nameLower.includes('diversity') || nameLower.includes('inclusion')) return '🌈';
        if (nameLower.includes('community')) return '🏘️';
        
        // Governance icons
        if (nameLower.includes('governance') || nameLower.includes('corporate')) return '🏛️';
        if (nameLower.includes('ethics') || nameLower.includes('compliance')) return '📜';
        if (nameLower.includes('risk')) return '⚠️';
        if (nameLower.includes('transparency') || nameLower.includes('reporting')) return '📊';
        
        // Default by category
        if (category === 'environmental') return '🌿';
        if (category === 'social') return '👥';
        if (category === 'governance') return '🏛️';
        
        return '📋';
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const panels = new ChampionPanels();
    panels.init();
});
