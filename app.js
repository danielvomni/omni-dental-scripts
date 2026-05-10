document.addEventListener('DOMContentLoaded', () => {
  const clinicSelect = document.getElementById('clinic-select');
  const treatmentSelect = document.getElementById('treatment-select');
  const scriptContent = document.getElementById('script-content');
  const sidebar = document.getElementById('sidebar');
  const negativasPanel = document.getElementById('negativas-panel');
  const copyBtn = document.getElementById('copy-btn');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('clinic-search');

  // Stats
  document.getElementById('stat-clinics').textContent = CLINICS_DATA.length;

  // Populate clinic selector
  searchBar.style.display = 'block';
  CLINICS_DATA.sort((a, b) => a.name.localeCompare(b.name));
  populateClinicSelect(CLINICS_DATA);

  function populateClinicSelect(clinics) {
    clinicSelect.innerHTML = '<option value="">-- Seleccione Clínica --</option>';
    clinics.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.city || ''})`;
      clinicSelect.appendChild(opt);
    });
  }

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = CLINICS_DATA.filter(c =>
      c.name.toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q)
    );
    populateClinicSelect(filtered);
  });

  // Clinic change → populate treatments
  clinicSelect.addEventListener('change', () => {
    const clinic = CLINICS_DATA.find(c => c.id === clinicSelect.value);
    if (!clinic) {
      treatmentSelect.disabled = true;
      treatmentSelect.innerHTML = '<option value="">-- Primero elija clínica --</option>';
      resetUI();
      return;
    }
    treatmentSelect.disabled = false;
    treatmentSelect.innerHTML = '<option value="">-- Seleccione Tratamiento --</option>';

    clinic.treatments.forEach(t => {
      const tmpl = SCRIPT_TEMPLATES[t] || SCRIPT_TEMPLATES[getScriptKey(clinic, t)];
      if (!tmpl) return;
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = `${tmpl.icon} ${tmpl.label}`;
      treatmentSelect.appendChild(opt);
    });

    ['reprogramacion', 'recontacto'].forEach(t => {
      const tmpl = SCRIPT_TEMPLATES[t];
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = `${tmpl.icon} ${tmpl.label}`;
      treatmentSelect.appendChild(opt);
    });

    if (clinic.treatments.length === 1) {
      treatmentSelect.value = clinic.treatments[0];
      renderScript(clinic, clinic.treatments[0]);
    } else {
      resetUI();
    }
  });

  // Treatment change → render script
  treatmentSelect.addEventListener('change', () => {
    const clinic = CLINICS_DATA.find(c => c.id === clinicSelect.value);
    if (!clinic || !treatmentSelect.value) { resetUI(); return; }
    renderScript(clinic, treatmentSelect.value);
  });

  function getScriptKey(clinic, treatment) {
    if (clinic.scriptOverrides && clinic.scriptOverrides[treatment]) {
      return clinic.scriptOverrides[treatment];
    }
    return treatment;
  }

  // Strip postal codes (5 digits) from addresses for script display
  function stripPostalCode(addr) {
    return (addr || '').replace(/,?\s*\d{5}\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }

  function shouldEconQualify(clinic, treatment) {
    if (!clinic.econQualif) return false;
    if (treatment === 'implantes' || treatment === 'implantes_fonseca') return true;
    if (clinic.econQualifAll) return true;
    return false;
  }

  function renderScript(clinic, treatment) {
    const scriptKey = getScriptKey(clinic, treatment);
    const tmpl = SCRIPT_TEMPLATES[scriptKey];
    if (!tmpl) { scriptContent.innerHTML = '<p>Script no encontrado.</p>'; return; }

    const doEconQualif = shouldEconQualify(clinic, treatment);

    // Create a clean clinic copy with stripped postal codes
    const cleanClinic = Object.assign({}, clinic, {
      address: stripPostalCode(clinic.address)
    });

    // Update sidebar
    sidebar.style.display = 'block';
    document.getElementById('info-location').textContent = clinic.address;
    document.getElementById('info-ref').textContent = clinic.ref || '—';
    document.getElementById('info-offer').textContent = clinic.promo || '—';
    document.getElementById('info-docs').textContent = clinic.qualifDoc || '—';
    document.getElementById('info-econ').textContent = clinic.qualifEcon || '—';
    document.getElementById('info-financing').textContent = clinic.financing || '—';

    // Qualif badge
    const qualifBadge = document.getElementById('qualif-badge');
    qualifBadge.style.display = 'block';
    const qualifStatus = document.getElementById('qualif-status');
    qualifStatus.innerHTML = `
      <span class="qualif-tag ${doEconQualif ? 'yes' : 'no'}">
        ${doEconQualif ? '✅ Cualificación económica activa' : '⚡ Sin cualificación económica (volumen)'}
      </span>
    `;

    // Build script HTML
    let html = `<div class="script-header">
      <span class="script-icon">${tmpl.icon}</span>
      <div>
        <h2>${tmpl.label}</h2>
        <span class="script-clinic">${clinic.name}</span>
      </div>
    </div>`;

    let stepNum = 0;
    tmpl.steps.forEach((step, i) => {
      const isEconStep = step.condition === 'econQualif';
      if (isEconStep && !doEconQualif) return;

      if (step.skipIfEmpty) {
        const val = cleanClinic[step.skipIfEmpty];
        if (!val || val.trim() === '') return;
      }

      stepNum++;
      const isHighlight = step.highlight ? ' highlight' : '';
      html += `<div class="step-container${isHighlight}">
        <div class="step-title"><span class="step-number">${stepNum}</span>${step.title}</div>
        <div class="step-text">${formatText(step.text(cleanClinic))}</div>`;

      if (step.note) {
        const noteContent = typeof step.note === 'function' ? step.note(cleanClinic) : step.note;
        html += `<div class="step-note">${noteContent}</div>`;
      }

      if (step.rebate) {
        const rebateId = `neg-${i}`;
        html += `<button class="btn-toggle" onclick="toggleNegativa('${rebateId}')">⚠ Si no cumple criterios</button>
          <div class="conditional-box" id="${rebateId}">${formatText(step.rebate(cleanClinic))}</div>`;
      }

      html += `</div>`;
    });

    scriptContent.innerHTML = html;
    scriptContent.classList.remove('empty-state');

    // Negativas panel (objeciones)
    if (tmpl.rebates && tmpl.rebates.length > 0) {
      negativasPanel.style.display = 'block';
      let negHtml = '';
      tmpl.rebates.forEach((r, i) => {
        negHtml += `<div class="negativa-item">
          <div class="negativa-header" onclick="toggleNegativaItem(this)">
            <span>${r.label}</span><span class="arrow">▶</span>
          </div>
          <div class="negativa-body">
            <p>${r.response}</p>
            <div class="cierre">Cierre: "${r.cierre}"</div>
          </div>
        </div>`;
      });
      document.getElementById('negativas-list').innerHTML = negHtml;
    } else {
      negativasPanel.style.display = 'none';
    }
  }

  function formatText(text) {
    return (text || '').replace(/\n/g, '<br>');
  }

  function resetUI() {
    sidebar.style.display = 'none';
    negativasPanel.style.display = 'none';
    scriptContent.className = 'empty-state';
    scriptContent.innerHTML = `
      <div class="empty-logo">
        <span class="empty-omni">OMNI</span>
        <span class="empty-dental">Dental</span>
      </div>
      <p class="empty-sub">Scripts</p>
      <p class="empty-desc">Seleccione una clínica y tratamiento para generar el guion.</p>
      <div class="stats-row">
        <div class="stat"><span class="stat-num">${CLINICS_DATA.length}</span><span class="stat-label">Clínicas</span></div>
        <div class="stat"><span class="stat-num">10</span><span class="stat-label">Guiones</span></div>
        <div class="stat"><span class="stat-num">6</span><span class="stat-label">Tratamientos</span></div>
      </div>`;
  }

  // Copy
  copyBtn.addEventListener('click', () => {
    const text = scriptContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.innerText = '¡Copiado!';
      setTimeout(() => copyBtn.innerText = '📋 Copiar Todo', 2000);
    });
  });
});

// Global toggle functions
function toggleNegativa(id) {
  const el = document.getElementById(id);
  el.classList.toggle('active');
  el.previousElementSibling.classList.toggle('active');
}
function toggleNegativaItem(header) {
  header.classList.toggle('open');
  header.nextElementSibling.classList.toggle('open');
}
