// Business Dashboard JavaScript - Updated with Edit functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../../index.html';
        return;
    }

    // Load user info
    const user = authUtils.getCurrentUser();
    if (user.name) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    }

    // Load saved data
    loadBusinessData();
    setupFormListeners();

    // Inject action bar
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForBusiness(),
            onExportPdf: () => exportResumePdfBusiness(),
            onExportDoc: () => exportResumeDocBusiness(),
            onExportJson: () => exportResumeJsonBusiness(),
            onGenerateShare: () => generateShareLinkBusiness(),
            onGenerateQr: () => generateQrBusiness()
        });
    }
});

// ------------------- Form Listeners -------------------
function setupFormListeners() {
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    document.getElementById('case-study-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdateCaseStudy();
    });

    document.getElementById('pitch-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdatePitch();
    });

    document.getElementById('campaign-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdateCampaign();
    });

    document.getElementById('partnership-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdatePartnership();
    });
}

// ------------------- Personal Info -------------------
function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('business-name').value,
        title: document.getElementById('business-title').value,
        company: document.getElementById('company-name').value,
        industry: document.getElementById('industry').value,
        email: document.getElementById('business-email').value,
        phone: document.getElementById('business-phone').value,
        bio: document.getElementById('business-bio').value
    };
    authUtils.saveToStorage('businessPersonalInfo', personalInfo);
    alert('Business profile saved successfully!');
}

// ------------------- Case Study -------------------
let editingCaseStudyIndex = null;

function addOrUpdateCaseStudy() {
    const caseStudy = {
        title: document.getElementById('case-title').value,
        type: document.getElementById('case-type').value,
        client: document.getElementById('client-company').value,
        duration: document.getElementById('case-duration').value,
        challenge: document.getElementById('challenge').value,
        solution: document.getElementById('solution').value,
        results: document.getElementById('results').value,
        metrics: document.getElementById('metrics').value
    };

    let caseStudies = authUtils.loadFromStorage('businessCaseStudies') || [];

    if (editingCaseStudyIndex !== null) {
        caseStudies[editingCaseStudyIndex] = caseStudy;
        editingCaseStudyIndex = null;
        alert('Case study updated successfully!');
    } else {
        caseStudies.push(caseStudy);
        alert('Case study added successfully!');
    }

    authUtils.saveToStorage('businessCaseStudies', caseStudies);
    document.getElementById('case-study-form').reset();
    generatePortfolio();
}

function editCaseStudy(index) {
    const caseStudies = authUtils.loadFromStorage('businessCaseStudies') || [];
    const cs = caseStudies[index];
    if (!cs) return;

    document.getElementById('case-title').value = cs.title;
    document.getElementById('case-type').value = cs.type;
    document.getElementById('client-company').value = cs.client;
    document.getElementById('case-duration').value = cs.duration;
    document.getElementById('challenge').value = cs.challenge;
    document.getElementById('solution').value = cs.solution;
    document.getElementById('results').value = cs.results;
    document.getElementById('metrics').value = cs.metrics;

    editingCaseStudyIndex = index;
}

// ------------------- Pitch -------------------
let editingPitchIndex = null;

function addOrUpdatePitch() {
    const pitch = {
        title: document.getElementById('pitch-title').value,
        type: document.getElementById('pitch-type').value,
        audience: document.getElementById('target-audience').value,
        date: document.getElementById('pitch-date').value,
        summary: document.getElementById('pitch-summary').value,
        deckUrl: document.getElementById('pitch-deck-url').value,
        outcome: document.getElementById('pitch-outcome').value
    };

    let pitches = authUtils.loadFromStorage('businessPitches') || [];

    if (editingPitchIndex !== null) {
        pitches[editingPitchIndex] = pitch;
        editingPitchIndex = null;
        alert('Pitch updated successfully!');
    } else {
        pitches.push(pitch);
        alert('Pitch added successfully!');
    }

    authUtils.saveToStorage('businessPitches', pitches);
    document.getElementById('pitch-form').reset();
    generatePortfolio();
}

function editPitch(index) {
    const pitches = authUtils.loadFromStorage('businessPitches') || [];
    const p = pitches[index];
    if (!p) return;

    document.getElementById('pitch-title').value = p.title;
    document.getElementById('pitch-type').value = p.type;
    document.getElementById('target-audience').value = p.audience;
    document.getElementById('pitch-date').value = p.date;
    document.getElementById('pitch-summary').value = p.summary;
    document.getElementById('pitch-deck-url').value = p.deckUrl;
    document.getElementById('pitch-outcome').value = p.outcome;

    editingPitchIndex = index;
}

// ------------------- Campaign -------------------
let editingCampaignIndex = null;

