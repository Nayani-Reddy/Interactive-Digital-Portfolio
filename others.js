// Others / General Dashboard JavaScript

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

    loadOthersData();
    setupFormListeners();

    if (window.enhancements) {
        window.enhancements.ensureActionBar('#portfolio-preview', {
            onTemplateChange: () => generateResumeForOthers(),
            onExportPdf: () => exportResumePdfOthers(),
            onExportDoc: () => exportResumeDocOthers(),
            onExportJson: () => exportResumeJsonOthers(),
            onGenerateShare: () => generateShareLinkOthers(),
            onGenerateQr: () => generateQrOthers()
        });
    }
});

function setupFormListeners() {
    document.getElementById('personal-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const personalInfo = {
            name: document.getElementById('others-name').value,
            title: document.getElementById('others-title').value,
            email: document.getElementById('others-email').value,
            website: document.getElementById('others-website').value,
            bio: document.getElementById('others-bio').value
        };
        authUtils.saveToStorage('othersPersonalInfo', personalInfo);
        alert('Profile saved successfully!');
    });

    document.getElementById('item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const item = {
            type: document.getElementById('item-type').value,
            title: document.getElementById('item-title').value,
            date: document.getElementById('item-date').value,
            link: document.getElementById('item-link').value,
            description: document.getElementById('item-description').value
        };
        let items = authUtils.loadFromStorage('othersItems') || [];
        items.push(item);
        authUtils.saveToStorage('othersItems', items);
        document.getElementById('item-form').reset();
        alert('Item added successfully!');
    });
}

function loadOthersData() {
    const personalInfo = authUtils.loadFromStorage('othersPersonalInfo');
    if (personalInfo) {
        document.getElementById('others-name').value = personalInfo.name || '';
        document.getElementById('others-title').value = personalInfo.title || '';
        document.getElementById('others-email').value = personalInfo.email || '';
        document.getElementById('others-website').value = personalInfo.website || '';
        document.getElementById('others-bio').value = personalInfo.bio || '';
    }
}

function generatePortfolio() {
    const personalInfo = authUtils.loadFromStorage('othersPersonalInfo');
    const items = authUtils.loadFromStorage('othersItems') || [];

    if (personalInfo) {
        document.getElementById('preview-name').textContent = personalInfo.name || 'Your Name';
        document.getElementById('preview-title').textContent = personalInfo.title || 'Your Title/Role';
        document.getElementById('preview-website').textContent = personalInfo.website || '';
        document.getElementById('preview-bio').textContent = personalInfo.bio || 'Your bio will appear here...';
    }

    const container = document.getElementById('preview-items');
    container.innerHTML = '<h3 style="margin: 2rem 0 1rem 0;">🗂️ Items</h3>';
    items.forEach((it, index) => {
        const d = document.createElement('div');
        d.className = 'project-card';
        d.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h3>${it.title || ''}</h3>
            </div>
            ${it.type ? `<p><strong>Type:</strong> ${it.type}</p>` : ''}
            ${it.date ? `<p><strong>Date:</strong> ${it.date}</p>` : ''}
            <div style="margin:1rem 0;"><strong>Description:</strong><br>${it.description || ''}</div>
            ${it.link ? `<div class="project-links"><a href="${it.link}" target="_blank">Open Link</a></div>` : ''}
        `;
        container.appendChild(d);
    });

    if (window.enhancements) {
        window.enhancements.attachEditableList('#preview-items', function(index){
            const xs = authUtils.loadFromStorage('othersItems')||[]; const x = xs[index]; if(!x) return;
            document.getElementById('item-type').value = x.type||'';
            document.getElementById('item-title').value = x.title||'';
            document.getElementById('item-date').value = x.date||'';
            document.getElementById('item-link').value = x.link||'';
            document.getElementById('item-description').value = x.description||'';
        });
    }
}

function downloadPortfolio() {
    const element = document.getElementById('portfolio-preview');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'others-portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
}

// Resume builder (Others)
function buildResumeDataOthers(){return { personalInfo:authUtils.loadFromStorage('othersPersonalInfo')||{}, items:authUtils.loadFromStorage('othersItems')||[], userEmail:authUtils.getCurrentUser().email||'' }}
function generateResumeForOthers(){ const d=buildResumeDataOthers(); const t=document.getElementById('resume-template-select')?.value||'minimal'; const p=d.personalInfo; let h=''; if(t==='creative'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:900px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''} — ${d.userEmail}</div><p>${p.bio||''}</p><h3>Highlights</h3>${d.items.slice(0,5).map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else if(t==='modern'){ h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;border:1px solid #eee;border-radius:8px;padding:16px;"><h2 style="margin:0;">${p.name||''}</h2><div style="color:#555;">${p.title||''} | ${d.userEmail}</div><h3>Items</h3>${d.items.slice(0,6).map(x=>`<div><strong>${x.title||''}</strong> — ${x.date||''}</div>`).join('')}</div>`;} else if(t==='ats'){ h=`<div style="font-family:Arial, Helvetica, sans-serif;max-width:800px;margin:auto;"><h2 style="margin:0;">${p.name||''}</h2><div>${p.title||''} | ${d.userEmail}</div><h3>Entries</h3>${d.items.map(x=>`<div><strong>${x.title||''}</strong> — ${x.type||''}</div>`).join('')}</div>`;} else { h=`<div style="font-family:'Poppins',sans-serif;max-width:800px;margin:auto;"><h1 style="margin:0;">${p.name||''}</h1><div style="color:#555;">${p.title||''}</div><p>${p.bio||''}</p></div>`;} let pv=document.getElementById('resume-preview'); if(!pv){ const port=document.getElementById('portfolio-preview'); if(port){ const div=document.createElement('div'); div.id='resume-preview'; div.className='portfolio-preview'; port.insertAdjacentElement('afterend',div); pv=div; } } if(pv) pv.innerHTML=h; }
function exportResumePdfOthers(){const el=document.getElementById('resume-preview'); if(!el) return; html2pdf().set({filename:'others_resume.pdf', margin:0.5, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'}}).from(el).save();}
function exportResumeDocOthers(){const el=document.getElementById('resume-preview'); if(!el) return; if(window.enhancements) window.enhancements.exportDocFromElement(el,'others_resume.doc');}
function exportResumeJsonOthers(){const d=buildResumeDataOthers(); const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='others_resume.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}
function generateShareLinkOthers(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('others',slug):window.location.href; navigator.clipboard?.writeText(url).catch(()=>{}); alert('Shareable link copied:\n'+url);} 
function generateQrOthers(){const slug=document.getElementById('shareable-slug')?.value||''; const url=window.enhancements? window.enhancements.buildShareLink('others',slug):window.location.href; const img=document.getElementById('share-qr-img'); if(window.enhancements) window.enhancements.setQrImage(img,url);} 


