// Sports/Fitness Dashboard JavaScript

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
    loadSportsData();
    
    // Set up form event listeners
    setupFormListeners();

    // Inject action bar
    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForSports(),
            onExportPdf: () => exportResumePdfSports(),
            onExportDoc: () => exportResumeDocSports(),
            onExportJson: () => exportResumeJsonSports(),
            onGenerateShare: () => generateShareLinkSports(),
            onGenerateQr: () => generateQrSports()
        });
    }
});

function setupFormListeners() {
    // Personal Info Form
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePersonalInfo();
    });

    // Highlight Form
    document.getElementById('highlight-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addHighlight();
    });

    // Training Form
    document.getElementById('training-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTrainingExperience();
    });

    // Certification Form
    document.getElementById('certification-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCertification();
    });

    // Media Form
    document.getElementById('media-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addMedia();
    });
}

function savePersonalInfo() {
    const personalInfo = {
        name: document.getElementById('sports-name').value,
        title: document.getElementById('sports-title').value,
        sportType: document.getElementById('sport-type').value,
        email: document.getElementById('sports-email').value,
        teamAffiliation: document.getElementById('team-affiliation').value,
        location: document.getElementById('sports-location').value,
        bio: document.getElementById('sports-bio').value
    };

    authUtils.saveToStorage('sportsPersonalInfo', personalInfo);
    alert('Athlete profile saved successfully!');
}

function addHighlight() {
    const highlight = {
        title: document.getElementById('highlight-title').value,
        type: document.getElementById('highlight-type').value,
        eventName: document.getElementById('event-name').value,
        date: document.getElementById('achievement-date').value,
        metrics: document.getElementById('performance-metrics').value,
        ranking: document.getElementById('ranking-position').value,
        description: document.getElementById('highlight-description').value
    };

    let highlights = authUtils.loadFromStorage('sportsHighlights') || [];
    highlights.push(highlight);
    authUtils.saveToStorage('sportsHighlights', highlights);
    document.getElementById('highlight-form').reset();
    alert('Achievement added successfully!');
}

function addTrainingExperience() {
    const trainingExperience = {
        title: document.getElementById('training-title').value,
        type: document.getElementById('training-type').value,
        duration: document.getElementById('training-duration').value,
        clientCount: document.getElementById('client-count').value,
        methodology: document.getElementById('training-methodology').value,
        results: document.getElementById('training-results').value
    };

    let trainingExperiences = authUtils.loadFromStorage('sportsTraining') || [];
    trainingExperiences.push(trainingExperience);
    authUtils.saveToStorage('sportsTraining', trainingExperiences);
    document.getElementById('training-form').reset();
    alert('Training experience added successfully!');
}

function addCertification() {
    const certification = {
        name: document.getElementById('cert-name').value,
        type: document.getElementById('cert-type').value,
        issuer: document.getElementById('cert-issuer').value,
        date: document.getElementById('cert-date').value,
        expiry: document.getElementById('cert-expiry').value,
        id: document.getElementById('cert-id').value,
        description: document.getElementById('cert-description').value
    };

    let certifications = authUtils.loadFromStorage('sportsCertifications') || [];
    certifications.push(certification);
    authUtils.saveToStorage('sportsCertifications', certifications);
    document.getElementById('certification-form').reset();
    alert('Certification added successfully!');
}

