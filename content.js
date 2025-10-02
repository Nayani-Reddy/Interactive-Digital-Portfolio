// Content/Writing Dashboard JavaScript

// Track editing indices
let editingWritingIndex = null;
let editingCopywritingIndex = null;
let editingSEOIndex = null;
let editingPublicationIndex = null;

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
    loadContentData();

    // Set up form event listeners
    setupFormListeners();

    // Inject action bar for resume/share/qr
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForContent(),
            onExportPdf: () => exportResumePdfContent(),
            onExportDoc: () => exportResumeDocContent(),
            onExportJson: () => exportResumeJsonContent(),
            onGenerateShare: () => generateShareLinkContent(),
            onGenerateQr: () => generateQrContent()
        });
    }
});

function setupFormListeners() {
    // Personal Info Form
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Writing Samples Form
    document.getElementById('writing-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdateWritingSample();
    });

    // Copywriting Form
    document.getElementById('copywriting-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdateCopywritingProject();
    });

    // SEO Form
    document.getElementById('seo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdateSEOProject();
    });

    // Publications Form
    document.getElementById('publications-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrUpdatePublication();
    });
}

// ------------------- Personal Info -------------------
function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('content-name').value,
        title: document.getElementById('content-title').value,
        email: document.getElementById('content-email').value,
        website: document.getElementById('content-website').value,
        bio: document.getElementById('content-bio').value
    };

    authUtils.saveToStorage('contentPersonalInfo', personalInfo);
    alert('Writer profile saved successfully!');
}

// ------------------- Writing Samples -------------------
function addOrUpdateWritingSample() {
    const writingSample = {
        title: document.getElementById('article-title').value,
        type: document.getElementById('content-type').value,
        publication: document.getElementById('publication').value,
        publishDate: document.getElementById('publish-date').value,
        wordCount: document.getElementById('word-count').value,
        readingTime: document.getElementById('reading-time').value,
        summary: document.getElementById('article-summary').value,
        url: document.getElementById('article-url').value,
        audience: document.getElementById('target-audience').value
    };

    let writingSamples = authUtils.loadFromStorage('contentWritingSamples') || [];

    if (editingWritingIndex !== null) {
        writingSamples[editingWritingIndex] = writingSample;
        editingWritingIndex = null;
        alert('Writing sample updated successfully!');
    } else {
        writingSamples.push(writingSample);
        alert('Writing sample added successfully!');
    }

    authUtils.saveToStorage('contentWritingSamples', writingSamples);
    document.getElementById('writing-form').reset();
}

function editWritingSample(index) {
    const writingSamples = authUtils.loadFromStorage('contentWritingSamples') || [];
    const sample = writingSamples[index];
    if (!sample) return;

    document.getElementById('article-title').value = sample.title;
    document.getElementById('content-type').value = sample.type;
    document.getElementById('publication').value = sample.publication;
    document.getElementById('publish-date').value = sample.publishDate;
    document.getElementById('word-count').value = sample.wordCount;
    document.getElementById('reading-time').value = sample.readingTime;
    document.getElementById('article-summary').value = sample.summary;
    document.getElementById('article-url').value = sample.url;
    document.getElementById('target-audience').value = sample.audience;

    editingWritingIndex = index;
}

// ------------------- Copywriting Projects -------------------
function addOrUpdateCopywritingProject() {
    const copywritingProject = {
        title: document.getElementById('copy-title').value,
        type: document.getElementById('copy-type').value,
        client: document.getElementById('client-name').value,
        budget: document.getElementById('campaign-budget').value,
        objective: document.getElementById('copy-objective').value,
        content: document.getElementById('copy-content').value,
        results: document.getElementById('copy-results').value,
        metrics: document.getElementById('copy-metrics').value
    };

    let copywritingProjects = authUtils.loadFromStorage('contentCopywritingProjects') || [];

    if (editingCopywritingIndex !== null) {
        copywritingProjects[editingCopywritingIndex] = copywritingProject;
        editingCopywritingIndex = null;
        alert('Copywriting project updated successfully!');
    } else {
        copywritingProjects.push(copywritingProject);
        alert('Copywriting project added successfully!');
    }

    authUtils.saveToStorage('contentCopywritingProjects', copywritingProjects);
    document.getElementById('copywriting-form').reset();
}