function addOrUpdateCampaign() {
    const campaign = {
        name: document.getElementById('campaign-name').value,
        type: document.getElementById('campaign-type').value,
        budget: document.getElementById('campaign-budget').value,
        duration: document.getElementById('campaign-duration').value,
        objectives: document.getElementById('campaign-objectives').value,
        results: document.getElementById('campaign-results').value,
        analytics: document.getElementById('campaign-analytics').value
    };

    let campaigns = authUtils.loadFromStorage('businessCampaigns') || [];

    if (editingCampaignIndex !== null) {
        campaigns[editingCampaignIndex] = campaign;
        editingCampaignIndex = null;
        alert('Campaign updated successfully!');
    } else {
        campaigns.push(campaign);
        alert('Campaign added successfully!');
    }

    authUtils.saveToStorage('businessCampaigns', campaigns);
    document.getElementById('campaign-form').reset();
    generatePortfolio();
}

function editCampaign(index) {
    const campaigns = authUtils.loadFromStorage('businessCampaigns') || [];
    const c = campaigns[index];
    if (!c) return;

    document.getElementById('campaign-name').value = c.name;
    document.getElementById('campaign-type').value = c.type;
    document.getElementById('campaign-budget').value = c.budget;
    document.getElementById('campaign-duration').value = c.duration;
    document.getElementById('campaign-objectives').value = c.objectives;
    document.getElementById('campaign-results').value = c.results;
    document.getElementById('campaign-analytics').value = c.analytics;

    editingCampaignIndex = index;
}

// ------------------- Partnership -------------------
let editingPartnershipIndex = null;

function addOrUpdatePartnership() {
    const partnership = {
        partner: document.getElementById('partner-name').value,
        type: document.getElementById('partnership-type').value,
        startDate: document.getElementById('partnership-start').value,
        value: document.getElementById('partnership-value').value,
        description: document.getElementById('partnership-description').value
    };

    let partnerships = authUtils.loadFromStorage('businessPartnerships') || [];

    if (editingPartnershipIndex !== null) {
        partnerships[editingPartnershipIndex] = partnership;
        editingPartnershipIndex = null;
        alert('Partnership updated successfully!');
    } else {
        partnerships.push(partnership);
        alert('Partnership added successfully!');
    }

    authUtils.saveToStorage('businessPartnerships', partnerships);
    document.getElementById('partnership-form').reset();
    generatePortfolio();
}

function editPartnership(index) {
    const partnerships = authUtils.loadFromStorage('businessPartnerships') || [];
    const p = partnerships[index];
    if (!p) return;

    document.getElementById('partner-name').value = p.partner;
    document.getElementById('partnership-type').value = p.type;
    document.getElementById('partnership-start').value = p.startDate;
    document.getElementById('partnership-value').value = p.value;
    document.getElementById('partnership-description').value = p.description;

    editingPartnershipIndex = index;
}

// ------------------- Load Data -------------------
function loadBusinessData() {
    const personalInfo = authUtils.loadFromStorage('businessPersonalInfo');
    if (personalInfo) {
        document.getElementById('business-name').value = personalInfo.name || '';
        document.getElementById('business-title').value = personalInfo.title || '';
        document.getElementById('company-name').value = personalInfo.company || '';
        document.getElementById('industry').value = personalInfo.industry || '';
        document.getElementById('business-email').value = personalInfo.email || '';
        document.getElementById('business-phone').value = personalInfo.phone || '';
        document.getElementById('business-bio').value = personalInfo.bio || '';
    }
}

// ------------------- Portfolio Preview & Download -------------------
function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('businessPersonalInfo');
    const caseStudies = authUtils.loadFromStorage('businessCaseStudies') || [];
    const pitches = authUtils.loadFromStorage('businessPitches') || [];
    const campaigns = authUtils.loadFromStorage('businessCampaigns') || [];
    const partnerships = authUtils.loadFromStorage('businessPartnerships') || [];

    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Business Title';
        document.getElementById('preview-company').textContent = personalInfo.company || 'Company Name';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your business bio will appear here...';
    }

    const csContainer = document.getElementById('preview-case-studies');
    const pitchesContainer = document.getElementById('preview-pitches');
    const campaignsContainer = document.getElementById('preview-campaigns');
    const partnershipsContainer = document.getElementById('preview-partnerships');

    if (csContainer) {
        csContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📈 Case Studies</h3>';
        (authUtils.loadFromStorage('businessCaseStudies')||[]).forEach((cs)=>{
            const d = document.createElement('div');
            d.className = 'project-card';
            d.innerHTML = `<h4>${cs.title||''}</h4><p>${cs.challenge||''}</p>`;
            csContainer.appendChild(d);
        });
        if (window.enhancements) window.enhancements.attachEditableList('#preview-case-studies', function(index){ editCaseStudy(index); });
    }
    if (pitchesContainer) {
        pitchesContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🎯 Pitches</h3>';
        (authUtils.loadFromStorage('businessPitches')||[]).forEach((p)=>{
            const d = document.createElement('div');
            d.className = 'project-card';
            d.innerHTML = `<h4>${p.title||''}</h4><p>${p.summary||''}</p>`;
            pitchesContainer.appendChild(d);
        });
        if (window.enhancements) window.enhancements.attachEditableList('#preview-pitches', function(index){ editPitch(index); });
    }
    if (campaignsContainer) {
        campaignsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📊 Campaigns</h3>';
        (authUtils.loadFromStorage('businessCampaigns')||[]).forEach((c)=>{
            const d = document.createElement('div');
            d.className = 'project-card';
            d.innerHTML = `<h4>${c.name||''}</h4><p>${c.results||''}</p>`;
            campaignsContainer.appendChild(d);
        });
        if (window.enhancements) window.enhancements.attachEditableList('#preview-campaigns', function(index){ editCampaign(index); });
    }
    if (partnershipsContainer) {
        partnershipsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🤝 Partnerships</h3>';
        (authUtils.loadFromStorage('businessPartnerships')||[]).forEach((p)=>{
            const d = document.createElement('div');
            d.className = 'project-card';
            d.innerHTML = `<h4>${p.partner||''}</h4><p>${p.description||''}</p>`;
            partnershipsContainer.appendChild(d);
        });
        if (window.enhancements) window.enhancements.attachEditableList('#preview-partnerships', function(index){ editPartnership(index); });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'business-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
}

