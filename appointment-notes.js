(function (root) {
  'use strict';
  const labels = {
    implantes: 'Implantes dentales', implantes_fonseca: 'Implantes dentales',
    ortodoncia: 'Ortodoncia', blanqueamiento: 'Blanqueamiento dental',
    carillas: 'Carillas', estetica_fhos: 'FHOS Bioluminiscente', apnea: 'Apnea del sueño', estetica_medica: 'Estética médica'
  };
  const clean = value => String(value || '').replace(/[\r\n\t]+/g, ' ').trim();
  // Separar respuestas ya validadas del texto principal; no crear nuevos criterios.
  function conditionalStep(step, clinic) {
    const text=step.text(clinic);
    const fonsecaStart=text.indexOf('→ Si dice que SÍ (está en ASNEF):');
    if(fonsecaStart>=0) {
      const end=text.indexOf('(Solo si el paciente sí cualifica',fonsecaStart);
      return {text:(text.slice(0,fonsecaStart)+(end>=0?text.slice(end):'')).trim(),response:text.slice(fonsecaStart,end>=0?end:undefined).trim(),kind:'incomeOrAsnef',consumesRebate:false};
    }
    const special = /DNI \+ 1–3 PIEZAS/.test(step.title) ? {marker:/Si SÍ aparece en ASNEF/,kind:'asnef'}
      : /DNI \+ 4 PIEZAS/.test(step.title) ? {marker:/Si no cumple/,kind:'incomeDni'}
      : /CUALIFICACIÓN – NIE/.test(step.title) ? {marker:/Si no cumple/,kind:'incomeNie'} : null;
    if(special) {
      const match=special.marker.exec(text);
      if(match) return {text:text.slice(0,match.index).trim(),response:text.slice(match.index).trim(),kind:special.kind,consumesRebate:false};
    }
    const document=/cualificaci[oó]n documental|documentaci[oó]n para financiaci[oó]n/i.test(step.title);
    const economic=/cualificaci[oó]n econ[oó]mica/i.test(step.title);
    const marker=document ? /(?:→\s*)+Si NO tiene documento válido:/i
      : economic ? /SI TIENE MENOS DE 1\.200 €:|(?:→\s*)?Si NO cumple con todos los requisitos para financiar\s*:|Si no cumple con los requisitos:|Si menciona ingresos irregulares o ambiguos\s*:/i : null;
    const match=marker && marker.exec(text);
    if(match) return {text:text.slice(0,match.index).trim(),response:text.slice(match.index).trim(),kind:document?'document':/SI TIENE MENOS/.test(match[0])?'minimumIncome':'income',consumesRebate:false};
    if((document || economic) && step.rebate) return {text,response:step.rebate(clinic),kind:document?'document':'income',consumesRebate:true};
    return {text,response:'',kind:'',consumesRebate:false};
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return year >= 1900 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  function calendarDate(day, month, reference = new Date()) {
    if (!day || !month) return '';
    const todayMonth = reference.getMonth() + 1;
    const nextYear = Number(month) < todayMonth || (Number(month) === todayMonth && Number(day) < reference.getDate());
    const year = reference.getFullYear() + (nextYear ? 1 : 0);
    const value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return validDate(value) ? value : '';
  }
  const baseValidTime = value => /^(0[89]|1\d):(00|05|10|15|20|25|30|35|40|45|50|55)$|^20:00$/.test(value || '');
  function lastMinute(context, date) {
    return context?.clinic?.id === 'caredentjerez' && validDate(date) && new Date(date + 'T12:00:00Z').getUTCDay() === 2 ? 30 : 0;
  }
  function validTime(value, context, date) {
    return baseValidTime(value) || (lastMinute(context, date) === 30 && /^20:(05|10|15|20|25|30)$/.test(value || ''));
  }
  // Sitúa cada respuesta junto a la pregunta, sin alterar las plantillas validadas.
  function placements(steps, reschedule = false) {
    const find = (pattern, fallback) => steps.find(step => pattern.test(step.title))?.index ?? fallback;
    const first = steps[0]?.index;
    const need = find(/motivo|identificar el tratamiento/i, first);
    const document = find(/cualificaci[oó]n documental|documentaci[oó]n para financiaci[oó]n/i, need);
    const economic = find(/cualificaci[oó]n econ[oó]mica/i, document);
    const appointment = find(/agendamiento|agendar nueva cita/i, find(/confirmaci[oó]n|despedida|resumen|cierre/i, steps.at(-1)?.index));
    return reschedule ? { appointment } : { need, pieces: need, document, economic, asnef: find(/incidencias de pago|1–3 PIEZAS/i,economic), meta: need, appointment };
  }
  function policyFor(clinic, treatment, rules, templates) {
    if (!clinic) return { qualification: 'none', document: false, economic: false, asnef: false, maxReschedules: null };
    const configured = rules[clinic.id] || {};
    if (treatment === 'reprogramacion') return {
      qualification: 'reschedule', document: false, economic: false, asnef: false,
      maxReschedules: configured.maxReschedules ?? null, rescheduleCondition: configured.rescheduleCondition || '', clinicConfirmsAppointment: Boolean(configured.clinicConfirmsAppointment)
    };
    const key = clinic.scriptOverrides?.[treatment] || treatment;
    const template = templates[key];
    const economic = Boolean(clinic.econQualif && (clinic.econQualifAll || ['implantes', 'implantes_fonseca'].includes(treatment)) && template?.steps.some(step => step.condition === 'econQualif' || /cualificaci[oó]n econ[oó]mica/i.test(step.title)));
    const document = Boolean(template?.steps.some(step => /cualificaci[oó]n documental/i.test(step.title)));
    const policy = {
      qualification: economic ? 'operator' : document ? 'document' : 'none',
      document, economic, asnef: false, maxReschedules: configured.maxReschedules ?? null, rescheduleCondition: configured.rescheduleCondition || '',
      ...configured.treatments?.[treatment]
    };
    policy.needRequired = Boolean(policy.needRequired || policy.document || policy.economic);
    return policy;
  }
  // Solo listas documentales cerradas y reglas económicas explícitas. Los
  // criterios ambiguos se muestran para revisión, nunca como aprobación.
  const normalize = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function criteriaFor(clinic, treatment, policy, readValue = (c, key) => c?.[key]) {
    const documentText = clean(readValue(clinic, 'qualifDoc', treatment));
    const economicText = String(readValue(clinic, 'qualifEcon', treatment) || '').trim();
    const doc = normalize(documentText);
    const closedDocuments = /^(dni|nie|pasaporte)(\s*(,|\/|o)\s*(dni|nie|pasaporte))*$/.test(doc);
    let documents = closedDocuments ? ['DNI', 'NIE', 'Pasaporte'].filter(value => doc.includes(normalize(value))) : null;
    if (doc === 'cualquier documento valido') documents = ['DNI', 'NIE', 'Pasaporte'];
    let conditionalDocument = '';
    if (doc === 'dni / nie comunitario') { documents = ['DNI', 'NIE']; conditionalDocument = 'NIE'; }
    const econ = normalize(economicText);
    const standard = ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva'];
    const simpleList = /^(nomina|cuenta bancaria o tarjeta|jubilados|terceros|autonomos|pension contributiva \(jubilados\))(,\s*(nomina|cuenta bancaria o tarjeta|jubilados|terceros|autonomos|pension contributiva \(jubilados\)))*$/.test(econ);
    const incomes = simpleList ? [
      ...(econ.includes('nomina') ? ['Nómina'] : []),
      ...(econ.includes('autonomos') ? ['Autónomo'] : []),
      ...(econ.includes('jubilados') ? ['Jubilación', 'Pensión contributiva'] : []),
      ...(econ.includes('cuenta bancaria') ? ['Cuenta bancaria o tarjeta'] : [])
    ] : null;
    const thirdIncomes = simpleList && econ.includes('terceros') ? standard : null;
    const contributiveOnly = econ.includes('contributiva');
    const allIncomeTypes = econ === 'se acepta todo menos asnef';
    return { documentText, economicText, documents, conditionalDocument, incomes, thirdIncomes, contributiveOnly, allIncomeTypes, ...policy.criteria };
  }
  function answerStatus(criteria, kind, value, documentValue = '') {
    if (!value) return { status: '', message: '' };
    const review = message => ({ status: 'review', message: `Revisar: ${message}` });
    const rejected = message => ({ status: 'rejected', message: `No permitido: ${message}` });
    if (value === 'No especifica' || value === 'Otro') return review('falta confirmar la respuesta y los criterios de la clínica.');
    if (kind === 'document') {
      if (criteria.conditionalDocument === value) return review('debe ser NIE comunitario.');
      if (criteria.conditionalDocument === 'exceptDNI' && value !== 'DNI') return review(criteria.documentExceptionMessage);
      if (!criteria.documents) return review('la ficha no define una lista cerrada de documentación.');
      if (!criteria.documents.includes(value)) return rejected(`${value} no está entre los documentos admitidos (${criteria.documentText}).`);
      return { status: '', message: '' };
    }
    if (criteria.allIncomeTypes) return { status: '', message: '' };
    if (criteria.contextRequired) return review('el criterio depende del documento y del número de piezas; consulta el guion específico y al manager.');
    if (criteria.assistanceReview && ['Ayuda','Pensión no contributiva'].includes(value)) return review('la ficha contempla ayudas con condiciones; confirma importe, documentación y requisitos con el manager.');
    let allowed = kind === 'thirdIncome' ? criteria.thirdIncomes : criteria.incomes;
    if (kind === 'income' && criteria.incomeByDocument) {
      allowed = criteria.incomeByDocument[documentValue];
      if (!allowed) return review('confirma primero la documentación para consultar su ruta.');
    }
    if (value === 'Pensión no contributiva' && !criteria.contributiveOnly) return review('la ficha no aclara si se admite una pensión no contributiva.');
    if (!allowed) return review('comprueba las condiciones económicas de la ficha; no hay una regla cerrada configurada para esta respuesta.');
    if (!allowed.includes(value)) return rejected(`${value} no se admite como solvencia ${kind === 'thirdIncome' ? 'del tercero' : 'propia'}. ${kind === 'income' && criteria.thirdIncomes ? 'Si hay un tercero, verifica sus requisitos por separado.' : 'Consulta con el manager antes de agendar.'}`);
    if (kind === 'income' && criteria.reviewByDocument?.[documentValue]?.includes(value)) return review('esta ruta exige importe, antigüedad u otras condiciones. Comprueba la ficha antes de agendar.');
    return { status: '', message: '' };
  }
  function blankDraft(reschedule = false) {
    return { date: '', time: '', day: '', month: '', hour: '', minute: '00', appointmentNumber: reschedule ? '' : '1', need: '', pieces: '', document: '',
      income: '', amount: '', amountComparison: '', incomeDetail: '', third: false,
      thirdIncome: '', thirdAmount: '', thirdComparison: '', thirdDetail: '', asnef: '', metaDetails: false,
      budgetFit: '', paymentMethod: '', previousAssessment: '', availability: '' };
  }
  function incomeLine(kind, amount, comparison, detail) {
    const money = clean(amount) ? `${comparison === 'more' ? 'más de ' : ''}${clean(amount)} €` : '';
    return [clean(kind), money, clean(detail)].filter(Boolean).join(' · ');
  }
  function buildNote(draft, context) {
    context = effectiveContext(context, draft);
    const { treatment, policy } = context;
    const reschedule = treatment === 'reprogramacion';
    const date = validDate(draft.date) ? draft.date.slice(8, 10) + '/' + draft.date.slice(5, 7) : '[fecha]';
    const time = validTime(draft.time, context, draft.date) ? draft.time : '[hora]';
    const labelPrefix = reschedule ? (policy.clinicConfirmsAppointment ? 'Solicita reprogramación:' : 'Reprograma') : policy.clinicConfirmsAppointment ? 'Disponibilidad aproximada:' : policy.appointmentTentative ? 'Preagenda provisional' : 'Cita';
    const lines = [`${labelPrefix} ${date} ${time}`];
    if (policy.clinicConfirmsAppointment) lines[0] = `${reschedule ? 'Solicita reprogramación. ' : ''}Disponibilidad: ${clean(draft.availability) || '[disponibilidad]'}`;
    if (reschedule) return lines[0] + (policy.clinicConfirmsAppointment ? '\nFecha y hora pendientes de confirmar por la clínica.' : '');
    const label = labels[treatment] || (['recontacto', ''].includes(treatment) ? '' : clean(treatment));
    const need = clean(draft.need);
    if (label || need) lines.push([label, need].filter(Boolean).join(', '));
    if (policy.zenRoutes && draft.pieces) lines.push('Necesidad aproximada: ' + ({small:'1–3 piezas',large:'4 piezas o más',full:'Rehabilitación completa'})[draft.pieces]);
    if (policy.clinicConfirmsAppointment) {
      lines.push('Encaja inversión: ' + (clean(draft.budgetFit) || '[respuesta]'));
      lines.push('Pago previsto: ' + (clean(draft.paymentMethod) || '[respuesta]'));
      lines.push('Valoración o presupuesto previo: ' + (clean(draft.previousAssessment) || '[respuesta]'));
      lines.push('Fecha y hora pendientes de confirmar por la clínica.');
      return lines.join('\n');
    }
    const includeMeta = policy.qualification === 'meta' && draft.metaDetails;
    if ((policy.document || includeMeta) && draft.document) lines.push(clean(draft.document));
    if (policy.economic || includeMeta) {
      const income = incomeLine(draft.income, draft.amount, draft.amountComparison, draft.incomeDetail);
      if (income) lines.push(income);
      if (draft.third) {
        const third = incomeLine(draft.thirdIncome, draft.thirdAmount, draft.thirdComparison, draft.thirdDetail);
        if (third) lines.push('Tercero: ' + third);
      }
    }
    if (policy.asnef && draft.asnef) lines.push('ASNEF: ' + clean(draft.asnef));
    if (policy.appointmentTentative) lines.push('Recepción de la clínica confirmará la cita.');
    return lines.join('\n');
  }
  function validate(draft, context) {
    context = effectiveContext(context, draft);
    const { clinic, treatment, policy } = context;
    const errors = [];
    if (!clinic) errors.push('Selecciona una clínica.');
    if (!treatment) errors.push('Selecciona un tratamiento.');
    if (clinic?.inactive) errors.push('Esta clínica ya no está activa.');
    if (policy.noteBlocked) errors.push('Falta integrar el guion validado de este tratamiento. Consulta al manager.');
    if (policy.clinicConfirmsAppointment) {
      if (!clean(draft.availability)) errors.push('Indica la disponibilidad del paciente.');
    } else {
      if (!validDate(draft.date)) errors.push('Indica la fecha de la cita.');
      if (!validTime(draft.time, context, draft.date)) errors.push(draft.time ? 'Selecciona una hora válida en los controles de cita.' : 'Indica la hora de la cita.');
    }
    const number = Number(draft.appointmentNumber);
    const minimum = treatment === 'reprogramacion' ? 2 : 1;
    if (!Number.isInteger(number) || number < minimum) errors.push(`Indica el número de cita (mínimo ${minimum}).`);
    if (treatment !== 'reprogramacion') {
      if (treatment === 'recontacto' && !clean(draft.need)) errors.push('Indica el tratamiento y la necesidad del paciente.');
      else if (policy.needRequired && !clean(draft.need)) errors.push('Indica la necesidad del paciente.');
      if (policy.clinicConfirmsAppointment && [draft.budgetFit, draft.paymentMethod, draft.previousAssessment].some(value => !value)) errors.push('Registra inversión, forma de pago y valoración o presupuesto previo.');
      if (policy.document && !draft.document) errors.push('Selecciona la documentación o «No especifica».');
      if (policy.zenRoutes && !draft.pieces) errors.push('Indica el número aproximado de piezas para elegir la ruta de Zen Dental.');
      if (policy.amountRequired && !(draft.third ? draft.thirdAmount : draft.amount)) errors.push('Registra el importe mensual de quien aporta la solvencia; comprueba el mínimo indicado en el guion.');
      if (policy.economic && !draft.income) errors.push('Indica la situación económica o «No especifica».');
      if ((policy.economic || (policy.qualification === 'meta' && draft.metaDetails)) && draft.third && !draft.thirdIncome) errors.push('Indica la situación económica del tercero.');
      if (policy.minimumIncome) {
        const amount = Number(String(draft.amount).replace(',', '.'));
        if (!draft.amount) errors.push('Registra los ingresos mensuales del paciente; el mínimo de esta campaña es 1.200 €.');
        else if (amount < policy.minimumIncome) errors.push(draft.amountComparison === 'more' ? 'Confirma el importe: indicar «más de» una cantidad inferior no acredita el mínimo de 1.200 €.' : 'No cumple el mínimo obligatorio de 1.200 € mensuales. No agendar esta campaña.');
      }
      if (policy.asnef && !draft.asnef) errors.push('Registra la respuesta sobre ASNEF.');
      if (policy.economic || (policy.qualification === 'meta' && draft.metaDetails)) {
        if ([draft.amount, ...(draft.third ? [draft.thirdAmount] : [])].some(value => value && !/^\d+([.,]\d{1,2})?$/.test(value))) errors.push('Los importes deben ser números positivos, sin separador de miles.');
      }
    }
    return errors;
  }
  function effectiveContext(context, draft) {
    if (!context.policy.zenRoutes || context.treatment === 'reprogramacion') return context;
    const small = draft.document === 'DNI' && draft.pieces === 'small';
    const economic = draft.document === 'NIE' || (draft.document === 'DNI' && ['large','full'].includes(draft.pieces));
    return {...context, policy:{...context.policy, economic, asnef:small,
      criteria:{...context.policy.criteria,contextRequired:!small && !economic,
        incomeByDocument:{DNI:['Nómina','Autónomo','Jubilación','Pensión contributiva'],NIE:['Nómina','Autónomo']}}}};
  }
  function counter(draft, policy, reschedule) {
    const number = Number(draft.appointmentNumber);
    if (!Number.isInteger(number) || number < (reschedule ? 2 : 1)) return { text: 'Consulta el historial en HighLevel e indica el número de esta cita.', warning: '' };
    const used = number - 1;
    const limit = policy.maxReschedules;
    const text = `Cita nº ${number} · ${used === 0 ? 'Sin reprogramaciones' : `Reprogramación ${used}${limit == null ? '' : ' de ' + limit}`}`;
    let warning = limit == null ? 'Límite de reprogramaciones pendiente de confirmar para esta clínica.'
      : used > limit ? `Supera las ${limit} reprogramaciones permitidas. Consulta con el manager antes de agendar.` : '';
    if (policy.rescheduleCondition) warning = [warning, policy.rescheduleCondition].filter(Boolean).join(' ');
    return { text, warning };
  }

  // Solo texto visible; no se guarda información del paciente en el navegador.
  async function copyText(text, textarea) {
    try {
      if (root.navigator?.clipboard?.writeText) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* Archivos locales o permisos del portapapeles: usar selección. */ }
    if (!textarea) return false;
    textarea.focus(); textarea.select();
    try { return Boolean(root.document.execCommand('copy')); } catch (_) { return false; }
  }

  function mount({ document, rules, templates, onModeChange, readValue }) {
    const byId = id => document.getElementById(id);
    const form = byId('appointment-form');
    const fields = Array.from(form.querySelectorAll('[data-note-field]'));
    const parking = byId('note-form-content');
    const groups = { need: byId('note-need-row'), pieces: byId('note-pieces-row'), document: byId('note-document-row'),
      economic: byId('note-economic-fields'), asnef: byId('note-asnef-row'),
      meta: byId('note-meta-option'), clinic: byId('note-clinic-fields'), appointment: byId('note-appointment-block') };
    const today = () => new Date();
    const fillOptions = (id, values) => {
      for (const [value, label] of values) {
        const option = document.createElement('option'); option.value = value; option.textContent = label;
        byId(id).appendChild(option);
      }
    };
    fillOptions('note-day', Array.from({ length: 31 }, (_, i) => [String(i + 1).padStart(2, '0'), String(i + 1).padStart(2, '0')]));
    fillOptions('note-month', ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((name, i) => [String(i + 1).padStart(2, '0'), name]));
    fillOptions('note-hour', Array.from({ length: 13 }, (_, i) => [String(i + 8).padStart(2, '0'), String(i + 8).padStart(2, '0')]));
    fillOptions('note-minute', Array.from({ length: 12 }, (_, i) => [String(i * 5).padStart(2, '0'), String(i * 5).padStart(2, '0')]));
    let context = { clinic: null, treatment: '', policy: policyFor(null, '', rules, templates) };
    let draft = blankDraft();
    let revision = 0;
    let responsePanels = [];
    const policyMessages = {
      meta: 'Cualificación realizada en Meta. No repitas el cuestionario; registra solo los datos disponibles.',
      none: 'Este guion no solicita cualificación. No se requieren datos económicos para la nota.',
      document: 'Confirma el tipo de documentación. No se realiza cualificación económica.',
      operator: 'Registra las respuestas según los criterios de esta clínica. La nota no confirma financiación.',
      reschedule: 'No se vuelve a cualificar. La nota incluye únicamente la nueva fecha y hora.',
      clinic: 'Ardenne confirma la cita. Registra disponibilidad aproximada, inversión, forma de pago y valoración previa; no prometas una cita definitiva.'
    };
    function applyDraft() {
      for (const field of fields) {
        const value = draft[field.dataset.noteField];
        if (field.type === 'radio') field.checked = field.value === value;
        else if (field.type === 'checkbox') field.checked = Boolean(value);
        else field.value = value;
      }
    }
    function render() {
      const { clinic, treatment, policy } = effectiveContext(context, draft);
      const reschedule = treatment === 'reprogramacion';
      const enabled = Boolean(clinic && treatment);
      byId('call-tools').hidden = !enabled;
      byId('note-jump').hidden = !enabled;
      byId('app-main').setAttribute('data-layout', !clinic ? 'home' : enabled ? 'call' : 'clinic');
      byId('note-fields').disabled = !enabled;
      fields.forEach(field => { field.disabled = !enabled; });
      byId('note-today').disabled = !enabled;
      byId('note-tomorrow').disabled = !enabled;
      byId('note-jump').disabled = !enabled;
      byId('clinic-details').hidden = !clinic;
      byId('note-empty').hidden = enabled;
      byId('note-form-content').hidden = true;
      byId('note-context').textContent = clinic ? clinic.name : 'Selecciona una clínica y un tratamiento.';
      byId('note-policy').textContent = policyMessages[policy.qualification];
      if (policy.clinicConfirmsAppointment && reschedule) byId('note-policy').textContent = 'No se vuelve a cualificar. Registra la solicitud; Ardenne confirmará la nueva fecha y hora.';
      byId('note-title').textContent = policy.clinicConfirmsAppointment ? 'Solicitud a clínica' : 'Nota de cita';
      byId('note-new-mode').textContent = policy.clinicConfirmsAppointment ? 'Solicitud nueva' : 'Cita nueva';
      byId('note-date-legend').textContent = policy.clinicConfirmsAppointment ? 'Disponibilidad aproximada · fecha' : policy.appointmentTentative ? 'Fecha provisional' : 'Fecha de cita';
      byId('note-exact-appointment').hidden = Boolean(policy.clinicConfirmsAppointment);
      byId('note-availability-row').hidden = !policy.clinicConfirmsAppointment;
      byId('note-availability').required = Boolean(policy.clinicConfirmsAppointment);
      byId('note-new-fields').hidden = reschedule;
      byId('note-need-row').hidden = reschedule;
      byId('note-pieces-row').hidden = !policy.zenRoutes || reschedule;
      byId('note-need').required = Boolean(policy.needRequired && !reschedule);
      byId('note-need').setAttribute('aria-required', String(Boolean(policy.needRequired && !reschedule)));
      byId('note-need-optional').textContent = policy.needRequired ? '(obligatoria)' : '(opcional)';
      byId('note-amount-optional').textContent = policy.minimumIncome || policy.amountRequired ? '(importe mensual requerido)' : '(opcional)';
      byId('note-amount').required = Boolean(policy.minimumIncome && !reschedule);
      Array.from(byId('note-minute').children).forEach(option => { option.disabled = draft.hour === '20' && Number(option.value) > lastMinute(context, draft.date); });
      const meta = policy.qualification === 'meta';
      byId('note-meta-option').hidden = !meta;
      byId('note-document-row').hidden = !(policy.document || (meta && draft.metaDetails));
      byId('note-economic-fields').hidden = !(policy.economic || (meta && draft.metaDetails));
      byId('note-third-fields').hidden = !draft.third;
      byId('note-asnef-row').hidden = !policy.asnef;
      byId('note-clinic-fields').hidden = !policy.clinicConfirmsAppointment || reschedule;
      const criteria = criteriaFor(clinic, treatment, policy, readValue);
      byId('note-economic-criteria').textContent = criteria.economicText ? 'Criterios de esta clínica: ' + criteria.economicText : 'Criterios pendientes de confirmar con el manager.';
      const mark = (element, kind, value) => {
        const result = answerStatus(criteria, kind, value, draft.document);
        element.setAttribute('data-criterion', result.status);
        element.setAttribute('title', result.message);
        return result;
      };
      for (const field of fields.filter(field => field.type === 'radio')) {
        const result = mark(field, 'document', field.value);
        byId(field.id + '-label').textContent = field.value + (result.status === 'rejected' ? ' · No permitido' : result.status === 'review' ? ' · Revisar' : '');
      }
      for (const [id, kind] of [['note-income', 'income'], ['note-third-income', 'thirdIncome']]) {
        const select = byId(id);
        for (const option of Array.from(select.children)) {
          const value = option.value;
          // Fijar el valor antes de cambiar el texto: las opciones originales
          // sin atributo value heredan su texto y no deben copiar el aviso.
          option.value = value;
          const result = mark(option, kind, value);
          option.textContent = value ? value + (result.status === 'rejected' ? ' · No permitido' : result.status === 'review' ? ' · Revisar' : '') : 'Selecciona una respuesta';
        }
        mark(select, kind, draft[kind]);
      }
      for (const [id, kind] of [['note-document-warning', 'document'], ['note-income-warning', 'income'], ['note-third-warning', 'thirdIncome']]) {
        const result = mark(byId(id), kind, draft[kind]);
        byId(id).textContent = result.message; byId(id).hidden = !result.message;
      }
      for(const panel of responsePanels) {
        const node=byId(panel.id);
        if(!node) continue;
        let show=false;
        if(!reschedule && enabled) {
          if(panel.kind==='document') show=policy.document && answerStatus(criteria,'document',draft.document).status==='rejected';
          if(panel.kind==='income') show=policy.economic && !draft.third && answerStatus(criteria,'income',draft.income,draft.document).status==='rejected';
          if(panel.kind==='asnef') show=policy.asnef && draft.asnef==='indica que sí';
          if(panel.kind==='incomeOrAsnef') show=!draft.third && ((policy.asnef && draft.asnef==='indica que sí') || (policy.economic && answerStatus(criteria,'income',draft.income,draft.document).status==='rejected'));
          if(panel.kind==='incomeDni' || panel.kind==='incomeNie') show=policy.economic && !draft.third && draft.document===(panel.kind==='incomeDni'?'DNI':'NIE') && answerStatus(criteria,'income',draft.income,draft.document).status==='rejected';
          if(panel.kind==='minimumIncome') show=policy.economic && policy.minimumIncome && /^\d+([.,]\d{1,2})?$/.test(draft.amount) && Number(draft.amount.replace(',','.'))<policy.minimumIncome && draft.amountComparison!=='more';
        }
        node.hidden=!show;
      }
      byId('note-number').min = reschedule ? '2' : '1';
      byId('note-number-row').hidden = !reschedule;
      byId('note-policy').hidden = !enabled;
      byId('note-new-mode').disabled = !clinic;
      byId('note-reschedule-mode').disabled = !clinic;
      byId('note-new-mode').setAttribute('aria-pressed', String(!reschedule));
      byId('note-reschedule-mode').setAttribute('aria-pressed', String(reschedule));
      const count = counter(draft, policy, reschedule);
      byId('note-counter').textContent = count.text;
      byId('note-limit-warning').textContent = count.warning;
      byId('note-limit-warning').hidden = !reschedule || !count.warning;
      byId('note-preview').value = enabled ? buildNote(draft, context) : '';
      const errors = validate(draft, context);
      byId('note-validation').textContent = enabled ? errors.join(' ') : '';
      byId('note-copy').disabled = errors.length > 0;
    }
    form.addEventListener('submit', event => event.preventDefault());
    document.addEventListener('input', event => {
      const field = event.target;
      if (!field.dataset.noteField) return;
      if (!fields.includes(field) || (field.type === 'radio' && !field.checked)) return;
      draft[field.dataset.noteField] = field.type === 'checkbox' ? field.checked : field.value;
      if (['day', 'month'].includes(field.dataset.noteField)) draft.date = calendarDate(draft.day, draft.month, today());
      if (['hour', 'minute'].includes(field.dataset.noteField)) {
        if (draft.hour === '20' && Number(draft.minute) > lastMinute(context, draft.date)) { draft.minute = '00'; byId('note-minute').value = '00'; }
        draft.time = draft.hour && draft.minute ? `${draft.hour}:${draft.minute}` : '';
      }
      revision++;
      // Un dato que se deja de utilizar no reaparece al volver a activar la opción.
      if (field.dataset.noteField === 'third' && !draft.third) {
        Object.assign(draft, { thirdIncome: '', thirdAmount: '', thirdComparison: '', thirdDetail: '' });
        applyDraft();
      }
      if (field.dataset.noteField === 'metaDetails' && !draft.metaDetails) {
        const saved = { date: draft.date, time: draft.time, day: draft.day, month: draft.month, hour: draft.hour, minute: draft.minute, appointmentNumber: draft.appointmentNumber, need: draft.need };
        draft = { ...blankDraft(), ...saved }; applyDraft();
      }
      byId('note-copy-status').textContent = '';
      render();
    });
    byId('note-copy').addEventListener('click', async () => {
      if (validate(draft, context).length) return;
      const expectedRevision = revision;
      const ok = await copyText(buildNote(draft, context), byId('note-preview'));
      if (revision === expectedRevision) byId('note-copy-status').textContent = ok ? 'Nota copiada. Pégala en HighLevel.' : 'No se pudo copiar. La nota está seleccionada: usa Ctrl+C.';
    });
    byId('note-new-mode').addEventListener('click', () => onModeChange(false));
    byId('note-reschedule-mode').addEventListener('click', () => onModeChange(true));
    for (const [id, offset] of [['note-today', 0], ['note-tomorrow', 1]]) {
      byId(id).addEventListener('click', () => {
        const date = today(); date.setDate(date.getDate() + offset);
        draft.day = String(date.getDate()).padStart(2, '0');
        draft.month = String(date.getMonth() + 1).padStart(2, '0');
        draft.date = calendarDate(draft.day, draft.month, today());
        revision++; applyDraft(); byId('note-copy-status').textContent = ''; render();
        byId('note-hour').focus();
      });
    }
    function reset() {
      draft = blankDraft(context.treatment === 'reprogramacion'); revision++;
      draft.month = String(today().getMonth() + 1).padStart(2, '0');
      applyDraft(); byId('note-copy-status').textContent = ''; render();
    }
    applyDraft(); render();
    return {
      setContext(clinic, treatment) {
        responsePanels=[];
        // Rescatar los controles antes de reconstruir el guion conserva un único
        // formulario y evita perder referencias o duplicar los IDs.
        Object.values(groups).forEach(group => parking.appendChild(group));
        context = { clinic, treatment, policy: policyFor(clinic, treatment, rules, templates) };
        reset();
      },
      attachScript(steps) {
        responsePanels=steps.filter(s=>s.responseKind).map(s=>({id:`note-response-${s.index}`,kind:s.responseKind}));
        const targets = placements(steps, context.treatment === 'reprogramacion');
        if (context.policy.clinicConfirmsAppointment) targets.clinic = steps.find(step => /confirmar inversi[oó]n/i.test(step.title))?.index ?? targets.need;
        // Los datos opcionales de Meta quedan juntos tras el motivo de la llamada.
        if (context.policy.qualification === 'meta') targets.document = targets.economic = targets.meta;
        for (const [key, index] of Object.entries(targets)) {
          const policy = context.policy;
          if (key === 'meta' && policy.qualification !== 'meta') continue;
          if (key === 'document' && !policy.document && policy.qualification !== 'meta') continue;
          if (key === 'economic' && !policy.economic && policy.qualification !== 'meta') continue;
          if (key === 'asnef' && !policy.asnef && !policy.zenRoutes) continue;
          if (key === 'pieces' && !policy.zenRoutes) continue;
          const slot = byId(`note-slot-${index}`);
          if (slot) slot.appendChild(groups[key]);
        }
        render();
      },
      reset
    };
  }
  const api = { labels, validDate, validTime, calendarDate, placements, policyFor, criteriaFor, answerStatus, blankDraft, buildNote, validate, counter, copyText, mount, conditionalStep };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OmniAppointmentNotes = api;
})(typeof window !== 'undefined' ? window : globalThis);
