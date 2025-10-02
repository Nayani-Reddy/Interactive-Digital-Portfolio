// Design Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Redirect if not logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../../index.html';
        return;
    }

    // Load current user info
    const user = authUtils.getCurrentUser();
    if (user.name) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    }

    // Load saved data
    loadDesignData();

    // Set up form listeners
    setupFormListeners();

    // Inject action bar for resume/share/qr
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForDesign(),
            onExportPdf: () => exportResumePdfDesign(),
            onExportDoc: () => exportResumeDocDesign(),
            onExportJson: () => exportResumeJsonDesign(),
            onGenerateShare: () => generateShareLinkDesign(),
            onGenerateQr: () => generateQrDesign()
        });
    }
});

function setupFormListeners() {
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    document.getElementById('skills-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSkills();
    });

    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addProject();
    });

    document.getElementById('awards-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addAward();
    });
}

// ---------- Save Functions ----------

function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('design-name').value,
        title: document.getElementById('design-title').value,
        email: document.getElementById('design-email').value,
        phone: document.getElementById('design-phone').value,
        bio: document.getElementById('design-bio').value,
        profileImage: document.getElementById('design-profile-img').files[0]
    };

    if (personalInfo.profileImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            personalInfo.profileImageUrl = e.target.result;
            authUtils.saveToStorage('designPersonalInfo', personalInfo);
            alert('Personal information saved successfully!');
        };
        reader.readAsDataURL(personalInfo.profileImage);
    } else {
        authUtils.saveToStorage('designPersonalInfo', personalInfo);
        alert('Personal information saved successfully!');
    }
}

function saveSkills() {
    const skills = {
        designSkills: document.getElementById('design-skills').value.split(',').map(s => s.trim()),
        softwareTools: document.getElementById('software-tools').value.split(',').map(s => s.trim()),
        photographySkills: document.getElementById('photography-skills').value.split(',').map(s => s.trim()),
        videoSkills: document.getElementById('video-skills').value.split(',').map(s => s.trim())
    };

    authUtils.saveToStorage('designSkills', skills);
    document.getElementById('skills-form').reset();
    alert('Skills added successfully!');
}

function addProject() {
    const project = {
        type: document.getElementById('project-type').value,
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        client: document.getElementById('project-client').value,
        year: document.getElementById('project-year').value,
        portfolioUrl: document.getElementById('project-portfolio-url').value,
        challenges: document.getElementById('project-challenges').value,
        images: Array.from(document.getElementById('project-images').files)
    };

    if (project.images.length > 0) {
        const imagePromises = project.images.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(imageUrls => {
            project.imageUrls = imageUrls;
            saveProjectToStorage(project);
        });
    } else {
        saveProjectToStorage(project);
    }
}

function saveProjectToStorage(project) {
    let projects = authUtils.loadFromStorage('designProjects') || [];
    projects.push(project);
    authUtils.saveToStorage('designProjects', projects);
    document.getElementById('project-form').reset();
    alert('Project added successfully!');
}

function addAward() {
    const award = {
        name: document.getElementById('award-name').value,
        organization: document.getElementById('award-organization').value,
        date: document.getElementById('award-date').value,
        category: document.getElementById('award-category').value,
        description: document.getElementById('award-description').value
    };

    let awards = authUtils.loadFromStorage('designAwards') || [];
    awards.push(award);
    authUtils.saveToStorage('designAwards', awards);
    document.getElementById('awards-form').reset();
    alert('Award added successfully!');
}

// ---------- Load Functions ----------

