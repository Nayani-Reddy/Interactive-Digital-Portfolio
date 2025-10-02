// Academic Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../../index.html';
        return;
    }

    const user = authUtils.getCurrentUser();
    if (user.name) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    }

    loadAcademicData();
    setupFormListeners();

    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForAcademic(),
            onExportPdf: () => exportResumePdfAcademic(),
            onExportDoc: () => exportResumeDocAcademic(),
            onExportJson: () => exportResumeJsonAcademic(),
            onGenerateShare: () => generateShareLinkAcademic(),
            onGenerateQr: () => generateQrAcademic()
        });
    }
});

function setupFormListeners() {
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    document.getElementById('publication-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addPublication();
    });

    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addProject();
    });
}

// ---------- Save ----------
function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('academic-name').value,
        title: document.getElementById('academic-title').value,
        email: document.getElementById('academic-email').value,
        affiliation: document.getElementById('academic-affiliation').value,
        bio: document.getElementById('academic-bio').value,
        profileImage: document.getElementById('academic-profile-img').files[0]
    };

    if (personalInfo.profileImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            personalInfo.profileImageUrl = e.target.result;
            authUtils.saveToStorage('academicPersonalInfo', personalInfo);
            alert('Personal information saved successfully!');
        };
        reader.readAsDataURL(personalInfo.profileImage);
    } else {
        authUtils.saveToStorage('academicPersonalInfo', personalInfo);
        alert('Personal information saved successfully!');
    }
}

function addPublication() {
    const publication = {
        title: document.getElementById('pub-title').value,
        venue: document.getElementById('pub-venue').value,
        year: document.getElementById('pub-year').value,
        link: document.getElementById('pub-link').value,
        authors: document.getElementById('pub-authors').value,
        abstract: document.getElementById('pub-abstract').value
    };
    let publications = authUtils.loadFromStorage('academicPublications') || [];
    publications.push(publication);
    authUtils.saveToStorage('academicPublications', publications);
    document.getElementById('publication-form').reset();
    alert('Publication added successfully!');
}

function addProject() {
    const project = {
        title: document.getElementById('project-title').value,
        role: document.getElementById('project-role').value,
        start: document.getElementById('project-start').value,
        end: document.getElementById('project-end').value,
        description: document.getElementById('project-description').value
    };
    let projects = authUtils.loadFromStorage('academicProjects') || [];
    projects.push(project);
    authUtils.saveToStorage('academicProjects', projects);
    document.getElementById('project-form').reset();
    alert('Project added successfully!');
}

// ---------- Load ----------
function loadAcademicData() {
    const personalInfo = authUtils.loadFromStorage('academicPersonalInfo');
    if (personalInfo) {
        document.getElementById('academic-name').value = personalInfo.name || '';
        document.getElementById('academic-title').value = personalInfo.title || '';
        document.getElementById('academic-email').value = personalInfo.email || '';
        document.getElementById('academic-affiliation').value = personalInfo.affiliation || '';
        document.getElementById('academic-bio').value = personalInfo.bio || '';
    }
}

