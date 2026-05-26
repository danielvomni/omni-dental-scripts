document.addEventListener('DOMContentLoaded', () => {
  const AUTH_PASSWORD_HASH = '8513fb218dcc9ce6bc4b3060e4ce56f7358aa5b2952e57574019345b0e0ccd46';
  const AUTH_SESSION_KEY = 'omniDentalScriptsAuth';
  const authForm = document.getElementById('auth-form');
  const authPassword = document.getElementById('auth-password');
  const authError = document.getElementById('auth-error');
  const clinicSelect = document.getElementById('clinic-select');
  const treatmentSelect = document.getElementById('treatment-select');
  const scriptContent = document.getElementById('script-content');
  const sidebar = document.getElementById('sidebar');
  const negativasPanel = document.getElementById('negativas-panel');
  const copyBtn = document.getElementById('copy-btn');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('clinic-search');
  const searchResults = document.getElementById('clinic-search-results');

  function unlockApp() {
    document.body.classList.remove('auth-locked');
    if (authError) authError.hidden = true;
  }

  async function hashPassword(value) {
    const encoded = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  if (sessionStorage.getItem(AUTH_SESSION_KEY) === AUTH_PASSWORD_HASH) {
    unlockApp();
  } else if (authPassword) {
    authPassword.focus();
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const attemptHash = await hashPassword(authPassword.value);
      if (attemptHash === AUTH_PASSWORD_HASH) {
        sessionStorage.setItem(AUTH_SESSION_KEY, AUTH_PASSWORD_HASH);
        authPassword.value = '';
        unlockApp();
      } else {
        authError.hidden = false;
        authPassword.select();
      }
    });
  }

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

  function selectClinicById(clinicId) {
    const clinic = CLINICS_DATA.find(c => c.id === clinicId);
    if (!clinic) return;
    clinicSelect.value = clinic.id;
    clinicSelect.dispatchEvent(new Event('change'));
    searchInput.value = clinic.name;
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
  }

  function renderSearchResults(clinics, query) {
    if (!query) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }

    const topMatches = clinics.slice(0, 8);
    searchResults.style.display = 'block';

    if (topMatches.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">No hay clínicas con ese nombre o ciudad.</div>';
      return;
    }

    searchResults.innerHTML = topMatches.map(c => `
      <button type="button" class="search-result" data-clinic-id="${c.id}">
        <span class="search-result-name">${c.name}</span>
        <span class="search-result-meta">${c.city || ''}</span>
      </button>
    `).join('');
  }

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = CLINICS_DATA.filter(c =>
      c.name.toLowerCase().includes(q)
      || (c.city || '').toLowerCase().includes(q)
      || (c.address || '').toLowerCase().includes(q)
      || (c.ref || '').toLowerCase().includes(q)
      || (c.id || '').toLowerCase().includes(q)
    );
    populateClinicSelect(filtered);
    renderSearchResults(filtered, q);
  });

  searchResults.addEventListener('click', (e) => {
    const result = e.target.closest('.search-result');
    if (!result) return;
    selectClinicById(result.dataset.clinicId);
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

    // Create a clean clinic copy with stripped postal codes.
    // Value points can now be overridden per treatment so the script only
    // mentions authority points that actually apply to the selected treatment.
    const explicitValuePoints = getExplicitTreatmentValue(clinic, 'valuePoints', treatment);
    const explicitPromo = getExplicitTreatmentValue(clinic, 'promo', treatment);
    const usesAllPromos = treatment === 'reprogramacion' || treatment === 'recontacto';
    const treatmentPromo = usesAllPromos
      ? (clinic.promo || '')
      : (explicitPromo !== undefined ? explicitPromo : getPromoForTreatment(clinic, treatment));
    const cleanClinic = Object.assign({}, clinic, {
      address: stripPostalCode(clinic.address),
      valuePoints: explicitValuePoints !== undefined ? explicitValuePoints : clinic.valuePoints,
      promo: treatmentPromo
    });

    // Update sidebar
    sidebar.style.display = 'block';
    document.getElementById('info-location').textContent = clinic.address;
    document.getElementById('info-ref').textContent = clinic.ref || '—';
    document.getElementById('info-offer').textContent = cleanClinic.promo || '—';
    document.getElementById('info-docs').textContent = clinic.qualifDoc || '—';
    document.getElementById('info-econ').textContent = clinic.qualifEcon || '—';
    document.getElementById('info-financing').textContent = clinic.financing || '—';

    const ayudasQuick = getTreatmentAwareValue(clinic, 'ayudas', treatment) || '';
    const segurosQuick = getTreatmentAwareValue(clinic, 'seguros', treatment) || '';
    const ayudasRow = document.getElementById('info-ayudas-row');
    const segurosRow = document.getElementById('info-seguros-row');
    const ayudasEl = document.getElementById('info-ayudas');
    const segurosEl = document.getElementById('info-seguros');

    if (ayudasRow && ayudasEl) {
      ayudasEl.textContent = ayudasQuick;
      ayudasRow.style.display = ayudasQuick ? '' : 'none';
    }
    if (segurosRow && segurosEl) {
      segurosEl.textContent = segurosQuick;
      segurosRow.style.display = segurosQuick ? '' : 'none';
    }

    renderScheduleInfo(clinic, treatment);

    // Qualif badge. En reprogramación no se vuelve a cualificar: el paciente ya fue validado previamente.
    const qualifBadge = document.getElementById('qualif-badge');
    const qualifStatus = document.getElementById('qualif-status');
    if (treatment === 'reprogramacion') {
      qualifBadge.style.display = 'none';
      qualifStatus.innerHTML = '';
    } else {
      qualifBadge.style.display = 'block';
      qualifStatus.innerHTML = `
        <span class="qualif-tag ${doEconQualif ? 'yes' : 'no'}">
          ${doEconQualif ? '✅ Cualificación económica activa' : '⚡ Sin cualificación económica (volumen)'}
        </span>
      `;
    }

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

  function renderScheduleInfo(clinic, treatment) {
    const scheduleCard = document.getElementById('schedule-card');
    const scheduleBox = document.getElementById('info-schedule');
    if (!scheduleCard || !scheduleBox) return;

    const rows = [];

    // En reprogramación no hay un tratamiento concreto seleccionado.
    // Por eso mostramos los horarios de todos los tratamientos activos de la clínica.
    if (treatment === 'reprogramacion') {
      const allSchedulesHtml = formatAllTreatmentSchedules(clinic);
      if (allSchedulesHtml) rows.push(allSchedulesHtml);
    } else {
      const scheduleData = getTreatmentAwareValue(clinic, 'horarios', treatment)
        || getTreatmentAwareValue(clinic, 'disponibilidadHoraria', treatment)
        || null;

      const duration = getTreatmentAwareValue(clinic, 'duracionCita', treatment)
        || getTreatmentAwareValue(clinic, 'duration', treatment)
        || '';

      if (scheduleData) {
        const scheduleHtml = formatSchedule(scheduleData);
        if (scheduleHtml) rows.push(`<div class="schedule-block">${scheduleHtml}</div>`);
      }

      if (duration) rows.push(`<div class="info-row compact"><span class="info-label">Duración de cita:</span><span>${escapeHtml(duration)}</span></div>`);
    }

    const reminder = getTreatmentAwareValue(clinic, 'recordatorio', treatment) || '';
    const whatsapp = getTreatmentAwareValue(clinic, 'whatsapp', treatment) || '';
    const sameDay = getTreatmentAwareValue(clinic, 'agendamientoMismoDia', treatment) || '';
    const longTerm = getTreatmentAwareValue(clinic, 'agendamientoLargoPlazo', treatment) || '';
    const locations = getTreatmentAwareValue(clinic, 'sedes', treatment) || clinic.sedes || null;

    if (reminder) rows.push(`<div class="info-row compact"><span class="info-label">Recordatorio:</span><span>${escapeHtml(reminder)}</span></div>`);
    if (whatsapp) rows.push(`<div class="info-row compact"><span class="info-label">WhatsApp:</span><span>${escapeHtml(whatsapp)}</span></div>`);
    if (sameDay) rows.push(`<div class="info-row compact"><span class="info-label">Agendamiento el mismo día:</span><span>${escapeHtml(sameDay)}</span></div>`);
    if (longTerm) rows.push(`<div class="info-row compact"><span class="info-label">Agendamiento a largo plazo:</span><span>${escapeHtml(longTerm)}</span></div>`);

    const locationsHtml = formatLocations(locations);
    if (locationsHtml) rows.push(`<div class="schedule-locations">${locationsHtml}</div>`);

    if (rows.length === 0) {
      scheduleCard.style.display = 'none';
      scheduleBox.innerHTML = '';
      return;
    }

    scheduleBox.innerHTML = rows.join('');
    scheduleCard.style.display = 'block';
  }

  function formatAllTreatmentSchedules(clinic) {
    const externalSchedules = (typeof CLINIC_SCHEDULES !== 'undefined') ? CLINIC_SCHEDULES : null;
    const externalClinic = externalSchedules ? (externalSchedules[clinic.id] || externalSchedules[clinic.name]) : null;
    const treatmentKeys = Array.from(new Set([
      ...(clinic.treatments || []),
      ...Object.keys((externalClinic && externalClinic.byTreatment) || {}),
      ...Object.keys(clinic.treatmentData || {}),
      ...Object.keys(clinic.byTreatment || {})
    ])).filter(Boolean);

    const blocks = treatmentKeys.map(key => {
      const scheduleData = getTreatmentAwareValue(clinic, 'horarios', key)
        || getTreatmentAwareValue(clinic, 'disponibilidadHoraria', key)
        || null;
      const duration = getTreatmentAwareValue(clinic, 'duracionCita', key)
        || getTreatmentAwareValue(clinic, 'duration', key)
        || '';
      const scheduleHtml = scheduleData ? formatSchedule(scheduleData) : '';
      if (!scheduleHtml && !duration) return '';

      const label = getTreatmentLabel(key);
      const durationHtml = duration
        ? `<div class="info-row compact"><span class="info-label">Duración de cita:</span><span>${escapeHtml(duration)}</span></div>`
        : '';
      return `<div class="schedule-treatment-block"><div class="schedule-treatment-title">${escapeHtml(label)}</div>${scheduleHtml}${durationHtml}</div>`;
    }).filter(Boolean);

    if (blocks.length > 0) return blocks.join('');

    const generalSchedule = getTreatmentAwareValue(clinic, 'horarios', 'implantes')
      || getTreatmentAwareValue(clinic, 'disponibilidadHoraria', 'implantes')
      || clinic.horarios
      || clinic.disponibilidadHoraria
      || null;
    const generalDuration = getTreatmentAwareValue(clinic, 'duracionCita', 'implantes')
      || getTreatmentAwareValue(clinic, 'duration', 'implantes')
      || clinic.duracionCita
      || '';

    const generalRows = [];
    const generalHtml = generalSchedule ? formatSchedule(generalSchedule) : '';
    if (generalHtml) generalRows.push(`<div class="schedule-block">${generalHtml}</div>`);
    if (generalDuration) generalRows.push(`<div class="info-row compact"><span class="info-label">Duración de cita:</span><span>${escapeHtml(generalDuration)}</span></div>`);
    return generalRows.join('');
  }

  function getTreatmentLabel(treatmentKey) {
    const tmplKey = treatmentKey;
    if (SCRIPT_TEMPLATES[tmplKey] && SCRIPT_TEMPLATES[tmplKey].label) {
      return SCRIPT_TEMPLATES[tmplKey].label;
    }

    const labels = {
      implantes: 'Implantes',
      implantes_fonseca: 'Implantes',
      ortodoncia: 'Ortodoncia',
      carillas: 'Carillas',
      blanqueamiento: 'Blanqueamiento',
      endodoncia: 'Endodoncia',
      periodoncia: 'Periodoncia',
      estetica_fhos: 'Estética',
      estetica_soler: 'Estética'
    };
    return labels[treatmentKey] || String(treatmentKey).replace(/_/g, ' ');
  }

  function getExplicitTreatmentValue(clinic, field, treatment) {
    if (!clinic) return undefined;

    const externalSchedules = (typeof CLINIC_SCHEDULES !== 'undefined') ? CLINIC_SCHEDULES : null;
    const externalClinic = externalSchedules ? (externalSchedules[clinic.id] || externalSchedules[clinic.name]) : null;

    if (externalClinic && externalClinic.byTreatment && externalClinic.byTreatment[treatment] && externalClinic.byTreatment[treatment][field] !== undefined) {
      return externalClinic.byTreatment[treatment][field];
    }

    if (clinic.treatmentData && clinic.treatmentData[treatment] && clinic.treatmentData[treatment][field] !== undefined) {
      return clinic.treatmentData[treatment][field];
    }

    if (clinic.byTreatment && clinic.byTreatment[treatment] && clinic.byTreatment[treatment][field] !== undefined) {
      return clinic.byTreatment[treatment][field];
    }

    return undefined;
  }

  function getTreatmentAwareValue(clinic, field, treatment) {
    if (!clinic) return null;

    const externalSchedules = (typeof CLINIC_SCHEDULES !== 'undefined') ? CLINIC_SCHEDULES : null;
    const externalClinic = externalSchedules ? (externalSchedules[clinic.id] || externalSchedules[clinic.name]) : null;

    if (externalClinic && externalClinic.byTreatment && externalClinic.byTreatment[treatment] && externalClinic.byTreatment[treatment][field] !== undefined) {
      return externalClinic.byTreatment[treatment][field];
    }

    if (externalClinic && externalClinic[field] !== undefined) {
      return externalClinic[field];
    }

    if (clinic.treatmentData && clinic.treatmentData[treatment] && clinic.treatmentData[treatment][field] !== undefined) {
      return clinic.treatmentData[treatment][field];
    }

    if (clinic.byTreatment && clinic.byTreatment[treatment] && clinic.byTreatment[treatment][field] !== undefined) {
      return clinic.byTreatment[treatment][field];
    }

    return clinic[field] !== undefined ? clinic[field] : null;
  }


  function getPromoForTreatment(clinic, treatment) {
    const promo = clinic && clinic.promo ? String(clinic.promo).trim() : '';
    if (!promo || promo === '—') return '';

    const segmentedPromo = extractSegmentedPromo(promo, treatment);
    if (segmentedPromo !== null) return segmentedPromo;

    // If the clinic has only one treatment, or the promotion does not mention
    // treatment-specific labels, the promotion is considered general.
    return promo;
  }

  function extractSegmentedPromo(promo, treatment) {
    const labels = [
      { key: 'implantes', names: ['Implantes', 'Implante', 'Implante+Corona', 'Implante + Corona', 'Dental'] },
      { key: 'ortodoncia', names: ['Ortodoncia', 'Ortodoncia Autoligada', 'Invisible', 'Brackets', 'Invisalign', 'Convencional'] },
      { key: 'carillas', names: ['Carillas'] },
      { key: 'blanqueamiento', names: ['Blanqueamiento'] },
      { key: 'estetica_fhos', names: ['Estética', 'FHOS', 'Medicina Estética'] },
      { key: 'estetica_soler', names: ['Estética', 'Armonización'] }
    ];

    const allNames = labels.flatMap(group => group.names);
    const escapedNames = allNames
      .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);

    const labelRegex = new RegExp(`(^|[.\\n]\\s*)(${escapedNames.join('|')})\\s*:`, 'gi');
    const matches = [];
    let match;
    while ((match = labelRegex.exec(promo)) !== null) {
      const label = match[2];
      const labelStart = match.index + match[1].length;
      const contentStart = labelRegex.lastIndex;
      matches.push({ label, labelStart, contentStart });
    }

    // No explicit treatment labels: keep the promotion as general.
    if (matches.length === 0) return null;

    const desiredKeys = getPromotionKeysForTreatment(treatment);
    const segments = [];
    const prefix = promo.slice(0, matches[0].labelStart).replace(/^[.;,\s]+|[.;,\s]+$/g, '').trim();

    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];
      const labelKey = getKeyForPromoLabel(current.label, labels);
      if (!desiredKeys.includes(labelKey)) continue;

      const end = next ? next.labelStart : promo.length;
      const rawContent = promo.slice(current.contentStart, end).trim();
      const cleanedContent = rawContent.replace(/^[.;,\s]+|[.;,\s]+$/g, '').trim();
      if (!cleanedContent) continue;

      const readableLabel = shouldKeepPromoLabel(current.label) ? `${current.label}: ` : '';
      segments.push(`${readableLabel}${cleanedContent}`);
    }

    if (segments.length === 0) return '';
    const prefixText = prefix && prefix.length <= 80 && !prefix.includes(':') ? `${prefix}. ` : '';
    return `${prefixText}${segments.join('. ')}`;
  }

  function shouldKeepPromoLabel(label) {
    const genericLabels = ['implantes', 'implante', 'ortodoncia', 'carillas', 'blanqueamiento', 'dental', 'estetica'];
    return !genericLabels.includes(normalizeText(label));
  }

  function getPromotionKeysForTreatment(treatment) {
    const map = {
      implantes: ['implantes'],
      implantes_fonseca: ['implantes'],
      ortodoncia: ['ortodoncia'],
      carillas: ['carillas'],
      blanqueamiento: ['blanqueamiento'],
      estetica_fhos: ['estetica_fhos'],
      estetica_soler: ['estetica_soler']
    };
    return map[treatment] || [treatment];
  }

  function getKeyForPromoLabel(label, groups) {
    const normalized = normalizeText(label);
    const match = groups.find(group => group.names.some(name => normalizeText(name) === normalized));
    return match ? match.key : normalized;
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function formatSchedule(scheduleData) {
    if (!scheduleData) return '';

    if (typeof scheduleData === 'string') {
      return `<div class="schedule-text">${escapeHtml(scheduleData).replace(/\n/g, '<br>')}</div>`;
    }

    if (Array.isArray(scheduleData)) {
      return scheduleData
        .filter(Boolean)
        .map(item => `<div class="schedule-line">${escapeHtml(String(item))}</div>`)
        .join('');
    }

    if (typeof scheduleData === 'object') {
      const dayLabels = {
        lunes: 'Lunes',
        martes: 'Martes',
        miercoles: 'Miércoles',
        miércoles: 'Miércoles',
        jueves: 'Jueves',
        viernes: 'Viernes',
        sabado: 'Sábado',
        sábado: 'Sábado',
        domingo: 'Domingo'
      };

      const preferredOrder = ['lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo'];
      const rendered = [];
      const used = new Set();

      preferredOrder.forEach(day => {
        if (scheduleData[day]) {
          rendered.push(`<div class="schedule-line"><strong>${dayLabels[day]}:</strong> ${escapeHtml(scheduleData[day])}</div>`);
          used.add(day);
        }
      });

      Object.keys(scheduleData).forEach(key => {
        if (used.has(key) || !scheduleData[key]) return;
        rendered.push(`<div class="schedule-line"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(scheduleData[key])}</div>`);
      });

      return rendered.join('');
    }

    return '';
  }

  function formatLocations(locations) {
    if (!locations) return '';

    if (typeof locations === 'string') {
      return `<div class="schedule-note"><strong>Sedes:</strong><br>${escapeHtml(locations).replace(/\n/g, '<br>')}</div>`;
    }

    if (!Array.isArray(locations)) return '';

    const items = locations
      .filter(Boolean)
      .map(location => {
        if (typeof location === 'string') return `<li>${escapeHtml(location)}</li>`;

        const name = location.nombre || location.name || 'Sede';
        const address = location.direccion || location.address || '';
        const locationSchedule = formatSchedule(location.horarios || location.disponibilidadHoraria);
        const duration = location.duracionCita ? `<div><strong>Duración:</strong> ${escapeHtml(location.duracionCita)}</div>` : '';

        return `<li><strong>${escapeHtml(name)}</strong>${address ? `<br>${escapeHtml(address)}` : ''}${locationSchedule ? `<div class="schedule-subblock">${locationSchedule}</div>` : ''}${duration}</li>`;
      })
      .join('');

    return items ? `<div class="schedule-note"><strong>Sedes disponibles:</strong><ul class="schedule-list">${items}</ul></div>` : '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
