// Social Impact/NGO Dashboard JavaScript

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
    loadSocialData();
    
    // Set up form event listeners
    setupFormListeners();

    // Inject action bar
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForSocial(),
            onExportPdf: () => exportResumePdfSocial(),
            onExportDoc: () => exportResumeDocSocial(),
            onExportJson: () => exportResumeJsonSocial(),
            onGenerateShare: () => generateShareLinkSocial(),
            onGenerateQr: () => generateQrSocial()
        });
    }
});

function setupFormListeners() {
    // Personal Info Form
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Project Form
    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addProject();
    });

    // Fundraising Form
    document.getElementById('fundraising-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addFundraisingCampaign();
    });

    // Volunteer Form
    document.getElementById('volunteer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addVolunteerExperience();
    });

    // Impact Form
    document.getElementById('impact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addImpactReport();
    });
}

function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('social-name').value,
        title: document.getElementById('social-title').value,
        organization: document.getElementById('organization').value,
        email: document.getElementById('social-email').value,
        focusArea: document.getElementById('focus-area').value,
        location: document.getElementById('social-location').value,
        bio: document.getElementById('social-bio').value
    };

    authUtils.saveToStorage('socialPersonalInfo', personalInfo);
    alert('Social impact profile saved successfully!');
}

function addProject() {
    const project = {
        title: document.getElementById('project-title').value,
        type: document.getElementById('project-type').value,
        location: document.getElementById('project-location').value,
        duration: document.getElementById('project-duration').value,
        beneficiaries: document.getElementById('beneficiaries').value,
        budget: document.getElementById('project-budget').value,
        description: document.getElementById('project-description').value,
        impact: document.getElementById('project-impact').value,
        challenges: document.getElementById('project-challenges').value
    };

    let projects = authUtils.loadFromStorage('socialProjects') || [];
    projects.push(project);
    authUtils.saveToStorage('socialProjects', projects);
    document.getElementById('project-form').reset();
    alert('Project added successfully!');
}

function addFundraisingCampaign() {
    const campaign = {
        title: document.getElementById('campaign-title').value,
        type: document.getElementById('campaign-type').value,
        targetAmount: document.getElementById('target-amount').value,
        amountRaised: document.getElementById('amount-raised').value,
        duration: document.getElementById('campaign-duration').value,
        donorCount: document.getElementById('donor-count').value,
        description: document.getElementById('campaign-description').value,
        outcome: document.getElementById('campaign-outcome').value
    };

    let campaigns = authUtils.loadFromStorage('socialFundraising') || [];
    campaigns.push(campaign);
    authUtils.saveToStorage('socialFundraising', campaigns);
    document.getElementById('fundraising-form').reset();
    alert('Fundraising campaign added successfully!');
}

function addVolunteerExperience() {
    const volunteerExperience = {
        title: document.getElementById('volunteer-title').value,
        organization: document.getElementById('volunteer-organization').value,
        startDate: document.getElementById('volunteer-start').value,
        endDate: document.getElementById('volunteer-end').value,
        hours: document.getElementById('hours-per-week').value,
        leadershipRole: document.getElementById('leadership-role').value,
        responsibilities: document.getElementById('volunteer-responsibilities').value
    };

    let volunteerExperiences = authUtils.loadFromStorage('socialVolunteer') || [];
    volunteerExperiences.push(volunteerExperience);
    authUtils.saveToStorage('socialVolunteer', volunteerExperiences);
    document.getElementById('volunteer-form').reset();
    alert('Volunteer experience added successfully!');
}

function addImpactReport() {
    const impactReport = {
        title: document.getElementById('impact-title').value,
        type: document.getElementById('impact-type').value,
        organization: document.getElementById('impact-organization').value,
        date: document.getElementById('impact-date').value,
        metrics: document.getElementById('impact-metrics').value,
        description: document.getElementById('impact-description').value,
        document: document.getElementById('impact-document').files[0]
    };

    // Handle impact document
    if (impactReport.document) {
        const reader = new FileReader();
        reader.onload = function(e) {
            impactReport.documentUrl = e.target.result;
            saveImpactReportToStorage(impactReport);
        };
        reader.readAsDataURL(impactReport.document);
    } else {
        saveImpactReportToStorage(impactReport);
    }
}

