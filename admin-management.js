/**
 * Admin Management
 * ESG Champions Platform
 * 
 * Panel and Indicator CRUD operations for admin
 */

class AdminManagement {
    constructor() {
        this.modalElement = null;
    }

    /**
     * Create edit panel modal
     */
    async editPanel(panelId = null) {
        const isNew = !panelId;
        let panel = null;
        
        if (panelId) {
            try {
                const panels = await window.adminService.getAllPanels();
                panel = panels.find(p => p.id === panelId);
            } catch (error) {
                console.error('Error loading panel:', error);
                window.showToast('Failed to load panel', 'error');
                return;
            }
        }

        this.showModal({
            title: isNew ? 'Create New Panel' : 'Edit Panel',
            content: `
                <form id="panel-form">
                    <div class="form-group">
                        <label class="form-label" for="panel-name">Panel Name</label>
                        <input type="text" id="panel-name" class="form-input" value="${panel?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="panel-description">Description</label>
                        <textarea id="panel-description" class="form-textarea" rows="3">${panel?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="panel-category">Category</label>
                        <select id="panel-category" class="form-select" required>
                            <option value="environmental" ${panel?.category === 'environmental' ? 'selected' : ''}>Environmental</option>
                            <option value="social" ${panel?.category === 'social' ? 'selected' : ''}>Social</option>
                            <option value="governance" ${panel?.category === 'governance' ? 'selected' : ''}>Governance</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="panel-order">Order Index</label>
                        <input type="number" id="panel-order" class="form-input" value="${panel?.order_index || 0}">
                    </div>
                    <div class="form-group">
                        <label class="form-checkbox">
                            <input type="checkbox" id="panel-active" ${panel?.is_active !== false ? 'checked' : ''}>
                            <span>Active</span>
                        </label>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-ghost" onclick="window.adminManagement.closeModal()">Cancel</button>
                ${panelId ? `<button class="btn" style="background: var(--error-bg); color: var(--error);" onclick="window.adminManagement.deletePanel('${panelId}')">Delete</button>` : ''}
                <button class="btn btn-primary" onclick="window.adminManagement.savePanel('${panelId || ''}')">
                    ${isNew ? 'Create Panel' : 'Save Changes'}
                </button>
            `
        });
    }

    /**
     * Save panel
     */
    async savePanel(panelId) {
        const data = {
            name: document.getElementById('panel-name').value,
            description: document.getElementById('panel-description').value,
            category: document.getElementById('panel-category').value,
            order_index: parseInt(document.getElementById('panel-order').value) || 0,
            is_active: document.getElementById('panel-active').checked
        };

        try {
            if (panelId) {
                await window.adminService.updatePanel(panelId, data);
                window.showToast('Panel updated successfully', 'success');
            } else {
                await window.adminService.createPanel(data);
                window.showToast('Panel created successfully', 'success');
            }
            
            this.closeModal();
            
            // Refresh list if on admin page
            if (typeof adminPage !== 'undefined') {
                await adminPage.loadPanels();
            }
        } catch (error) {
            console.error('Error saving panel:', error);
            window.showToast('Failed to save panel', 'error');
        }
    }

    /**
     * Delete panel
     */
    async deletePanel(panelId) {
        if (!confirm('Are you sure you want to deactivate this panel? This will hide it from users.')) {
            return;
        }

        try {
            await window.adminService.deletePanel(panelId);
            window.showToast('Panel deactivated', 'info');
            this.closeModal();
            
            if (typeof adminPage !== 'undefined') {
                await adminPage.loadPanels();
            }
        } catch (error) {
            console.error('Error deleting panel:', error);
            window.showToast('Failed to delete panel', 'error');
        }
    }