function addMedia() {
    const media = {
        title: document.getElementById('media-title').value,
        type: document.getElementById('media-type').value,
        platform: document.getElementById('media-platform').value,
        date: document.getElementById('media-date').value,
        description: document.getElementById('media-description').value,
        url: document.getElementById('media-url').value,
        files: Array.from(document.getElementById('media-files').files)
    };

    // Handle media files
    if (media.files.length > 0) {
        const filePromises = media.files.map(file => {
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

        Promise.all(filePromises).then(fileUrls => {
            media.fileUrls = fileUrls;
            saveMediaToStorage(media);
        });
    } else {
        saveMediaToStorage(media);
    }
}

function saveMediaToStorage(media) {
    let mediaItems = authUtils.loadFromStorage('sportsMedia') || [];
    mediaItems.push(media);
    authUtils.saveToStorage('sportsMedia', mediaItems);
    document.getElementById('media-form').reset();
    alert('Media added successfully!');
}

function loadSportsData() {
    // Load personal info
    const personalInfo = authUtils.loadFromStorage('sportsPersonalInfo');
    if (personalInfo) {
        document.getElementById('sports-name').value = personalInfo.name || '';
        document.getElementById('sports-title').value = personalInfo.title || '';
        document.getElementById('sport-type').value = personalInfo.sportType || '';
        document.getElementById('sports-email').value = personalInfo.email || '';
        document.getElementById('team-affiliation').value = personalInfo.teamAffiliation || '';
        document.getElementById('sports-location').value = personalInfo.location || '';
        document.getElementById('sports-bio').value = personalInfo.bio || '';
    }
}

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('sportsPersonalInfo');
    const highlights = authUtils.loadFromStorage('sportsHighlights') || [];
    const trainingExperiences = authUtils.loadFromStorage('sportsTraining') || [];
    const certifications = authUtils.loadFromStorage('sportsCertifications') || [];
    const mediaItems = authUtils.loadFromStorage('sportsMedia') || [];

    // Update preview with personal info
    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Athletic Title';
        document.getElementById('preview-sport').textContent = personalInfo.sportType || 'Your Primary Sport';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your athletic bio will appear here...';
    }

    // Generate Highlights Preview
    const highlightsContainer = document.getElementById('preview-highlights');
    highlightsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🏆 Performance Highlights & Achievements</h3>';
    
    highlights.forEach(highlight => {
        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'project-card';
        
        const typeIcons = {
            'championship': '🏆',
            'personal-best': '⭐',
            'record': '📊',
            'tournament': '🏅',
            'competition': '🏃',
            'milestone': '🎯',
            'award': '🏆',
            'recognition': '⭐'
        };
        
        highlightDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[highlight.type] || '🏆'}</span>
                <h3>${highlight.title}</h3>
            </div>
            ${highlight.eventName ? `<p><strong>Event:</strong> ${highlight.eventName}</p>` : ''}
            ${highlight.date ? `<p><strong>Date:</strong> ${highlight.date}</p>` : ''}
            ${highlight.metrics ? `<p><strong>Performance:</strong> ${highlight.metrics}</p>` : ''}
            ${highlight.ranking ? `<p><strong>Result:</strong> ${highlight.ranking}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Description:</strong><br>${highlight.description}
            </div>
        `;
        
        highlightsContainer.appendChild(highlightDiv);
    });

    // Generate Training Experience Preview
    const trainingContainer = document.getElementById('preview-training');
    trainingContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">💪 Training & Coaching Experience</h3>';
    
    trainingExperiences.forEach(training => {
        const trainingDiv = document.createElement('div');
        trainingDiv.className = 'project-card';
        
        const typeIcons = {
            'personal-training': '💪',
            'group-fitness': '👥',
            'sports-coaching': '🏀',
            'rehabilitation': '🏥',
            'specialized-program': '🎯',
            'online-coaching': '💻',
            'youth-training': '👶',
            'elite-training': '🏆'
        };
        
        trainingDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[training.type] || '💪'}</span>
                <h3>${training.title}</h3>
            </div>
            ${training.duration ? `<p><strong>Duration:</strong> ${training.duration}</p>` : ''}
            ${training.clientCount ? `<p><strong>Clients/Athletes:</strong> ${training.clientCount}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Methodology:</strong><br>${training.methodology}
            </div>
            ${training.results ? `
                <div style="margin: 1rem 0;">
                    <strong>Results:</strong><br>${training.results}
                </div>
            ` : ''}
        `;
        
        trainingContainer.appendChild(trainingDiv);
    });

    // Generate Certifications Preview
    const certificationsContainer = document.getElementById('preview-certifications');
    certificationsContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🎓 Certifications & Education</h3>';
    
    certifications.forEach(cert => {
        const certDiv = document.createElement('div');
        certDiv.style.cssText = 'background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid #667eea;';
        
        const typeIcons = {
            'personal-training': '💪',
            'sports-coaching': '🏀',
            'nutrition': '🥗',
            'rehabilitation': '🏥',
            'specialized': '🎯',
            'academic-degree': '🎓',
            'continuing-education': '📚'
        };
        
        certDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">${typeIcons[cert.type] || '🎓'}</span>
                <h4>${cert.name}</h4>
            </div>
            ${cert.issuer ? `<p><strong>Issuer:</strong> ${cert.issuer}</p>` : ''}
            ${cert.date ? `<p><strong>Date:</strong> ${cert.date}</p>` : ''}
            ${cert.expiry ? `<p><strong>Expires:</strong> ${cert.expiry}</p>` : ''}
            ${cert.id ? `<p><strong>ID:</strong> ${cert.id}</p>` : ''}
            ${cert.description ? `<p><strong>Description:</strong> ${cert.description}</p>` : ''}
        `;
        
        certificationsContainer.appendChild(certDiv);
    });

    // Generate Media Preview
    const mediaContainer = document.getElementById('preview-media');
    mediaContainer.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">📹 Media & Documentation</h3>';
    
    mediaItems.forEach(media => {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'project-card';
        
        const typeIcons = {
            'highlight-reel': '🎬',
            'training-video': '💪',
            'competition-footage': '🏃',
            'interview': '🎤',
            'photo-gallery': '📸',
            'instructional': '📚',
            'motivational': '🔥'
        };
        
        mediaDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${typeIcons[media.type] || '📹'}</span>
                <h3>${media.title}</h3>
            </div>
            ${media.platform ? `<p><strong>Platform:</strong> ${media.platform}</p>` : ''}
            ${media.date ? `<p><strong>Date:</strong> ${media.date}</p>` : ''}
            <div style="margin: 1rem 0;">
                <strong>Description:</strong><br>${media.description}
            </div>
            ${media.url ? `
                <div class="project-links">
                    <a href="${media.url}" target="_blank">View Media</a>
                </div>
            ` : ''}
        `;
        
        // Add media files if available
        if (media.fileUrls && media.fileUrls.length > 0) {
            const filesContainer = document.createElement('div');
            filesContainer.style.cssText = 'margin: 1rem 0;';
            
            media.fileUrls.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = file.url;
                    img.style.cssText = 'width: 100%; max-width: 300px; height: auto; border-radius: 8px; margin: 0.5rem 0;';
                    filesContainer.appendChild(img);
                }
            });
            
            if (filesContainer.children.length > 0) {
                mediaDiv.appendChild(filesContainer);
            }
        }
        
        mediaContainer.appendChild(mediaDiv);
    });

    // Inline edit buttons
    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-highlights', function(index){ const xs=authUtils.loadFromStorage('sportsHighlights')||[]; const x=xs[index]; if(!x) return; document.getElementById('highlight-title').value=x.title||''; document.getElementById('highlight-type').value=x.type||''; document.getElementById('event-name').value=x.eventName||''; document.getElementById('achievement-date').value=x.date||''; document.getElementById('performance-metrics').value=x.metrics||''; document.getElementById('ranking-position').value=x.ranking||''; document.getElementById('highlight-description').value=x.description||''; });
        window.enhancements.attachEditableList('#preview-training', function(index){ const xs=authUtils.loadFromStorage('sportsTraining')||[]; const x=xs[index]; if(!x) return; document.getElementById('training-title').value=x.title||''; document.getElementById('training-type').value=x.type||''; document.getElementById('training-duration').value=x.duration||''; document.getElementById('client-count').value=x.clientCount||''; document.getElementById('training-methodology').value=x.methodology||''; document.getElementById('training-results').value=x.results||''; });
        window.enhancements.attachEditableList('#preview-certifications', function(index){ const xs=authUtils.loadFromStorage('sportsCertifications')||[]; const x=xs[index]; if(!x) return; document.getElementById('cert-name').value=x.name||''; document.getElementById('cert-type').value=x.type||''; document.getElementById('cert-issuer').value=x.issuer||''; document.getElementById('cert-date').value=x.date||''; document.getElementById('cert-expiry').value=x.expiry||''; document.getElementById('cert-id').value=x.id||''; document.getElementById('cert-description').value=x.description||''; });
        window.enhancements.attachEditableList('#preview-media', function(index){ const xs=authUtils.loadFromStorage('sportsMedia')||[]; const x=xs[index]; if(!x) return; document.getElementById('media-title').value=x.title||''; document.getElementById('media-type').value=x.type||''; document.getElementById('media-platform').value=x.platform||''; document.getElementById('media-date').value=x.date||''; document.getElementById('media-description').value=x.description||''; document.getElementById('media-url').value=x.url||''; });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    const opt = {
        margin: 1,
        filename: 'sports-fitness-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// -------- Resume (Sports) --------
function buildResumeDataSports(){return { personalInfo:authUtils.loadFromStorage('sportsPersonalInfo')||{}, highlights:authUtils.loadFromStorage('sportsHighlights')||[], training:authUtils.loadFromStorage('sportsTraining')||[], certifications:authUtils.loadFromStorage('sportsCertifications')||[], media:authUtils.loadFromStorage('sportsMedia')||[], userEmail: authUtils.getCurrentUser().email||'' }}
function generateResumeForSports(){ const d=buildResumeDataSports(); const t=document.getElementById('resume-template-select')?.value||'minimal'; const p=d.personalInfo; let h=''; if(t==='creative'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''} — ${d.userEmail}</div><p>${p.bio||''}</p><h3>Highlights</h3>${d.highlights.slice(0,5).map(x=>`<div><strong>${x.title||''}</strong> — ${x.ranking||''}</div>`).join('')}</div>`;} else if(t==='modern'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;"><h2 style="margin:0;">${p.name||''}</h2><div style="color:#555;">${p.title||''} | ${d.userEmail}</div><h3>Training</h3>${d.training.slice(0,4).map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else if(t==='ats'){ h=`<div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;"><h2 style="margin:0;">${p.name||''}</h2><div>${p.title||''} | ${d.userEmail}</div><h3>Achievements</h3>${d.highlights.map(x=>`<div><strong>${x.title||''}</strong> — ${x.date||''}</div>`).join('')}</div>`;} else { h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''}</div><p>${p.bio||''}</p></div>`;} let pv=document.getElementById('resume-preview'); if(!pv){ const port=document.getElementById('portfolio-preview'); if(port){ const div=document.createElement('div'); div.id='resume-preview'; div.className='portfolio-preview'; port.insertAdjacentElement('afterend',div); pv=div; } } if(pv) pv.innerHTML=h; }
function exportResumePdfSports(){const el=document.getElementById('resume-preview'); if(!el) return; html2pdf().set({filename:'sports_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save();}
function exportResumeDocSports(){const el=document.getElementById('resume-preview'); if(!el) return; if(window.enhancements) window.enhancements.exportDocFromElement(el,'sports_resume.doc');}
function exportResumeJsonSports(){const d=buildResumeDataSports(); const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='sports_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}
function generateShareLinkSports(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('sports',slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url);} 
function generateQrSports(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('sports',slug):window.location.href; const img=document.getElementById('share-qr-img'); if(window.enhancements) window.enhancements.setQrImage(img,url);} 