function editCopywritingProject(index) {
    const copywritingProjects = authUtils.loadFromStorage('contentCopywritingProjects') || [];
    const project = copywritingProjects[index];
    if (!project) return;

    document.getElementById('copy-title').value = project.title;
    document.getElementById('copy-type').value = project.type;
    document.getElementById('client-name').value = project.client;
    document.getElementById('campaign-budget').value = project.budget;
    document.getElementById('copy-objective').value = project.objective;
    document.getElementById('copy-content').value = project.content;
    document.getElementById('copy-results').value = project.results;
    document.getElementById('copy-metrics').value = project.metrics;

    editingCopywritingIndex = index;
}

// ------------------- SEO Projects -------------------
function addOrUpdateSEOProject() {
    const seoProject = {
        project: document.getElementById('seo-project').value,
        type: document.getElementById('seo-type').value,
        keywords: document.getElementById('target-keywords').value,
        duration: document.getElementById('project-duration').value,
        trafficBefore: document.getElementById('traffic-before').value,
        trafficAfter: document.getElementById('traffic-after').value,
        rankingImprovements: document.getElementById('ranking-improvements').value,
        results: document.getElementById('seo-results').value
    };

    let seoProjects = authUtils.loadFromStorage('contentSEOProjects') || [];

    if (editingSEOIndex !== null) {
        seoProjects[editingSEOIndex] = seoProject;
        editingSEOIndex = null;
        alert('SEO project updated successfully!');
    } else {
        seoProjects.push(seoProject);
        alert('SEO project added successfully!');
    }

    authUtils.saveToStorage('contentSEOProjects', seoProjects);
    document.getElementById('seo-form').reset();
}

function editSEOProject(index) {
    const seoProjects = authUtils.loadFromStorage('contentSEOProjects') || [];
    const project = seoProjects[index];
    if (!project) return;

    document.getElementById('seo-project').value = project.project;
    document.getElementById('seo-type').value = project.type;
    document.getElementById('target-keywords').value = project.keywords;
    document.getElementById('project-duration').value = project.duration;
    document.getElementById('traffic-before').value = project.trafficBefore;
    document.getElementById('traffic-after').value = project.trafficAfter;
    document.getElementById('ranking-improvements').value = project.rankingImprovements;
    document.getElementById('seo-results').value = project.results;

    editingSEOIndex = index;
}

// ------------------- Publications -------------------
function addOrUpdatePublication() {
    const publication = {
        title: document.getElementById('pub-title').value,
        type: document.getElementById('pub-type').value,
        organization: document.getElementById('pub-organization').value,
        date: document.getElementById('pub-date').value,
        description: document.getElementById('pub-description').value
    };

    let publications = authUtils.loadFromStorage('contentPublications') || [];

    if (editingPublicationIndex !== null) {
        publications[editingPublicationIndex] = publication;
        editingPublicationIndex = null;
        alert('Publication/Award updated successfully!');
    } else {
        publications.push(publication);
        alert('Publication/Award added successfully!');
    }

    authUtils.saveToStorage('contentPublications', publications);
    document.getElementById('publications-form').reset();
}

function editPublication(index) {
    const publications = authUtils.loadFromStorage('contentPublications') || [];
    const pub = publications[index];
    if (!pub) return;

    document.getElementById('pub-title').value = pub.title;
    document.getElementById('pub-type').value = pub.type;
    document.getElementById('pub-organization').value = pub.organization;
    document.getElementById('pub-date').value = pub.date;
    document.getElementById('pub-description').value = pub.description;

    editingPublicationIndex = index;
}

// ------------------- Load Data -------------------
function loadContentData() {
    const personalInfo = authUtils.loadFromStorage('contentPersonalInfo');
    if (personalInfo) {
        document.getElementById('content-name').value = personalInfo.name || '';
        document.getElementById('content-title').value = personalInfo.title || '';
        document.getElementById('content-email').value = personalInfo.email || '';
        document.getElementById('content-website').value = personalInfo.website || '';
        document.getElementById('content-bio').value = personalInfo.bio || '';
    }
}

