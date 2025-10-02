// Shared Enhancements: Edit mode, Resume Builder, Share Links, QR, Team Linking

// Utility: DOM helper
function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

// Global state for edit indices per section
const editState = {};

// Attach edit buttons to list-like previews; expects container with child cards
function attachEditableList(containerSelector, onEdit) {
    const container = $(containerSelector);
    if (!container) return;
    const items = Array.from(container.children);
    items.forEach((el, index) => {
        if (el.querySelector('.edit-entry-btn')) return;
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.className = 'btn-edit-inline edit-entry-btn';
        btn.addEventListener('click', () => onEdit(index));
        const bar = document.createElement('div');
        bar.className = 'edit-inline-bar';
        bar.appendChild(btn);
        el.insertBefore(bar, el.firstChild);
    });
}

// Action bar injection: resume templates, exports, QR, share link
function ensureActionBar(afterSelector, options) {
    const host = $(afterSelector);
    if (!host) return null;
    if ($('#global-action-bar')) return $('#global-action-bar');

    const wrapper = document.createElement('div');
    wrapper.id = 'global-action-bar';
    wrapper.className = 'action-bar';
    wrapper.innerHTML = `
        <div class="action-left">
            <label class="action-label" for="resume-template-select">Resume Template</label>
            <select id="resume-template-select" class="action-select">
                <option value="minimal">Minimal</option>
                <option value="creative">Creative</option>
                <option value="modern">Modern</option>
                <option value="ats">ATS-Friendly</option>
            </select>
            <button id="download-resume-pdf" class="btn-secondary">Export PDF</button>
            <button id="download-resume-doc" class="btn-secondary">Export DOC</button>
            <button id="download-resume-json" class="btn-secondary">Export JSON</button>
        </div>
        <div class="action-right">
            <input id="shareable-slug" class="action-input" placeholder="username or slug"/>
            <button id="generate-share-link" class="btn-secondary">Create Link</button>
            <button id="generate-qr" class="btn-secondary">QR</button>
            <img id="share-qr-img" alt="QR" class="qr-thumb hidden"/>
        </div>
    `;
    host.insertAdjacentElement('afterend', wrapper);

    // Hook up events if callbacks provided
    if (options && typeof options.onTemplateChange === 'function') {
        $('#resume-template-select').addEventListener('change', options.onTemplateChange);
    }
    if (options && typeof options.onExportPdf === 'function') {
        $('#download-resume-pdf').addEventListener('click', options.onExportPdf);
    }
    if (options && typeof options.onExportDoc === 'function') {
        $('#download-resume-doc').addEventListener('click', options.onExportDoc);
    }
    if (options && typeof options.onExportJson === 'function') {
        $('#download-resume-json').addEventListener('click', options.onExportJson);
    }
    if (options && typeof options.onGenerateShare === 'function') {
        $('#generate-share-link').addEventListener('click', options.onGenerateShare);
    }
    if (options && typeof options.onGenerateQr === 'function') {
        $('#generate-qr').addEventListener('click', options.onGenerateQr);
    }

    return wrapper;
}

// Build a shareable link for current user and profession
function buildShareLink(profession, slug) {
    const email = localStorage.getItem('userEmail') || '';
    const base = window.location.origin + window.location.pathname.replace(/\/dashboards\/[^/]+\/.*/, '/');
    const cleanSlug = (slug || email || 'user').toLowerCase().replace(/[^a-z0-9-_]+/g,'');
    // Example: portfolio.com/tech/username
    return `${base}${profession}/${cleanSlug}.html`;
}

// Generate QR code via Google Chart API
function setQrImage(imgEl, url) {
    if (!imgEl) return;
    imgEl.src = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(url)}`;
    imgEl.classList.remove('hidden');
}

// Team Project Linking: store team metadata on project items
function addTeamMetadataToProject(project, team) {
    if (!project) return project;
    return { ...project, team: (team || []).map(m => ({
        name: m.name || '',
        role: m.role || '',
        responsibility: m.responsibility || ''
    })) };
}

// Export minimal DOC (HTML) of provided element
function exportDocFromElement(el, filename) {
    if (!el) return;
    const header = "<html><head><meta charset='utf-8'><title>Resume</title></head><body>";
    const footer = "</body></html>";
    const html = header + el.innerHTML + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Public API
window.enhancements = {
    attachEditableList,
    ensureActionBar,
    buildShareLink,
    setQrImage,
    addTeamMetadataToProject,
    exportDocFromElement
};