    /**
     * Create edit indicator modal
     */
    async editIndicator(indicatorId = null) {
        const isNew = !indicatorId;
        let indicator = null;
        let panels = [];
        
        try {
            panels = await window.adminService.getAllPanels();
            
            if (indicatorId) {
                const indicators = await window.adminService.getAllIndicators();
                indicator = indicators.find(i => i.id === indicatorId);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            window.showToast('Failed to load data', 'error');
            return;
        }

        const panelOptions = panels
            .filter(p => p.is_active)
            .map(p => `<option value="${p.id}" ${indicator?.panel_id === p.id ? 'selected' : ''}>${p.name}</option>`)
            .join('');

        this.showModal({
            title: isNew ? 'Create New Indicator' : 'Edit Indicator',
            content: `
                <form id="indicator-form">
                    <div class="form-group">
                        <label class="form-label" for="indicator-name">Indicator Name</label>
                        <input type="text" id="indicator-name" class="form-input" value="${indicator?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="indicator-panel">Panel</label>
                        <select id="indicator-panel" class="form-select" required>
                            ${panelOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="indicator-description">Description</label>
                        <textarea id="indicator-description" class="form-textarea" rows="2">${indicator?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="indicator-methodology">Methodology</label>
                        <textarea id="indicator-methodology" class="form-textarea" rows="2">${indicator?.methodology || ''}</textarea>
                    </div>
                    <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; gap: var(--space-4);">
                        <div class="form-group">
                            <label class="form-label" for="indicator-source">Data Source</label>
                            <input type="text" id="indicator-source" class="form-input" value="${indicator?.data_source || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="indicator-unit">Unit</label>
                            <input type="text" id="indicator-unit" class="form-input" value="${indicator?.unit || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="indicator-frequency">Frequency</label>
                            <input type="text" id="indicator-frequency" class="form-input" value="${indicator?.frequency || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-checkbox">
                            <input type="checkbox" id="indicator-active" ${indicator?.is_active !== false ? 'checked' : ''}>
                            <span>Active</span>
                        </label>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-ghost" onclick="window.adminManagement.closeModal()">Cancel</button>
                ${indicatorId ? `<button class="btn" style="background: var(--error-bg); color: var(--error);" onclick="window.adminManagement.deleteIndicator('${indicatorId}')">Delete</button>` : ''}
                <button class="btn btn-primary" onclick="window.adminManagement.saveIndicator('${indicatorId || ''}')">
                    ${isNew ? 'Create Indicator' : 'Save Changes'}
                </button>
            `
        });
    }

    /**
     * Save indicator
     */
    async saveIndicator(indicatorId) {
        const data = {
            name: document.getElementById('indicator-name').value,
            panel_id: document.getElementById('indicator-panel').value,
            description: document.getElementById('indicator-description').value,
            methodology: document.getElementById('indicator-methodology').value,
            data_source: document.getElementById('indicator-source').value,
            unit: document.getElementById('indicator-unit').value,
            frequency: document.getElementById('indicator-frequency').value,
            is_active: document.getElementById('indicator-active').checked
        };

        try {
            if (indicatorId) {
                await window.adminService.updateIndicator(indicatorId, data);
                window.showToast('Indicator updated successfully', 'success');
            } else {
                await window.adminService.createIndicator(data);
                window.showToast('Indicator created successfully', 'success');
            }
            
            this.closeModal();
            
            if (typeof adminPage !== 'undefined') {
                await adminPage.loadIndicators();
            }
        } catch (error) {
            console.error('Error saving indicator:', error);
            window.showToast('Failed to save indicator', 'error');
        }
    }

    /**
     * Delete indicator
     */
    async deleteIndicator(indicatorId) {
        if (!confirm('Are you sure you want to deactivate this indicator?')) {
            return;
        }

        try {
            await window.adminService.deleteIndicator(indicatorId);
            window.showToast('Indicator deactivated', 'info');
            this.closeModal();
            
            if (typeof adminPage !== 'undefined') {
                await adminPage.loadIndicators();
            }
        } catch (error) {
            console.error('Error deleting indicator:', error);
            window.showToast('Failed to delete indicator', 'error');
        }
    }

    /**
     * Show modal
     */
    showModal({ title, content, footer }) {
        // Create modal if doesn't exist
        if (!document.getElementById('admin-mgmt-modal')) {
            const modalHTML = `
                <div class="modal-backdrop" id="admin-mgmt-backdrop">
                    <div class="modal" id="admin-mgmt-modal" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title" id="admin-mgmt-title"></h3>
                            <button class="modal-close" onclick="window.adminManagement.closeModal()">&times;</button>
                        </div>
                        <div class="modal-body" id="admin-mgmt-body"></div>
                        <div class="modal-footer" id="admin-mgmt-footer"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        document.getElementById('admin-mgmt-title').textContent = title;
        document.getElementById('admin-mgmt-body').innerHTML = content;
        document.getElementById('admin-mgmt-footer').innerHTML = footer;
        document.getElementById('admin-mgmt-modal').classList.add('active');
        document.getElementById('admin-mgmt-backdrop').classList.add('active');
    }

    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('admin-mgmt-modal')?.classList.remove('active');
        document.getElementById('admin-mgmt-backdrop')?.classList.remove('active');
    }
}

// Export singleton
window.AdminManagement = AdminManagement;
window.adminManagement = new AdminManagement();