function saveImpactReportToStorage(impactReport) {
    let impactReports = authUtils.loadFromStorage('socialImpact') || [];
    impactReports.push(impactReport);
    authUtils.saveToStorage('socialImpact', impactReports);
    document.getElementById('impact-form').reset();
    alert('Impact report added successfully!');
}

function loadSocialData() {
    // Load personal info
    const personalInfo = authUtils.loadFromStorage('socialPersonalInfo');
    if (personalInfo) {
        document.getElementById('social-name').value = personalInfo.name || '';
        document.getElementById('social-title').value = personalInfo.title || '';
        document.getElementById('organization').value = personalInfo.organization || '';
        document.getElementById('social-email').value = personalInfo.email || '';
        document.getElementById('focus-area').value = personalInfo.focusArea || '';
        document.getElementById('social-location').value = personalInfo.location || '';
        document.getElementById('social-bio').value = personalInfo.bio || '';
    }
}

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('socialPersonalInfo');
    const projects = authUtils.loadFromStorage('socialProjects') || [];
    const campaigns = authUtils.loadFromStorage('socialFundraising') || [];
    const volunteerExperiences = authUtils.loadFromStorage('socialVolunteer') || [];
    const impactReports = authUtils.loadFromStorage('socialImpact') || [];

    // Update preview with personal info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Social Impact Role';
        document.getElementById('preview-organization').textContent = personalInfo.organization || 'Your Organization';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your mission statement will appear here...';
    }

    // Generate Projects Preview
    const projectsContainer = document.getElementById('preview-projects');
    projectsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🤝 Community Projects & Initiatives</h3>';
    
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card';
        
        const typeIcons = {
            'community-development': '🏘️',
            'education': '📚',
            'healthcare': '🏥',
            'environmental': '🌱',
            'human-rights': '⚖️',
            'economic-empowerment': '💰',
            'disaster-relief': '🚨',
            'advocacy': '🗣️'
        };
        
        projectDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[project.type] || '🤝'}</span>
                <h3>${project.title}</h3>
            </div>
            ${project.location ? `<p><strong>Location:</strong> ${project.location}</p>` : ''}
            ${project.duration ? `<p><strong>Duration:</strong> ${project.duration}</p>` : ''}
            ${project.beneficiaries ? `<p><strong>Beneficiaries:</strong> ${project.beneficiaries}</p>` : ''}
            ${project.budget ? `<p><strong>Budget:</strong> ${project.budget}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Description:</strong><br>${project.description}
            </div>
            <div style="margin: 1rem 0;">
                <strong>Impact & Results:</strong><br>${project.impact}
            </div>
            ${project.challenges ? `
                <div style="margin: 1rem 0;">
                    <strong>Challenges & Solutions:</strong><br>${project.challenges}
                </div>
            ` : ''}
        `;
        
        projectsContainer.appendChild(projectDiv);
    });

    // Generate Fundraising Campaigns Preview
    const campaignsContainer = document.getElementById('preview-fundraising');
    campaignsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">💰 Fundraising & Campaigns</h3>';
    
    campaigns.forEach(campaign => {
        const campaignDiv = document.createElement('div');
        campaignDiv.className = 'project-card';
        
        const typeIcons = {
            'crowdfunding': '💸',
            'grant-writing': '📝',
            'corporate-partnership': '🤝',
            'individual-donors': '👤',
            'event-fundraising': '🎉',
            'online-campaign': '💻',
            'emergency-appeal': '🚨',
            'annual-giving': '📅'
        };
        
        campaignDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[campaign.type] || '💰'}</span>
                <h3>${campaign.title}</h3>
            </div>
            ${campaign.duration ? `<p><strong>Duration:</strong> ${campaign.duration}</p>` : ''}
            ${campaign.targetAmount ? `<p><strong>Target:</strong> ${campaign.targetAmount}</p>` : ''}
            ${campaign.amountRaised ? `<p><strong>Raised:</strong> ${campaign.amountRaised}</p>` : ''}
            ${campaign.donorCount ? `<p><strong>Donors:</strong> ${campaign.donorCount}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Description:</strong><br>${campaign.description}
            </div>
            ${campaign.outcome ? `
                <div style="margin: 1rem 0;">
                    <strong>Outcome:</strong><br>${campaign.outcome}
                </div>
            ` : ''}
        `;
        
        campaignsContainer.appendChild(campaignDiv);
    });

    // Generate Volunteer Experience Preview
    const volunteerContainer = document.getElementById('preview-volunteer');
    volunteerContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🙋 Volunteer Experience & Leadership</h3>';
    
    volunteerExperiences.forEach(volunteer => {
        const volunteerDiv = document.createElement('div');
        volunteerDiv.className = 'project-card';
        
        const typeIcons = {
            'board-member': '👑',
            'committee-chair': '🎯',
            'project-lead': '🚀',
            'mentor': '👨‍🏫',
            'trainer': '🎓',
            'coordinator': '📋',
            'advisor': '💡',
            'volunteer': '🙋'
        };
        
        volunteerDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[volunteer.leadershipRole] || '🙋'}</span>
                <h3>${volunteer.title}</h3>
            </div>
            ${volunteer.organization ? `<p><strong>Organization:</strong> ${volunteer.organization}</p>` : ''}
            ${volunteer.startDate ? `<p><strong>Duration:</strong> ${volunteer.startDate} ${volunteer.endDate ? `- ${volunteer.endDate}` : '(ongoing)'}</p>` : ''}
            ${volunteer.hours ? `<p><strong>Time Commitment:</strong> ${volunteer.hours}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Responsibilities & Achievements:</strong><br>${volunteer.responsibilities}
            </div>
        `;
        
        volunteerContainer.appendChild(volunteerDiv);
    });

    // Generate Impact Reports Preview
    const impactContainer = document.getElementById('preview-impact');
    impactContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📊 Impact Reports & Recognition</h3>';
    
    impactReports.forEach(impact => {
        const impactDiv = document.createElement('div');
        impactDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
        
        const typeIcons = {
            'impact-report': '📊',
            'annual-report': '📅',
            'evaluation-study': '🔍',
            'award': '🏆',
            'recognition': '⭐',
            'certification': '📜',
            'media-coverage': '📰',
            'testimonial': '💬'
        };
        
        impactDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">${typeIcons[impact.type] || '📊'}</span>
                <h4>${impact.title}</h4>
            </div>
            ${impact.organization ? `<p><strong>Organization:</strong> ${impact.organization}</p>` : ''}
            ${impact.date ? `<p><strong>Date:</strong> ${impact.date}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Key Metrics:</strong><br>${impact.metrics}
            </div>
            ${impact.description ? `<p><strong>Description:</strong> ${impact.description}</p>` : ''}
        `;
        
        impactContainer.appendChild(impactDiv);
    });

    // Inline edit buttons
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-projects', function(index){ const xs=authUtils.loadFromStorage('socialProjects')||[]; const x=xs[index]; if(!x) return; document.getElementById('project-title').value=x.title||''; document.getElementById('project-type').value=x.type||''; document.getElementById('project-location').value=x.location||''; document.getElementById('project-duration').value=x.duration||''; document.getElementById('beneficiaries').value=x.beneficiaries||''; document.getElementById('project-budget').value=x.budget||''; document.getElementById('project-description').value=x.description||''; document.getElementById('project-impact').value=x.impact||''; document.getElementById('project-challenges').value=x.challenges||''; });
        window.enhancements.attachEditableList('#preview-fundraising', function(index){ const xs=authUtils.loadFromStorage('socialFundraising')||[]; const x=xs[index]; if(!x) return; document.getElementById('campaign-title').value=x.title||''; document.getElementById('campaign-type').value=x.type||''; document.getElementById('target-amount').value=x.targetAmount||''; document.getElementById('amount-raised').value=x.amountRaised||''; document.getElementById('campaign-duration').value=x.duration||''; document.getElementById('donor-count').value=x.donorCount||''; document.getElementById('campaign-description').value=x.description||''; document.getElementById('campaign-outcome').value=x.outcome||''; });
        window.enhancements.attachEditableList('#preview-volunteer', function(index){ const xs=authUtils.loadFromStorage('socialVolunteer')||[]; const x=xs[index]; if(!x) return; document.getElementById('volunteer-title').value=x.title||''; document.getElementById('volunteer-organization').value=x.organization||''; document.getElementById('volunteer-start').value=x.startDate||''; document.getElementById('volunteer-end').value=x.endDate||''; document.getElementById('hours-per-week').value=x.hours||''; document.getElementById('leadership-role').value=x.leadershipRole||''; document.getElementById('volunteer-responsibilities').value=x.responsibilities||''; });
        window.enhancements.attachEditableList('#preview-impact', function(index){ const xs=authUtils.loadFromStorage('socialImpact')||[]; const x=xs[index]; if(!x) return; document.getElementById('impact-title').value=x.title||''; document.getElementById('impact-type').value=x.type||''; document.getElementById('impact-organization').value=x.organization||''; document.getElementById('impact-date').value=x.date||''; document.getElementById('impact-metrics').value=x.metrics||''; document.getElementById('impact-description').value=x.description||''; });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'social-impact-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Social) --------
function buildResumeDataSocial(){return { personalInfo:authUtils.loadFromStorage('socialPersonalInfo')||{}, projects:authUtils.loadFromStorage('socialProjects')||[], fundraising:authUtils.loadFromStorage('socialFundraising')||[], volunteer:authUtils.loadFromStorage('socialVolunteer')||[], impact:authUtils.loadFromStorage('socialImpact')||[], userEmail: authUtils.getCurrentUser().email||'' }}
function generateResumeForSocial(){ const d=buildResumeDataSocial(); const t=document.getElementById('resume-template-select')?.value||'minimal'; const p=d.personalInfo; let h=''; if(t==='creative'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''} — ${d.userEmail}</div><p>${p.bio||''}</p><h3>Projects</h3>${d.projects.slice(0,4).map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else if(t==='modern'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;"><h2 style="margin:0;">${p.name||''}</h2><div style="color:#555;">${p.title||''} | ${d.userEmail}</div><h3>Fundraising</h3>${d.fundraising.slice(0,4).map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else if(t==='ats'){ h=`<div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;"><h2 style="margin:0;">${p.name||''}</h2><div>${p.title||''} | ${d.userEmail}</div><h3>Volunteer</h3>${d.volunteer.map(x=>`<div><strong>${x.title||''}</strong> — ${x.organization||''}</div>`).join('')}</div>`;} else { h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''}</div><p>${p.bio||''}</p></div>`;} let pv=document.getElementById('resume-preview'); if(!pv){ const port=document.getElementById('portfolio-preview'); if(port){ const div=document.createElement('div'); div.id='resume-preview'; div.className='portfolio-preview'; port.insertAdjacentElement('afterend',div); pv=div; } } if(pv) pv.innerHTML=h; }
function exportResumePdfSocial(){const el=document.getElementById('resume-preview'); if(!el) return; html2pdf().set({filename:'social_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save();}
function exportResumeDocSocial(){const el=document.getElementById('resume-preview'); if(!el) return; if(window.enhancements) window.enhancements.exportDocFromElement(el,'social_resume.doc');}
function exportResumeJsonSocial(){const d=buildResumeDataSocial(); const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='social_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}
function generateShareLinkSocial(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('social',slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url);} 
function generateQrSocial(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('social',slug):window.location.href; const img=document.getElementById('share-qr-img'); if(window.enhancements) window.enhancements.setQrImage(img,url);} 
