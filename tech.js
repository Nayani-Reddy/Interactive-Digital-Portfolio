// Tech Dashboard JavaScript

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
    loadTechData();
    
    // Set up form event listeners
    setupFormListeners();

    // Inject global action bar for resume/export/share
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForTech(),
            onExportPdf: () => exportResumePdfTech(),
            onExportDoc: () => exportResumeDocTech(),
            onExportJson: () => exportResumeJsonTech(),
            onGenerateShare: () => generateShareLinkTech(),
            onGenerateQr: () => generateQrTech()
        });
    }
});

function setupFormListeners() {
    // Personal Info Form
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Skills Form
    document.getElementById('skills-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSkills();
    });

    // Project Form
    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addProject();
    });

    // Certifications Form
    document.getElementById('certifications-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCertification();
    });
}

function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('tech-name').value,
        title: document.getElementById('tech-title').value,
        email: document.getElementById('tech-email').value,
        phone: document.getElementById('tech-phone').value,
        bio: document.getElementById('tech-bio').value,
        profileImage: document.getElementById('tech-profile-img').files[0]
    };

    // Handle profile image
    if (personalInfo.profileImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            personalInfo.profileImageUrl = e.target.result;
            authUtils.saveToStorage('techPersonalInfo', personalInfo);
            alert('Personal information saved successfully!');
        };
        reader.readAsDataURL(personalInfo.profileImage);
    } else {
        authUtils.saveToStorage('techPersonalInfo', personalInfo);
        alert('Personal information saved successfully!');
    }
}

function saveSkills() {
    const skills = {
        programmingLanguages: document.getElementById('programming-languages').value.split(',').map(s => s.trim()),
        frameworks: document.getElementById('frameworks').value.split(',').map(s => s.trim()),
        databases: document.getElementById('databases').value.split(',').map(s => s.trim()),
        tools: document.getElementById('tools').value.split(',').map(s => s.trim())
    };

    authUtils.saveToStorage('techSkills', skills);
    document.getElementById('skills-form').reset();
    alert('Skills added successfully!');
}

function addProject() {
    const project = {
        type: document.getElementById('project-type').value,
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        techStack: document.getElementById('project-tech-stack').value.split(',').map(s => s.trim()),
        githubUrl: document.getElementById('project-github').value,
        demoUrl: document.getElementById('project-demo').value,
        features: document.getElementById('project-features').value,
        image: document.getElementById('project-image').files[0]
    };

    // Handle project image
    if (project.image) {
        const reader = new FileReader();
        reader.onload = function(e) {
            project.imageUrl = e.target.result;
            saveProjectToStorage(project);
        };
        reader.readAsDataURL(project.image);
    } else {
        saveProjectToStorage(project);
    }
}

function saveProjectToStorage(project) {
    let projects = authUtils.loadFromStorage('techProjects') || [];
    projects.push(project);
    authUtils.saveToStorage('techProjects', projects);
    document.getElementById('project-form').reset();
    alert('Project added successfully!');
}

function addCertification() {
    const certification = {
        name: document.getElementById('cert-name').value,
        issuer: document.getElementById('cert-issuer').value,
        date: document.getElementById('cert-date').value,
        url: document.getElementById('cert-url').value
    };

    let certifications = authUtils.loadFromStorage('techCertifications') || [];
    certifications.push(certification);
    authUtils.saveToStorage('techCertifications', certifications);
    document.getElementById('certifications-form').reset();
    alert('Certification added successfully!');
}