function loadDesignData() {
    const personalInfo = authUtils.loadFromStorage('designPersonalInfo');
    if (personalInfo) {
        document.getElementById('design-name').value = personalInfo.name || '';
        document.getElementById('design-title').value = personalInfo.title || '';
        document.getElementById('design-email').value = personalInfo.email || '';
        document.getElementById('design-phone').value = personalInfo.phone || '';
        document.getElementById('design-bio').value = personalInfo.bio || '';
    }

    const skills = authUtils.loadFromStorage('designSkills');
    if (skills) {
        document.getElementById('design-skills').value = (skills.designSkills || []).join(', ');
        document.getElementById('software-tools').value = (skills.softwareTools || []).join(', ');
        document.getElementById('photography-skills').value = (skills.photographySkills || []).join(', ');
        document.getElementById('video-skills').value = (skills.videoSkills || []).join(', ');
    }
}

// ---------- Portfolio Generation ----------

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('designPersonalInfo');
    const skills = authUtils.loadFromStorage('designSkills');
    const projects = authUtils.loadFromStorage('designProjects') || [];
    const awards = authUtils.loadFromStorage('designAwards') || [];

    // Personal info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Creative Title';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your creative bio will appear here...';
        if (personalInfo.profileImageUrl) {
            document.getElementById('preview-profile-img').src = personalInfo.profileImageUrl;
        }
    }

    // Skills
    const skillsContainer = document.getElementById('preview-skills');
    skillsContainer.innerHTML = '';
    if (skills) {
        const allSkills = [...(skills.designSkills || []), ...(skills.softwareTools || []),
            ...(skills.photographySkills || []), ...(skills.videoSkills || [])];
        allSkills.forEach(skill => {
            if (skill.trim()) {
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.textContent = skill.trim();
                skillsContainer.appendChild(badge);
            }
        });
    }

    // Projects
    const projectsContainer = document.getElementById('preview-projects');
    projectsContainer.innerHTML = '';
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        const typeIcons = {
            'graphic-design': '🎨',
            'ui-ux': '💻',
            'photography': '📸',
            'illustration': '✏️',
            'architecture': '🏢',
            'animation': '🎥',
            'fashion': '🖌️',
            'product': '🌈',
            'advertising': '🎯'
        };
        let projectHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[project.type] || '🎨'}</span>
                <h3>${project.title}</h3>
            </div>
            <p>${project.description}</p>
        `;
        if (project.client) projectHTML += `<p><strong>Client:</strong> ${project.client}</p>`;
        if (project.year) projectHTML += `<p><strong>Year:</strong> ${project.year}</p>`;
        if (project.challenges) projectHTML += `
            <div style="margin: 1rem 0;">
                <strong>Design Challenges & Solutions:</strong><br>${project.challenges.replace(/\n/g, '<br>')}
            </div>`;
        if (project.portfolioUrl) projectHTML += `<div class="project-links"><a href="${project.portfolioUrl}" target="_blank">View Portfolio</a></div>`;
        projectCard.innerHTML = projectHTML;

        if (project.imageUrls && project.imageUrls.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin: 1rem 0;';
            project.imageUrls.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.cssText = 'width: 100%; height: 150px; object-fit: cover; border-radius: 8px;';
                imagesContainer.appendChild(img);
            });
            projectCard.insertBefore(imagesContainer, projectCard.firstChild);
        }

        projectsContainer.appendChild(projectCard);
    });

    // Awards
    const awardsContainer = document.getElementById('preview-awards');
    awardsContainer.innerHTML = '';
    if (awards.length > 0) {
        awardsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0; text-align: center;">🏆 Awards & Recognition</h3>';
        awards.forEach(award => {
            const awardDiv = document.createElement('div');
            awardDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
            awardDiv.innerHTML = `
                <h4>${award.name}</h4>
                <p><strong>Organization:</strong> ${award.organization}</p>
                <p><strong>Category:</strong> ${award.category}</p>
                <p><strong>Date:</strong> ${award.date}</p>
                ${award.description ? `<p><strong>Description:</strong> ${award.description}</p>` : ''}
            `;
            awardsContainer.appendChild(awardDiv);
        });
    }

    // Inline edit buttons on projects and awards
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-projects', function(index) {
            const projects = authUtils.loadFromStorage('designProjects') || [];
            const p = projects[index];
            if (!p) return;
            document.getElementById('project-type').value = p.type || '';
            document.getElementById('project-title').value = p.title || '';
            document.getElementById('project-description').value = p.description || '';
            document.getElementById('project-client').value = p.client || '';
            document.getElementById('project-year').value = p.year || '';
            document.getElementById('project-portfolio-url').value = p.portfolioUrl || '';
            document.getElementById('project-challenges').value = p.challenges || '';
        });
        window.enhancements.attachEditableList('#preview-awards', function(index) {
            const awards = authUtils.loadFromStorage('designAwards') || [];
            const a = awards[index];
            if (!a) return;
            document.getElementById('award-name').value = a.name || '';
            document.getElementById('award-organization').value = a.organization || '';
            document.getElementById('award-date').value = a.date || '';
            document.getElementById('award-category').value = a.category || '';
            document.getElementById('award-description').value = a.description || '';
        });
    }
}

// ---------- PDF Download ----------
function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'design-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Design) --------
function buildResumeDataDesign() {
    return {
        personalInfo: authUtils.loadFromStorage('designPersonalInfo') || {},
        skills: authUtils.loadFromStorage('designSkills') || {},
        projects: authUtils.loadFromStorage('designProjects') || [],
        awards: authUtils.loadFromStorage('designAwards') || [],
        userEmail: authUtils.getCurrentUser().email || ''
    };
}
function generateResumeForDesign() {
    const data = buildResumeDataDesign();
    const template = document.getElementById('resume-template-select')?.value || 'minimal';
    const p = data.personalInfo;
    let html = '';
    if (template === 'creative') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')}</div>
            <p>${p.bio||''}</p>
            <h3>Skills</h3>
            <div>${[...(data.skills.designSkills||[]),...(data.skills.softwareTools||[]),...(data.skills.photographySkills||[]),...(data.skills.videoSkills||[])].join(', ')}</div>
            <h3>Projects</h3>
            ${data.projects.slice(0,5).map(pr=>`<div><strong>${pr.title||''}</strong> — ${pr.type||''}</div>`).join('')}
        </div>`;
    } else if (template === 'modern') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div style="color:#555;">${(p.title||'')} | ${authUtils.getCurrentUser().email||''}</div>
            <p>${p.bio||''}</p>
            <h3>Selected Works</h3>
            ${data.projects.slice(0,4).map(pr=>`<div><strong>${pr.title||''}</strong> — ${pr.year||''}</div>`).join('')}
        </div>`;
    } else if (template === 'ats') {
        html = `
        <div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div>${(p.title||'')} | ${authUtils.getCurrentUser().email||''}</div>
            <h3>Skills</h3>
            <div>${[...(data.skills.designSkills||[]),...(data.skills.softwareTools||[])].join(', ')}</div>
            <h3>Projects</h3>
            ${data.projects.map(pr=>`<div><strong>${pr.title||''}</strong> — ${pr.type||''}</div>`).join('')}
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
function exportResumePdfDesign() { const el = document.getElementById('resume-preview'); if (!el) return; html2pdf().set({filename:'design_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save(); }
function exportResumeDocDesign() { const el = document.getElementById('resume-preview'); if (!el) return; if (window.enhancements) window.enhancements.exportDocFromElement(el, 'design_resume.doc'); }
function exportResumeJsonDesign() { const data = buildResumeDataDesign(); const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='design_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
function generateShareLinkDesign() { const slug = document.getElementById('shareable-slug')?.value||''; const url = window.enhancements? window.enhancements.buildShareLink('design', slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url); }
function generateQrDesign() { const slug = document.getElementById('shareable-slug')?.value||''; const url = window.enhancements? window.enhancements.buildShareLink('design', slug):window.location.href; const img=document.getElementById('share-qr-img'); if (window.enhancements) window.enhancements.setQrImage(img, url); }