// ------------------- Generate Portfolio -------------------
function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('contentPersonalInfo');
    const writingSamples = authUtils.loadFromStorage('contentWritingSamples') || [];
    const copywritingProjects = authUtils.loadFromStorage('contentCopywritingProjects') || [];
    const seoProjects = authUtils.loadFromStorage('contentSEOProjects') || [];
    const publications = authUtils.loadFromStorage('contentPublications') || [];

    // Personal Info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Writing Title';
        document.getElementById('preview-website').textContent = personalInfo.website || 'Your Website';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your writer bio will appear here...';
    }

    // Writing Samples
    const writingSamplesContainer = document.getElementById('preview-writing-samples');
    writingSamplesContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📝 Writing Samples</h3>';
    writingSamples.forEach((sample, index) => {
        const sampleDiv = document.createElement('div');
        sampleDiv.className = 'project-card';
        const typeIcons = {
            'blog-post': '📰',
            'article': '📄',
            'technical-doc': '📚',
            'copywriting': '✍️',
            'creative-writing': '🎭',
            'script': '🎬',
            'newsletter': '📧',
            'journalism': '📰'
        };
        sampleDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${typeIcons[sample.type] || '📝'}</span>
                    <h3>${sample.title}</h3>
                </div>
                <button onclick="editWritingSample(${index})" style="cursor:pointer;">✏️ Edit</button>
            </div>
            ${sample.publication ? `<p><strong>Published in:</strong> ${sample.publication}</p>` : ''}
            ${sample.publishDate ? `<p><strong>Date:</strong> ${sample.publishDate}</p>` : ''}
            ${sample.wordCount ? `<p><strong>Word Count:</strong> ${sample.wordCount} words</p>` : ''}
            ${sample.readingTime ? `<p><strong>Reading Time:</strong> ${sample.readingTime}</p>` : ''}
            ${sample.audience ? `<p><strong>Target Audience:</strong> ${sample.audience}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Summary:</strong><br>${sample.summary}
            </div>
            ${sample.url ? `<div class="project-links"><a href="${sample.url}" target="_blank">Read Article</a></div>` : ''}
        `;
        writingSamplesContainer.appendChild(sampleDiv);
    });

    // Copywriting Projects
    const copywritingContainer = document.getElementById('preview-copywriting');
    copywritingContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📢 Copywriting Projects</h3>';
    copywritingProjects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card';
        const typeIcons = {
            'landing-page': '🖥️',
            'ad-copy': '📢',
            'email-campaign': '📧',
            'sales-page': '💰',
            'social-media': '📱',
            'product-description': '📦',
            'press-release': '📰',
            'brochure': '📄'
        };
        projectDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${typeIcons[project.type] || '✍️'}</span>
                    <h3>${project.title}</h3>
                </div>
                <button onclick="editCopywritingProject(${index})" style="cursor:pointer;">✏️ Edit</button>
            </div>
            ${project.client ? `<p><strong>Client:</strong> ${project.client}</p>` : ''}
            ${project.budget ? `<p><strong>Budget:</strong> ${project.budget}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Objective:</strong><br>${project.objective}
            </div>
            <div style="margin: 1rem 0;">
                <strong>Copy Sample:</strong><br>${project.content}
            </div>
            ${project.results ? `<div style="margin:1rem 0;"><strong>Results:</strong><br>${project.results}</div>` : ''}
            ${project.metrics ? `<div style="margin:1rem 0;"><strong>Metrics:</strong><br>${project.metrics}</div>` : ''}
        `;
        copywritingContainer.appendChild(projectDiv);
    });

    // SEO Projects
    const seoContainer = document.getElementById('preview-seo');
    seoContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🔍 SEO & Content Analytics</h3>';
    seoProjects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card';
        const typeIcons = {
            'keyword-optimization': '🎯',
            'content-strategy': '📝',
            'link-building': '🔗',
            'local-seo': '📍',
            'technical-seo': '⚙️',
            'seo-audit': '🔍'
        };
        projectDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${typeIcons[project.type] || '🔍'}</span>
                    <h3>${project.project}</h3>
                </div>
                <button onclick="editSEOProject(${index})" style="cursor:pointer;">✏️ Edit</button>
            </div>
            ${project.keywords ? `<p><strong>Target Keywords:</strong> ${project.keywords}</p>` : ''}
            ${project.duration ? `<p><strong>Duration:</strong> ${project.duration}</p>` : ''}
            ${project.trafficBefore && project.trafficAfter ? `<p><strong>Traffic Growth:</strong> ${project.trafficBefore} → ${project.trafficAfter}</p>` : ''}
            <div style="margin:1rem 0;"><strong>Ranking Improvements:</strong><br>${project.rankingImprovements}</div>
            <div style="margin:1rem 0;"><strong>Overall Results:</strong><br>${project.results}</div>
        `;
        seoContainer.appendChild(projectDiv);
    });

    // Publications
    const publicationsContainer = document.getElementById('preview-publications');
    publicationsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🏆 Publications & Awards</h3>';
    publications.forEach((pub, index) => {
        const pubDiv = document.createElement('div');
        pubDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
        const typeIcons = {
            'publication': '📚',
            'award': '🏆',
            'recognition': '⭐',
            'featured': '✨',
            'guest-post': '✍️'
        };
        pubDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${typeIcons[pub.type] || '🏆'}</span>
                    <h4>${pub.title}</h4>
                </div>
                <button onclick="editPublication(${index})" style="cursor:pointer;">✏️ Edit</button>
            </div>
            ${pub.organization ? `<p><strong>Organization:</strong> ${pub.organization}</p>` : ''}
            ${pub.date ? `<p><strong>Date:</strong> ${pub.date}</p>` : ''}
            ${pub.description ? `<p><strong>Description:</strong> ${pub.description}</p>` : ''}
        `;
        publicationsContainer.appendChild(pubDiv);
    });

    // Inline edit buttons
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-writing-samples', function(index){ editWritingSample(index); });
        window.enhancements.attachEditableList('#preview-copywriting', function(index){ editCopywritingProject(index); });
        window.enhancements.attachEditableList('#preview-seo', function(index){ editSEOProject(index); });
        window.enhancements.attachEditableList('#preview-publications', function(index){ editPublication(index); });
    }
}