function loadTechData() {
    // Load personal info
    const personalInfo = authUtils.loadFromStorage('techPersonalInfo');
    if (personalInfo) {
        document.getElementById('tech-name').value = personalInfo.name || '';
        document.getElementById('tech-title').value = personalInfo.title || '';
        document.getElementById('tech-email').value = personalInfo.email || '';
        document.getElementById('tech-phone').value = personalInfo.phone || '';
        document.getElementById('tech-bio').value = personalInfo.bio || '';
    }

    // Load skills
    const skills = authUtils.loadFromStorage('techSkills');
    if (skills) {
        document.getElementById('programming-languages').value = (skills.programmingLanguages || []).join(', ');
        document.getElementById('frameworks').value = (skills.frameworks || []).join(', ');
        document.getElementById('databases').value = (skills.databases || []).join(', ');
        document.getElementById('tools').value = (skills.tools || []).join(', ');
    }
}

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('techPersonalInfo');
    const skills = authUtils.loadFromStorage('techSkills');
    const projects = authUtils.loadFromStorage('techProjects') || [];
    const certifications = authUtils.loadFromStorage('techCertifications') || [];

    // Update preview with personal info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Professional Title';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your professional bio will appear here...';
        
        if (personalInfo.profileImageUrl) {
            document.getElementById('preview-profile-img').src = personalInfo.profileImageUrl;
        }
    }

    // Update skills preview
    const skillsContainer = document.getElementById('preview-skills');
    skillsContainer.innerHTML = '';
    
    if (skills) {
        const allSkills = [
            ...(skills.programmingLanguages || []),
            ...(skills.frameworks || []),
            ...(skills.databases || []),
            ...(skills.tools || [])
        ];
        
        allSkills.forEach(skill => {
            if (skill.trim()) {
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.textContent = skill.trim();
                skillsContainer.appendChild(badge);
            }
        });
    }

    // Update projects preview
    const projectsContainer = document.getElementById('preview-projects');
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const typeIcons = {
            'web-app': '🌐',
            'mobile-app': '📱',
            'ai-ml': '🤖',
            'data-science': '💾',
            'cybersecurity': '🔐',
            'game-dev': '🎮',
            'open-source': '💡',
            'iot': '⚡',
            'devops': '☁️',
            'api': '🖥️'
        };
        
        projectCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[project.type] || '💻'}</span>
                <h3>${project.title}</h3>
            </div>
            <p>${project.description}</p>
            ${project.techStack && project.techStack.length > 0 ? 
                `<div style="margin: 1rem 0;">
                    <strong>Tech Stack:</strong> ${project.techStack.join(', ')}
                </div>` : ''
            }
            ${project.features ? 
                `<div style="margin: 1rem 0;">
                    <strong>Key Features:</strong><br>${project.features.replace(/\n/g, '<br>')}
                </div>` : ''
            }
            <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">GitHub</a>` : ''}
                ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank">Live Demo</a>` : ''}
            </div>
        `;
        
        if (project.imageUrl) {
            const img = document.createElement('img');
            img.src = project.imageUrl;
            img.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;';
            projectCard.insertBefore(img, projectCard.firstChild);
        }
        
        projectsContainer.appendChild(projectCard);
    });

    // Update certifications preview
    const certsContainer = document.getElementById('preview-certifications');
    certsContainer.innerHTML = '';
    
    if (certifications.length > 0) {
        certsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0; text-align: center;">🏆 Certifications & Achievements</h3>';
        
        certifications.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
            certDiv.innerHTML = `
                <h4>${cert.name}</h4>
                <p><strong>Issued by:</strong> ${cert.issuer}</p>
                <p><strong>Date:</strong> ${cert.date}</p>
                ${cert.url ? `<p><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
            `;
            certsContainer.appendChild(certDiv);
        });
    }

    // Attach inline edit buttons for projects and certs
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-projects', function(index) {
            const projects = authUtils.loadFromStorage('techProjects') || [];
            const p = projects[index];
            if (!p) return;
            document.getElementById('project-type').value = p.type || '';
            document.getElementById('project-title').value = p.title || '';
            document.getElementById('project-description').value = p.description || '';
            document.getElementById('project-tech-stack').value = (p.techStack||[]).join(', ');
            document.getElementById('project-github').value = p.githubUrl || '';
            document.getElementById('project-demo').value = p.demoUrl || '';
            document.getElementById('project-features').value = p.features || '';
            // Save back when form is submitted will overwrite or append; keeping simple
        });
        window.enhancements.attachEditableList('#preview-certifications', function(index) {
            const certs = authUtils.loadFromStorage('techCertifications') || [];
            const c = certs[index];
            if (!c) return;
            document.getElementById('cert-name').value = c.name || '';
            document.getElementById('cert-issuer').value = c.issuer || '';
            document.getElementById('cert-date').value = c.date || '';
            document.getElementById('cert-url').value = c.url || '';
        });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'tech-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// ---------------- Auto Resume Builder (Tech) ----------------
function buildResumeDataTech() {
    return {
        personalInfo: authUtils.loadFromStorage('techPersonalInfo') || {},
        skills: authUtils.loadFromStorage('techSkills') || {},
        projects: authUtils.loadFromStorage('techProjects') || [],
        certifications: authUtils.loadFromStorage('techCertifications') || [],
        generatedAt: new Date().toISOString(),
        userEmail: authUtils.getCurrentUser().email || ''
    };
}

