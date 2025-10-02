// Health/Medical Dashboard JavaScript

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
    loadHealthData();
    
    // Set up form event listeners
    setupFormListeners();

    // Inject action bar
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForHealth(),
            onExportPdf: () => exportResumePdfHealth(),
            onExportDoc: () => exportResumeDocHealth(),
            onExportJson: () => exportResumeJsonHealth(),
            onGenerateShare: () => generateShareLinkHealth(),
            onGenerateQr: () => generateQrHealth()
        });
    }
});

function setupFormListeners() {
    // Personal Info Form
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Case Study Form
    document.getElementById('case-study-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCaseStudy();
    });

    // Research Form
    document.getElementById('research-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addResearch();
    });

    // Certification Form
    document.getElementById('certification-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCertification();
    });

    // Campaign Form
    document.getElementById('campaign-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCampaign();
    });
}

function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('health-name').value,
        title: document.getElementById('health-title').value,
        specialization: document.getElementById('specialization').value,
        email: document.getElementById('health-email').value,
        institution: document.getElementById('institution').value,
        licenseNumber: document.getElementById('license-number').value,
        bio: document.getElementById('health-bio').value
    };

    authUtils.saveToStorage('healthPersonalInfo', personalInfo);
    alert('Medical professional profile saved successfully!');
}

function addCaseStudy() {
    const caseStudy = {
        title: document.getElementById('case-title').value,
        type: document.getElementById('case-type').value,
        demographics: document.getElementById('patient-demographics').value,
        date: document.getElementById('case-date').value,
        presentation: document.getElementById('case-presentation').value,
        diagnosis: document.getElementById('diagnosis-treatment').value,
        outcome: document.getElementById('outcome').value,
        learning: document.getElementById('case-learning').value
    };

    let caseStudies = authUtils.loadFromStorage('healthCaseStudies') || [];
    caseStudies.push(caseStudy);
    authUtils.saveToStorage('healthCaseStudies', caseStudies);
    document.getElementById('case-study-form').reset();
    alert('Case study added successfully!');
}

function addResearch() {
    const research = {
        title: document.getElementById('research-title').value,
        type: document.getElementById('research-type').value,
        journal: document.getElementById('journal-name').value,
        date: document.getElementById('publication-date').value,
        authors: document.getElementById('research-authors').value,
        impactFactor: document.getElementById('impact-factor').value,
        abstract: document.getElementById('research-abstract').value,
        doi: document.getElementById('research-doi').value,
        citations: document.getElementById('citation-count').value
    };

    let researchItems = authUtils.loadFromStorage('healthResearch') || [];
    researchItems.push(research);
    authUtils.saveToStorage('healthResearch', researchItems);
    document.getElementById('research-form').reset();
    alert('Research added successfully!');
}

function addCertification() {
    const certification = {
        name: document.getElementById('cert-name').value,
        type: document.getElementById('cert-type').value,
        issuer: document.getElementById('cert-issuer').value,
        date: document.getElementById('cert-date').value,
        expiry: document.getElementById('cert-expiry').value,
        number: document.getElementById('cert-number').value,
        description: document.getElementById('cert-description').value
    };

    let certifications = authUtils.loadFromStorage('healthCertifications') || [];
    certifications.push(certification);
    authUtils.saveToStorage('healthCertifications', certifications);
    document.getElementById('certification-form').reset();
    alert('Certification added successfully!');
}