// ------------------- Download PDF -------------------
function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'content-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Content) --------
function buildResumeDataContent() {
    return {
        personalInfo: authUtils.loadFromStorage('contentPersonalInfo') || {},
        writingSamples: authUtils.loadFromStorage('contentWritingSamples') || [],
        copywritingProjects: authUtils.loadFromStorage('contentCopywritingProjects') || [],
        seoProjects: authUtils.loadFromStorage('contentSEOProjects') || [],
        publications: authUtils.loadFromStorage('contentPublications') || [],
        userEmail: authUtils.getCurrentUser().email || ''
    };
}
function generateResumeForContent() {
    const data = buildResumeDataContent();
    const template = document.getElementById('resume-template-select')?.value || 'minimal';
    const p = data.personalInfo; let html='';
    if (template === 'creative') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')} — ${data.userEmail}</div>
            <p>${p.bio||''}</p>
            <h3>Selected Writing</h3>
            ${data.writingSamples.slice(0,5).map(s=>`<div><strong>${s.title||''}</strong> — ${s.type||''}</div>`).join('')}
        </div>`;
    } else if (template === 'modern') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div style="color:#555;">${(p.title||'')} | ${data.userEmail}</div>
            <h3>Highlights</h3>
            ${data.copywritingProjects.slice(0,3).map(c=>`<div><strong>${c.title||''}</strong> — ${c.type||''}</div>`).join('')}
        </div>`;
    } else if (template === 'ats') {
        html = `
        <div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div>${(p.title||'')} | ${data.userEmail}</div>
            <h3>Experience</h3>
            ${data.seoProjects.map(s=>`<div><strong>${s.project||''}</strong> — ${s.type||''}</div>`).join('')}
        </div>`;
    } else {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')}</div>
            <p>${p.bio||''}</p>
        </div>`;
    }
    let preview = document.getElementById('resume-preview');
    if (!preview) {
        const portfolio = document.getElementById('portfolio-preview');
        if (portfolio) { const div=document.createElement('div'); div.id='resume-preview'; div.className='portfolio-preview'; portfolio.insertAdjacentElement('afterend', div); preview = div; }
    }
    if (preview) preview.innerHTML = html;
}
function exportResumePdfContent(){const el=document.getElementById('resume-preview'); if(!el) return; html2pdf().set({filename:'content_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save();}
function exportResumeDocContent(){const el=document.getElementById('resume-preview'); if(!el) return; if(window.enhancements) window.enhancements.exportDocFromElement(el,'content_resume.doc');}
function exportResumeJsonContent(){const data=buildResumeDataContent(); const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='content_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}
function generateShareLinkContent(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('content',slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url);} 
function generateQrContent(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('content',slug):window.location.href; const img=document.getElementById('share-qr-img'); if(window.enhancements) window.enhancements.setQrImage(img,url);} 