// ---------- Portfolio Generation ----------
function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('academicPersonalInfo');
    const publications = authUtils.loadFromStorage('academicPublications') || [];
    const projects = authUtils.loadFromStorage('academicProjects') || [];

    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Academic Title';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your research bio will appear here...';
        if (personalInfo.profileImageUrl) {
            document.getElementById('preview-profile-img').src = personalInfo.profileImageUrl;
        }
    }

    const pubsContainer = document.getElementById('preview-publications');
    pubsContainer.innerHTML = '';
    if (publications.length > 0) {
        pubsContainer.innerHTML = '<h3 style="text-align:center;margin:2rem 0 1rem 0;">📄 Publications</h3>';
        publications.forEach(pub => {
            const div = document.createElement('div');
            div.className = 'project-card';
            div.innerHTML = `
                <h3>${pub.title}</h3>
                <p><strong>Venue:</strong> ${pub.venue || ''} ${pub.year ? '('+pub.year+')' : ''}</p>
                ${pub.authors ? `<p><strong>Authors:</strong> ${pub.authors}</p>` : ''}
                ${pub.abstract ? `<p>${pub.abstract}</p>` : ''}
                ${pub.link ? `<div class="project-links"><a href="${pub.link}" target="_blank">View</a></div>` : ''}
            `;
            pubsContainer.appendChild(div);
        });
    }

    const projectsContainer = document.getElementById('preview-projects');
    projectsContainer.innerHTML = '';
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>🔬 ${p.title}</h3>
            ${p.role ? `<p><strong>Role:</strong> ${p.role}</p>` : ''}
            ${(p.start||p.end) ? `<p><strong>Timeline:</strong> ${p.start||''} - ${p.end||''}</p>` : ''}
            ${p.description ? `<p>${p.description}</p>` : ''}
        `;
        projectsContainer.appendChild(card);
    });

    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-publications', function(index) {
            const pubs = authUtils.loadFromStorage('academicPublications') || [];
            const pub = pubs[index];
            if (!pub) return;
            document.getElementById('pub-title').value = pub.title || '';
            document.getElementById('pub-venue').value = pub.venue || '';
            document.getElementById('pub-year').value = pub.year || '';
            document.getElementById('pub-link').value = pub.link || '';
            document.getElementById('pub-authors').value = pub.authors || '';
            document.getElementById('pub-abstract').value = pub.abstract || '';
        });
        window.enhancements.attachEditableList('#preview-projects', function(index) {
            const pr = (authUtils.loadFromStorage('academicProjects') || [])[index];
            if (!pr) return;
            document.getElementById('project-title').value = pr.title || '';
            document.getElementById('project-role').value = pr.role || '';
            document.getElementById('project-start').value = pr.start || '';
            document.getElementById('project-end').value = pr.end || '';
            document.getElementById('project-description').value = pr.description || '';
        });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = { margin: 1, filename: 'academic-portfolio.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Academic) --------
function buildResumeDataAcademic() {
    return {
        personalInfo: authUtils.loadFromStorage('academicPersonalInfo') || {},
        publications: authUtils.loadFromStorage('academicPublications') || [],
        projects: authUtils.loadFromStorage('academicProjects') || [],
        userEmail: authUtils.getCurrentUser().email || ''
    };
}
function generateResumeForAcademic() {
    const data = buildResumeDataAcademic();
    const template = document.getElementById('resume-template-select')?.value || 'minimal';
    const p = data.personalInfo;
    let html = '';
    if (template === 'creative') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')}</div>
            <p>${p.bio||''}</p>
            <h3>Selected Publications</h3>
            ${data.publications.slice(0,5).map(pub=>`<div><strong>${pub.title||''}</strong> — ${pub.venue||''} ${pub.year||''}</div>`).join('')}
        </div>`;
    } else if (template === 'modern') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div style="color:#555;">${(p.title||'')} | ${authUtils.getCurrentUser().email||''}</div>
            <p>${p.bio||''}</p>
            <h3>Projects</h3>
            ${data.projects.slice(0,4).map(pr=>`<div><strong>${pr.title||''}</strong> — ${pr.role||''}</div>`).join('')}
        </div>`;
    } else if (template === 'ats') {
        html = `
        <div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div>${(p.title||'')} | ${authUtils.getCurrentUser().email||''}</div>
            <h3>Publications</h3>
            ${data.publications.map(pub=>`<div><strong>${pub.title||''}</strong> — ${pub.venue||''} ${pub.year||''}</div>`).join('')}
            <h3>Projects</h3>
            ${data.projects.map(pr=>`<div><strong>${pr.title||''}</strong> — ${pr.role||''}</div>`).join('')}
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
function exportResumePdfAcademic() { const el = document.getElementById('resume-preview'); if (!el) return; html2pdf().set({filename:'academic_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save(); }
function exportResumeDocAcademic() { const el = document.getElementById('resume-preview'); if (!el) return; if (window.enhancements) window.enhancements.exportDocFromElement(el, 'academic_resume.doc'); }
function exportResumeJsonAcademic() { const data = buildResumeDataAcademic(); const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='academic_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
function generateShareLinkAcademic() { const slug = document.getElementById('shareable-slug')?.value||''; const url = window.enhancements? window.enhancements.buildShareLink('academic', slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url); }
function generateQrAcademic() { const slug = document.getElementById('shareable-slug')?.value||''; const url = window.enhancements? window.enhancements.buildShareLink('academic', slug):window.location.href; const img=document.getElementById('share-qr-img'); if (window.enhancements) window.enhancements.setQrImage(img, url); }