// -------------- Auto Resume (Business) --------------
function buildResumeDataBusiness() {
    return {
        personalInfo: authUtils.loadFromStorage('businessPersonalInfo') || {},
        caseStudies: authUtils.loadFromStorage('businessCaseStudies') || [],
        pitches: authUtils.loadFromStorage('businessPitches') || [],
        campaigns: authUtils.loadFromStorage('businessCampaigns') || [],
        partnerships: authUtils.loadFromStorage('businessPartnerships') || [],
        userEmail: authUtils.getCurrentUser().email || '',
        generatedAt: new Date().toISOString()
    };
}

function generateResumeForBusiness() {
    const data = buildResumeDataBusiness();
    const template = document.getElementById('resume-template-select')?.value || 'minimal';
    const p = data.personalInfo;
    let html = '';
    if (template === 'creative') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')} — ${p.company||''}</div>
            <div style="color:#777;">${data.userEmail}</div>
            <p style="margin-top:8px;">${p.bio||''}</p>
            <h3>Highlights</h3>
            ${data.caseStudies.slice(0,3).map(cs=>`<div><strong>${cs.title||''}</strong><div style="color:#555;">${cs.results||cs.challenge||''}</div></div>`).join('')}
        </div>`;
    } else if (template === 'modern') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;">
            <h2 style="margin:0 0 6px 0;">${(p.name||'')}</h2>
            <div style="color:#555;">${(p.title||'')} | ${p.company||''} | ${data.userEmail}</div>
            <p>${p.bio||''}</p>
            <h3>Case Studies</h3>
            ${data.caseStudies.map(cs=>`<div><strong>${cs.title||''}</strong> — ${cs.type||''}<div style="color:#555;">${cs.challenge||''}</div></div>`).join('')}
        </div>`;
    } else if (template === 'ats') {
        html = `
        <div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div>${(p.title||'')} | ${p.company||''} | ${data.userEmail}</div>
            <p>${p.bio||''}</p>
            <h3>Experience</h3>
            ${data.campaigns.map(c=>`<div><strong>${c.name||''}</strong> — ${c.type||''}</div>`).join('')}
            <h3>Partnerships</h3>
            ${data.partnerships.map(pp=>`<div>${pp.partner||''} — ${pp.type||''}</div>`).join('')}
        </div>`;
    } else {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')} — ${p.company||''}</div>
            <p>${p.bio||''}</p>
            <h3>Case Studies</h3>
            ${data.caseStudies.slice(0,3).map(cs=>`<div><strong>${cs.title||''}</strong><div style="color:#555;">${cs.results||''}</div></div>`).join('')}
        </div>`;
    }
    let preview = document.getElementById('resume-preview');
    if (!preview) {
        const portfolio = document.getElementById('portfolio-preview');
        if (portfolio) {
            const div = document.createElement('div');
            div.id = 'resume-preview';
            div.className = 'portfolio-preview';
            portfolio.insertAdjacentElement('afterend', div);
            preview = div;
        }
    }
    if (preview) preview.innerHTML = html;
}

function exportResumePdfBusiness() {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    html2pdf().set({ filename: 'business_resume.pdf', margin: 0.5, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit:'in', format:'letter', orientation:'portrait' } }).from(el).save();
}
function exportResumeDocBusiness() {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    if (window.enhancements) window.enhancements.exportDocFromElement(el, 'business_resume.doc');
}
function exportResumeJsonBusiness() {
    const data = buildResumeDataBusiness();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'business_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function generateShareLinkBusiness() {
    const slug = document.getElementById('shareable-slug')?.value || '';
    const url = window.enhancements ? window.enhancements.buildShareLink('business', slug) : window.location.href;
    navigator.clipboard?.writeText(url).catch(()=>{});
    alert('Shareable link generated and copied to clipboard:\n' + url);
}
function generateQrBusiness() {
    const slug = document.getElementById('shareable-slug')?.value || '';
    const url = window.enhancements ? window.enhancements.buildShareLink('business', slug) : window.location.href;
    const img = document.getElementById('share-qr-img');
    if (window.enhancements) window.enhancements.setQrImage(img, url);
}