function generateResumeForTech() {
    const data = buildResumeDataTech();
    const templateSel = document.getElementById('resume-template-select');
    const template = templateSel ? templateSel.value : 'minimal';
    const p = data.personalInfo;
    let html = '';
    if (template === 'creative') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <h1 style="margin:0;">${(p.name||'')}</h1>
                    <div style="color:#555;">${(p.title||'')}</div>
                </div>
                <div style="text-align:right;color:#777;">${data.userEmail}</div>
            </div>
            <p style="margin:8px 0 12px;color:#555;">${(p.bio||'')}</p>
            <h3>Skills</h3>
            <div>${[...(data.skills.programmingLanguages||[]),...(data.skills.frameworks||[]),...(data.skills.databases||[]),...(data.skills.tools||[])].join(', ')}</div>
            <h3 style="margin-top:12px;">Projects</h3>
            ${data.projects.map(pr=>`<div style="margin-bottom:8px;"><strong>${pr.title||''}</strong><br/><small>${pr.description||''}</small></div>`).join('')}
            ${data.certifications.length? `<h3 style="margin-top:12px;">Certifications</h3>`:''}
            ${data.certifications.map(c=>`<div>${c.name||''}${c.issuer? ' — '+c.issuer:''}</div>`).join('')}
        </div>`;
    } else if (template === 'modern') {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;">
            <h2 style="margin:0 0 6px 0;">${(p.name||'')}</h2>
            <div style="color:#555;margin-bottom:8px;">${(p.title||'')} | ${data.userEmail}</div>
            <p style="color:#444;">${(p.bio||'')}</p>
            <hr/>
            <h3>Core Skills</h3>
            <ul>
                ${[...(data.skills.programmingLanguages||[]),...(data.skills.frameworks||[]),...(data.skills.databases||[]),...(data.skills.tools||[])].map(s=>`<li>${s}</li>`).join('')}
            </ul>
            <h3>Highlighted Projects</h3>
            ${data.projects.slice(0,4).map(pr=>`<div><strong>${pr.title||''}</strong> — <span style="color:#666;">${(pr.techStack||[]).join(', ')}</span><div style="color:#444;">${pr.description||''}</div></div>`).join('')}
        </div>`;
    } else if (template === 'ats') {
        html = `
        <div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;">
            <h2 style="margin:0;">${(p.name||'')}</h2>
            <div style="color:#333;">${(p.title||'')} | ${data.userEmail}</div>
            <p>${(p.bio||'')}</p>
            <h3>Skills</h3>
            <div>${[...(data.skills.programmingLanguages||[]),...(data.skills.frameworks||[]),...(data.skills.databases||[]),...(data.skills.tools||[])].join(', ')}</div>
            <h3>Experience / Projects</h3>
            ${data.projects.map(pr=>`<div><strong>${pr.title||''}</strong> — ${(pr.techStack||[]).join(', ')}</div>`).join('')}
        </div>`;
    } else {
        html = `
        <div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;">
            <h1 style="margin:0;">${(p.name||'')}</h1>
            <div style="color:#555;">${(p.title||'')}</div>
            <p>${(p.bio||'')}</p>
            <h3>Projects</h3>
            ${data.projects.slice(0,3).map(pr=>`<div><strong>${pr.title||''}</strong><div style="color:#555;">${pr.description||''}</div></div>`).join('')}
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

function exportResumePdfTech() {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    html2pdf().set({ filename: 'tech_resume.pdf', margin: 0.5, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit:'in', format:'letter', orientation:'portrait' } }).from(el).save();
}
function exportResumeDocTech() {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    if (window.enhancements) window.enhancements.exportDocFromElement(el, 'tech_resume.doc');
}
function exportResumeJsonTech() {
    const data = buildResumeDataTech();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tech_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function generateShareLinkTech() {
    const slug = document.getElementById('shareable-slug')?.value || '';
    const url = window.enhancements ? window.enhancements.buildShareLink('tech', slug) : window.location.href;
    navigator.clipboard?.writeText(url).catch(()=>{});
    alert('Shareable link generated and copied to clipboard:\n' + url);
}
function generateQrTech() {
    const slug = document.getElementById('shareable-slug')?.value || '';
    const url = window.enhancements ? window.enhancements.buildShareLink('tech', slug) : window.location.href;
    const img = document.getElementById('share-qr-img');
    if (window.enhancements) window.enhancements.setQrImage(img, url);
}
