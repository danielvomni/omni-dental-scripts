// Actualización incremental. Los ficheros de datos originales se conservan.
// Fuente: Master, pestaña Horarios, revisada el 10/10/2026.
// Carranza A26:D65; Martínez Silva A1565:D1584; Cirium A1588:D1608.
// Decisiones del manager: ASNEF solo en rutas asignadas; simplificado sin oferta;
// Carranza implantes cualifica en Meta; los tres pilotos admiten 2 reprogramaciones.
const OMNI_APPOINTMENT_RULES = {
  carranza: {
    maxReschedules: 2,
    treatments: {
      implantes: { qualification: 'meta', document: false, economic: false, asnef: false,
        criteria: {
          documents: ['DNI', 'NIE', 'Pasaporte'], contributiveOnly: true,
          incomeByDocument: {
            DNI: ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva'],
            NIE: ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva'],
            Pasaporte: ['Cuenta bancaria o tarjeta']
          },
          thirdIncomes: ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva']
        }
      },
      ortodoncia: { qualification: 'document', document: true, economic: false, asnef: false },
      blanqueamiento: { qualification: 'document', document: true, economic: false, asnef: false }
    }
  },
  cirium: {
    maxReschedules: 2,
    treatments: { implantes: { qualification: 'none', document: false, economic: false, asnef: false } }
  },
  'martinez-silva': {
    maxReschedules: 2,
    treatments: { implantes: { qualification: 'operator', document: true, economic: true, asnef: false,
      criteria: {
        documents: ['DNI'], contributiveOnly: true,
        incomes: ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva'],
        thirdIncomes: ['Nómina', 'Autónomo', 'Jubilación', 'Pensión contributiva']
      }
    } }
  },
  // Asignación explícita en los criterios de las clínicas de la copia original.
  caredentjerez: { treatments: { implantes: { asnef: true } } },
  soniadent: { treatments: { implantes: { asnef: true } } },
  chroma: { treatments: { implantes: { criteria: {
    documents: ['DNI', 'NIE', 'Pasaporte'], conditionalDocument: 'exceptDNI',
    documentExceptionMessage: 'existe una excepción para pacientes portugueses; consulta el criterio de la clínica.'
  } } } }
};

(() => {
  const carranza = CLINICS_DATA.find(c => c.id === 'carranza');
  if (carranza) {
    carranza.promo = 'Implantes: 30% de descuento; rehabilitación completa, 1.000 € de descuento (equivalente al 30%). Ortodoncia: 30% de descuento y blanqueamiento gratuito al finalizar el tratamiento; ortodoncia invisible desde 65 €/mes y brackets desde 60 €/mes. Blanqueamiento: blanqueamiento + 2 jeringas por 99 €';
    carranza.financing = 'Implantes: sin intereses en 24 y 36 meses, primera cuota en noviembre. Ortodoncia: sin intereses, primera cuota en noviembre.';
    carranza.scriptOverrides = { ...carranza.scriptOverrides, blanqueamiento: 'blanqueamiento' };
    const schedules = CLINIC_SCHEDULES.carranza.byTreatment;
    for (const treatment of ['implantes', 'blanqueamiento']) {
      schedules[treatment].horarios.martes = '10:30h - 13:00h / 16:00h - 19:00h';
    }
    schedules.implantes.qualifDoc = 'DNI, NIE o Pasaporte';
    schedules.implantes.qualifEcon = 'Cualificación realizada en Meta. DNI/NIE: nómina, pensión contributiva, jubilados, terceros o autónomos. Pasaporte: cuenta bancaria o tarjeta de crédito, o terceros.';
    for (const treatment of ['ortodoncia', 'blanqueamiento']) {
      schedules[treatment].qualifDoc = 'Confirmar tipo de documentación';
      schedules[treatment].qualifEcon = 'No se cualifica económicamente';
    }
    schedules.implantes.financing = 'Sin intereses en 24 y 36 meses. Primera cuota en noviembre.';
    schedules.ortodoncia.financing = 'Sin intereses. Primera cuota en noviembre.';
    schedules.blanqueamiento.financing = 'Consultar condiciones en la Master';
  }

  const additions = [
    {
      id: 'cirium', name: 'Cirium Clínica Dental',
      address: 'C. Madrid, 22, 28690 Brunete, Madrid.', city: 'Brunete', ref: '',
      valuePoints: '', promo: 'Implantes unitarios desde 900 €. Facilidades de pago.',
      qualifDoc: 'No se aplican filtros', qualifEcon: 'No se aplican filtros',
      financing: 'Facilidades de pago', treatments: ['implantes'], econQualif: false,
      scriptOverrides: { implantes: 'simplificado' }
    },
    {
      id: 'martinez-silva', name: 'Clínica Dental Martínez Silva',
      address: 'Plaza Eduardo Barreiros, 12, B, 32003, Ourense.', city: 'Ourense', ref: '',
      valuePoints: 'implantólogo con 10 años de experiencia, carga inmediata dependiendo de la valoración del especialista y todo tipo de regeneración de hueso',
      promo: '10% de descuento en implantes unitarios y 15% a partir de dos implantes',
      qualifDoc: 'DNI',
      qualifEcon: 'Nómina, pensión contributiva (jubilados), terceros (avalistas con nómina, pensión o autónomos) y autónomos. No podemos citar pacientes con ayudas.',
      financing: 'Hasta 36 meses sin intereses', treatments: ['implantes'], econQualif: true,
      scriptOverrides: { implantes: 'implantes' }
    }
  ];
  for (const clinic of additions) {
    if (!CLINICS_DATA.some(c => c.id === clinic.id)) CLINICS_DATA.push(clinic);
  }
  CLINIC_SCHEDULES.cirium = {
    byTreatment: { implantes: { horarios: {
      martes: '10:00h - 13:20h / 16:00h - 19:20h',
      miercoles: '10:00h - 13:20h / 16:00h - 19:20h',
      jueves: '16:00h - 19:20h', viernes: '10:00h - 17:20h'
    }, duracionCita: '40 Min' } },
    ayudas: '', seguros: 'No aceptan seguros', recordatorio: 'NO',
    whatsapp: 'Subcuenta "WhatsApp"', agendamientoMismoDia: 'SI', agendamientoLargoPlazo: 'SI'
  };
  CLINIC_SCHEDULES['martinez-silva'] = {
    byTreatment: { implantes: { horarios: {
      lunes: '09:30h - 13:00h / 16:00h - 18:00h',
      martes: '09:30h - 13:30h / 16:00h - 19:00h',
      miercoles: '09:30h - 14:30h', jueves: '09:30h - 13:30h / 16:00h - 19:00h',
      viernes: '09:30h - 12:30h'
    }, duracionCita: '30 Min' } },
    ayudas: 'No podemos citar pacientes con ayudas.', seguros: '', recordatorio: 'SI',
    whatsapp: 'Subcuenta "WhatsApp 2"', agendamientoMismoDia: 'SI', agendamientoLargoPlazo: 'SI'
  };
})();