function addCampaign() {
    const campaign = {
        title: document.getElementById('campaign-title').value,
        type: document.getElementById('campaign-type').value,
        duration: document.getElementById('campaign-duration').value,
        audience: document.getElementById('target-audience').value,
        description: document.getElementById('campaign-description').value,
        impact: document.getElementById('campaign-impact').value,
        materials: Array.from(document.getElementById('campaign-materials').files)
    };

    // Handle campaign materials
    if (campaign.materials.length > 0) {
        const materialPromises = campaign.materials.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve({
                        name: file.name,
                        type: file.type,
                        url: e.target.result
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(materialPromises).then(materialUrls => {
            campaign.materialUrls = materialUrls;
            saveCampaignToStorage(campaign);
        });
    } else {
        saveCampaignToStorage(campaign);
    }
}

function saveCampaignToStorage(campaign) {
    let campaigns = authUtils.loadFromStorage('healthCampaigns') || [];
    campaigns.push(campaign);
    authUtils.saveToStorage('healthCampaigns', campaigns);
    document.getElementById('campaign-form').reset();
    alert('Campaign added successfully!');
}

function loadHealthData() {
    // Load personal info
    const personalInfo = authUtils.loadFromStorage('healthPersonalInfo');
    if (personalInfo) {
        document.getElementById('health-name').value = personalInfo.name || '';
        document.getElementById('health-title').value = personalInfo.title || '';
        document.getElementById('specialization').value = personalInfo.specialization || '';
        document.getElementById('health-email').value = personalInfo.email || '';
        document.getElementById('institution').value = personalInfo.institution || '';
        document.getElementById('license-number').value = personalInfo.licenseNumber || '';
        document.getElementById('health-bio').value = personalInfo.bio || '';
    }
}

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('healthPersonalInfo');
    const caseStudies = authUtils.loadFromStorage('healthCaseStudies') || [];
    const researchItems = authUtils.loadFromStorage('healthResearch') || [];
    const certifications = authUtils.loadFromStorage('healthCertifications') || [];
    const campaigns = authUtils.loadFromStorage('healthCampaigns') || [];

    // Update preview with personal info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Medical Title';
        document.getElementById('preview-specialization').textContent = personalInfo.specialization || 'Your Specialization';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your professional bio will appear here...';
    }

    // Generate Case Studies Preview
    const caseStudiesContainer = document.getElementById('preview-case-studies');
    caseStudiesContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🏥 Medical Case Studies</h3>';
    
    caseStudies.forEach(caseStudy => {
        const caseDiv = document.createElement('div');
        caseDiv.className = 'project-card';
        
        const typeIcons = {
            'diagnosis': '🔍',
            'treatment': '💊',
            'surgery': '⚕️',
            'emergency': '🚨',
            'research': '🧬',
            'rehabilitation': '🏥',
            'preventive': '🛡️',
            'innovation': '💡'
        };
        
        caseDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[caseStudy.type] || '🏥'}</span>
                <h3>${caseStudy.title}</h3>
            </div>
            ${caseStudy.demographics ? `<p><strong>Patient:</strong> ${caseStudy.demographics}</p>` : ''}
            ${caseStudy.date ? `<p><strong>Date:</strong> ${caseStudy.date}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Case Presentation:</strong><br>${caseStudy.presentation}
            </div>
            <div style="margin: 1rem 0;">
                <strong>Diagnosis & Treatment:</strong><br>${caseStudy.diagnosis}
            </div>
            <div style="margin: 1rem 0;">
                <strong>Outcome:</strong><br>${caseStudy.outcome}
            </div>
            ${caseStudy.learning ? `
                <div style="margin: 1rem 0;">
                    <strong>Key Learnings:</strong><br>${caseStudy.learning}
                </div>
            ` : ''}
        `;
        
        caseStudiesContainer.appendChild(caseDiv);
    });

    // Generate Research Preview
    const researchContainer = document.getElementById('preview-research');
    researchContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🧬 Research & Publications</h3>';
    
    researchItems.forEach(research => {
        const researchDiv = document.createElement('div');
        researchDiv.className = 'project-card';
        
        const typeIcons = {
            'clinical-trial': '🧪',
            'observational-study': '👁️',
            'systematic-review': '📚',
            'case-report': '📄',
            'meta-analysis': '📊',
            'laboratory-research': '🔬',
            'epidemiological': '📈',
            'quality-improvement': '⚡'
        };
        
        researchDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[research.type] || '🧬'}</span>
                <h3>${research.title}</h3>
            </div>
            ${research.journal ? `<p><strong>Journal:</strong> ${research.journal}</p>` : ''}
            ${research.date ? `<p><strong>Date:</strong> ${research.date}</p>` : ''}
            ${research.impactFactor ? `<p><strong>Impact Factor:</strong> ${research.impactFactor}</p>` : ''}
            ${research.citations ? `<p><strong>Citations:</strong> ${research.citations}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Abstract:</strong><br>${research.abstract}
            </div>
            ${research.doi ? `
                <div class="project-links">
                    <a href="${research.doi}" target="_blank">View Publication</a>
                </div>
            ` : ''}
        `;
        
        researchContainer.appendChild(researchDiv);
    });

    // Generate Certifications Preview
    const certificationsContainer = document.getElementById('preview-certifications');
    certificationsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📜 Certifications & Licenses</h3>';
    
    certifications.forEach(cert => {
        const certDiv = document.createElement('div');
        certDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
        
        const typeIcons = {
            'board-certification': '🏥',
            'medical-license': '📋',
            'specialty-certification': '🎯',
            'continuing-medical-education': '📚',
            'professional-membership': '👥',
            'fellowship': '🎓',
            'residency': '🏥',
            'training-certification': '💪'
        };
        
        certDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">${typeIcons[cert.type] || '📜'}</span>
                <h4>${cert.name}</h4>
            </div>
            ${cert.issuer ? `<p><strong>Issuer:</strong> ${cert.issuer}</p>` : ''}
            ${cert.date ? `<p><strong>Date:</strong> ${cert.date}</p>` : ''}
            ${cert.expiry ? `<p><strong>Expires:</strong> ${cert.expiry}</p>` : ''}
            ${cert.number ? `<p><strong>Number:</strong> ${cert.number}</p>` : ''}
            ${cert.description ? `<p><strong>Description:</strong> ${cert.description}</p>` : ''}
        `;
        
        certificationsContainer.appendChild(certDiv);
    });

    // Generate Campaigns Preview
    const campaignsContainer = document.getElementById('preview-campaigns');
    campaignsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📢 Health Campaigns & Public Education</h3>';
    
    campaigns.forEach(campaign => {
        const campaignDiv = document.createElement('div');
        campaignDiv.className = 'project-card';
        
        const typeIcons = {
            'public-awareness': '📢',
            'health-education': '📚',
            'preventive-care': '🛡️',
            'community-outreach': '🤝',
            'patient-education': '👥',
            'professional-training': '👨‍⚕️',
            'wellness-program': '💪',
            'advocacy': '🗣️'
        };
        
        campaignDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[campaign.type] || '📢'}</span>
                <h3>${campaign.title}</h3>
            </div>
            ${campaign.duration ? `<p><strong>Duration:</strong> ${campaign.duration}</p>` : ''}
            ${campaign.audience ? `<p><strong>Target Audience:</strong> ${campaign.audience}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Description:</strong><br>${campaign.description}
            </div>
            ${campaign.impact ? `
                <div style="margin: 1rem 0;">
                    <strong>Impact & Results:</strong><br>${campaign.impact}
                </div>
            ` : ''}
        `;
        
        campaignsContainer.appendChild(campaignDiv);
    });

    // Inline edit buttons
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-case-studies', function(index){ const xs=authUtils.loadFromStorage('healthCaseStudies')||[]; const x=xs[index]; if(!x) return; document.getElementById('case-title').value=x.title||''; document.getElementById('case-type').value=x.type||''; document.getElementById('patient-demographics').value=x.demographics||''; document.getElementById('case-date').value=x.date||''; document.getElementById('case-presentation').value=x.presentation||''; document.getElementById('diagnosis-treatment').value=x.diagnosis||''; document.getElementById('outcome').value=x.outcome||''; document.getElementById('case-learning').value=x.learning||''; });
        window.enhancements.attachEditableList('#preview-research', function(index){ const xs=authUtils.loadFromStorage('healthResearch')||[]; const x=xs[index]; if(!x) return; document.getElementById('research-title').value=x.title||''; document.getElementById('research-type').value=x.type||''; document.getElementById('journal-name').value=x.journal||''; document.getElementById('publication-date').value=x.date||''; document.getElementById('research-authors').value=x.authors||''; document.getElementById('impact-factor').value=x.impactFactor||''; document.getElementById('research-abstract').value=x.abstract||''; document.getElementById('research-doi').value=x.doi||''; document.getElementById('citation-count').value=x.citations||''; });
        window.enhancements.attachEditableList('#preview-certifications', function(index){ const xs=authUtils.loadFromStorage('healthCertifications')||[]; const x=xs[index]; if(!x) return; document.getElementById('cert-name').value=x.name||''; document.getElementById('cert-type').value=x.type||''; document.getElementById('cert-issuer').value=x.issuer||''; document.getElementById('cert-date').value=x.date||''; document.getElementById('cert-expiry').value=x.expiry||''; document.getElementById('cert-number').value=x.number||''; document.getElementById('cert-description').value=x.description||''; });
        window.enhancements.attachEditableList('#preview-campaigns', function(index){ const xs=authUtils.loadFromStorage('healthCampaigns')||[]; const x=xs[index]; if(!x) return; document.getElementById('campaign-title').value=x.title||''; document.getElementById('campaign-type').value=x.type||''; document.getElementById('campaign-duration').value=x.duration||''; document.getElementById('target-audience').value=x.audience||''; document.getElementById('campaign-description').value=x.description||''; document.getElementById('campaign-impact').value=x.impact||''; });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'health-medical-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Health) --------
function buildResumeDataHealth(){return { personalInfo:authUtils.loadFromStorage('healthPersonalInfo')||{}, caseStudies:authUtils.loadFromStorage('healthCaseStudies')||[], research:authUtils.loadFromStorage('healthResearch')||[], certifications:authUtils.loadFromStorage('healthCertifications')||[], campaigns:authUtils.loadFromStorage('healthCampaigns')||[], userEmail:authUtils.getCurrentUser().email||'' }}
function generateResumeForHealth(){ const d=buildResumeDataHealth(); const t=document.getElementById('resume-template-select')?.value||'minimal'; const p=d.personalInfo; let h=''; if(t==='creative'){ h=`<div style=\"font-family:'Poppins',sans-serif;max-width:900px;margin:auto;\"><h1 style=\"margin:0;\">${p.name||''}</h1><div style=\"color:#555;\">${p.title||''} — ${d.userEmail}</div><p>${p.bio||''}</p><h3>Case Studies</h3>${d.caseStudies.slice(0,4).map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else if(t==='modern'){ h=`<div style=\"font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;\"><h2 style=\"margin:0;\">${p.name||''}</h2><div style=\"color:#555;\">${p.title||''} | ${d.userEmail}</div><h3>Research</h3>${d.research.slice(0,4).map(x=>`<div><strong>${x.title||''}</strong> — ${x.journal||''}</div>`).join('')}</div>`;} else if(t==='ats'){ h=`<div style=\"font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;\"><h2 style=\"margin:0;\">${p.name||''}</h2><div>${p.title||''} | ${d.userEmail}</div><h3>Certifications</h3>${d.certifications.map(x=>`<div><strong>${x.name||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else { h=`<div style=\"font-family:'Poppins',sans-serif;max-width:800px;margin:auto;\"><h1 style=\"margin:0;\">${p.name||''}</h1><div style=\"color:#555;\">${p.title||''}</div><p>${p.bio||''}</p></div>`;} let pv=document.getElementById('resume-preview'); if(!pv){ const port=document.getElementById('portfolio-preview'); if(port){ const div=document.createElement('div'); div.id='resume-preview'; div.className='portfolio-preview'; port.insertAdjacentElement('afterend',div); pv=div; } } if(pv) pv.innerHTML=h; }
function exportResumePdfHealth(){const el=document.getElementById('resume-preview'); if(!el) return; html2pdf().set({filename:'health_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save();}
function exportResumeDocHealth(){const el=document.getElementById('resume-preview'); if(!el) return; if(window.enhancements) window.enhancements.exportDocFromElement(el,'health_resume.doc');}
function exportResumeJsonHealth(){const d=buildResumeDataHealth(); const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='health_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}
function generateShareLinkHealth(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('health',slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url);} 
function generateQrHealth(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('health',slug):window.location.href; const img=document.getElementById('share-qr-img'); if(window.enhancements) window.enhancements.setQrImage(img,url);} 